<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">배송 정보</div>
            <div class="popup_text_wrap">
              <ul class="list_wrap">
                <li>
                  <div class="title">보내는곳</div>
                  <div class="body">{{ info.store.store_name_kor }}</div>
                </li>
                <li>
                  <div class="title">수령인</div>
                  <div class="body">{{ info.deliveryInfo.name }}</div>
                </li>
                <li>
                  <div class="title">주소</div>
                  <div class="body">[{{ info.deliveryInfo.zipcode }}] {{ info.deliveryInfo.address }} {{ info.deliveryInfo.detail_address }}</div>
                </li>
                <li>
                  <div class="title">상품 정보</div>
                  <div class="body">{{ info.product.product_name }} [{{ info.product.product_option_names }}] {{ info.product.amount | comma }}개</div>
                </li>
                <template v-if="info.deliveryInfo.delivery_method === 'PARCEL'">
                  <li v-if="info.deliveryInfo.delivery_method === 'PARCEL'">
                    <div class="title">택배사</div>
                    <div class="body">{{ info.deliveryInfo.delivery_company_str }}</div>
                  </li>
                  <li>
                    <div class="title">운송장번호</div>
                    <div class="body">{{ info.deliveryInfo.invoice_num }} <a :href="info.deliveryInfo.tracking_url" target="_blank" class="color_main_01">[운송장 조회]</a></div>
                  </li>
                </template>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">닫기</button>
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
    info: {
      type: Object,
      default: {},
    },
  },
  created() {
  },
  methods: {},
});
</script>
