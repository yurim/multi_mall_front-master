<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <div class="login_wrap">
        <div class="side_bar">

          <div class="logo_wrap">
            <img alt="company logo" src="@/assets/img/admin/molly_logo.svg">
          </div>

          <div class="input_wrap">
            <div class="font_16 m_b_10"><b>비밀번호 찾기</b></div>
            <div>
              <div>홍길동 담당자의 임시비밀번호를</div>
              <div class="color_main_01">{{ email }}</div>
              <div>메일주소로 전송하였습니다. 로그인 후 비밀번호 수정 바랍니다.</div>
            </div>
            <div class="but_wrap">
              <div>
                <a class="line_but" v-on:click="routeFindId">아이디 찾기</a>
                <a class="line_but" v-on:click="routeLogin">로그인</a>
              </div>
            </div>
          </div>

        </div>
        <div class="img_wrap"></div>
      </div>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/admin/user/find/password/result.js"></script>
