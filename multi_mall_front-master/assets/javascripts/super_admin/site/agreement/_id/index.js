import { mapGetters } from 'vuex';

export default {
  data: () => ({
    agreement: {
      id: '',
      agreement_type: '',
      agreement_type_str: '',
      content: '',
    },
  }),
  async fetch({ store, params }) {
    await store.dispatch('common/getAgreements', [params.id]);
  },
  computed: {
    ...mapGetters({
      agreementObject: 'common/agreementObject',
    }),
  },
  created() {
    const params = this.$route.params;
    Object.keys(this.agreementObject(params.id)).forEach((key) => {
      this.agreement[key] = this.agreementObject(params.id)[key];
    });
    this.agreement.agreement_type = this.agreement.agreement_type.toLowerCase();
  },
};
