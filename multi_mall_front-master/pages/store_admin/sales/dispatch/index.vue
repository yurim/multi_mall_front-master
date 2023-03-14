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
                    <div>발주/발송 관리</div>
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
                            { text: '발주확인일', value: 'order_checked_at' },
                            { text: '발송처리일', value: 'dispatched_at' },
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
                            { text: '발송대기', value: 'DLVRY_WAIT' },
                            { text: '배송중', value: 'DLVRNG' },
                            { text: '배송완료', value: 'DLVRY_CMPLT' }
                          ]"
                        :onChange="getSubStatusList"
                      ></search-select>
                      <search-select
                        v-show="showSubStatusList"
                        ref="searchOrderSubState"
                        :classify="'order_sub_status'"
                        :items="[
                          { text: '전체', value: '' },
                          { text: '신규주문', value: 'NEW_ORDR' },
                          { text: '발주확인', value: 'CHCK_DLVRY' },
                          { text: '발송지연', value: 'DLY_DLVRY' },
                        ]"
                      ></search-select>
                    </div>
                  </li>
                  <li>
                    <div class="title">배송방법</div>
                    <div class="body">
                      <search-select
                        ref="searchDelivery"
                        :classify="'delivery'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '택배/등기/소포', value: 'PARCEL' },
                            { text: '직접전달', value: 'DIRECT' },
                            { text: '방문수령', value: 'VISIT' },
                            { text: '퀵서비스', value: 'QUICK' },
                          ]"
                      ></search-select>
                    </div>
                  </li>
                  <li>
                    <div class="title">발송지연 안내여부</div>
                    <div class="body">
                      <search-select
                        ref="searchDelay"
                        :classify="'delay'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '처리', value: 'true' },
                            { text: '미처리', value: 'false' },
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
                  <div class="delivery_service_edit_wrap m_b_10">
                    <select v-model="selectDeliveryInfo.deliveryCompany">
                      <option value="">택배사 선택</option>
                      <option v-for="deliveryCompany in deliveryCompanies" :value="deliveryCompany.key">
                        {{deliveryCompany.value}}
                      </option>
                    </select>
                    <input type="text" v-model="selectDeliveryInfo.invoiceNum">
                    <a href="javascript:;" class="btn_small line_but" v-on:click="selectApplyDelivery">선택건 적용</a>
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
                        <td>
                          <template v-if="item.deliveryMethod === 'PARCEL'">
                            <div>
                              <select v-model="item.deliveryCompany">
                                <option value="">택배사 선택</option>
                                <option v-for="deliveryCompany in deliveryCompanies" :value="deliveryCompany.key">
                                  {{deliveryCompany.value}}
                                </option>
                              </select>
                            </div>
                          </template>
                        </td>
                        <td>
                          <template v-if="item.deliveryMethod === 'PARCEL'">
                            <input type="text" v-model="item.invoiceNum" />
                          </template>
                        </td>
                        <td><span class="text">{{item.name}}</span></td>
                        <td><span class="text">{{item.phone}}</span></td>
                        <td><span class="text">{{item.email}}</span></td>
                        <td><span class="text">{{item.orderStatusStr}}</span></td>
                        <td><span class="text">{{item.orderSubStatusStr}}</span></td>
                        <td>
                          <span class="text">
                            <template v-if="item.orderedAt">
                              {{ item.orderedAt | date }}
                            </template>
                          </span>
                        </td>
                        <td><span class="text">{{item.channel}}</span></td>
                        <td>
                          <span class="text">
                            <template v-if="item.paidAt">
                              {{ item.paidAt | date }}
                            </template>
                          </span>
                        </td>
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
                        <td><span class="text">{{item.optionPrice}}</span></td>
                        <td><span class="text">{{item.productPrice}}</span></td>
                        <td><span class="text">{{item.productDiscountPrice}}</span></td>
                        <td><span class="text">{{item.totalPrice}}</span></td>
                        <td>
                          <span class="text">
                            {{ item.orderCheckedAt | date }}
                          </span>
                        </td>
                        <td>
                          <span class="text">
                            {{ item.expectedDispatchedAt | date }}
                          </span>
                        </td>
                        <td>
                          <span class="text">
                            {{ item.dispatchedAt | date }}
                          </span>
                        </td>
                        <td><span class="text">{{item.feePayMethod}}</span></td>
                        <td><span class="text">{{item.deliveryFeeType}}</span></td>
                        <td><span class="text">{{item.deliveryName}}</span></td>
                        <td><span class="text">{{item.deliveryPhone}}</span></td>
                        <td><span class="text">{{`${item.deliveryAddress} ${item.deliveryDetailAddress}`}}</span></td>
                        <td><span class="text">{{item.deliveryZipCode}}</span></td>
                        <td><span class="text">{{item.deliveryMessage}}</span></td>
                        <td><span class="text">{{item.paymentMethod}}</span></td>
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
                      <a href="javascript:;" class="line_but" v-on:click="btnCheckDelivery">발주확인</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnDelayDelivery">발송지연처리</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnOrderDelivery">배송지 정보수정</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">발송처리</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" v-on:click="btnSaveIndividualDelivery">택배사 및 운송장번호 저장</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnProcessingDelivery">발송처리</a>
                      <a href="javascript:;" class="line_but" v-on:click="btnUploadExcel">엑셀일괄 송장정보 입력</a>
                      <a href="javascript:;" class="gray_but" v-on:click="btnDownloadExcelTemplate">엑셀양식 다운로드</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">취소처리</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a href="javascript:;" class="line_but" v-on:click="btnCancel">판매취소요청</a>
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

<script src="@/assets/javascripts/store_admin/sales/dispatch/index.js"></script>
