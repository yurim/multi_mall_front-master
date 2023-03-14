<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>

        <div class="list_title_wrap"><span>마이페이지</span></div>

        <MypageCondition></MypageCondition>
        <div class="m_b_40 d_ib_100">
          <TopTabNav></TopTabNav>
        </div>

        <div class="mypage_info_wrap" v-if="!isVerifyPassword">
          <div class="main_color_title">내 정보</div>
          <ul>
            <li>
              <div class="mypage_info_wrap__title">비밀번호</div>
              <div class="mypage_info_wrap__body">
                <input type="password" class="w_100" name="password" id="password" v-model="password" v-on:keyup.enter="myInfoAuth" placeholder="비밀번호를 입력해주세요." />
                <div class="font_12 color_r" v-if="message">{{ message }}</div>
              </div>
            </li>
          </ul>
          <div class="but_wrap m_t_40 text-center">
            <a class="line_but" v-on:click="myInfoAuth">확인</a>
          </div>
        </div>
        <div class="mypage_info_wrap" v-if="isVerifyPassword">
          <div class="main_color_title">회원 정보 수정</div>
          <ul>
            <li>
              <div class="mypage_info_wrap__title">아이디(이메일)</div>
              <div class="mypage_info_wrap__body">{{ userInfo.email }}</div>
            </li>
            <li>
              <div class="mypage_info_wrap__title">이름</div>
              <div class="mypage_info_wrap__body">{{ userInfo.name }}</div>
            </li>
            <li>
              <div class="mypage_info_wrap__title">휴대폰번호</div>
              <div class="mypage_info_wrap__body">

                <div class="d_ib_100 m_b_20">
                  <span>{{ userInfo.phone | contact }}</span>
                  <div class="square_but_wrap d_ib w_auto m_l_10">
                    <a class="line_but" v-on:click="phoneChange">번호 수정</a>
                  </div>
                </div>
                <!-- 번호수정을 클릭시 보임-->
                <div class="d_ib_100" v-if="isChange">
                  <div class="input_but_wrap d_ib_100 m_b_10">
                    <input type="text" placeholder="'-'없이 숫자만 입력" v-model="contact.value"><a v-on:click="getAuthNumber">인증번호 받기</a>
                  </div>
                  <div class="input_but_wrap d_ib_100">
                    <input type="text" placeholder="인증번호" v-model="contact.authNumber"><a v-on:click="changePhoneNumber">인증하기</a>
                  </div>
                  <div class="font_12 color_r" v-if="contact.message">{{ contact.message }}</div>
                </div>

              </div>
            </li>
            <li v-if="!isSNSUser">
              <div class="mypage_info_wrap__title">비밀번호 변경</div>
              <div class="mypage_info_wrap__body">

                <div class="d_ib_100 m_b_20">
                  <div class="m_b_5">현재 비밀번호</div>
                  <input type="password" placeholder="비밀번호를 입력해주세요." autocomplete="off" v-model="passwords.current">
                </div>
                <div class="d_ib_100 m_b_10">
                  <div class="m_b_5">신규 비밀번호</div>
                  <input type="password" placeholder="비밀번호를 입력해주세요." autocomplete="off" v-model="passwords.new" v-on:input="passwordCheck">
                </div>
                <div class="d_ib_100">
                  <div class="m_b_5">비밀번호 재입력</div>
                  <input type="password" placeholder="비밀번호를 입력해주세요." autocomplete="off" v-model="passwords.newCheck" v-on:input="passwordCheck">
                  <div class="font_12 color_r" v-if="passwords.message">{{ passwords.message }}</div>
                </div>

              </div>
            </li>
            <li>
              <div class="mypage_info_wrap__title">배송지 변경</div>
              <div class="mypage_info_wrap__body">
                <div class="but_wrap"><a class="line_but" v-on:click="popDeliveryList">배송지 목록</a></div>
              </div>
            </li>
            <li>
              <div class="mypage_info_wrap__title">정보 수신 설정</div>
              <div class="mypage_info_wrap__body">

                <div class="checkbox_wrap m_r_20">
                  <input type="checkbox" id="type_total" v-model="allCheck">
                  <label for="type_total">홍보성 정보 수신에 전체 동의 합니다.</label>
                </div>
                <div class="checkbox_wrap" v-for="(type, i) in receptionTypeList" :key="`reception_${i}`">
                  <input type="checkbox" :id="`type_${type.key}`" :value="type.key" v-model="user_reception" @change="changeReception">
                  <label :for="`type_${type.key}`">{{ type.value }}</label>
                </div>
              </div>
            </li>
          </ul>
          <div class="but_wrap m_t_40 text-center">
            <button v-on:click="backToInfoPage" :class="changeDisabled === false ? 'line_but' : ''">이전</button>
            <!-- TODO 변경된 내용에 따라 disabled -->
            <button v-on:click="patchUserInfo" :disabled="changeDisabled === false" :class="changeDisabled === false ? 'disabled_but' : ''">변경</button>
            <a class="pull-right red_line_but" v-on:click="popLeave">회원탈퇴</a>
          </div>
        </div>

      </div>
    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/info/index.js"></script>
