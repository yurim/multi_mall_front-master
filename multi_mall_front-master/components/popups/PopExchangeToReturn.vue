<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">반품으로 변경</div>
            <div class="popup_text_wrap">

              <ul class="explain_wrap">
                <li>선택된 주문건을 반품으로 변경합니다. 변경후에는 반품관리탭에서 관리가 가능합니다.</li>
              </ul>

              <ul class="list_wrap">
                <li>
                  <div class="title">반품 수거방법</div>
                  <template v-for="code in collectDeliveryTypeCodes">
                    <div class="radio_wrap">
                      <input v-model="params.collect_delivery_type" type="radio" :id="`collectDelivery${code.key}`"
                             name="collectDelivery" :value="code.value.code">
                      <label :for="`collectDelivery${code.key}`">{{ code.value.name }}</label>
                    </div>
                  </template>
                </li>
                <li>
                  <div class="title">반품비 지불방법</div>
                  <template v-for="code in collectFeeTypeCodes">
                    <div class="radio_wrap">
                      <input v-model="params.collect_fee_type" type="radio" :id="`collectFee${code.key}`"
                             name="collectFee" :value="code.value.code">
                      <label :for="`collectFee${code.key}`">{{ code.value.name }}</label>
                    </div>
                  </template>
                </li>
                <li>
                  <div class="title">반품사유</div>
                  <div class="body">
                    <select v-model="params.reason_sub_type">
                      <option v-for="code in reasonSubTypeCodes" :value="code.value.code">{{ code.value.name }}</option>
                    </select>
                  </div>
                </li>
              </ul>

              <div>
                <div class="color_main_01 m_b_10"><b>반품 상세 사유 ({{ reasonLength }}/500자)</b></div>
                <div class="m_b_20">
                  <textarea v-model="params.reason" rows="3" placeholder="내용을 입력해주세요."></textarea>
                </div>
              </div>

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
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  data: () => ({
    reasonSubTypeCodes: [],
    collectDeliveryTypeCodes: [],
    collectFeeTypeCodes: [],
    params: {
      collect_delivery_type: null,
      collect_fee_type: null,
      reason_sub_type: null,
      reason: '',
    },
  }),
  computed: {
    ...mapGetters({
      codesValueArray: 'common/codesValueArray',
    }),
    reasonLength() {
      return this.params.reason.length;
    },
  },
  async created() {
    await this.$store.dispatch('common/getCodesValue', ['reason_sub_type', 'collect_delivery_type', 'collect_fee_type']);
    this.reasonSubTypeCodes = this.codesValueArray('reason_sub_type', 'RQST_RTRN');
    this.collectDeliveryTypeCodes = this.codesValueArray('collect_delivery_type', '');
    this.collectFeeTypeCodes = this.codesValueArray('collect_fee_type', 'RTRN');
    this.params.reason_sub_type = this.reasonSubTypeCodes[0].value.code;
  },
  methods: {},
});
</script>
