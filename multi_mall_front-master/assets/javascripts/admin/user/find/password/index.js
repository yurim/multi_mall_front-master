import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'admin/user/find/password';

export default {
  data: () => ({
    userInfo: {
      email: '',
      name: '',
      send_to: '',
      code: '',
      password: '',
      passwordCheck: '',
    },
    isAccount: false,
    isPasswordCheck: false,
    message: '',
  }),
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
    }),
    validation() {
      if (this.isAccount) {
        if (this.userInfo.passwordCheck !== this.userInfo.password) {
          this.isPasswordCheck = false;
          return '비밀번호가 일치하지 않습니다.';
        }
        this.isPasswordCheck = true;
        return '';
      }
      this.isPasswordCheck = true;
      return '';
    },
  },
  methods: {
    async getVerifyNumber() {
      const isEmptyList = [];
      if (!this.userInfo.email) isEmptyList.push('이메일');
      if (!this.userInfo.name) isEmptyList.push('담당자 이름');
      if (!this.userInfo.send_to) isEmptyList.push('담당자 전화번호');
      if (isEmptyList.length === 0) {
        await this.$store.dispatch(`${prefix}/getVerifyNumber`, this.userInfo.send_to);
        if (this.result.result === 'success') this.message = '인증번호가 전송되었습니다. 3분이내로 작성해주세요.';
        else this.popupAlert(this.result.message);
      } else this.popupAlert(`다음 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
    },
    async findPassword() {
      const isEmptyList = [];
      if (!this.userInfo.email) isEmptyList.push('이메일');
      if (!this.userInfo.name) isEmptyList.push('담당자 이름');
      if (!this.userInfo.send_to) isEmptyList.push('담당자 전화번호');
      if (!this.userInfo.code) isEmptyList.push('인증번호');
      if (isEmptyList.length === 0) {
        await this.$store.dispatch(`${prefix}/getFindPassword`, this.userInfo);
        if (this.result.result === 'success') {
          this.isAccount = true;
          this.message = '';
        } else this.popupAlert(this.result.message);
      } else this.popupAlert(`다음 항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
    },
    async changePassword() {
      const isEmptyList = [];
      if (!this.userInfo.email) isEmptyList.push('이메일');
      if (!this.userInfo.name) isEmptyList.push('담당자 이름');
      if (!this.userInfo.send_to) isEmptyList.push('담당자 전화번호');
      if (!this.userInfo.password) isEmptyList.push('새 비밀번호');
      if (!this.userInfo.passwordCheck) isEmptyList.push('새 비밀번호 확인');
      if (isEmptyList.length === 0) {
        if (this.isPasswordCheck) {
          await this.$store.dispatch(`${prefix}/getChangePassword`, this.userInfo);
          if (this.result.result === 'success') {
            this.popupAlert('비밀번호가 변경되었습니다. 로그인화면으로 이동합니다.');
            this.$router.push({ name: 'admin-user-login' });
          } else this.popupAlert(this.result.message);
        }
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
