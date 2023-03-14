<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container width_xl">
          <!-- 미지정 상품 추가 팝업 -->
          <div class="popup_wrap overflow_hidden">
            <div class="popup_title">미지정 상품 추가</div>
            <ul class="price_group_list overflow_scroll">
              <li>
                <div class="page_title">상품검색</div>
                <div class="middle_but_wrap m_b_10">
                  <a :class="searchType === 'code' ? 'on' : 'line_btn'" @click="clickSearchType('code')">상품코드 검색</a>
<!--                  <a :class="searchType === 'name' ? 'on' : 'line_btn'" @click="clickSearchType('name')">상품명 검색</a>-->
                </div>
                <div class="search_box">
                  <ul>
                    <li>
                      <div class="text">선택된 카테고리</div>
                      <div class="body">{{ category }}</div>
                    </li>
                    <li>
                      <div class="text">그룹지정 여부</div>
                      <div class="body">
                        <div class="checkbox_wrap">
                          <input type="checkbox" id="noPriceGroup" class="border_none" disabled checked>
                          <label for="noPriceGroup">그룹 미지정</label>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div v-if="searchType === 'code'" class="text">상품코드 검색</div>
                      <div v-else-if="searchType === 'name'" class="text">상품 검색</div>
                      <div class="body">
                        <textarea v-if="searchType === 'code'" type="text" v-model="productIds" placeholder="엔터(Enter)로 구분하여 다중 검색"></textarea>
                        <input v-else-if="searchType === 'name'" type="text" v-model="productName" placeholder="상품명을 입력해주세요.">
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="middle_but_wrap m_b_20 text_center">
                  <a @click="search">상품검색</a>
                </div>
                <ul class="table_wrap">
                  <li class="page_title">
                    <div class="pull-left">
                      <div>조회결과: <em class="color_main_01">{{ this.productList.length | comma }}</em></div>
                    </div>
                    <div class="pull-right">
                      <div class="middle_but_wrap">
                        <a class="line_btn" @click="addCheckedProduct">선택 상품 리스트 추가</a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="table_scroll_s">
                      <table>
                        <colgroup>
                          <col width="40">
                          <col>
                        </colgroup>
                        <thead>
                        <tr>
                          <th>
                            <div class="only_checkbox_wrap">
                              <input type="checkbox" id="productCheckAll" @change="checkAll($event,'product')" :checked="this.productList.length > 0 && this.productList.length === checkedProductIds.length">
                              <label for="productCheckAll"></label>
                            </div>
                          </th>
                          <th>상품정보</th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-if="this.productList && this.productList.length > 0">
                          <tr v-for="(product, i) in this.productList" :key="product.id">
                            <td>
                              <div class="only_checkbox_wrap">
                                <input type="checkbox" :id="`checkedProduct${product.id}`" :value="product.id" v-model="checkedProductIds">
                                <label :for="`checkedProduct${product.id}`"></label>
                              </div>
                            </td>
                            <td>
                              <div class="price_comparison_wrap">
                                <div class="img_wrap">
                                  <DefaultImage :imageUrl="product.main_image"/>
                                </div>
                                <div class="text_wrap text-left">
                                  <div>
                                    <span><em>그룹번호 :</em> <em class="color_y">미지정</em></span>
                                  </div>
                                  <div><em>상품코드 :</em> {{ product.id }}</div>
                                  <div><em>상품명 :</em> {{ product.name }}</div>
                                  <div><em>카테고리 :</em> {{ product.category }}</div>
                                  <div>
                                    <em>할인 적용가 :</em>
                                    <span v-if="product.discount_price && product.discount_price > 0">{{product.discount_price | comma }}</span>
                                    <span v-else-if="product.price && product.price > 0">{{product.price | comma }}</span>
                                    <span v-else>-</span>
                                  </div>
                                  <div><em>매장명 :</em> {{ product.store_name }}</div>
                                </div>
                                <div class="text-right">
                                  <div class="square_but_wrap">
                                    <a class="line_but" @click="add(product, i)">추가</a>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </template>
                        <tr v-else>
                          <td colspan="3">조회된 상품내역이 존재하지 않습니다.</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </li>
