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

        <div class="mypage_wrap">
          <div class="main_color_title">교환/취소 조회</div>

          <div class="d_ib_100 pull-left">
            <!-- todo: 2차 개발 -->
<!--            <div class="select_date_wrap">-->
<!--              <search-date-picker ref="searchDatePicker" dateFormat="YYYY-MM-DDzz"></search-date-picker>-->
<!--              <a v-on:click="orderListInquiry">조회</a>-->
<!--            </div>-->
            <div class="square_but_wrap pull-right m_t_10 p_r_10">
              <a class="gray_but" v-on:click="popTerms('exchng' ,'교환신청')">교환신청 안내</a>
              <a class="gray_but" v-on:click="popTerms('rtrn', '환불신청')">환불신청 안내</a>
            </div>
          </div>

          <div class="col_wrap m_t_20">
            <div class="col_three order_wrap">
              <!-- ul 1개 = 스토어 1개-->
              <ul class="product_order_list_wrap" v-for="(order, orderTableIdx) in orderTable" :key="`order_${orderTableIdx}`">
                <!-- li 1개 = 주문 1개-->
                <li v-if="order.stores.length > 0">
                  <table>
                    <colgroup>
                      <col />
                      <col width="95" />
                      <col width="95" />
                      <col width="95" />
                      <col width="95" />
                      <col width="120" />
                      <col/>
                    </colgroup>
                    <thead>
                    <tr>
                      <td colspan="6">
                        <span class="m_r_10"><b>일시:</b> {{ $moment(order.ordered_at).format('YYYY년MM월DD일 HH시mm분') }}</span>
                        <b>주문번호:</b> {{ order.order_num }}
                        <div class="square_but_wrap pull-right">
                          <nuxt-link :to="`/mypage/order/${order.id}`">주문상세보기</nuxt-link>
                        </div>
                      </td>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="(store, storesIdx) in order.stores">
                      <tr :key="`store_${storesIdx}`">
                        <td colspan="4">
                          <span>Store : </span><nuxt-link class="color_main_01 f_bold" :to="`/store/${store.store_id}`">{{ store.store_name_kor }}</nuxt-link>
                        </td>
                        <td class="text-center" v-if="storesIdx === 0"><b>배송비</b></td>
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
                                <div><b>상품가격 : </b>{{ product.product_price | comma }}원({{ product.amount }}개)</div>
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
                                v-if="product.order_status === 'DLVRNG'
                                        || product.order_status === 'DLVRY_CMPLT'
                                        || (product.order_status === 'EXCHNG' && product.order_sub_status === 'EXCHNG_RDLVRY')"
                                v-on:click="popupDeliveryInquiry(product, store)"
                              >
                                배송조회
                              </a>
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
                            ({{ group.fee_pay_method_str }})
                            <div v-if="group.order_products.length > 1">(묶음)</div>
                          </td>
                          <td class="text-center" :rowspan="order.order_products_length" v-if="storesIdx === 0 && deliveryGroupsIdx === 0 && prdIdx === 0">
                            <span><b class="color_main_01"></b>{{ order.claim_paid_price | comma}}원</span>
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
        </div>
        <div class="pagenation_wrap">
          <Pagenation
            :total-count="totalCount"
            :page-size="pageSize"
            :default-page="1"
            :page-key-name="'page'"
            :page-size-key-name="'page_size'"
            :onPage="onPage"
          />
        </div>
      </div>
    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/exchange/index.js"></script>
