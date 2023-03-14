<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container width_l">

          <div class="popup_wrap">
            <div class="popup_title text-center">삭제 상품 조회</div>
              <div class="content_box_wrap">
                <div class="col_wrap">
                  <div class="col_three">
                    <search-test></search-test>

                      <search-form-pop :onSearch="onSearch">
                        <div class="form_wrap">
                          <ul class="search_wrap">
                            <li>
                              <div class="title">상세검색</div>
                              <div class="body">
                                <search-select-input
                                  ref="searchKeyword"
                                  :classify="'keyword'"
                                  :items="[
                          { text: '상품코드', value: 'id'},
                          { text: '상품명', value: 'name', isChecked: false },
                        ]"
                                  :placeholder="'내용을 입력해주세요.'"
                                ></search-select-input>
                              </div>
                            </li>

                            <li>
                              <div class="title">등록기간</div>
                              <div class="body">
                                <div class="select_date_wrap">
                                  <search-date-picker
                                    ref="searchDatePicker"
                                    periodType="month"
                                  ></search-date-picker>
                                </div>
                              </div>
                            </li>

                          </ul>
                        </div>
                      </search-form-pop>

                        <ul class="table_wrap">
                          <li>
                            <pop-data-table
                              ref="dataTable"
                              :headers="headers"
                              :items="products"
                              :total="totalCount"
                              :onTableOption="onTableOption"
                              selectType="multi"
                              :defaultPage="1"
                              :defaultPageSize=pageSize
                            >
                              <template v-slot:body="{ item }">
                                <td>
                                  <span class="text">{{
                                    item.created_at | date
                                    }}</span>
                                </td>
                                <td>
                                  <span class="text">{{ item.id }}</span>
                                </td>
                                <td>
                                 <span class="thumbnail_wrap">
                                 <DefaultImage :imageUrl="item.main_image"/>
                                 </span>
                                </td>
                                <td>
                                  <span class="text">{{ item.category }}</span>
                                </td>
                                <td>
                                  <span class="text">{{ item.name }}</span>
                                </td>
                              </template>
                            </pop-data-table>
                          </li>
                        </ul>

                  </div>
                </div>
              </div>
            <div class="popup_btn_wrap text-center">
              <button @click="recoverSelected" class="">선택상품 복구</button>
              <button @click="cancel" class="line_btn">닫기</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
// eslint-disable-next-line import/no-cycle
import Popup from './popup';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    page: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 50,
    },
    totalCount: {
      type: Number,
      default: 0,
    },
    products: {
      type: Array,
      default: [],
    },
    prefix: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    headers: [
      { text: '등록일', align: 'start', value: 'created_at' },
      { text: '상품코드', value: 'id', sortable: false },
      { text: '상품이미지', value: 'main_image', sortable: false },
      { text: '카테고리', value: 'category', sortable: false },
      { text: '상품명', value: 'name', sortable: true },
    ],
    targets: [],
    params: {},
    currentQuery: {},
  }),
  mounted() {
  },
  methods: {
    async onTableOption(query) {
      const res = await this.$store.dispatch(`${this.prefix}/getDeletedProducts`, { ...query, ...this.currentQuery });
      this.products = res.data.products;
    },
    async onSearch(query) {
      const res = await this.$store.dispatch(`${this.prefix}/getDeletedProducts`, query);
      this.products = res.data.products;
      this.totalCount = res.data.totalCount;
      this.currentQuery = query;
    },
    recoverSelected() {
      const requestParams = {
        product_ids: this.$refs.dataTable.getSelectedItems().map((item) => item.id),
      };

      if (requestParams.product_ids.length > 0) {
        const that = this;
        new Popup.Confirm({
          propsData: {
            title: '선택한 상품들을 복구하시겠습니까?',
            okCallback: async (inParams) => {
              await that.$createLoading(async () => {
                const recoverResult = await that.$store.dispatch(`${this.prefix}/recoverProducts`, requestParams);
                if (recoverResult.result === 'success') {
                  that.$popup.showAlertPopup('선택한 상품이 복구되었습니다.');
                } else that.$popup.showAlertPopup(that.result.message);
                inParams.$destroy();
                this.ok();
                this.$destroy();
              });
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('복구할 상품을 선택해주세요.');
      }
    },
  },
});
</script>
