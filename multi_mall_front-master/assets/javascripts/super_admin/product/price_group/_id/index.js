import { mapGetters } from 'vuex';

const prefix = 'super_admin/product/price_group/_id';

export default {
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getPriceGroup`, params.id);
  },
  computed: {
    ...mapGetters({
      priceGroup: `${prefix}/priceGroup`,
      result: `${prefix}/result`,
    }),
  },
  methods: {
    showPriceGroupCancellationPopup() {
      new this.$popup.PriceGroupCancellation({
        propsData: {
          okCallback: async (params) => {
            await this.$store.dispatch(`${prefix}/deletePriceGroup`, this.priceGroup.id);
            if (this.result.result === 'success') {
              this.$popup.showAlertPopup('그룹 해제 되었습니다.', () => {
                this.$router.push('/super_admin/product/price_group');
              });
            } else {
              this.$popup.showAlertPopup(this.result.message);
            }
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
