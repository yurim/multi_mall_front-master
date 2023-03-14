<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <div class="login_wrap">
        <div class="side_bar">

          <div class="logo_wrap">
            <img alt="company logo" src="@/assets/img/admin/molly_logo.svg">
          </div>

          <div class="input_wrap">
            <div class="font_16 m_b_10"><b>아이디 찾기</b></div>
            <div>
              <div>{{ name }} 담당자의 아이디는</div>
              <div class="color_main_01">{{ email }}</div>
              <div>입니다.</div>
            </div>
            <div class="but_wrap">
              <div>
                <nuxt-link class="line_but" to="/admin/user/find/password">비밀번호 찾기</nuxt-link>
                <nuxt-link class="line_but" to="/admin/user/login">로그인</nuxt-link>
              </div>
            </div>
          </div>

        </div>
        <div class="img_wrap"></div>
      </div>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/admin/user/find/email/result.js"></script>
