<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <div class="login_wrap">
        <div class="side_bar">

          <div class="logo_wrap">
            <nuxt-link to="/main"><img src="@/assets/img/admin/molly_logo.svg" alt="company logo"></nuxt-link>
          </div>

          <form>
            <div class="input_wrap">
              <div class="font_16 m_b_10"><b>관리자 로그인</b></div>
              <div>
                <input
                  type="text"
                  placeholder="아이디(이메일) 입력"
                  name="email"
                  autocomplete="on"
                  v-on:keyup.enter="Login"
                  v-model.lazy="data.email">
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  name="password"
                  autocomplete="off"
                  v-on:keyup.enter="Login"
                  v-model.lazy="data.password">
              </div>
              <div class="checkbox_wrap pull-left">
                <input type="checkbox" id="rememberId" v-model="rememberId">
                <label for="rememberId">아이디 저장</label>
              </div>
              <div class="m_b_10 w_100 i_b font_12 color_r">{{ message }}</div>
              <div class="but_wrap">
                <div class="m_b_10">
                  <a class="w_100" v-on:click.prevent="Login">로그인</a>
                </div>
                <div class="m_b_10">
                  <nuxt-link class="w_100" to="/store/request/check">판매자입점신청</nuxt-link>
                </div>
                <div>
                  <nuxt-link to="/admin/user/find/email" class="line_but">아이디 찾기</nuxt-link>
                  <nuxt-link to="/admin/user/find/password" class="line_but">비밀번호 찾기</nuxt-link>
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
<script src="@/assets/javascripts/admin/user/login/index.js"></script>
