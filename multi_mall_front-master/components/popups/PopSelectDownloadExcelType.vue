<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap width_m">
            <div class="popup_title">{{ title }}</div>
            <div class="popup_text_wrap">
              <div class="body small_btn_wrap border_active_wrap">
                <a class="" :class="{ active: params.downloadSelected }" @click="params.downloadSelected = true">선택항목 다운로드</a>
                <a class="" :class="{ active: !params.downloadSelected }" @click="params.downloadSelected = false">범위지정 다운로드</a>
              </div>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">다운로드</button>
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
  data: () => ({
    params: {
      downloadSelected: true,
    },
  }),
});
</script>
