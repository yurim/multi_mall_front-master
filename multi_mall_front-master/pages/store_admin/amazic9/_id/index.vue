<template>
  <client-only>
  <div class="adminWrap">
    <StoreAdminHeader></StoreAdminHeader>
    <StoreAdminSideNav></StoreAdminSideNav>
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
                    <th>주문번호</th>
                    <td>
                      <nuxt-link v-if="order.order_products.unordereds.length > 0"
                                 :to="`/store_admin/sales/${order.order_products.unordereds[0].order_num}`" class="text">
                        {{ order.order_num }}
                      </nuxt-link>
                      <nuxt-link v-else-if="order.order_products.ordereds.length > 0"
                                 :to="`/store_admin/sales/${order.order_products.ordereds[0].order_num}`" class="text">
                        {{ order.order_num }}
                      </nuxt-link>
                      <template v-else>{{ order.order_num }}</template>
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
                    <td>
                      <template v-if="order.order_products.ordereds.length > 0">
                        {{ order.order_products.ordereds[0].eng_name }}
                      </template>
                    </td>
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
                    <col width="30px">
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                  </colgroup>
                  <tbody class="tbody_group">
                  <template v-for="deliveryRequest in order.order_products.ordereds">
                    <template v-for="(info, infoIndex) in deliveryRequest.infos">
                      <tr>
                        <th></th>
                        <th>상품 주문번호</th>
                        <th colspan="2">주문한 상품명</th>
                        <th>주문한 상품옵션</th>
                        <th >주문한 상품 이미지</th>
                        <th>주문상태</th>
                        <th v-if="infoIndex < 1">신청정보</th>
                      </tr>
                      <tr class="tbody_group_list">
                        <td rowspan="6">
                          <div class="checkbox_wrap">
                            <input type="checkbox" disabled/>
                            <label></label>
                          </div>
                        </td>
                        <td>
                          <div class="body">
                            <nuxt-link :to="`/store_admin/sales/${info.order_product.order_num}`" class="text">
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
                          </div>
                        </td>
                        <td :rowspan="(deliveryRequest.infos.length * 7) - 1" v-if="infoIndex === 0">
                          <div class="price_title">신청번호: {{ deliveryRequest.amazic9_delivery_request_id }}</div>
                          <div class="price_wrap">
                            <div class="total">총 제품 수량: <span>{{ deliveryRequest.total_amount | comma }}</span></div>
                            <div class="cap" v-for="(value, key) in deliveryRequest.total_prices">
                              총액({{key}}): <span>{{ value | comma }}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr class="tbody_group_list">
                        <th>해외 주문번호</th>
                        <th colspan="2">해외 트레킹번호</th>
                        <th>구매처</th>
                        <th>배송유형</th>
                        <th>택배정보</th>
                      </tr>
                      <tr class="tbody_group_list">
                        <td>
                          <div class="body">
                            <span>{{ info.delivery_product.order_num }}</span>
                          </div>
                        </td>
                        <td>
                          <div class="input_but_wrap">
                            <input v-model="info.delivery_product.tracking_num" type="text">
                            <a @click="updateTrackingNum(info.delivery_product)">저장</a>
                          </div>
                        </td>
                        <td>
                          <div class="body">
                            <span>{{ info.delivery_product.purchase_place }}</span>
                          </div>
                        </td>
                        <td>
                          <div class="body">
                            <span>{{ deliveryRequest.delivery_type_str }}</span>
                          </div>
                        </td>
                        <td>
                          <div class="small_but_wrap">
                            <a @click="getCourier(deliveryRequest.delivery_request_id)">택배 정보보기</a>
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
                  </template>
                  </tbody>
                </table>

                <!-- *** 신청 내역 END *** -->
              </li>
              <!--  //신청 일때 -->
              <!--    미신청 일때 -->
              <li class="page_title">
                <div class="pull-left">미신청 내역</div>
              </li>
              <li>
                <!-- *** 미신청 내역 START *** -->
                <table v-for="(orderProduct, orderIndex) in order.order_products.unordereds" :key="orderProduct.id">
                  <colgroup>
                    <col width="30px">
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                  </colgroup>
                  <tbody class="tbody_group">
                  <tr class="tbody_group_list">
                    <th>
                      <div class="checkbox_wrap">
                      <template v-if="orderIndex === 0">
                        <input type="checkbox" :id="`allOrder${orderIndex}`" @click="allCheck($event, orderIndex)"/>
                        <label :for="`allOrder${orderIndex}`"></label>
                      </template>
                      </div>
                    </th>
                    <th>상품 주문번호</th>
                    <th colspan="2">주문한 상품명</th>
                    <th>주문한 상품옵션</th>
                    <th>주문한 상품 이미지</th>
                    <th>주문상태</th>
                    <th>신청정보</th>
                  </tr>
                  <tr class="tbody_group_list">
                    <td rowspan="6">
                      <div class="checkbox_wrap">
                        <input type="checkbox" :id="`orderProduct${orderProduct.id}`" :value="orderProduct.id" v-model="selected"/>
                        <label :for="`orderProduct${orderProduct.id}`"></label>
                      </div>
                    </td>
                    <td>
                      <div class="body">
                        <nuxt-link :to="`/store_admin/sales/${orderProduct.order_num}`" class="text">
                          {{ orderProduct.order_num }}
                        </nuxt-link>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="body">
                        <span>{{ (orderProduct.product) ? orderProduct.product.name : '-' }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="body">
                        <span>{{ orderProduct.product_option_names }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="thumbnail_wrap">
                        <DefaultImage :imageUrl="(orderProduct.product) ? orderProduct.product.main_image : null" alt="상품 이미지"/>
                      </span>
                    </td>
                    <td>
                      <div class="body">
                        <span>{{ orderProduct.order_status_str }}</span>
                      </div>
                    </td>
                    <td rowspan="6">
                      <div class="price_title">미신청</div>
                    </td>
                  </tr>
                  <tr class="tbody_group_list">
                    <th>해외 주문번호</th>
                    <th colspan="2">해외 트레킹번호</th>
                    <th>구매처</th>
                    <th>배송유형</th>
                    <th>택배정보</th>
                  </tr>
                  <tr class="tbody_group_list">
                    <td>
                      <div class="body">
                        <span>-</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="input_but_wrap">
                        -
                      </div>
                    </td>
                    <td>
                      <div class="body">
                        <span>-</span>
                      </div>
                    </td>
                    <td>
                      <div class="body">
                        <span>-</span>
                      </div>
                    </td>
                    <td>
                      <div class="small_but_wrap">
                        -
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
                        <span>-</span>
                      </div>
                    </td>
                    <td>
                      <span>-</span>
                    </td>
                    <td>
                      <span>-</span>
                    </td>
                    <td>
                      <div class="body">
                        <span>-</span>
                      </div>
                    </td>
                    <td>
                      <span class="thumbnail_wrap">
                        -
                      </span>
                    </td>
                    <td>
                      <div class="body">
                        <span>-</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="tbody_group_list">
                    <th>해외 제품 링크</th>
                    <td colspan="5">
                      <div class="body">
                        -
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <!-- *** 미신청 내역 END *** -->
              </li>
              <!--  //미신청 일때 -->
            </ul>
            <div class="but_wrap text-center">
              <button @click="selectedRequest">선택건 신청서 작성</button>
              <button @click="allRequest">미신청건 전체 신청서 작성</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <StoreAdminFooter></StoreAdminFooter>
  </div>
  </client-only>
</template>
<script src="@/assets/javascripts/store_admin/amazic9/_id/index.js"></script>
