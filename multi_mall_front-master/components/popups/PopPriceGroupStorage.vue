<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <!--저장 팝업 -->
          <div class="popup_wrap">
            <div class="popup_text_wrap text-center">
              <div>가격비교 그룹 저장이 완료되었습니다.</div>
              <div class="color_main_01 font_12" v-if="exceptCount > 0">방금 제외된 상품 (<em class="color_r"> {{ exceptCount }}</em>건) 을 새로운 그룹으로 생성하시겠습니까?</div>
            </div>
            <div class="popup_btn_wrap text-center">
              <button class="line_btn" @click="cancel" v-if="exceptCount > 0">아니오</button>
              <button @click="createGroup" v-if="exceptCount > 0">제외된 상품 그룹생성</button>
              <button @click="ok" v-else>확인</button>
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
    exceptCount: {
      type: Number,
      default: 0,
    },
    createGroupCallback: {
      type: Function,
      default: null,
    },
  },
  methods: {
    async createGroup() {
      if (this.createGroupCallback) await this.createGroupCallback(this.params);
    },
  },
});
</script>
