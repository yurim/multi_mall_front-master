import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/template/delivery/_id';

export default {
  data: () => ({
    isDelete: false,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getDeliveryInfo`, params.id);
  },
  computed: {
    ...mapGetters({
      deliveryInfo: `${prefix}/deliveryInfo`,
    }),
  },
  methods: {
    async deleteDelivery() {
      new this.$popup.Confirm({
        propsData: {
          title: '정말로 이 템플릿을 삭제하시겠습니까?',
          okCallback: async (params) => {
            const data = {
              delivery_info_ids: [this.deliveryInfo.id],
            };
            const res = await this.$store.dispatch(`${prefix}/deleteDeliveryInfo`, data);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('삭제되었습니다.');
            this.$router.replace({ name: 'store_admin-template-delivery' });
            params.$destroy();
          },
        },
      }).$mount();
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
};
