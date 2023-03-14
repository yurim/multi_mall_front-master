import util from '@/assets/javascripts/util';
import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';

const prefix = 'super_admin/sales/amazic9';

export default {
  data: () => ({
    loading: false,
    headers: [
    ],

    // search
    targets: [],
    deliveryCompanyList: [],
    searchAgencyList: [],
    selectedAgency: null,

    selectedBatchAgency: null,

    targetMap: {},
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getOrderDeliveryRequests`, query);
    await store.dispatch('common/getCodes', ['target', 'delivery_company']);
    await store.dispatch('common/getCodesValue', ['target']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      codeValueObjectArray: 'common/codeValueObjectArray',
      orderDeliveryRequests: `${prefix}/orderDeliveryRequests`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      notAssignedSPDATotalCount: `${prefix}/notAssignedSPDATotalCount`,

      agencyList: `${prefix}/agencyList`,
      agencyTotalCount: `${prefix}/agencyTotalCount`,
      agencyPageSize: `${prefix}/agencyPageSize`,
      agencyCurrPage: `${prefix}/agencyCurrPage`,

      storeList: `${prefix}/storeList`,
      storeTotalCount: `${prefix}/storeTotalCount`,
      storePageSize: `${prefix}/storePageSize`,
      storeCurrPage: `${prefix}/storeCurrPage`,
    }),
  },
  async created() {
    await this.initCodes();
  },
  methods: {
    initCodes() {
      this.deliveryCompanyList = this.codesArray('delivery_company');

      this.targetMap = {};
      this.codeValueObjectArray('target').forEach((v) => {
        this.targetMap[v.code] = v;
        this.targets.push({ text: v.name, value: v.code, isChecked: true });
      });
    },
    async refresh() {
      const query = { ...this.$route.query };
      await this.getData(query);
    },
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getOrderDeliveryRequests`, query);
      this.loading = false;
    },
    async onReset(query) {
      await this.getData(query);
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async onSearch(query) {
      let isValid = true;
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
        await this.getData(query);
      }
    },
    async searchNotAssigned() {
      const query = { agency: '미지정' };
      await this.getData(query);
    },

    /**
     * 담당업체 검색 함수
     */
    async onChangeAgency(type, query) {
      if (type === 'search') {
        await this.$store.dispatch(`${prefix}/resetAgencyList`);
      }
      await this.$store.dispatch(`${prefix}/getAgencyList`, query);
    },
    async onResetAgency() {
      await this.$store.dispatch(`${prefix}/resetAgencyList`);
    },
    async onSelectAgency(e) {
      if (e.name) this.selectedAgency = e.name;
      else this.selectedAgency = null;
    },

    /**
     * 판매매장 검색 함수
     */
    async onChangeStore(type, query) {
      if (type === 'search') {
        await this.$store.dispatch(`${prefix}/resetStoreList`);
      }
      if (!query) query = {};
      query.agency = this.selectedAgency;
      await this.$store.dispatch(`${prefix}/getStoreList`, query);
    },
    async onResetStore() {
      await this.$store.dispatch(`${prefix}/resetStoreList`);
    },

    /**
     * 전체항목 엑셀 다운로드
     */
    downloadExcel() {
      const that = this;
      new this.$popup.ExcelDownload({
        propsData: {
          totalCount: that.totalCount,
          okCallback: async (params) => {
            const query = { ...that.$route.query };
            query.page_size = params.pageSize;
            query.page = params.page;
            await this.$createLoading(async () => {
              new ExcelDownload({
                propsData: {
                  href: `${prefix}/download_excel`,
                  params: query,
                  $axios: this.$store.$axios,
                },
              }).$mount();
            });
          },
        },
      }).$mount();
    },
    getSelectedOrderDeliveryRequestIds() {
      const odrIds = [];
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        odrIds.push(item.id);
      });
      return odrIds;
    },
    /**
     * 선택항목 엑셀 다운로드
     * @param e
     */
    async selectDownloadExcel(e) {
      const params = {
        order_delivery_request_ids: this.getSelectedOrderDeliveryRequestIds(),
      };
      if (params.order_delivery_request_ids.length <= 0) {
        e.preventDefault();
        return this.$popup.showAlertPopup('엑셀다운로드할 상품주문 건을 선택해주세요.');
      }
      await this.$createLoading(async () => {
        new ExcelDownload({
          propsData: {
            href: `${prefix}/download_excel`,
            params,
            $axios: this.$store.$axios,
          },
        }).$mount();
      });
    },
  },
};
