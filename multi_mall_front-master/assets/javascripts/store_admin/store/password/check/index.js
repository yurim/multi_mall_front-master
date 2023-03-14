import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/store/password/check';

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
      if (this.password) {
        const params = { password: this.password };
        await this.$store.dispatch(`${prefix}/getAdminVerify`, params);
        if (this.result.result === 'success') this.$router.push({ name: 'store_admin-store-password-change' });
        else this.popupAlert(this.result.message);
      } else {
        this.popupAlert('비밀번호를 입력해주세요.');
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
