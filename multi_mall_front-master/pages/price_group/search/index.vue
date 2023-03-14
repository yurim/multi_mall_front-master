<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>
    <!-- *** 가격비교 그룹 검색결과일때 페이지 START *** -->

      <ul class="search_image_wrap">
        <li>
          <div class="title">검색한 이미지</div>
        </li>
      </ul>
      <div class="image_search_group">
        <div class="img_wrap">
          <img :src="uploadFileUrl? uploadFileUrl : require('@/assets/img/search_default_img.png')"/>
        </div>
        <span class="file_name">{{ uploadFileName ? uploadFileName : '선택된 이미지가 없습니다' }}</span>
      </div>

      <div class="side_bar_wrap">
        <side-bar></side-bar>
      </div>

      <ul class="search_image_wrap">
        <li class="pull-left">
          <div class="title">이미지 검색 결과</div>
        </li>
        <li class="pull-right">
          <div class="search_btn">
            <span class="image_search_icon" @click="uploadImage">이미지로 검색하기</span>
          </div>
        </li>
      </ul>

      <div class="guide_text_wrap">
        <ul>
          <li>
            *몰리는 각 쇼핑몰에서 입력한 상품 정보의 중개자로서, 상품의 주문, 배송, 환불의 책임은 해당 쇼핑몰에 있습니다.
          </li>
          <li>
            <span>*구매 전 최종 상품정보는 반드시 쇼핑몰에서 확인하시기 바랍니다. 판매 가격이 몰리의 정보와 다를 경우 오류 신고를 해주세요.</span>
            <span class="pull-right">*가격비교 매장은 몰리 구매가 기준 최저가순으로 정렬하였습니다.</span>
          </li>
        </ul>
      </div>

      <div class="product_list_wrap one_list">
        <ul v-if="groupList && groupList.length > 0">
          <li v-for="(group, i) in groupList" :key="`group_${i}`">
            <div class="prod_wrap">
              <div class="left_box">
                <nuxt-link :to="`/price_group/${group['lowest_product'].id}`">
                  <div class="img_wrap">
                    <DefaultImage :imageUrl="group['lowest_product'].main_image" />
                  </div>
                </nuxt-link>
                <div class="text_wrap">
                  <div class="store_wrap">
                    <nuxt-link :to="`/store/${group['lowest_product'].store_id}`" class="lowest_price">{{ group['lowest_product'].store_name }}</nuxt-link>
                  </div>
                  <div class="title_wrap">
                    <nuxt-link :to="`/price_group/${group['lowest_product'].id}`">{{ group['lowest_product'].name }}</nuxt-link>
                  </div>
                  <div class="price_wrap line_bottom">
                    <dl>
                      <dt class="store_title">
                        <div v-if="group['lowest_product'].abroad_price">
                          <span>{{ group['lowest_product'].store_name }} 판매가</span>
                        </div>
                        <div v-if="!group['lowest_product'].display_only">
                          <span>몰리 판매가</span>
                        </div>
                      </dt>
                      <dd class="body">
                        <div v-if="group['lowest_product'].abroad_price">
                          <template v-if="group['lowest_product'].abroad_price.price > 0">
                            <b>{{ group['lowest_product'].abroad_price.price | comma }}
                              {{ group['lowest_product'].abroad_price.currency_unit }}</b> 원
                          </template>
                          <template v-else>-</template>
                        </div>
                        <div v-if="!group['lowest_product'].display_only">
                          <em>{{(group['lowest_product'].discount_price ? group['lowest_product'].discount_price : group['lowest_product'].price) | comma }}</em>원
                        </div>
                      </dd>
                    </dl>
                  </div>
                  <div class="price_info_wrap">
                    <div class="delivery"><em>배송비</em>
                      <template v-if="group['lowest_product'].default_fee > 0">
                        <span class="color_main_01">{{ group['lowest_product'].default_fee | comma }}</span>원
                      </template>
                      <template v-else>무료</template>
                    </div>
                    <div class="accumulate"><em>적립금</em> <span class="color_main_01">{{ group['lowest_product'].saving_rate }}</span>%</div>
                  </div>
                  <div class="reaction m_t_0">
                    <div class="data_star">
                      <div class="only_star" :class="group['lowest_product'].total_score > 0 ? '': 'disabled'"></div>
                      <em>{{ (group['lowest_product'].total_score / (group['lowest_product'].total_review_count + group['lowest_product'].abroad_total_review_count) || 0) | ceil(1) }}</em>
                    </div>
                    <div class="data"><em>{{ group['lowest_product'].sale_count | kUnit | comma }}</em>개 판매
                    </div>
                    <div class="data">
                      <nuxt-link :to="`/price_group/${group['lowest_product'].id}`"><em>{{ (group['lowest_product'].total_review_count + group['lowest_product'].abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰</nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
              <div class="compare_wrap">
                <div class="table_compare_wrap">
                  <table>
                    <colgroup>
                      <col>
                      <col width="140"/>
                      <col width="90"/>
                    </colgroup>
                    <thead>
                    <tr>
                      <th><div class="store_basiclist_title text-left">가격비교 매장 <span>(총 <em>{{ group.total_product | comma }}</em>개 매장)</span></div></th>
                      <th><div class="store_basiclist_title">직접 구매가 + <span class="color_gray_7">배송비</span></div></th>
                      <th><div class="store_basiclist_title">몰리 구매가</div></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(product, i) in group.group_products" :key="product.id">
                      <td>
                        <nuxt-link :to="`/product/${product.id}`" class="store_basiclist_item">
                          <span :class="{ lowest_price : i === 0 }" class="basiclist_info">{{ product.store_name }}</span>
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/product/${product.id}`" class="store_basiclist_item">
                          <template v-if="product.abroad_price && product.abroad_price.price > 0">
                            <em>{{ product.abroad_price.price | comma }}</em>원
                            <span>+&nbsp;
                            <template v-if="product.abroad_price.delivery_fee">
                              <span class="color_gray_7">{{ product.abroad_price.delivery_fee | comma }}</span>원
                            </template>
                            <template v-else>
                              <span class="color_gray_7">무료배송</span>
                            </template>
                          </span>
                          </template>
                          <template v-else><em>-</em></template>
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/product/${product.id}`" class="store_basiclist_item">
                          <div class="basiclist_price" v-if="!product.display_only">
                            <em>{{ (product.discount_price ? product.discount_price : product.price) | comma }}</em>원
                          </div>
                          <div class="basiclist_price" v-else><em>-</em></div>
                        </nuxt-link>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div class="compare_price_chart_wrap">
                  <ComparePriceChart :sizeSmall='true' :lowestProduct="group.lowest_product" :highestProduct="group.highest_product"></ComparePriceChart>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- *** 가격비교 그룹 검색결과일때 페이지 END *** -->

      <!-- Infinite Scroll Start -->
      <div>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more"></div>
          <div slot="no-results">검색된 내용이 없습니다.</div>
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
<script src="@/assets/javascripts/price_group/search/index.js"></script>
