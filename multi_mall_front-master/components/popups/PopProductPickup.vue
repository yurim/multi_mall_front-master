<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title text-center">{{title}}</div>
            <div class="popup_text_wrap">

              <ul class="explain_wrap">
                <li>{{message}}</li>
              </ul>

              <ul class="list_wrap">
                <li>
                  <div class="title">수거방법</div>
                  <div class="body">
                    {{ collectDeliveryType }}
                  </div>
                </li>
                <li>
                  <div class="title">반품 / 교환 배송비<br/>지불방법</div>
                  <div class="body">
                    {{ collectFeeType }}
                  </div>
                </li>
                <li>
                  <div class="title">배송방법</div>
                  <div class="body">
                    <select v-model="params.delivery_method" class="w_100">
                      <option v-for="code in methodList" :value="code.key">{{code.value}}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">택배사</div>
                  <div class="body">
                    <select v-model="params.delivery_company" class="w_100">
                      <option v-for="code in companyList" :value="code.key">{{code.value}}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">송장번호</div>
                  <div class="body"><input v-model="params.invoice_num" type="number" placeholder="송장번호를 입력해주세요." class="w_100"></div>
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
import { mapGetters } from 'vuex';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    collectDeliveryType: null,
    collectFeeType: null,
  },
  data: () => ({
    params: {
      delivery_method: '',
      delivery_company: '',
      invoice_num: '',
    },
    methodList: [],
    companyList: [],
  }),
  computed: {
    ...mapGetters({
      codesArray: 'common/codesArray',
    }),
  },
  async created() {
    await this.$store.dispatch('common/getCodes', ['delivery_method', 'delivery_company']);
    this.methodList = this.codesArray('delivery_method');
    this.companyList = this.codesArray('delivery_company');
    if (this.methodList.length > 0) this.params.delivery_method = this.methodList[0].key;
    if (this.companyList.length > 0) this.params.delivery_company = this.companyList[0].key;
  },
  methods: {},
});
</script>
