<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div class="login_wrap">
        <div class="login_wrap_title"><b>LOGIN</b></div>
        <form>
          <ul>
            <li><input type="text" placeholder="아이디(이메일)입력" v-model="user.email" v-on:keyup.enter="userLogin"></li>
            <li><input type="password" placeholder="비밀번호 입력" v-model="user.password" v-on:keyup.enter="userLogin"></li>
            <li v-if="message.login.length > 0"><span class="font_12 color_r">{{ message.login }}</span></li>
            <li>
              <div class="checkbox_wrap pull-left">
                <input type="checkbox" id="rememberId" v-model="rememberId">
                <label for="rememberId">아이디 저장</label>
              </div>
              <div class="pull-right">
                <nuxt-link to="/user/find/email">아이디 찾기</nuxt-link>
                /
                <nuxt-link to="/user/find/password">비밀번호 찾기</nuxt-link>
              </div>
            </li>
          </ul>
          <ul class="but_wrap m_t_20">
            <li><a v-on:click="userLogin" class="w_100">로그인</a></li>
            <li><nuxt-link class="w_100 line_but" to="/user/regist">회원가입</nuxt-link></li>
            <li><a class="w_100 naver_but" id="naverIdLogin_loginButton">네이버로 시작하기</a></li>
          </ul>
        </form>

        <div>
          <div class="login_wrap_title m_t_40"><b>비회원 주문조회</b></div>

          <div>
            <ul>
              <li><input type="text" placeholder="이메일을 입력해주세요." v-model="nonUser.email" v-on:keyup.enter="nonUserOrderInquiry"></li>
              <li><input type="text" placeholder="휴대폰번호를 입력해주세요." v-model="nonUser.phone" v-on:keyup.enter="nonUserOrderInquiry"></li>
              <li v-if="message.nonUserOrderInquiry.length > 0"><span class="font_12 color_r">{{ message.nonUserOrderInquiry }}</span></li>
              <li class="but_wrap"><a class="gray_but w_100" v-on:click="nonUserOrderInquiry">비회원 주문 조회</a></li>
            </ul>
          </div>

        </div>
      </div>

    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/user/login/index.js"></script>
