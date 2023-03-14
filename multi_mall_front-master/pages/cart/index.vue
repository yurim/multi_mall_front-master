<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>
        <div class="list_title_wrap">
          <span>장바구니</span>
          <span class="order_step_list_wrap"><span class="color_black">장바구니</span> > 주문/결제 > 주문완료</span>
        </div>
      </div>

      <div class="m_t_10 d_ib_100">
        <div class="checkbox_wrap m_b_10">
          <input type="checkbox" id="test_cheak"
                 @click="checkAll"
                 :checked="storeGroupList.flat(Infinity).filter((v) => v.isChecked).length === storeGroupList.flat(Infinity).length">
          <label for="test_cheak">전체선택</label>
        </div>
        <div class="pull-right">
          <div class="w_auto square_but_wrap d_ib">
            <a class="gray_line_light_but" @click="deleteAllCarts">전체삭제</a>
            <a class="gray_line_light_but" @click="deleteSelectedCarts">선택삭제</a>
            <!--          2~3차에 진행 -->
            <!--          <a class="line_but">품절/판매종료상품 삭제</a>-->
          </div>
        </div>
      </div>
      <div class="col_wrap m_t_20" sticky-container>
        <div class="col_too min_h_s">
          <!-- ul 1개 = 스토어 1개-->
          <template v-if="storeGroupList.length > 0">
            <ul class="product_cart_list_wrap line_bottom" v-for="storeGroup in storeGroupList" >
            <!-- li 1개 = 제품 1개-->
            <li>
              <div class="brand_name_wrap">
                <span>Store : </span><span
                class="color_main_01 f_bold">{{ getFirstObject(storeGroup).store.name_kor }}</span>
                <a :href="`/store/${getFirstObject(storeGroup).store.id}`">브랜드 홈가기</a>
              </div>

              <div class="item_list_wrap" v-for="deliveryGroup in storeGroup">
                <div class="product_cart_list_wrap__product_wrap " v-for="productGroup in deliveryGroup">

                  <div class="checkbox_wrap">
                    <input
                      type="checkbox"
                      :id="`check_${getFirstObject(productGroup).product_id}`"
                      @click="toggleChecked(productGroup)"
                      :disabled="!getFirstObject(productGroup).product_info.is_sale
                         || !getFirstObject(productGroup).product_info.is_listed
                         || getFirstObject(productGroup).product_info.is_blocked"
                      :checked="getFirstObject(productGroup).isChecked">
                    <label :for="`check_${getFirstObject(productGroup).product_id}`"></label>
                  </div>

                  <div class="product_cart_list_wrap__right_wrap">
                    <div class="product_cart_list_wrap__right_wrap__img">
                      <img v-if="getFirstObject(productGroup).product_info.main_image"
                           :src="getFirstObject(productGroup).product_info.main_image" alt="제품이미지">
                      <img v-else alt="기본이미지" src="@/assets/img/product_default_img.png">
                    </div>
                    <div class="product_cart_list_wrap__right_wrap__title">
                      <div class="title_wrap">
                        <span v-if="!getFirstObject(productGroup).product_info.is_sale
                         || !getFirstObject(productGroup).product_info.is_listed
                         || getFirstObject(productGroup).product_info.is_blocked" class="color_r">
                          [판매중지]
                        </span>
                        <a
                          @click="moveProductDetail(getFirstObject(productGroup))">{{ getFirstObject(productGroup).product_info.name }}
                        </a>
                      </div>
                      <div class="info_price">
                        <span>판매원가</span>
                        <span class="fs_normal">{{ getFirstObject(productGroup).product_info.price | comma }}원</span>
                        <span><b class="color_main_01">-{{ (1 - (getFirstObject(productGroup).product_info.discount_price / getFirstObject(productGroup).product_info.price)) * 100 | rate }}</b>% 적용</span>
                      </div>
                    </div>
                    <div class="product_cart_list_wrap__right_wrap__icon">
                      <a @click="deleteCart(productGroup)">
                        <img alt="장바구니에서 상품 삭제" src="@/assets/img/user/icon/main_close_icon.png">
                      </a>
                    </div>
                  </div>

                  <div class="d_ib_100">
                    <ul class="product_cart_list_wrap__price_wrap">
                      <!-- 옵션 1개당 li 1개-->
                      <li v-for="cart in productGroup">
                        <div class="product_cart_list_wrap__price_wrap__title" v-if="cart.option_info">
                          <div class="order_cart_list">
                            <div class="option">선택 옵션</div>
                            <span class="order_info color_r" v-if="isOutOfStock(getFirstObject(cart))">[품절]</span>
                            <span class="order_info" :class="{ 'text-readonly' : isOutOfStock(getFirstObject(cart)) }">
                            {{ cart.option_info.option_str_list.join(' / ') }}
                          </span>
                            <a class="order_cart_list_icon" @click="deleteCart(cart)">
                              <img alt="닫기 아이콘" src="@/assets/img/user/icon/main_close_icon.png">
                            </a>
                          </div>
                        </div>
                        <div class="product_cart_list_wrap__price_wrap__title" v-else>
                        </div>
                        <div v-if="cart.option_info.additional_price === 0"><em>옵션 추가금액</em> 없음</div>
                        <div v-else><em>옵션 추가금액</em> {{ cart.option_info.additional_price | comma }}<em>원</em></div>
                        <div class="right_txt">
                          <span><em>할인적용가</em> <b class="color_main_01">{{ getProductPrice(getFirstObject(cart)) | comma }}</b>원</span>
                          <span class="price_wrap__number">
                            <em>수량</em>
                            <div class="product-count">
                              <a class="minus_but" @click="updateAmount(cart, -1)"></a>
                              <input type="text" class="count-textbox" v-model="cart.amount" readonly>
                              <a class="plus_but" @click="updateAmount(cart, 1)"></a>
                            </div>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>

                <div class="store_total_price_wrap d_ib_100">
                  <!--                  <span class="square_but_wrap">-->
                  <!--                    <a class="line_but">바로구매</a>-->
                  <!--                  </span>-->
                  <div>
                    <div class="store_total_price_wrap__delivery_fee"><em>배송비 </em>
                      <template v-if="getFirstObject(deliveryGroup).deliveryPrice > 0">
                        {{ getFirstObject(deliveryGroup).deliveryPrice | comma }}원
                        {{ getFirstObject(deliveryGroup).delivery_info.fee_pay_method === 'CSH_DLVRY' ? '(착불)' : '' }}
                      </template>
                      <template v-else>무료배송</template>
                    </div>
                    <div class="store_total_price_wrap__total_price"><em>결제 예정금액</em> <b><span
                      class="color_main_01">{{ getFirstObject(deliveryGroup).totalPrice | comma }}</span>원</b></div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          </template>
          <!-- 장바구니 비었을때 -->
          <template v-else>
            <div class="product_cart_empty">
              <div class="cart_empty_content">
                <i class="cart_icon"></i>
                <p>장바구니에 담긴 상품이 없습니다.</p>
                <div class="but_wrap">
                  <nuxt-link class="gray_line_but" to="/main">계속 쇼핑하기</nuxt-link>
                </div>
              </div>
            </div>
          </template>
        </div>
        <!--        오른쪽 스티키 부분 -->
        <div class="col_one sticky_wrap">
          <div class="sticky_shadow" v-sticky sticky-offset="{top: 80, bottom: 30}" sticky-side="both" on-stick="onStick" sticky-z-index="20">
            <ul class="order_total_list">
              <li class="title">최종 결제 금액</li>
              <li>
                <div class="cart_table_wrap">
                  <table class="none_border">
                    <tbody>
                    <tr>
                      <th>판매원가</th>
                      <td>{{ totalPriceInfo.productPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>배송비</th>
                      <td>{{ totalPriceInfo.deliveryPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>할인금액</th>
                      <td>- {{ totalPriceInfo.salePrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th colspan="font_nomal">포인트 할인</th>
                      <td>- {{ totalPriceInfo.pointSalePrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th colspan="font_nomal">쿠폰 할인</th>
                      <td>- {{ totalPriceInfo.couponSalePrice | comma }}원</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <th>총 결제 예정금액</th>
                      <td>
                        <div>
                          <b><span class="price_sale_total">{{ totalPriceInfo.totalPrice | comma }}원 </span></b>({{ totalPriceInfo.totalQuantity | comma }}개)
                        </div>
                      </td>
                    </tr>
                    </tfoot>
                  </table>
                </div>
              </li>
            </ul>
            <div class="but_wrap">
              <a class="w_100 m_b_10" @click="allCartsBuy">전체 상품 구매</a>
              <a class="w_100 gray_line_but" @click="selectedCartsBuy">선택 상품 구매</a>
              <!-- todo: css 파일로 따로 빼기 -->
              <div id="naverPayWrap" style="float: right; margin-top: 10px;"></div>
            </div>
          </div>
        </div>
      </div>

    </v-container>
    <Footer :ScrollBtn="true" ></Footer>
  </div>
</template>
<script src="@/assets/javascripts/cart/index.js"></script>
