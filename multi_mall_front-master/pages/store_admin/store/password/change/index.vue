<template>
  <client-only>
  <div class="adminWrap">
    <div class="body_wrap">
      <StoreAdminHeader></StoreAdminHeader>
      <StoreAdminSideNav></StoreAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_three">
              <ul>
                <li class="page_title">관리자 비밀번호 변경</li>
                <li>
                  <div class="title">변경할 비밀번호</div>
                  <div class="body">
                    <div class="input_wrap">
                      <input type="password" placeholder="비밀번호 입력" v-model="manage.password">
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">비밀번호 확인</div>
                  <div class="body">
                    <div class="input_wrap">
                      <input type="password" placeholder="비밀번호 확인 입력" v-model="manage.passwordCheck">
                    </div>
                  </div>
                </li>
              </ul>
              <div class="but_wrap text-center">
                <nuxt-link class="line_but" to="/store_admin/main">확인</nuxt-link>
                <a @click="change">수정</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StoreAdminFooter></StoreAdminFooter>
    </div>
  </div>
  </client-only>
</template>
<script src="@/assets/javascripts/store_admin/store/password/change/index.js"></script>
