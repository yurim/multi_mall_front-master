import { mapGetters } from 'vuex';
import Utils from '@/plugins/utils';

const prefix = 'store_admin/store/_id';

export default {
  data: () => ({
    profilePreview: '',
    licensePreview: '',
  }),
  async fetch({ store, params }) {
    if (params.id) {
      await store.dispatch(`${prefix}/getStore`, params.id);
    }
  },
  computed: {
    ...mapGetters({
      store: `${prefix}/store`,
    }),
  },
  async mounted() {
    this.initStoreId();
    this.initPreview();
  },
  methods: {
    initStoreId() {
      if (Object.keys(this.store).length <= 0) {
        const jwt = Utils.getCookie(document.cookie, 'jwt');
        if (jwt) {
          const info = JSON.parse(atob(jwt.split('.')[1]));
          const storeId = info.info.split('_')[2];
          if (storeId) {
            let path = this.$router.currentRoute.path;
            if (path[path.length - 1] !== '/') path += '/';
            path += storeId;
            this.$router.replace(path);
          }
        }
      }
    },
    initPreview() {
      if (this.store) {
        if (this.store.profile) this.profilePreview = this.store.profile;
        const sui = this.store.store_business_info;
        if (sui && sui.license) this.licensePreview = sui.license;
      }
    },
    btnStoreLeave() {
      new this.$popup.Reason({
        propsData: {
          title: '퇴점신청을 하시겠습니까?',
          okCallback: async (params) => {
            if (params.reason) params.reason = params.reason.trim();
            if (!params.reason) return this.$popup.showAlertPopup('사유를 입력해주세요.');
            params.id = this.store.id;

            const res = await this.$store.dispatch(`${prefix}/leaveStore`, params);
            params.$destroy();
            if (res.result === 'error') return this.$popup.showAlertPopup(res.message);

            this.$popup.showAlertPopup('완료되었습니다.');
            await this.$store.dispatch(`${prefix}/getStore`, this.store.id);
          },
        },
      }).$mount();
    },
  },
};
