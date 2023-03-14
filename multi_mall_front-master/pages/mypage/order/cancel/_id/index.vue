<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>
      <TopTabNav></TopTabNav>
      <div>

        <div class="col_wrap m_t_40">
          <div class="col_three order_wrap">
            <ul class="product_order_list_wrap">
              <li>
                <table>
                  <colgroup>
                    <col />
                    <col width="95" />
                    <col width="95" />
                  </colgroup>
                  <thead>
                    <tr>
                      <td colspan="3">
                        <b>일시:</b> {{ $moment(orderProduct.ordered_at).format('YYYY년MM월DD일 HH시mm분') }} <b>주문번호:</b> {{ orderProduct.order_num }}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="order_product_wrap">
                          <div class="order_product_wrap__img_wrap">
                            <DefaultImage :imageUrl="orderProduct.product_image"/>
                          </div>
                          <div class="order_product_wrap__info_wrap">
                            <div class="order_product_wrap__info_wrap__brand">
                              <nuxt-link class="color_main_01 f_bold" :to="`/store/${orderProduct.store_id}`">{{ orderProduct.store_name_kor }}</nuxt-link>
                            </div>
                            <div class="order_product_wrap__info_wrap__title">
                              <nuxt-link :to="`/product/${orderProduct.product_id}`">{{ orderProduct.product_name }}</nuxt-link>
                            </div>
                            <div v-if="orderProduct.product_option_names">
                              <template v-for="(optionName, optionIdx) in orderProduct.product_option_names.split('/')">
                                <template v-if="optionName.split(':').length >= 2">
                                  <b :key="`option_${optionName}`">{{ optionName.split(':')[0] }} :</b> {{ optionName.split(':')[1] }}
                                </template>
                                <b :key="`divided_${optionIdx}`" v-if="optionIdx < orderProduct.product_option_names.split('/').length - 1">/ </b>
                              </template>
                              <span v-if="orderProduct.option_price && orderProduct.option_price > 0">(+{{ orderProduct.option_price | comma }}원)</span>
                            </div>
                            <div><b>상품가격 : </b>{{ orderProduct.product_price | comma }}원({{ orderProduct.amount }}개)</div>
                          </div>
                        </div>
                      </td>
                      <td class="text-center">
                        <div><b>할인금액</b></div>
                        <span>{{ orderProduct.product_discount_price || orderProduct.product_discount_price > 0 ? (orderProduct.product_price - orderProduct.product_discount_price) * orderProduct.amount : 0 | comma }}원</span>
                      </td>
                      <td class="text-center">
                        <div class="color_main_01">
                          <b>{{ orderProduct.order_status_str }}</b>
                        </div>
                      </td>
                      <td class="text-center">
                        {{ orderProduct.delivery_fee | comma }}원<br />
                        ({{ orderProduct.fee_pay_method_str }})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
        </div>

        <div class="col_wrap m_t_20">
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
                    <th colspan="3">취소 사유</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th>사유</th>
                    <td>
                      <select v-model="order_product_cancel.reason_sub_type">
                        <option value="">선택</option>
                        <option v-for="type in reasonSubTypeCodes" :key="type.value.code" :value="type.value.code">{{ type.value.name }}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>내용</th>
                    <td>
                      <div class="textarea_wrap">
                        <textarea cols="30" rows="10" v-model="order_product_cancel.reason"></textarea>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
            <div class="but_wrap" v-if="orderProduct.order_status !== 'NOT_PAID'">
              <a class="line_but" v-on:click="popTerms('rtrn', '환불 약관 고지')">환불 약관 고지</a>
            </div>
          </div>

          <div class="col_three" v-if="orderProduct.order_status !== 'NOT_PAID'">
            <ul>
              <li class="title">환불 정보</li>
              <li>
                <div class="cart_table_wrap">
                  <table class="none_border">
                    <colgroup>
                      <col>
                      <col>
                    </colgroup>
                    <tbody>
                      <tr>
                        <th>상품 취소 금액</th>
                        <td>{{ cancelProductPrice | comma }}원</td>
                      </tr>
                      <tr>
                        <th>선불 배송비</th>
                        <td>{{ cancelDeliveryPrice | comma }}원</td>
                      </tr>
                      <tr>
                        <th>결제정보</th>
                        <td>{{ orderProduct.payment_method_str }}<br>
                          <span class="font_12">({{ orderProduct.paid_at | date }})</span>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <th>총 환불(예정) 금액</th>
                      <td><span class="color_main_01"><b>{{ cancelProductPrice + cancelDeliveryPrice | comma }}원</b></span></td>
                    </tfoot>
                  </table>
                </div>
              </li>
            </ul>
          </div>

          <div class="but_wrap text-center">
            <a class="line_but" v-on:click="cancelRequestCancel">취소</a>
            <a v-on:click="requestCancel">취소 요청</a>
          </div>
        </div>
      </div>
    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/order/cancel/_id/index.js"></script>
