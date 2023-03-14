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
                    <div>배송현황 관리</div>
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
                            { text: '발송처리일', value: 'dispatched_at' },
                            { text: '배송완료일', value: 'delivered_at' },
                          ]"
                          periodType="week"
                        ></search-date-picker>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="title">주문상태</div>
                    <div class="body">
                      <search-select
                        ref="searchOrderState"
                        :classify="'order_status'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '배송중', value: 'DLVRNG' },
                            { text: '배송완료', value: 'DLVRY_CMPLT' },
                            { text: '교환(교환재배송)', value: 'EXCHNG_RDLVRY' },
                          ]"
                      ></search-select>
                    </div>
                  </li>

                  <li>
                    <div class="title">구매확정 요청여부</div>
                    <div class="body">
                      <search-select
                        ref="searchIsRequest"
                        :classify="'request_decide_purchase'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '미요청', value: 'false' },
                            { text: '요청중', value: 'true' },
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
                      <a href="javascript:;" class="gray_but" v-on:click="selectDownloadExcel">선택항목 엑셀다운</a>
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
                    selectType="multi"
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
                      <td><span class="text">{{item.deliveryMethodStr}}</span></td>
                      <td><span class="text">{{item.deliveryCompanyStr}}</span></td>
                      <td><span class="text">{{item.invoiceNum}}</span></td>
                      <td><span class="text"><a :href="item.trackingUrl" target="_blank">배송추적</a></span></td>
                      <td><span class="text">{{item.name}}</span></td>
                      <td><span class="text">{{item.phone}}</span></td>
                      <td><span class="text">{{item.email}}</span></td>
                      <td><span class="text">{{item.orderStatusStr}}</span></td>
                      <td><span class="text">{{item.orderedAt | date}}</span></td>
                      <td><span class="text">{{item.paymentMethod}}</span></td>
                      <td><span class="text">{{item.channel.toUpperCase()}}</span></td>
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
                      <td><span class="text">{{-item.discountPrice | comma}}</span></td>
                      <td><span class="text">{{item.productTotalPrice | comma}}</span></td>
                      <td><span class="text">{{item.orderCheckedAt | date}}</span></td>
                      <td><span class="text">{{item.expectedDispatchedAt | date}}</span></td>
                      <td><span class="text">{{item.dispatchedAt | date}}</span></td>
                      <td><span class="text">{{item.deliveryFeeTypeStr}}</span></td>
                      <td><span class="text">{{item.feePayMethodStr}}</span></td>
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
                      <td><span class="text">{{item.decidePurchaseRequestedAt}}</span></td>
                      <td><span class="text">{{item.orderDeliveryZipcode}}</span></td>
                      <td><span class="text">{{item.deliveryMessage}}</span></td>
                    </template>
                  </data-table>
                  </span>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">배송완료</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" v-on:click="btnUpdateDeliveryComplete">배송완료 처리</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">구매확정</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" v-on:click="btnDecidePurchaseRequest">구매확정 요청</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">교환/환불</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" v-on:click="btnSetReturn">판매자 직접 반품</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnSetExchange">판매자 직접 교환</a>
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

<script src="@/assets/javascripts/store_admin/sales/delivery/index.js"></script>
