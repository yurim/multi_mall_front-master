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

              <ul>
                <li class="page_title">배송비 템플릿 상세</li>
                <li>
                  <div class="title">템플릿명</div>
                  <div class="body">{{ deliveryInfo.name }}</div>
                </li>
<!--                <li>-->
<!--                  <div class="title">기본 배송비템플릿 설정여부</div>-->
<!--                  <div class="body">설정 or 미설정</div>-->
<!--                </li>-->
                <li>
                  <div class="title">배송방법</div>
                  <div class="body">{{ deliveryInfo.delivery_method_str }}</div>
                </li>
                <li>
                  <div class="title">배송비 지불방법</div>
                  <div class="body">{{ deliveryInfo.fee_pay_method_str }}</div>
                </li>
                <li>
                  <div class="title">묶음배송</div>
                  <div class="body" v-if="deliveryInfo.delivery_group">
                    <div>적용템플릿: {{ deliveryInfo.delivery_group.name }}</div>
                    <div class="color_main_01">
                      계산방식: {{ deliveryInfo.delivery_group.is_smaller ? '묶음 그룹에서 가장 작은 배송비로 부과' : '묶음 그룹에서 가장 큰 배송비로 부과' }}<br>
                      제주/도서산간 추가배송비 :
                      <template v-if="deliveryInfo.delivery_group.is_country_mountain && deliveryInfo.country_mountain_deliveries"
                                v-for="item in deliveryInfo.country_mountain_deliveries">
                        <span v-if="item.area_type === 'TOTAL'">제주 및 도서산간 : {{ item.additional_price | comma }}원 추가.</span>
                        <span v-if="item.area_type === 'JEJU'">제주 : {{ item.additional_price | comma }}원 추가.</span>
                        <span v-if="item.area_type === 'CNTRY_MNTN'">제주 외 도서산간 : {{ item.additional_price | comma }}원 추가.</span>
                      </template>
                      <template v-if="!(deliveryInfo.delivery_group.is_country_mountain && deliveryInfo.country_mountain_deliveries)">
                        <span>설정안함</span>
                      </template>
                    </div>
                  </div>
                  <div class="body" v-else>
                    <div>적용 안함</div>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">배송비 유형</div>
                  <div class="body">{{ deliveryInfo.delivery_fee_type_str }}</div>
                </li>
                <li v-if="deliveryInfo.delivery_fee_type !== 'FREE'">
                  <div class="title">기본 배송비</div>
                  <div class="body">{{ deliveryInfo.default_fee | comma }}원</div>
                </li>
                <li v-if="['CNDTN', 'AMOUNT', 'AREA'].indexOf(deliveryInfo.delivery_fee_type) >= 0">
                  <div class="title">배송비 조건</div>
                  <div class="body">
                    <template v-if="deliveryInfo.delivery_fee_type === 'CNDTN'">
                      <div>{{ deliveryInfo.condition_value | comma }}원 이상 무료</div>
                      <div>상품 판매가 합계(판매자가 설정한 할인판매가 + 옵션추가금액)</div>
                    </template>
                    <template v-else-if="deliveryInfo.delivery_fee_type === 'AMOUNT'">
                      <div>{{ deliveryInfo.condition_value | comma }}개마다 기본배송비 반복 부과</div>
                    </template>
                    <template v-else-if="deliveryInfo.delivery_fee_type === 'AREA'">
                      <div>{{ deliveryInfo.condition_value | comma }}개 까지 추가배송비 없음</div>
                      <div>초과 구매 시 추가배송비 {{ deliveryInfo.additional_fee | comma }}원</div>
                    </template>
                  </div>
                </li>
              </ul>

              <ul v-if="!deliveryInfo.delivery_group">
                <li>
                  <div class="title">제주/도서산간 추가 배송비</div>
                  <div class="body">
                    <template v-if="deliveryInfo.country_mountain_deliveries && deliveryInfo.country_mountain_deliveries.length > 0">
                      <div>배송권역: {{ deliveryInfo.country_mountain_deliveries.length > 1 ? '3권역' : '2권역' }}</div>
                      <template v-for="item in deliveryInfo.country_mountain_deliveries">
                        <div v-if="item.area_type === 'TOTAL'">제주 및 도서산간 추가배송비 : {{ item.additional_price | comma }}원</div>
                        <div v-if="item.area_type === 'JEJU'">제주 추가배송비 : {{ item.additional_price | comma }}원</div>
                        <div v-if="item.area_type === 'CNTRY_MNTN'">제주 외 도서산간 추가배송비 : {{ item.additional_price | comma }}원</div>
                      </template>
                    </template>
                    <template v-else>
                      <div>설정안함</div>
                    </template>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">출고지(매장주소)</div>
                  <div class="body">[{{ deliveryInfo.departure_zipcode}}] {{ deliveryInfo.departure_address }} {{ deliveryInfo.departure_detail_address}}</div>
                </li>
                <li>
                  <div class="title">반품/교환 택배사</div>
                  <div class="body">{{ deliveryInfo.delivery_company_str }}</div>
                </li>
                <li>
                  <div class="title">반품배송비(편도)</div>
                  <div class="body">{{ deliveryInfo.return_fee | comma }}원</div>
                </li>
                <li>
                  <div class="title">반품배송비(왕복)</div>
                  <div class="body">{{ deliveryInfo.exchange_fee | comma }}원</div>
                </li>
                <li>
                  <div class="title">반품/교환지</div>
                  <div class="body">[{{ deliveryInfo.arrival_zipcode}}] {{ deliveryInfo.arrival_address }} {{ deliveryInfo.arrival_detail_address }}</div>
                </li>
              </ul>

              <div class="but_wrap text-center">
                <nuxt-link class="line_but" to="/store_admin/template/delivery">목록</nuxt-link>
                <nuxt-link :to="`/store_admin/template/delivery/edit/${deliveryInfo.id}`">수정</nuxt-link>
                <a class="pull-right" @click="deleteDelivery">삭제</a>
              </div>

            </div>
          </div>
        </div>
      </div>
      <StoreAdminFooter></StoreAdminFooter>
    </div>
  </div>
  </client-only>
</template>
<script src="@/assets/javascripts/store_admin/template/delivery/_id/index.js"></script>
