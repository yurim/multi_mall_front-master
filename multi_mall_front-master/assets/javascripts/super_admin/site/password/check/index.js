import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/site/password/check';

export default {
  data: () => ({
    password: '',
  }),
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
    }),
  },
  methods: {
    async confirm() {
      const that = this;
      if (that.password) {
        const params = { password: that.password };
        await that.$store.dispatch(`${prefix}/getAdminVerify`, params);
        if (that.result.result === 'success') that.$router.push({ name: 'super_admin-site-password-change' });
        else that.popupAlert(that.result.message);
      } else {
        that.popupAlert('비밀번호를 입력해주세요.');
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
