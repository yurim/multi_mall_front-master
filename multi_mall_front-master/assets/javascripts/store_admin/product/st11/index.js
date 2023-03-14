import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import ExcelDownload from '@/components/ExcelDownload';
import util from '@/assets/javascripts/util';

const prefix = 'store_admin/product/st11';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '등록일', align: 'start', value: 'created_at' },
      { text: '상품코드', value: 'id', sortable: false },
      { text: '상품구분', value: 'target', sortable: false },
      { text: '상품이미지', value: 'main_image', sortable: false },
      { text: '상품명', value: 'name', sortable: true },
      { text: '카테고리', value: 'category', sortable: false },
      { text: '판매상태', value: 'is_sale', sortable: false },
      { text: '전시상태', value: 'is_listed', sortable: false },
      { text: '판매가', value: 'price' },
      { text: '할인적용가', value: 'discount_price' },
      { text: '상품보기', value: 'detail_url', sortable: false },
      { text: '연동잠금상태', value: 'st11_is_locked', sortable: false },
      { text: '11번가 상태', value: 'st11_status', sortable: false },
      { text: '11번가 메세지', value: 'st11_message', sortable: false },
      { text: '11번가 링크', value: 'st11_link', sortable: false },
    ],
    targets: [],
    st11_status_map: {
      NOT_REQUESTED: '미연동',
      REQUESTED: '연동중',
      COMPLETED: '연동완료',
      FAILED: '연동실패',
      DELETING: '삭제중',
    },
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
  },
  methods: {
    init() {
      const targetList = [];
      const targetLength = this.codesArray('target').length;
      for (let i = 0; i < targetLength; i += 1) {
        const item = this.codesArray('target')[i];
        targetList.push({ text: item.value, value: item.key, isChecked: false });
      }
      this.targets = targetList;
      const { query } = this.$route;
      if (query.search_type) {
        this.searchType = query.search_type;
      }
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
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async onSearch(query) {
      // TODO 이전에 검색된 query 필요
      let isValid = true;

      if (this.searchType === 'name' && query.product_name.length < 2) {
        this.$popup.showAlertPopup('검색어를 2글자 이상 입력해주세요.');
        return;
      }

      if (query.keyword && query.keyword_type) {
        if (query.keyword_type === 'id' && !util.checkMongoDBObjectId(query.keyword)) {
          this.$popup.showAlertPopup('상세검색에서 입력한 상품코드가 올바르지 않습니다. 다시 입력해주세요.');
          query.keyword = '';
          query.keyword_type = '';
          await this.$router.push({ query });
          isValid = false;
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
    selectDownloadExcel() {
      const ids = this.$refs.dataTable.getSelectedItems().map((item) => item.id);
      if (ids.length > 200) {
        this.$popup.showAlertPopup('200개 이하의 항목만 다운로드할 수 있습니다.');
        // 테스트 환경에서 1000건 까지 GET 요청 가능한 것으로 확인 (nginx 에서는 확인 필요)
        // 1500건은 서버 에러, 2000건 이상은 브라우저&서버 모두 에러
        return;
      }
      const params = {
        product_ids: ids,
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
    pageToRedirect(id) {
      this.$router.push({ name: 'product', params: { _id: id } });
    },
    async setIsLocked(event) {
      const isLocked = event.target.value;
      event.target.value = '';

      const productIds = this.$refs.dataTable.getSelectedItems().map((v) => v.id);
      if (!productIds || productIds.length <= 0) {
        this.$popup.showAlertPopup('상품을 선택해주세요');
      } else if (isLocked !== '') {
        const res = await this.$store.dispatch(`${prefix}/setLockedSt11Product`, {
          product_ids: productIds,
          is_locked: isLocked,
        });

        let message = '잠금설정이 완료되었습니다.';
        if (res.result !== 'success') message = res.message;
        this.$popup.showAlertPopup(message);
      }
    },
    async setProductIsLocked(st11Product) {
      const res = await this.$store.dispatch(`${prefix}/setLockedSt11Product`, {
        product_ids: [st11Product.product_id],
        is_locked: st11Product.is_locked,
      });

      let message = '잠금설정이 완료되었습니다.';
      if (res.result !== 'success') message = res.message;
      this.$popup.showAlertPopup(message);
    },
    async createSt11Product(params) {
      const res = await this.$store.dispatch(`${prefix}/createSt11Product`, params);
      if (res.result !== 'success') return this.$popup.showAlertPopup(res.message);
      if (res.data.requested_product_ids.length <= 0) return this.$popup.showAlertPopup('연동 요청이 가능한 상품이 없습니다.');
      this.progressPopup('create', params.product_ids);
    },
    async clickCreateSt11Product() {
      const productIds = this.$refs.dataTable.getSelectedItems().map((v) => v.id);
      if (!productIds || productIds.length <= 0) return this.$popup.showAlertPopup('상품을 선택해주세요');
      // 11번가 연동 팝업 create
      new Popup.St11Linkage({
        propsData: {
          okCallback: async (params) => {
            params.$destroy();
            await this.createSt11Product({
              product_ids: productIds,
              st11_category_id: params.st11CategoryId,
              country_code: params.countryCode,
              delivery_template_id: params.deliveryTemplateId,
              is_minors_allow: params.isMinorsAllow,
              st11_notification_code: params.st11NotificationCode,
            });
          },
        },
      }).$mount();
    },
    async clickUpdateSt11Product() {
      const productIds = this.$refs.dataTable.getSelectedItems().map((v) => v.id);
      if (!productIds || productIds.length <= 0) return this.$popup.showAlertPopup('상품을 선택해주세요');
      await this.createSt11Product({
        product_ids: productIds,
      });
    },
    async clickDeleteSt11Product() {
      const productIds = this.$refs.dataTable.getSelectedItems().map((v) => v.id);
      if (!productIds || productIds.length <= 0) return this.$popup.showAlertPopup('상품을 선택해주세요');
      const res = await this.$store.dispatch(`${prefix}/deleteSt11Product`, {
        product_ids: productIds,
      });
      if (res.result !== 'success') return this.$popup.showAlertPopup(res.message);
      if (res.data.requested_product_ids.length <= 0) return this.$popup.showAlertPopup('연동 해제 요청이 가능한 상품이 없습니다.');
      this.progressPopup('delete', productIds);
    },
    progressPopup(type, productIds) {
      let title = '';
      let subUrl = '';
      if (type === 'create') {
        title = '11번가 상품 연동 요청이 완료되었습니다.';
        subUrl = 'check_create_st11_product';
      } else if (type === 'delete') {
        title = '11번가 상품 연동 해제 요청이 완료되었습니다.';
        subUrl = 'check_delete_st11_product';
      }

      new Popup.Progress({
        propsData: {
          title,
          productIds,
          subUrl,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
    async updateAllSt11Product() {
      const res = await this.$store.dispatch(`${prefix}/updateAllSt11Product`);
      if (res.result !== 'success') return this.$popup.showAlertPopup(res.message);
      if (res.data.requested_product_ids.length <= 0) return this.$popup.showAlertPopup('연동 요청이 가능한 상품이 없습니다.');
      this.$popup.showAlertPopup('요청이 완료되었습니다.');
      // this.progressPopup('create', res.data.requested_product_ids);
    },
    async downloadExcelExhibition() {
      let productIds = this.$refs.dataTable.getSelectedItems().map((v) => v.id);
      if (!productIds || productIds.length <= 0) return this.$popup.showAlertPopup('상품을 선택해주세요');

      // 상품코드 다중검색인 경우, 다중검색 순서를 유지한채 엑셀 다운로드
      let queryProductIds = this.$route.query.product_ids;
      if (queryProductIds) {
        queryProductIds = queryProductIds.split('\n');
        productIds = queryProductIds.filter((v) => productIds.includes(v));
      }

      new ExcelDownload({
        propsData: {
          href: `${prefix}/download_excel_exhibition`,
          params: { product_ids: productIds },
          $axios: this.$store.$axios,
        },
      }).$mount();
    },
    clickSearchType(searchType) {
      this.searchType = searchType;
    },
  },
};
