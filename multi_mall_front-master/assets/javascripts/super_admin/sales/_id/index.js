import { mapGetters } from 'vuex';

const prefix = 'super_admin/sales';

export default {
  data: () => ({
    deliveryMethods: [],
    deliveryCompanies: [],
    collectDeliveryTypeCodes: [],
  }),
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      orderProduct: `${prefix}/orderProduct`,
    }),
    productUrl() {
      if (typeof window !== 'undefined') return `${window.location.origin}/product/${this.orderProduct.productId}`;
      return '';
    },
  },
  async fetch({ store, params }) {
    await store.dispatch('common/getCodes', ['delivery_method', 'delivery_company', 'collect_delivery_type']);
    await store.dispatch(`${prefix}/getOrderProduct`, params.id);
  },
  async created() {
    this.deliveryMethods = this.codesArray('delivery_method');
    this.deliveryCompanies = this.codesArray('delivery_company');
    this.collectDeliveryTypeCodes = this.codesArray('collect_delivery_type');
    this.setOrderProductsRowspan();
  },
  methods: {
    async refresh() {
      await this.$store.dispatch(`${prefix}/getOrderProduct`, this.$route.params.id);
    },
    setOrderProductsRowspan() {
      const reversedProducts = this.orderProduct.orderProducts.reverse();
      if (!reversedProducts) return;
      let previousDeliveryFeeId;
      for (let i = 0; i < reversedProducts.length; i += 1) {
        reversedProducts[i].rowspan = 1;
        if (reversedProducts[i].delivery_fee_id === previousDeliveryFeeId) {
          reversedProducts[i].rowspan += reversedProducts[i - 1].rowspan;
          reversedProducts[i - 1].rowspan = 0;
        }
        previousDeliveryFeeId = reversedProducts[i].delivery_fee_id;
      }
      this.orderProduct.orderProducts.reverse();
    },
    async updateDispatchDelivery(data) {
      data.order_product_id = this.orderProduct.id;
      const res = await this.$store.dispatch(`${prefix}/update_dispatch_delivery`, data);
      if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
      await this.refresh();
    },
    async updateCollectDelivery(data) {
      data.order_product_id = this.orderProduct.id;
      const res = await this.$store.dispatch(`${prefix}/update_collect_delivery`, data);
      if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
      await this.refresh();
    },
    btnAdminMemo() {
      new this.$popup.Memo({
        propsData: {
          originMemo: this.orderProduct.adminMemo,
          okCallback: async (params) => {
            params.order_product_num = this.orderProduct.productOrderNum;
            const res = await this.$store.dispatch(`${prefix}/updateAdminMemo`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnEditReason(history) {
      let Popup;
      let title = '';
      if (history.reasonSubTypeValue === 'RQST_RTRN') {
        Popup = this.$popup.RequestReturnEdit;
      } else if (history.reasonSubTypeValue === 'EXCHNG') {
        Popup = this.$popup.RequestExchangeEdit;
      } else {
        Popup = this.$popup.Reason;
        title = '취소 사유 입력';
      }

      new Popup({
        propsData: {
          title,
          reason_sub_type: history.reasonSubType,
          reason: history.reason,
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');
            params.status_history_id = history.id;
            const res = await this.$axios.$post(`${prefix}/update_status_history`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnCancelAccept() {
      if (!['취소요청'].includes(this.orderProduct.orderSubStatusStr)) {
        this.$popup.showAlertPopup('취소 요청 상태인 주문 건만 취소 완료 처리할 수 있습니다.');
        return;
      }
      new this.$popup.RefundPrice({
        propsData: {
          title: '취소 금액 입력',
          okButtonText: '취소완료',
          okCallback: async (params) => {
            const refundPrice = parseInt(params.refundPrice, 10);
            if (!Number.isInteger(refundPrice)) return this.$popup.showAlertPopup('취소 금액을 정확히 입력해주세요.');

            new this.$popup.Confirm({
              propsData: {
                title: '선택하신 주문건 1건에 대한 취소완료처리를 진행하시겠습니까?',
                okCallback: async (confirmParams) => {
                  const res = await this.$store.dispatch('super_admin/sales/cancel/cancel_accept', {
                    order_product_id: this.orderProduct.id,
                    refund_price: refundPrice,
                  });
                  if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

                  this.$popup.showAlertPopup('완료되었습니다.');
                  await this.refresh();
                  confirmParams.$destroy();
                },
              },
            }).$mount();

            params.$destroy();
          },
        },
      }).$mount();
    },
    btnReturnComplete() {
      // 반품 완료 처리 - 반품요청 또는 상품수거중 또는 수거완료 상태에서만 가능
      if (['환불보류'].includes(this.orderProduct.orderSubStatusStr)) return this.$popup.showAlertPopup('환불 보류를 해제한 뒤 진행할 수 있습니다.');
      if (!['반품요청', '상품 수거중', '수거완료'].includes(this.orderProduct.orderSubStatusStr)) return this.$popup.showAlertPopup('반품요청/수거중/수거 완료 상태의 주문 상품만 반품 완료 처리할 수 있습니다.');

      new this.$popup.RefundPrice({
        propsData: {
          title: '취소 금액 입력',
          okButtonText: '반품완료',
          okCallback: async (params) => {
            const refundPrice = parseInt(params.refundPrice, 10);
            if (!Number.isInteger(refundPrice)) return this.$popup.showAlertPopup('취소 금액을 정확히 입력해주세요.');

            new this.$popup.Confirm({
              propsData: {
                title: '선택하신 주문건 1건에 대한 반품완료 처리를 진행하시겠습니까?',
                okCallback: async (confirmParams) => {
                  const res = await this.$store.dispatch(`${prefix}/update_refund_price`, {
                    order_product_id: this.orderProduct.id,
                    refund_price: refundPrice,
                  });
                  if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

                  this.$popup.showAlertPopup('완료되었습니다.');
                  await this.refresh();
                  confirmParams.$destroy();
                },
              },
            }).$mount();
            params.$destroy();
          },
        },
      }).$mount();
    },
    modifyRefundPrice(orderProduct) {
      new this.$popup.RefundPrice({
        propsData: {
          title: '취소 금액 수정',
          okButtonText: '수정',
          refundPrice: orderProduct.refundPrice,
          okCallback: async (params) => {
            const refundPrice = parseInt(params.refundPrice, 10);
            if (!Number.isInteger(refundPrice)) return this.$popup.showAlertPopup('취소 금액을 정확히 입력해주세요.');
            new this.$popup.Confirm({
              propsData: {
                title: '취소 금액을 수정하시겠습니까?',
                okCallback: async (confirmParams) => {
                  const res = await this.$store.dispatch(`${prefix}/update_refund_price`, {
                    order_product_id: orderProduct.id,
                    refund_price: refundPrice,
                  });
                  if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
                  this.$popup.showAlertPopup('완료되었습니다.');
                  await this.refresh();
                  confirmParams.$destroy();
                },
              },
            }).$mount();
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
