<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <div class="login_wrap">
        <div class="side_bar">

          <div class="logo_wrap"><img alt="company logo" src="@/assets/img/admin/molly_logo.svg"></div>

          <form>
            <div class="input_wrap">
              <div class="font_16 m_b_10"><b>아이디 찾기</b></div>
              <div>
                <input type="text" placeholder="담당자 이름" name="name" v-model="userInfo.name">
                <div class="input_but_wrap">
                  <input type="number" placeholder="담당자 전화번호" name="contact" v-model="userInfo.send_to">
                  <a v-on:click="getVerifyNumber">인증번호받기</a>
                </div>
                <input type="text" placeholder="인증번호" name="authNumber" v-model="userInfo.code">
              </div>
              <div class="font_12 color_r">{{ message }}</div>
              <div class="but_wrap">
                <div class="m_b_10"><a class="w_100" @click="findId">확인</a></div>
                <div>
                  <nuxt-link to="/admin/user/find/password" class="line_but">비밀번호 찾기</nuxt-link>
                  <nuxt-link to="/admin/user/login" class="line_but">로그인</nuxt-link>
                </div>
              </div>
            </div>
          </form>

        </div>
        <div class="img_wrap"></div>
      </div>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/admin/user/find/email/index.js"></script>
