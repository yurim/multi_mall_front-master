<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap width_m">
            <div class="popup_title">옵션추가금액 적용 방식</div>
            <div class="popup_text_wrap">
              <div class="body small_btn_wrap border_active_wrap">
                <a class="" :class="{ active: params.isMinusOptionPrice }" @click="params.isMinusOptionPrice = true">마이너스 옵션값으로만 적용</a>
                <a class="" :class="{ active: !params.isMinusOptionPrice }" @click="params.isMinusOptionPrice = false">플러스 옵션값으로만 적용</a>
              </div>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">적용</button>
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
      isMinusOptionPrice: false,
    },
  }),
});
</script>
