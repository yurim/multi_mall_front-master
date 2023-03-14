<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <!--  체크된 상태에 따라서 둘중 하나만 보여주면 됨   -->
            <div class="popup_text_wrap text-center">
              <div v-if="isChecked">구매상태를<br><b class="color_r">'미완료'</b><br>상태로 바꾸시겠습니까?</div>
              <div v-else>구매상태를<br><b class="color_y">'구매필요없음'</b><br>상태로 바꾸시겠습니까?</div>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">확인</button>
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
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
