<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">
              <p>가입을 축하합니다!</p>
              <p>몰리회원이 되어주신것을 진심으로 감사드립니다.</p>
              <p v-if="signUpPoint && signUpPoint > 0">감사의 의미로 적립금 <span>{{ signUpPoint | comma }}p</span>를 적립해드렸습니다!</p>
            </div>
            <div class="popup_btn_wrap text-center">
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
    signUpPoint: {
      type: Number,
      default: 0,
    },
  },
  methods: {},
});
</script>
