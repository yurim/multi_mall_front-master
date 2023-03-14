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
                <li class="page_title">배송비 템플릿 등록</li>
                <li>
                  <div class="title">템플릿명</div>
                  <div class="body"><input type="text" placeholder="내용을 입력하세요" v-model="delivery_info.name"></div>
                </li>

                <li>
                  <div class="title">묶음배송</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="deliveryGroup" id="isDeliveryGroupTrue" :value="true" v-model="isDeliveryGroup">
                      <label for="isDeliveryGroupTrue">가능</label>
                      <input type="radio" name="deliveryGroup" id="isDeliveryGroupFalse" :value="false" v-model="isDeliveryGroup" v-on:click="deleteDeliveryGroup">
                      <label for="isDeliveryGroupFalse">불가(개별계산)</label>
                    </div>
                    <div v-if="isDeliveryGroup === true">
                      <select v-model="selectedDeliveryGroup" v-on:change="setDeliveryGroup">
                        <option value="">선택</option>
                        <option v-for="item in delivery_group" :key="item.id" :value="item">{{ item.name }}</option>
                      </select>
                      <div>계산방식: {{ isSmaller }}</div>
                      <div>
                        <span>제주/도서산간 추가배송비 :</span>
                        <template v-if="selectedDeliveryGroup.is_country_mountain && selectedDeliveryGroup.country_mountain_deliveries"
                                  v-for="item in selectedDeliveryGroup.country_mountain_deliveries">
                          <span v-if="item.area_type === 'TOTAL'">제주 및 도서산간 : {{ item.additional_price | comma }}원 추가.</span>
                          <span v-if="item.area_type === 'JEJU'">제주 : {{ item.additional_price | comma }}원 추가.</span>
                          <span v-if="item.area_type === 'CNTRY_MNTN'">제주 외 도서산간 : {{ item.additional_price | comma }}원 추가.</span>
                        </template>
                        <template v-if="!(selectedDeliveryGroup.is_country_mountain && selectedDeliveryGroup.country_mountain_deliveries)">
                          <span>설정안함</span>
                        </template>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">배송비 유형</div>
                  <div class="body">
                    <select v-model="delivery_info.delivery_fee_type" v-on:change="resetDeliveryFeeType">
                      <option v-for="feeType in deliveryFeeType" :key="feeType.key" :value="feeType.key">{{ feeType.value }}</option>
                    </select>
                  </div>
                </li>

                <li v-if="delivery_info.delivery_fee_type !== 'FREE'"> <!-- 무료를 제외한 -->
                  <div class="title">기본 배송비</div>
                  <div class="body">
                    <div class="text_input_wrap">
                      <input type="number" placeholder="0" v-model="delivery_info.default_fee"><span>원</span>
                    </div>
                  </div>
                </li>

                <li v-if="delivery_info.delivery_fee_type !== 'FREE' && delivery_info.delivery_fee_type !== 'CHARGE'"> <!-- 조건부무료 -->
                  <div class="title">배송비 조건</div>
                  <div class="body" v-if="delivery_info.delivery_fee_type === 'CNDTN'">
                    <div>상품 판매가 합계(판매자가 설정한 할인판매가 + 옵션추가금액)</div>
                    <div class="text_input_wrap">
                      <input type="number" placeholder="0" v-model="delivery_info.condition_value">
                      <div>원 이상 무료</div>
                    </div>
                  </div>

                  <div class="body" v-if="delivery_info.delivery_fee_type === 'AMOUNT'"> <!-- 수량별 -->
                    <div class="text_input_wrap">
                      <input type="number" placeholder="0" v-model="delivery_info.condition_value"><span>개마다 기본배송비 반복 부과</span>
                    </div>
                  </div>

                  <div class="body" v-if="delivery_info.delivery_fee_type === 'AREA'"> <!-- 구간별 -->
                    <div class="text_input_wrap">
                      <input type="number" placeholder="0" v-model="delivery_info.condition_value"><span>개 까지 추가배송비없음</span>
                    </div>
                    <div class="text_input_wrap">
                      <span>초과 구매시 추가배송비</span>
                      <input type="number" placeholder="0" v-model="delivery_info.additional_fee"><span>원</span>
                    </div>
                  </div>
                </li>

                <!--                <li>-->
