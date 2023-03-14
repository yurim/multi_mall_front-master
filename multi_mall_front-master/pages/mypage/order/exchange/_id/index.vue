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
                    <th colspan="3">교환 사유</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th>사유</th>
                    <td>
                      <select v-model="selectedReasonObject" v-on:change="setReasonType">
                        <option value="">선택</option>
                        <option v-for="type in reasonSubTypeCodes" :key="type.value.code" :value="type.value">{{ type.value.name }}</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>내용</th>
                    <td>
                      <div class="textarea_wrap">
                        <textarea cols="30" rows="10" v-model="order_product_exchange.reason"></textarea>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
          <div class="col_too order_wrap">
            <ul>
              <li>
                <table>
                  <colgroup>
                    <col width="140">
                    <col>
                  </colgroup>
                  <thead>
                    <tr>
                      <th colspan="2">상품 회수</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>반송 방법</th>
                      <td>
                        <div class="radio_wrap">
                          <template v-for="type in collectDeliveryTypeCodes">
                            <input type="radio" name="collectDeliveryType" :key="`collectDeliveryType_${type.key}`" :id="`${type.key}_${type.value.code}`" :value="type.value.code" v-model="order_product_exchange.collect_delivery_type">
                            <label :for="`${type.key}_${type.value.code}`" :key="`collectDeliveryType_${type.value.code}`">{{ type.value.name }}</label>
                          </template>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>수령인</th>
                      <td>{{ orderProduct.store_return_exchange_info.holder_name }}</td>
                    </tr>
                    <tr>
                      <th>전화번호</th>
                      <td>{{ orderProduct.store_return_exchange_info.cs_phone }}</td>
                    </tr>
                    <tr>
                      <th>반품지 주소</th>
                      <td>[{{ orderProduct.store_return_exchange_info.zipcode }}] {{ orderProduct.store_return_exchange_info.address }} {{ orderProduct.store_return_exchange_info.detail_address }}</td>
                    </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>

          <div class="col_one cancel_warp">
            <ul v-if="selectedReasonObject.responsible_for !== 'SELLER'">
              <li class="title">교환 배송비</li>
              <li>
                <div class="cart_table_wrap">
                  <table>
                    <colgroup>
                      <col width="100">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>지불 방법</th>
                      <td>
                        <div class="radio_wrap">
                          <template v-for="type in collectFeeTypeCodes">
                            <input type="radio" name="collectFeeType" :id="`${type.key}_${type.value.code}`" :value="type.value.code" v-model="order_product_exchange.collect_fee_type" :key="`collectFeeType_${type.key}`">
                            <label :for="`${type.key}_${type.value.code}`" :key="`collectFeeType_${type.value.code}`">{{ type.value.name }}</label>
                          </template>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </li>
            </ul>

            <ul v-if="order_product_exchange.collect_fee_type === 'ATTACH'">
              <li class="title">교환 배송비 정보 <span class="font_10">(동봉)</span></li>
              <li><span class="font_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</span></li>
              <li>
                <div class="cart_table_wrap">
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tfoot>
                    <th>동봉 금액</th>
                    <td><span class="color_main_01"><b>{{ orderProduct.exchange_fee | comma }}원</b></span></td>
                    </tfoot>
                  </table>
                </div>
              </li>
            </ul>

            <ul v-if="order_product_exchange.collect_fee_type === 'VBANK'">
              <li class="title">교환 배송비 정보 <span class="font_10">(무통장입금)</span></li>
              <li><span class="font_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</span></li>
              <li>
                <div class="cart_table_wrap">
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>은행명</th>
                      <td>{{ orderProduct.store_return_exchange_info.bank_name }}</td>
                    </tr>
                    <tr>
                      <th>예금주</th>
                      <td>{{ orderProduct.store_return_exchange_info.holder_name }}</td>
                    </tr>
                    <tr>
                      <th>계좌번호</th>
                      <td>{{ orderProduct.store_return_exchange_info.account }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <th>입금 금액</th>
                    <td><span class="color_main_01"><b>{{ orderProduct.exchange_fee | comma }}원</b></span></td>
                    </tfoot>
                  </table>
                </div>
              </li>
            </ul>

            <ul v-if="order_product_exchange.collect_fee_type === 'SELLER_DECIDES'">
              <li class="title">교환 배송비 정보 <span class="font_10">(판매자와 상담 후 결정)</span></li>
              <li><span class="font_10">아래 표시되는 금액은 참고용이며, 책임여부와 판매자 사정으로 인해 금액이 변동될 수 있습니다.</span></li>
              <li>
                <div class="cart_table_wrap">
                  <table>
                    <colgroup>
                      <col width="140">
                      <col>
                    </colgroup>
                    <tfoot>
                    <th>예상 배송비</th>
                    <td>
                      <span class="color_main_01">
                        <b v-if="selectedReasonObject.responsible_for !== 'SELLER'">{{ orderProduct.exchange_fee | comma }}원</b>
                        <b v-else>0 원</b>
                      </span>
                    </td>
                    </tfoot>
                  </table>
                </div>
              </li>
            </ul>

          </div>
        </div>

        <div class="but_wrap text-center">
          <a class="line_but" v-on:click="cancelExchange">취소</a>
          <a v-on:click="requestExchange">교환 요청</a>
        </div>
      </div>
    </v-container>
    <Footer></Footer>
  </div>
</template>
<script src="@/assets/javascripts/mypage/order/exchange/_id/index.js"></script>
