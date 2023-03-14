import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/product/qna';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '상품코드', align: 'start', value: 'product_id' },
      { text: '상품명', value: 'name', sortable: false },
      { text: '등록자', value: 'user_id' },
      { text: '상품이미지', value: 'main_image', sortable: false },
      { text: '문의내용', value: 'content' },
      { text: '문의 등록일', value: 'created_at' },
      { text: '추가 문의등록 일자', value: 'updated_at' },
      { text: '문의 글번호', value: 'id' },
      { text: '답글여부', value: 'is_replied' },
      { text: '노출여부', value: 'is_show' },
    ],
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getQnas`, query);
  },
  computed: {
    ...mapGetters({
      qnas: `${prefix}/qnas`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      result: `${prefix}/result`,
    }),
  },
  methods: {
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getQnas`, query);
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
    detailQna(qna) {
      new Popup.Inquiry({
        propsData: {
          qna,
          okCallback: async (params) => {
            if (params.content === '') {
              this.$popup.showAlertPopup('답변할 내용을 입력해주세요');
            } else {
              await this.$store.dispatch(`${prefix}/createReply`, params);
              if (this.result.result === 'success') {
                this.popupAlert('답변이 성공적으로 등록되었습니다.');
                const query = this.$route.query;
                this.getData(query);
              } else this.popupAlert(this.result.message);
              params.$destroy();
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