<!--                  <div class="title">기본템플릿</div>-->
<!--                  <div class="body">-->
<!--                    <div class="checkbox_wrap">-->
<!--                      <input type="checkbox" id="isDefault" v-model="delivery_info.is_default">-->
<!--                      <label for="isDefault">기본 템플릿으로 설정</label>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </li>-->
                <li>
                  <div class="title">배송방법</div>
                  <div class="body">
                    <select v-model="delivery_info.delivery_method" :disabled="delivery_info_for_delivery_group">
                      <option value="">선택</option>
                      <option v-for="method in deliveryMethod" :key="method.key" :value="method.key">{{ method.value }}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">배송비 지불방법</div>
                  <div class="body">
                    <div class="radio_wrap">
                    <template v-for="(method, i) in feePayMethod">
                      <input type="radio" name="feePayMethod" :id="method.key" :key="i" :value="method.key" v-model="delivery_info.fee_pay_method" :disabled="delivery_info_for_delivery_group">
                      <label :for="method.key" :key="method.key">{{ method.value }}</label>
                    </template>
                    </div>
                  </div>
                </li>

                <li v-if="!isDeliveryGroup">
                  <div class="title">제주/도서산간 추가 배송비</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="setMountainArea" id="isMountainAreaTrue" :value="true" v-model="isMountainAreaSetting">
                      <label for="isMountainAreaTrue">설정</label>
                      <input type="radio" name="setMountainArea" id="isMountainAreaFalse" :value="false" v-model="isMountainAreaSetting" v-on:click="deleteMountainArea">
                      <label for="isMountainAreaFalse">설정안함</label>
                      <a class="m_l_20 color_b under_line" v-on:click="popMountainousArea">도서산간지역 확인</a>
                    </div>
                    <div class="radio_wrap m_b_10" v-if="isMountainAreaSetting === true">
                      <span>배송권역</span>
                      <input type="radio" name="mountainArea" id="TOTAL" v-model="mountainArea" :value="'area-2'" v-on:click="mountainAreaType">
                      <label for="TOTAL">2권역</label>
                      <input type="radio" name="mountainArea" id="JEJU-CNTRY_MNTN" v-model="mountainArea" :value="'area-3'" v-on:click="mountainAreaType">
                      <label for="JEJU-CNTRY_MNTN">3권역</label>
                    </div>
                    <div class="text_input_wrap d_ib_100 m_t_0" v-for="(item, i) in country_mountain_delivery" :key="i">
                      <div v-if="item.area_type === 'TOTAL'">제주 및 도서산간 추가배송비</div>
                      <div v-else-if="item.area_type === 'JEJU'">제주 추가배송비</div>
                      <div v-else>제주 외 도서산간 추가배송비</div>
                      <input type="number" v-model="item.additional_price"><span>원</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">출고지(매장주소)</div>
                  <div class="body">
                    <div>
                      <span>[{{ delivery_info.departure_zipcode }}] {{ delivery_info.departure_address }} {{ delivery_info.departure_detail_address }}</span>
                      <span>
                        <a class="small_but_style" v-on:click="popAddress('departure')">주소 수정</a>
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">반품/교환 택배사</div>
                  <div class="body">
                    <select v-model="delivery_info.delivery_company">
                      <option value="">택배사 선택</option>
                      <option v-for="(item, i) in deliveryCompany" :key="i" :value="item.key">{{ item.value }}</option>
                    </select>
                  </div>
                </li>

                <li>
                  <div class="title">반품배송비(편도)</div>
                  <div class="body">
                    <div class="text_input_wrap">
                      <input type="number" placeholder="0" v-model="delivery_info.return_fee">
                      <span>원</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">교환배송비(왕복)</div>
                  <div class="body">
                    <div class="text_input_wrap">
                      <input type="number" placeholder="0" v-model="delivery_info.exchange_fee">
                      <span>원</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">반품/교환지</div>
                  <div class="body">
                    <span>[{{ delivery_info.arrival_zipcode }}] {{ delivery_info.arrival_address }} {{ delivery_info.arrival_detail_address }}</span>
                    <span>
                      <a class="small_but_style" v-on:click="popAddress('arrival')">주소 수정</a>
                    </span>
                  </div>
                </li>
              </ul>

              <div class="but_wrap text-center">
                <a @click="$router.go(-1)">취소</a>
                <a v-on:click.prevent="patchDelivery">저장</a>
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
<script src="@/assets/javascripts/store_admin/template/delivery/edit/_id/index.js"></script>
