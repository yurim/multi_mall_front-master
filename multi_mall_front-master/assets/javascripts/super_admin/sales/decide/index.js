import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';
import moment from 'moment-timezone';

const prefix = 'super_admin/sales/decide';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '주문번호', align: 'start', value: '', sortable: false },
      { text: '상품주문번호', value: '', sortable: false },
      { text: '판매매장', value: '', sortable: false },
      { text: '구매확정일', value: '', sortable: false },
      { text: '배송방법', value: '', sortable: false },
      { text: '택배사', value: '', sortable: false },
      { text: '송장번호', value: '', sortable: false },
      { text: '배송추적', value: '', sortable: false },
      { text: '주문자명', value: '', sortable: false },
      { text: '주문자연락처', value: '', sortable: false },
      { text: '주문자 ID', value: '', sortable: false },
      { text: '주문상태', value: '', sortable: false },
      { text: '주문일시', value: '', sortable: false },
      { text: '결제수단', value: '', sortable: false },
      { text: '결제위치', value: '', sortable: false },
      { text: '결제일', value: '', sortable: false },
      { text: '상품코드', value: '', sortable: false },
      { text: '판매처', value: '', sortable: false },
      { text: '상품명', value: '', sortable: false },
      { text: '옵션정보', value: '', sortable: false },
      { text: '수량', value: '', sortable: false },
      { text: '옵션 추가금액', value: '', sortable: false },
      { text: '상품가격', value: '', sortable: false },
      { text: '상품별 할인적용금액', value: '', sortable: false },
      { text: '총 상품 주문금액', value: '', sortable: false },
      { text: '발주확인일', value: '', sortable: false },
      { text: '발송예정일', value: '', sortable: false },
      { text: '발송처리일', value: '', sortable: false },
      { text: '배송비 지불방법', value: '', sortable: false },
      { text: '배송비유형', value: '', sortable: false },
      { text: '수취인 이름', value: '', sortable: false },
      { text: '수취인 연락처', value: '', sortable: false },
      { text: '배송지', value: '', sortable: false },
      { text: '구매확정요청일', value: '', sortable: false },
      { text: '우편번호', value: '', sortable: false },
      { text: '배송메세지', value: '', sortable: false },
    ],
  }),
  async fetch({ store }) {
    const startDate = moment().subtract(1, 'months').add(1, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    const q = {
      start_date: startDate,
      end_date: endDate,
      date_type: 'paid_at',
      page: 1,
      page_size: 50,
    };
    await store.dispatch(`${prefix}/getOrderProducts`, q);
  },
  computed: {
    ...mapGetters({
      orderProducts: `${prefix}/orderProducts`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
    selectedItems() {
      return this.$refs.dataTable.getSelectedItems();
    },
  },
  methods: {
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getOrderProducts`, query);
      this.loading = false;
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
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
    selectDownloadExcel(e) {
      const params = {
        order_product_ids: this.selectedItems.map((v) => v.id),
      };
      if (params.order_product_ids.length > 0) {
        // TODO loading popup
        new ExcelDownload({
          propsData: {
            href: `${prefix}/download_excel`,
            params,
            $axios: this.$store.$axios,
          },
        }).$mount();
      } else {
        e.preventDefault();
        this.$popup.showAlertPopup('엑셀다운로드할 상품주문 건을 선택해주세요.');
      }
    },
  },
};
