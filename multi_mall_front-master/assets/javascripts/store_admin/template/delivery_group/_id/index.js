import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/template/delivery_group/_id';

export default {
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getDeliveryGroup`, params.id);
  },
  computed: {
    ...mapGetters({
      deliveryGroup: `${prefix}/deliveryGroup`,
    }),
  },
  methods: {
    deleteDeliveryGroup() {
      new Popup.Confirm({
        propsData: {
          title: '이 템플릿을 정말로 삭제하시겠습니까?',
          okCallback: async (inParams) => {
            const data = {
              delivery_group_ids: [this.deliveryGroup.id],
            };
            const res = await this.$store.dispatch(`${prefix}/deleteDeliveryGroup`, data);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('삭제되었습니다.');
            this.$router.replace({ name: 'store_admin-template-delivery_group' });
            inParams.$destroy();
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
