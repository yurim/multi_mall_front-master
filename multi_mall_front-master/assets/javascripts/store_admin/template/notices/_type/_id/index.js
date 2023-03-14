import { mapGetters } from 'vuex';

const prefix = 'store_admin/template/notices/_type/_id';

export default {
  data: () => ({
    templateType: '',
    templateName: '',
    templateId: '',
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getNotice`, params);
    await store.dispatch('common/getCodes', 'template_type');
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
      notice: `${prefix}/notice`,
    }),
  },
  created() {
    const params = this.$route.params;
    this.templateId = params.id;
    this.templateType = params.type;
    this.codesArray('template_type').forEach((type) => {
      if (type.key.toLowerCase() === this.templateType) this.templateName = type.value;
    });
  },
  methods: {
    deleteNotices() {
      const params = this.$route.params;
      new this.$popup.Confirm({
        propsData: {
          title: '이 템플릿을 삭제하시겠습니까?',
          okCallback: async (inParams) => {
            const res = await this.$store.dispatch(`${prefix}/deleteTemplate`, {
              template_ids: [params.id],
            });

            if (res.data.result === 'success') {
              this.$popup.showAlertPopup('성공적으로 삭제되었습니다.');
              await this.$router.push({ name: 'store_admin-template-notices-type', params: { type: this.templateType } });
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
