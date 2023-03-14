<template>
  <client-only>
  <div class="adminWrap">
    <div class="body_wrap">
      <StoreAdminHeader></StoreAdminHeader>
      <StoreAdminSideNav></StoreAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_three">

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="4">주문정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>주문번호</th>
                  <td>{{orderProduct.orderNum}}</td>
                  <th>주문자 아이디</th>
                  <td>{{orderProduct.email}}</td>
                </tr>
                <tr>
                  <th>주문일</th>
                  <td>{{orderProduct.orderedAt | date}}</td>
                  <th>결제일</th>
                  <td>{{orderProduct.paidAt | date}}</td>
                </tr>
                <tr>
                  <th>주문자명</th>
                  <td>{{orderProduct.name}}</td>
                  <th>주문자 연락처</th>
                  <td>{{orderProduct.phone}}</td>
                </tr>
                <tr>
                  <th>총 상품금액</th>
                  <td>{{orderProduct.totalPrice | comma}}원</td>
                  <th>총 배송비</th>
                  <td>{{orderProduct.deliveryFee | comma}}원</td>
                </tr>
                <tr>
                  <th>총 포인트사용 금액</th>
                  <td>{{orderProduct.totalPoint | comma}}원</td>
                  <th>총 판매금액</th>
                  <td>{{orderProduct.totalSalesPrice | comma}}원</td>
                </tr>
                <tr>
                  <th>최종 결제금액</th>
                  <td colspan="3">
                    {{orderProduct.paidPrice | comma}}원
                    <span v-if="!orderProduct.paidAt" class="color_r">(미결제)</span>
                  </td>
                </tr>
                </tbody>
              </table>

              <ul>
                <li class="page_title">같이 주문한 상품 정보</li>
                <li>
                  <table class="show_table">
                    <colgroup>
                    </colgroup>
                    <thead>
                    <tr>
                      <th>상품주문번호</th>
                      <th>주문상태</th>
                      <th>총 상품주문금액(옵션추가금액 포함)</th>
                      <th>상품 정산예정금액</th>
                      <th>배송비</th>
                      <th>배송비 정산예정금액</th>
                    </tr>
                    </thead>
                    <tbody>
                    <client-only>
                      <tr v-for="orderProduct in orderProduct.orderProducts">
                        <td>
                          <nuxt-link :to="`/store_admin/sales/${orderProduct.order_product_num}`" class="text">{{orderProduct.order_product_num}}</nuxt-link>
                        </td>
                        <td>{{orderProduct.order_status}}</td>
                        <td>{{orderProduct.product_total_price | comma}}</td>
                        <td>{{orderProduct.expected_balance_account | comma}}</td>
                        <template v-if="orderProduct.rowspan !== 0">
                          <td :rowspan="orderProduct.rowspan">{{orderProduct.delivery_fee | comma}}</td>
                          <td :rowspan="orderProduct.rowspan">{{orderProduct.expected_balance_account_delivery_fee | comma}}</td>
                        </template>
                      </tr>
                    </client-only>
                    </tbody>
                  </table>
                </li>
              </ul>

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="4">상품 주문정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>상품 주문번호</th>
                  <td>{{orderProduct.productOrderNum}}</td>
                  <th>주문상태<br>(세부주문상태)</th>
                  <td>
                    <span class="color_main_01">{{orderProduct.orderStatusStr}}</span>
                    <template v-if="orderProduct.orderSubStatusStr">({{orderProduct.orderSubStatusStr}})</template>
                  </td>
                </tr>
                <tr>
                  <th>해외상품 URL</th>
                  <td><a v-if="orderProduct.productDetailUrl && orderProduct.productDetailUrl !== '-'" :href="orderProduct.productDetailUrl" target="_blank">{{orderProduct.productDetailUrl}}<br>[새창으로 열기]</a></td>
                  <th>멀티몰 상품 URL</th>
                  <td>
                    <client-only>
                      <a v-if="productUrl" :href="productUrl" target="_blank">{{productUrl}}<br>[새창으로 열기]</a>
                    </client-only>
                  </td>
                </tr>
                <tr>
                  <th>구분</th>
                  <td v-if="orderProduct.isAbroad">해외상품</td>
                  <td v-else>국내상품</td>
                  <th>해외 주문번호 입력</th>
                  <td>{{orderProduct.abroadOrderNum}}</td>
                </tr>
                <tr>
                  <th>상품명</th>
                  <td colspan="3">{{orderProduct.productName}}</td>
                </tr>
                <tr>
                  <th>수량</th>
                  <td>{{orderProduct.amount | comma}}개</td>
                  <th>옵션</th>
                  <td>{{orderProduct.productOptionNames}}</td>
                </tr>
                <tr>
                  <th>상품금액</th>
                  <td>{{orderProduct.productPrice | comma}}원</td>
                  <th>옵션 추가금액</th>
                  <td>{{orderProduct.optionPrice | comma}}원</td>
                </tr>
                <tr v-if="orderProduct.discountPrice > 0">
                  <th>할인판매가격</th>
                  <td colspan="3">{{ ( orderProduct.productPrice - orderProduct.discountPrice ) | comma}}원</td>
                </tr>
                <tr>
                  <th>총 상품 주문금액</th>
                  <td colspan="3">
                    {{orderProduct.productTotalPrice | comma}}원
                    <template v-if="orderProduct.optionPrice > 0">
                      (옵션추가금액: {{orderProduct.optionPrice | comma}}원 포함)
                    </template>
                  </td>
                </tr>
                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="4">배송비 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>배송방법</th>
                  <td>{{orderProduct.deliveryMethod}}</td>
                  <th>배송비 지불방법</th>
                  <td>{{orderProduct.feePayMethod}}</td>
                </tr>
                <tr>
                  <th>배송비 부과방법</th>
                  <td v-if="orderProduct.deliveryFeeType==='조건부 무료'">{{orderProduct.conditionValue}}원 이상 무료</td>
                  <td v-else-if="orderProduct.deliveryFeeType==='수량별'">{{orderProduct.conditionValue}}개마다 기본 배송비 반복 부과</td>
                  <td v-else-if="orderProduct.deliveryFeeType==='구간별'">{{orderProduct.conditionValue}}개까지 추가 배송비 없음</td>
                  <td v-else>{{orderProduct.deliveryFeeType}}</td>
                  <th>배송비 유형</th>
                  <td>{{orderProduct.deliveryFeeType}}</td>
                </tr>
                <tr>
                  <th>배송금액</th>
                  <td colspan="3">{{orderProduct.productDeliveryFee | comma}}원</td>
                </tr>
                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="4">상품별 총 주문금액</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>상품별 총 주문금액</th>
                  <td>{{orderProduct.productTotalPrice + orderProduct.productDeliveryFee | comma}}원</td>
                </tr>
                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="4">결제정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>결제수단</th>
                  <td>{{orderProduct.paymentMethod}}</td>
                </tr>
                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="4">배송지 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>수취인명</th>
                  <td>{{orderProduct.deliveryName}}</td>
                  <th>수취인 연락처</th>
                  <td>{{orderProduct.deliveryPhone}}</td>
                </tr>
                <tr>
                  <th>우편번호</th>
                  <td>{{orderProduct.deliveryZipcode}}</td>
                  <th>개인통관부호</th>
                  <td>{{orderProduct.clearanceNum}}</td>
                </tr>
                <tr>
                  <th>배송지</th>
                  <td colspan="3">{{orderProduct.deliveryAddress}} {{orderProduct.deliveryDetailAddress}}</td>
                </tr>
                <tr>
                  <th>배송메모</th>
                  <td colspan="3">{{orderProduct.deliveryMessage}}</td>
                </tr>
                </tbody>
              </table>

              <table v-if="!['미결제'].includes(orderProduct.orderStatusStr)" class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="4">택배 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>택배사 정보</th>
                  <!-- 상태: 발송대기, 배송중, 교환요청 -->
                  <template v-if="['발송대기', '배송중', '교환'].includes(orderProduct.orderStatusStr)">
                    <td colspan="3">
                      <div class="delivery_service_edit_wrap">
                        <select v-model="orderProduct.delivery.delivery_method">
                          <option value="">배송 방법</option>
                          <option v-for="method in deliveryMethods" :value="method.key">{{method.value}}</option>
                        </select>
                        <select v-model="orderProduct.delivery.delivery_company">
                          <option value="">택배사 선택</option>
                          <option v-for="company in deliveryCompanies" :value="company.key">{{company.value}}</option>
                        </select>
                        <input type="text" v-model="orderProduct.delivery.invoice_num">
                        <a href="javascript:;" @click="updateDispatchDelivery(orderProduct.delivery)" class="btn_small line_but">적용</a>
                      </div>
                    </td>
                  </template>

                  <!-- 상태: 그 외 -->
                  <template v-else>
                    <td>{{orderProduct.delivery.delivery_company}}</td>
                    <th>발송예정일</th>
                    <td>{{orderProduct.expectedDispatchedAt | date}} 까지 발송</td>
                  </template>
                </tr>
                </tbody>
              </table>

              <ul>
                <li class="page_title">주문상태</li>
                <li>
                  <table class="show_table">
                    <colgroup>
                    </colgroup>
                    <thead>
                    <tr>
                      <th>일시</th>
                      <th>주문상태</th>
                      <th>주문상태 상세</th>
                      <th>사유</th>
                      <th>사유상세</th>
                      <th>수정</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="history in orderProduct.statusHistory">
                      <td>{{history.changedAt | date}}</td>
                      <td>{{history.orderStatusStr}}</td>
                      <td>{{history.orderSubStatusStr}}</td>
                      <td>{{history.reasonSubTypeStr}}</td>
                      <td>{{history.reason}}</td>
                      <td>
                        <a
                          v-if="['RQST_RTRN', 'EXCHNG'].includes(history.reasonSubTypeValue) || history.orderSubStatus === 'RQST_CNCL'"
                          href="javascript:;"
                          class="btn_small line_but"
                          @click="btnEditReason(history)"
                        >수정</a>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </li>
              </ul>

              <!-- 반품 or 교환 -->
              <ul v-if="['반품', '교환'].includes(orderProduct.orderStatusStr)
                && !['RQST_EXCHNG', 'RQST_RTRN', 'PSTPN_RTRN', 'PSTPN_EXCHNG'].includes(orderProduct.orderSubStatus)">
                <li class="page_title">수거정보</li>
                <li>
                  <div class="title">수거방법</div>
                  <div class="body">
                    <template v-for="code in collectDeliveryTypeCodes">
                      <input v-model="orderProduct.collect.collect_delivery_type" type="radio" :id="`collectDelivery${code.key}`" name="collectDelivery" :value="code.key">
                      <label :for="`collectDelivery${code.key}`">{{ code.value }}</label>
                    </template>
                  </div>
                </li>
                <li>
                  <div class="title">택배사 정보</div>
                  <div class="delivery_service_edit_wrap m_b_10">
                    <select v-model="orderProduct.collect.delivery_method">
                      <option value="">배송 방법</option>
                      <option v-for="method in deliveryMethods" :value="method.key">{{method.value}}</option>
                    </select>
                    <select v-model="orderProduct.collect.delivery_company">
                      <option value="">택배사 선택</option>
                      <option v-for="company in deliveryCompanies" :value="company.key">{{company.value}}</option>
                    </select>
                    <input type="text" v-model="orderProduct.collect.invoice_num">
                    <a href="javascript:;" @click="updateCollectDelivery(orderProduct.collect)" class="btn_small line_but">적용</a>
                  </div>
                </li>
              </ul>

              <!-- 반품/교환정보 START -->
              <ul v-if="orderProduct.returnExchangeAddress">
                <li class="page_title">반품/교환정보</li>
                <li>
                  <div class="title">반품/교환 주소지</div>
                  <div class="body">({{orderProduct.returnExchangeAddress.zipcode}}){{orderProduct.returnExchangeAddress.address}} {{orderProduct.returnExchangeAddress.detailAddress}}</div>
                </li>
                <li>
                  <div class="title">반품/교환 배송비 지불방법</div>
                  <div class="body">{{ orderProduct.collect.collect_fee_type_str }}</div>
                </li>
                <li>
                  <div class="title">반품/교환 배송비</div>
                  <div class="body">
                    <template v-if="['반품'].includes(orderProduct.orderStatusStr)">
                      {{orderProduct.returnFee}}
                    </template>
                    <template v-else>
                      {{orderProduct.exchangeFee}}
                    </template>
                  </div>
                </li>
              </ul>
              <!-- 반품/교환정보 END -->

              <ul>
                <li class="page_title">관리자 메모</li>
                <li>
                  <div class="title">관리자 메모</div>
                  <div class="body">
                    <div>{{orderProduct.adminMemo}}</div>
                    <a href="javascript:;" class="btn_small line_but" @click="btnAdminMemo">관리자 메모입력</a>
                  </div>
                </li>
              </ul>

              <div class="but_wrap text-center">
                <nuxt-link :to="'/store_admin/sales/order'" class="line_but">목록</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
  </client-only>
</template>

<script src="@/assets/javascripts/store_admin/sales/_id/index.js"></script>
