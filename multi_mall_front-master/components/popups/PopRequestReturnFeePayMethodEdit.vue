<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">반품 배송비 지불방법 변경</div>
            <div class="popup_text_wrap">

              <ul class="explain_wrap">
              </ul>

              <div class="col_one cancel_warp">
                <ul>
                  <li>
                    <div class="cart_table_wrap">
                      <table>
                        <colgroup>
                          <col width="100">
                          <col>
                        </colgroup>
                        <tbody>
                        <tr>
                          <th>반품 배송비</th>
                          <td>{{ return_fee }}</td>
                        </tr>
                        <tr>
                          <th>지불 방법</th>
                          <td>
                            <div class="radio_wrap">
                              <template v-for="type in collectFeeTypeCodes" v-if="type.value.code !== 'SELLER_DECIDES'">
                                <input type="radio" name="collectFeeType" :id="`${type.key}_${type.value.code}`" :value="type.value.code" v-model="params.collect_fee_type" :key="`collectFeeType_${type.key}`">
                                <label :for="`${type.key}_${type.value.code}`" :key="`collectFeeType_${type.value.code}`">{{ type.value.name }}</label>
                              </template>
                            </div>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </li>
                </ul>

              </div>

            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">{{ isReject ? '확인' : '취소' }}</button>
              <button v-if="!isReject" @click="ok">확인</button>
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
  props: {
    return_fee: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    isReject: false,
    collectFeeTypeCodes: [],
    params: {
      collect_fee_type: '',
    },
  }),
  computed: {
    ...mapGetters({
      codesValueArray: 'common/codesValueArray',
    }),
  },
  async created() {
    await this.$store.dispatch('common/getCodesValue', ['collect_fee_type']);
    this.collectFeeTypeCodes = this.codesValueArray('collect_fee_type', 'RTRN');
  },
});
</script>
