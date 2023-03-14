import { mapGetters } from 'vuex';
import ExcelDownload from '@/components/ExcelDownload';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');
const prefix = 'store_admin/sales/order';

export default {
  data: () => ({
    loading: false,
    headers: [
      { sortable: false, text: '주문번호', value: '' },
      { sortable: false, text: '상품주문번호', value: '' },
      { sortable: true, text: '주문일시', value: 'ordered_at' },
      { sortable: false, text: '주문상태', value: '' },
      { sortable: false, text: '주문상세상태', value: '' },
      { sortable: false, text: '상품코드', value: '' },
      { sortable: false, text: '판매처', value: '' },
      { sortable: false, text: '상품명', value: '' },
      { sortable: false, text: '옵션정보', value: '' },
      { sortable: false, text: '수량', value: '' },
      { sortable: false, text: '구매자명', value: '' },
      { sortable: false, text: '구매자 ID', value: '' },
      { sortable: false, text: '수취인명', value: '' },
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
    btnDelay() {
      // 발송 지연 처리 - 발송대기 and 발주확인 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['발송대기'].includes(this.selectedItem.orderStatus)) return this.$popup.showAlertPopup('발주 확인 상태인 상품만 지연 처리 할 수 있습니다.');
      if (!['발주확인'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('발주 확인 상태인 상품만 지연 처리 할 수 있습니다.');

      new this.$popup.DelaysDelivery({
        propsData: {
          okCallback: (params) => {
            if (!params.expected_dispatched_at) return this.$popup.showAlertPopup('발송예정날짜를 입력해주세요.');
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('발송지연 상세 사유를 입력해주세요.');
            new this.$popup.Confirm({
              propsData: {
                title: '한번 발송지연 처리 후에는 수정이 불가합니다. 발송지연 처리를 진행하시겠습니까?',
                okCallback: async ({ $destroy }) => {
                  params.order_product_id = this.selectedItem.id;
                  const res = await this.$store.dispatch(`${prefix}/setDelay`, params);
                  if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

                  this.$popup.showAlertPopup('완료되었습니다.');
                  await this.refresh();
                  params.$destroy();
                  $destroy();
                },
              },
            }).$mount();
          },
        },
      }).$mount();
    },
    btnEditDelivery() {
      // 배송지 정보수정 - 발송대기 and 신규주문 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['발송대기'].includes(this.selectedItem.orderStatus)) return this.$popup.showAlertPopup('신규 주문 상태인 상품만 배송지 정보를 수정 할 수 있습니다.');
      if (!['신규주문'].includes(this.selectedItem.orderSubStatus)) return this.$popup.showAlertPopup('신규 주문 상태인 상품만 배송지 정보를 수정 할 수 있습니다.');

      new this.$popup.OrderDeliveryInfo({
        propsData: {
          okCallback: async (params) => {
            let errorMessage = null;
            if (!params.name || !params.name.trim()) {
              errorMessage = '수취인명을 입력해주세요.';
            } else if (!params.phone || !params.phone.trim()) {
              errorMessage = '수취인 연락처를 입력해주세요.';
            } else if (!params.zipcode || !params.zipcode.trim()) {
              errorMessage = '우편번호를 입력해주세요.';
            } else if (!params.address || !params.address.trim()) {
              errorMessage = '주소를 입력해주세요.';
            }
            if (errorMessage) return this.$popup.showAlertPopup(errorMessage);

            const res = await this.$axios.$put(`${prefix}/order_delivery`, {
              order_ids: [this.selectedItem.orderId],
              name: params.name,
              phone: params.phone,
              zipcode: params.zipcode,
              address: params.address,
              detail_address: params.detailAddress,
            });
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnCheckDelivery() {
      const orderProductIds = [];
      let hasDeliveryInfo = true;
      if (['발송대기'].includes(this.selectedItem.orderStatus) && ['신규주문'].includes(this.selectedItem.orderSubStatus)) {
        orderProductIds.push(this.selectedItem.id);
      } else {
        hasDeliveryInfo = false;
      }
      if (hasDeliveryInfo) {
        const params = {
          order_product_ids: orderProductIds,
        };

        if (params.order_product_ids.length > 0) {
          const that = this;
          new this.$popup.Confirm({
            propsData: {
              title: '선택한 상품주문건의 발주확인 처리 하시겠습니까?',
              okCallback: async (inParams) => {
                const res = await that.$axios.$post('store_admin/sales/dispatch/selected_check_delivery', params);
                if (res.result === 'success') {
                  const data = res.data;
                  that.$store.commit(`${prefix}/setOrderStatusOrderProducts`, {
                    order_product_ids: params.order_product_ids,
                    orderStatus: data.orderStatusStr,
                    orderSubStatus: data.orderSubStatusStr,
                  });
                } else {
                  this.$popup.showAlertPopup(res.message);
                }
                inParams.$destroy();
              },
            },
          }).$mount();
        } else {
          this.$popup.showAlertPopup('발주 확인 처리할 상품주문 건을 선택해주세요.');
        }
      } else {
        this.$popup.showAlertPopup('발송대기(신규주문) 상태가 아닙니다.');
      }
    },
    btnCancel() {
      // 취소 요청 - 미결제 또는 발송대기 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['미결제', '발송대기'].includes(this.selectedItem.orderStatus)) return this.$popup.showAlertPopup('발송 전 주문 건만 취소할 수 있습니다.');

      new this.$popup.RequestCancel({
        propsData: {
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('취소 사유를 입력해주세요.');
            params.order_product_id = this.selectedItem.id;

            const res = await this.$store.dispatch(`${prefix}/setCancel`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnReturn() {
      // 판매자 반품접수 - 배송중 또는 배송완료 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['배송중', '배송완료'].includes(this.selectedItem.orderStatus)) return this.$popup.showAlertPopup('배송중 또는 배송완료 상태인 주문만 반품 처리 할 수 있습니다.');

      new this.$popup.RequestReturn({
        propsData: {
          items: [this.selectedItem],
          okCallback: async (params) => {
            if (params.order_product_ids.length <= 0) return this.$popup.showAlertPopup('하나 이상의 주문 상품을 선택해주세요.');
            params.order_product_id = params.order_product_ids[0];
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');

            const res = await this.$store.dispatch(`${prefix}/setReturn`, params);
            if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    btnExchange() {
      // 판매자 교환접수 - 배송중 또는 배송완료 상태에서만 가능
      if (!this.selectedItem) return this.$popup.showAlertPopup('주문 상품을 선택해주세요.');
      if (!['배송중', '배송완료'].includes(this.selectedItem.orderStatus)) return this.$popup.showAlertPopup('배송중 또는 배송완료 상태인 주문만 교환 처리 할 수 있습니다.');

      new this.$popup.RequestExchange({
        propsData: {
          items: [this.selectedItem],
          okCallback: async (params) => {
            if (params.order_product_ids.length <= 0) return this.$popup.showAlertPopup('하나 이상의 주문 상품을 선택해주세요.');
            params.order_product_id = params.order_product_ids[0];
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');

            const res = await this.$store.dispatch(`${prefix}/setExchange`, params);
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
