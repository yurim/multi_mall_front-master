import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import SelperCommonMixin from '@/components/SelperCommonMixin';

const prefix = 'mypage/inquiry';

export default {
  middleware: 'userAuth',
  mixins: [SelperCommonMixin],
  data: () => ({
    loading: false,
    headers: [
      { text: '문의 종류', value: 'faq_type', align: 'start' },
      { text: '답변 상태', value: 'is_reply' },
      { text: '제목', value: 'title' },
      { text: '작성일', value: 'created_at' },
    ],
  }),
  // async fetch({ store, query }) {
  //   await store.dispatch(`${prefix}/getInquiryList`, query);
  // },
  computed: {
    ...mapGetters({
      inquiryList: `${prefix}/inquiryList`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      result: `${prefix}/result`,
    }),
  },
  methods: {
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getInquiryList`, query);
      this.loading = false;
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    createInquiry() {
      const that = this;
      new Popup.InquiryWrite({
        propsData: {
          okCallback: async (params) => {
            const isEmptyList = [];
            if (!params.faq.faq_type) isEmptyList.push('문의유형');
            if (!params.faq.title) isEmptyList.push('제목');
            if (!params.faq.content) isEmptyList.push('내용');

            if (isEmptyList.length === 0) {
              await that.$store.dispatch(`${prefix}/createInquiry`, params);
              if (that.result.result === 'success') {
                that.popupAlert('문의가 등록되었습니다.');
                that.$router.go(0);
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert(`다음 항목이 비었습니다.\n${isEmptyList.join('\n')}`);
            }
          },
        },
      }).$mount();
    },
    popupAlert(message) {
      new Popup.Alert({
        propsData: {
          title: message,
          okCallback: (params) => params.$destroy(),
        },
      }).$mount();
    },
  },
};
