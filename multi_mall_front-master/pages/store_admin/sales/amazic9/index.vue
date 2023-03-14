<template>
  <client-only>
  <div class="adminWrap">
    <StoreAdminHeader></StoreAdminHeader>
    <StoreAdminSideNav></StoreAdminSideNav>
    <div class="content_wrap">
      <div class="content_box_wrap">
        <div class="col_wrap">
          <div class="col_three">
            <!-- *** 배송대행신청 목록 - 일반 사용자용 START *** -->

            <!-- *** 검색 START *** -->
            <search-form
              :onSearch="onSearch"
              :onReset="onReset">
              <ul class="search_wrap">
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
                        { text: '수취인명', value: 'receiver_name' },
                        { text: '구매자명', value: 'purchaser_name' },
                        { text: '구매자 연락처', value: 'purchaser_phone' },
                        { text: '구매자 아이디', value: 'purchaser_email' },
                        { text: '상품코드', value: 'product_id' },
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
                      ></search-date-picker>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">구매대행 상태</div>
                  <div class="body">
                    <search-radio
                      ref="searchIsPurchased"
                      :classify="'purchase_status'"
                      :items="[
                        { text: '전체', value: null, isChecked: true },
                        { text: '구매완료', value: 'prchsng_cmpltd', isChecked: true },
                        { text: '구매미완료', value: 'not_prchsng_cmpltd', isChecked: true },
                        { text: '구매확인 필요없음', value: 'not_needed', isChecked: true },
                      ]"
                    ></search-radio>
                    </div>
                </li>
                <li>
                  <div class="title">배송신청 상태</div>
                  <div class="body">
                    <div class="select_input_wrap">
                      <search-checkbox
                        ref="searchIsRequested"
                        :classify="'is_requested'"
                        :items="[
                        { text: '신청완료', value: 'true', isChecked: true },
                        { text: '미신청', value: 'false', isChecked: true },
                      ]"
                      ></search-checkbox>
                      <search-select
                        ref="searchDeliveryDetailStatus"
                        :classify="'delivery_detail_status'"
                        :items="[
                          { text: '세부상태 전체', value: '' },
                          { text: '신청가능', value: 'can_dlvry_rqst' },
                          { text: '구매미완료', value: 'not_prchsng_cmpltd' },
                          { text: '신청불필요', value: 'not_needed' },
                        ]"
                      ></search-select>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">구매처</div>
                  <div class="body">
                    <search-checkbox
                      ref="searchTarget"
                      :classify="'target'"
                      :items="targets"
                    ></search-checkbox>
                  </div>
                </li>
              </ul>
            </search-form>
            <!-- *** 검색 END *** -->

            <!-- *** 배송대행신청 목록 START *** -->
            <ul class="table_wrap">
              <li class="page_title">
                <div class="pull-left">
                  <div class="select_div_wrap">
                    <div>조회결과 <span>({{ totalCount }}건)</span></div>
                  </div>
                </div>
                <div class="square_but_wrap pull-right">
                  <div class="pull-right">
                    <a class="gray_but" @click="uploadExcelForPurchase">구매처리 엑셀업로드</a>
                    <a class="gray_but" @click="uploadExcelForDispatch">발송처리 엑셀업로드</a>
                    <a class="gray_but" @click="selectDownloadExcel">선택항목 엑셀다운</a>
                    <a class="gray_but" @click="downloadExcel">전체항목 엑셀다운</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="table_scroll_m">
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :items="orderDeliveryRequests"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    :defaultPage="1"
                    :defaultPageSize="pageSize"
                    :headersLength="22"
                  >
                    <template v-slot:header="{ props, on }">
                    <tr>
                      <th rowspan="2">
                        <v-simple-checkbox
                          v-model="props.everyItem"
                          :indeterminate="props.someItems && !props.everyItem"
                          @input="on['toggle-select-all']"
                        />
                      </th>
                      <th rowspan="2">주문일시</th>
                      <th rowspan="2">주문번호</th>
                      <th rowspan="2">배송대행<br/>신청상태</th>
                      <th rowspan="2">배송대행<br/>신청번호</th>
                      <th colspan="3">국내 발송정보</th>
                      <th rowspan="2">상품주문번호</th>
                      <th rowspan="2">주문상태</th>
                      <th rowspan="2">상세주문상태</th>
                      <th rowspan="2">구매처</th>
                      <th rowspan="2">구매상태</th>
                      <th rowspan="2">구매확인<br/>필요</th>
                      <th colspan="3">해외 주문정보</th>
                      <th rowspan="2">수취인 명</th>
                      <th rowspan="2">수취인 연락처</th>
                      <th rowspan="2">수취인 주소</th>
                      <th rowspan="2">상품이미지</th>
                      <th rowspan="2">상품명</th>
                    </tr>
                    <tr>
                      <th>택배사</th>
                      <th>국내 운송장번호</th>
                      <th>저장</th>
                      <th>해외 주문번호</th>
                      <th>해외 운송장번호</th>
                      <th>저장</th>
                    </tr>
                    </template>
