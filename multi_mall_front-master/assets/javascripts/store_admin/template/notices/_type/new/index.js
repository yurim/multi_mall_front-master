import { mapGetters } from 'vuex';

const prefix = 'store_admin/template/notices/_type/new';

export default {
  data: () => ({
    templateType: '',
    templateName: '',
    notice: {
      template_type: '',
      name: '',
      content: '',
      template_images: [],
    },
  }),
  async fetch({ store }) {
    await store.dispatch('common/getCodes', 'template_type');
  },
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
    }),
  },
  async created() {
    const params = this.$route.params;

    if (params.type.indexOf('prdct_ntc') > -1 || params.type.indexOf('exchng_rtnd') > -1 || params.type.indexOf('dlvry_ntc') > -1) {
      this.templateType = params.type;
      this.codesArray('template_type').forEach((type) => {
        if (type.key.indexOf(this.templateType.toUpperCase()) > -1) {
          this.templateName = type.value;
          this.notice.template_type = type.key;
        }
      });
    } else {
      this.$popup.showAlertPopup('잘못된 접근입니다.');
      await this.$router.push({ name: 'store_admin-template-notices-type', params: { type: 'dlvry_ntc' } });
    }
  },
  methods: {
    onEditor(data) {
      this.notice.content = data.content;
      this.notice.template_images = data.detail_images;
    },
    async createNotice() {
      const isEmptyList = [];
      if (!this.notice.name) isEmptyList.push('템플릿명');
      if (!this.notice.content) isEmptyList.push('템플릿내용');
      if (isEmptyList.length > 0) return this.$popup.showAlertPopup(`항목을 모두 입력해주세요.\n${isEmptyList.join(',')}`);

      const formData = new FormData();

      formData.append('template_type', this.notice.template_type);
      formData.append('name', this.notice.name);
      formData.append('content', this.notice.content);
      this.notice.template_images.forEach((v) => {
        formData.append('template_images', v.image);
      });

      const res = await this.$store.dispatch(`${prefix}/createNotice`, formData);
      if (res.data.result === 'success') {
        this.$popup.showAlertPopup('템플릿이 등록되었습니다.');
        await this.$router.push({ name: 'store_admin-template-notices-type', params: { type: this.templateType } });
      } else {
        this.$popup.showAlertPopup(res.data.message);
      }
    },
  },
};
