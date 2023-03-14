<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>

        <div class="list_title_wrap"><span>STORE</span></div>
        <div class="store_list_wrap m_b_40">
          <div>
            <div class="store_info_wrap">
              <div class="store_info_wrap__img contain">
                <a>
                  <DefaultImage :imageUrl="storeInfo.profile" />
                </a>
              </div>
              <div class="store_info_wrap__title_wrap">
                <a class="store_info_wrap__title w_auto">{{ storeInfo.name }}</a>
                <div>- <template v-if="storeInfo.category.length > 0">{{ storeInfo.category[0].name }}</template></div>
                  <!-- TODO 스타일 -->
<!--                <div>-</div>-->
                <div v-if="storeInfo.age_target.length > 0">- {{ storeInfo.age_target_str.join(', ') }}</div>
                <div class="square_but_wrap"><a class="line_but" v-on:click="popStoreInfo">판매자 상세정보</a></div>
                <!-- TODO 태그 연동 -->
                <!-- <div>- #린넨 #블라우스 #슬랙스 #수영복</div> -->
              </div>
<!--              <div class="store_info_wrap__icon">-->
<!--                <a>-->
                  <!-- TODO 스토어찜 기능 필요 (현재 관련 모델링 X) -->
<!--                  <img alt="스토어싫어요 이미지" src="@/assets/img/user/icon/like_off.png">-->
                  <!-- <img alt="스토어좋아요 이미지" src="@/assets/img/user/icon/like_on.png"> -->
<!--                </a>-->
<!--              </div>-->
            </div>
          </div>
        </div>

      </div>

      <div class="top_sub_menu_wrap">
        <div class="top_sub_menu_wrap_item top_category_wrap" >
          <div class="title m_b_20">스토어 관련 카테고리</div>
          <ul class="store_category_wrap">
            <li><a :class="category_id === null ? 'color_main_01 font_500' : ''" v-on:click="clickCategory({id: null})">전체보기</a></li>
            <li v-for="category in storeInfo.category" :key="category.name">
              <a :class="category.id === category_id ? 'color_main_01 font_500' : ''" v-on:click="clickCategory(category)">{{ category.name }}</a>
            </li>
          </ul>
        </div>

      </div>

      <div>

        <ul class="top_range_wrap">
          <li v-for="(type, i) in filter_sorts" :key="i" v-on:click="onFilterSort(type.value)">
            <a :class="type.value === filter_sort ? 'color_main_01' : ''">{{ type.text }}</a>
          </li>
        </ul>

        <div class="product_list_wrap four_list">
          <product-list :productList="this.product_list"></product-list>
        </div>
      </div>

      <!-- Infinite Scroll Start -->
      <div>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more"></div>
          <div slot="no-results"></div>
          <div slot="error" slot-scope="{ trigger }">
            상품을 불러오는데 오류가 발생했습니다.
            <a href="javascript:;" @click="trigger">다시 불러오기</a>
          </div>
        </infinite-loading>
      </div>
      <!-- Infinite Scroll End -->

    </v-container>
    <Footer :ScrollBtn="true"></Footer>
  </div>
</template>
<script src="@/assets/javascripts/store/_id/index.js"></script>
