import { mapGetters } from 'vuex';

export default {
  async fetch({ store, query }) {
    await store.dispatch('super_admin/user/leaved/getLeavedUsers', query);
  },
  computed: {
    ...mapGetters({
      leavedUsers: 'super_admin/users/leaved/leavedUsers',
      totalCount: 'super_admin/users/leaved/totalCount',
      pageSize: 'super_admin/useres/leaved/pageSize',
    }),
  },
  methods: {
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch('super_admin/users/leaved/getLeavedUsers', query);
      this.loading = false;
    },
    async onSearch(query) {
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
    },
    async onTableOption(query) {
      await this.getData(query);
    },
  },
};
