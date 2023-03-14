<template>
  <client-only>
    <div class="popup-mask list_layout">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">11번가 상품 연동</div>
            <div class="popup_text_wrap">
              <div class="title f_bold">11번가 카테고리 선택</div>
              <ul class="list_wrap w_100">
                <li>
                  <div class="body category_select_wrap w_100">
                    <ul v-for="(arr, i) in Object.values(selectedCategoryDepthMap)" :key="i">
                      <template v-if="arr.length > 0">
                        <template v-for="category in arr">
                          <li :key="category.id" @click="selectCategory(category)">
                            <a :class="category.isChecked ? 'on' : ''">{{ category.name }}</a>
                          </li>
                        </template>
                      </template>
                    </ul>
                  </div>
                </li>
              </ul>
              <ul class="even_list_wrap m_t_20 i_b">
                <li>
                  <div class="title_text">11번가 상품정보 제공유형</div>
                  <div class="body_text">
                    <div class="select_wrap">
                      <select v-model="params.st11NotificationCode">
                        <option value="">선택</option>
                        <option v-for="code in notificationCodes" :value="code.code">{{ code.name }}</option>
                      </select>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title_text">11번가 미성년자 구매가능 여부</div>
                  <div class="body_text">
                    <div class="radio_wrap">
                      <input type="radio" v-model="params.isMinorsAllow" id="is_minors_allow_true" name="is_minors_allow" :value="true">
                      <label for="is_minors_allow_true">구매가능</label>
                      <input type="radio" v-model="params.isMinorsAllow" id="is_minors_allow_false" name="is_minors_allow" :value="false">
                      <label for="is_minors_allow_false">구매불가</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title_text">연동할 상품 원산지</div>
                  <div class="body_text">
                    <div class="select_wrap">
                      <select v-model="params.countryCode">
                        <option value="CN">중국</option>
                        <option value="US">미국</option>
                      </select>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title_text">발송템플릿</div>
                  <div class="body_text">
                    <div class="select_wrap">
                      <select v-model="params.deliveryTemplateId">
                        <option v-for="template in deliveryTemplates" :value="template.id">{{ template.name }}</option>
                      </select>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="clickLinkage">연동</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    categoryDepthMap: {},
    selectedCategoryDepthMap: {},
    notificationCodes: [],
    deliveryTemplates: [],
    params: {
      st11CategoryId: null,
      st11NotificationCode: '',
      isMinorsAllow: true,
      countryCode: 'CN',
      deliveryTemplateId: '931111',
    },
  }),
  async created() {
    await this.initCategories();
    this.notificationCodes = await this.getNotificationCodes();
    this.deliveryTemplates = await this.getDeliveryTemplates();
  },
  methods: {
    async initCategories() {
      const categories = await this.getCategories();
      const depthList = [...new Set(categories.map((v) => v.depth))].sort();
      depthList.forEach((depth) => {
        this.categoryDepthMap[depth] = categories.filter((v) => v.depth === depth);
      });

      // root 카테고리만 selectedCategoryDepthMap 에 할당
      const newCategoryDepthMap = {};
      for (let i = 0; i < depthList.length; i += 1) {
        const depth = depthList[i];
        if (i === 0) newCategoryDepthMap[depth] = [...this.categoryDepthMap[depth]];
        else newCategoryDepthMap[depth] = [];
      }
      this.selectedCategoryDepthMap = newCategoryDepthMap;
    },
    async selectCategory(category) {
      // isChecked 업데이트
      this.selectedCategoryDepthMap[category.depth].forEach((v) => {
        v.isChecked = v.id === category.id;
      });
      this.$forceUpdate();

      // 다음 depth 카테고리 셋팅
      const nextDepth = this.getNextDepth(category.depth);
      if (nextDepth) {
        const nextCategories = this.categoryDepthMap[nextDepth].filter((v) => v.parent_id === category.id);
        nextCategories.forEach((v) => {
          v.isChecked = false;
        });
        this.selectedCategoryDepthMap[nextDepth] = nextCategories;
      }
    },
    async getCategories() {
      const res = await this.$store.$axios.get('store_admin/product/st11/categories');
      return res.data.data.categories.filter((v) => v.depth !== '1');
    },
    async getNotificationCodes() {
      const res = await this.$store.$axios.get('store_admin/product/st11/notification_codes');
      return res.data.data.notification_codes;
    },
    async getDeliveryTemplates() {
      const res = await this.$store.$axios.get('store_admin/product/st11/delivery_templates');
      return res.data.data.delivery_templates;
    },
    getNextDepth(depth) {
      return Object.keys(this.categoryDepthMap).filter((v) => v > depth).shift();
    },
    clickLinkage() {
      const maxDepth = Math.max(...Object.keys(this.selectedCategoryDepthMap).map((v) => parseInt(v, 10)).filter((v) => this.selectedCategoryDepthMap[v.toString()].length > 0));
      const selectedCategory = this.selectedCategoryDepthMap[maxDepth.toString()].find((v) => v.isChecked);

      if (!selectedCategory) return this.$popup.showAlertPopup('카테고리를 최하위까지 선택해주세요.');
      if (!this.params.st11NotificationCode) return this.$popup.showAlertPopup('상품정보 제공유형을 선택해주세요.');
      if (!this.params.isMinorsAllow) return this.$popup.showAlertPopup('미성년자 구매가능 여부를 선택해주세요.');
      if (!this.params.countryCode) return this.$popup.showAlertPopup('상품 원산지를 선택해주세요.');
      if (!this.params.deliveryTemplateId) return this.$popup.showAlertPopup('발송템플릿을 선택해주세요.');
      this.params.st11CategoryId = selectedCategory.id;

      this.ok();
    },
  },
});
</script>
