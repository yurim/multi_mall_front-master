<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center">가격비교 그룹 매칭상태 변경</div>
            <div class="popup_text_wrap">

              <ul class="list_wrap w_100">
                <li>
                  <div class="title">가격비교 그룹<br>매칭 여부</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" id="popCanPriceGroupTrue" name="canPriceGroup" v-model="params.can_price_group" :value="true">
                      <label for="popCanPriceGroupTrue">매칭</label>
                      <input type="radio" id="popCanPriceGroupFalse" name="canPriceGroup" v-model="params.can_price_group" :value="false">
                      <label for="popCanPriceGroupFalse">매칭대상 제외</label>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">취소</button>
              <button @click="ok">저장</button>
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
    product: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    params: { product_id: '', can_price_group: false },
  }),
  created() {
    this.params.product_id = this.product.id;
    this.params.can_price_group = this.product.can_price_group;
  },
  methods: {},
});
</script>
