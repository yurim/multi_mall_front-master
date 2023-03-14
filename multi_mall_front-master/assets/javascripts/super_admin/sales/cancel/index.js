import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';
import moment from 'moment-timezone';

const prefix = 'super_admin/sales/cancel';
const salesPrefix = 'super_admin/sales';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '주문번호', align: 'start', value: '', sortable: false },
      { text: '상품주문번호', value: '', sortable: false },
      { text: '판매매장', value: '', sortable: false },
      { text: '주문상태', value: '', sortable: false },
      { text: '주문상태 상세', value: '', sortable: false },
      { text: '결제일', value: '', sortable: false },
      { text: '취소요청일', value: 'cancel_requested_at', sortable: true },
      { text: '취소완료일', value: '', sortable: false },
      { text: '취소완료금액', value: '', sortable: false },
      { text: '주문일시', value: '', sortable: false },
      { text: '결제수단', value: '', sortable: false },
      { text: '상품코드', value: '', sortable: false },
      { text: '판매처', value: '', sortable: false },
      { text: '상품명', value: '', sortable: false },
      { text: '옵션정보', value: '', sortable: false },
      { text: '수량', value: '', sortable: false },
      { text: '옵션 추가금액', value: '', sortable: false },
      { text: '상품가격', value: '', sortable: false },
      { text: '상품별 할인적용금액', value: '', sortable: false },
      { text: '총 상품 주문금액', value: '', sortable: false },
      { text: '발송처리일', value: '', sortable: false },
      { text: '배송완료일', value: '', sortable: false },
      { text: '배송비 지불방법', value: '', sortable: false },
      { text: '배송비유형', value: '', sortable: false },
      { text: '수취인 이름', value: '', sortable: false },
      { text: '수취인 연락처', value: '', sortable: false },
      { text: '배송지', value: '', sortable: false },
      { text: '우편번호', value: '', sortable: false },
      { text: '배송메세지', value: '', sortable: false },
    ],
  }),
  async fetch({ store, query }) {
    const startDate = moment().subtract(1, 'months').add(1, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    const q = {
      start_date: startDate,
      end_date: endDate,
      date_type: 'paid_at',
      page: 1,
      page_size: 50,
      ...query,
    };
    await store.dispatch(`${prefix}/getOrderProducts`, q);
  },
  computed: {
    ...mapGetters({
      orderProducts: `${prefix}/orderProducts`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
    selectedItem() {
      return this.$refs.dataTable.getSelectedItem();
    },
  },
  methods: {
    async refresh() {
      const query = { ...this.$route.query };
      await this.getData(query);
    },
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
    selectDownloadExcel() {
      const params = {
        order_product_ids: [this.selectedItem.id],
      };
      // TODO loading popup
      new ExcelDownload({
        propsData: {
          href: `${prefix}/download_excel`,
          params,
          $axios: this.$store.$axios,
        },
      }).$mount();
    },
    btnCancelReject() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['취소요청'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('취소 요청 상태인 주문 건만 취소 거부 처리할 수 있습니다.');

      new this.$popup.Reason({
        propsData: {
          title: '취소 거부 사유 입력',
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('취소 거부 사유를 입력해주세요.');
            params.order_product_id = this.selectedItem.id;

            const res = await this.$store.dispatch(`${prefix}/cancel_reject`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnCancelAccept() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['취소요청'].includes(this.selectedItem.order_sub_status_str)) {
        this.$popup.showAlertPopup('취소 요청 상태인 주문 건만 취소 완료 처리할 수 있습니다.');
        return;
      }
      new this.$popup.RefundPrice({
        propsData: {
          title: '취소 금액 입력',
          okButtonText: '취소완료',
          okCallback: async (params) => {
            const refundPrice = parseInt(params.refundPrice, 10);
            if (!Number.isInteger(refundPrice)) return this.$popup.showAlertPopup('취소 금액을 정확히 입력해주세요.');

            new this.$popup.Confirm({
              propsData: {
                title: '선택하신 주문건 1건에 대한 취소완료처리를 진행하시겠습니까?',
                okCallback: async (confirmParams) => {
                  const res = await this.$store.dispatch(`${prefix}/cancel_accept`, {
                    order_product_id: this.selectedItem.id,
                    refund_price: refundPrice,
                  });
                  if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

                  this.$popup.showAlertPopup('완료되었습니다.');
                  await this.refresh();
                  confirmParams.$destroy();
                },
              },
            }).$mount();

            params.$destroy();
          },
        },
      }).$mount();
    },
    modifyRefundPrice(orderProduct) {
      new this.$popup.RefundPrice({
        propsData: {
          title: '취소 금액 수정',
          okButtonText: '수정',
          refundPrice: orderProduct.refund_price,
          okCallback: async (params) => {
            const refundPrice = parseInt(params.refundPrice, 10);
            if (!Number.isInteger(refundPrice)) return this.$popup.showAlertPopup('취소 금액을 정확히 입력해주세요.');
            new this.$popup.Confirm({
              propsData: {
                title: '취소 금액을 수정하시겠습니까?',
                okCallback: async (confirmParams) => {
                  const res = await this.$store.dispatch(`${salesPrefix}/update_refund_price`, {
                    order_product_id: orderProduct.id,
                    refund_price: refundPrice,
                  });
                  if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
                  this.$popup.showAlertPopup('완료되었습니다.');
                  await this.refresh();
                  confirmParams.$destroy();
                },
              },
            }).$mount();
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
