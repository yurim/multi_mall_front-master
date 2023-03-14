import { mapGetters } from 'vuex';

const prefix = 'super_admin/sales/amazic9/_id';

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
  },
};
