<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>
      <div class="compare_show_wrap m_t_20">
        <div class="top_info_wrap">

          <!-- 왼쪽-->
          <div class="top_info_wrap__left">
            <div class="slide_vis">
              <div class="thumb-example">
                <swiper class="swiper gallery-top" :options="swiperOptionTop" ref="swiperTop">
                  <swiper-slide class="slide-0"><DefaultImage :imageUrl="product.main_image" /></swiper-slide>

                  <swiper-slide v-for="(item, index) in product.additional_images" :class="`slide-${index+1}`" :key="`slide_${index}`">
                    <DefaultImage :imageUrl="item.image" />
                  </swiper-slide>
                  <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                  <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                </swiper>
                <!-- swiper2 Thumbs -->
                <swiper class="swiper gallery-thumbs" :options="swiperOptionThumbs" ref="swiperThumbs">
                  <swiper-slide class="slide-0">
                    <div class="img_bg_wrap" v-bind:style="{ backgroundImage: `url(${ product.main_image ? product.main_image : require('@/assets/img/product_default_img.png') })` }" ></div>
                  </swiper-slide>
                  <swiper-slide v-for="(item, index) in product.additional_images" :class="`slide-${index+1}`"
                                :key="`thumbs_${index}`">
                    <DefaultImage :imageUrl="item.image" />
                  </swiper-slide>
                </swiper>
              </div>
            </div>
          </div>

          <!-- 오른쪽 -->
          <div class="product_info_wrap top_info_wrap__right">
            <div class="product_list_wrap">
              <div class="prod_wrap">
                <div class="text_wrap">
                  <div class="store_wrap"><nuxt-link :to="`/store/${product.store_id}`" :class="{lowest_price: product.id === productPriceGroup.lowest_product_id}">{{ product.store_name_kor }}</nuxt-link></div>
                  <div class="title_wrap m_b_10 font_16">{{ product.name }}</div>
                  <div class="reaction p_b_30">
                    <div class="data_star" v-if="product.total_score > 0 && (product.total_review_count + product.abroad_total_review_count) > 0">
                      <div class="only_star"></div>
                      <em>{{ (product.total_score / (product.total_review_count + product.abroad_total_review_count)) | ceil(1) }}</em>
                    </div>
                    <div class="data_star" v-else>
                      <div class="only_star disabled"></div>
                      <em>0</em>
                    </div>
                    <div class="data"><em>{{ product.total_sale_count | kUnit | comma }}</em>개 판매
                    </div>
                    <div class="data"><nuxt-link :to="`/product/${ product.id }`"><em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰</nuxt-link></div>
                  </div>
                  <div class="option_list_wrap">
                    <div class="price_btn_wrap m_b_20">
                      <ul class="even_child_wrap molly_list">
                        <!-- 구매불가 : 몰리판매불가 o, 해외상품여부 x|o, 링크있음 x -->
                        <template v-if="!product.is_sale">
                          <li>
                            <span class="unsell_product">판매중지된 상품입니다.</span>
                          </li>
                        </template>
                        <template v-else>
                          <!-- 링크있음 o -->
                          <li v-if="product.detail_url">
                            <div>직접 구매할게요</div>
                            <a :href="product.detail_url" target="_blank">
                              <div v-if="product.abroad_price && product.abroad_price.price > 0"><b>{{ product.abroad_price.price | comma }}</b> 원</div>
                              <span>{{ product.store_name_kor }} 바로가기</span>
                            </a>
                          </li>
                          <!-- 몰리판매불가 x -->
                          <li class="molly" v-if="!product.display_only">
                            <div class="color_main_01">
                              몰리에서 구매할게요
                              <span class="color_black">(포인트 <span class="color_main_01">{{ product.saving_rate }}</span>% 적립)</span>
                            </div>
                            <nuxt-link :to="`/product/${ product.id }`">
                              <div><b>{{ (product.discount_price ? product.discount_price : product.price) | comma }}</b> 원</div>
                              <span>몰리에서 구매하기</span>
                            </nuxt-link>
                          </li>
                        </template>
                      </ul>
                      <div v-if="lowest_btn_type !== '100' && lowest_btn_type !== '110'" class="explain d_ib_100">*옵션에 따라 가격이 변동될 수 있습니다.</div>
                    </div>
                    <div class="question_wrap" v-if="lowest_btn_type !== '100' && lowest_btn_type !== '110'">
                      <ul class="font_12">
                        <li>
                          <div class="question color_main_01">Q. 몰리에서 바로 구매하기가 왜 더 비싼가요?</div>
                          <div class="answer">몰리의 판매가는  판매원가 + 최대 50%(상품 하자 및 반품책임 수수료) + 무게에 따른 배송비를 포함하여<br/>
                            <em>구매대행 형식</em>으로 판매를 진행하기 때문에 가격이 비싸집니다.</div>
                        </li>
                      </ul>
                    </div>
                    <div class="shipping_information_wrap" v-if="lowest_btn_type !== '100' && lowest_btn_type !== '110'">
                      <ul class="even_child_wrap">
                        <li v-if="product.detail_url">
                          <div class="top_title">
                            <span>{{ product.store_name_kor }}</span><em>배송 정보</em>
                          </div>
                          <div class="info_wrap">
                            <div class="icon_wrap">
                              <div class="order_icon"></div>
                            </div>
                            <div>
                              <template v-if="product.abroad_price && product.abroad_price.delivery_fee">
                                배송비 <b>{{ product.abroad_price.delivery_fee | comma }} 원</b><br>
                              </template>
                              <template v-else>배송비 <b>무료배송</b><br></template>
                              <div class="explain m_b_0">영업일 기준 평균 <em class="c_black">{{ product.avg_delivery_days ? product.avg_delivery_days : 20 }}</em>일 내 도착</div>
                            </div>
                          </div>
                        </li>
                        <li v-if="lowest_btn_type !== '100' && lowest_btn_type !== '110'">
                          <div class="top_title">
                            <span class="color_main_01">몰리</span><em>배송 정보</em>
                          </div>
                          <div class="info_wrap">
                            <div class="icon_wrap">
                              <div class="order_icon"></div>
                            </div>
                            <div>
                              <template v-if="product.delivery_info && (product.delivery_info.default_fee > 0)">
                                배송비 <b>{{product.delivery_info.default_fee | comma}}원</b>
                              </template>
                              <template v-else>
                                배송비 <span><b class="color_main_01">무조건</b> <b>무료배송</b></span><br>
                              </template>
                              <div class="explain m_b_0">발송 처리 이후 평균 <em class="c_black">{{ product.avg_delivery_days ? product.avg_delivery_days : 20 }}</em>일 내 도착</div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div class="guide_text_wrap m_b_0">
                      <ul>
                        <li>*배송 소요 일수는 대략적인 정보이며, 해외 판매처 및 국내 통관절차 등으로 인하여 소요 시간이 변동될 수 있는 점 양해 부탁드립니다.</li>
                      </ul>
                    </div>

                    <div class="compare_price_chart_wrap line_top">
                      <ComparePriceChart :lowestProduct="mainGroupProducts[0]" :highestProduct="productPriceGroup.highest_product"></ComparePriceChart>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="compare_store_list_wrap line_top">
              <div class="m_b_10"><b>가격비교 상품</b><span> (총 <span class="color_main_01">{{ groupProductTotalCount | comma }}</span>개 상품)</span></div>
              <table>
                <colgroup>
                  <col width="30">
                  <col>
                  <col width="80">
                  <col width="150">
                  <col width="90">
                </colgroup>
                <thead>
                <tr>
                  <th colspan="2">판매처</th>
                  <th>배송 소요일</th>
                  <th>직접 구매가 + <em>(배송비)</em></th>
                  <th>몰리 구매가</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(data, i) in mainGroupProducts" v-if="i < 7" :class="{on : i === 0}">
                  <td class="text-center">{{ i + 1 }}</td>
                  <td>
                    <nuxt-link :to="`/product/${ data.id }`" class="d_ib">
                      <div>{{ data.store_name }}</div>
                    </nuxt-link>
                    <a class="question_mark_btn_gray" v-if="['TAOBAO', 'PDD'].indexOf(data.target) > -1" href="javascript:">?
                      <div class="inner">
                        해당 판매처는 <b>배송대행서비스</b>가<br>
                        <b>꼭</b> 필요한 판매처입니다.</div>
                    </a>
                  </td>
                  <td>
                    평균 {{ data.avg_delivery_days ? data.avg_delivery_days : 20 }}일
                  </td>
                  <td>
                    <div class="text-right">
                      <template v-if="data.is_sale && data.abroad_price && data.abroad_price.price > 0">
                        <template v-if="data.detail_url">
                          <a :href="data.detail_url" target="_blank" class="under_line" :class="[i === 0 ? 'color_main_01' : 'color_gray_70']">
                            <span>{{ data.abroad_price.price | comma }}원</span>
                            &nbsp;+&nbsp;
                            <template v-if="data.abroad_price.delivery_fee">
                              ({{ data.abroad_price.delivery_fee | comma }}원)
                            </template>
                            <template v-else>무료배송</template>
                          </a>
                        </template>
                        <template v-else>
                          <span >
                            {{ data.abroad_price.price | comma }}원
                          </span>
                          &nbsp;+&nbsp;
                          <template v-if="data.abroad_price.delivery_fee">
                            ({{ data.abroad_price.delivery_fee | comma }}원)
                          </template>
                          <template v-else>무료배송</template>
                        </template>
                      </template>
                      <template v-else>
                        <span>-</span>
                      </template>
                    </div>
                  </td>
                  <td>
                    <nuxt-link :to="`/product/${ data.id }`">
                      <div class="text-right" v-if="data.is_sale && !data.display_only">
                        <span :class="[i === 0 ? 'color_main_01' : 'color_gray_70']">{{ data.price | comma }}원</span>
                      </div>
                      <div class="text-right" v-else><span class="color_gray_70">-</span></div>
                    </nuxt-link>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="more_btn_wrap" v-if="groupProductTotalCount > 7">
                <a class="color_gray_70 under_line " href="#groupProducts">{{ groupProductTotalCount - 7 | comma }}개 상품 더보기</a>
              </div>
            </div>
          </div>

          <div class="bottom_info_wrap">

            <section>
              <!-- 탭메뉴 START -->
              <scrollactive class="my-nav text-center" :active-class="'on'" :modify-url="false" id="groupProducts">
                <ul class="tab_detail_content">
                  <li class="on"><a href="#groupProducts" class="scrollactive-item">가격비교 상품</a></li>
                  <li><a href="#review" class="scrollactive-item">상품 구매리뷰</a></li>
                  <li v-if="product.content"><a href="#detail" class="scrollactive-item">상품상세</a></li>
                </ul>
              </scrollactive>
              <!-- 탭메뉴 END -->

              <div>
                <!-- 가격비교 상품 START -->
                <div class="product_list_wrap two_list m_b_0">
                  <ul>
                    <li v-for="(data, i) in productPriceGroup.products"
                        :class="{ 'line_top_none': i < 3, 'product_lowest_price': data.id === productPriceGroup.lowest_product_id }">
                      <div class="prod_wrap">
                        <nuxt-link :to="`/product/${data.id}`">
                          <div class="img_wrap">
                            <DefaultImage :imageUrl="data.main_image"></DefaultImage>
                          </div>
                        </nuxt-link>
                        <div class="text_wrap">
                          <div class="store_wrap"><nuxt-link :to="`/store/${data.store_id}`">{{ data.store_name }}</nuxt-link></div>
                          <div class="title_wrap"><nuxt-link :to="`/product/${data.id}`">{{ data.name }}</nuxt-link></div>
                          <div class="price_wrap line_bottom">
                            <dl>
                              <dt class="store_title">
                                <div v-if="data.abroad_price">
                                  <span>직접 구매가</span>
                                </div>
                                <div v-if="!data.display_only">
                                  <span>몰리 판매가</span>
                                </div>
                              </dt>
                              <dd class="body">
                                <div v-if="data.is_sale && data.abroad_price">
                                  <template v-if="data.abroad_price.price > 0"><em
                                    class="color_black">{{ data.abroad_price.price | comma }} </em>원
                                  </template>
                                  <template v-else>-</template>
                                </div>
                                <div v-else>-</div>
                                <div v-if="data.is_sale && !data.display_only">
                                  <em>{{ data.price | comma }} </em>원
                                </div>
                                <div v-else>
                                  <em>-</em>
                                </div>
                              </dd>
                            </dl>
                          </div>
                          <div class="price_info_wrap" v-if="data.is_sale">
                            <div class="delivery" v-if="data.delivery_default_fee && data.delivery_default_fee > 0">
                              <em>배송비</em> <span class="color_main_01">{{ data.delivery_default_fee | comma }}</span>원
                            </div>
                            <div class="delivery" v-else><em>배송비</em> 무료</div>
                            <div class="accumulate"><em>적립금</em> <span class="color_main_01">{{ data.saving_rate }}</span>%</div>
                          </div>
                          <div class="reaction m_t_0">
                            <div class="data_star" v-if="data.total_score > 0 && (data.total_review_count + data.abroad_total_review_count) > 0">
                              <div class="only_star"></div>
                              <em>{{ (data.total_score / (data.total_review_count + data.abroad_total_review_count)) | ceil(1) }}</em>
                            </div>
                            <div class="data_star" v-else>
                              <div class="only_star disabled"></div>
                              <em>0</em>
                            </div>
                            <div class="data"><em>{{ data.total_sale_count | kUnit | comma }}</em>개 판매
                            </div>
                            <div class="data"><nuxt-link :to="`/product/${ data.id }`"><em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰</nuxt-link></div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <!-- 가격비교 상품 END -->
                </div>

                <!-- 가격비교 페이지네이션 START -->
                <div class="pagenation_wrap">
                  <Pagenation
                    :total-count="groupProductTotalCount"
                    :page-size="groupProductPageSize"
                    :default-page="defaultPage"
                    :update-query="false"
                    :onPage="onPage"
                  />
                </div>
                <!-- 가격비교 페이지네이션 END -->
              </div>
            </section>

            <section>
              <!-- 탭메뉴 START -->
              <scrollactive class="my-nav text-center" :active-class="'on'" :modify-url="false" id="review">
                <ul class="tab_detail_content">
                  <li><a href="#groupProducts" class="scrollactive-item">가격비교 상품</a></li>
                  <li class="on"><a href="#review" class="scrollactive-item">상품 구매리뷰</a></li>
                  <li><a href="#detail" class="scrollactive-item">상품상세</a></li>
                </ul>
              </scrollactive>
              <!-- 탭메뉴 END -->

              <div class="bottom_info_wrap_left">
                <!-- 상품리뷰 START -->
                <product-review :product="this.product" :comparePrice="true"/>
                <!-- 상품리뷰 END -->
              </div>
              <div class="bottom_info_wrap_right">
                <!-- 다른 상품 리뷰 START -->
                <other-product-review :group-id="productPriceGroup.id"/>
                <!-- 다른 상품 리뷰 END -->
              </div>
            </section>

            <section class="i_b w_100" v-if="product.content">
              <!-- 탭메뉴 START -->
              <scrollactive class="my-nav text-center" :active-class="'on'" :modify-url="false" id="detail">
                <ul class="tab_detail_content">
                  <li><a href="#groupProducts" class="scrollactive-item">가격비교 상품</a></li>
                  <li><a href="#review" class="scrollactive-item">상품 구매리뷰</a></li>
                  <li class="on"><a href="#detail" class="scrollactive-item">상품상세</a></li>
                </ul>
              </scrollactive>
              <!-- 탭메뉴 END -->

              <!-- 상품정보 START -->
              <div class="product_show_content">
                <div class="product_content_inside">
                  <div class="product_details">
                    <SummernoteEditor :preview="true" summernoteId="productDetail" :detailContent="product.content" :detailImageArr="product.detail_images" />
                  </div>
                  <div class="but_wrap" id="openProductDetailButton">
                    <a class="gray_line_but" @click="openProductDetail">펼치기</a>
                  </div>
                </div>
              </div>
              <!-- 상품정보 END -->
            </section>

          </div>
        </div>
      </div>
    </v-container>
    <Footer :ScrollBtn="true" ></Footer>
  </div>
</template>

<script src="@/assets/javascripts/price_group/_id/index.js"></script>
