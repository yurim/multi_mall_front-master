<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap">
            <div class="popup_title">배송대행 신청</div>
            <div class="content_box_wrap m_b_20">
              <ul class="table_wrap">
                <li>
                  <table>
                    <thead>
                    <tr>
                      <th>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="check_all" @click="checkAll"
                                 :checked="selectAbleIds.length === params.selected.length">
                          <label for="check_all"></label>
                        </div>
                      </th>
                      <th>상품주문번호</th>
                      <th>상품이미지</th>
                      <th>상품명</th>
                      <th>주문상태</th>
                      <th>상세주문상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in orderProductDeliveryRequests" :key="item.id"
                        :class="{'bg_gray': selectAbleIds.indexOf(item.id) < 0}">
                      <td>
                        <div class="only_checkbox_wrap">
                          <!-- '상품준비중 , 배송중 ' 일때는 체크박스 비활성화 -->
                          <input type="checkbox" :id="`selected_${item.id}`" v-model="params.selected" :value="item.id"
                                 :disabled="selectAbleIds.indexOf(item.id) < 0">
                          <label :for="`selected_${item.id}`"></label>
                        </div>
                      </td>
                      <td>
                        <a @click="movePage(item.order_product.order_num)" class="color_b">
                          {{ item.order_product.order_num }}
                        </a>
                      </td>
                      <td>
                        <span class="thumbnail_wrap">
                          <DefaultImage :imageUrl="item.order_product.product.image_url"/>
                        </span>
                      </td>
                      <td>{{ item.order_product.product.name }}</td>
                      <td>
                        <span :class="{'color_r': selectAbleIds.indexOf(item.id) < 0}">
                          {{ item.order_product.order_status_str }}
                        </span>
                      </td>
                      <td>
                        <span :class="{'color_r': selectAbleIds.indexOf(item.id) < 0}">
                          {{ item.order_product.order_sub_status_str }}
                        </span>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </li>
              </ul>
            </div>
            <div class="popup_btn_wrap text-center">
              <a @click="cancel" class="line_btn">취소</a>
              <a @click="ok">배송대행 신청하기</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import _ from 'lodash';
import fp from 'lodash/fp';
import Vue from 'vue';
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    orderProductDeliveryRequests: {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    loading: false,
    headers: [
      { text: '상품주문번', value: '', sortable: false },
      { text: '상품이미지', value: '', sortable: false },
      { text: '상품명', value: '', sortable: false },
      { text: '비고', value: '', sortable: false },
    ],
    selectAbleIds: [],
    params: {
      selected: [],
    },
  }),
  created() {
    this.selectAbleIds = fp.flow(
      (items) => _.filter(items, (item) => (item.order_product.order_status === 'DLVRY_WAIT' && item.order_product.order_sub_status === 'CHCK_DLVRY') && item.delivery_request === null),
      (items) => _.map(items, 'id'),
    )(this.orderProductDeliveryRequests);
  },
  methods: {
    checkAll() {
      if (this.orderProductDeliveryRequests.length === this.params.selected.length) {
        this.params.selected = [];
      } else {
        this.params.selected = this.selectAbleIds;
      }
    },
  },
});
</script>
