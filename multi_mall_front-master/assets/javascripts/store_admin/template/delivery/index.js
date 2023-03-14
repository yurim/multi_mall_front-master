import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/template/delivery';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '템플릿 제목', align: 'start', value: 'name' },
      { text: '배송비 유형', value: 'delivery_fee_type' },
      { text: '기본배송비', value: 'default_fee' },
      { text: '등록일', value: 'created_at' },
      { text: '수정일', value: 'updated_at' },
      { text: '수정', value: '', sortable: false },
    ],
    selectedItems: [],
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getDeliveries`, query);
  },
  computed: {
    ...mapGetters({
      deliveries: `${prefix}/deliveries`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      result: `${prefix}/result`,
    }),
  },
  methods: {
    async refresh() {
      const query = { ...this.$route.query };
      await this.getData(query);
    },
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getDeliveries`, query);
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    selectedDeleteDelivery() {
      const that = this;
      const params = {
        delivery_info_ids: [],
      };
      that.$refs.dataTable.getSelectedItems().forEach((item) => {
        params.delivery_info_ids.push(item.id);
      });
      if (params.delivery_info_ids.length > 0) {
        new this.$popup.Confirm({
          propsData: {
            title: '배송비 템플릿을 삭제 하시겠습니까?',
            message: '해당 템플릿이 적용된 상품의 배송비 설정은 그대로 사용 가능합니다.\n원치 않으시면 해당 상품의 배송비 템플릿을 변경해주세요.',
            okCallback: async (inParams) => {
              const res = await that.$store.dispatch(`${prefix}/deleteDeliveryInfos`, params);
              if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

              this.$popup.showAlertPopup('삭제되었습니다.');
              await that.refresh();
              inParams.$destroy();
            },
          },
        }).$mount();
      } else {
        that.popupAlert('삭제할 배송비 템플릿을 선택해주세요.');
      }
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
