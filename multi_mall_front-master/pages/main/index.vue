<template>
  <client-only>
  <div class="userWrap main_padding_bottom">

    <Header></Header>
    <MainSlide />
    <v-container class="sticky-container" sticky-container>
      <SideBar></SideBar>

      <main-article></main-article>

<!--      <div class="section_01">-->
<!--        <div class="inner">-->
<!--          <h2 class="sec_main_title star">MOLLY만의 특별한 기획전!</h2>-->
<!--          <div class="exhibition_list_wrap">-->
<!--            <ul class="exhibition_list">-->
<!--              <li>-->
<!--                <nuxt-link to="/store/37">-->
<!--                  <div class="exhibition_img">-->
<!--                    <img src="@/assets/img/user/exhibition/exhibition_pc_03.png" alt="기획전 페이지로 가기">-->
<!--                  </div>-->
<!--                  <div class="exhibition_box">-->
<!--                    <div class="sub_title">여성의류 기획전</div>-->
<!--                    <ul class="kword">-->
<!--                      <li>#원피스</li>-->
<!--                      <li>#가을패션</li>-->
<!--                    </ul>-->
<!--                    <span class="more small">보러가기</span>-->
<!--                  </div>-->
<!--                </nuxt-link>-->
<!--              </li>-->
<!--              <li>-->
<!--                <nuxt-link to="/product/category?cate=610a479f5f64f2df12e3f443">-->
<!--                  <div class="exhibition_img">-->
<!--                    <img src="@/assets/img/user/exhibition/exhibition_pc_04.png" alt="기획전 페이지로 가기">-->
<!--                  </div>-->
<!--                  <div class="exhibition_box">-->
<!--                    <div class="sub_title">생활/건강</div>-->
<!--                    <ul class="kword">-->
<!--                      <li>#건강관리</li>-->
<!--                      <li>#위생</li>-->
<!--                      <li>#생활용품</li>-->
<!--                    </ul>-->
<!--                    <span class="more small">보러가기</span>-->
<!--                  </div>-->
<!--                </nuxt-link>-->
<!--              </li>-->
<!--              <li>-->
<!--                <nuxt-link to="/store/33">-->
<!--                  <div class="exhibition_img">-->
<!--                    <img src="@/assets/img/user/exhibition/exhibition_pc_05.png" alt="기획전 페이지로 가기">-->
<!--                  </div>-->
<!--                  <div class="exhibition_box">-->
<!--                    <div class="sub_title">Apple 상품기획전</div>-->
<!--                    <ul class="kword">-->
<!--                      <li>#아이폰케이스</li>-->
<!--                      <li>#에어팟케이스</li>-->
<!--                    </ul>-->
<!--                    <span class="more small">보러가기</span>-->
<!--                  </div>-->
<!--                </nuxt-link>-->
<!--              </li>-->
<!--              <li>-->
<!--                <nuxt-link to="/product/category?cate=610a47ae5f64f2df12e3f5db">-->
<!--                  <div class="exhibition_img">-->
<!--                    <img src="@/assets/img/user/exhibition/exhibition_pc_06.png" alt="기획전 페이지로 가기">-->
<!--                  </div>-->
<!--                  <div class="exhibition_box">-->
<!--                    <div class="sub_title">반려동물</div>-->
<!--                    <ul class="kword">-->
<!--                      <li>#강아지</li>-->
<!--                      <li>#고양이</li>-->
<!--                      <li>#반려동물</li>-->
<!--                    </ul>-->
<!--                    <span class="more small">보러가기</span>-->
<!--                  </div>-->
<!--                </nuxt-link>-->
<!--              </li>-->
<!--            </ul>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <!-- Products Start -->
      <div>
        <div class="list_title_wrap">
          <h2 class="sec_main_title new">MOLLY의 새로운 아이템!</h2>
          <!-- <nuxt-link to="/product/category">더보기</nuxt-link> -->
        </div>

        <div class="product_list_wrap four_list">
          <product-list :productList="this.product_list"></product-list>
        </div>
      </div>
      <!-- Products End -->

      <!-- Infinite Scroll Start -->
      <div>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more"></div>
          <div slot="no-results">상품이 없습니다.</div>
          <div slot="error" slot-scope="{ trigger }">
            상품을 불러오는데 오류가 발생했습니다.
            <a href="javascript:" @click="trigger">다시 불러오기</a>
          </div>
        </infinite-loading>
      </div>
      <!-- Infinite Scroll End -->

