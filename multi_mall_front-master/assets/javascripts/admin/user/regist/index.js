import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'admin/user/regist';

export default {
  data() {
    return {
      // items: [
      //   { text: '이용약관', value: 'terms' },
      //   { text: '개인정보수집이용', value: 'privacy' },
      //   { text: '개인정보제3자제공', value: 'third' },
      // ],
      // checked: [],
      userInfo: {
        email: '',
        password: '',
        name: '',
        contact: '',
        authNumber: '',
      },
      passwordConfirm: '',
      message: '',
    };
  },
  computed: {
    // allCheck: {
    //   get() {
    //     return this.items ? this.checked.length === this.items.length : false;
    //   },
    //   set(value) {
    //     const checked = [];
    //     if (value) {
    //       this.items.forEach((item) => {
    //         checked.push(item.value);
    //       });
    //     }
    //     this.checked = checked;
    //   },
    // },
    ...mapGetters({
      result: `${prefix}/result`,
    }),
  },
  methods: {
    passwordCheck() {
      if (this.userInfo.password === this.passwordConfirm) this.message = '';
      else this.message = '비밀번호가 일치하지 않습니다.';
    },
    async getAuthNumber() {
      if (!this.userInfo.authNumber) {
        const isEmptyList = [];
        if (!this.userInfo.email) isEmptyList.push('이메일');
        if (!this.userInfo.password) isEmptyList.push('비밀번호');
        if (!this.passwordConfirm) isEmptyList.push('비밀번호 확인');
        if (!this.userInfo.name) isEmptyList.push('이름');
        if (!this.userInfo.contact) isEmptyList.push('전화번호');

        if (isEmptyList.length === 0) {
          const res = await this.$axios.post(`${prefix}/`, { params: this.userInfo });
          if (res.data.status === 'success') this.userInfo.authNumber = res.data.data.authNumber;
          else this.popupAlert(res.data.message);
        } else {
          this.popupAlert(`다음 필수항목을 입력해주세요.\n${isEmptyList.join('\n')}`);
        }
      }
    },
    async createAdmin() {
      this.message = '';
      if (this.userInfo.email && this.userInfo.password && this.userInfo.name && this.userInfo.contact && this.userInfo.authNnumber) {
        await this.$store.dispatch(`${prefix}/createAdmin`, this.userInfo);
        if (this.result.result === 'success') {
          this.popupAlert('회원가입이 완료되었습니다.\n로그인해주세요.');
          this.$router.push({ name: 'admin-user-login' });
        } else {
          this.popupAlert(this.result.message);
        }
      } else {
        this.message = '모든 항목을 입력해주세요.';
      }
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (inParams) => inParams.$destroy(),
        },
      }).$mount();
    },
  },
};
