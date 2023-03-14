import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/template/delivery_group';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '템플릿 제목', align: 'start', value: 'name' },
      { text: '계산방식', value: 'is_smaller' },
      { text: '등록일', value: 'created_at' },
      { text: '수정일', value: 'updated_at' },
      { text: '수정', value: '', sortable: false },
    ],
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getDeliveriesGroup`, query);
  },
  computed: {
    ...mapGetters({
      deliveriesGroup: `${prefix}/deliveriesGroup`,
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
      await this.$store.dispatch(`${prefix}/getDeliveriesGroup`, query);
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    selectedDeleteDeliveryGroup() {
      const that = this;
      const params = {
        delivery_group_ids: [],
      };
      that.$refs.dataTable.getSelectedItems().forEach((item) => {
        params.delivery_group_ids.push(item.id);
      });
      if (params.delivery_group_ids.length > 0) {
        new this.$popup.Confirm({
          propsData: {
            title: '선택하신 템플릿을 삭제하시겠습니까?',
            okCallback: async (inParams) => {
              const res = await that.$store.dispatch(`${prefix}/deleteDeliveriesGroup`, params);
              if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

              this.$popup.showAlertPopup('삭제되었습니다.');
              await that.refresh();
              inParams.$destroy();
            },
          },
        }).$mount();
      } else {
        that.popupAlert('삭제할 묶음배송그룹 템플릿을 선택해주세요.');
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
