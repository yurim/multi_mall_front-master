import { mapGetters } from 'vuex';
import Popup from '@/components/popups/popup';

const prefix = 'store_admin/product/batch_update';

export default {
  data: () => ({
    loading: false,
    headers: [
    ],
    result: [],
  }),
  async fetch({ store }) {
    await store.dispatch(`${prefix}/getBatchUpdateResult`);
  },
  computed: {
    ...mapGetters({
      batchUpdateResult: `${prefix}/batchUpdateResult`,
      progressTotal: `${prefix}/progressTotal`,
      progressDone: `${prefix}/progressDone`,
      finished: `${prefix}/finished`,
      startedAt: `${prefix}/startedAt`,
      endedAt: `${prefix}/endedAt`,
    }),
  },
  methods: {
    uploadProductExcel(e) {
      if (e.target.files.length > 0) {
        const f = e.target.files[0];
        new Popup.Confirm({
          propsData: {
            title: '엑셀 파일을 업로드 하시겠습니까?',
            okCallback: async (params) => {
              const formData = new FormData();
              formData.append('product', f);
              const res = await this.$store.dispatch(`${prefix}/requestBatchUpdate`, formData);
              if (res) {
                if (res.data.result === 'success') {
                  this.$popup.showAlertPopup('상품 일괄 업데이트 요청 완료', () => {
                    this.popProgressBar();
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
    popProgressBar() {
      const progressPop = new this.$popup.ProgressBar({
        propsData: {
          checkProgress: async () => {
            await this.$store.dispatch(`${prefix}/getBatchUpdateResult`);
            if (this.finished || this.progressDone === this.progressTotal) {
              progressPop.ok();
            }
            return { done: this.progressDone, total: this.progressTotal };
          },
          okCallback: async (params) => {
            console.log(this.batchUpdateResult);
            params.$destroy();
          },
        },
      }).$mount();
    },
  },
};
