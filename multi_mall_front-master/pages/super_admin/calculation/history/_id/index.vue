<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_three">
              <table>
                <colgroup>
                  <col width="160">
                  <col>
                  <col width="160">
                  <col>
                  <col width="160">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="4">정산관리 상세</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>매장명</th>
                  <td colspan="7">{{ storeBalanceAccount.storeNameKor }}</td>
                </tr>
                <tr>
                  <th>구매확정일</th>
                  <td>{{ `${storeBalanceAccount.decidePurchaseStartDate} ~ ${storeBalanceAccount.decidePurchaseEndDate}` }}</td>
                  <th>정산완료일</th>
                  <td>{{ storeBalanceAccount.completedAt | date }}</td>
                  <th>정산여부</th>
                  <td>
                    <template v-if="storeBalanceAccount.completedAt">
                      정산완료
                    </template>
                    <template v-else>
                      정산 미완료
                    </template>
                  </td>
                </tr>
                <tr>
                  <th>총 결제금액</th>
                  <td>{{ storeBalanceAccount.totalPaidPrice | comma }}</td>
                  <th>총 포인트 사용</th>
                  <td>{{ storeBalanceAccount.totalPoint | comma }}</td>
                  <th>총 수수료(부가세 포함)</th>
                  <td>{{ storeBalanceAccount.commissionSupplyValue + storeBalanceAccount.commissionVat | comma }}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <th><span class="color_main_01">총 정산금액</span></th>
                  <td colspan="5">{{ storeBalanceAccount.balanceAccountPrice | comma }}</td>
                </tr>
                </tfoot>
              </table>

              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{ totalCount | comma }}개)</span></div>
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
                      <td><span class="text">{{ item.paidAt | date }}</span></td>
                      <td><span class="text">{{ item.decidePurchasedAt | date }}</span></td>
                      <td><span class="text">{{ item.balanceAccountTypeStr }}</span></td>
                      <td><span class="text">{{ item.orderNum }}</span></td>
                      <td>
                        <span v-if="item.balanceAccountTypeStr === '배송비'"><span class="text">-</span></span>
                        <span v-else class="text">
                          <nuxt-link :to="`/super_admin/sales/${item.orderProductOrderNum}`">
                            {{ item.orderProductOrderNum }}
                          </nuxt-link>
                        </span>
                      </td>
                      <td>
                        <span v-if="item.balanceAccountTypeStr === '배송비'"><span class="text">-</span></span>
                        <span v-else class="text">
                          <nuxt-link :to="`/super_admin/sales/${item.orderProductOrderNum}`">
                            {{ item.productName }}
                          </nuxt-link>
                        </span>
                      </td>
                      <td>
                        <span v-if="item.balanceAccountTypeStr === '배송비'"><span class="text">-</span></span>
                        <span v-else class="text">{{ item.productOptionNames }}</span>
                      </td>
                      <td>
                        <span v-if="item.balanceAccountTypeStr === '배송비'"><span class="text">-</span></span>
                        <span v-else class="text">{{ item.amount | comma }}</span>
                      </td>
                      <td><span class="text">{{ item.name }}</span></td>
                      <td><span class="text">{{ item.paymentMethodStr }}</span></td>
                      <td><span class="text">{{ item.commissionSupplyValue + item.commissionVat | comma }}</span></td>
                      <td><span class="text">{{ item.commissionSupplyValue | comma }}</span></td>
                      <td><span class="text">{{ item.commissionVat | comma }}</span></td>
                      <td><span class="text">{{ item.paidPrice | comma }}</span></td>
                      <td>
                        <span v-if="item.balanceAccountTypeStr === '배송비'"><span class="text">-</span></span>
                        <span v-else class="text">{{ item.point | comma }}</span>
                      </td>
                      <td><span class="text">{{ item.balanceAccountPrice | comma }}</span></td>
                    </template>
                  </data-table>
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
<script src="@/assets/javascripts/super_admin/calculation/history/_id/index.js"></script>
