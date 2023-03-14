<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <!--그룹해제 팝업 -->
          <div class="popup_wrap">
            <div class="popup_text_wrap text-center">
              <div>그룹 해제된 상품은 자동 그룹매칭 대상에서 제외됩니다.<br>그룹을 해제 하시겠습니까?</div>
              <div class="color_gray_7 font_12">다시 그룹대상으로 지정하길 원하시면<br><em class="color_main_01">상품관리 > 해당상품 상세</em>에서 다시 매칭대상으로 설정하실 수 있습니다.</div>
            </div>
            <div class="popup_btn_wrap text-center">
              <button class="line_btn" @click="cancel">아니오</button>
              <button @click="ok">그룹 해제</button>
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
});
</script>
