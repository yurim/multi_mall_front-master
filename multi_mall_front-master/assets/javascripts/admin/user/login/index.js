import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';

const KEY_JWT = 'jwt';
const NO_VALID_MSG = 'NO VALID USER FOUND';

export default {
  data() {
    return {
      data: {
        email: '',
        password: '',
      },
      rememberId: false,
      message: '',
      userGrade: '',
    };
  },
  computed: {
    ...mapGetters({
      result: 'admin/user/login/result',
    }),
  },
  beforeCreate() {
    // const jwt = Utils.getCookie(document.cookie, 'jwt');
    // console.log(jwt);
  },
  created() {
    // const jwt = Utils.getCookie(document.cookie, 'jwt');
    // console.log(jwt);
  },
  methods: {
    async Login() {
      const error = {
        notCurrent: '이메일 또는 비밀번호가 일치하지 않습니다.',
        empty: '이메일 또는 비밀번호를 입력해주세요.',
      };

      if (this.data.email !== '' && this.data.password !== '') {
        await this.$store.dispatch('admin/user/login/getLogin', this.data);
        if (this.result.result === 'error') {
          if (this.result.message === NO_VALID_MSG) {
            this.message = error.notCurrent;
          } else {
            this.message = this.result.message;
          }
        } else {
          if (this.rememberId === true) Utils.addCookie('admin_email', this.data.email);
          const jwt = Utils.getCookie(document.cookie, 'jwt');
          const info = JSON.parse(atob(jwt.split('.')[1]));
          this.userGrade = info.info.split('_')[1];
          this.redirect();
        }
      } else {
        this.message = error.empty;
      }
    },
    redirect() {
      if (this.userGrade === '1') this.$router.push({ name: 'store_admin-main' });
      if (this.userGrade === '2') this.$router.push({ name: 'super_admin-main' });
    },
  },
  beforeMount() {
    const query = { ...this.$route.query };
    if (query.need_login && query.need_login === 'true') {
      Utils.removeCookie(KEY_JWT);
      this.userGrade = query.grade;
      this.$router.push({});
    }

    const email = Utils.getCookie(document.cookie, 'admin_email');
    if (email) {
      this.data.email = email;
      this.rememberId = true;
    }

    const jwt = Utils.getCookie(document.cookie, 'jwt');

    if (jwt && this.userGrade) {
      this.redirect();
    }
  },
};
