import { mapGetters } from 'vuex';
import _ from 'lodash';

const prefix = 'store_admin/template/abroad/_type/edit';

export default {
  data: () => ({
    template_type: '',
  }),
  async fetch({ store, params }) {
    await store.dispatch(`${prefix}/getTemplate`, params);
  },
  computed: {
    ...mapGetters({
      template: `${prefix}/abroad`,
    }),
  },
  created() {
    this.template_type = this.$route.params.type;

    if (this.template.template_images != null && this.template.template_images.length > 0) {
      this.template.template_images.forEach((image) => {
        image.original_order = image.order;
      });
    }
  },
  methods: {
    onEditor(data) {
      this.template.content = data.content;
      this.template.template_images = data.detail_images;
    },
    async updateTemplate() {
      const formData = new FormData();

      formData.append('id', this.template.id);
      formData.append('content', this.template.content);
      formData.append('name', this.template.name);
      const templateImages = _.map(this.template.template_images, (ti) => ({ order: ti.order, original_order: ti.original_order ? ti.original_order : null }));
      formData.append('template_images', JSON.stringify(templateImages));
      this.template.template_images.forEach((v) => {
        if (v.is_image_file) formData.append(`image_files_${v.order}`, v.image);
      });

      const res = await this.$store.dispatch(`${prefix}/patchTemplate`, formData);
      if (res.data.result === 'success') {
        this.$popup.showAlertPopup('성공적으로 변경되었습니다.');
        await this.$router.push({ name: 'store_admin-template-abroad-type', params: { type: this.template_type } });
      } else {
        this.$popup.showAlertPopup(res.data.message);
      }
    },
  },
};
