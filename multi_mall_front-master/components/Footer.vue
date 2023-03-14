<template>
  <div>
    <div class="footer_wrap" :class="{ position_Fixed : positionFixed, hidden : !isOpen}">
      <v-container>

        <div class="close_btn" v-if="positionFixed">
          <a href="javascript:" @click="footerInfoOpenBtn()">
            <div v-if="isOpen">닫기</div>
            <div v-else>열기</div>
          </a>
        </div>

        <div class="footer_wrap__top_wrap">
          <ul class="footer_nav">
            <li>
              <nuxt-link to="/agreement/privacy">개인정보처리방침</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/agreement/terms">이용약관</nuxt-link>
            </li>
          </ul>

          <ul class="customer_wrap">
            <li><b>상담/주문전화 {{ csInfo.phone }}</b></li>
            <li><b>CS운영시간 {{ csInfo.cs_time }}</b></li>
            <li class="store_admin_login_btn">
              <nuxt-link to="/admin/user/login">몰리 판매자 로그인</nuxt-link>
            </li>
          </ul>
        </div>

        <ul class="footer_info">
          <li><b>대표이사:</b> {{ businessInfo.ceo_name }}</li>
          <li><b>사업자등록번호:</b> {{ businessInfo.license_num }}</li>
          <li><b>통신판매업신고:</b> {{ businessInfo.sale_num }} <a
            href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=8418800786" target="_blank">[사업자정보확인]</a></li>
          <li><b>회사명:</b> {{ businessInfo.company_name }}</li>
          <li><b>전화:</b> {{ businessInfo.phone }}</li>
          <li v-if="businessInfo.fax"><b>팩스:</b> {{ businessInfo.fax }}</li>
          <!--          <li><b>이메일:</b> {{ businessInfo.email }}</li>-->
          <li><b>이메일:</b> {{ csInfo.email }}</li>
          <li><b>주소:</b> {{ businessInfo.address }}</li>
        </ul>

        <div class="footer_quick_info_wrap">
          <div class="footer_last_info">
            (주)13hz는 통신판매중개자로서 "몰리"의 상품은 개별 판매자가 직접 등록하며, 입점판매자가 등록한 상품정보 및 거래에 대해 (주)13hz는 일체 책임을 지지 않습니다.<br>
            해외 사이트에서 상품을 대량 소싱하는 쇼핑몰 특성상 일부 상품이 상표권 및 지적재산권을 침해하게 되는 경우가 발생할 수 있습니다.<br>
            해당사항은 고객센터로 연락주시면 최대한 빠르게 처리해 드리겠습니다.
          </div>
          <div class="footer_bottom">
            <div>Copyright(c) 2019 market all right reserved.</div>
            <div class="pull-right">
              <a onclick="goValidEscrow('im_ilsarmh11S');">
                <img alt="toss payments" src="@/assets/img/img_mark01.png" width="120" style="cursor:hand">
              </a>
            </div>
          </div>
        </div>

      </v-container>
    </div>
    <div class="scroll_btn_wrap" :class="upDownBtnScroll? 'on':''" v-show="ScrollBtn">
      <v-container>
      <div class="scroll_box">
        <div class="side_top"><a href="javascript:" @click="scrollTop()"></a></div>
        <div class="side_bottom"><a href="javascript:" @click="scrollDown()"></a></div>
      </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Footer',
  props: {
    positionFixed: {
      type: Boolean,
    },
    ScrollBtn: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters({
      businessInfo: 'main/businessInfo',
      csInfo: 'main/csInfo',
    }),
  },
  data() {
    return {
      upDownBtnScroll: false,
      isOpen: false,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {

    /**
     * 스크롤을 최상단으로 이동
     */
    scrollTop() {
      window.scroll(0, 0);
    },
    scrollDown() {
      window.scroll(0, document.body.scrollHeight);
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop; // 현재 스크롤바 위치
      const fullHeight = document.body.scrollHeight; //  margin 값은 포함 x
      // 헤더 270 + 네비게이션 뎁스 360 + 간격 20 만큼 내려왔을때, 페이지 전체 높이가 1500 보다 클때
      this.upDownBtnScroll = fullHeight > 1500 && scrollTop > 650;
    },

    footerInfoInit() {
      this.isOpen = !this.positionFixed;
    },
    footerInfoOpenBtn() {
      this.isOpen = !this.isOpen;
    },
  },
  activated() {
    this.isOpen = false;
  },
  async created() {
    await this.$store.dispatch('main/getBusinessInfo');
    this.footerInfoInit();
  },
};
</script>

<style scoped>
</style>
