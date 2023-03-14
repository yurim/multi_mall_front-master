<template>
  <div class="userWrap">
    <div class="body_wrap">
      <Header></Header>
      <v-container>

        <div class="content_wrap">
          <div class="list_title_wrap text-center m_b_40"><span>판매자 입점 신청</span></div>
        </div>

        <div class="store_request_info_wrap">
          <ul>
            <li>
              <div class="store_request_info_wrap__title">이용약관 (필수)</div>
              <div class="store_request_info_wrap__content">
                <SummernoteEditor :preview="true" summernoteId="termsPreview" :detailContent="termsAgreement.content" />
              </div>
              <div class="checkbox_wrap pull-right">
                <input type="checkbox" id="services" v-model="services">
                <label for="services">이용 약관에 동의 합니다.</label>
              </div>
            </li>
            <li>
              <div class="store_request_info_wrap__title">개인정보 수집 및 이용 동의 (필수)</div>
              <div class="store_request_info_wrap__content">
                <SummernoteEditor :preview="true" summernoteId="privacyPreview" :detailContent="privacyAgreement.content" />
              </div>
              <div class="checkbox_wrap pull-right">
                <input type="checkbox" id="privacy" v-model="privacy">
                <label for="privacy">개인정보 수집 및 이용 동의에 동의 합니다.</label>
              </div>
            </li>
            <li>
              <div class="store_request_info_wrap__title">제 3자 정보 제공 동의 (필수)</div>
              <div class="store_request_info_wrap__content">
                <SummernoteEditor :preview="true" summernoteId="thirdPreview" :detailContent="thirdAgreement.content" />
              </div>
              <div class="checkbox_wrap pull-right">
                <input type="checkbox" id="third" v-model="third">
                <label for="third">제 3자 정보 제공에 동의 합니다.</label>
              </div>
            </li>
            <li>
              <div class="checkbox_wrap pull-right">
                <input type="checkbox" id="agreeAll" v-model="allCheck">
                <label for="agreeAll">약관 전체 동의</label>
              </div>
            </li>
          </ul>
          <div class="but_wrap text-center">
            <a v-on:click="historyBack" class="line_but">이전</a>
            <a v-on:click="historyNext">다음</a>
          </div>
          <div class="font_12 color_r text-center m_t_10">{{ message }}</div>
        </div>

      </v-container>
      <Footer></Footer>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/store/request/check/index.js"></script>
