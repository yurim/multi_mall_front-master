<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap width_m">
            <div class="popup_title">
              {{ isUpdate ? '배송지 수정' : '신규 배송지' }}
              <div class="checkbox_wrap m_l_20">
                <input type="checkbox" id="test" v-model="delivery.is_default">
                <label for="test">기본배송지 선택</label>
              </div>
            </div>

            <div class="popup_content_wrap">
              <ul class="list_wrap w_100">
                <li>
                  <div class="title">배송지명</div>
                  <div class="body">
                    <input type="text" placeholder="배송지 이름" class="w_100" v-model="delivery.address_name">
                  </div>
                </li>
                <li>
                  <div class="title">수령인</div>
                  <div class="body">
                    <input type="text" placeholder="수령인 이름" class="w_100" v-model="delivery.receiver_name">
                  </div>
                </li>
                <li>
                  <div class="title">전화번호</div>
                  <div class="body">
                    <input type="text" pattern="[0-9]+" placeholder="'-'없이 숫자만 입력" class="w_100" v-model="delivery.phone">
                  </div>
                </li>
                <li>
                  <div class="title">전화번호2</div>
                  <div class="body">
                    <input type="text" pattern="[0-9]+" placeholder="'-'없이 숫자만 입력" class="w_100" v-model="delivery.phone2">
                  </div>
                </li>
                <li>
                  <div class="title">배송지 주소</div>
                  <div class="body">
                    <div class="address_wrap">
                      <input type="text" placeholder="우편번호" readonly v-model="delivery.zipcode"/>
                      <a href="javascript:;" @click="searchAddress">우편번호</a>
                      <input type="text" placeholder="주소" v-model="delivery.address"/>
                      <input type="text" placeholder="상세주소" v-model="delivery.detail_address"/>
                    </div>
                  </div>
                </li>
<!--                <li>-->
<!--                  <div class="title">배송 메모</div>-->
<!--                  <div class="body">-->
<!--                    <div class="select_input_wrap">-->
<!--                      <input type="number" placeholder="내용 입력">-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </li>-->
              </ul>
            </div>

            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="save">{{ isUpdate ? '수정' : '등록' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </client-only>

</template>

<script>
import Vue from 'vue';
import Utils from '@/plugins/utils';
import util from '@/assets/javascripts/util';
import PopupMixin from './popupMixin';

const prefix = 'order';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    isUpdate: false,
  }),
  props: {
    userId: {
      type: Number,
      default: null,
    },
    delivery: {
      type: Object,
      default() {
        return {
          zipcode: null,
          address: null,
          detail_address: null,
        };
      },
    },
  },
  created() {
    this.isUpdate = !!this.delivery.id;
  },
  methods: {
    async save() {
      if (!this.delivery.address_name) return this.$popup.showAlertPopup('배송지명을 입력해주세요.');
      if (!this.delivery.receiver_name) return this.$popup.showAlertPopup('수령인을 입력해주세요.');
      if (!this.delivery.phone) return this.$popup.showAlertPopup('전화번호를 입력해주세요.');
      if (this.delivery.phone.indexOf('-') > -1) {
        this.delivery.phone = util.replaceAll(this.delivery.phone, '-', '');
      }
      if (!util.checkRegularExpression(this.delivery.phone, util.regularExpression.phoneNoDash)) {
        return this.$popup.showAlertPopup('전화번호 형식을 확인해주세요.');
      }
      if (!this.delivery.zipcode) return this.$popup.showAlertPopup('우편번호를 입력해주세요.');
      if (!this.delivery.address) return this.$popup.showAlertPopup('베송지를 입력해주세요.');
      if (!this.delivery.detail_address) return this.$popup.showAlertPopup('상세주소를 입력해주세요.');
      if (this.delivery.phone2) {
        if (this.delivery.phone2.indexOf('-') > -1) {
          this.delivery.phone2 = util.replaceAll(this.delivery.phone2, '-', '');
        }
        if (!util.checkRegularExpression(this.delivery.phone2, util.regularExpression.phoneNoDash)) {
          return this.$popup.showAlertPopup('전화번호2 형식을 확인해주세요.');
        }
      }

      let res;
      this.userId = Utils.getUserId(document.cookie);
      this.delivery.user_id = this.userId;

      if (this.isUpdate) {
        // 배송지 수정
        res = await this.$store.dispatch(`${prefix}/update_delivery`, this.delivery);
      } else {
        // 신규 배송지
        res = await this.$store.dispatch(`${prefix}/create_delivery`, this.delivery);
      }
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);

      await this.ok();
    },
    searchAddress() {
      util.showSearchAddress((data) => {
        this.$set(this.delivery, 'zipcode', data.zonecode);
        this.$set(this.delivery, 'address', data.address);
        this.$set(this.delivery, 'detail_address', '');
      });
    },
  },
});
</script>
