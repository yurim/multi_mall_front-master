import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';
import moment from 'moment-timezone';

const prefix = 'super_admin/sales/exchange';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '주문번호', align: 'start', value: 'order_num', sortable: false },
      { text: '상품주문번호', value: 'product_order_num', sortable: false },
      { text: '판매매장', value: 'store_name', sortable: false },
      { text: '주문상태', value: 'order_status', sortable: false },
      { text: '주문상세상태', value: 'order_sub_status', sortable: false },
      { text: '교환요청일', value: 'exchange_requested_at', sortable: false },
      { text: '교환완료일', value: 'exchanged_at', sortable: false },
      { text: '주문일시', value: 'ordered_at', sortable: false },
      { text: '교환비용(왕복)', value: '', sortable: false },
      { text: '교환배송비 지불방법', value: '', sortable: false },
      { text: '결제일', value: 'paid_at', sortable: false },
      { text: '상품코드', value: 'product_id', sortable: false },
      { text: '판매처', value: '', sortable: false },
      { text: '상품명', value: 'product_name', sortable: false },
      { text: '옵션정보', value: 'product_option_names', sortable: false },
      { text: '수량', value: 'amount', sortable: false },
      { text: '옵션 추가금액', value: 'option_price', sortable: false },
      { text: '상품가격', value: 'product_price', sortable: false },
      { text: '상품별 할인적용금액', value: 'discount_price', sortable: false },
      { text: '총 상품 주문금액', value: '', sortable: false },
      { text: '발주확인일', value: 'order_checked_at', sortable: false },
      { text: '발송예정일', value: 'expected_dispatched_at', sortable: false },
      { text: '발송처리일', value: 'dispatched_at', sortable: false },
      { text: '배송비 지불방법', value: '', sortable: false },
      { text: '배송비유형', value: '', sortable: false },
      { text: '수취인 이름', value: 'order_delivery_name', sortable: false },
      { text: '수취인 연락처', value: 'order_delivery_phone', sortable: false },
      { text: '수취인주소', value: '', sortable: false },
      { text: '교환/반품지', value: '', sortable: false },
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
    await store.dispatch(`${prefix}/GetDataTable`, q);
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
      await this.$store.dispatch(`${prefix}/GetDataTable`, query);
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
    // 수거 처리(팝업필요)
    btnCollect() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['RQST_EXCHNG'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('교환요청 상태의 주문 상품만 수거 처리할 수 있습니다.');

      new this.$popup.ProductPickup({
        propsData: {
          title: '교환 수거처리',
          message: '선택한 주문건에 대한 교환수거를 진행합니다.',
          collectDeliveryType: this.selectedItem.collectDeliveryTypeStr,
          collectFeeType: this.selectedItem.collectFeeTypeStr,
          okCallback: async (params) => {
            if (this.selectedItem.collectDeliveryType === 'DLVRY_CMPNY') {
              if (!params.delivery_method) return this.$popup.showAlertPopup('배송방법을 입력해주세요.');
              if (params.delivery_method === 'PARCEL') {
                if (!params.delivery_company) return this.$popup.showAlertPopup('택배사를 입력해주세요.');
                if (!params.invoice_num) return this.$popup.showAlertPopup('송장번호를 입력해주세요.');
              }
            }

            const res = await this.$axios.$post(`${prefix}/picking_product`, {
              order_product_ids: [this.selectedItem.id],
              delivery_method: params.delivery_method,
              delivery_company: params.delivery_company,
              invoice_num: params.invoice_num,
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    // 수거 완료 처리(팝업필요)
    btnCompleteCollect() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['PICKNG_PRDCT', 'RQST_EXCHNG'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('교환요청 또는 상품 수거중 상태인 상품주문 건을 선택해주세요.');

      new this.$popup.Confirm({
        propsData: {
          title: '수거 완료 처리 하시겠습니까?("수거 완료처리" 후 "교환재배송" 처리 해주세요.)',
          okCallback: async (e) => {
            const res = await this.$axios.$post(`${prefix}/complete_collect`, {
              order_product_ids: [this.selectedItem.id],
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            e.$destroy();
          },
        },
      }).$mount();
    },
    // 교환 재배송 처리
    btnExchangeRedelivery() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['CMPLT_PICK'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('수거완료 상태인 교환 재배송 처리할 상품주문 건을 선택해주세요.');

      new this.$popup.RedeliveryExchange({
        propsData: {
          title: '교환 재배송 처리',
          message: '선택한 주문건에 대한 재배송 처리를 진행합니다.',
          okCallback: async (params) => {
            if (!params.delivery_method) return this.$popup.showAlertPopup('배송방법을 입력해주세요.');
            if (params.delivery_method === 'PARCEL') {
              if (!params.delivery_company) return this.$popup.showAlertPopup('택배사를 입력해주세요.');
              if (!params.invoice_num) return this.$popup.showAlertPopup('송장번호를 입력해주세요.');
            }

            const res = await this.$axios.$post(`${prefix}/exchange_redelivery`, {
              order_product_ids: [this.selectedItem.id],
              delivery_method: params.delivery_method,
              delivery_company: params.delivery_company,
              invoice_num: params.invoice_num,
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    // 교환 보류
    btnPostponeExchange() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['CMPLT_PICK'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('수거완료 상태인 교환 보류 처리할 상품주문 건을 선택해주세요.');

      new this.$popup.Reason({
        propsData: {
          title: '교환 보류 사유 입력',
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('교환 보류 사유를 입력해주세요.');
            params.order_product_id = this.selectedItem.id;

            const res = await this.$axios.$post(`${prefix}/postpone_exchange`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    // 교환 보류 해제
    btnCancelPostponeExchange() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['PSTPN_EXCHNG'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('교환 보류 해제할 상품주문 건을 선택해주세요.');

      new this.$popup.Confirm({
        propsData: {
          title: '교환 보류 해제 처리 하시겠습니까?',
          okCallback: async (e) => {
            const res = await this.$axios.$post(`${prefix}/cancel_postpone_exchange`, {
              order_product_ids: [this.selectedItem.id],
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            e.$destroy();
          },
        },
      }).$mount();
    },
    // 반품으로 변경
    btnChangeRetrun() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (['CMPLT_EXCHNG'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('교환 완료되지 않은 주문 상품만 반품으로 변경할 수 있습니다.');

      new this.$popup.ExchangeToReturn({
        propsData: {
          okCallback: async (params) => {
            if (!params.collect_delivery_type) return this.$popup.showAlertPopup('반품 수거방법을 선택해주세요.');
            if (!params.collect_fee_type) return this.$popup.showAlertPopup('반품비 지불방법을 선택해주세요.');
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');

            params.order_product_ids = [this.selectedItem.id];
            const res = await this.$axios.$post(`${prefix}/to_return`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    // 교환 사유 수정
    btnEditExchangeReason() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (['CMPLT_EXCHNG'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('교환 완료되지 않은 주문 상품만 사유를 수정할 수 있습니다.');

      new this.$popup.RequestExchangeEdit({
        propsData: {
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');

            params.order_product_id = this.selectedItem.id;
            const res = await this.$axios.$post(`${prefix}/reason`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    // 재배송 정보 수정
    btnEditDelivery() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['EXCHNG_RDLVRY'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('교환 재배송 처리된 상품주문 건을 선택해주세요.');

      new this.$popup.RedeliveryExchange({
        propsData: {
          title: '교환 재배송 정보 수정',
          message: '선택한 주문건에 대한 재배송 정보를 수정합니다.',
          okCallback: async (params) => {
            if (!params.delivery_method) return this.$popup.showAlertPopup('배송방법을 입력해주세요.');
            if (params.delivery_method === 'PARCEL') {
              if (!params.delivery_company) return this.$popup.showAlertPopup('택배사를 입력해주세요.');
              if (!params.invoice_num) return this.$popup.showAlertPopup('송장번호를 입력해주세요.');
            }

            const res = await this.$axios.$post(`${prefix}/delivery`, {
              order_product_ids: [this.selectedItem.id],
              delivery_method: params.delivery_method,
              delivery_company: params.delivery_company,
              invoice_num: params.invoice_num,
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnRejectExchange() {
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['RQST_EXCHNG', 'CMPLT_PICK'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('교환요청, 수거완료 상태의 상품주문 건을 선택해주세요.');

      let redelivery = true;
      if (this.selectedItem.orderSubStatus === 'RQST_EXCHNG') redelivery = false;

      new this.$popup.RejectDeliveryReason({
        propsData: {
          title: '교환거부',
          subTitle: '교환거부 사유',
          redelivery,
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');
            if (redelivery) {
              if (!params.delivery_method) return this.$popup.showAlertPopup('배송방법을 입력해주세요.');
              if (params.delivery_method === 'PARCEL') {
                if (!params.delivery_company) return this.$popup.showAlertPopup('택배사를 입력해주세요.');
                if (!params.invoice_num) return this.$popup.showAlertPopup('송장번호를 입력해주세요.');
              }
            }

            params.order_product_ids = [this.selectedItem.id];
            const res = await this.$axios.$post(`${prefix}/reject`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnEditFeePayMethod() {
      // 교환 배송비 지불방법 수정 - 교환요청 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['RQST_EXCHNG'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('교환 요청 상태의 주문 상품만 교환 배송비 지불 방법을 수정할 수 있습니다.');

      new this.$popup.RequestExchangeFeePayMethodEdit({
        propsData: {
          exchange_fee: this.selectedItem.exchangeFee,
          okCallback: async (params) => {
            if (!params.collect_fee_type) return this.$popup.showAlertPopup('교환 배송비 지불 방법을 선택해주세요.');
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
  },
};
