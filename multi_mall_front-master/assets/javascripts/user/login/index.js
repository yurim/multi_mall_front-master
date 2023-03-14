import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'user/login';
const EMAIL = 'email';
const JWT = 'jwt';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    user: {
      email: '',
      password: '',
    },
    rememberId: false,
    nonUser: {
      email: '',
      phone: '',
    },
    message: {
      login: '',
      nonUserOrderInquiry: '',
    },
    isAfterLogin: false,
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getSNSClientIDs`);
  },
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
      snsIds: `${prefix}/snsIds`,
    }),
  },
  mounted() {
    this.initNaverLogin();
  },
  beforeRouteLeave(to, from, next) {
    if (this.isAfterLogin) {
      const pathToMain = ['user-find-email', 'user-find-password']; // 로그인 성공 후 리다이렉트 하기에 부적절한 페이지를 추가하여 사용
      if (pathToMain.includes(to.name)) next({ name: 'main' });
    }
    next();
  },
  beforeMount() {
    const email = Utils.getCookie(document.cookie, EMAIL);
    if (email) {
      this.user.email = email;
      this.rememberId = true;
    }
  },
  methods: {
    initNaverLogin() {
      // eslint-disable-next-line no-undef
      const naverIdLogin = new naver.LoginWithNaverId({
        clientId: this.snsIds.NAVER_CLIENT_ID,
        callbackUrl: `${window.location.origin}/user/oauth_callback/naver`,
        isPopup: false,
      });
      naverIdLogin.init();
    },
    async userLogin() {
      const that = this;
      const jwt = Utils.getCookie(document.cookie, JWT);
      const jwtGrade = jwt ? JSON.parse(atob(jwt.split('.')[1])).info.split('_')[1] : '';
      if (jwtGrade === '0') {
        that.popupAlert('이미 로그인 하셨습니다.');
        that.$router.push({ name: 'main' });
      } else {
        that.message.login = '';
        if (!that.user.email) that.message.login = '아이디';
        if (!that.user.password) {
          if (that.message.login) that.message.login += ' / ';
          that.message.login += '비밀번호';
        }

        if (that.message.login === '') {
          await that.$store.dispatch(`${prefix}/getUserInfo`, that.user);
          if (that.result.result === 'success') {
            if (that.rememberId === true) Utils.addCookie(EMAIL, that.user.email);
            this.isAfterLogin = true;
            that.$router.go(-1);
          } else {
            that.message.login = that.result.message;
          }
        } else {
          that.message.login += '를 입력해주세요.';
        }

        // 비밀번호 영문+숫자+특수문자인지 확인
        const password = that.user.password;
        const isNum = password ? password.search(/[0-9]/g) > -1 : false;
        const isEng = password ? password.search(/[a-zA-Z]/g) > -1 : false;
        const isSpe = password ? password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi) > -1 : false;
        if (!isNum || !isEng || !isSpe || password.search(/\s/) > -1) that.message.login = '비밀번호를 8자 이상의 영문, 숫자, 특수문자 조합으로 입력해주세요.';
      }
    },
    async nonUserOrderInquiry() {
      const that = this;
      that.message.nonUserOrderInquiry = '';
      if (!that.nonUser.email) that.message.nonUserOrderInquiry = '이메일';
      if (!that.nonUser.phone) {
        if (that.message.nonUserOrderInquiry) that.message.nonUserOrderInquiry += ' / ';
        that.message.nonUserOrderInquiry += '휴대폰 번호';
      }

      if (that.message.nonUserOrderInquiry === '') {
        const result = await this.$store.dispatch(`${prefix}/getNonUserOrderInquiry`, that.nonUser);
        if (result.result === 'success') {
          // 비회원 주문조회 페이지로 이동
          that.$router.push({ name: 'non_member-order' });
        } else {
          new Popup.Alert({
            propsData: {
              title: result.message,
              okCallback: (params) => params.$destroy(),
            },
          }).$mount();
        }
      } else {
        that.message.nonUserOrderInquiry += '를 입력해주세요.';
      }
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
