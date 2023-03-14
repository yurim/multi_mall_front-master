import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/site/couriers';

export default {
  data: () => ({
    editMode: false,
    newCourier: {
      name: '',
      code: '',
      value: '',
    },
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getCourierInfo`);
  },
  computed: {
    ...mapGetters({
      courierInfo: `${prefix}/courierInfo`,
    }),
  },
  created() {
  },
  methods: {
    async saveInfo(item) {
      let res = null;
      if (item) {
        res = await this.$store.dispatch(`${prefix}/saveCourierInfo`, item);
        new Popup.Alert({
          propsData: {
            title: res.data.message,
            okCallback: (params) => {
              params.$destroy();
              this.$router.go(0);
            },
          },
        }).$mount();
      } else {
        res = await this.$store.dispatch(`${prefix}/saveCourierInfo`, this.newCourier);
        new Popup.Alert({
          propsData: {
            title: res.data.message,
            okCallback: (params) => {
              params.$destroy();
              this.$router.go(0);
            },
          },
        }).$mount();
      }
    },
    async deleteInfo(item) {
      let res = null;
      if (item) {
        res = await this.$store.dispatch(`${prefix}/deleteCourierInfo`, item);
        new Popup.Alert({
          propsData: {
            title: res.data.message,
            okCallback: (params) => {
              params.$destroy();
              this.$router.go(0);
            },
          },
        }).$mount();
      } else {
        this.$popup.showAlertPopup('택배사 정보가 존재하지 않습니다.');
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
  },
};
