<template>
    <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">{{title}}</div>
            <div class="popup_text_wrap">
              <div class="small_btn_wrap">
                <a v-if="downloadTemplateUrl" @click="downloadTemplate">양식 다운로드</a>
              </div>
              <div class="input_file_wrap">
                <div class="file_name" v-on:click="clickFileName">
                  <template v-if="fileName">{{fileName}}</template>
                  <template v-else>파일 업로드</template>
                </div>
                <input type="file" id="inputFile" ref="inputFile" v-on:change="setInputFile" />
                <label for="inputFile">파일 업로드</label>
              </div>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="ok">일괄등록</button>
              <button @click="cancel">취소</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import ExcelDownload from '@/components/ExcelDownload';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    checkFile: {
      type: Function,
      default: () => true,
    },
    downloadTemplateUrl: {
      type: String,
      default: () => null,
    },
  },
  data: () => ({
    params: {
      file: null,
    },
    fileName: null,
  }),
  methods: {
    clickFileName() {
      this.$refs.inputFile.click();
    },
    setInputFile(e) {
      const files = e.target.files;
      if (files && files.length > 0) {
        const excelFile = files[0];
        if (this.checkFile(excelFile)) {
          const reader = new FileReader();
          reader.readAsDataURL(excelFile);
          reader.onload = () => {
            this.fileName = excelFile.name;
            this.params.file = excelFile;
          };
        }
      }
    },
    downloadTemplate() {
      new ExcelDownload({
        propsData: {
          href: this.downloadTemplateUrl,
          $axios: this.$store.$axios,
        },
      }).$mount();
    },
  },
});
</script>

<style scoped>

</style>
