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
              <ul class="table_wrap">
                <li class="page_title">
                  <div>묶음배송그룹 템플릿 상세</div>
                </li>
                <li>
                  <div class="title">템플릿명</div>
                  <div class="body">{{ deliveryGroup.name }}</div>
                </li>
                <li>
                  <div class="title">기본그룹 설정여부</div>
                  <div class="body">{{ deliveryGroup.is_default ? '설정' : '미설정' }}</div>
                </li>
                <li>
                  <div class="title">묶음배송</div>
                  <div class="body">묶음 그룹에서 가장 {{ deliveryGroup.is_smaller ? '작은' : '큰' }} 배송비로 부과 </div>
                </li>
                <li>
                  <div class="title">제주/도서산간 추가 배송비</div>
                  <div class="body">
                    <template v-if="deliveryGroup.country_mountain_deliveries && deliveryGroup.country_mountain_deliveries.length > 0">
                      <div>배송권역: {{ deliveryGroup.area_num === 3 ? '3권역' : '2권역' }}</div>
                      <template v-for="item in deliveryGroup.country_mountain_deliveries">
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
              <div class="but_wrap text-center">
                <nuxt-link class="line_but" to="/store_admin/template/delivery_group">목록</nuxt-link>
                <nuxt-link :to="`/store_admin/template/delivery_group/edit/${deliveryGroup.id}`">수정</nuxt-link>
                <a class="pull-right" v-on:click="deleteDeliveryGroup">삭제</a>
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
<script src="@/assets/javascripts/store_admin/template/delivery_group/_id/index.js"></script>