<!--                  <infinite-loading @infinite="infiniteHandler" spinner="spiral">-->
<!--                    <div slot="no-more"></div>-->
<!--                    <div slot="no-results"></div>-->
<!--                    <div slot="error" slot-scope="{ trigger }">-->
<!--                      상품을 불러오는데 오류가 발생했습니다.-->
<!--                      <a href="javascript:" @click="trigger">다시 불러오기</a>-->
<!--                    </div>-->
<!--                  </infinite-loading>-->
                </ul>
              </li>
              <li>
                <div class="page_title">가격비교 그룹 추가 예정 리스트</div>
                <ul class="table_wrap">
                  <li class="page_title">
                    <div class="pull-left">
                      <div>리스트 항목 : <em class="color_main_01">{{ this.params.addProductList.length }}</em></div>
                    </div>
                    <div class="pull-right">
                      <div class="middle_but_wrap">
                        <a class="red_line_but" @click="removeSelectedProduct">선택 상품 리스트 삭제</a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="table_scroll_s">
                      <table>
                        <colgroup>
                          <col width="40">
                          <col>
                        </colgroup>
                        <thead>
                        <tr>
                          <th>
                            <div class="only_checkbox_wrap">
                              <input type="checkbox" id="addProductCheckAll" @change="checkAll($event,'addProduct')" :checked="this.params.addProductList.length > 0 && this.params.addProductList.length === checkedAddProductIds.length">
                              <label for="addProductCheckAll"></label>
                            </div>
                          </th>
                          <th>상품정보</th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-if="this.params.addProductList && this.params.addProductList.length > 0">
                          <tr v-for="(addProduct, i) in this.params.addProductList" :key="addProduct.id">
                            <td>
                              <div class="only_checkbox_wrap">
                                <input type="checkbox" :id="`selectedAddProduct${addProduct.id}`" :value="addProduct.id" v-model="checkedAddProductIds">
                                <label :for="`selectedAddProduct${addProduct.id}`"></label>
                              </div>
                            </td>
                            <td>
                              <div class="price_comparison_wrap">
                                <div class="img_wrap">
                                  <DefaultImage :imageUrl="addProduct.main_image"/>
                                </div>
                                <div class="text_wrap text-left">
                                  <div>
                                    <span><em>그룹번호 :</em> <em class="color_y">미지정</em></span>
                                  </div>
                                  <div><em>상품코드 :</em> {{ addProduct.id }}</div>
                                  <div><em>상품명 :</em> {{ addProduct.name }}</div>
                                  <div><em>카테고리 :</em> {{ addProduct.category }}</div>
                                  <div>
                                    <em>할인 적용가 :</em>
                                    <span v-if="addProduct.discount_price && addProduct.discount_price > 0">{{addProduct.discount_price | comma}}</span>
                                    <span v-else-if="addProduct.price && addProduct.price > 0">{{addProduct.price | comma }}</span>
                                    <span v-else>-</span>
                                  </div>
                                </div>
                                <div class="text-right">
                                  <div class="square_but_wrap">
                                    <a class="red_line_but" @click="remove(addProduct, i)">삭제</a>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </template>
                        <tr v-else>
                          <td colspan="3">가격비교 그룹에 추가할 상품이 존재하지 않습니다.</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="popup_btn_wrap text-center">
              <button class="line_btn" @click="cancel">취소</button>
              <button @click="ok">리스트 상품 가격비교 그룹에 추가 ({{this.params.addProductList.length}}건)</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

