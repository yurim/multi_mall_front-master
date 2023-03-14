import util from '@/assets/javascripts/util';
import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import ExcelDownload from '@/components/ExcelDownload';
import fileDownload from '@/assets/javascripts/fileDownload';

const prefix = 'store_admin/sales/amazic9';

export default {
  middleware: 'amazic9Auth',
  data: () => ({
    loading: false,
    headers: [
    ],

    // search
    targets: [],
    deliveryCompanyList: [],

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
    }),
  },
  async created() {
    this.initCodes();
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

    /**
     * 배송대행 신청
     * @param index orderDeliveryRequests index
     */
    async requestDelivery(index) {
      const orderDeliveryRequest = this.orderDeliveryRequests[index];
      const orderProductDeliveryRequests = orderDeliveryRequest.order_product_delivery_requests;

      new this.$popup.Amazic9Request({
        propsData: {
          orderProductDeliveryRequests,
          okCallback: async (params) => {
            await this.$createLoading(async () => {
              if (params.selected.length < 1) return this.$popup.showAlertPopup('주문을 선택해주세요.');

              const data = {
                target: 'default',
                order_delivery_request_id: orderDeliveryRequest.id,
                order_product_delivery_request_ids: params.selected,
              };
              await this.$router.push({ name: 'store_admin-sales-amazic9-request', query: data });
              params.$destroy();
            });
          },
          movePageCallback: async (page) => {
            await this.$router.push(page);
          },
        },
      }).$mount();
    },

    /**
     * 구매확인 필요 수정
     * @param orderProductDeliveryRequest
     */
    async updateCheckPurchasing(orderProductDeliveryRequest) {
      new Popup.Amazic9PurchaseStatusAlert({
        propsData: {
          isChecked: orderProductDeliveryRequest.check_purchasing,
          okCallback: async (params) => {
            const data = {
              order_product_delivery_request_id: orderProductDeliveryRequest.id,
              check_purchasing: orderProductDeliveryRequest.check_purchasing,
            };
            const result = await this.$store.dispatch(`${prefix}/updateCheckPurchasing`, data);
            if (result.result !== 'success') {
              this.$popup.showAlertPopup(result.message);
              orderProductDeliveryRequest.check_purchasing = !orderProductDeliveryRequest.check_purchasing;
              return;
            }
            await this.refresh();
            params.$destroy();
          },
          cancelCallback: () => {
            orderProductDeliveryRequest.check_purchasing = !orderProductDeliveryRequest.check_purchasing;
          },
        },
      }).$mount();
    },

    /**
     * '구매필요없음' && '배송준비중' 상태에서 발주확인
     * @param orderDeliveryRequestId
     * @param orderProductId
     */
    async updateCheckDelivery(orderDeliveryRequestId, orderProductId) {
      await this.$createLoading(async () => {
        const data = {
          order_product_id: orderProductId,
          order_delivery_request_id: orderDeliveryRequestId,
        };
        const result = await this.$store.dispatch(`${prefix}/updateCheckDelivery`, data);
        if (result.result !== 'success') {
          return this.$popup.showAlertPopup(result.message);
        }
        await this.refresh();
      });
    },

    /**
     * 해외 주문번호 저장
     * @param odrIndex orderDeliveryRequests index
     * @param opdrIndex order_delivery_products index
     */
    async updateAbroadOrder(odrIndex, opdrIndex) {
      const orderProductDeliveryRequest = this.orderDeliveryRequests[odrIndex].order_product_delivery_requests[opdrIndex];
      if (!orderProductDeliveryRequest.editAbroadOrderNum || !orderProductDeliveryRequest.editAbroadTrackingNum) {
        return this.$popup.showAlertPopup('해외 주문정보를 입력해주세요.');
      }
      await this.$createLoading(async () => {
        const data = {
          order_product_delivery_request_id: orderProductDeliveryRequest.id,
          abroad_order_num: orderProductDeliveryRequest.editAbroadOrderNum,
          abroad_tracking_num: orderProductDeliveryRequest.editAbroadTrackingNum,
        };
        const result = await this.$store.dispatch(`${prefix}/updateAbroadOrder`, data);
        if (result.result !== 'success') {
          return this.$popup.showAlertPopup(result.message);
        }
        await this.refresh();
      });
    },

    /**
     * 국내 발송정보 저장
     * @param odrIndex orderDeliveryRequests index
     * @param opdrIndex order_delivery_products index
     */
    async updateInvoiceNum(odrIndex, opdrIndex) {
      const orderProductDeliveryRequest = this.orderDeliveryRequests[odrIndex].order_product_delivery_requests[opdrIndex];
      const inputDeliveryCompany = orderProductDeliveryRequest.order_product.order_product_delivery.delivery_company;
      const inputInvoiceNum = orderProductDeliveryRequest.order_product.order_product_delivery.invoice_num;
      if (!inputDeliveryCompany || !inputInvoiceNum) {
        return this.$popup.showAlertPopup('발송정보를 입력해주세요.');
      }

      const confirmTitle = (orderProductDeliveryRequest.order_product.order_status === 'DLVRNG') ? '국내 발송정보를 수정하시겠습니까?' : '해당 신청건의 국내 발송정보를 저장하고\n주문상태를 \'배송중\'상태로 변경하시겠습니까?';

      new this.$popup.Confirm({
        propsData: {
          title: confirmTitle,
          okCallback: async (params) => {
            await this.$createLoading(async () => {
              const data = {
                order_product_delivery_request_id: orderProductDeliveryRequest.id,
                delivery_request_id: (orderProductDeliveryRequest.delivery_request) ? orderProductDeliveryRequest.delivery_request.id : null,
                delivery_company: inputDeliveryCompany,
                invoice_num: inputInvoiceNum,
              };
              const result = await this.$store.dispatch(`${prefix}/updateInvoiceNum`, data);
              if (result.result !== 'success') {
                return this.$popup.showAlertPopup(result.message);
              }
              await this.refresh();
              params.$destroy();
            });
          },
        },
      }).$mount();
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

    /**
     * 구매처리 엑셀업로드
     */
    async uploadExcelForPurchase() {
      const that = this;
      new this.$popup.UploadFile({
        propsData: {
          title: '구매처리 엑셀업로드',
          downloadTemplateUrl: `${prefix}/get_purchase_template`,
          async okCallback(params) {
            if (params.file) {
              const formData = new FormData();
              formData.append('file', params.file);
              await this.$createLoading(async () => {
                const res = await this.$store.$axios({
                  url: `${prefix}/upload_purchase`,
                  method: 'POST',
                  headers: { 'content-type': 'multipart/form-data' },
                  data: formData,
                  responseType: 'blob',
                });
                this.$popup.showAlertPopup('업로드가 완료 되었습니다. 결과 엑셀 파일이 다운로드 됩니다.');
                const cd = res.headers['content-disposition'];
                const fileName = cd.split('filename=')[1];
                fileDownload(res.data, fileName);
                await that.refresh();
                params.$destroy();
              });
            } else {
              this.$popup.showAlertPopup('파일을 업로드해주세요.');
            }
          },
        },
      }).$mount();
    },
    /**
     * 발송처리 엑셀업로드
     */
    async uploadExcelForDispatch() {
      const that = this;
      new this.$popup.UploadFile({
        propsData: {
          title: '발송처리 엑셀업로드',
          downloadTemplateUrl: `${prefix}/get_dispatch_template`,
          async okCallback(params) {
            if (params.file) {
              const formData = new FormData();
              formData.append('file', params.file);
              await this.$createLoading(async () => {
                const res = await this.$store.$axios({
                  url: `${prefix}/upload_dispatch`,
                  method: 'POST',
                  headers: { 'content-type': 'multipart/form-data' },
                  data: formData,
                  responseType: 'blob',
                });
                this.$popup.showAlertPopup('업로드가 완료 되었습니다. 결과 엑셀 파일이 다운로드 됩니다.');
                const cd = res.headers['content-disposition'];
                const fileName = cd.split('filename=')[1];
                fileDownload(res.data, fileName);
                await that.refresh();
                params.$destroy();
              });
            } else {
              this.$popup.showAlertPopup('파일을 업로드해주세요.');
            }
          },
        },
      }).$mount();
    },
  },
};
