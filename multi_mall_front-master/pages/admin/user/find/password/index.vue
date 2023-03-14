<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <div class="login_wrap">
        <div class="side_bar">

          <div class="logo_wrap">
            <img alt="company logo" src="@/assets/img/admin/molly_logo.svg">
          </div>

          <form>
            <div class="input_wrap">
              <div class="font_16 m_b_10"><b>비밀번호 찾기</b></div>
              <div>
                <input type="text" placeholder="아이디(이메일)입력" v-model="userInfo.email" name="email">
                <input type="text" placeholder="담당자 이름" v-model="userInfo.name" name="name">
                <div class="input_but_wrap">
                  <input type="text" placeholder="담당자 전화번호" v-model="userInfo.send_to" name="contact">
                  <a v-on:click="getVerifyNumber">인증번호받기</a>
                </div>
                <input type="text" placeholder="인증번호" v-model="userInfo.code" name="authNumber">
                <input type="password" placeholder="새 비밀번호" v-model="userInfo.password" name="password" v-if="isAccount">
                <input type="password" placeholder="새 비밀번호 확인" v-model="userInfo.passwordCheck" name="passwordCheck" v-if="isAccount">
              </div>
              <div class="color_r font_12" v-if="message">{{ message }}</div>
              <div class="color_r font_12" v-if="validation">{{ validation }}</div>
              <div class="but_wrap">
                <div>
                  <nuxt-link class="line_but" to="/admin/user/login">취소</nuxt-link>
                  <a @click.prevent="changePassword" v-if="isAccount">변경</a>
                  <a @click.prevent="findPassword" v-else>인증확인</a>
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
<script src="@/assets/javascripts/admin/user/find/password/index.js"></script>
