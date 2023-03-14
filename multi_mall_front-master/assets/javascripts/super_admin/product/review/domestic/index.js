import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';
import ExcelDownload from '@/components/ExcelDownload';

const prefix = 'super_admin/product/review/domestic';
const API_PREFIX = 'super_admin/product/review';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '상품코드', align: 'start', value: 'product_id', sortable: false },
      { text: '상품명', value: 'product_name', sortable: false },
      { text: '리뷰타입', value: 'review_type', sortable: false },
      { text: '등록자', value: 'user', sortable: false },
      { text: '리뷰내용', value: 'content', sortable: false },
      { text: '포토', value: 'review_image', sortable: false },
      { text: '평점', value: 'score', sortable: false },
      { text: '판매 매장', value: 'store', sortable: false },
      { text: '카테고리명', value: '', sortable: false },
      { text: '틍록일자', value: 'created_at', sortable: false },
      { text: '최근수정일자', value: 'updated_at', sortable: false },
      { text: '베스트리뷰 여부', value: 'is_best', sortable: false },
      { text: '혜택지급 여부', value: '', sortable: false },
      { text: '노출 여부', value: 'is_show', sortable: false },
      { text: '상품주문번호', value: 'order_num', sortable: false },
      { text: '리뷰글번호', value: 'id', sortable: false },
      { text: '답글여부', value: 'is_replied', sortable: false },
    ],
    selectedCategory: [],
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
      query.select_category = this.selectedCategory;
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
        this.popupAlert('엑셀다운로드 할 매장을 선택해주세요.');
      }
    },
    selectedShow() {
      this.patchReviewShow('is_show', true, '노출');
    },
    selectedHide() {
      this.patchReviewShow('is_show', false, '노출중지');
    },
    patchReviewShow(target, isChecked, title) {
      const that = this;
      const data = [];

      that.$refs.dataTable.getSelectedItems().forEach((item) => {
        const inData = {};
        inData.id = item.id;
        inData[target] = isChecked;
        data.push(inData);
      });

      if (data.length > 0) {
        new Popup.Confirm({
          propsData: {
            title: `선택된 리뷰(들)의 노출상태를 ${title}로 변경하시겠습니까?`,
            okCallback: async (params) => {
              await that.$store.dispatch(`${prefix}/patchReviewShow`, data);
              if (that.result.result === 'success') that.popupAlert('노출상태가 변경되었습니다.');
              else that.popupAlert(that.result.message);
              const query = that.$route.query;
              that.getData(query);
              params.$destroy();
            },
          },
        }).$mount();
      } else {
        that.popupAlert(`${title}로 변경할 리뷰(들)을 선택해주세요.`);
      }
    },
    detailReview(review) {
      const that = this;
      new Popup.Review({
        propsData: {
          review,
          $router: that.$router,
          okCallback: async (params) => {
            if (!params.reply) return this.$popup.showAlertPopup('답변할 내용을 입력해주세요.');
            if (!params.reply_id) { // 답변 등록
              await that.$store.dispatch(`${prefix}/createReply`, params);
            } else { // 답변 수정
              await this.$store.dispatch(`${prefix}/updateReply`, params);
            }
            if (that.result.result === 'success') {
              const query = { ...that.$route.query };
              this.$popup.showAlertPopup('답변이 저장되었습니다.');
              that.getData(query);
            } else that.popupAlert(that.result.message);
            params.$destroy();
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
