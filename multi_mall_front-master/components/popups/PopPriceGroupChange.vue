<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center">기존 가격비교 그룹으로 추가</div>
            <div class="popup_text_wrap" style="height: 400px">
              <ul class="list_wrap w_100">
                <li>
                  <div class="title">대상 카테고리</div>
                  <div class="body">{{categoryPaths.join(' > ')}}</div>
                </li>
                <li>
                  <div class="select_wrap">
                    <vue-select
                      v-model="selectedProductPriceGroup"
                      label="price_group"
                      :options="productPriceGroups"
                      @search="onSearch"
                      :filterable="false">
                      <template slot="no-options">
                        조회가 되지 않았습니다.
                      </template>
                      <template slot="option" slot-scope="ppg">
                        <div>{{ ppg.id }}</div>
                      </template>
                      <template slot="selected-option" slot-scope="ppg">
                        <div>{{ ppg.id }}</div>
                      </template>
                    </vue-select>
                  </div>
                </li>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="move">이동</button>
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
    categoryId: {
      type: String,
      default: null,
    },
    productIds: {
      type: Array,
      default: [],
    },
    moveCallback: {
      type: Function,
      default: null,
    },
  },
  data: () => ({
    categoryPaths: [],
    selectedProductPriceGroup: null,
    productPriceGroups: [],
  }),
  async created() {
    if (this.categoryId) {
      const res = await this.$store.$axios.get(`super_admin/product/category/${this.categoryId}`);
      if (res.data.result === 'success') {
        this.categoryPaths = res.data.data.category.path;
      }
    }
  },
  methods: {
    async onSearch(search, loading) {
      if (search.length > 0) {
        loading(true);
        const res = await this.$store.$axios.get('super_admin/product/price_group/id_search', {
          params: {
            id: search,
            category_id: this.categoryId,
          },
        });
        const json = res.data;
        if (json.result === 'success') {
          this.productPriceGroups = json.data.productPriceGroups;
        }
        loading(false);
      }
    },
    async move() {
      if (this.moveCallback) {
        if (this.selectedProductPriceGroup) {
          this.params.productPriceGroupId = this.selectedProductPriceGroup.id;
        }
        this.moveCallback(this.params);
      }
    },
  },
});
</script>
