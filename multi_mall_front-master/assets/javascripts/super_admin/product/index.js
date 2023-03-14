import _ from 'lodash';
import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import ExcelDownload from '@/components/ExcelDownload';
import util from '@/assets/javascripts/util';

const prefix = 'super_admin/product';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '등록일', align: 'start', value: 'created_at', sortable: false },
      { text: '상품코드', value: 'id', sortable: false },
      { text: '상품구분', value: 'target', sortable: false },
      { text: '가격비교 그룹', value: 'price_group', sortable: false },
      { text: '상품이미지', value: 'main_image', sortable: false },
      { text: '상품명', value: 'name', sortable: false },
      { text: '매장명', value: 'store', sortable: false },
      { text: '카테고리', value: 'category', sortable: false },
      { text: '판매상태 설정', value: 'is_sale', sortable: false },
      { text: '전시상태 설정', value: 'is_listed', sortable: false },
      { text: '중복구분', value: 'is_duplicated', sortable: false },
      { text: '몰리판매가', value: 'price', sortable: false },
      { text: '몰리 할인판매가', value: 'discount_price', sortable: false },
      { text: '할인유형', value: 'discount_type', sortable: false },
      { text: '판매수량', value: 'sale_count', sortable: false },
      { text: '찜수', value: 'like_count', sortable: false },
      { text: '상품제재', value: 'is_blocked', sortable: false },
      { text: '상품보기', value: 'detail_url', sortable: false },
      { text: '어필리에이트', value: 'affiliate_url', sortable: false },
    ],
    targets: [],
    excelDownloadTypes: [
      { key: '', text: '엑셀 양식 선택' },
      { key: 'molly', text: '몰리 양식' },
      { key: 'wmf', text: '위메프 양식' },
      { key: 'facebook', text: '페이스북 양식' },
      // { key: 'tmon', text: '티몬 양식' }, // 티몬 보류
      // TODO 주석 풀기
      // { key: 'naver', text: '네이버 엑셀' },
      // { key: 'naver_img', text: '네이버 전용 이미지' },
      // { key: 'url', text: 'URL 확인용 엑셀' },
    ],
    targetExcelDownloadType: '',
    searchType: 'normal',
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getProductsCount`);
    await store.dispatch(`${prefix}/getProducts`, query);
    await store.dispatch('common/getCodes', ['target']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      productsCount: `${prefix}/productsCount`,
      products: `${prefix}/products`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      result: `${prefix}/result`,
      count: `${prefix}/count`,
      hitCount: `${prefix}/hitCount`,
    }),
  },
  created() {
    this.init();
    this.initProductPrice();
  },
  methods: {
    init() {
      const targetList = [];
      const targetLength = this.codesArray('target').length;
      for (let i = 0; i < targetLength; i += 1) {
        const item = this.codesArray('target')[i];
        targetList.push({ text: item.value, value: item.key, isChecked: true });
      }
      this.targets = targetList;
      const { query } = this.$route;
      if (query.search_type) {
        this.searchType = query.search_type;
      }
    },
    initProductPrice() {
      this.products.forEach((v) => {
        v.price += '';
        v.price = v.price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (v.discount_price) {
          v.discount_price += '';
          v.discount_price = v.discount_price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      });
    },
    async getData(query) {
      if (query.keyword) query.keyword = query.keyword.trim();

      if (query.product_ids) {
        // 스플릿, 트림, null 제거
        query.product_ids = query.product_ids.split('\n').map((v) => v.trim()).filter(Boolean);
        // 중복 제거
        query.product_ids = Array.from(new Set(query.product_ids));
      }
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getProducts`, query);
      await this.initProductPrice();
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async onSearch(query) {
      // TODO 이전에 검색된 query 필요
      // TODO 페이지 리셋 필요
      let isValid = true;
      // if (query.keyword && query.keyword_type) {
      //   if (query.keyword_type === 'id' && !util.checkMongoDBObjectId(query.keyword)) {
      //     this.$popup.showAlertPopup('상세검색에서 입력한 상품코드가 올바르지 않습니다. 다시 입력해주세요.');
      //     query.keyword = '';
      //     query.keyword_type = '';
      //     await this.$router.push({ query });
      //     isValid = false;
      //   }
      // }
      // util.checkMongoDBObjectId();

      if (this.searchType === 'name' && query.product_name.length < 2) {
        this.$popup.showAlertPopup('검색어를 2글자 이상 입력해주세요.');
        return;
      }
      if (query.product_ids) {
        query.product_ids.split('\n').forEach((productId) => {
          if (!util.checkMongoDBObjectId(productId)) {
            isValid = false;
          }
        });

        if (!isValid) {
          this.$popup.showAlertPopup('잘못된 상품코드가 존재합니다.');
          query.product_ids = '';
          await this.$router.push({ query });
        }
      }

      if (isValid) {
        query.search_type = this.searchType;
        await this.$router.push({ query });
        await this.getData(query);
      }
    },
    async onReset(query) {
      await this.getData(query);
    },
    async refresh() {
      const query = { ...this.$route.query };
      await this.getData(query);
    },
    downloadExcel() {
      if (!this.targetExcelDownloadType) return this.$popup.showAlertPopup('엑셀 양식을 선택해주세요.');

      const that = this;
      new Popup.ExcelDownload({
        propsData: {
          totalCount: that.totalCount,
          okCallback(params) {
            const query = {
              ...that.$route.query,
            };

            query.page_size = params.pageSize;
            query.page = params.page;
            query.download_type = that.targetExcelDownloadType;

            new ExcelDownload({
              propsData: {
                href: `${prefix}/download_excel`,
                params: query,
                $axios: this.$store.$axios,
              },
            }).$mount();
            params.$destroy();
          },
        },
      }).$mount();
    },
    async selectDownloadExcel() {
      if (!this.targetExcelDownloadType) return this.$popup.showAlertPopup('엑셀 양식을 선택해주세요.');
      const ids = this.$refs.dataTable.getSelectedItems().map((item) => item.id);
      if (ids.length > 200) {
        this.$popup.showAlertPopup('200개 이하의 항목만 다운로드할 수 있습니다.');
        // 테스트 환경에서 1000건 까지 GET 요청 가능한 것으로 확인 (nginx 에서는 확인 필요)
        // 1500건은 서버 에러, 2000건 이상은 브라우저&서버 모두 에러
        return;
      }
      const params = {
        product_ids: ids,
        download_type: this.targetExcelDownloadType,
      };
      if (ids.length > 0) {
        new ExcelDownload({
          propsData: {
            href: `${prefix}/download_excel`,
            params,
            $axios: this.$store.$axios,
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('엑셀다운로드 할 상품을 선택해주세요.');
      }
    },
    isSaleTrue() {
      this.patchProductsStatus('is_sale', true, ['판매중', '판매']);
    },
    isSaleFalse() {
      this.patchProductsStatus('is_sale', false, ['판매중지', '판매']);
    },
    isListedTrue() {
      this.patchProductsStatus('is_listed', true, ['전시중', '전시']);
    },
    isListedFalse() {
      this.patchProductsStatus('is_listed', false, ['전시중지', '전시']);
    },
    selectedBlocked() {
      this.patchProductsBlockStatus();
    },
    patchProductsBlockStatus() {
      const productIds = this.$refs.dataTable.getSelectedItems().map((item) => item.id);
      if (productIds && productIds.length > 0) {
        new Popup.Reason({
          propsData: {
            title: '선택 상품들을 제재하시겠습니까?',
            okCallback: async (params) => {
              if (params.reason) {
                await this.$store.dispatch(`${prefix}/patchProductsBlock`, {
                  product_ids: productIds,
                  is_blocked: true,
                  reason: params.reason,
                });
                if (this.result.result === 'success') {
                  this.$popup.showAlertPopup('선택 상품들이 제재되었습니다.');
                  this.$refs.dataTable.getSelectedItems().forEach((item) => {
                    item.is_blocked = true;
                  });
                } else this.$popup.showAlertPopup(this.result.message);
                params.$destroy();
              } else this.$popup.showAlertPopup('제재사유를 입력해주세요.');
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('제재할 상품들을 선택해주세요.');
      }
    },
    patchProductsStatus(target, isChecked, title) {
      const params = {
        product_ids: _.compact(this.$refs.dataTable.getSelectedItems().map((item) => {
          if (!item.is_blocked) {
            return item.id;
          }
          return null;
        })),
        target,
        is_checked: isChecked,
      };

      if (params.product_ids.length > 0) {
        const that = this;
        new Popup.Confirm({
          propsData: {
            title: `${title[1]} 상태를 ${title[0]}로 변경하시겠습니까?(제재상품은 제외 됩니다.)`,
            okCallback: async (inParams) => {
              await that.$store.dispatch(`${prefix}/patchProductsByType`, params);
              if (that.result.result === 'success') {
                that.$popup.showAlertPopup(`${title[1]} 상태가 ${title[0]}(으)로 변경되었습니다.`);
                that.$refs.dataTable.getSelectedItems().forEach((item) => {
                  item[target] = isChecked;
                });
              } else that.$popup.showAlertPopup(`${that.result.message}`);
              inParams.$destroy();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup(`${title[1]}상태를 ${title[0]}(으)로 변경할 상품을 선택해주세요.`);
      }
    },
    selectedDelete() {
      const params = {
        product_ids: this.$refs.dataTable.getSelectedItems().map((item) => item.id),
      };

      if (params.product_ids.length > 0) {
        const that = this;
        new Popup.Confirm({
          propsData: {
            title: '선택한 상품(들)을 삭제하시겠습니까?',
            okCallback: async (inParams) => {
              await that.$store.dispatch(`${prefix}/deleteProducts`, params);
              if (that.result.result === 'success') {
                // 데이터 다시 조회하기
                that.$popup.showAlertPopup('선택된 상품이 삭제완료 되었습니다.');
                await that.getData({ ...that.$route.query });
              } else that.$popup.showAlertPopup(`${that.result.message}`);
              inParams.$destroy();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('삭제할 상품을 선택해주세요.');
      }
    },
    comma(e) {
      const target = e.target;
      let value = target.value;
      if (value) {
        value = target.value.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        value = '';
      }
      target.value = value;
    },
    noComma(e) {
      const target = e.target;
      target.value = target.value.replace(/,/g, '');
    },
    blockStatusChange(productId, isBlocked) {
      if (isBlocked) {
        const that = this;
        new Popup.Confirm({
          propsData: {
            title: '해당 상품을 제재해제 하시겠습니까?',
            okCallback: async (params) => {
              await that.$store.dispatch(`${prefix}/patchProductBlocked`, { id: productId, is_blocked: !isBlocked });
              if (that.result.result === 'success') {
                that.$popup.showAlertPopup('해당 상품이 제재해제 되었습니다.');
                const item = that.products.find((product) => product.id === productId);
                item.is_blocked = !isBlocked;
              } else that.$popup.showAlertPopup(that.result.message);
              params.$destroy();
            },
          },
        }).$mount();
      } else {
        new Popup.Reason({
          propsData: {
            title: '해당 상품을 제재하시겠습니까?',
            okCallback: async (params) => {
              if (params.reason) {
                await this.$store.dispatch(`${prefix}/patchProductBlocked`, {
                  id: productId,
                  is_blocked: !isBlocked,
                  reason: params.reason,
                });
                if (this.result.result === 'success') {
                  this.$popup.showAlertPopup('해당 상품이 제재되었습니다.');
                  const item = this.products.find((product) => product.id === productId);
                  item.is_blocked = !isBlocked;
                } else this.$popup.showAlertPopup(this.result.message);
                params.$destroy();
              } else this.$popup.showAlertPopup('제재사유를 입력해주세요.');
            },
          },
        }).$mount();
      }
    },
    patchProducts() {
      const products = [];
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        let discountPrice = 0;
        if (item.discount_price) {
          discountPrice = item.discount_price.toString().replace(/,/g, '');
        }

        let isListed = item.is_listed;
        let isSale = item.is_sale;
        if (item.is_blocked) {
          isListed = false;
          isSale = false;
        }

        products.push({
          id: item.id,
          name: item.name,
          is_sale: isSale,
          is_listed: isListed,
          price: item.price.toString().replace(/,/g, ''),
          discount_price: discountPrice,
        });
      });

      if (products.length > 0) {
        const that = this;
        new Popup.Confirm({
          propsData: {
            title: '수정사항을 저장하시겠습니까?',
            okCallback: async (inParams) => {
              await that.$store.dispatch(`${prefix}/patchProducts`, { products });
              inParams.$destroy();
              if (that.result.result === 'success') {
                that.$popup.showAlertPopup('수정사항이 저장되었습니다.');
                if (that.result.data.products.length > 0) {
                  const productMap = {};
                  that.result.data.products.forEach((product) => {
                    productMap[product.id] = product.discount_type;
                  });
                  that.$refs.dataTable.getSelectedItems().forEach((item) => {
                    item.discount_type = productMap[item.id];
                  });
                }
              } else that.$popup.showAlertPopup(`${that.result.message}`);
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('수동저장할 상품을 선택해주세요.');
      }
    },
    async recoverDeletedProduct() {
      const res = await this.$store.dispatch(`${prefix}/getDeletedProducts`);
      const deletedProductData = res.data;
      new Popup.RecoverProduct({
        propsData: {
          page: deletedProductData.page,
          pageSize: deletedProductData.pageSize,
          products: deletedProductData.products,
          totalCount: deletedProductData.totalCount,
          prefix,
          okCallback: async () => {
            await this.refresh();
          },
        },
      }).$mount();
    },
    async updateCategory() {
      const productIds = this.$refs.dataTable.getSelectedItems().map((item) => item.id);
      const that = this;

      if (productIds && productIds.length > 0) {
        new Popup.ProductCategoryEdit({
          propsData: {
            okCallback: async (params) => {
              const targetCategory = params.lastSelected;
              await that.$store.dispatch(`${prefix}/updateProductCategory`, {
                product_ids: productIds,
                category_id: targetCategory.id,
              });

              if (that.result.result === 'success') {
                that.$popup.showAlertPopup('카테고리가 변경되었습니다.');
                params.$destroy();
                await this.refresh();
              } else that.$popup.showAlertPopup(`${that.result.message}`);
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('카테고리를 변경할 상품을 선택해주세요.');
      }
    },
    clickSearchType(searchType) {
      this.searchType = searchType;
    },
    /**
     * 판매가 10단위 올림
     */
    blurPrice(itemIndex, target) {
      let price = this.products[itemIndex][target];
      if (typeof price === 'string') {
        price = Number(price.replace(/,/g, ''));
      }
      if (price && price > 0) {
        const calcPrice = String(Math.ceil(price / 10) * 10);
        this.products[itemIndex][target] = calcPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    },
    checkProductForPriceGroup(checkProductPriceGroupId = false) {
      const productIds = [];
      let categoryId = null;
      let errorMessage = null;
      _.forEach(this.$refs.dataTable.getSelectedItems(), (item) => {
        if (!categoryId) {
          categoryId = item.category_id;
        }
        if (categoryId !== item.category_id) {
          errorMessage = '선택된 상품들의 카테고리가 일치하지 않습니다. 같은 카테고리의 상품만 선택해주세요.';
          return false;
        } if (item.is_blocked) {
          errorMessage = '선택된 상품들중 제재받은 상품이 존재합니다. 제재받지 않은 상품을 선택해주세요.';
          return false;
        } if (!item.can_price_group) {
          errorMessage = '선택된 상품들중 상품 그룹 매칭 지정 제외된 상품이 존재합니다. 다시 선택해주세요.';
          return false;
        } if (checkProductPriceGroupId && item.product_price_group_id) {
          errorMessage = '선택된 상품들중 이미 그룹에 속한 상품이 존재합니다. 다시 선택해주세요.';
          return false;
        }
        productIds.push(item.id);

        return true;
      });

      return {
        categoryId,
        errorMessage,
        productIds,
      };
    },
    // 선택 상품 가격 비교 그룹 생성
    clickCreatePriceGroup() {
      const { productIds, errorMessage } = this.checkProductForPriceGroup(true);

      if (errorMessage) {
        this.$popup.showAlertPopup(errorMessage);
      } else if (productIds.length < 2) {
        this.$popup.showAlertPopup('그룹 생성할 제품을 2개 이상 선택해주세요.');
      } else {
        this.$router.push(`/super_admin/product/price_group/new?product_ids=${productIds.toString()}`);
      }
    },
    priceGroupChange() {
      const that = this;
      const { categoryId, productIds, errorMessage } = this.checkProductForPriceGroup();

      if (errorMessage) {
        this.$popup.showAlertPopup(errorMessage);
      } else {
        new Popup.PriceGroupChange({
          propsData: {
            categoryId,
            productIds,
            moveCallback: async (params) => {
              if (params.productPriceGroupId) {
                await that.$store.dispatch(`${prefix}/moveProductPriceGroup`,
                  { product_ids: productIds, product_price_group_id: params.productPriceGroupId });
                if (that.result.result === 'success') {
                  that.$popup.showAlertPopup('이동되었습니다.');
                  const productIdSet = new Set(productIds);
                  that.$refs.dataTable.getSelectedItems().forEach((item) => {
                    if (productIdSet.has(item.id)) {
                      item.product_price_group_id = params.productPriceGroupId;
                    }
                  });
                } else that.$popup.showAlertPopup(`${that.result.message}`);
              } else {
                that.$popup.showAlertPopup('가격비교그룹을 선택해주세요.');
              }
              params.$destroy();
            },
          },
        }).$mount();
      }
    },
  },
};
