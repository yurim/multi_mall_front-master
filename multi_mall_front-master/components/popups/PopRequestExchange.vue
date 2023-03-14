<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">판매자 직접 교환접수</div>
            <div class="popup_text_wrap">

              <ul class="explain_wrap">
                <li>- 판매자 직접 교환접수시 교환요청까지만 처리됩니다.</li>
                <li>- 이후 교환관련 처리는 교환관리 메뉴에서 진행해 주세요.</li>
              </ul>

              <div class="color_main_01"><b>교환요청 상품</b></div>

              <div class="m_b_40">
                <table>
                  <thead>
                  <tr>
                    <th>
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="test_cheak" v-model="allSelect">
                        <label for="test_cheak"></label>
                      </div>
                    </th>
                    <th>상품주문번호</th>
                    <th>상품명</th>
                    <th>판매매장</th>
                    <th>총 상품 주문금액</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in items">
                    <td>
                      <div class="checkbox_wrap">
                        <input type="checkbox" :id="item.id" v-model="item.isChecked" @change="onCheck">
                        <label :for="item.id"></label>
                      </div>
                    </td>
                    <td>{{ item.productOrderNum }}</td>
                    <td>{{ item.productName }}</td>
                    <td>{{ item.storeNameKor }}</td>
                    <td>{{ item.productTotalPrice | comma }}원</td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <ul class="list_wrap w_100">
                <li>
                  <div class="title">교환 수거방법</div>
                  <template v-for="code in collectDeliveryTypeCodes">
                    <div class="radio_wrap">
                      <input v-model="params.collect_delivery_type" type="radio" :id="`collectDelivery${code.key}`"
                             name="collectDelivery" :value="code.value.code">
                      <label :for="`collectDelivery${code.key}`">{{ code.value.name }}</label>
                    </div>
                  </template>
                </li>
                <li>
                  <div class="title">교환비 지불방법</div>
                  <template v-for="code in collectFeeTypeCodes">
                    <div class="radio_wrap">
                      <input v-model="params.collect_fee_type" type="radio" :id="`collectFee${code.key}`"
                             name="collectFee" :value="code.value.code">
                      <label :for="`collectFee${code.key}`">{{ code.value.name }}</label>
                    </div>
                  </template>
                </li>
                <li>
                  <div class="title">교환요청 사유</div>
                  <div class="body">
                    <select v-model="params.reason_sub_type">
                      <option v-for="code in reasonSubTypeCodes" :value="code.value.code">{{ code.value.name }}</option>
                    </select>
                  </div>
                </li>
              </ul>

              <div>
                <div class="color_main_01 m_b_10"><b>교환요청 상세 사유 ({{ reasonLength }}/500자)</b></div>
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
  props: {
    allSelect: false,
    items: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    reasonSubTypeCodes: [],
    collectDeliveryTypeCodes: [],
    collectFeeTypeCodes: [],
    params: {
      collect_delivery_type: null,
      collect_fee_type: null,
      order_product_ids: [],
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
  watch: {
    allSelect(newValue) {
      this.setCheck(newValue);
      this.onCheck();
    },
  },
  async created() {
    this.allSelect = true;
    this.setCheck(true);
    await this.$store.dispatch('common/getCodesValue', ['reason_sub_type', 'collect_delivery_type', 'collect_fee_type']);
    this.reasonSubTypeCodes = this.codesValueArray('reason_sub_type', 'RQST_EXCHNG');
    this.collectDeliveryTypeCodes = this.codesValueArray('collect_delivery_type', '');
    this.collectFeeTypeCodes = this.codesValueArray('collect_fee_type', 'EXCHNG');
    this.params.reason_sub_type = this.reasonSubTypeCodes[0].value.code;
  },
  methods: {
    onCheck() {
      this.params.order_product_ids = this.items.filter((v) => v.isChecked).map((v) => v.id);
    },
    setCheck(checked) {
      this.items.forEach((item) => {
        item.isChecked = checked;
      });
    },
  },
});
</script>
