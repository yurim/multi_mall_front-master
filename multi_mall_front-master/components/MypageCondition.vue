<template>
  <ul class="condition_wrap">
    <li>
      <div class="info_wrap">
        <div class="img_wrap"><img alt="주문배송조회 아이콘" src="@/assets/img/user/icon/mypage_1.png"></div>
        <div class="text_wrap">주문 배송 조회</div>
        <nuxt-link class="num_wrap" to="/mypage/order"><span>{{ orderCount | comma }}</span>건</nuxt-link>
      </div>
    </li>
    <li>
      <div class="info_wrap">
        <div class="img_wrap"><img alt="포인트적립 아이콘" src="@/assets/img/user/icon/mypage_2.png"></div>
        <div class="text_wrap">포인트</div>
        <nuxt-link class="num_wrap" to="/mypage/point/saving"><span>{{ currentPoint | comma }}</span>P</nuxt-link>
      </div>
    </li>
    <!--
    <li>
      <div class="info_wrap">
        <div class="img_wrap"><img alt="할인쿠폰 아이콘" src="@/assets/img/user/icon/mypage_3.png"></div>
        <div class="text_wrap">할인 쿠폰</div>
        <nuxt-link class="num_wrap" to=""><span>11</span>개</nuxt-link>
      </div>
    </li>
    -->
    <li>
      <div class="info_wrap">
        <div class="img_wrap"><img alt="MY리뷰 아이콘" src="@/assets/img/user/icon/mypage_4.png"></div>
        <div class="text_wrap">MY 리뷰</div>
        <nuxt-link class="num_wrap" to="/mypage/review"><span>{{ reviewCount | comma }}</span>건</nuxt-link>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';

const prefix = 'mypage';

export default {
  name: 'MypageCondition',
  computed: {
    ...mapGetters({
      orderCount: `${prefix}/orderCount`,
      currentPoint: `${prefix}/currentPoint`,
      reviewCount: `${prefix}/reviewCount`,
    }),
  },
  async created() {
    await this.$store.dispatch(`${prefix}/getSummery`);
  },
};
</script>

<style scoped>
</style>
