<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_text_wrap text-center">
              <div>
                <span>현재상태: </span>
                <span>{{ delivery_status_str }}</span>
              </div>
              <div>
                <span>택배사: </span>
                <span>{{ courier_name }}</span>
              </div>
              <div>
                <span>운송장 번호: </span>
                <span>{{ kor_tracking_num }}</span>
              </div>
              <div>
                <span>쇼핑몰에 배송정보 적용</span>
              </div>
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
    delivery_status_str: { type: String, default: '' },
    courier_name: { type: String, default: '' },
    kor_tracking_num: { type: String, default: '' },
  },
  methods: {},
});
</script>
