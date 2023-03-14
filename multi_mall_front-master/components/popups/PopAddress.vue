<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">주소입력</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap">
                <li>
                  <div class="title">주소 :</div>
                  <div class="body">
                    <div class="address_wrap">
                      <input type="text" placeholder="우편번호" v-model="params.zipcode" />
                      <a v-on:click="btnAddress">우편번호</a>
                      <input type="text" placeholder="주소" v-model="params.address" />
                      <input type="text" placeholder="상세주소" v-model="params.detailAddress" />
                    </div>
                  </div>
                </li>
              </ul>
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
import util from '@/assets/javascripts/util';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    params: {
      zipcode: '',
      address: '',
      detailAddress: '',
    },
  }),
  methods: {
    btnAddress() {
      util.showSearchAddress((data) => {
        this.params.zipcode = data.zonecode;
        this.params.address = data.address;
        this.params.detailAddress = data.detailAddress;
      });
    },
  },
});
</script>
