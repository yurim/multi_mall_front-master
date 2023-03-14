import { mapGetters } from 'vuex';

const prefix = 'store_admin/template/notices/_type';

export default {
  data: () => ({
    loading: false,
    headers: [
      { text: '제목', value: 'title' },
      { text: '등록일', value: 'created_at' },
      { text: '수정', value: '', sortable: false },
    ],
    templateType: '',
    templateName: '',
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getNotices`, { template_type: params.type.toUpperCase() });
    await store.dispatch('common/getCodes', 'template_type');
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      notices: `${prefix}/notices`,
      totalCount: `${prefix}/totalCount`,
      pageSize: `${prefix}/pageSize`,
    }),
  },
  created() {
    const params = this.$route.params;
    this.templateType = params.type;
    this.codesArray('template_type').forEach((type) => {
      if (type.key.indexOf(this.templateType.toUpperCase()) > -1) this.templateName = type.value;
    });
  },
  methods: {
    async getData(query) {
      this.loading = true;
      query.template_type = this.templateType;
      await this.$store.dispatch(`${prefix}/getNotices`, query);
      this.loading = false;
    },
    async refresh() {
      const query = { ...this.$route.query };
      query.template_type = this.templateType;
      await this.getData(query);
    },
    async onTableOption(query) {
      await this.getData(query);
    },
    selectedDeleteNotices() {
      const templateIds = this.$refs.dataTable.getSelectedItems().map((v) => v.id);
      if (templateIds.length <= 0) return this.$popup.showAlertPopup('삭제할 템블릿을 선택해주세요.');

      new this.$popup.Confirm({
        propsData: {
          title: '선택한 템플릿을 삭제하시겠습니까?',
          okCallback: async (inParams) => {
            const res = await this.$store.dispatch(`${prefix}/deleteNotices`, {
              template_ids: templateIds,
            });

            if (res.data.result === 'success') {
              this.$popup.showAlertPopup('성공적으로 삭제되었습니다.');
              await this.refresh();
            } else {
              this.$popup.showAlertPopup(res.data.message);
            }

            inParams.$destroy();
          },
        },
      }).$mount();
    },
  },
};
