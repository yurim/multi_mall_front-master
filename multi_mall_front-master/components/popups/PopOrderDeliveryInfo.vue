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
                  <div class="title">수취인명 :</div>
                  <div class="body">
                    <input type="text" placeholder="이름" v-model="params.name" />
                  </div>
                </li>
                <li>
                  <div class="title">수취인 연락처 :</div>
                  <div class="body">
                    <input type="text" placeholder="연락처" v-model="params.phone" />
                  </div>
                </li>
                <li>
                  <div class="title">배송지 주소 :</div>
                  <div class="body">
                    <div class="address_wrap">
                      <input type="text" placeholder="우편번호" v-model="params.zipcode" v-on:click="btnAddress" readonly/>
                      <a href="javascript:;" v-on:click="btnAddress">우편번호</a>
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
// 배송지 정보 수정
import Vue from 'vue';
import util from '@/assets/javascripts/util';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    params: {
      name: '',
      phone: '',
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
      });
    },
  },
});
</script>

<style scoped>

</style>
