import { mapGetters } from 'vuex';

const prefix = 'store_admin/template/abroad/_type';

export default {
  data: () => ({
    template_type: '',
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getTemplate`, params);
  },
  computed: {
    ...mapGetters({
      template: `${prefix}/abroad`,
    }),
  },
  created() {
    this.template_type = this.$route.params.type;
  },
};
