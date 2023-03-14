<template>
    <a href="javascript:;" v-on:click="clickExcelDownload" ref="btnExcelDownload" style="display:none"></a>
</template>

<script>
import Vue from 'vue';
import util from '@/assets/javascripts/util';
import fileDownload from '~/assets/javascripts/fileDownload';

export default Vue.extend({
  name: 'ExcelDownload',
  props: {
    href: {
      type: String,
      default: null,
    },
    params: {
      type: Object,
      default: null,
    },
    $axios: {
      type: Function,
      default: null,
    },
  },
  mounted() {
    this.$refs.btnExcelDownload.click();
  },
  methods: {
    clickExcelDownload() {
      let href = this.href;
      if (href) {
        if (this.params) {
          href = `${href}?${util.objectToUrlParams(this.params)}`;
        }

        this.$axios({
          url: `${process.env.BASE_URL}/${href}`,
          method: 'GET',
          responseType: 'blob',
        }).then((response) => {
          const cd = response.headers['content-disposition'];
          const fileName = cd.split('filename=')[1];
          fileDownload(response.data, fileName);
        });

        this.$destroy();
      }
    },
  },
});
</script>

<style scoped>

</style>
