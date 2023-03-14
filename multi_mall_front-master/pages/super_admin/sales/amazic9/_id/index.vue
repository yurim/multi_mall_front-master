<template>
  <div class="adminWrap">
    <SuperAdminHeader></SuperAdminHeader>
    <SuperAdminSideNav></SuperAdminSideNav>
    <div class="content_wrap">
      <div class="content_box_wrap">
        <div class="col_wrap">
          <div class="col_three">
            <ul class="table_wrap">
              <li class="title">주문상세</li>
              <li class="page_title">
                <div class="pull-left">주문정보</div>
              </li>
              <li>
                <table>
                  <colgroup>
                    <col width="150px">
                    <col>
                    <col width="150px">
                    <col>
                  </colgroup>
                  <tbody class="tbody_group">
                  <tr>
                    <th>판매매장</th>
                    <td :colspan="3">
                      <nuxt-link :to="`/super_admin/store/${order.store.id}`" class="color_b">
                        {{ order.store.name_kor }}
                      </nuxt-link>
                    </td>
                  </tr>
                  <tr>
                    <th>주문번호</th>
                    <td>
                      <nuxt-link :to="`/super_admin/sales/${delivery_request.infos[0].order_product.order_num}`" class="color_b">
                        {{ order.order_num }}
                      </nuxt-link>
                    </td>
                    <th>주문자 아이디</th>
                    <td>{{ order.email }}</td>
                  </tr>
                  <tr>
                    <th>주문일</th>
                    <td>{{ order.ordered_at | date }}</td>
                    <th>결제일</th>
                    <td>{{ order.paid_at | date }}</td>
                  </tr>
                  <tr>
                    <th>주문자명</th>
                    <td>{{ order.name }}</td>
                    <th>주문자 연락처</th>
                    <td>{{ order.phone }}</td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
            <ul class="table_wrap">
              <li class="page_title">
                <div class="pull-left">받는 사람 정보</div>
              </li>
              <li>
                <table>
                  <colgroup>
                    <col width="150px">
                    <col>
                    <col width="150px">
                    <col>
                  </colgroup>
                  <tbody class="tbody_group">
                  <tr>
                    <th>받는 사람 성명</th>
                    <td>{{ order.receiver.name }}</td>
                    <th>받는 사람 영문이름</th>
                    <td>{{ delivery_request.eng_name }}</td>
                  </tr>
                  <tr>
                    <th>받는 사람 연락처</th>
                    <td>{{ order.receiver.phone }}</td>
                    <th>개인통관부호</th>
                    <td>{{ order.clearance_num }}</td>
                  </tr>
                  <tr>
                    <th>우편번호</th>
                    <td colspan="3">{{ order.receiver.zipcode }}</td>
                  </tr>
                  <tr>
                    <th>배송지 주소</th>
                    <td colspan="3">{{ order.receiver.address }} {{ order.receiver.detail_address }}</td>
                  </tr>
                  <tr>
                    <th>배송 요청사항</th>
                    <td colspan="3">{{ order.delivery_message }}</td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
            <ul class="table_wrap">
              <li class="title">제품정보</li>
              <!--    신청 일때 -->
              <li class="page_title">
                <div class="pull-left">신청 내역</div>
                <span
                  class="color_gray_7 m_l_10">해당신청내역은 신청당시의 정보를 반영합니다. 트레킹번호외의 다른 정보수정은 amazic9.com 홈페이지를 이용해주세요.</span>
              </li>
              <li>
                <!-- *** 신청 내역 START *** -->
                <table>
                  <colgroup>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                  </colgroup>
                  <tbody class="tbody_group">
                  <template v-for="(info, infoIndex) in delivery_request.infos">
                    <tr>
                      <th>상품 주문번호</th>
                      <th colspan="2">주문한 상품명</th>
                      <th>주문한 상품옵션</th>
                      <th >주문한 상품 이미지</th>
                      <th>주문상태</th>
                      <th v-if="infoIndex < 1">신청정보</th>
                    </tr>
                    <tr class="tbody_group_list">
                      <td>
                        <div class="body">
                          <nuxt-link :to="`/super_admin/sales/${info.order_product.order_num}`" class="text">
                            {{ info.order_product.order_num }}
                          </nuxt-link>
                        </div>
                      </td>
                      <td colspan="2">
                        <div class="body">
                          <span>{{ (info.order_product.product) ? info.order_product.product.name : '-' }}</span>
                        </div>
                      </td>
                      <td>
                        <div class="body">
                          <span>{{ info.order_product.product_option_names }}</span>
                        </div>
                      </td>
                      <td>
                      <span class="thumbnail_wrap">
                        <DefaultImage :imageUrl="(info.order_product.product) ? info.order_product.product.main_image : null" />
                      </span>
                      </td>
                      <td>
                        <div class="body">
                          <span>{{ info.order_product.order_status_str }}</span>
                          <span>{{ info.order_product.order_sub_status_str }}</span>
                        </div>
                      </td>
                      <td :rowspan="(delivery_request.infos.length * 11) - 1" v-if="infoIndex === 0">
                        <div class="price_title">신청번호: {{ delivery_request.amazic9_delivery_request_id }}</div>
                        <div class="price_wrap">
                          <div class="total">총 제품 수량: <span>{{ delivery_request.total_amount | comma }}</span></div>
                          <div class="cap" v-for="(value, key) in delivery_request.total_prices">
                            총액({{key}}): <span>{{ value | comma }}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr class="tbody_group_list">
                      <th colspan="4">해외 주문정보</th>
                      <th colspan="2" rowspan="2">구매처</th>
                    </tr>
                    <tr class="tbody_group_list">
                      <th>해외 주문번호</th>
                      <th colspan="3">해외 운송장번호</th>
                    </tr>
                    <tr class="tbody_group_list">
                      <td>
                          <input v-model="info.delivery_product.order_product_delivery_request.abroad_order_num" type="text" :disabled="true">
                      </td>
                      <td colspan="3">
                          <input v-model="info.delivery_product.order_product_delivery_request.abroad_tracking_num" type="text" :disabled="true">
                      </td>
                      <td colspan="2">
                        <div class="body">
                          <span>{{ info.delivery_product.purchase_place }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr class="tbody_group_list">
                      <th colspan="4">국내 발송정보</th>
                      <th colspan="2" rowspan="2">배송유형</th>
                    </tr>
                    <tr class="tbody_group_list">
                      <th>택배사</th>
                      <th colspan="3">국내 운송장번호</th>
                    </tr>
                    <tr>
                      <td>
                        <select v-model="delivery_request.delivery_company" :disabled="true">
                          <option :value="null" selected>택배사 선택</option>
                          <option v-for="deliveryCompany in deliveryCompanyList" :value="deliveryCompany.key">
                            {{ deliveryCompany.value }}
                          </option>
                        </select>
                      </td>
                      <td colspan="3">
                          <input v-model="delivery_request.invoice_num" type="text" :disabled="true">
                      </td>
                      <td colspan="2">
                        <div class="body">
                          <span>{{ delivery_request.delivery_type_str }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr class="tbody_group_list">
                      <th>신청 품목</th>
                      <th>신청 제품명</th>
                      <th>신청 옵션</th>
                      <th>수량</th>
                      <th>신청 옵션 이미지</th>
                      <th>해외제품 원가</th>
                    </tr>
                    <tr class="tbody_group_list">
                      <td>
                        <div class="body">
                          <span>{{ info.delivery_product.item.kor_name }}</span>
                        </div>
                      </td>
                      <td>
                        <span>{{ info.delivery_product.eng_name }}</span>
                      </td>
                      <td>
                        <span>{{ info.delivery_product.option }}</span>
                      </td>
                      <td>
                        <div class="body">
                          <span>{{ info.delivery_product.amount | comma }}</span>
                        </div>
                      </td>
                      <td>
                      <span class="thumbnail_wrap">
                        <DefaultImage :imageUrl="info.delivery_product.option_image" />
                      </span>
                      </td>
                      <td>
                        <div class="body">
                          <span>{{ info.delivery_product.price | comma }}({{ info.delivery_product.currency_unit_iso }})</span>
                        </div>
                      </td>
                    </tr>
                    <tr class="tbody_group_list">
                      <th>해외 제품 링크</th>
                      <td colspan="5">
                        <div class="body">
                          <a :href="info.delivery_product.url" target="_blank" class="">{{ info.delivery_product.url }}</a>
                        </div>
                      </td>
                    </tr>
                  </template>

                  </tbody>
                </table>

                <!-- *** 신청 내역 END *** -->
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <SuperAdminFooter></SuperAdminFooter>
  </div>
</template>
<script src="@/assets/javascripts/super_admin/sales/amazic9/_id/index.js"></script>
