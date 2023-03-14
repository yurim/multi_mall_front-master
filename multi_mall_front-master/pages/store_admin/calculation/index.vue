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
                  <li class="page_title">정산관리</li>
                  <li>
                    <div class="font_12">
                      * 정산기준 : 정산은 1일~15일 과 16~말일 기준 주문상태가 구매확정으로 변경된 주문건을 기준으로 정산해드리고 있습니다<br>
                      * 구매확정 기준 : 구매확정은 고객이 주문상세페이지에서 구매확정을 한 경우, 또는 배송완료 후 7일 후 자동 전환됩니다.<br>
                      * 포인트 사용의 경우 사용금액 만큼 결제금액에 합하여 정산해드립니다.
                    </div>
                  </li>
                  <li>
                    <div class="title">구매확정일</div>
                    <div class="body">
                      <div class="calculate_day_wrap">
                        <search-select
                          ref="searchYear"
                          :classify="'year'"
                          :items="decidePurchasedYears"
                          :onChange="selectYear"
                        ></search-select>
                        <search-select
                          ref="searchMonth"
                          :classify="'month'"
                          :items="decidePurchasedMonths"
                          :onChange="selectMonth"
                        ></search-select>
                        <search-select
                          ref="searchDay"
                          :classify="'days'"
                          :items="decidePurchasedDays"
                        ></search-select>
                      </div>
                    </div>
                  </li>
                </ul>
              </search-form>

              <table>
                <colgroup>
                  <col width="160">
                  <col>
                  <col width="160">
                  <col>
                  <col width="160">
                  <col>
                </colgroup>
                <tbody>
                <tr>
                  <th>구매확정일</th>
                  <td>
                    <template v-if="storeBalanceAccount">
                      {{storeBalanceAccount.decidePurchaseStartDate}} ~ {{storeBalanceAccount.decidePurchaseEndDate}}
                    </template>
                  </td>
                  <th>정산완료일</th>
                  <td>
                    <template v-if="storeBalanceAccount && storeBalanceAccount.completedAt">
                      {{storeBalanceAccount.completedAt}}
                    </template>
                  </td>
                  <th>정산여부</th>
                  <td>
                    <template v-if="storeBalanceAccount">
                      <template v-if="storeBalanceAccount.completedAt">정산완료</template>
                      <template v-else>미완료</template>
                    </template>
                  </td>
                </tr>
                <tr>
                  <th>총 주문건수</th>
                  <td>
                    <template v-if="storeBalanceAccount">
                      {{storeBalanceAccount.orderProductCount | comma}}
                    </template>
                  </td>
                  <th>총 수수료(부가세포함)</th>
                  <td>
                    <template v-if="storeBalanceAccount">
                      {{(storeBalanceAccount.commissionVat + storeBalanceAccount.commissionSupplyValue) | comma}}
                    </template>
                  </td>
                  <th>총 수수료 공급가액</th>
                  <td>
                    <template v-if="storeBalanceAccount">
                      {{storeBalanceAccount.commissionSupplyValue | comma}}
                    </template>
                  </td>
                </tr>
                <tr>
                  <th>총 포인트 사용</th>
                  <td>
                    <template v-if="storeBalanceAccount">
                      {{storeBalanceAccount.totalPoint | comma}}
                    </template>
                  </td>
                  <th>총 결제금액</th>
                  <td>
                    <template v-if="storeBalanceAccount">
                      {{storeBalanceAccount.totalPaidPrice | comma}}
                    </template>
                  </td>
                  <th><span class="color_main_01">총 정산금액</span></th>
                  <td>
                    <template v-if="storeBalanceAccount">
                      {{storeBalanceAccount.balanceAccountPrice | comma}}
                    </template>
                  </td>
                </tr>
                </tbody>
              </table>

              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{totalCount | comma}}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <div class="pull-right">
                      <a href="javascript:;" class="gray_but" @click="downloadExcel">엑셀다운</a>
                    </div>
                  </div>
                </li>
                <li>
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="storeBalanceAccountOrderProducts"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    :defaultPage="1"
                    :draggable="false"
                    :selectable="true"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td><span class="text">{{item.paidAt | date}}</span></td>
                      <td><span class="text">{{item.decidePurchasedAt | date}}</span></td>
                      <td><span class="text">{{item.balanceAccountTypeStr}}</span></td>
                      <td><span class="text" v-if="item.orderNum">{{item.orderNum}}</span></td>
                      <td>
                        <nuxt-link
                          class="text"
                          v-if="item.orderProductOrderNum"
                          :to="`/store_admin/sales/${item.orderProductOrderNum}`"
                        >
                          {{item.orderProductOrderNum}}
                        </nuxt-link>
                      </td>
                      <td>
                        <!-- todo: product_id 를 받아와서 링크로 연결시켜야함 -->
                        <nuxt-link
                          class="text"
                          v-if="item.productName"
                          :to="`/store/${item.productName}`"
                        >
                          {{item.productName}}
                        </nuxt-link>
                      </td>
                      <td><span class="text" v-if="item.productOptionNames">{{item.productOptionNames}}</span></td>
                      <td><span class="text" v-if="item.amount">{{item.amount | comma}}</span></td>
                      <td><span class="text">{{item.name}}</span></td>
                      <td><span class="text">{{item.paymentMethodStr}}</span></td>
                      <td><span class="text">{{(item.commissionSupplyValue + item.commissionVat) | comma}}</span></td>
                      <td><span class="text">{{item.commissionSupplyValue | comma}}</span></td>
                      <td><span class="text">{{item.commissionVat | comma}}</span></td>
                      <td><span class="text">{{item.paidPrice | comma}}</span></td>
                      <td><span class="text" v-if="item.point">{{item.point | comma}}</span></td>
                      <td><span class="text">{{item.balanceAccountPrice | comma}}</span></td>
                    </template>
                  </data-table>
                </li>
              </ul>

            </div>

          </div>
        </div>
      </div>
      <StoreAdminFooter></StoreAdminFooter>
    </div>
  </div>
  </client-only>
</template>

<script src="@/assets/javascripts/store_admin/calculation/index.js"></script>