<!--                    </thead>-->
                    <!-- '미완료 상태일때 체크박스는 전부 checked , '구매완료' 상태일때 체크박스는 전부 checked disabled
                        '구매필요없음,미완료' 체크박스 클릭시 PopAmazic9PuchaseStatusAlert 팝업창이 나와야됨 -->
                    <template v-slot:groupBody="{items, isSelected, select}">
                      <template v-for="(item, itemIndex) in items">
                        <tr>
                          <td :rowspan="item.order_product_delivery_requests.length">
                            <div class="only_checkbox_wrap">
                              <v-checkbox
                                :input-value="isSelected(item)"
                                @change="select(item, !isSelected(item))"
                              />
                            </div>
                          </td>
                          <td :rowspan="item.order_product_delivery_requests.length">
                            {{ item.order.ordered_at | date }}
                          </td>
                          <td :rowspan="item.order_product_delivery_requests.length">
                            <nuxt-link :to="`/store_admin/sales/${item.order_product_delivery_requests[0].order_product.order_num}`" class="color_b">
                              {{ item.order.order_num }}
                            </nuxt-link>
                          </td>
                          <!-- *** 배송대행 신청 버튼 START *** -->
                          <td :rowspan="item.order_product_delivery_requests.length">
                            <div>
                              {{ item.delivery_request_status_str }}<br/>
                              <span v-if="item.delivery_request_sub_status_str">({{ item.delivery_request_sub_status_str }})</span>
                              <!-- 배송미신청(미신청, 부분 구매완료), 부분신청완료(부분 미신청, 부분 구매완료) 시  -->
                              <div class="square_but_wrap m_t_5" v-if="
                            (item.delivery_request_status === 'NOT_RQSTD' && (item.delivery_request_sub_status == null || item.delivery_request_sub_status === 'PRT_PRCHSNG_CMPLTD'))
                            || (item.delivery_request_status === 'PRT_RQSTD' && (item.delivery_request_sub_status == null || item.delivery_request_sub_status === 'PRT_PRCHSNG_CMPLTD'))">
                                <a @click="requestDelivery(itemIndex)">신청하기</a>
                              </div>
                            </div>
                          </td>
                          <!-- *** 배송대행 신청 버튼 END *** -->

                          <!-- *** 주문상품 배송 요청 [첫번째 상품] START *** -->
                          <!-- *** 국내 발송정보 START *** -->
                          <td>
                            <nuxt-link :to="`/store_admin/sales/amazic9/${item.firstOPDR.delivery_request.id}`" v-if="item.firstOPDR.delivery_request" class="color_b">
                              {{ item.firstOPDR.delivery_request.id }}
                            </nuxt-link>
                            <template v-else>-</template>
                          </td>
                          <td>
                            <select v-model="item.firstOPDR.order_product.order_product_delivery.delivery_company">
                              <option value="" selected>택배사 선택</option>
                              <option v-for="deliveryCompany in deliveryCompanyList" :value="deliveryCompany.key">
                                {{ deliveryCompany.value }}
                              </option>
                            </select>
                          </td>
                          <td>
                            <input type="text" placeholder="국내 운송장번호 입력" v-model="item.firstOPDR.order_product.order_product_delivery.invoice_num">
                          </td>
                          <td>
                            <div class="square_but_wrap">
                              <a @click="updateInvoiceNum(itemIndex, 0)">저장</a>
                            </div>
                          </td>
                          <!-- *** 국내 발송정보 END *** -->
                          <td>
                            <nuxt-link :to="`/store_admin/sales/${item.firstOPDR.order_product.order_num}`" class="color_b">
                              {{ item.firstOPDR.order_product.order_num }}
                            </nuxt-link>
                          </td>
                          <td>
                            {{ item.firstOPDR.order_product.order_status_str }}
                          </td>
                          <td>
                            {{ item.firstOPDR.order_product.order_sub_status_str }}
                            <div class="square_but_wrap" v-if="item.firstOPDR.order_product.order_sub_status === 'NEW_ORDR'">
                              <a @click="updateCheckDelivery(item.id, item.firstOPDR.order_product.id)">발주확인</a>
                            </div>
                          </td>
                          <td>
                            {{ item.firstOPDR.order_product.product.target_str }}
                            <div class="square_but_wrap"
                                 v-if="item.firstOPDR.order_product.order_status !== 'DLVRNG'
                                 && (item.firstOPDR.order_product.product.target === 'DIRECT' || ['0', '2'].indexOf(targetMap[item.firstOPDR.order_product.product.target].value) > -1)">
                              <nuxt-link :to="`/store_admin/sales/dispatch?keyword_type=product_order_num&keyword=${item.firstOPDR.order_product.order_num}`">
                                발송처리
                              </nuxt-link>
                            </div>
                          </td>
                          <td>
                          <span class="color_g"
                                v-if="item.firstOPDR.abroad_order_num || item.firstOPDR.abroad_tracking_num">구매완료</span>
                            <span class="color_r"
                                  v-else-if="item.firstOPDR.check_purchasing === true &&
                                (!item.firstOPDR.abroad_order_num && !item.firstOPDR.abroad_tracking_num)">미완료</span>
                            <span class="color_y" v-else>구매필요<br/>없음</span>
                          </td>
                          <td>
                            <div class="only_checkbox_wrap">
                              <!-- 구매완료 시 비활성화 -->
                              <input type="checkbox" :id="`check_purchasing_${itemIndex}_0`" v-model="item.firstOPDR.check_purchasing"
                                     :disabled="item.firstOPDR.abroad_order_num || item.firstOPDR.abroad_tracking_num"
                                     @change="updateCheckPurchasing(item.firstOPDR)">
                              <label :for="`check_purchasing_${itemIndex}_0`"></label>
                            </div>
                          </td>
                          <!-- *** 해외 주문정보 START *** -->
                          <td>
                            <input type="text" placeholder="해외 주문번호 입력" v-model="item.firstOPDR.editAbroadOrderNum" :disabled="!item.firstOPDR.check_purchasing">
                          </td>
                          <td>
                            <input type="text" placeholder="해외 운송장번호 입력" v-model="item.firstOPDR.editAbroadTrackingNum" :disabled="!item.firstOPDR.check_purchasing">
                          </td>
                          <td>
                            <div class="square_but_wrap">
                              <a @click="updateAbroadOrder(itemIndex, 0)">저장</a>
                            </div>
                          </td>
                          <!-- *** 해외 주문정보 END *** -->
                          <td>{{ item.order.order_delivery.name }}</td>
                          <td>{{ item.order.order_delivery.phone }}</td>
                          <td>[{{ item.order.order_delivery.zipcode }}] {{ item.order.order_delivery.address }} {{ item.order.order_delivery.detail_address }}</td>
                          <td>
                          <span class="thumbnail_wrap">
                            <DefaultImage :imageUrl="item.firstOPDR.order_product.product.image_url"></DefaultImage>
                          </span>
                          </td>
                          <td>{{ item.firstOPDR.order_product.product.name }}</td>
                          <!-- *** 주문상품 배송 요청 [첫번째 상품] END *** -->
                        </tr>

                        <!-- *** 주문상품 배송 요청 리스트 START *** -->
                        <tr v-for="(opdr, opdrIndex) in item.order_product_delivery_requests" v-if="opdrIndex !== 0">
                          <!-- *** 국내 발송정보 START *** -->
                          <td>
                            <nuxt-link :to="`/store_admin/sales/amazic9/${opdr.delivery_request.id}`" v-if="opdr.delivery_request" class="color_b">
                              {{ opdr.delivery_request.id }}
                            </nuxt-link>
                            <template v-else>-</template>
                          </td>
                          <td>
                            <select v-model="opdr.order_product.order_product_delivery.delivery_company">
                              <option value="" selected>택배사 선택</option>
                              <option v-for="deliveryCompany in deliveryCompanyList" :value="deliveryCompany.key">
                                {{ deliveryCompany.value }}
                              </option>
                            </select>
                          </td>
                          <td>
                            <input type="text" placeholder="국내 운송장번호 입력" v-model="opdr.order_product.order_product_delivery.invoice_num">
                          </td>
                          <td>
                            <div class="square_but_wrap">
                              <a @click="updateInvoiceNum(itemIndex, opdrIndex)">저장</a>
                            </div>
                          </td>
                          <!-- *** 국내 발송정보 END *** -->
                          <td>
                            <nuxt-link :to="`/store_admin/sales/${opdr.order_product.order_num}`" class="color_b">
                              {{ opdr.order_product.order_num }}
                            </nuxt-link>
                          </td>
                          <td>
                            {{ opdr.order_product.order_status_str }}
                          </td>
                          <td>
                            {{ opdr.order_product.order_sub_status_str }}
                            <div class="square_but_wrap" v-if="opdr.order_product.order_sub_status === 'NEW_ORDR'">
                              <a @click="updateCheckDelivery(item.id, opdr.order_product.id)">발주확인</a>
                            </div>
                          </td>
                          <td>
                            {{ opdr.order_product.product.target_str }}
                            <div class="square_but_wrap m_t_5"
                                 v-if="opdr.order_product.order_status !== 'DLVRNG'
                                 && (opdr.order_product.product.target === 'DIRECT' || ['0', '2'].indexOf(targetMap[opdr.order_product.product.target].value) > -1)">
                              <nuxt-link :to="`/store_admin/sales/dispatch?keyword_type=product_order_num&keyword=${opdr.order_product.order_num}`">
                                발송처리
                              </nuxt-link>
                            </div>
                          </td>
                          <td>
                          <span class="color_g"
                                v-if="opdr.abroad_order_num || opdr.abroad_tracking_num">구매완료</span>
                            <span class="color_r"
                                  v-else-if="opdr.check_purchasing === true &&
                                (!opdr.abroad_order_num && !opdr.abroad_tracking_num)">미완료</span>
                            <span class="color_y" v-else>구매필요<br/>없음</span>
                          </td>
                          <td>
                            <div class="only_checkbox_wrap">
                              <!-- 구매완료 시 비활성화 -->
                              <input type="checkbox" :id="`check_purchasing_${itemIndex}_${opdrIndex}`" v-model="opdr.check_purchasing"
                                     :disabled="opdr.abroad_order_num || opdr.abroad_tracking_num"
                                     @change="updateCheckPurchasing(opdr)">
                              <label :for="`check_purchasing_${itemIndex}_${opdrIndex}`"></label>
                            </div>
                          </td>
                          <!-- *** 해외 주문정보 START *** -->
                          <td>
                            <input type="text" placeholder="해외 주문번호 입력" v-model="opdr.editAbroadOrderNum" :disabled="!opdr.check_purchasing">
                          </td>
                          <td>
                            <input type="text" placeholder="해외 운송장번호 입력" v-model="opdr.editAbroadTrackingNum" :disabled="!opdr.check_purchasing">
                          </td>
                          <td>
                            <div class="square_but_wrap">
                              <a @click="updateAbroadOrder(itemIndex, opdrIndex)">저장</a>
                            </div>
                          </td>
                          <!-- *** 해외 주문정보 END *** -->
                          <td>{{ item.order.order_delivery.name }}</td>
                          <td>{{ item.order.order_delivery.phone }}</td>
                          <td>[{{ item.order.order_delivery.zipcode }}] {{ item.order.order_delivery.address }} {{ item.order.order_delivery.detail_address }}</td>
                          <td>
                          <span class="thumbnail_wrap">
                            <DefaultImage :imageUrl="opdr.order_product.product.image_url"></DefaultImage>
                          </span>
                          </td>
                          <td>{{ opdr.order_product.product.name }}</td>
                        </tr>
                        <!-- *** 주문상품 배송 요청 리스트 END *** -->
                      </template>
                    </template>
                    <!-- *** 부분신청완료 END *** -->
                  </data-table>
                </div>
              </li>
            </ul>
            <!-- *** 배송대행신청 목록 END *** -->
            <!-- *** 배송대행신청 목록 - 일반 사용자용 END *** -->
          </div>
        </div>
      </div>
    </div>
    <StoreAdminFooter></StoreAdminFooter>
  </div>
  </client-only>
</template>
<script src="@/assets/javascripts/store_admin/sales/amazic9/index.js"></script>
