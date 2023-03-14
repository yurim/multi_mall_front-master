import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'super_admin/product/qna';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '상품코드', align: 'start', value: 'product_id' },
      { text: '상품명', value: 'name', sortable: false },
      { text: '등록자', value: 'user_id' },
      { text: '상품이미지', value: 'main_image' },
      { text: '문의내용', value: 'content' },
      { text: '판매매장', value: 'store_id' },
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
    selectedShow() {
      this.patchQnaShow('is_show', true, '노출');
    },
    selectedHide() {
      this.patchQnaShow('is_show', false, '노출중지');
    },
    patchQnaShow(target, isChecked, title) {
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
            title: `선택된 문의(들)의 노출상태를 ${title}로 변경하시겠습니까?`,
            okCallback: async (params) => {
              await this.$store.dispatch(`${prefix}/patchQnaShow`, data);
              if (that.result.result === 'success') that.popupAlert('노출상태가 변경되었습니다.');
              else that.popupAlert(that.result.message);
              const query = that.$route.query;
              that.getData(query);
              params.$destroy();
            },
          },
        }).$mount();
      } else {
        that.popupAlert(`${title}로 변경할 문의(들)을 선택해주세요.`);
      }
    },
    detailQna(qna) {
      const that = this;
      new Popup.Inquiry({
        propsData: {
          qna,
          okCallback: async (params) => {
            if (params.content) {
              await that.$store.dispatch(`${prefix}/createReply`, params);
              if (that.result.result === 'success') {
                that.popupAlert('답변이 성공적으로 등록되었습니다.');
                that.$nuxt.refresh();
                params.$destroy();
              } else {
                that.popupAlert(that.result.message);
              }
            } else {
              that.popupAlert('답변할 내용을 입력해주세요');
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