<!--      <div>-->
<!--        <div class="list_title_wrap">-->
<!--          <span>STORE</span>-->
<!--          &lt;!&ndash; <nuxt-link to="/store">더보기</nuxt-link> &ndash;&gt;-->
<!--        </div>-->
<!--        <ul class="store_list_wrap main">-->
<!--          <li v-for="store in stores" :key="`store_${store.id}`">-->
<!--            <nuxt-link :to="`/store/${store.id}`">-->
<!--              <div>-->
<!--                <div class="img_bg_wrap m_b_10" v-bind:style="{ backgroundImage: `url(${ store.profile ? store.profile : require('@/assets/img/product_default_img.png') })` }"></div>-->
<!--&lt;!&ndash;                <img v-if="store.profile" :src="store.profile" alt="스토어 이미지">&ndash;&gt;-->
<!--&lt;!&ndash;                <img v-else src="@/assets/img/product_default_img.png" alt="기본 이미지">&ndash;&gt;-->
<!--              </div>-->
<!--              <div>{{ store.nameKor }}</div>-->
<!--            </nuxt-link>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->

      <!-- Stores Pagenation Start -->
<!--      <div class="pagenation_wrap">-->
<!--        <Pagenation :total-count="storeTotalCount" :page-size="storePageSize" :default-page="storeDefaultPage"-->
<!--                    :page-key-name="'store_page'" :page-size-key-name="'store_page_size'"-->
<!--                    :onPage="onStoresPage"></Pagenation>-->
<!--      </div>-->
      <!-- Stores Pagenation End -->

      <!--      <div>-->
      <!--        <div class="list_title_wrap">-->
      <!--          <span>BEST</span>-->
      <!--          <a href="javascript:;">더보기</a>-->
      <!--        </div>-->
      <!--        <ul class="product_list_wrap four_list best_list">-->
      <!--          <li>-->
      <!--            <a href="javascript:;">-->
      <!--              <div class="img_wrap">-->
      <!--                <div class="best_num_icon_wrap">1</div>-->
      <!--                <img alt="기본 이미지" src="../assets/img/product_default_img.png">-->
      <!--              </div>-->
      <!--              <div class="text_wrap">-->
      <!--                <div class="store_wrap">홍길동샵</div>-->
      <!--                <div class="title_wrap">플라워 드레스 001 플라워 드레스 001 플라워 드레스 001</div>-->
      <!--                <div class="price_wrap">-->
      <!--                  <div class="discount-percentage">43%</div>-->
      <!--                  <div class="sale-price">32,000원</div>-->
      <!--                  <div class="base-price">51,000원</div>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <ul class="icon_wrap">-->
      <!--                <li class="new">NEW</li>-->
      <!--                <li class="best">BEST</li>-->
      <!--                <li class="abroad">해외직구-->
      <!--                  <img alt="기본 이미지" src="../assets/img/user/icon/abroad_icon.png">-->
      <!--                </li>-->
      <!--              </ul>-->
      <!--            </a>-->
      <!--          </li>-->
      <!--          <li>-->
      <!--            <a href="javascript:;">-->
      <!--              <div class="img_wrap">-->
      <!--                <div class="best_num_icon_wrap">2</div>-->
      <!--                <img alt="기본 이미지" src="../assets/img/product_default_img.png">-->
      <!--              </div>-->
      <!--              <div class="text_wrap">-->
      <!--                <div class="store_wrap">홍길동샵</div>-->
      <!--                <div class="title_wrap">플라워 드레스 001 플라워 드레스 001 플라워 드레스 001</div>-->
      <!--                <div class="price_wrap">-->
      <!--                  <div class="discount-percentage">43%</div>-->
      <!--                  <div class="sale-price">32,000원</div>-->
      <!--                  <div class="base-price">51,000원</div>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <ul class="icon_wrap">-->
      <!--                <li class="new">NEW</li>-->
      <!--                <li class="best">BEST</li>-->
      <!--                <li class="abroad">해외직구-->
      <!--                  <img alt="기본 이미지" src="../assets/img/user/icon/abroad_icon.png">-->
      <!--                </li>-->
      <!--              </ul>-->
      <!--            </a>-->
      <!--          </li>-->
      <!--          <li>-->
      <!--            <a href="javascript:;">-->
      <!--              <div class="img_wrap">-->
      <!--                <div class="best_num_icon_wrap">3</div>-->
      <!--                <img alt="기본 이미지" src="../assets/img/product_default_img.png">-->
      <!--              </div>-->
      <!--              <div class="text_wrap">-->
      <!--                <div class="store_wrap">홍길동샵</div>-->
      <!--                <div class="title_wrap">플라워 드레스 001 플라워 드레스 001 플라워 드레스 001</div>-->
      <!--                <div class="price_wrap">-->
      <!--                  <div class="discount-percentage">43%</div>-->
      <!--                  <div class="sale-price">32,000원</div>-->
      <!--                  <div class="base-price">51,000원</div>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <ul class="icon_wrap">-->
      <!--                <li class="new">NEW</li>-->
      <!--                <li class="best">BEST</li>-->
      <!--                <li class="abroad">해외직구-->
      <!--                  <img alt="기본 이미지" src="../assets/img/user/icon/abroad_icon.png">-->
      <!--                </li>-->
      <!--              </ul>-->
      <!--            </a>-->
      <!--          </li>-->
      <!--          <li>-->
      <!--            <a href="javascript:;">-->
      <!--              <div class="img_wrap">-->
      <!--&lt;!&ndash;                TODO 메인에서는 4번쨰 제품 부터는 안나와야함 &ndash;&gt;-->
      <!--                <div class="best_num_icon_wrap">4</div>-->
      <!--                <img alt="기본 이미지" src="../assets/img/product_default_img.png">-->
      <!--              </div>-->
      <!--              <div class="text_wrap">-->
      <!--                <div class="store_wrap">홍길동샵</div>-->
      <!--                <div class="title_wrap">플라워 드레스 001 플라워 드레스 001 플라워 드레스 001</div>-->
      <!--                <div class="price_wrap">-->
      <!--                  <div class="discount-percentage">43%</div>-->
      <!--                  <div class="sale-price">32,000원</div>-->
      <!--                  <div class="base-price">51,000원</div>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <ul class="icon_wrap">-->
      <!--                <li class="new">NEW</li>-->
      <!--                <li class="best">BEST</li>-->
      <!--                <li class="abroad">해외직구-->
      <!--                  <img alt="기본 이미지" src="../assets/img/user/icon/abroad_icon.png">-->
      <!--                </li>-->
      <!--              </ul>-->
      <!--            </a>-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </div>-->
      <!--      -->
      <!--      <div>-->
      <!--        <div class="list_title_wrap">-->
      <!--          <span>EVENT</span>-->
      <!--          <a href="javascript:;">더보기</a>-->
      <!--        </div>-->

      <!--        <div class="swiper_wrap main_event_wrap">-->
      <!--          <client-only>-->
      <!--            <swiper class="swiper" :options="mainEventList">-->
      <!--              <swiper-slide><a href="javascript:;"><img alt="기본 이미지" src="../assets/img/product_default_img.png"></a></swiper-slide>-->
      <!--              <swiper-slide><a href="javascript:;"><img alt="기본 이미지" src="../assets/img/product_default_img.png"></a></swiper-slide>-->
      <!--              <swiper-slide><a href="javascript:;"><img alt="기본 이미지" src="../assets/img/product_default_img.png"></a></swiper-slide>-->

      <!--              <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>-->
      <!--              <div class="swiper-button-next swiper-button-white" slot="button-next"></div>-->
      <!--            </swiper>-->
      <!--          </client-only>-->
      <!--        </div>-->

      <!--      </div>-->
      <!--      -->
      <!--      <div>-->
      <!--        <div class="list_title_wrap">-->
      <!--          <span>STORE</span>-->
      <!--          <a href="javascript:;">더보기</a>-->
      <!--        </div>-->
      <!--        <ul class="store_list_wrap main">-->
      <!--          <li>-->
      <!--            <a href="javascript:;">-->
      <!--              <div><img alt="기본 이미지" src=".. /assets/img/product_default_img.png"></div>-->
      <!--              <div>홍길동1</div>-->
      <!--            </a>-->
      <!--          </li>-->
      <!--          <li>-->
      <!--            <a href="javascript:;">-->
      <!--              <div><img alt="기본 이미지" src="../assets/img/product_default_img.png"></div>-->
      <!--              <div>홍길동1</div>-->
      <!--            </a>-->
      <!--          </li>-->
      <!--          <li>-->
      <!--            <a href="javascript:;">-->
      <!--              <div><img alt="기본 이미지" src="../assets/img/product_default_img.png"></div>-->
      <!--              <div>홍길동1홍길동1홍길동1홍길동1홍길동1홍길동1홍길동1</div>-->
      <!--            </a>-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </div>-->

    </v-container>
    <Footer :positionFixed="true" :ScrollBtn="true" ></Footer>
<!--    익스플로에서만 보이는 팝업창-->
    <div class="ie_error_popup_wrap display_none">
      <div class="error_popup_wrap">
        <div class="error_popup_inner">
          <div class="error_popup_img"></div>
          <div class="error_popup_txt">
            <p>죄송합니다.<em>molly.kr</em>은 해당 브라우저를 서비스하지 않습니다.</p>
            <p>구글 크롬(Chrome)브라우저를 이용해주시기 바랍니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </client-only>
</template>

<script src="@/assets/javascripts/main/index.js"></script>
