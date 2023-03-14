<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">카테고리 선택</div>
            <div class="popup_text_wrap">
              <ul class="explain_wrap gray">
                <li>선택상품이 이동될 카테고리를 선택해주세요.</li>
              </ul>

              <ul class="list_wrap w_100">
                <li>
                  <div class="four_select_wrap">
                    <select v-model="selectedLevelCategories[1]" v-on:change="getMenu(selectedLevelCategories[1], 1)">
                      <option>선택</option>
                      <option v-for="category in levelCategories[1]" :value="category">{{category.name}}</option>
                    </select>
                    <select v-model="selectedLevelCategories[2]" v-on:change="getMenu(selectedLevelCategories[2], 2)">
                      <option>선택</option>
                      <option v-for="category in levelCategories[2]" :value="category">{{category.name}}</option>
                    </select>
                    <select v-model="selectedLevelCategories[3]" v-on:change="getMenu(selectedLevelCategories[3], 3)">
                      <option>선택</option>
                      <option v-for="category in levelCategories[3]" :value="category">{{category.name}}</option>
                    </select>
                    <select v-model="selectedLevelCategories[4]" v-on:change="setLastSelected()">
                      <option>선택</option>
                      <option v-for="category in levelCategories[4]" :value="category">{{category.name}}</option>
                    </select>
                  </div>
                </li>
              </ul>

            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">적용</button>
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
  props: {
    levelOne: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data: () => ({
    levelCategories: [null, [], [], [], []],
    selectedLevelCategories: [null, '선택', '선택', '선택', '선택'],
    params: {
      menuPath: [null, null, null, null, null],
      lastSelected: {},
    },
  }),
  async created() {
    const res = await this.$store.$axios.get('user/category/path', { path: null, level: 1 });
    Vue.set(this.levelCategories, 1, res.data.data.categories);
  },
  methods: {
    resetCategoryData(startLevel) {
      for (let l = startLevel; l < 5; l += 1) {
        this.params.menuPath[l] = null;
        this.levelCategories[l] = [];
        this.selectedLevelCategories[l] = '선택';
      }
    },
    async getMenu(category, currentLevel) {
      const nextLevel = currentLevel + 1;
      this.resetCategoryData(nextLevel);

      if (category.id) {
        this.params.menuPath[currentLevel] = category.id;
        this.params.lastSelected = category;
        const res = await this.$store.$axios.get(`user/category/path?path=${this.params.menuPath.filter((n) => n).join(',')}&level=${nextLevel}`);
        if (res.data.result === 'success') {
          Vue.set(this.levelCategories, nextLevel, res.data.data.categories);
        } else {
          Vue.set(this.levelCategories, nextLevel, []);
        }
      }
    },
    ok() {
      if (!this.params.lastSelected.id) {
        this.$popup.showAlertPopup('카테고리를 선택해주세요');
        return;
      }
      if (this.okCallback) this.okCallback(this.params);
    },
    async setLastSelected() {
      if (typeof this.selectedLevelCategories[4] === 'object') {
        this.params.lastSelected = this.selectedLevelCategories[4];
      }
    },
  },
});
</script>
