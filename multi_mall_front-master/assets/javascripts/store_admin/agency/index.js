import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/agency';

export default {
  data: () => ({
    editToggle: false,
    newAgency: {
      name: '',
      is_purchasing_agency: false,
      is_delivery_agency: false,
      require_purchase_confirm: false,
      require_delivery_request: false,
    },
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getAgencyInfo`);
  },
  computed: {
    ...mapGetters({
      agencyInfo: `${prefix}/agencyInfo`,
    }),
  },
  created() {
    this.agencyInfo.forEach((agency) => {
      agency.editMode = false;
    });
  },
  methods: {
    editRow(agency) {
      this.editToggle = !this.editToggle;
      agency.editMode = true;
    },
    async saveRow(agency) {
      const res = await this.$store.dispatch(`${prefix}/updateAgencyInfo`, agency);
      agency.editMode = false;
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
    async addNewAgency() {
      const res = await this.$store.dispatch(`${prefix}/createAgencyInfo`, this.newAgency);
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
    async deleteAgency(agency) {
      new this.$popup.Confirm({
        propsData: {
          title: `[${agency.name}] 업체 정보를 삭제하시겠습니까?`,
          okCallback: async (params) => {
            const res = await this.$store.dispatch(`${prefix}/deleteAgencyInfo`, agency);
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
