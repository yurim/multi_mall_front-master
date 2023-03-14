<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <div class="login_wrap">
        <div class="side_bar">

          <div class="logo_wrap">
            <img src="@/assets/img/admin/molly_logo.svg" alt="company logo">
          </div>

          <form>
            <div class="input_wrap">
              <div class="font_16 m_b_10"><b>관리자 회원가입</b></div>
              <div>
                <input
                  type="text"
                  placeholder="아이디(이메일) 입력"
                  name="email"
                  autocomplete="on"
                  v-model.lazy="userInfo.email">
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  name="password"
                  autocomplete="off"
                  v-model.lazy="userInfo.password"
                  v-on:keypress="passwordCheck">
                <input
                  type="password"
                  placeholder="비밀번호 확인 입력"
                  name="passwordConfirm"
                  autocomplete="off"
                  v-model.lazy="passwordConfirm"
                  v-on:keypress="passwordCheck">
                <input
                  type="text"
                  placeholder="이름 입력"
                  name="name"
                  autocomplete="off"
                  v-model.lazy="userInfo.name">
                <div class="input_but_wrap">
                  <input
                    type="number"
                    placeholder="전화번호 입력"
                    name="contact"
                    autocomplete="off"
                    v-model.lazy="userInfo.contact">
                  <a v-on:click="getAuthNumber">인증번호 받기</a>
                </div>
                <input
                  type="number"
                  placeholder="인증번호"
                  name="authNumber"
                  autocomplete="off"
                  v-model.lazy="userInfo.authNumber">
              </div>
              <!-- <div class="checkbox_wrap">
                <input type="checkbox" id="전체 약관 동의" v-model="allCheck">
                <label for="전체 약관 동의">전체 약관 동의</label>
                <div v-for="item in items" v-bind:key="item.value">
                  <input type="checkbox" :id="item.text" :value="item.value" v-model="checked">
                  <label :for="item.text">{{ item.text }}</label>
                </div>
              </div> -->
              <div class="m_b_10 font_12 color_r">{{ message }}</div>
              <div class="but_wrap">
                <div class="m_b_10">
                  <nuxt-link to="/admin/user/login" class="line_but">로그인</nuxt-link>
                  <a v-on:click="createAdmin">확인</a>
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

<script src="@/assets/javascripts/admin/user/regist/index.js"></script>
