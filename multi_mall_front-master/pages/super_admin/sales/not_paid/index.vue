<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_three">
              <ul class="search_wrap">
                <li class="page_title">
                  <div>미결제 확인</div>
                </li>
                <li>
                  <span class="font_12">
                    - 구매자가 나중에결제/무통장입금으로 주문한 이후, 아직 결제 완료되지 않은 주문건입니다.<br>
                    - 구매자명(수취인명)의 연락처나 배송지 등 정보는 표시되지 않으며, 결제가 완료되면
                    [발주/발송관리] 메뉴에 신규 주문건으로 표시되어 모든 정보를 확인할 수 있습니다.<br>
                    - 주문일로부터 2영업일 내에 결제 완료되지 않을 경우 주문은 자동으로 취소됩니다.
                  </span>
                </li>
              </ul>

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
                  <span class="table_size_sm">
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="orderProducts"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    :defaultPage="1"
                    :draggable="false"
                    :selectable="true"
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
                      <td>
                        <span class="text">
                          <template v-if="item.orderedAt">
                            {{item.orderedAt | date}}
                          </template>
                        </span>
                      </td>
                      <td><span class="text">{{item.paymentExpiredAt | date}}</span></td>
                      <td><span class="text">{{item.paymentMethod}}</span></td>
                      <td><span class="text">{{item.orderName}}</span></td>
                      <td><span class="text">{{item.orderPhone}}</span></td>
                      <td><span class="text">{{item.orderStatus}}</span></td>
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
                      <td><span class="text">{{item.amount}}</span></td>
                      <td><span class="text">+{{item.optionPrice | comma}}</span></td>
                      <td><span class="text">{{item.productPrice | comma}}</span></td>
                      <td><span class="text">{{item.discountPrice | comma}}</span></td>
                      <td><span class="text">{{item.productTotalPrice | comma}}</span></td>
                      <td><span class="text">{{item.deliveryName}}</span></td>
                      <td><span class="text">{{item.deliveryPhone}}</span></td>
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
</template>

<script src="@/assets/javascripts/super_admin/sales/not_paid/index.js"></script>
