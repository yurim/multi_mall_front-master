import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import util from '@/assets/javascripts/util';

const prefix = 'super_admin/product/price_group';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '가격비교 그룹번호', align: 'start', value: 'group_id', sortable: false },
      { text: '관리', value: 'management', sortable: false },
      { text: '그룹생성일자', value: 'created_at', sortable: false },
      { text: '상품수', value: 'product_count', sortable: false },
      { text: '최저가 상품이미지', value: 'image', sortable: false },
      { text: '최저 할인적용가', value: 'sort_price', sortable: false },
      { text: '최저가 판매 매장명', value: 'store', sortable: false },
      { text: '최저가 대표 카테고리', value: 'category', sortable: false },
      { text: '최저가 상품코드', value: 'product_id', sortable: false },
      { text: '최저가 상품명', value: 'product_name', sortable: false },
    ],
    searchType: 'normal',
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getPriceGroupListCount`);
    await store.dispatch(`${prefix}/getPriceGroups`, query);
  },
  computed: {
    ...mapGetters({
      priceGroupListCount: `${prefix}/priceGroupListCount`,
      priceGroups: `${prefix}/priceGroups`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      result: `${prefix}/result`,
    }),
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { query } = this.$route;
      if (query.search_type) {
        this.searchType = query.search_type;
      }
    },
    async getData(query) {
      if (query.keyword) query.keyword = query.keyword.trim();

      if (query.group_ids) {
        // 스플릿, 트림, null 제거
        query.group_ids = query.group_ids.split('\n').map((v) => v.trim()).filter(Boolean);
        // 중복 제거
        query.group_ids = Array.from(new Set(query.group_ids));
      }
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getPriceGroups`, query);
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    async onSearch(query) {
      let isValid = true;
      if (query.group_ids) {
        query.group_ids.split('\n').forEach((groupId) => {
          if (!util.checkMongoDBObjectId(groupId)) {
            isValid = false;
          }
        });

        if (!isValid) {
          this.$popup.showAlertPopup('잘못된 그룹번호가 존재합니다.');
          query.group_ids = '';
          await this.$router.push({ query });
        }
      }

      if (isValid) {
        query.search_type = this.searchType;
        await this.$router.push({ query });
        await this.getData(query);
      }
    },
    async onReset(query) {
      await this.getData(query);
    },
    async refresh() {
      const query = { ...this.$route.query };
      await this.getData(query);
    },
    comma(e) {
      const target = e.target;
      let value = target.value;
      if (value) {
        value = target.value.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        value = '';
      }
      target.value = value;
    },
    noComma(e) {
      const target = e.target;
      target.value = target.value.replace(/,/g, '');
    },
    clickSearchType(searchType) {
      this.searchType = searchType;
    },
    priceGroupChange() {
      new Popup.PriceGroupChange({
      }).$mount();
    },
  },
};
