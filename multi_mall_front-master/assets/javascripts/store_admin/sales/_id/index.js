import { mapGetters } from 'vuex';

const prefix = 'store_admin/sales';

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
  },
};
