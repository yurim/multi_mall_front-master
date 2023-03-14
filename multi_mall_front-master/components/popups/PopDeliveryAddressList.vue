<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">
        <div class="popup-container">

          <div class="popup_wrap w_m">
            <!--            <div class="popup_title"></div>-->
            <div class="popup_content_wrap">
              <div>
                <table>
                  <colgroup>
                    <col width="120">
                    <col>
                    <col width="120">
                    <col>
                    <col width="100">
                  </colgroup>
                  <thead>
                  <tr style="cursor: pointer">
                    <th>배송지명</th>
                    <th>수취인명</th>
                    <th>주소지(선택)</th>
                    <th>전화번호</th>
                    <th>선택/수정</th>
                  </tr>
                  </thead>
                  <tbody>
                  <template v-if="deliveries.length > 0">
                    <tr v-for="delivery in deliveries">
                      <td @click="selectDelivery(delivery)">
                        <div>{{ delivery.address_name }}</div>
                        <div class="color_main_01" v-if="delivery.is_default">[기본 배송지]</div>
                      </td>
                      <td @click="selectDelivery(delivery)">
                        <div>{{ delivery.receiver_name }}</div>
                      </td>
                      <td @click="selectDelivery(delivery)">
                        {{ delivery.address }} {{ delivery.detail_address }}
                      </td>
                      <td @click="selectDelivery(delivery)">{{ delivery.phone }}</td>
                      <td>
                        <div class="btn_wrap">
                          <a href="javascript:;" class="gray_line_but w_100 m_b_10"
                             @click="selectDelivery(delivery)">선택</a>
                          <a href="javascript:;" class="line_btn w_100 m_b_10" @click="updateDelivery(delivery)">수정</a>
                          <a href="javascript:;" class="w_100" @click="deleteDelivery(delivery)">삭제</a>
                        </div>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="5">현재 등록된 배송지가 없습니다.</td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="popup_btn_wrap text-center">
              <button @click="cancel" class="line_btn">닫기</button>
              <button @click="addDelivery">배송지 추가</button>
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

const prefix = 'order';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    userId: {
      type: Number,
      default: null,
    },
    deliveries: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  async created() {
    await this.refresh();
  },
  mounted() {
    console.log(this.deliveries);
    console.log(this.deliveries.length);
  },
  methods: {
    async refresh() {
      const res = await this.$store.dispatch(`${prefix}/get_deliveries`, {
        user_id: this.userId,
      });
      if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
      this.deliveries = res.data.data.deliveries;
    },
    selectDelivery(delivery) {
      this.params.delivery = delivery;
      this.ok();
      this.$destroy();
    },
    addDelivery() {
      new this.$popup.AddressModify({
        propsData: {
          delivery: {
            user_id: this.userId,
          },
          okCallback: async (params) => {
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    updateDelivery(delivery) {
      new this.$popup.AddressModify({
        propsData: {
          delivery: JSON.parse(JSON.stringify(delivery)),
          okCallback: async (params) => {
            await this.refresh();
            params.$destroy();
          },
        },
      }).$mount();
    },
    deleteDelivery(delivery) {
      new this.$popup.Confirm({
        propsData: {
          title: '배송지를 삭제 하시겠습니까?',
          okCallback: async (params) => {
            params.$destroy();
            const res = await this.$store.dispatch(`${prefix}/delete_delivery`, delivery);
            if (res.data.result === 'error') return this.$popup.showAlertPopup(res.data.message);
            await this.refresh();
            this.$popup.showAlertPopup('삭제되었습니다.');
          },
        },
      }).$mount();
    },
  },
});
</script>
