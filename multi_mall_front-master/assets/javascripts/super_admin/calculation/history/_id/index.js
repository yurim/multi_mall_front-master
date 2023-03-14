import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';

const prefix = 'super_admin/calculation/history';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '결제완료일', align: 'start', value: '' },
      { text: '구매확정일', value: '' },
      { text: '구분', value: '' },
      { text: '주문번호', value: '' },
      { text: '상품주문번호', value: '' },
      { text: '상품명', value: '' },
      { text: '옵션정보', value: '' },
      { text: '수량', value: '' },
      { text: '주문자명', value: '' },
      { text: '결제수단', value: '' },
      { text: '수수료(부가세포함)', value: '' },
      { text: '수수료 공급가액', value: '' },
      { text: '수수료 부가세액', value: '' },
      { text: '결제금액', value: '' },
      { text: '포인트', value: '' },
      { text: '정산금액', value: '' },
    ],
  }),
  async fetch({ store, params, query }) {
    const reqParams = {
      id: params.id,
      query,
    };
    await store.dispatch(`${prefix}/_id/getHistory`, reqParams);
  },
  computed: {
    ...mapGetters({
      storeBalanceAccountOrderProducts: `${prefix}/_id/storeBalanceAccountOrderProducts`,
      totalCount: `${prefix}/_id/totalCount`,
      pageSize: `${prefix}/_id/pageSize`,
      storeBalanceAccount: `${prefix}/_id/storeBalanceAccount`,
    }),
  },
  methods: {
    async getData(query) {
      const params = {
        id: this.$route.params.id,
        query,
      };
      this.loading = true;
      await this.$store.dispatch(`${prefix}/_id/getHistory`, params);
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async downloadExcel() {
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
                href: `${prefix}/${that.$route.params.id}/download_excel`,
                params: query,
                $axios: this.$store.$axios,
              },
            }).$mount();
          },
        },
      }).$mount();
    },
  },
};
