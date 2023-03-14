import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'admin/user/find/email';

export default {
  data: () => ({
    userInfo: {
      name: '',
      send_to: '',
      code: '',
    },
    message: '',
  }),
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
    }),
  },
  methods: {
    async getVerifyNumber() {
      const isEmptyList = [];
      if (!this.userInfo.send_to) isEmptyList.push('담당자 전화번호');
      if (isEmptyList.length === 0) {
        await this.$store.dispatch(`${prefix}/getVerifyNumber`, this.userInfo.send_to);
        if (this.result.result === 'success') this.message = '인증번호가 전송되었습니다. 3분 내로 입력해주세요.';
        else this.message = this.result.message;
      } else this.popupAlert(`다음 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
    },
    async findId() {
      const isEmptyList = [];
      if (!this.userInfo.name) isEmptyList.push('담당자 이름');
      if (!this.userInfo.send_to) isEmptyList.push('담당자 전화번호');
      if (!this.userInfo.code) isEmptyList.push('인증번호');
      if (isEmptyList.length === 0) {
        await this.$store.dispatch(`${prefix}/getFindEmail`, this.userInfo);
        if (this.result.result === 'success') this.$router.push({ name: 'admin-user-find-email-result' });
        else this.popupAlert(this.result.message);
      } else this.popupAlert(`다음 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
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
