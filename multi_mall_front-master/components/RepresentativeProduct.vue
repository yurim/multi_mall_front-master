<template>
  <div class="border_b7 bg_white">
    <search-form
      :onSearch="onSearch"
      :onReset="onReset"
    >
      <ul class="search_wrap box_shadow_none w_100">
        <li>
          <div class="title">상세검색</div>
          <div class="body">
            <div class="select_date_wrap">
              <search-select-input
                ref="searchKeyword"
                :classify="'keyword'"
                :items="[
                  { text: '상품명', value: 'name' },
                  ]"
                :placeholder="'내용을 입력해주세요.'"
              ></search-select-input>
            </div>
          </div>
        </li>
      </ul>
    </search-form>

    <div class="d_ib_100 page_title">
      <div class="pull-left">조회결과 <span>(총 {{ totalCount }}개)</span></div>
      <div class="square_but_wrap pull-right">
        <a v-on:click="selectedAddRepresentProduct">선택상품 대표상품목록에 추가</a>
      </div>
    </div>

    <div class="d_ib_100 p_20">
      <data-table
        ref="dataTable"
        :loading="loading"
        :headers="headers"
        :items="products"
        :total="totalCount"
        :onTableOption="onTableOption"
        selectType="multi"
        :defaultPageSize="pageSize"
        :showPageSize="false"
      >
        <template v-slot:body="{item}">
          <td>
            <span class="thumbnail_wrap">
              <img alt="기본 이미지" :src="item.main_image">
            </span>
          </td>
          <td><span class="text">{{ item.name }}</span></td>
          <td><span class="text">{{ item.discount_price ? item.discount_price : item.price | comma }}</span></td>
          <td>
            <span class="square_but_wrap">
              <a v-on:click="routeProductDetail(item.id)" class="line_but">링크</a>
            </span>
          </td>
        </template>
      </data-table>
    </div>

    <div class="d_ib_100">
      <div class="d_ib_100 page_title">
        <div class="pull-left">현재 적용 상품 <span>(최대 3개까지 적용가능)</span></div>
      </div>

      <div class="d_ib_100 p_20">
        <table>
          <thead>
          <tr>
            <th>상품이미지</th>
            <th>상품명</th>
            <th>할인적용가</th>
            <th>제외</th>
          </tr>
          </thead>
          <tbody v-if="representProduct.length > 0">
          <tr v-for="(item, i) in representProduct" :key="`product_${i}`">
            <td>
              <span class="thumbnail_wrap">
                <img alt="기본 이미지" :src="item.main_image">
              </span>
            </td>
            <td><span class="text">{{ item.name }}</span></td>
            <td><span class="text">{{ item.discount_price ? item.discount_price : item.price | comma }}</span></td>
            <td>
              <span class="square_but_wrap">
                <a class="line_but" v-on:click="deleteRepresentProduct(i)">제외</a>
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="but_wrap text-center m_b_40">
      <a v-on:click="applyRepresentProduct">적용</a>
    </div>

  </div>
</template>
<script>
export default {
  name: 'RepresentativeProduct',
  props: {
    selectedRepresentProductCallback: {
      type: Function,
      default() {
        return null;
      },
    },
    storeId: {
      type: Number,
      default: null,
    },
    isSuper: {
      type: Boolean,
      default: false,
    },
    appliedRepresentProductArr: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    loading: false,
    headers: [
      { text: '이미지', value: 'main_image', sortable: false },
      { text: '상품명', value: 'name', sortable: false },
      { text: '할인적용가', value: 'discount_price', sortable: false },
      { text: '상품보기', value: '', sortable: false },
    ],
    products: [],
    totalCount: 0,
    pageSize: 5,
    representProduct: [],
    productMaxCount: 3,
    url: '',
  }),
  async created() {
    if (this.isSuper) this.url = 'super_admin/product';
    else this.url = 'store_admin/product';

    const query = { ...this.$route.query };
    query.page_size = this.pageSize;
    query.store_id = this.storeId;
    const res = await this.$axios.get(this.url, { params: query });
    this.products = res.data.data.products;
    this.totalCount = res.data.data.totalCount;
    this.init();
  },
  methods: {
    init() {
      if (this.appliedRepresentProductArr.length > 0) {
        this.representProduct = this.appliedRepresentProductArr;
        this.appliedRepresentProductArr.forEach((appliedProduct) => {
          this.$refs.dataTable.items.forEach((data) => {
            if (data.id === appliedProduct._id) this.$refs.dataTable._data.selected.push(appliedProduct);
          });
        });
        console.log(this.$refs.dataTable);
      }
    },
    async getData(query) {
      this.loading = true;
      query.page_size = this.pageSize;
      query.store_id = this.storeId;
      const res = await this.$axios.get(this.url, { params: query });
      this.products = res.data.data.products;
      this.totalCount = res.data.data.totalCount;
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
    },
    selectedAddRepresentProduct() {
      const selectedProducts = this.$refs.dataTable.getSelectedItems();
      if (selectedProducts.length <= 0) return this.$popup.showAlertPopup('하나 이상의 상품을 선택해주세요.');
      const newProducts = [...this.representProduct];
      selectedProducts.forEach((v) => {
        if (!newProducts.find((p) => p.id === v.id)) newProducts.push(JSON.parse(JSON.stringify(v)));
      });
      if (newProducts.length > this.productMaxCount) return this.$popup.showAlertPopup(`대표상품은 최대 ${this.productMaxCount}개까지 지정할 수 있습니다.`);
      this.representProduct = newProducts;
    },
    deleteRepresentProduct(idx) {
      this.representProduct.splice(idx, 1);
    },
    routeProductDetail(idx) {
      this.$router.push({
        name: 'super_admin-product',
        params: {
          id: idx,
        },
      });
    },
    applyRepresentProduct() {
      this.selectedRepresentProductCallback(this.representProduct);
    },
  },
};
</script>
