import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/site/password/change';

export default {
  data: () => ({
    manage: {
      password: '',
      passwordCheck: '',
    },
  }),
  computed: {
    ...mapGetters({
      result: `${prefix}/result`,
    }),
  },
  methods: {
    async change() {
      const that = this;
      const isEmptyList = [];
      if (!that.manage.password) isEmptyList.push('변경할 비밀번호');
      if (!that.manage.passwordCheck) isEmptyList.push('변경할 비밀번호 확인');

      if (isEmptyList.length === 0) {
        // if (that.manage.password === that.manage.passwordCheck) {
        const data = {
          password: that.manage.password,
          change_password: that.manage.passwordCheck,
        };
        await that.$store.dispatch(`${prefix}/patchAdminPassword`, data);
        if (that.result.result === 'success') {
          that.popupAlert('비밀번호가 변경되었습니다.');
        } else {
          that.popupAlert(that.result.message);
        }
        // } else {
        //   return that.popupAlert('비밀번호가 일치하지 않습니다.');
        // }
      } else {
        that.popupAlert(`${isEmptyList.join('\n')}`);
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
