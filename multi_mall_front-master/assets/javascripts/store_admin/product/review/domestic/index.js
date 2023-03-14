import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import ExcelDownload from '@/components/ExcelDownload';

const prefix = 'store_admin/product/review/domestic';

const API_PREFIX = 'store_admin/product/review';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '상품코드', align: 'start', value: 'product_id', sortable: false },
      { text: '상품명', value: 'product_name', sortable: false },
      { text: '리뷰타입', value: 'type', sortable: false },
      { text: '등록자', value: 'user', sortable: false },
      { text: '리뷰내용', value: 'content', sortable: false },
      { text: '포토', value: 'image', sortable: false },
      { text: '평점', value: 'score', sortable: false },
      { text: '카테고리명', value: 'category', sortable: false },
      { text: '틍록일자', value: 'created_at', sortable: false },
      { text: '최근수정일자', value: 'updated_at', sortable: false },
      { text: '베스트리뷰 여부', value: 'is_best', sortable: false },
      // { text: '혜택지급 여부', value: 'is_' },
      { text: '상품주문번호', value: 'order_num', sortable: false },
      { text: '리뷰글번호', value: 'id', sortable: false },
      { text: '답글여부', value: 'is_replied', sortable: false },
    ],
  }),
  async fetch({ store, query }) {
    await store.dispatch(`${prefix}/getReviews`, query);
  },
  computed: {
    ...mapGetters({
      reviews: `${prefix}/reviews`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
      result: `${prefix}/result`,
    }),
  },
  methods: {
    async getData(query) {
      this.loading = true;
      await this.$store.dispatch(`${prefix}/getReviews`, query);
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
    downloadExcel() {
      const that = this;
      new Popup.ExcelDownload({
        propsData: {
          totalCount: that.totalCount,
          okCallback(params) {
            const query = {
              ...that.$route.query,
            };
            query.page_size = params.pageSize;
            query.page = params.page;

            new ExcelDownload({
              propsData: {
                href: `${API_PREFIX}/download_excel`,
                params: query,
                $axios: this.$store.$axios,
              },
            }).$mount();
          },
        },
      }).$mount();
    },
    selectDownloadExcel() {
      const params = {
        review_ids: [],
      };
      this.$refs.dataTable.getSelectedItems().forEach((item) => {
        params.review_ids.push(item.id);
      });
      if (params.review_ids.length > 0) {
        new ExcelDownload({
          propsData: {
            href: `${API_PREFIX}/download_excel`,
            params,
            $axios: this.$store.$axios,
          },
        }).$mount();
      } else {
        this.popupAlert('엑셀다운로드 할 리뷰를 선택해주세요.');
      }
    },
    detailReview(review) {
      new Popup.Review({
        propsData: {
          review,
          $router: this.$router,
          okCallback: async (params) => {
            if (!params.reply) return this.$popup.showAlertPopup('답변할 내용을 입력해주세요.');
            if (!params.reply_id) { // 답변 등록
              await this.$store.dispatch(`${prefix}/createReply`, params);
            } else { // 답변 수정
              await this.$store.dispatch(`${prefix}/updateReply`, params);
            }
            if (this.result.result === 'success') {
              const query = { ...this.$route.query };
              this.$popup.showAlertPopup('답변이 저장되었습니다.');
              await this.getData(query);
              params.$destroy();
            } else this.popupAlert(this.result.message);
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
    uploadNaverReview(e) {
      if (e.target.files.length > 0) {
        const f = e.target.files[0];
        new Popup.Confirm({
          propsData: {
            title: '네이버 리뷰 엑셀 파일을 업로드 하시겠습니까?',
            okCallback: async (params) => {
              const formData = new FormData();
              formData.append('naver_review', f);
              const res = await this.$axios.post(`${API_PREFIX}/upload_excel`, formData, {
                headers: {
                  'content-type': 'multipart/form-data',
                },
              });

              if (res) {
                if (res.data.result === 'success') {
                  this.$popup.showAlertPopup('리뷰를 업데이트 하였습니다.', () => {
                    this.$router.go(0);
                  });
                } else {
                  this.$popup.showAlertPopup(res.data.message);
                }
              }

              params.$destroy();
            },
          },
        }).$mount();
      }
    },
  },
};
