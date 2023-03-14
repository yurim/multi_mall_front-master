<template>
  <client-only>
  <div class="adminWrap">
    <StoreAdminHeader></StoreAdminHeader>
    <StoreAdminSideNav></StoreAdminSideNav>
    <div class="content_wrap">
      <div class="amazic_login_wrap">
        <div class="amazic_title">어메이직구 로그인</div>
        <div class="m_t_40">
          <ul>
            <li>
              <div class="title">아이디</div>
              <div class="body">
                <div class="input_but_wrap">
                  <input type="text" v-model="email" @keyup.enter="login" placeholder="내용을 입력해주세요.">
                </div>
              </div>
            </li>
            <li>
              <div class="title">비밀번호</div>
              <div class="body">
                <div class="input_but_wrap">
                  <input type="password" v-model="password" @keyup.enter="login" placeholder="내용을 입력해주세요.">
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="but_wrap text-center m_t_40">
          <a @click="login">로그인</a>
        </div>
      </div>
    </div>
    <StoreAdminFooter></StoreAdminFooter>
  </div>
  </client-only>
</template>
<script src="@/assets/javascripts/store_admin/amazic9/login/index.js"></script>
