import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');
const prefix = 'store_admin/sales/delivery';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '주문번호', align: 'start', value: 'order_num', sortable: false },
      { text: '상품주문번호', value: 'product_order_num', sortable: false },
      { text: '배송방법', value: '', sortable: false },
      { text: '택배사', value: '', sortable: false },
      { text: '운송장 번호', value: '', sortable: false },
      { text: '배송추적', value: '', sortable: false },
      { text: '주문자명', value: 'name', sortable: false },
      { text: '주문자연락처', value: 'phone', sortable: false },
      { text: '주문자 ID', value: 'email', sortable: false },
      { text: '주문상태', value: 'order_status', sortable: false },
      { text: '주문일시', value: 'ordered_at', sortable: false },
      { text: '결제수단', value: '', sortable: false },
      { text: '결제위치', value: '', sortable: false },
      { text: '결제일', value: 'paid_at', sortable: false },
      { text: '상품코드', value: 'product_id', sortable: false },
      { text: '판매처', value: '', sortable: false },
      { text: '상품명', value: 'product_name', sortable: false },
      { text: '옵션정보', value: '', sortable: false },
      { text: '수량', value: 'amount', sortable: false },
      { text: '옵션 추가금액', value: 'option_price', sortable: false },
      { text: '상품가격', value: 'product_price', sortable: false },
      { text: '상품별 할인적용금액', value: '', sortable: false },
      { text: '총 상품 주문금액', value: '', sortable: false },
      { text: '발주확인일', value: 'order_checked_at', sortable: false },
      { text: '발송예정일', value: 'expected_dispatched_at', sortable: false },
      { text: '발송처리일', value: 'dispatched_at', sortable: false },
      { text: '배송비 지불방법', value: '', sortable: false },
      { text: '배송비유형', value: '', sortable: false },
      { text: '수취인 이름', value: 'order_delivery_name', sortable: false },
      { text: '수취인 연락처', value: 'order_delivery_phone', sortable: false },
      { text: '배송지', value: '', sortable: false },
      { text: '구매확정요청일', value: 'decide_purchase_requested_at', sortable: false },
      { text: '우편번호', value: '', sortable: false },
      { text: '배송메세지', value: '', sortable: false },

    ],
  }),
  async fetch({ store }) {
    // default 1주일 조회
    const startDate = moment().subtract(1, 'weeks').add(1, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    const q = {
      start_date: startDate,
      end_date: endDate,
      date_type: 'paid_at',
      page: 1,
      page_size: 50,
    };
    await store.dispatch(`${prefix}/GetDataTable`, q);
  },
  computed: {
    ...mapGetters({
      orderProducts: `${prefix}/orderProducts`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
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
    getSelectedOrderProductIds() {
      const orderProductIds = [];
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        orderProductIds.push(item.id);
      });
      return orderProductIds;
    },
    selectDownloadExcel(e) {
      const params = {
        order_product_ids: this.getSelectedOrderProductIds(),
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
    // 배송완료 처리
    btnUpdateDeliveryComplete() {
      const orderProductIds = [];
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        if (item.orderStatus === 'DLVRNG' || item.orderSubStatus === 'EXCHNG_RDLVRY') {
          orderProductIds.push(item.id);
        }
      });

      if (orderProductIds.length > 0) {
        const that = this;
        const message = `선택하신 ${orderProductIds.length}건에 대한 배송완료 처리를 진행하시겠습니까?`;
        new this.$popup.Confirm({
          propsData: {
            title: message,
            okCallback: async (e) => {
              const res = await that.$axios.$post(`${prefix}/update_delivery_complete`, {
                order_product_ids: orderProductIds,
              });

              if (res.result === 'success') {
                await this.refresh();
              } else {
                this.$popup.showAlertPopup(res.data.message);
              }

              e.$destroy();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('배송중인 상품주문건을 선택해주세요.');
      }
    },
    // 구매 확정 요청
    btnDecidePurchaseRequest() {
      const orderProductIds = [];
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        if (item.orderStatus === 'DLVRY_CMPLT') {
          orderProductIds.push(item.id);
        }
      });

      if (orderProductIds.length > 0) {
        const that = this;
        const message = `선택하신 ${orderProductIds.length}건에 대한 구매확정 요청을 진행하시겠습니까?`;
        new this.$popup.Confirm({
          propsData: {
            title: message,
            okCallback: async (e) => {
              const res = await that.$axios.$post(`${prefix}/request_decide_purchase`, {
                order_product_ids: orderProductIds,
              });

              if (res.result === 'success') {
                await this.refresh();
              } else {
                this.$popup.showAlertPopup(res.data.message);
              }

              e.$destroy();
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('배송완료인 상품주문건을 선택해주세요.');
      }
    },
    btnSetReturn() {
      if (this.$refs.dataTable.getSelectedItems().length <= 0) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');

      const that = this;
      new this.$popup.RequestReturn({
        propsData: {
          items: that.$refs.dataTable.getSelectedItems(),
          okCallback: async (params) => {
            if (params.order_product_ids.length <= 0) return this.$popup.showAlertPopup('하나 이상의 주문 상품을 선택해주세요.');
            if (!params.collect_delivery_type) return this.$popup.showAlertPopup('반품 수거방법을 선택해주세요.');
            if (!params.collect_fee_type) return this.$popup.showAlertPopup('반품비 지불방법을 선택해주세요.');
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');

            const res = await that.$axios.$post(`${prefix}/return`, params);
            if (res.data.result === 'error') {
              this.$popup.showAlertPopup(res.data.message);
            } else {
              await this.refresh();
              params.$destroy();
            }
          },
        },
      }).$mount();
    },
    btnSetExchange() {
      if (this.$refs.dataTable.getSelectedItems().length <= 0) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');

      const that = this;
      new this.$popup.RequestExchange({
        propsData: {
          items: that.$refs.dataTable.getSelectedItems(),
          okCallback: async (params) => {
            if (params.order_product_ids.length <= 0) return this.$popup.showAlertPopup('하나 이상의 주문 상품을 선택해주세요.');
            if (!params.collect_delivery_type) return this.$popup.showAlertPopup('교환 수거방법을 선택해주세요.');
            if (!params.collect_fee_type) return this.$popup.showAlertPopup('교환비 지불방법을 선택해주세요.');
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');

            const res = await that.$axios.$post(`${prefix}/exchange`, params);
            if (res.data.result === 'error') {
              this.$popup.showAlertPopup(res.data.message);
            } else {
              await this.refresh();
              params.$destroy();
            }
          },
        },
      }).$mount();
    },
  },
};
