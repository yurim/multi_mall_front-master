import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/target/info';

export default {
  data: () => ({
    editToggle: false,
    loading: false,
    newTarget: {
      name: '',
      code: '',
      require_purchase: false,
      require_delivery: false,
    },
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getTargetInfo`);
  },
  computed: {
    ...mapGetters({
      targetInfo: `${prefix}/targetInfo`,
    }),
  },
  created() {
    this.targetInfo.forEach((target) => {
      target.editMode = false;
    });
  },
  methods: {
    editRow(target) {
      this.editToggle = !this.editToggle;
      target.editMode = true;
    },
    async saveRow(target) {
      const res = await this.$store.dispatch(`${prefix}/updateTargetInfo`, target);
      target.editMode = false;
      new Popup.Alert({
        propsData: {
          title: res.data.message,
          okCallback: (params) => {
            params.$destroy();
            this.$router.go(0);
          },
        },
      }).$mount();
    },
    async addNewTarget() {
      const res = await this.$store.dispatch(`${prefix}/createTargetInfo`, this.newTarget);
      new Popup.Alert({
        propsData: {
          title: res.data.message,
          okCallback: (params) => {
            params.$destroy();
            this.$router.go(0);
          },
        },
      }).$mount();
    },
    async deleteTarget(target) {
      new this.$popup.Confirm({
        propsData: {
          title: `[${target.name}] 쇼핑몰 정보를 삭제하시겠습니까?`,
          okCallback: async (params) => {
            const res = await this.$store.dispatch(`${prefix}/deleteTargetInfo`, target);
            new Popup.Alert({
              propsData: {
                title: res.data.message,
                okCallback: (inParams) => {
                  inParams.$destroy();
                  this.$router.go(0);
                },
              },
            }).$mount();
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
