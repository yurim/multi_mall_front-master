<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">{{title}}</div>
            <div class="popup_text_wrap">
              <div>
                <input type="number" class="w_100" v-model="params.refundPrice" placeholder="숫자만 입력해주세요."/>
              </div>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">{{okButtonText}}</button>
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
  methods: {},
  props: {
    refundPrice: {
      type: Number,
      default: 0,
    },
    okButtonText: {
      type: String,
      default: '확인',
    },
  },
  data(vm) {
    return {
      params: {
        refundPrice: vm.refundPrice,
      },
    };
  },
});
</script>
