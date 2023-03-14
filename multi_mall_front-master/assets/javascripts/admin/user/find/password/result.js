import Utils from '@/plugins/utils';

export default {
  data: () => ({
    email: '',
  }),
  beforeMount() {
    this.email = Utils.getCookie(document.cookie, 'email');
    if (this.email) {
      this.$router.push({ name: 'admin-user-find-password' });
    }
  },
  methods: {
    routeFindId() {
      this.$router.push({ name: 'admin-user-find-email' });
    },
    routeLogin() {
      Utils.removeCookie('email');
      this.$router.push({ name: 'admin-user-login' });
    },
  },
};
