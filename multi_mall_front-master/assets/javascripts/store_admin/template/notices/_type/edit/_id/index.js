import { mapGetters } from 'vuex';
import _ from 'lodash';

const prefix = 'store_admin/template/notices/_type/edit/_id';

export default {
  data: () => ({
    templateType: '',
    templateName: '',
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
    this.templateType = params.type;
    this.codesArray('template_type').forEach((type) => {
      if (type.key.toLowerCase() === this.templateType) this.templateName = type.value;
    });

    if (this.notice.template_images != null && this.notice.template_images.length > 0) {
      this.notice.template_images.forEach((image) => {
        image.original_order = image.order;
      });
    }
  },
  methods: {
    async updateNotices() {
      const formData = new FormData();

      formData.append('id', this.notice.id);
      formData.append('content', this.notice.content);
      formData.append('name', this.notice.name);
      const templateImages = _.map(this.notice.template_images, (ti) => ({ order: ti.order, original_order: ti.original_order ? ti.original_order : null }));
      formData.append('template_images', JSON.stringify(templateImages));
      this.notice.template_images.forEach((v) => {
        if (v.is_image_file) formData.append(`image_files_${v.order}`, v.image);
      });

      const res = await this.$store.dispatch(`${prefix}/updateTemplate`, formData);
      if (res.data.result === 'success') {
        this.$popup.showAlertPopup('성공적으로 저장되었습니다.');
        await this.$router.push({ name: 'store_admin-template-notices-type-id', params: { type: this.templateType, id: this.notice.id } });
      } else {
        this.$popup.showAlertPopup(res.data.message);
      }
    },
    deleteNotices() {
      new this.$popup.Confirm({
        propsData: {
          title: '이 템플릿을 삭제하시겠습니까?',
          okCallback: async (params) => {
            const res = await this.$store.dispatch(`${prefix}/deleteTemplate`, {
              template_ids: [this.notice.id],
            });

            if (res.data.result === 'success') {
              this.$popup.showAlertPopup('성공적으로 삭제되었습니다.');
              await this.$router.push({ name: 'store_admin-template-notices-type', params: { type: this.templateType } });
            } else {
              this.$popup.showAlertPopup(res.data.message);
            }

            params.$destroy();
          },
        },
      }).$mount();
    },
    onEditorChange(data) {
      this.notice.content = data.content;
      this.notice.template_images = data.detail_images;
    },
  },
};
