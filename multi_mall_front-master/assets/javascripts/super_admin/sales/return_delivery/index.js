import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';
import moment from 'moment-timezone';

const prefix = 'super_admin/sales/return_delivery';
const salesPrefix = 'super_admin/sales';

export default {
  data: () => ({
    loading: false,
    headers: [
      { sortable: false, text: '주문번호', align: 'start', value: '' },
      { sortable: false, text: '상품주문번호', value: '' },
      { sortable: false, text: '판매매장', value: '' },
      { sortable: false, text: '주문상태', value: '' },
      { sortable: false, text: '반품 처리상태', value: '' },
      { sortable: false, text: '결제일', value: '' },
      { sortable: false, text: '반품요청일', value: '' },
      { sortable: false, text: '반품완료일', value: '' },
      { sortable: false, text: '취소완료금액', value: '' },
      { sortable: false, text: '주문일시', value: '' },
      { sortable: false, text: '반품비용(편도)', value: '' },
      { sortable: false, text: '반품배송비 지불방법', value: '' },
      { sortable: false, text: '결제수단', value: '' },
      { sortable: false, text: '상품코드', value: '' },
      { sortable: false, text: '판매처', value: '' },
      { sortable: false, text: '상품명', value: '' },
      { sortable: false, text: '옵션정보', value: '' },
      { sortable: false, text: '수량', value: '' },
      { sortable: false, text: '옵션 추가금액', value: '' },
      { sortable: false, text: '상품가격', value: '' },
      { sortable: false, text: '상품별 할인적용금액', value: '' },
      { sortable: false, text: '총 상품 주문금액', value: '' },
      { sortable: false, text: '발주확인일', value: '' },
      { sortable: false, text: '발송예정일', value: '' },
      { sortable: false, text: '발송처리일', value: '' },
      { sortable: false, text: '배송비 지불방법', value: '' },
      { sortable: false, text: '배송비유형', value: '' },
      { sortable: false, text: '수취인 이름', value: '' },
      { sortable: false, text: '수취인 연락처', value: '' },
      { sortable: false, text: '수취인주소', value: '' },
      { sortable: false, text: '교환/반품지', value: '' },
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
  mounted() {
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
    btnCollect() {
      // 수거 처리 - 반품 요청 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['반품요청'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('반품요청 상태의 주문 상품만 수거 처리할 수 있습니다.');

      new this.$popup.ProductPickup({
        propsData: {
          title: '반품 수거처리',
          message: '선택한 주문건에 대한 반품수거를 진행합니다.',
          collectDeliveryType: this.selectedItem.collect_delivery_type_str,
          collectFeeType: this.selectedItem.collect_fee_type_str,
          okCallback: async (params) => {
            if (this.selectedItem.collectDeliveryType === 'DLVRY_CMPNY') {
              if (!params.delivery_method) return this.$popup.showAlertPopup('배송방법을 입력해주세요.');
              if (params.delivery_method === 'PARCEL') {
                if (!params.delivery_company) return this.$popup.showAlertPopup('택배사를 입력해주세요.');
                if (!params.invoice_num) return this.$popup.showAlertPopup('송장번호를 입력해주세요.');
              }
            }
            params.order_product_id = this.selectedItem.id;

            const res = await this.$store.dispatch(`${prefix}/collect`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnCollectComplete() {
      // 수거 완료 처리 - 반품요청, 상품 수거중 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['상품 수거중', '반품요청'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('반품요청 또는 상품 수거중 상태의 주문 상품만 수거 완료 처리할 수 있습니다.');

      new this.$popup.Confirm({
        propsData: {
          title: '선택하신 주문건 1건에 대한 수거완료 처리를 진행하시겠습니까?',
          okCallback: async (params) => {
            const res = await this.$store.dispatch(`${prefix}/collect_complete`, {
              order_product_id: this.selectedItem.id,
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnReturnComplete() {
      // 반품 완료 처리 - 반품요청 또는 상품수거중 또는 수거완료 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (['환불보류'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('환불 보류를 해제한 뒤 진행할 수 있습니다.');
      if (!['반품요청', '상품 수거중', '수거완료'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('반품요청/수거중/수거 완료 상태의 주문 상품만 반품 완료 처리할 수 있습니다.');

      new this.$popup.RefundPrice({
        propsData: {
          title: '취소 금액 입력',
          okButtonText: '반품완료',
          okCallback: async (params) => {
            const refundPrice = parseInt(params.refundPrice, 10);
            if (!Number.isInteger(refundPrice)) return this.$popup.showAlertPopup('취소 금액을 정확히 입력해주세요.');

            new this.$popup.Confirm({
              propsData: {
                title: '선택하신 주문건 1건에 대한 반품완료 처리를 진행하시겠습니까?',
                okCallback: async (confirmParams) => {
                  const res = await this.$store.dispatch(`${prefix}/return_complete`, {
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
    btnReturnReject() {
      // 반품 거부 처리 - 반품요청, 수거완료 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['반품요청', '수거완료'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('반품요청, 수거완료 상태의 주문 상품만 반품거부 처리할 수 있습니다.');

      new this.$popup.Reason({
        propsData: {
          title: '반품거부 사유 입력',
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');
            params.order_product_id = this.selectedItem.id;

            const res = await this.$store.dispatch(`${prefix}/return_reject`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnChange() {
      // 교환으로 변경 - 환불완료 이외의 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (['환불완료'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('반품 완료되지 않은 주문 상품만 교환으로 변경할 수 있습니다.');

      new this.$popup.ReturnToExchange({
        propsData: {
          okCallback: async (params) => {
            params.order_product_id = this.selectedItem.id;
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');

            const res = await this.$store.dispatch(`${prefix}/change`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnRefundPostpone() {
      // 환불 보류 설정 - 수거완료 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['수거완료'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('수거완료 상태의 주문 상품만 환불 보류 설정할 수 있습니다.');

      new this.$popup.Reason({
        propsData: {
          title: '환불 보류 사유 입력',
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('환불 보류 사유를 입력해주세요.');
            params.order_product_id = this.selectedItem.id;

            const res = await this.$store.dispatch(`${prefix}/lock`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnRefundPostponeCancel() {
      // 환불 보류 해제 - 환불보류 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['환불보류'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('환불보류 상태의 주문 상품만 환불보류 해제할 수 있습니다.');

      new this.$popup.Confirm({
        propsData: {
          title: '선택하신 주문건 1건에 대한 환불 보류 설정을 진행하시겠습니까?',
          okCallback: async (params) => {
            const res = await this.$store.dispatch(`${prefix}/unlock`, {
              order_product_id: this.selectedItem.id,
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnEditReturnReason() {
      // 반품 사유 수정 - 반품완료 이외의 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (['환불완료'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('반품 완료되지 않은 주문 상품만 사유를 수정할 수 있습니다.');

      new this.$popup.RequestReturnEdit({
        propsData: {
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');
            params.order_product_id = this.selectedItem.id;
            const res = await this.$store.dispatch(`${prefix}/reason_edit`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnEditFeePayMethod() {
      // 반품 배송비 지불방법 수정 - 반품요청 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['반품요청'].includes(this.selectedItem.order_sub_status_str)) return this.$popup.showAlertPopup('반품 요청 상태의 주문 상품만 반품 배송비 지불 방법을 수정할 수 있습니다.');

      new this.$popup.RequestReturnFeePayMethodEdit({
        propsData: {
          return_fee: this.selectedItem.return_fee,
          okCallback: async (params) => {
            if (!params.collect_fee_type) return this.$popup.showAlertPopup('반품 배송비 지불 방법을 선택해주세요.');
            params.order_product_id = this.selectedItem.id;
            const res = await this.$store.dispatch(`${prefix}/collect_info_edit`, params);
            if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
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
