<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>
        <div class="list_title_wrap"><span>마이페이지</span></div>

        <MypageCondition></MypageCondition>
        <div class="m_b_40 d_ib_100">
          <TopTabNav></TopTabNav>
        </div>

        <div class="col_wrap">
          <div class="col_three order_wrap">
            <ul class="product_order_list_wrap">
              <li>
                <table>
                  <colgroup>
                    <col />
                    <col width="95" />
                    <col width="95" />
                    <col width="105" />
                    <col width="95" />
                    <col width="120" />
                    <col/>
                  </colgroup>
                  <thead>
                    <tr>
                      <td colspan="6">
                        <span class="m_r_10"><b>일시:</b> {{ $moment(order.ordered_at).format('YYYY년MM월DD일 HH시mm분') }}</span>
                        <b>주문번호:</b> {{ order.order_num }}
                        <div class="square_but_wrap pull-right" v-if="order.receipt_url">
                          <a :href="order.receipt_url" target="_blank">영수증 출력</a>
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(store, storesIdx) in order.stores">
                      <tr :key="`store_${storesIdx}`">
                        <td colspan="5">
                          <span>Store : </span><nuxt-link class="color_main_01 f_bold" :to="`/store/${store.store_id}`">{{ store.store_name_kor }}</nuxt-link>
                        </td>
                        <td class="text-center" v-if="storesIdx === 0"><b>총 결제금액</b></td>
                      </tr>
                      <template v-for="(group, deliveryGroupsIdx) in store.delivery_groups">
                        <tr v-for="(product, prdIdx) in group.order_products" :key="`groupProducts_${product.id}`">
                          <td>
                            <div class="order_product_wrap">
                              <div class="order_product_wrap__img_wrap">
                                <DefaultImage :imageUrl="product.product_image"/>
                              </div>
                              <div class="order_product_wrap__info_wrap">
                                <div class="order_product_wrap__info_wrap__title">
                                  <nuxt-link :to="`/product/${product.product_id}`">{{ product.product_name }}</nuxt-link>
                                </div>
                                <div v-if="product.product_option_names">
                                  <template v-for="(optionName, optionIdx) in product.product_option_names.split('/')">
                                    <template v-if="optionName.split(':').length >= 2">
                                      <b :key="`option_${optionName}`">{{ optionName.split(':')[0] }} :</b> {{ optionName.split(':')[1] }}
                                    </template>
                                    <b :key="`divided_${optionIdx}`" v-if="optionIdx < product.product_option_names.split('/').length - 1">/ </b>
                                  </template>
                                  <span v-if="product.option_price && product.option_price > 0">(+{{ product.option_price | comma }}원)</span>
                                </div>
                                <div><b>상품가격 : </b>{{ product.product_price | comma }}({{ product.amount }}개)</div>
                                <!-- *** 교환/환불 요청일 START *** -->
                                <div v-if="product.order_status === 'EXCHNG' && product.exchange_requested_at">
                                  <b>교환 요청일 : </b>{{ $moment(product.exchange_requested_at).format('YYYY년MM월DD일 HH시mm분') }}
                                </div>
                                <div v-if="product.order_status === 'RTRN' && product.return_requested_at">
                                  <b>반품 요청일 : </b>{{ $moment(product.return_requested_at).format('YYYY년MM월DD일 HH시mm분') }}
                                </div>
                                <!-- *** 교환/환불 요청일 END *** -->
                              </div>
                            </div>
                          </td>
                          <td class="text-center">
                            <div><b>할인금액</b></div>
                            <span>{{ product.product_discount_price || product.product_discount_price > 0 ? (product.product_price - product.product_discount_price) * product.amount : 0 | comma }}원</span>
                          </td>
                          <td class="text-center">
                            <div class="color_main_01">
                              <b>{{ product.order_status_str }}</b>
                            </div>
                            <span class="font_12"
                              v-if="product.order_sub_status
                             && ['CNCL', 'EXCHNG', 'RTRN'].indexOf(product.order_status) >= 0 || product.order_sub_status === 'DLY_DLVRY'">[{{ product.order_sub_status_str }}]</span>

                            <div v-if="product.claim_rejected">
                              <span v-if="product.last_claim_status.reason_type === 'RJCT_CNCL'" class="font_12">[취소거부]</span>
                              <span v-if="product.last_claim_status.reason_type === 'RJCT_EXCHNG'" class="font_12">[교환거부]</span>
                              <span v-if="product.last_claim_status.reason_type === 'RJCT_RTRN'" class="font_12">[반품거부]</span>
                            </div>
                            <div class="square_but_wrap coupon_wrap m_t_10">
                              <a class="line_but"
                                 v-if="['RQST_CNCL', 'RQST_EXCHNG', 'RQST_RTRN', 'DLY_DLVRY'].indexOf(product.order_sub_status) >= 0"
                                 v-on:click="showReason(product.id)">사유보기</a>
                              <a class="line_but" v-if="['CNCL','EXCHNG', 'RTRN'].indexOf(product.order_status) >= 0 || product.claim_rejected"
                                 v-on:click="showDetail(product)">상세보기</a>
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="square_but_wrap coupon_wrap font_12">
                              <a
                                class="line_but"
                                v-if="product.order_status === 'DLVRNG' ||
                                      product.order_status === 'DLVRY_CMPLT' ||
                                      (product.order_status === 'EXCHNG' && product.order_sub_status === 'EXCHNG_RDLVRY')"
                                v-on:click="popupDeliveryInquiry(product, store)"
                              >
                                배송조회
                              </a>
                              <nuxt-link
                                class="line_but"
                                v-if="product.order_status === 'NOT_PAID' || product.order_status === 'DLVRY_WAIT'"
                                :to="`/mypage/order/cancel/${product.id}`"
                              >
                                주문취소
                              </nuxt-link>
                              <nuxt-link
                                class="line_but"
                                v-if="product.order_status === 'DLVRNG'
                                      || product.order_status === 'DLVRY_CMPLT'
                                      || (product.order_status === 'EXCHNG' && product.order_sub_status === 'EXCHNG_RDLVRY')"
                                :to="`/mypage/order/exchange/${product.id}`"
                              >
                                교환신청
                              </nuxt-link>
                              <nuxt-link
                                class="line_but"
                                v-if="product.order_status === 'DLVRNG'
                                      || product.order_status === 'DLVRY_CMPLT'
                                      || (product.order_status === 'EXCHNG' && product.order_sub_status === 'EXCHNG_RDLVRY')"
                                :to="`/mypage/order/return/${product.id}`"
                              >
                                반품신청
                              </nuxt-link>
                              <a
                                class="line_but"
                                v-if="product.order_status === 'DLVRY_CMPLT'"
                                v-on:click="completePurchase(product)"
                              >
                                구매확정
                              </a>
                              <a
                                class="line_but"
                                v-if="product.order_status === 'DCD_PRCHS' && !product.is_review_written"
                                v-on:click="popupReviewWrite(product)"
                              >
                                리뷰쓰기
                              </a>
                              <span
                                class="disabled disabled_line_but"
                                v-if="product.order_status === 'DCD_PRCHS' && product.is_review_written"
                              > 리뷰작성완료</span>
                              <a
                                class="line_but"
                                v-if="(product.order_status === 'EXCHNG' && product.order_sub_status === 'RQST_EXCHNG')
                                      || (product.order_status === 'RTRN' && product.order_sub_status === 'RQST_RTRN')
                                      || (product.order_status === 'CNCL' && product.order_sub_status === 'RQST_CNCL')"
                                v-on:click="cancelRequestCancel(product.order_status, product.order_sub_status, product.id)"
                              >
                                요청취소
                              </a>
                              <a
                                class="line_but"
                                v-on:click="popupInquiryProduct(product, store)"
                              >
                                상품문의
                              </a>
                            </div>
                          </td>
                          <td class="text-center" :rowspan="prdIdx === 0 ? group.order_products.length : 1" v-if="prdIdx === 0">
                            {{ group.delivery_fee | comma }}원<br />
                            ({{ group.fee_pay_method }})
                            <div v-if="group.order_products.length > 1">(묶음)</div>
                          </td>
                          <td class="text-center" :rowspan="order.paidPriceRowspan" v-if="storesIdx === 0 && deliveryGroupsIdx === 0 && prdIdx === 0">
                            <span><b class="color_main_01">{{ order.paid_price | comma }}</b>원</span>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
        </div>

        <div class="col_wrap m_t_20" v-if="order.order_delivery">
          <div class="col_three order_wrap">
            <ul>
              <li>
                <table>
                  <colgroup>
                    <col width="140">
                    <col>
                  </colgroup>
                  <thead>
                  <tr>
                    <th colspan="3">배송지 정보</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th>받는사람</th>
                    <td>{{ order.order_delivery.name }}</td>
                  </tr>
                  <tr>
                    <th>전화번호</th>
                    <td>{{ order.order_delivery.phone }}</td>
                  </tr>
                  <tr>
                    <th>전화번호2</th>
                    <td><span v-if="order.order_delivery.phone2">{{ order.order_delivery.phone2 }}</span></td>
                  </tr>
                  <tr>
                    <th>배송지 주소</th>
                    <td>[{{ order.order_delivery.zipcode }}] {{ order.order_delivery.address }} {{ order.order_delivery.detail_address }}</td>
                  </tr>
                  <tr>
                    <th>배송 메모</th>
                    <td><span v-if="order.delivery_message">{{ order.delivery_message }}</span></td>
                  </tr>
                  <tr v-if="order.clearance_num">
                    <th>개인통관고유부호</th>
                    <td>{{ order.clearance_num }}</td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>

          <div class="col_too order_wrap">
            <!--            각각 결제방법에따라 출력되는 정보가 다름 -->
            <ul>
              <li>
                <table>
                  <colgroup>
                    <col width="140">
                    <col>
                  </colgroup>
                  <thead>
                    <tr>
                      <th colspan="3">결제 방법</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{{ order.payment_method_str }}</th>
                      <td v-if="order.payment_method === 'VBANK'">
                        {{ order.virtual_account_bank }}<br>
                        {{ order.virtual_account_name}}({{order.virtual_account_num}})<br>
                        <span v-if="!order.paid_at && order.expired_at">({{ $moment(order.expired_at).format('YYYY년MM월DD일 HH시mm분') }} 까지)</span>
                        <span v-else-if="order.paid_at">결제완료 ({{ $moment(order.paid_at).format('YYYY년MM월DD일 HH시mm분') }})</span>
                      </td>
                      <td v-else>
                        결제완료 ({{ $moment(order.paid_at).format('YYYY년MM월DD일 HH시mm분') }})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
          <div class="col_one">
            <ul>
              <li class="title">결제 정보</li>
              <li>
                <div class="cart_table_wrap">
                  <table class="none_border">
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>총 상품 금액</th>
                      <td>{{ totalProductPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>배송비</th>
                      <td>{{ order.total_delivery_fee | comma }}원</td>
                    </tr>
                    <tr>
                      <th>할인금액</th>
                      <td>- {{ totalProductDiscount | comma }}원</td>
                    </tr>
                    <tr>
                      <th colspan="font_nomal">포인트 할인</th>
                      <td>- {{ point | comma }}원</td>
                    </tr>
                    <tr>
                      <th colspan="font_nomal">쿠폰 할인</th>
                      <td>- {{ coupon | comma }}원</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <th>총 결제 금액</th>
                    <td><span class="color_main_01"><b>{{ order.paid_price | comma }}원</b></span></td>
                    </tfoot>
                  </table>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="but_wrap text-center">
          <a @click="$router.go(-1)">뒤로가기</a>
        </div>

      </div>
    </v-container>
    <Footer :ScrollBtn="true" ></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/order/_id/index.js"></script>
