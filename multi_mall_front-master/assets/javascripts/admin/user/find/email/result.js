import { mapGetters } from 'vuex';

const prefix = 'admin/user/find/email';

export default {
  data: () => ({
  }),
  computed: {
    ...mapGetters({
      email: `${prefix}/email`,
      name: `${prefix}/name`,
    }),
  },
  created() {
    if (!this.email && !this.email) this.$router.push({ name: 'admin-user-find-email' });
  },
  methods: {
  },
};
