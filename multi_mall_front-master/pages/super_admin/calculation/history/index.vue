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
                  <li class="page_title">정산관리</li>
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
                  <li>
                    <div class="title">정산상태</div>
                    <div class="body">
                      <search-select
                        ref="searchIsCompleted"
                        :classify="'is_completed'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '정산완료', value: 'true', isChecked: false },
                            { text: '정산미완료', value: 'false', isChecked: false },
                          ]"
                      ></search-select>
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
                  <td colspan="7">{{startDate}} ~ {{endDate}}</td>
                </tr>
                <tr>
                  <th>총 주문건수</th>
                  <td>{{totalInfo.orderProductCountSum | comma}}</td>
                  <th>총 수수료(부가세포함)</th>
                  <td>{{(totalInfo.commissionVatSum + totalInfo.commissionSupplyValueSum) | comma}}</td>
                  <th>총 수수료 공급가액</th>
                  <td>{{totalInfo.commissionSupplyValueSum | comma}}</td>
                </tr>
                <tr>
                  <th>총 포인트 사용</th>
                  <td>{{totalInfo.totalPointSum | comma}}</td>
                  <th>총 결제금액</th>
                  <td>{{totalInfo.totalPaidPriceSum | comma}}</td>
                  <th><span class="color_main_01">총 정산금액</span></th>
                  <td>{{totalInfo.balanceAccountPriceSum | comma}}</td>
                </tr>
                </tbody>
              </table>

              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{totalCount | comma}}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <div class="pull-right">
                      <a href="javascript:;" class="gray_but" @click="selectDownloadExcel">선택항목 엑셀다운</a>
                      <a href="javascript:;" class="gray_but" @click="downloadExcel">전체항목 엑셀다운</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="square_but_wrap m_b_10">
                    <a href="javascript:;" class="black_line_but" @click="setCompleteCalculation">선택항목 정산완료 처리</a>
                    <a href="javascript:;" class="black_line_but" @click="setIncompleteCalculation">선택항목 정산미완료 처리</a>
                  </div>
                </li>
                <li>
                  <span class="table_size_s">
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="storeBalanceAccounts"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    :defaultPage="1"
                    :draggable="false"
                    selectType="multi"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td>
                        <span class="text">
                          <template v-if="item.completedAt">
                            정산완료
                          </template>
                          <template v-else>
                            정산 미완료
                          </template>
                        </span>
                      </td>
                      <td><span class="text">{{item.completedAt | date}}</span></td>
                      <td>
                        <nuxt-link :to="`/super_admin/store/${item.storeId}`" class="text">
                          {{item.storeId}}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/super_admin/store/${item.storeId}`" class="text">
                          {{item.storeName}}
                        </nuxt-link>
                      </td>
                      <td><span class="text">{{item.bankName}}</span></td>
                      <td><span class="text">{{item.account}}</span></td>
                      <td><span class="text">{{item.holderName}}</span></td>
                      <td><span class="text">{{item.companyName}}</span></td>
                      <td><span class="text">{{item.licenseNum}}</span></td>
                      <td><span class="text">{{item.email}}</span></td>
                      <td>
                        <nuxt-link :to="`/super_admin/calculation/history/${item.id}`" class="text" v-bind:class="{color_y: !item.completedAt}">
                          {{item.orderProductCount | comma}}
                        </nuxt-link>
                      </td>
                      <td><span class="text">{{(item.commissionVat + item.commissionSupplyValue) | comma}}</span></td>
                      <td><span class="text">{{item.commissionSupplyValue | comma}}</span></td>
                      <td><span class="text">{{item.commissionVat | comma}}</span></td>
                      <td><span class="text">{{item.balanceAccountPrice | comma}}</span></td>
                      <td><span class="text">{{item.totalPaidPrice | comma}}</span></td>
                      <td><span class="text">{{item.totalPoint | comma}}</span></td>
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

<script src="@/assets/javascripts/super_admin/calculation/history/index.js"></script>
