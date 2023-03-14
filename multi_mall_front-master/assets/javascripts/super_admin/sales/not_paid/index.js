import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';

const prefix = 'super_admin/sales/not_paid';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '주문번호', align: 'start', value: '', sortable: false },
      { text: '상품주문번호', value: '', sortable: false },
      { text: '판매매장', value: '', sortable: false },
      { text: '주문일시', value: 'ordered_at' },
      { text: '결제/입금기한', value: '', sortable: false },
      { text: '결제수단', value: '', sortable: false },
      { text: '주문자명', value: '', sortable: false },
      { text: '주문자 연락처', value: '', sortable: false },
      { text: '주문상태', value: '', sortable: false },
      { text: '상품코드', value: '', sortable: false },
      { text: '판매처', value: '', sortable: false },
      { text: '상품명', value: '', sortable: false },
      { text: '옵션정보', value: '', sortable: false },
      { text: '수량', value: '', sortable: false },
      { text: '옵션 추가금액', value: '', sortable: false },
      { text: '상품가격', value: '', sortable: false },
      { text: '상품별 할인적용금액', value: '', sortable: false },
      { text: '총 상품 주문금액', value: '', sortable: false },
      { text: '수취인명', value: '', sortable: false },
      { text: '수취인 연락처', value: '', sortable: false },
    ],
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/GetDataTable`);
  },
  computed: {
    ...mapGetters({
      orderProducts: `${prefix}/orderProducts`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
  },
  methods: {
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/GetDataTable`, query);
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    downloadExcel() {
      const that = this;
      new this.$popup.ExcelDownload({
        propsData: {
          totalCount: that.totalCount,
          okCallback(params) {
            const query = { ...that.$route.query };
            query.page_size = params.pageSize;
            query.page = params.page;

            // TODO loading popup
            new ExcelDownload({
              propsData: {
                href: `${prefix}/download_excel`,
                params: query,
                $axios: this.$store.$axios,
              },
            }).$mount();
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
