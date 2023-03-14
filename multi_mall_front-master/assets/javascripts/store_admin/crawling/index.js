import { mapGetters } from 'vuex';

const prefix = 'store_admin/crawling';

export default {
  data: () => ({
    loading: false,
    headers: [
      {
        text: 'D-Whale \n스크랩아이디',
        align: 'start',
        value: '',
        sortable: false,
      },
      { text: '크롤링 대상', value: '', sortable: false },
      { text: '카테고리', value: '', sortable: false },
      { text: '통화단위', value: '', sortable: false },
      { text: '페이지수', value: '', sortable: false },
      { text: '크롤링 시작일시', value: '', sortable: false },
      { text: '크롤링 종료일시', value: '', sortable: false },
      { text: '크롤링수', value: '', sortable: false },
      { text: '상품게시 개수', value: '', sortable: false },
      { text: '상품게시 완료여부', value: '', width: '45px', sortable: false },
    ],
    items: [],
    total: null,
    selectedItems: [],
    categoryKeyword: '',
    categoryKeywords: [],
    isVisibleSearchBox: false,
  }),
  async fetch({ store, query }) {
    if (query.is_transferred && query.is_transferred.split(',').length > 1) {
      query.is_transferred = null;
    }
    await store.dispatch(`${prefix}/getScrapInfos`, query);
  },
  computed: {
    ...mapGetters({
      scrapInfos: `${prefix}/scrapInfos`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
  },
  methods: {
    async getData(query) {
      this.loading = true;
      if (query.is_transferred && query.is_transferred.split(',').length > 1) {
        query.is_transferred = null;
      }
      await this.$store.dispatch(`${prefix}/getScrapInfos`, query);
      this.loading = false;
    },
    async onSearch(query) {
      if (!query.is_transferred) {
        return new this.$popup.Alert({
          propsData: {
            title: '상품게시 완료여부를 선택해주세요.',
            okCallback: async (params) => params.$destroy(),
          },
        }).$mount();
      }
      await this.getData(query);
    },
    async onReset(query) {
      await this.getData(query);
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async searchCategoryKeyword() {
      this.$refs.searchCategory.inputValue = this.categoryKeyword;
      const res = await this.$store.dispatch(`${prefix}/getTempCategories`, {
        keyword: this.categoryKeyword,
      });
      this.categoryKeywords = res.data.data.temp_categories;
    },
    setSearchCategory(e) {
      this.categoryKeyword = e.target.id;
      this.$refs.searchCategory.inputValue = e.target.id;
    },
    setVisibleSearchBox() {
      this.isVisibleSearchBox = true;
    },
    setInvisibleSearchBox() {
      this.isVisibleSearchBox = false;
    },
  },
};
