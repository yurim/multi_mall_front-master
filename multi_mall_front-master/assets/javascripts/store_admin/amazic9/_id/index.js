import { mapGetters } from 'vuex';

const prefixAmazic9 = 'store_admin/amazic9';
const prefix = 'store_admin/amazic9/_id';

export default {
  data: () => ({
    selected: [],
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getAbroadOrder`, params.id);
  },
  computed: {
    ...mapGetters({
      order: `${prefix}/order`,
    }),
  },
  async created() {
    if (!this.order.id) {
      await this.$popup.showAlertPopup('잘못된 접근입니다.');
      await this.$router.replace('/store_admin/amazic9');
    }
  },
  methods: {
    /**
     * 배송대행 신청 페이지로 이동
     * @param orderId
     * @param orderProductIds
     */
    async moveRequest(orderId, orderProductIds) {
      const data = {
        orderId,
        orderProductIds,
      };
      await this.$router.push({ name: 'store_admin-amazic9-request', params: data });
    },
    /**
     * 선택한 상품 배송대행 신청
     */
    async selectedRequest() {
      if (this.selected.length <= 0) {
        return this.$popup.showAlertPopup('선택한 상품이 없습니다.');
      }
      if (this.selected.length > 5) {
        return this.$popup.showAlertPopup('배송대행 신청은 한번에 5종류의 제품까지만 신청가능합니다.');
      }
      await this.moveRequest(this.order.id, this.selected);
    },
    /**
     * 모든 상품 배송대행 신청
     */
    async allRequest() {
      let selectedIds = this.order.order_products.unordereds.map((v) => v.id);
      if (selectedIds.length <= 0) {
        this.$popup.showAlertPopup('배송대행 신청이 가능한 상품이 없습니다.');
      } else if (selectedIds.length > 5) {
        new this.$popup.Confirm({
          propsData: {
            title: '하나의 신청서에는 제품을 5개까지만 신청이 가능합니다. \'확인\'을 누르시면 상위 5개 상품의 신청서를 작성하실 수 있습니다.',
            okCallback: async (params) => {
              selectedIds = selectedIds.slice(0, 5);
              await this.moveRequest(this.order.id, selectedIds);
              params.$destroy();
            },
          },
        }).$mount();
      } else {
        await this.moveRequest(this.order.id, selectedIds);
      }
    },
    /**
     * 해외 트레킹번호 수정
     * @param deliveryProduct
     */
    async updateTrackingNum(deliveryProduct) {
      if (!deliveryProduct.tracking_num) return this.$popup.showAlertPopup('해외 트레킹번호를 입력해주세요');
      await this.$createLoading(async () => {
        const data = {
          delivery_product_id: deliveryProduct.id,
          tracking_num: deliveryProduct.tracking_num,
        };
        const res = await this.$store.dispatch(`${prefixAmazic9}/updateTrackingNum`, data);
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
        this.$popup.showAlertPopup('저장이 완료되었습니다');
      });
    },
    /**
     * 택배정보 조회 팝업
     * @param deliveryRequestId
     */
    async getCourier(deliveryRequestId) {
      await this.$createLoading(async () => {
        const res = await this.$store.dispatch(`${prefixAmazic9}/getCourier`, deliveryRequestId);
        if (res.result === 'error') return this.$popup.showAlertPopup(res.message);
        new this.$popup.Amazic9Courier({
          propsData: {
            delivery_status_str: res.data.delivery_status_str,
            courier_name: res.data.courier_name,
            kor_tracking_num: res.data.kor_tracking_num,
            okCallback: async (params) => {
              params.$destroy();
            },
          },
        }).$mount();
      });
    },
    /**
     * 미신청 상품 전체 선택
     * @param e - input event
     */
    async allCheck(e) {
      if (e.target.checked) {
        this.selected = this.order.order_products.unordereds.map((v) => v.id);
      } else {
        this.selected = [];
      }
    },
  },
};
