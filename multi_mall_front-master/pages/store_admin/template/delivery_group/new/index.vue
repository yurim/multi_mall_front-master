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
                <li class="page_title"><div>묶음배송그룹 템플릿 등록</div></li>
                <li>
                  <div class="title">템플릿명</div>
                  <div class="body"><input type="text" v-model="delivery_group.name" placeholder="내용을 입력하세요."></div>
                </li>
                <li>
                  <div class="title">배송방법</div>
                  <div class="body">
                    <div class="checkbox_wrap">
                      <input type="checkbox" id="isDefault" v-model="delivery_group.is_default">
                      <label for="isDefault">기본 템플릿으로 설정</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">묶음배송</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="isSmaller" id="isSmallerTrue" :value="true" v-model="delivery_group.is_smaller">
                      <label for="isSmallerTrue">묶음 그룹에서 가장 작은 배송비로 부과</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">제주/도서산간 추가 배송비</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="setMountainArea" id="isMountainAreaTrue" :value="true" v-model="delivery_group.is_country_mountain">
                      <label for="isMountainAreaTrue">설정</label>
                      <input type="radio" name="setMountainArea" id="isMountainAreaFalse" :value="false" v-model="delivery_group.is_country_mountain" v-on:click="deleteMountainArea">
                      <label for="isMountainAreaFalse">설정안함</label>
                      <a class="m_l_20 color_b under_line" v-on:click="popMountainousArea">도서산간지역 확인</a>
                    </div>
                    <div class="radio_wrap m_b_10" v-if="delivery_group.is_country_mountain === true">
                      <span>배송권역</span>
                      <input type="radio" name="mountainArea" id="TOTAL" v-on:click="mountainAreaType">
                      <label for="TOTAL">2권역</label>
                      <input type="radio" name="mountainArea" id="JEJU-CNTRY_MNTN" v-on:click="mountainAreaType">
                      <label for="JEJU-CNTRY_MNTN">3권역</label>
                    </div>
                    <div class="text_input_wrap d_ib_100 m_t_0" v-for="(item, i) in country_mountain_delivery" :key="i">
                      <div v-if="item.area_type === 'TOTAL'">제주 및 도서산간 추가배송비</div>
                      <div v-else-if="item.area_type === 'JEJU'">제주 추가배송비</div>
                      <div v-else>제주 외 도서산간 추가배송비</div>
                      <input type="number" v-model="item.additional_price" placeholder="0"><span>원</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="but_wrap text-center">
                <nuxt-link class="line_but" to="/store_admin/template/delivery_group">목록</nuxt-link>
                <a v-on:click="createDeliveryGroup">등록</a>
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
<script src="@/assets/javascripts/store_admin/template/delivery_group/new/index.js"></script>
