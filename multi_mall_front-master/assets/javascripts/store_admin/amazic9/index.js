import Utils from '@/plugins/utils';
import { mapGetters } from 'vuex';
import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Seoul');
const prefix = 'store_admin/amazic9';

const AMAZIC9_TOKEN = 'amazic9Token';
const AMAZIC9_EMAIL = 'amazic9Email';
const AMAZIC9_EXPIRES = 'amazic9Expires';

export default {
  data: () => ({
    loading: false,
    headers: [
      { sortable: false, value: '', text: '주문번호' },
      { sortable: false, value: '', text: '주문일시' },
      { sortable: false, value: '', text: '받는사람 이름' },
      { sortable: false, value: '', text: '받는사람 연락처' },
      { sortable: false, value: '', text: '받는사람 주소' },
      { sortable: false, value: '', text: '배송대행 신청서' },
    ],
    selected: [],

    amazic9Email: '',
    amazic9Expires: '',
    leftTime: '',

    // pagination
    orderDefaultPage: 0,
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getAbroadOrders`, query);
  },
  computed: {
    ...mapGetters({
      orders: `${prefix}/orders`,
      orderTotalCount: `${prefix}/orderTotalCount`,
      orderPageSize: `${prefix}/orderPageSize`,
    }),
  },
  beforeMount() {
    const query = { ...this.$route.query };
    this.orderDefaultPage = query.page ? parseInt(query.page, 10) : 1;

    // amazic9 auth
    const amazic9Token = Utils.getCookie(document.cookie, AMAZIC9_TOKEN);
    const amazic9Email = Utils.getCookie(document.cookie, AMAZIC9_EMAIL);
    const amazic9Expires = Utils.getCookie(document.cookie, AMAZIC9_EXPIRES);
    if (!(amazic9Token && amazic9Email && amazic9Expires)) {
      return this.$router.push('/store_admin/amazic9/login');
    }
    this.initAmazic9Info(amazic9Email, amazic9Expires);
    this.initExpiresCountdown();
    this.initSelected();
    this.getNotice();
  },
  methods: {
    /**
     * 미신청 주문 선택 배열 초기화
     */
    initSelected() {
      for (let i = 0; i < this.orders.length; i += 1) {
        this.selected.push([]);
      }
    },
    /**
     * amazic9 로그인 정보 초기화
     * @param email - 로그인 이메일
     * @param expires - 로그인 유지 종료 시간
     */
    initAmazic9Info(email, expires) {
      this.amazic9Email = email;
      this.amazic9Expires = expires;
    },
    /**
     * amazic9 로그인 유지 시간 카운트
     */
    initExpiresCountdown() {
      const currentTime = moment();
      const targetTime = moment(this.amazic9Expires);
      const currentTimeUnix = currentTime.unix();
      const targetTimeUnix = targetTime.unix();
      const leftTime = targetTimeUnix - currentTimeUnix;
      let duration = moment.duration(leftTime, 'seconds');
      const interval = 1000;

      const intv = setInterval(() => {
        if (duration.asSeconds() <= 1 || currentTimeUnix >= targetTimeUnix) {
          this.$popup.showAlertPopup('로그인 유지 시간이 만료 되었습니다.');
          this.$router.push('/store_admin/amazic9/login');
          clearInterval(intv);
        } else {
          duration = moment.duration(duration.asSeconds() - 1, 'seconds');
          const timer = {
            hours: (duration.hours() < 10) ? `0${duration.hours()}` : duration.hours(),
            minutes: (duration.minutes() < 10) ? `0${duration.minutes()}` : duration.minutes(),
            seconds: (duration.seconds() < 10) ? `0${duration.seconds()}` : duration.seconds(),
          };
          this.leftTime = `${timer.hours}:${timer.minutes}:${timer.seconds}`;
        }
      }, interval);
    },
    async getNotice(query) {
      const noticeData = await this.$store.dispatch(`${prefix}/getNotice`, query);
      if (noticeData.data.notice) {
        this.popNotice(noticeData.data);
      }
    },
    popNotice(data) {
      const popupYN = Utils.getCookie(document.cookie, `amazic9NoticePopup${data.notice.id}`);
      if (popupYN === 'N') return;
      new this.$popup.Notice({
        propsData: {
          title: data.notice.title,
          content: data.notice.content,
          images: data.notice_images,
          okCallback: async (params) => {
            if (params.close_for_week) {
              const date = new Date();
              date.setDate(date.getDate() + 7);
              document.cookie = `amazic9NoticePopup${data.notice.id}=N; expires=${date.toUTCString()}`;
            }
            params.$destroy();
          },
        },
      }).$mount();
    },
    /**
     * 해외상품 주문조회
     * @param query
     * @returns {Promise<void>}
     */
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getAbroadOrders`, query);
      this.loading = false;
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
    },
    async onOrderPage(query) {
      await this.getData(query);
    },
    async moveDetail(orderNum) {
      await this.$router.push(`/store_admin/amazic9/${orderNum}`);
    },
    /**
     * 미신청 상품 전체 선택 (하나의 주문건에서)
     * @param e - input event
     * @param orderIndex - orders의 index
     */
    async allCheck(e, orderIndex) {
      if (e.target.checked) {
        const unordereds = this.orders[orderIndex].order_products.unordereds;
        if (unordereds.length <= 0) {
          e.target.checked = false;
          return this.$popup.showAlertPopup('배송대행 신청이 가능한 상품이 없습니다.');
        }
        if (unordereds.length > 5) {
          e.target.checked = false;
          return this.$popup.showAlertPopup('배송대행 신청은 한번에 5종류의 제품까지만 신청가능합니다.');
        }
        const orderProductIds = unordereds.map((v) => v.id);
        this.selected.splice(orderIndex, 1, orderProductIds);
      } else {
        this.selected.splice(orderIndex, 1, []);
      }
    },
    async moveRequest(orderId, orderProductIds) {
      const data = {
        orderId,
        orderProductIds,
      };
      await this.$router.push({ name: 'store_admin-amazic9-request', params: data });
    },
    /**
     * 선택한 상품 배송대행 신청
     * @param orderIndex
     */
    async SelectedRequest(orderIndex) {
      const selectedIds = this.selected[orderIndex];
      if (selectedIds.length <= 0) {
        return this.$popup.showAlertPopup('선택한 상품이 없습니다.');
      }
      if (selectedIds.length > 5) {
        return this.$popup.showAlertPopup('배송대행 신청은 한번에 5종류의 제품까지만 신청가능합니다.');
      }
      const order = this.orders[orderIndex];
      await this.moveRequest(order.id, selectedIds);
    },
    /**
     * 모든 상품 배송대행 신청
     * @param orderIndex
     */
    async allRequest(orderIndex) {
      const order = this.orders[orderIndex];
      const orderId = order.id;
      let selectedIds = order.order_products.unordereds.map((v) => v.id);
      if (selectedIds.length <= 0) {
        this.$popup.showAlertPopup('배송대행 신청이 가능한 상품이 없습니다.');
      } else if (selectedIds.length > 5) {
        new this.$popup.Confirm({
          propsData: {
            title: '하나의 신청서에는 제품을 5개까지만 신청이 가능합니다. \'확인\'을 누르시면 상위 5개 상품의 신청서를 작성하실 수 있습니다.',
            okCallback: async (params) => {
              selectedIds = selectedIds.slice(0, 5);
              await this.moveRequest(orderId, selectedIds);
              params.$destroy();
            },
          },
        }).$mount();
      } else {
        await this.moveRequest(orderId, selectedIds);
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
        const res = await this.$store.dispatch(`${prefix}/updateTrackingNum`, data);
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
        const res = await this.$store.dispatch(`${prefix}/getCourier`, deliveryRequestId);
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
  },
};
