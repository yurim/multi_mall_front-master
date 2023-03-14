import { mapGetters } from 'vuex';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'cs/faq';

export default {
  mixins: [SelperCommonMixin],
  data: () => ({
    faqType: [
      { key: '', value: '전체', isChecked: true },
      { key: 'PRDCT_DLVRY', value: '상품/배송', isChecked: false },
      { key: 'ORDER_PAY', value: '주문/결제', isChecked: false },
      { key: 'CNCL_RFND', value: '취소/반품', isChecked: false },
      { key: 'EVENT_PRMTN', value: '이벤트/프로모션', isChecked: false },
      { key: 'REGIST_STORE', value: '입점/제휴', isChecked: false },
      { key: 'USER', value: '회원 관련', isChecked: false },
      { key: 'ETC', value: '기타', isChecked: false },
    ],
    default_page: 1,
    q: '',
    message: '',
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getFaqList`, query);
  },
  computed: {
    ...mapGetters({
      faqList: `${prefix}/faqList`,
      pageSize: `${prefix}/pageSize`,
      totalCount: `${prefix}/totalCount`,
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
      this.getFaqList(query);
    },
    async getFaqList(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getFaqList`, query);
      await this.$router.push({ query });
      this.loading = false;
    },
    async onPage(query) {
      await this.getFaqList(query);
    },
    async faqTypeChange(e) {
      const that = this;
      const idx = e.target.id;
      that.faqType.forEach((type) => {
        if (type.isChecked === true) type.isChecked = false;
      });
      that.faqType[idx].isChecked = true;

      // const type = that.faqType[idx].key;
      const value = that.faqType[idx].value;
      const query = { ...that.$route.query };

      if (value === '전체') query.faq_type = '';
      else query.faq_type = value;

      await that.getFaqList(query);
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
        await this.getFaqList(query);
      } else {
        this.message = '검색어를 입력해주세요.';
      }
    },
  },
};
