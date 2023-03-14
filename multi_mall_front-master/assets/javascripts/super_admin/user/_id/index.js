import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/user/_id';

export default {
  data: () => ({
    loading: false,
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getUserInfo`, params.id);
  },
  computed: {
    ...mapGetters({
      userInfo: `${prefix}/userInfo`,
      result: `${prefix}/result`,
    }),
  },
  methods: {
    // init() {
    //   this.userInfo.point_saving.forEach((item) => {
    //     if (item.save_type === 'BUY') item.type_str = '구매';
    //     if (item.save_type === 'CANCEL') item.type_str = '포인트 사용 취소';
    //     if (item.save_type === 'SIGN_UP') item.type_str = '회원가입 적립금';
    //     if (item.save_type === 'TXT_REVW') item.type_str = '일반 리뷰 작성';
    //     if (item.save_type === 'PHT_REVW') item.type_str = '사진 리뷰 작성';
    //   });
    // },
    async getData() {
      this.loading = true;
      const params = this.$route.params;
      await this.$store.dispatch(`${prefix}/getUserInfo`, params.id);
      this.loading = false;
    },
    updateCurrentPoint() {
      const that = this;
      new Popup.UserPoint({
        propsData: {
          okCallback: async (params) => {
            const isEmptyList = [];
            if (!params.type) isEmptyList.push('포인트 수정 구분');
            if (!params.reason) isEmptyList.push('포인트 수정 사유');
            if (!params.point) isEmptyList.push('포인트 금액');

            if (isEmptyList.length === 0) {
              const data = {};
              data.id = that.$route.params.id;
              data.type = params.type;
              data.reason = params.reason;
              data.point = params.point;
              await that.$store.dispatch(`${prefix}/patchPoint`, data);
              if (that.result.result === 'success') {
                that.popupAlert('포인트가 수정되었습니다.');
                that.getData();
                params.$destroy();
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert(`다음항목들을 모두 입력해주세요.\n${isEmptyList.join('\n')}`);
            }
          },
        },
      }).$mount();
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
};
