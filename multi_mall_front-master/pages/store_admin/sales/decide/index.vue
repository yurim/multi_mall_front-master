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
                    <div>구매확정 내역</div>
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
                            { text: '구매확정일', value: 'decide_purchased_at' },
                            { text: '배송완료일', value: 'delivered_at' },
                          ]"
                          periodType="month"
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
                      <a href="javascript:;" class="gray_but" @click="selectDownloadExcel">선택항목 엑셀다운</a>
                      <a href="javascript:;" class="gray_but" @click="downloadExcel">전체항목 엑셀다운</a>
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
                    :defaultPageSize="pageSize"
                    :selectable="true"
                    selectType="multi"
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
                      <td><span class="text">{{item.decide_purchased_at | date}}</span></td>
                      <td><span class="text">{{item.delivery_method}}</span></td>
                      <td>{{item.delivery_company}}</td>
                      <td>{{item.invoice_num}}</td>
                      <td><span class="text"><a :href="item.delivery_trace_url" target="_blank">배송추적</a></span></td>
                      <td><span class="text">{{item.order_name}}</span></td>
                      <td><span class="text">{{item.order_phone}}</span></td>
                      <td><span class="text">{{item.order_email}}</span></td>
                      <td><span class="text">{{item.order_status}}</span></td>
                      <td><span class="text">{{item.ordered_at | date}}</span></td>
                      <td><span class="text">{{item.payment_method}}</span></td>
                      <td><span class="text">{{item.channel}}</span></td>
                      <td><span class="text">{{item.paid_at | date}}</span></td>
                      <td>
                        <nuxt-link :to="`/product/${item.product_id}`" class="text" target="_blank">
                          {{item.product_id}}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/product/${item.product_id}`" class="text" target="_blank">
                          {{item.target}}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/product/${item.product_id}`" class="text" target="_blank">
                          {{item.product_name}}
                        </nuxt-link>
                      </td>
                      <td><span class="text">{{item.product_option_names}}</span></td>
                      <td><span class="text">{{item.amount}}</span></td>
                      <td><span class="text">+{{item.option_price | comma}}</span></td>
                      <td><span class="text">{{item.product_price | comma}}</span></td>
                      <td><span class="text">{{item.discount_price | comma}}</span></td>
                      <td><span class="text">{{item.product_total_price | comma}}</span></td>
                      <td><span class="text">{{item.order_checked_at | date}}</span></td>
                      <td><span class="text">{{item.expected_dispatched_at | date}}</span></td>
                      <td><span class="text">{{item.dispatched_at | date}}</span></td>
                      <td><span class="text">{{item.fee_pay_method}}</span></td>
                      <td><span class="text">{{item.delivery_fee_type}}</span></td>
                      <td><span class="text">{{item.order_delivery_name}}</span></td>
                      <td><span class="text">{{item.order_delivery_phone}}</span></td>
                      <td><span class="text">{{item.order_delivery_address}} {{item.order_delivery_detail_address}}</span></td>
                      <td><span class="text">{{item.decide_purchase_requested_at | date}}</span></td>
                      <td><span class="text">{{item.order_delivery_zipcode}}</span></td>
                      <td><span class="text">{{item.delivery_message}}</span></td>
                    </template>
                  </data-table>
                  </span>
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

<script src="@/assets/javascripts/store_admin/sales/decide/index.js"></script>
