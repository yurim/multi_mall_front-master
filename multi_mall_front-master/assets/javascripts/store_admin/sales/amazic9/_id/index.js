import { mapGetters } from 'vuex';

const prefixAmazic9 = 'store_admin/sales/amazic9';
const prefix = 'store_admin/sales/amazic9/_id';

export default {
  data: () => ({
    deliveryCompanyList: [],
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getDeliveryRequest`, params.id);
    await store.dispatch('common/getCodes', ['delivery_company']);
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      order: `${prefix}/order`,
      delivery_request: `${prefix}/delivery_request`,
    }),
  },
  async created() {
    this.initCodes();
  },
  methods: {
    initCodes() {
      this.deliveryCompanyList = this.codesArray('delivery_company');
    },
    /**
     * 해외 트레킹번호 수정
     * @param orderProductDeliveryRequest
     */
    async updateTrackingNum(orderProductDeliveryRequest) {
      if (!orderProductDeliveryRequest.abroad_tracking_num) return this.$popup.showAlertPopup('해외 트레킹번호를 입력해주세요');
      await this.$createLoading(async () => {
        const data = {
          order_product_delivery_request_id: orderProductDeliveryRequest.id,
          abroad_tracking_num: orderProductDeliveryRequest.abroad_tracking_num,
          abroad_order_num: orderProductDeliveryRequest.abroad_order_num,
        };
        const res = await this.$store.dispatch(`${prefixAmazic9}/updateAbroadOrder`, data);
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
        this.$popup.showAlertPopup('저장이 완료되었습니다');
      });
    },
    /**
     * 국내 발송정보 수정
     * @param deliveryRequest
     * @param info
     */
    async updateInvoiceNum(deliveryRequest, info) {
      const inputDeliveryCompany = deliveryRequest.delivery_company;
      const inputInvoiceNum = deliveryRequest.invoice_num;
      if (!inputDeliveryCompany || !inputInvoiceNum) {
        return this.$popup.showAlertPopup('발송정보를 입력해주세요.');
      }

      const confirmTitle = (info.order_product.order_status === 'DLVRNG') ? '국내 발송정보를 수정하시겠습니까?' : '해당 신청건의 국내 발송정보를 저장하고\n주문상태를 \'배송중\'상태로 변경하시겠습니까?';

      new this.$popup.Confirm({
        propsData: {
          title: confirmTitle,
          okCallback: async (params) => {
            await this.$createLoading(async () => {
              const data = {
                order_product_delivery_request_id: info.delivery_product.order_product_delivery_request_id,
                delivery_request_id: deliveryRequest.id,
                delivery_company: inputDeliveryCompany,
                invoice_num: inputInvoiceNum,
              };
              const result = await this.$store.dispatch(`${prefixAmazic9}/updateInvoiceNum`, data);
              if (result.result !== 'success') {
                return this.$popup.showAlertPopup(result.message);
              }
              params.$destroy();
              this.$popup.showAlertPopup('저장이 완료되었습니다');
            });
          },
        },
      }).$mount();
    },
  },
};
