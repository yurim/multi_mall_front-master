<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_three">
              <ul>
                <li class="page_title">
                  <div>상품상세</div>
                  <div class="pull-right">
                    <div class="but_wrap">
                      <nuxt-link class="line_but" to="/super_admin/product">목록</nuxt-link>
                      <a v-on:click="blockStatusChange">{{ productData.product.is_blocked ? '제재해제' : '상품제재'}}</a>
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
                  <div class="title">판매매장</div>
                  <div class="body">
                    <span>{{ store.name_kor }}</span>
                    <a :href="`/super_admin/store/${store.id}`" class="m_l_20 under_line color_b" target="_blank">
                      스토어어드민 바로가기
                    </a>
                  </div>
                </li>
                <li>
                  <div class="title">카테고리</div>
                  <div class="body">
                    <div class="category_list_wrap">
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
                  <div class="title">판매상태</div>
                  <div class="body">{{ productData.product.is_sale ? '판매중' : '판매중지' }}</div>
                </li>
                <li>
                  <div class="title">몰리에서 구매 가능 여부</div>
                  <div class="body">{{ productData.product.display_only ? '몰리에서 구매 불가' : '몰리에서 구매 가능' }}</div>
                </li>
                <li>
                  <div class="title">진열상태</div>
                  <div class="body">{{ productData.product.is_listed ? '전시중' : '전시중지' }}</div>
                </li>
                <li>
                  <div class="title">상품구분</div>
                  <div class="body">{{ commonCodes.target[productData.product.target] }}</div>
                </li>
                <li>
                  <div class="title">
                    가격비교 그룹<br>
                    매칭 대상 여부
                  </div>
                  <div class="body">
                    <span v-if="productData.product.can_price_group">매칭중</span>
                    <span v-else>매칭대상 제외</span>

                    <div class="small_btn_wrap">
                      <!-- TODO '매칭 상태관리'버튼 누르면 체크박스 CompareGroupConditionEdit 팝업 연결만 함 -->
                      <a href="javascript:;" class="line_but m_l_5" @click="priceGroupConditionChange">매칭 상태관리</a>
                    </div>
                  </div>
                </li>
                <li v-if="productData.product.can_price_group">
                  <div class="title">
                    현재 매칭된<br>
                    가격 비교그룹
                  </div>
                  <div class="body">
                    <div v-if="productData.product.product_price_group_id">{{ productData.product.product_price_group_id }}}</div>
                    <div v-else>미지정</div>
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
                  <div class="body">
                    {{ productData.product.abroad_price.price | comma }}
                    <span v-if="productData.product.abroad_price">
                      {{ productData.product.abroad_price.currency_unit.name }} ({{ productData.product.abroad_price.currency_unit.unit }})
                    </span>
                    <span v-if="abroadPriceInWon" class="m_l_10 color_gray_70">약 <b>{{ abroadPriceInWon | comma }}</b> 원</span>
                  </div>
                </li>
                <li>
                  <div class="title">몰리판매가/할인판매가<br>변동내역</div>
                  <div class="body">
                    <div class="max_h_xs border_b7 p_10" v-if="productData.modifiedPriceHistories && productData.modifiedPriceHistories.length > 0">
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
                <<li>
                  <div class="title">관리자 특가적용가</div>
                  <div class="body">10,000원 (초특가세일 이벤트 / 10%)</div>
                </li>
                <li>
                  <div class="title">관리자 특가<br>변동내역</div>
                  <div class="body">
                    <div class="max_h_xs border_b7 p_l_10 p_r_10">
                      <ul>
                        <li><span>2020.06.01</span><span>특가명</span><span>500원 할인</span><span>최종 판매가</span><span>11000원</span></li>
                        <li><span>2020.06.01</span><span>특가명</span><span>500원 할인</span><span>최종 판매가</span><span>11000원</span></li>
                        <li><span>2020.06.01</span><span>특가명</span><span>500원 할인</span><span>최종 판매가</span><span>11000원</span></li>
                        <li><span>2020.06.01</span><span>특가명</span><span>500원 할인</span><span>최종 판매가</span><span>11000원</span></li>
                      </ul>
                    </div>
                  </div>
                </li>
                -->
                <!-- <li>
                  <div class="title">이벤트 적용여부</div>
                  <div class="body">이벤트_1</div>
                </li> -->
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
                  <div class="body" v-if="productData.product.use_option_image">이미지 옵션</div>
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
                        <tr v-for="(composition, i) in productData.optionCompositions" v-bind:key="`composition_${i}`">
                          <td>{{ composition.id }}</td>
                          <td v-if="productData.product.use_option_image">
                            <template v-for="(optionValueId, j) in composition.option_value_ids">
                              <span class="thumbnail_wrap m_r_10" v-if="optionValueMap[optionValueId].image" v-bind:key="`optionValueImage_${i}_${j}`">
                                <DefaultImage :imageUrl="optionValueMap[optionValueId].image" />
                              </span>
                            </template>
                          </td>
                          <td v-for="(option, j) in productData.product.options" v-bind:key="`option_value_${i}_${j}`">
                            <span v-if="composition.option_values[option.id]">{{ composition.option_values[option.id].value }}</span>
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
                              <span class="thumbnail_wrap m_r_10" v-if="optionValueMap[optionValueId].image" v-bind:key="`optionValueImage_${i}_${j}`">
                                <DefaultImage :imageUrl="optionValueMap[optionValueId].image" />
                              </span>
                            </template>
                          </td>
                          <template v-for="(optionValueId, j) in composition.option_value_ids">
                            <td v-bind:key="`optionName_${j}`">{{ optionMap[optionValueMap[optionValueId].option_id].name }}</td>
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
                  <div class="body margin-right-last-0">
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
                    <span>{{ setDeliveryInfo | comma }}</span>
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
                        <th>사유 수정</th>
                      </tr>
                    </thead>
                    <tbody>
                    <template v-if="productData.productBlockHistories && productData.productBlockHistories.length > 0">
                      <tr v-for="pbh in productData.productBlockHistories" v-bind:key="pbh.id">
                        <td>{{ pbh.createdAt }}</td>
                        <td>{{ pbh.reason }}</td>
                        <td>
                          <a class="small_but_style m_l_10" v-on:click="btnEditReason(pbh.id)">수정</a>
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr>
                        <td colspan="3">조회된 제재내역이 존재하지 않습니다.</td>
                      </tr>
                    </template>
                    </tbody>
                  </table>
                </li>
              </ul>

              <div class="but_wrap text-center">
                <nuxt-link class="line_but" to="/super_admin/product">목록</nuxt-link>
                <a v-on:click="blockStatusChange">{{ productData.product.is_blocked ? '제재해제' : '상품제재'}}</a>
              </div>

            </div>
          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/super_admin/product/_id/index.js"></script>
