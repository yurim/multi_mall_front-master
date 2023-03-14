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
                  <div class="title">관리자 비밀번호 변경</div>
                  <div class="body">
                    <div class="input_wrap">
                      <input type="password" placeholder="기존 비밀번호" v-model="password" v-on:keyup.enter="confirm">
                    </div>
                  </div>
                </li>
              </ul>
              <div class="but_wrap text-center">
                <a class="line_but" @click="confirm">확인</a>
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
<script src="@/assets/javascripts/store_admin/store/password/check/index.js"></script>
