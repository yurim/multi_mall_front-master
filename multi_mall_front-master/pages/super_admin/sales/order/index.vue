<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

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
                    <div>주문조회</div>
                  </li>
                  <li>
                    <div class="title">상세검색</div>
                    <div class="body">
                      <search-select-input
                        ref="searchSelectInput"
                        :classify="'keyword'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '주문번호', value: 'order_num' },
                            { text: '상품 주문번호', value: 'product_order_num' },
                            { text: '구매자명', value: 'name' },
                            { text: '구매자 연락처', value: 'phone' },
                            { text: '구매자아이디', value: 'email' },
                            { text: '상품코드', value: 'product_id' },
                            { text: '판매 매장명', value: 'store_name' },
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
                          :dateTypes="[
                            { text: '결제일', value: 'paid_at' },
                            { text: '발주확인일', value: 'order_checked_at' },
                            { text: '발송처리일', value: 'dispatched_at' },
                          ]"
                          periodType="week"
                        ></search-date-picker>
                      </div>
                    </div>
                  </li>
                </ul>
              </search-form>

              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{totalCount}}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <div class="pull-right">
                      <a href="javascript:;" class="gray_but" @click="downloadExcel">전체항목 엑셀다운</a>
                    </div>
                  </div>
                </li>

                <li>
                  <span class="table_size_s">
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="orderProducts"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    selectType="single"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td>
                        <nuxt-link :to="`/super_admin/sales/${item.productOrderNum}`" class="text">
                          {{item.orderNum}}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/super_admin/sales/${item.productOrderNum}`" class="text">
                          {{item.productOrderNum}}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/super_admin/store/${item.storeId}`" class="text">
                          {{item.storeNameKor}}
                        </nuxt-link>
                      </td>
                      <td><span class="text">{{item.orderedAt | date}}</span></td>
                      <td><span class="text">{{item.orderStatus}}</span></td>
                      <td><span class="text">{{item.orderSubStatus}}</span></td>
                      <td>
                        <a :href="`/product/${item.productId}`" class="text" target="_blank">{{item.productId}}</a>
                      </td>
                      <td>
                        <a :href="`/product/${item.productId}`" class="text" target="_blank">{{item.target}}</a>
                      </td>
                      <td>
                        <a :href="`/product/${item.productId}`" class="text" target="_blank">
                          {{item.productName}}
                        </a>
                      </td>
                      <td><span class="text">{{item.productOptionNames}}</span></td>
                      <td class="text-center"><span class="text">{{item.amount}}</span></td>
                      <td class="text-center"><span class="text">{{item.name}}</span></td>
                      <td><span class="text">{{item.email}}</span></td>
                      <td class="text-center"><span class="text">{{item.deliveryName}}</span></td>
                    </template>
                  </data-table>
                  </span>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">주문관리</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" @click="btnCheckDelivery">발주확인처리</a>
                      <a href="javascript:;" class="line_but" @click="btnDelay">발송지연처리</a>
                      <a href="javascript:;" class="line_but" @click="btnEditDelivery">배송지 정보수정</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">취소처리</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" @click="btnCancel">취소요청처리</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">반품교환 관리</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" @click="btnReturn">판매자 반품접수</a>
                      <a href="javascript:;" class="line_but" @click="btnExchange">판매자 교환접수</a>
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
</template>

<script src="@/assets/javascripts/super_admin/sales/order/index.js"></script>
