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
                <li class="page_title">
                  <div>상품상세</div>
                  <div class="pull-right">
                    <div class="but_wrap">
                      <nuxt-link class="line_but" to="/store_admin/product">목록</nuxt-link>
                      <nuxt-link :to="`/store_admin/product/edit/${productData.product.id}`">수정</nuxt-link>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">상품코드</div>
                  <div class="body">{{ productData.product.id }}</div>
                </li>
                <li>
                  <div class="title">상품보기</div>
                  <div class="body">
                    <span class="square_but_wrap">
                      <a type="button" class="line_but" v-if="productData.product.is_blocked">링크</a>
                      <nuxt-link :to="`/product/${productData.product.id}`" class="line_but" v-else>링크</nuxt-link>
                    </span>
                  </div>
                </li>
                <li>
                  <div class="title">카테고리</div>
                  <div class="body">
                    <div class="category_list_wrap p_t_0">
                      <span>선택한 카테고리 : </span>
                      <ul>
                        <template v-for="name in productData.product.category.path">
                          <li :key="`categoryName_${name}`" v-if="name !== 'ROOT'">{{ name }}</li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">상품명</div>
                  <div class="body">{{ productData.product.name }}</div>
                </li>
                <li>
                  <div class="title">판매수량</div>
                  <div class="body">
                    <span>해외 : <em>{{ productData.product.abroad_total_sale_count | comma }}</em>개 판매 / </span>
                    <span>국내 : <em>{{ productData.product.sale_count | comma }}</em>개 판매 </span>
                  </div>
                </li>
                <li>
                  <div class="title">진열상태</div>
                  <div class="body">{{ productData.product.is_listed ? '전시중' : '전시중지' }}</div>
                </li>
                <li>
                  <div class="title">판매상태</div>
                  <div class="body">{{ productData.product.is_sale ? '판매중' : '판매중지' }}</div>
                </li>
                <li>
                  <div class="title">몰리에서 구매 가능 여부</div>
                  <div class="body">{{ productData.product.display_only ? '몰리에서 구매 불가' : '몰리에서 구매 가능' }}</div>
                </li>
                <li>
                  <div class="title">상품구분</div>
                  <div class="body">{{ commonCodes.target[productData.product.target] }}</div>
                </li>
                <li>
                  <div class="title">해외상품여부</div>
                  <div class="body">{{ productData.product.is_abroad ? '해외상품' : '국내상품' }}</div>
                </li>
                <li>
                  <div class="title">
                    가격비교 그룹<br>
                    매칭 대상 여부
                  </div>
                  <div class="body">
                    <span v-if="productData.product.can_price_group">매칭대상 설정중</span>
                    <span v-else>매칭대상 제외</span>

                    <div class="small_btn_wrap">
                      <a href="javascript:;" class="line_but m_l_5" @click="priceGroupConditionChange">매칭 여부관리</a>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">
                    현재 매칭된<br>
                    가격 비교 그룹
                  </div>
                  <div class="body">
                    <span v-if="productData.product.product_price_group_id">{{ productData.product.product_price_group_id }}</span>
                    <span v-else>미지정</span>
                  </div>
                </li>
                <li v-if="productData.product.detail_url">
                  <div class="title">크롤링 링크</div>
                  <div class="body">
                    <a class="color_b under_line" :href="productData.product.detail_url" target="_blank">{{ productData.product.detail_url }}</a>
                  </div>
                </li>
                <li v-if="productData.product.affiliate_url">
                  <div class="title">어필리에이트 링크</div>
                  <div class="body">
                    <a class="color_b under_line" :href="productData.product.affiliate_url" target="_blank">{{ productData.product.affiliate_url }}</a>
                  </div>
                </li>
                <li v-if="!productData.product.display_only">
                  <div class="title">몰리판매가</div>
                  <div class="body">{{ productData.product.price | comma }}원</div>
                </li>
                <li v-if="!productData.product.display_only">
                  <div class="title">몰리 할인판매가</div>
                  <div class="body">
                    <span class="color_main_01" v-if="productData.product.discount_price">
                      {{ productData.product.discount_price | comma }}원
                    </span>
                  </div>
                </li>
                <li v-if="productData.product.abroad_price">
                  <div class="title">직접구매가</div>
                  <div class="body">{{ productData.product.abroad_price.price | comma }}
                    <span>
                      {{ productData.product.abroad_price.currency_unit.name }} ({{ productData.product.abroad_price.currency_unit.unit }})
                    </span>
                    <span v-if="abroadPriceInWon" class="m_l_10 color_gray_70">약 <b>{{ abroadPriceInWon | comma }}</b> 원</span>
                  </div>

                </li>
                <li>
                  <div class="title">옵션추가금액 적용 방식</div>
                  <div class="body small_btn_wrap border_active_wrap">
                    <a class="" :class="{ active: isMinusOptionPrice }" @click="isMinusOptionPrice = true">마이너스 옵션값으로만 적용</a>
                    <a class="" :class="{ active: !isMinusOptionPrice }" @click="isMinusOptionPrice = false">플러스 옵션값으로만 적용</a>
                    <a @click="updateOptionPrice">적용</a>
                  </div>
                </li>
                <li v-if="productData.modifiedPriceHistories && productData.modifiedPriceHistories.length > 0">
                  <div class="title">몰리판매가/할인판매가<br>변동내역</div>
                  <div class="body">
                    <div class="max_h_xs border_b7 p_10">
                      <ul>
                        <template v-for="mph in productData.modifiedPriceHistories">
                          <li :key="`modifiedPriceHistory_${mph.id}`">
                            <span>{{ mph.createdAt }}</span> / <span>몰리판매가: {{ mph.price | comma }}원</span> /
                            <span>할인판매가: {{(mph.discountPrice ? mph.discountPrice : '-') | comma }}원</span>
                          </li>
                        </template>
                      </ul>
                    </div>
                  </div>
                </li>
                <!--
                <li>
                  <div class="title">관리자 특가 변동내역</div>
                  <div class="body">10,000원 (초특가세일 이벤트 / 10%)</div>
                </li>
                <li>
                  <div class="title">관리자 특가 변동내역</div>
                  <div class="body">
                    <div class="max_h_xs border_b7 p_10">
                      <ul>
                        <li><span>2020.06.01</span> / <span>특가명</span> / <span>500원 할인</span> / <span>최종 판매가 11000원</span></li>
                        <li><span>2020.06.01</span> / <span>특가명</span> / <span>500원 할인</span> / <span>최종 판매가 11000원</span></li>
                      </ul>
                    </div>
                  </div>
                </li>
                -->
                <li>
                  <div class="title">포인트 적립율</div>
                  <div class="body">
                    {{ commonCodes.saving_type[productData.product.saving_type] }}
                    <span v-if="productData.product.saving_type === 'DRCT'">{{ productData.product.saving_rate }}</span>
                  </div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>옵션정보</div></li>
                <li>
                  <div class="title">옵션사용 여부</div>
                  <div class="body">{{ commonCodes.option_type[productData.product.option_type] }}</div>
                </li>
                <li v-if="productData.product.option_type !== 'NONE'">
                  <div class="title">옵션유형</div>
                  <div class="body square_but_wrap" v-if="productData.product.use_option_image">
                    <span>이미지 옵션</span>
                    <a class="gray_but" v-on:click="setOptionImage">이미지 수정</a>
                  </div>
                  <div class="body" v-if="!productData.product.use_option_image">일반 옵션</div>
                </li>
                <li v-if="productData.product.option_type !== 'NONE'">
                  <div class="title">옵션 목록</div>
                  <div class="body">
                    <!-- 조합형 -->
                    <table v-if="productData.product.option_type === 'ASSCTN'">
                      <colgroup>
                        <col width="130" />
                        <!-- 이미지 옵션의 경우 -->
                        <col width="100" v-if="productData.product.use_option_image" />
                        <!-- 옵션명 개수에 따라 col 추가-->
                        <col v-for="(option, i) in productData.product.options" v-bind:key="`optionCol_${i}`" />
                        <!-- 고정되어야할 col-->
                        <col width="130" />
                        <col width="130" />
                        <col width="100" />
                        <col width="100" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th rowspan="2">옵션 코드</th>
                          <!-- 옵션명 개수에 따라 colspan 숫자 변경-->
                          <th :colspan="productData.product.use_option_image ? productData.product.options.length + 1 : productData.product.options.length">옵션명</th>
                          <th rowspan="2">옵션가 추가금액</th>
                          <th rowspan="2">재고관리 여부</th>
                          <th rowspan="2">재고수량</th>
                          <th rowspan="2">사용여부</th>
                        </tr>
                        <tr>
                          <!-- 옵션명 개수에 따라 th 추가 -->
                          <th v-if="productData.product.use_option_image">옵션이미지</th>
                          <th v-for="(option, i) in productData.product.options" v-bind:key="`optionName_${i}`">{{ option.name }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(composition, i) in product.option_compositions" v-bind:key="`composition_${i}`">
                          <td>{{ composition.id }}</td>
                          <td v-if="productData.product.use_option_image">
                            <template v-for="(option_value, j) in composition.option_values">
                              <span v-if="optionValueImageMap[`${option_value.option.id}_${option_value.id}`]" v-bind:key="`option_value_image_${j}`" class="thumbnail_wrap m_r_10">
                                <img v-bind:src="optionValueImageMap[`${option_value.option.id}_${option_value.id}`].image" v-bind:id="`option_value_image_${j}`" />
                              </span>
                            </template>
                          </td>
                          <td v-for="(option, j) in productData.product.options" v-bind:key="`option_value_${i}_${j}`">
                            <span v-if="composition.option_values[option.id]">{{ composition.option_values[option.id].name }}</span>
                            <span v-else>-</span>
                          </td>
                          <td>{{ composition.additional_price | comma }}원</td>
                          <td>{{ composition.is_inventory_managed ? 'Y' : 'N' }}</td>
                          <td>{{ composition.inventory_amount | comma }}개</td>
                          <td>{{ composition.is_available ? 'Y' : 'N' }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <!-- 단독형 이미지 옵션 -->
                    <table v-if="productData.product.option_type === 'STDALN'">
                      <colgroup>
                        <col width="130" />
                        <col v-if="productData.product.use_option_image" width="40" />
                        <!-- 옵션명 개수에 따라 col 추가-->
                        <col />
                        <col />
                        <!-- 고정되어야할 col-->
                        <col width="130" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>옵션 코드</th>
                          <th v-if="productData.product.use_option_image">옵션이미지</th>
                          <th>옵션명</th>
                          <th>옵션값</th>
                          <th>사용여부</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(composition, i) in productData.optionCompositions" v-bind:key="`composition_${i}`">
                          <td>{{ composition.id }}</td>
                          <td v-if="productData.product.use_option_image">
                            <template v-for="(optionValueId, j) in composition.option_value_ids">
                              <span class="thumbnail_wrap m_r_10" v-if="optionValueMap[optionValueId] && optionValueMap[optionValueId].image" v-bind:key="`optionValueImage_${i}_${j}`">
                                <DefaultImage :imageUrl="optionValueMap[optionValueId].image" />
                              </span>
                            </template>
                          </td>
                          <template v-for="(optionValueId, j) in composition.option_value_ids">
                            <td v-bind:key="`optionName_${j}`">{{ optionMap[optionValueMap[optionValueId].product_option_id].name }}</td>
                            <td v-bind:key="`optionValue_${j}`">{{ optionValueMap[optionValueId].value }}</td>
                          </template>
                          <td>{{ composition.is_available ? 'Y' : 'N' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </li>
<!--                <li>-->
<!--                  <div class="title">옵션이미지 노출 여부</div>-->
<!--                  <div class="body">{{ product.product.is_show_option_image ? '노출함' : '노출안함' }}</div>-->
<!--                </li>-->
              </ul>

              <ul>
                <li class="page_title"><div>상품이미지</div></li>
                <li>
                  <div class="title">대표이미지</div>
                  <div class="body">
                    <span class="thumbnail_wrap">
                      <DefaultImage :imageUrl="productData.product.main_image" />
                    </span>
                  </div>
                </li>
                <li>
                  <div class="title">추가이미지<br />({{ additionalImagesCount }}/{{ additionalImageMaxCount }})</div>
                  <div class="body지 margin-right-last-0">
                    <span class="thumbnail_wrap" v-for="(image, i) in additionaImages" v-bind:key="`addition_image_${i}`">
                      <DefaultImage :imageUrl="image" />
                    </span>
                  </div>
                </li>
                <li>
                  <div class="title">상세이미지/설명</div>
                  <div class="body">
                    <div class="editor_show_wrap">
                      <client-only>
                        <SummernoteEditor
                          :preview="true"
                          :detailContent="productData.product.content"
                          :detailImageArr="productData.product.detail_images"
                        />
                      </client-only>
                    </div>
                  </div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>배송정보</div></li>
                <li>
                  <div class="title">배송비</div>
                  <div class="body">
                    <a class="small_but_style pull-right" v-on:click="showDeliveryInfo = !showDeliveryInfo">상세보기</a>
                  </div>
                </li>
              </ul>

              <!-- 상세보기 클릭시 ul 나옴 -->
              <ul v-show="showDeliveryInfo">
                <li>
                  <div class="title">배송방법</div>
                  <div class="body">{{ commonCodes.delivery_method && commonCodes.delivery_method[productData.deliveryInfo.delivery_method] ? commonCodes.delivery_method[productData.deliveryInfo.delivery_method] : '-' }}</div>
                </li>
                <li>
                  <div class="title">배송비 지불 방법</div>
                  <div class="body">{{ commonCodes.fee_pay_method && commonCodes.fee_pay_method[productData.deliveryInfo.fee_pay_method] ? commonCodes.fee_pay_method[productData.deliveryInfo.fee_pay_method] : '-' }}</div>
                </li>
                <li>
                  <div class="title">묶음배송가능여부</div>
                  <div class="body">{{ productData.deliveryInfo.delivery_group_id ? '가능' : '불가' }}</div>
                </li>
                <li v-if="productData.deliveryGroup">
                  <div class="title">묶음배송</div>
                  <div class="body">
                    <div>적용템플릿 : <b>{{ productData.deliveryGroup.name }}</b></div>
                    계산방식: {{ productData.deliveryGroup.is_smaller ? '묶음그룹에서 가장 작은 배송비로 부과' : '묶음 그룹에서 가장 큰 배송비로 부과'}}<br/>
                    제주/도서산간 추가배송비 : {{ productData.deliveryGroup && productData.deliveryGroup.is_country_mountain ? '설정': '설정안함' }}
                  </div>
                </li>
                <li>
                  <div class="title">배송비 유형</div>
                  <div class="body">{{ commonCodes.delivery_fee_type && commonCodes.delivery_fee_type[productData.deliveryInfo.delivery_fee_type] ? commonCodes.delivery_fee_type[productData.deliveryInfo.delivery_fee_type] : '-' }}</div>
                </li>

                <li v-if="productData.deliveryInfo.delivery_fee_type !== 'FREE'">
                  <div class="title">기본 배송비</div>
                  <div class="body">
                    <span>{{ productData.deliveryInfo.default_fee | comma }}원</span>
                  </div>
                </li>

                <li v-if="productData.deliveryInfo.delivery_fee_type && !['FREE', 'CHARGE'].includes(productData.deliveryInfo.delivery_fee_type)">
                  <div class="title">배송비 조건</div>
                  <div class="body" v-if="productData.deliveryInfo.delivery_fee_type === 'CNDTN'">
                    <div>상품 판매가 합계(판매자가 설정한 할인 판매가 + 옵션 추가 금액)</div>
                    <div class="color_main_01">{{ productData.deliveryInfo.condition_value | comma }} 원 이상 무료</div>
                  </div>

                  <div class="body" v-if="productData.deliveryInfo.delivery_fee_type === 'AMOUNT'">
                    <div class="color_main_01">{{ productData.deliveryInfo.condition_value | comma }}개마다 기본배송비 반복 부과</div>
                  </div>

                  <div class="body" v-if="productData.deliveryInfo.delivery_fee_type === 'AREA'">
                    <div class="color_main_01"><b>2구간</b></div>
                    <div>
                      <span class="color_main_01">{{ productData.deliveryInfo.condition_value | comma }}</span>개 까지 추가배송비 없음
                    </div>
                    <div>
                      초과 구매시 추가 배송비 :
                      <span class="color_main_01">{{ productData.deliveryInfo.additional_fee | comma }}원</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">제주/도서산간 추가 배송비</div>
                  <div class="body" v-if="productData.deliveryInfo.country_mountain_deliveries && productData.deliveryInfo.country_mountain_deliveries.length > 0">
                    <div>설정</div>
                    <div>배송권역 : <span class="color_main_01">{{ countryMountainDeliveriesMap['TOTAL'] ? 2 : 3}}권역</span></div>

                    <div v-if="countryMountainDeliveriesMap['TOTAL']">
                      제주 및 도서산간 추가 배송비 : <span class="color_main_01">{{ countryMountainDeliveriesMap['TOTAL'].additional_price | comma}}원</span>
                    </div>

                    <template v-else>
                      <div>제주 추가 배송비 : <span class="color_main_01">{{ countryMountainDeliveriesMap['JEJU'].additional_price | comma }}원</span></div>
                      <div>제주 외 도서산간 추가 배송비 : <span class="color_main_01">{{ countryMountainDeliveriesMap['CNTRY_MNTN'].additional_price | comma }}원</span></div>
                    </template>
                  </div>
                  <div class="body" v-else><div>설정안함</div></div>
                </li>

                <li>
                  <div class="title">출고지(매장주소)</div>
                  <div class="body">
                    <span>({{ productData.deliveryInfo.departure_zipcode }}) {{ productData.deliveryInfo.departure_address }} {{ productData.deliveryInfo.departure_detail_address }}</span>
                  </div>
                </li>
                <li>
                  <div class="title">반품/교환 택배사</div>
                  <div class="body">{{ commonCodes.delivery_company && commonCodes.delivery_company[productData.deliveryInfo.delivery_company] ? commonCodes.delivery_company[productData.deliveryInfo.delivery_company] : '-' }}</div>
                </li>
                <li>
                  <div class="title">반품배송비(편도)</div>
                  <div class="body">
                    <span>{{ productData.deliveryInfo.return_fee | comma }}원</span>
                  </div>
                </li>
                <li>
                  <div class="title">반품배송비(왕복)</div>
                  <div class="body">
                    <span>{{ productData.deliveryInfo.exchange_fee | comma }}원</span>
                  </div>
                </li>
                <li>
                  <div class="title">반품/교환지</div>
                  <div class="body">
                    <span>({{ productData.deliveryInfo.arrival_zipcode }}) {{ productData.deliveryInfo.arrival_address }} {{ productData.deliveryInfo.arrival_detail_address }}</span>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">배송정보고시</div>
                  <div class="body">
                    <span>{{ templates.deliveryNoticeTemplate ? templates.deliveryNoticeTemplate.name : '-' }}</span>
                    <a class="small_but_style m_l_10" v-if="templates.deliveryNoticeTemplate" v-on:click="popTerms(templates.deliveryNoticeTemplate)">상세보기</a>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">교환/반품 정보고시</div>
                  <div class="body">
                    <span>{{ templates.exchangeRefundTemplate ? templates.exchangeRefundTemplate.name : '-' }}</span>
                    <a class="small_but_style m_l_10" v-on:click="popTerms(templates.exchangeRefundTemplate)">상세보기</a>
                  </div>
                </li>
              </ul>

              <ul v-if="productData.product.is_show_abroad_template">
                <li>
                  <div class="title">해외상품정보고시</div>
                  <div class="body margin-right-last-0">
                    <a class="small_but_style" v-on:click="popTerms(templates.abroadProductTopNotice)">상단 상세보기</a>
                    <a class="small_but_style" v-on:click="popTerms(templates.abroadProductBottomNotice)">하단 상세보기</a>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">상품 정보고시</div>
                  <div class="body">
                    <span>{{ templates.productNoticeTemplate ? templates.productNoticeTemplate.name : '-' }}</span>
                    <a class="small_but_style m_l_10" v-on:click="popTerms(templates.productNoticeTemplate)">상세보기</a>
                  </div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>상품제재</div></li>
                <li>
                  <table>
                    <thead>
                      <tr>
                        <th>일시</th>
                        <th>제재사유</th>
                      </tr>
                    </thead>
                    <tbody>
                    <template v-if="productData.productBlockHistories && productData.productBlockHistories.length > 0">
                    <tr v-for="pbh in productData.productBlockHistories" v-bind:key="pbh.id">
                      <th>{{ pbh.createdAt }}</th>
                      <th>{{ pbh.reason }}</th>
                    </tr>
                    </template>
                    <template v-else>
                      <tr>
                        <td colspan="2">조회된 제재내역이 존재하지 않습니다.</td>
                      </tr>
                    </template>
                    </tbody>
                  </table>
                </li>
              </ul>

              <div class="but_wrap text-center">
                <nuxt-link class="line_but" to="/store_admin/product">목록</nuxt-link>
                <nuxt-link :to="`/store_admin/product/edit/${productData.product.id}`">수정</nuxt-link>
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
<script src="@/assets/javascripts/store_admin/product/_id/index.js"></script>
