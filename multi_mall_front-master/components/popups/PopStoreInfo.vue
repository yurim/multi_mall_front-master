<template>
  <client-only>
    <div class="popup-mask">
      <div class="popup-wrapper">

        <div class="popup-container">
          <div class="popup_wrap">
            <div class="popup_title text-center font_20">{{ title }}</div>
            <div class="table_wrap">
              <table>
                <colgroup>
                  <col width="200">
                </colgroup>
                <tbody>
                <tr>
                  <th>사업자등록번호</th>
                  <td><span class="color_main_01 font_nomal">{{ storeInfo.license_num }}</span></td>
                </tr>
                <tr>
                  <th>상호명</th>
                  <td><span class="color_main_01 font_nomal">{{ storeInfo.company_name }}</span></td>
                </tr>
                <tr>
                  <th>대표자명</th>
                  <td><span class="color_main_01 font_nomal">{{ storeInfo.ceo_name }}</span></td>
                </tr>
                <tr>
                  <th>전화번호</th>
                  <td><span class="color_main_01 font_nomal">{{ storeInfo.phone }}</span></td>
                </tr>
                <tr>
                  <th>이메일</th>
                  <td><span class="color_main_01 font_nomal">{{ storeInfo.email }}</span></td>
                </tr>
                <tr>
                  <th>통신판매업신고번호</th>
                  <td><span class="color_main_01 font_nomal">{{ storeInfo.sale_num }}</span></td>
                </tr>
                <tr>
                  <th>주소</th>
                  <td><span class="color_main_01 font_nomal">({{ storeInfo.zipcode }}) {{
                      storeInfo.address
                    }} {{ storeInfo.detail_address }}</span></td>
                </tr>
                </tbody>
              </table>
            </div>
            <!--            <div class="popup_text_wrap">-->
            <!--              <div class="bold p_l_10 m_b_10">사업자 등록번호 : <span class="color_main_01 font_nomal">{{ storeInfo.license_num }}</span></div>-->
            <!--              <div class="bold p_l_10">상호명 : <span class="color_main_01 font_nomal">{{ storeInfo.company_name }}</span></div>-->
            <!--              <div class="bold p_l_10">대표자명 : <span class="color_main_01 font_nomal">{{ storeInfo.ceo_name }}</span></div>-->
            <!--              <div class="bold p_l_10">전화번호 : <span class="color_main_01 font_nomal">{{ storeInfo.phone }}</span></div>-->
            <!--              <div class="bold p_l_10">이메일 : <span class="color_main_01 font_nomal">{{ storeInfo.email }}</span></div>-->
            <!--              <div class="bold p_l_10">통신판매업신고번호 : <span class="color_main_01 font_nomal">{{ storeInfo.sale_num }}</span></div>-->
            <!--              <div class="bold p_l_10">주소 : <span class="color_main_01 font_nomal">({{ storeInfo.zipcode }}) {{ storeInfo.address }} {{ storeInfo.detail_address }}</span></div>-->
            <!--            </div>-->
            <div class="popup_btn_wrap text_center">
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
import PopupMixin from './popupMixin';

export default Vue.extend({
  mixins: [PopupMixin],
  props: {
    storeInfo: {
      type: Object,
      default: () => {
      },
    },
  },
  methods: {},
});
</script>