const prefix = 'super_admin/product/price_group/new';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    category: {
      type: String,
      default: '',
    },
    categoryId: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    searchType: 'code',
    params: {
      addProductList: [],
    },
    query: {
      category_id: '',
      product_ids: [],
      product_name: '',
      cursor: null,
    },
    productList: [],
    checkedProductIds: [],
    checkedAddProductIds: [],
    productIds: [],
    productName: '',
    scroll_state: null,
    isRequesting: false,
  }),
  computed: {
    ...mapGetters({
      products: `${prefix}/products`,
      nextCursor: `${prefix}/nextCursor`,
    }),
  },
  methods: {
    // async resetInfiniteScroll() {
    //   this.productList = [];
    //   this.isRequesting = false;
    //   await this.$store.dispatch(`${prefix}/initNextCursor`);
    //   this.query.cursor = this.nextCursor;
    //   if (this.scroll_state) this.scroll_state.reset();
    // },
    clickSearchType(searchType) {
      this.searchType = searchType;
      if (this.searchType === 'code') this.query.product_name = '';
      else if (this.searchType === 'name') this.query.product_ids = [];
    },
    async search() {
      this.query.category_id = this.categoryId;
      if (this.searchType === 'code') {
        this.query.product_ids = this.productIds;
        this.query.product_name = '';
      } else if (this.searchType === 'name') {
        this.query.product_name = this.productName;
        this.query.product_ids = [];
      }
      if (this.query.product_ids.length <= 0) {
        this.$popup.showAlertPopup('상품코드를 입력해주세요.');
        // await this.resetInfiniteScroll();
      } else {
        await this.$store.dispatch(`${prefix}/getNoPriceGroups`, this.query);
        // this.scroll_state.complete();
        this.productList = this.products;
      }
    },
    // async infiniteHandler($state) {
    //   if (this.query.product_ids.length <= 0) {
    //     this.query.category_id = this.categoryId;
    //     this.query.cursor = this.nextCursor;
    //     this.scroll_state = $state;
    //     if (this.nextCursor === '0' || this.nextCursor === 'None') return $state.complete(); // 다음 페이지 없음
    //     if (this.isRequesting) return;
    //     this.isRequesting = true;
    //     await this.$store.dispatch(`${prefix}/getNoPriceGroups`, this.query);
    //     if (!this.products || this.products.length <= 0) return $state.complete();
    //     this.productList.push(...this.products);
    //     this.isRequesting = false;
    //     $state.loaded();
    //   }
    // },
    add(product, i) {
      this.productList.splice(i, 1);
      if (!this.params.addProductList.find((ap) => ap.id === product.id)) this.params.addProductList.push(product);
    },
    remove(product, i) {
      this.params.addProductList.splice(i, 1);
      if (!this.productList.find((p) => p.id === product.id)) this.productList.push(product);
    },
    checkAll(e, type) {
      if (type === 'product') {
        if (e.target.checked) this.checkedProductIds = this.productList.map((p) => p.id);
        else this.checkedProductIds = [];
      } else if (type === 'addProduct') {
        if (e.target.checked) this.checkedAddProductIds = this.params.addProductList.map((p) => p.id);
        else this.checkedAddProductIds = [];
      }
    },
    removeSelectedProduct() {
      const productHash = {};
      this.productList.forEach((p) => {
        productHash[p.id] = p;
      });
      this.params.addProductList.filter((ap) => this.checkedAddProductIds.indexOf(ap.id) > -1).forEach((ap) => {
        if (!productHash[ap.id]) this.productList.push(ap);
      });
      this.params.addProductList = this.params.addProductList.filter((ap) => this.checkedAddProductIds.indexOf(ap.id) === -1);
      this.checkedAddProductIds = [];
    },
    addCheckedProduct() {
      const addProductHash = {};
      this.params.addProductList.forEach((ap) => {
        addProductHash[ap.id] = ap;
      });
      this.productList.filter((p) => this.checkedProductIds.indexOf(p.id) > -1).forEach((p) => {
        if (!addProductHash[p.id]) this.params.addProductList.push(p);
      });
      this.productList = this.productList.filter((p) => this.checkedProductIds.indexOf(p.id) === -1);
      this.checkedProductIds = [];
    },
    cancel() {
      // this.resetInfiniteScroll();
      this.$destroy();
    },
  },
});
</script>
