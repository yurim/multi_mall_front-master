import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'cs/notice';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    q: '',
    default_page: 1,
    message: '',
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getNotices`, query);
  },
  computed: {
    ...mapGetters({
      notices: `${prefix}/notices`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const query = { ...this.$route.query };
      if (query.q) this.q = query.q;
      else query.q = this.q;
      if (query.page) this.default_page = query.page ? parseInt(query.page, 10) : 1;
      else query.page = this.default_page;
      query.page_size = this.pageSize;
      this.getNotices(query);
    },
    async getNotices(query) {
      this.loading = true;
      await this.$router.push({ query });
      await this.$store.dispatch(`${prefix}/getNotices`, query);
      this.loading = false;
    },
    async onPage(query) {
      await this.getNotices(query);
    },
    contentShow(id) {
      const element = document.getElementById(`content_${id}`);
      if (element.style.display === 'block') element.style.display = 'none';
      else element.style.display = 'block';
    },
    async onSearch(e) {
      this.message = '';
      const target = e.target.id.split('_')[0];
      const element = document.getElementById(target);

      if (element.value) {
        const query = { ...this.$route.query };
        query.q = element.value;
        await this.getNotices(query);
      } else {
        this.message = '검색어를 입력해주세요.';
      }
    },
  },
};
