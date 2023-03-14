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
              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
              >
                <ul class="search_wrap">
                  <li class="page_title">
                    <div>교환 관리</div>
                  </li>
                  <li>
                    <div class="title">상세검색</div>
                    <div class="body">
                      <search-select-input
                        ref="searchKeyword"
                        :classify="'keyword'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '주문번호', value: 'order_num' },
                            { text: '상품 주문번호', value: 'product_order_num' },
                            { text: '구매자명', value: 'name' },
                            { text: '구매자 연락처', value: 'phone' },
                            { text: '구매자아이디', value: 'email' },
                            { text: '상품코드', value: 'product_id' },
                            { text: '수취인명', value: 'delivery_name' },
                          ]"
                        :placeholder="'내용을 입력해주세요.'"
                      ></search-select-input>
                    </div>
                  </li>
                  <li>
                    <div class="title">조회기간</div>
                    <div class="body">
                      <div class="select_date_wrap">
                        <search-date-picker
                          ref="searchDatePicker"
                          dateFormat="YYYY-MM-DDzz"
                          :dateTypes="[
                            { text: '결제일', value: 'paid_at' },
                            { text: '교환요청일', value: 'exchange_requested_at' },
                          ]"
                          periodType="month"
                        ></search-date-picker>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="title">처리상태</div>
                    <div class="body">
                      <search-select
                        ref="searchState"
                        :classify="'order_sub_status'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '교환요청', value: 'RQST_EXCHNG' },
                            { text: '교환지연', value: 'DLY_EXCHNG' },
                            { text: '수거중', value: 'PICKNG_PRDCT' },
                            { text: '수거완료', value: 'CMPLT_PICK' },
                            { text: '교환 재배송중', value: 'EXCHNG_RDLVRY' },
                            { text: '교환완료', value: 'CMPLT_EXCHNG' },
                            { text: '교환보류', value: 'PSTPN_EXCHNG' },
                          ]"
                      ></search-select>
                    </div>
                  </li>
                </ul>
              </search-form>
              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{totalCount}}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <div class="pull-right">
                      <a href="javascript:;" class="gray_but" v-on:click="downloadExcel">전체항목 엑셀다운</a>
                    </div>
                  </div>
                </li>

                <li>
                  <span class="table_size_l">
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="orderProducts"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    :defaultPage="1"
                    :draggable="false"
                    selectType="single"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td>
                        <nuxt-link :to="`/store_admin/sales/${item.productOrderNum}`" class="text">
                          {{item.orderNum}}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/store_admin/sales/${item.productOrderNum}`" class="text">
                          {{item.productOrderNum}}
                        </nuxt-link>
                      </td>
                      <td><span class="text">{{item.orderStatusStr}}</span></td>
                      <td><span class="text">{{item.orderSubStatusStr}}</span></td>
                      <td><span class="text">{{item.exchangeRequestedAt | date}}</span></td>
                      <td><span class="text">{{item.exchangedAt | date}}</span></td>
                      <td><span class="text">{{item.orderedAt | date}}</span></td>
                      <td><span class="text">{{item.returnFee | comma}}</span></td>
                      <td><span class="text">{{item.collectFeeTypeStr}}</span></td>
                      <td><span class="text">{{item.paidAt | date}}</span></td>
                      <td>
                        <nuxt-link :to="`/product/${item.productId}`" class="text" target="_blank">
                          {{item.productId}}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/product/${item.productId}`" class="text" target="_blank">
                          {{item.target}}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/product/${item.productId}`" class="text" target="_blank">
                          {{item.productName}}
                        </nuxt-link>
                      </td>
                      <td><span class="text">{{item.productOptionNames}}</span></td>
                      <td><span class="text">{{item.amount | comma}}</span></td>
                      <td><span class="text">{{item.optionPrice | comma}}</span></td>
                      <td><span class="text">{{item.productPrice | comma}}</span></td>
                      <td><span class="text">{{item.discountPrice | comma}}</span></td>
                      <td><span class="text">{{item.productTotalPrice | comma}}</span></td>
                      <td><span class="text">{{item.orderCheckedAt | date}}</span></td>
                      <td><span class="text">{{item.expectedDispatchedAt | date}}</span></td>
                      <td><span class="text">{{item.dispatchedAt | date}}</span></td>
                      <td><span class="text">{{item.feePayMethodStr}}</span></td>
                      <td><span class="text">{{item.deliveryFeeTypeStr}}</span></td>
                      <td><span class="text">{{item.orderDeliveryName}}</span></td>
                      <td><span class="text">{{item.orderDeliveryPhone}}</span></td>
                      <td>
                        <span class="text">
                          {{item.orderDeliveryAddress}}
                          <template v-if="item.orderDeliveryDetailAddress">
                            {{item.orderDeliveryDetailAddress}}
                          </template>
                        </span>
                      </td>
                      <td>
                        <span class="text">
                          {{item.returnExchangeAddress}}
                        </span>
                      </td>
                    </template>
                  </data-table>
                  </span>
                </li>
              </ul>
              <ul>
                <li>
                  <div class="title">교환처리</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" v-on:click="btnCollect">수거처리</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnCompleteCollect">수거완료 처리</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnExchangeRedelivery">교환재배송 처리</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnRejectExchange">교환거부 처리</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnChangeRetrun">반품으로 변경</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">교환보류</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" v-on:click="btnPostponeExchange">교환보류 설정</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnCancelPostponeExchange">교환보류 해제</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">정보수정</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" v-on:click="btnEditExchangeReason">교환사유 수정</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnEditDelivery">재배송정보 수정</a>
                      <a href="javascript:;" class="line_but" @click="btnEditFeePayMethod">교환배송비 지불방법 수정</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
  </client-only>
</template>

<script src="@/assets/javascripts/store_admin/sales/exchange/index.js"></script>
