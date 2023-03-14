<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="terms_popup_wrap">
          <div class="popup_wrap">
            <div class="popup_title">{{ title }}</div>
            <div class="popup_text_wrap" v-html="message">
            </div>
            <div id="notice_body">
              <SummernoteEditor :preview="true" :detailContent="content"
                                :detailImageArr="images" />
            </div>
            <div>
              <input v-model="params.close_for_week" id="closeForWeek" type="checkbox">
              <label for="closeForWeek">7일동안 열지 않기</label>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="ok">확인</button>
            </div>
          </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    images: {
      type: Array,
      default: [],
    },
    content: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    params: {
      close_for_week: false,
    },
  }),
  methods: {},
});
</script>
