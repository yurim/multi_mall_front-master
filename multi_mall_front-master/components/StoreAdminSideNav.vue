<template>
    <div class="admin_side_nav_wrap">
        <ul id="adminSideNav">

            <li @click="clickLi(menu.name, menu.path)" v-for="menu in menus" :key="menu.name"
                v-bind:class="{open: currentOpen===menu.name || $route.path.includes(menu.path)}">
                <a href="javascript:;">{{menu.name}}</a>
                <ul>
                    <li v-for="child in menu.child" :key="child.name">
                      <nuxt-link :to="menu.path + child.path" :class="{'nuxt-link-active': `${menu.path}${child.path}` === $route.path}">
                        {{child.name}}</nuxt-link>
                    </li>
                </ul>
            </li>

        </ul>
    </div>
</template>

<script>

export default {
  name: 'AdminSideNav',
  data: () => ({
    currentOpen: null,

    menus: [
      {
        name: '상품관리',
        path: '/store_admin/product',
        child: [
          { name: '상품목록', path: '' },
          { name: '상품등록', path: '/new' },
          { name: '해외 상품리뷰 관리', path: '/review/abroad' },
          { name: '국내 상품리뷰 관리', path: '/review/domestic' },
          { name: '상품문의', path: '/qna' },
          { name: '외부 상품 연동', path: '/linkage' },
          { name: '11번가 상품 연동', path: '/st11' },
          { name: '상품 일괄 수정', path: '/batch_update' },
        ],
      },
      {
        name: '크롤링데이터',
        path: '/store_admin/crawling',
        child: [
          { name: '크롤링데이터', path: '' },
        ],
      },
      {
        name: '판매관리',
        path: '/store_admin/sales',
        child: [
          { name: '주문조회', path: '/order' },
          { name: '미결제 확인', path: '/not_paid' },
          { name: '발주/발송 관리', path: '/dispatch' },
          { name: '배송현황 관리', path: '/delivery' },
          { name: '구매확정 내역', path: '/decide' },
          { name: '취소관리', path: '/cancel' },
          { name: '반품관리', path: '/return_delivery' },
          { name: '교환관리', path: '/exchange' },
          { name: '배송대행신청', path: '/amazic9' },
        ],
      },
      {
        name: '템플릿관리',
        path: '/store_admin/template',
        child: [
          { name: '배송비 템플릿', path: '/delivery' },
          { name: '묶음배송그룹 템플릿', path: '/delivery_group' },
          { name: '배송정보고시 템플릿', path: '/notices/dlvry_ntc' },
          { name: '상품정보고시 템플릿', path: '/notices/prdct_ntc' },
          { name: '교환 / 반품 정보고시 템플릿', path: '/notices/exchng_rtnd' },
          { name: '해외상품정보 고시 템플릿', path: '/abroad/top' },
        ],
      }, {
        name: '정산관리',
        path: '/store_admin/calculation',
        child: [
          { name: '정산관리', path: '/' },
        ],
      }, {
        name: '매장정보',
        path: '/store_admin/store',
        child: [
          { name: '매장정보', path: '/' },
          { name: '관리자비밀번호변경', path: '/password/check' },
        ],
      }, {
        name: '대행업체 관리',
        path: '/store_admin/agency',
        child: [
          { name: '구매 / 배송 대행업체 관리', path: '/' },
        ],
      },
      // {
      //   name: '공지사항',
      //   path: '',
      // }, {
      //   name: '통계',
      //   path: '',
      // }, {
      //   name: '메뉴얼자료',
      //   path: '',
      // },
    ],
  }),
  methods: {
    clickLi(name, path) {
      const isCurrentPath = this.$route.path.includes(path);
      if (!isCurrentPath) {
        if (this.currentOpen === name) this.currentOpen = null;
        else this.currentOpen = name;
      }
    },
  },
};
</script>

<style scoped>
</style>
