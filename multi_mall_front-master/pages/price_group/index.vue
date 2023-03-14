<template>
  <div class="userWrap">
    <Header></Header>
    <v-container class="sticky-container" sticky-container>

      <side-bar></side-bar>

      <div class="top_sub_menu_wrap">
        <div class="top_sub_menu_wrap_item" v-if="temp && temp.q">
          <b>'<span class="color_main_01">{{ temp.q }}</span>'의 검색결과
            <template v-if="totalCount !== null">: 총 '<span class="color_main_01">{{ totalCount | comma }}</span>' 건의 상품이 검색 되었습니다.</template></b>
        </div>

        <div class="top_sub_menu_wrap_item top_category_wrap p_b_0">
          <div class="title">현재 카테고리</div>
          <ul class="category_tree_wrap">
            <template v-if="categoryTree.length >= 1">
              <li>
                <nuxt-link to="/price_group">전체보기</nuxt-link>
              </li>
              <li v-for="(category, i) in categoryTree" :key="i" >
                <a v-on:click="clickCategory(category)">{{ category.name }}</a>
              </li>
            </template>
            <template v-else>
              <li class="font_16 color_main_01 f_bold p_b_10">전체 카테고리</li>
            </template>
          </ul>
        </div>

        <div class="top_sub_menu_wrap_item top_category_wrap" v-if="childCategories.length > 0">
          <ul class="category_list">
            <li v-for="category in childCategories" :key="category.id">
              <a v-on:click="clickCategory(category)">{{ category.name }}</a>
            </li>
          </ul>
        </div>

        <div class="top_sub_menu_wrap_item">
          <div class="title">가격대</div>
          <div class="radio_wrap">
            <template v-for="type in search_filter_price">
              <input type="radio" name="filterPrice" :id="type.value" :value="type.value" :checked="type.isChecked"
                     v-on:change="onSearchFilter">
              <label :for="type.value">{{ type.text }}</label>
            </template>
          </div>
        </div>

      </div>

      <div>
        <ul class="top_range_wrap second m_t_5">
          <li v-for="(type, i) in search_filter_type" :key="i">
            <a v-on:click="onSearchFilterType(i)" :class="type.isChecked ? 'color_main_01' : ''">{{ type.text }}</a>
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
          <ul>
            <li v-for="(product, i) in product_list" :key="i">
              <div class="prod_wrap">
                <div class="left_box">
                  <nuxt-link :to="product.product_price_group ? `/price_group/${product.id}` : `/product/${product.id}`">
                    <div class="img_wrap">
                      <DefaultImage :imageUrl="product.main_image" />
                    </div>
                  </nuxt-link>
                  <div class="text_wrap">
                    <div class="store_wrap">
                      <nuxt-link :to="`/store/${product.store_id}`"
                                 :class="{'lowest_price': product.product_price_group && product.product_price_group.lowest_product_id === product.id}">
                        {{ product.store_name }}
                      </nuxt-link>
                    </div>
                    <div class="title_wrap">
                      <nuxt-link :to="product.product_price_group ? `/price_group/${product.id}` : `/product/${product.id}`">
                        {{ product.name }}
                      </nuxt-link>
                    </div>
                    <div class="price_wrap line_bottom">
                      <dl>
                        <dt class="store_title">
                          <div v-if="product.abroad_price">
                            <span class="m_r_0">{{ product.store_name }} 판매가</span>
                          </div>
                          <div v-if="!product.display_only">
                            <span>몰리 판매가</span>
                          </div>
                        </dt>
                        <dd class="body">
                          <div class="" v-if="product.abroad_price">
                            <template v-if="product.abroad_price.price > 0"><em class="color_black">{{ product.abroad_price.price | comma }} </em>원</template>
                            <template v-else>-</template>
                          </div>
                          <div class="" v-if="!product.display_only">
                            <em>{{ (product.discount_price? product.discount_price : product.price) | comma }} </em>원
                          </div>
                        </dd>
                      </dl>
                    </div>
                    <div class="price_info_wrap">
                      <div class="delivery"><em>배송비</em>
                        <template v-if="product.default_fee > 0">
                          <span class="color_main_01">{{ product.default_fee | comma }}</span>원
                        </template>
                        <template v-else>무료</template>
                      </div>
                      <div class="accumulate"><em>적립금</em> <span class="color_main_01">{{ product.saving_rate }}</span>%</div>
                    </div>
                    <div class="reaction m_t_0">
                      <div class="data_star">
                        <div class="only_star" :class="product.total_score > 0 ? '': 'disabled'"></div>
                        <em>{{ (product.total_score / (product.total_review_count + product.abroad_total_review_count) || 0) | ceil(1) }}</em>
                      </div>
                      <div class="data"><em>{{ product.sale_count | kUnit | comma }}</em>개 판매</div>
                      <div class="data">
                        <nuxt-link :to="product.product_price_group ? `/price_group/${product.id}` : `/product/${product.id}`">
                          <em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰
                        </nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="compare_wrap">
                  <div class="table_compare_wrap">
                    <table>
                      <colgroup>
                        <col/>
                        <col width="140"/>
                        <col width="90"/>
                      </colgroup>
                      <thead>
                      <tr>
                        <th><div class="store_basiclist_title text-left">가격비교 매장 <span v-if="product.product_price_group">(총 <em>{{ product.product_price_group.total_product_count | comma }}</em>개 매장)</span></div></th>
                        <th><div class="store_basiclist_title"><span class="m_l_0">직접 구매가 + </span>배송비</div></th>
                        <th><span>몰리 구매가</span></th>
                      </tr>
                      </thead>
                      <tbody>
                      <!-- *** 가격비교그룹이 존재하는 경우 *** -->
                      <template v-if="product.product_price_group">
                        <tr v-for="(item, i) in product.product_price_group.group_products" :key="i">
                          <td>
                            <nuxt-link :to="`/product/${item.id}`" class="store_basiclist_item">
                              <span :class="{ lowest_price : i === 0 }" class="basiclist_info">{{ item.store_name }}</span>
                            </nuxt-link>
                          </td>
                          <td>
                            <nuxt-link :to="`/product/${item.id}`" class="store_basiclist_item">
                              <template v-if="item.abroad_price && item.abroad_price.price > 0">
                                <em :class="[i === 0  ? 'color_main_01' : 'color_black']">{{ item.abroad_price.price | comma }} </em>원
                                <span>+
                              <template v-if="item.abroad_price.delivery_fee">
                                <span>{{ item.abroad_price.delivery_fee | comma }} </span>원
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
                            <nuxt-link :to="`/product/${item.id}`" class="store_basiclist_item">
                              <div class="basiclist_price" v-if="!item.display_only">
                                <em :class="[i === 0 ? 'color_main_01' : 'color_black']">{{ (item.discount_price ? item.discount_price : item.price) | comma }} </em>원
                              </div>
                              <div class="basiclist_price" v-else>
                                <em>-</em>
                              </div>
                            </nuxt-link>
                          </td>
                        </tr>
                      </template>

                      <!-- *** 가격비교그룹이 존재하지 않는 경우 *** -->
                      <tr v-else>
                        <td>
                          <nuxt-link :to="`/product/${product.id}`" class="store_basiclist_item">
                            <span class="basiclist_info">{{ product.store_name }}</span>
                          </nuxt-link>
                        </td>
                        <td>
                          <nuxt-link :to="`/product/${product.id}`" class="store_basiclist_item">
                            <template v-if="product.abroad_price && product.abroad_price.price > 0">
                              <em class="color_black">{{ product.abroad_price.price | comma }} </em>원
                              <span>+
                              <template v-if="product.abroad_price.delivery_fee">
                                <span>{{ product.abroad_price.delivery_fee | comma }} </span>원
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
                              <em class="color_black">{{ (product.discount_price ? product.discount_price : product.price) | comma }} </em>원
                            </div>
                            <div class="basiclist_price" v-else>
                              <em>-</em>
                            </div>
                          </nuxt-link>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="compare_price_chart_wrap">
                    <ComparePriceChart v-if="product.product_price_group" :sizeSmall='true'
                                       :lowestProduct="product.product_price_group.group_products[0]"
                                       :highestProduct="product.product_price_group.highest_product"></ComparePriceChart>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Infinite Scroll Start -->
      <div>
        <infinite-loading @infinite="infiniteHandler" spinner="spiral">
          <div slot="no-more"></div>
          <div slot="no-results">제품이 존재하지 않습니다.</div>
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

<script src="@/assets/javascripts/price_group/index.js"></script>
