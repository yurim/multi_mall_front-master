<template>
  <client-only>
  <div class="adminWrap">
    <div class="body_wrap">
      <StoreAdminHeader></StoreAdminHeader>
      <StoreAdminSideNav></StoreAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_one">
              <div class="table_wrap">
                <table>
                  <colgroup>
                    <col width="110">
                    <col>
                  </colgroup>
                  <tbody>
                  <!-- *** 카테고리 START *** -->
                  <tr>
                    <th>카테고리</th>
                    <td>
                      <div class="even_child_wrap">
                        <select v-for="(categories, i) in copiedItems" v-bind:key="i"
                                v-model="selectedCategories[i]"
                                @change="selectedCategory(i)">
                          <option value="" selected>선택</option>
                          <option v-for="item in categories" v-bind:key="item.name"
                                  :value="item">{{ item.name }}</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 카테고리 END *** -->

                  <!-- *** 판매상태 START *** -->
                  <tr>
                    <th>판매상태</th>
                    <td>
                      <div class="radio_wrap">
                        <input type="radio" id="is_sale_true" :value="true" v-model="isSale">
                        <label for="is_sale_true">판매중</label>
                        <input type="radio" id="is_sale_false" :value="false" v-model="isSale">
                        <label for="is_sale_false">판매중지</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 판매상태 END *** -->

                  <!-- *** 진열상태 START *** -->
                  <tr>
                    <th>진열상태</th>
                    <td>
                      <div class="radio_wrap">
                        <input type="radio" id="is_listed_true" :value="true" v-model="isListed">
                        <label for="is_listed_true">진열함</label>
                        <input type="radio" id="is_listed_false" :value="false" v-model="isListed">
                        <label for="is_listed_false">진열안함</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 진열상태 END *** -->

                  <!-- *** 판매가 START *** -->
                  <tr>
                    <th>판매가</th>
                    <td>

                      <div class="d_ib_100 m_b_10">
                        <div><b>판매가 화폐단위 변환</b></div>
                        <div class="input_div_wrap">
                          <div class="l_h_34">{{ scrapInfo.currency_unit.name }}({{ scrapInfo.currency_unit.unit }}) =</div>
                          <input type="number" placeholder="현재 환율 입력" v-model="tempExchangeRate">
                        </div>
                      </div>
                      <div>
                        <div class="d_ib_100 m_b_10"><b>상품추가금액 설정</b></div>
                        <div class="radio_wrap m_b_10">
                          <input type="radio" id="extra_price_type_rate" value="rate" v-model="tempExtraPriceType">
                          <label for="extra_price_type_rate">배율</label>
                          <input type="radio" id="extra_price_type_number" value="number" v-model="tempExtraPriceType">
                          <label for="extra_price_type_number">특정금액</label>
                          <input type="radio" id="extra_price_type_compound" value="compound" v-model="tempExtraPriceType">
                          <label for="extra_price_type_compound">복합</label>
                        </div>
                        <div class="input_but_wrap">
                          <input v-show="tempExtraPriceType === 'compound' || tempExtraPriceType === 'rate'"
                                 class="m_b_10" type="number" placeholder="% 입력" v-model="tempExtraPriceRate">
                          <input v-show="tempExtraPriceType === 'compound' || tempExtraPriceType === 'number'"
                                 class="m_b_10" type="number" placeholder="특정금액 입력" v-model="tempExtraPriceNumber">
                        </div>
                      </div>
                      <div>
                        <div class="d_ib_100 m_t_10 m_b_10"><b>옵션추가금액 설정</b> <a href="javascript:;" class="question_mark_btn" @click="showAddPriceTypeInfoPopup">?</a></div>
                        <div class="radio_wrap m_b_10">
                          <input type="radio" id="additional_price_type_rate" value="rate" v-model="tempAdditionalPriceType">
                          <label for="additional_price_type_rate">배율</label>
                          <input type="radio" id="additional_price_type_number" value="number" v-model="tempAdditionalPriceType">
                          <label for="additional_price_type_number">특정금액</label>
                          <input type="radio" id="additional_price_type_compound" value="compound" v-model="tempAdditionalPriceType">
                          <label for="additional_price_type_compound">복합</label>
                        </div>
                        <div class="input_but_wrap">
                          <input v-show="tempAdditionalPriceType === 'compound' || tempAdditionalPriceType === 'rate'"
                                 class="m_b_10" type="number" placeholder="% 입력" v-model="tempAdditionalPriceRate">
                          <input v-show="tempAdditionalPriceType === 'compound' || tempAdditionalPriceType === 'number'"
                                 class="m_b_10" type="number" placeholder="특정금액 입력" v-model="tempAdditionalPriceNumber">
                        </div>
                        <div class="checkbox_wrap">
                          <input type="checkbox" id="is_minus_additional_price" v-model="tempIsMinusAdditionalPrice">
                          <label for="is_minus_additional_price">마이너스 옵션값으로 적용</label>
                        </div>
                      </div>
                      <div>
                        <div class="d_ib_100 m_t_10 m_b_10"><b>할인가 없는 경우 원가로 할인가 표시</b></div>
                        <div class="radio_wrap m_b_10">
                          <input type="radio" id="price_to_discount_false" :value="false" v-model="tempIsPriceToDiscount">
                          <label for="price_to_discount_false">적용안함</label>
                          <input type="radio" id="price_to_discount_true" :value="true" v-model="tempIsPriceToDiscount">
                          <label for="price_to_discount_true">적용</label>
                        </div>
                        <div class="input_but_wrap m_b_10">
                          <input v-show="tempIsPriceToDiscount" class="m_b_10" type="number" placeholder="배수 입력" v-model="tempSurchargeRate">
                        </div>
                      </div>
                      <div>
                        <div class="d_ib_100">
                          <a class="small_but_style" @click="applyExtraPrice">적용</a>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 판매가 END *** -->

                  <tr>
                    <th>가격비교 그룹 추가</th>
                    <td>
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="can_price_group" v-model="canPriceGroup">
                        <label for="can_price_group">가격비교 그룹에 추가하기</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 가격비교 그룹 추가 END *** -->

                  <!-- *** 메인이미지 교체 START *** -->
                  <tr>
                    <th>메인이미지 교체</th>
                    <td>
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="is_change_main_image" v-model="isChangeMainImage">
                        <label for="is_change_main_image">첫번째 옵션이미지로 교체</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 메인이미지 교체 END *** -->

                  <!-- *** 배송비 템플릿 START *** -->
                  <tr>
                    <th>배송비</th>
                    <td>
                      <div class="input_but_wrap">
                        <select v-model="selectedDeliveryInfo">
                          <option value="">선택</option>
                          <option v-for="(info) in deliveryInfo" :key="info.id" :value="info">{{ info.name }}</option>
                        </select>
                        <a class="small_but_style pull-right" @click="showDeliveryInfoPopup">상세보기</a>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 배송비 템플릿 END *** -->

                  <!-- *** 상품정보고시 템플릿 START *** -->
                  <tr>
                    <th>상품정보고시</th>
                    <td>
                      <select v-model="selectedProductNoticeTemplate">
                        <option value="">선택</option>
                        <option v-for="item in templates.PRDCT_NTC" :key="item.id" :value="item">{{ item.name }}</option>
                      </select>
                    </td>
                  </tr>
                  <!-- *** 상품정보고시 템플릿 END *** -->

                  <!-- *** 배송정보고시 템플릿 START *** -->
                  <tr>
                    <th>배송정보고시</th>
                    <td>
                      <select v-model="selectedDeliveryNoticeTemplate">
                        <option value="">선택</option>
                        <option v-for="item in templates.DLVRY_NTC" :key="item.id" :value="item">{{ item.name }}</option>
                      </select>
                    </td>
                  </tr>
                  <!-- *** 배송정보고시 템플릿 END *** -->

                  <!-- *** 교환/반품 템플릿 START *** -->
                  <tr>
                    <th>교환/반품</th>
                    <td>
                      <select v-model="selectedExchangeReturnTemplate">
                        <option value="">선택</option>
                        <option v-for="item in templates.EXCHNG_RTND" :key="item.id" :value="item">{{ item.name }}</option>
                      </select>
                    </td>
                  </tr>
                  <!-- *** 교환/반품 템플릿 END *** -->

                  <!-- *** 해외상품정보고시 템플릿 START *** -->
                  <tr>
                    <th>해외상품정보고시 (상단)</th>
                    <td>
                      <span v-if="templates.ABRD_PRDCT_TOP_NTC && templates.ABRD_PRDCT_TOP_NTC.length > 0">
                        {{ templates.ABRD_PRDCT_TOP_NTC[0].name }}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>해외상품정보고시 (하단)</th>
                    <td>
                      <span v-if="templates.ABRD_PRDCT_BTM_NTC && templates.ABRD_PRDCT_BTM_NTC.length > 0">
                        {{ templates.ABRD_PRDCT_BTM_NTC[0].name }}</span>
                    </td>
                  </tr>
                  <!-- *** 해외상품정보고시 템플릿 END *** -->

                  <!-- *** 중복상품 등록 START *** -->
                  <tr>
                    <th>중복상품 등록</th>
                    <td>
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="is_duplicated" v-model="isDuplicated">
                        <label for="is_duplicated">중복상품 등록 허용</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 중복상품 등록 END *** -->

                  <!-- *** 중복상품 등록 START *** -->
                  <tr>
                    <th>상품명 가공</th>
                    <td>
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="is_change_product_name" v-model="isChangeProductName">
                        <label for="is_change_product_name">상품명 가공처리</label><a href="javascript:;" class="question_mark_btn" @click="showChangeProductNameInfoPopup">?</a>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 중복상품 등록 END *** -->

                  <!-- *** 중복상품 등록 START *** -->
                  <tr>
                    <th>상품명 문구 추가</th>
                    <td>
                      <div>
                        <div class="d_ib_100 m_t_10 m_b_10"><b>상품명 앞에 문구 추가</b></div>
                        <div><input class="m_b_10" type="text" placeholder="추가할 문구를 입력해주세요." v-model="prefixProductName"></div>
                        <div class="d_ib_100 m_t_10 m_b_10"><b>상품명 뒤에 문구 추가</b></div>
                        <div><input class="m_b_10" type="text" placeholder="추가할 문구를 입력해주세요." v-model="suffixProductName"></div>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 중복상품 등록 END *** -->

                  <!-- *** 상세이미지 START *** -->
                  <tr>
                    <th>상세이미지</th>
                    <td>
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="is_included_image" v-model="isIncludedImage">
                        <label for="is_included_image">상세이미지 없는 상품 등록 허용</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 상세이미지 END *** -->

                  </tbody>
                </table>
              </div>
            </div>

            <div class="col_too">
              <ul class="table_wrap">
                <li>
                  <div class="but_wrap text-right m_t_20">
                    <a @click="deleteTempProduct">제외하기</a>
                  </div>
                </li>
                <li>
                  <!-- *** temp product START *** -->
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="tempProducts"
                    :total="totalCount"
                    :defaultPage="1"
                    :defaultPageSize="pageSize"
                    :draggable="false"
                    selectType="multi"
                    :itemKey="'_id'"
                  >
                    <template v-slot:body="{item}">
                      <td>
                        {{ item.recommended_name }}
                        <span v-if="item.is_duplicated"> (중복)</span>
                        <a :href="`${item.detail_url}`" target="_blank" class="color_b"> [상품링크]</a>
                      </td>
                      <td>
                        <span class="thumbnail_wrap">
                          <DefaultImage :imageUrl="item.main_image_urls[0]" />
                        </span>
                      </td>
                      <td>
                        <span>{{ getProductPrice('price', item.product_price, item.maxOptionPrice) }}</span> ₩<br/>
                        <span>({{ item.product_price.price | comma }} {{ scrapInfo.currency_unit.unit }})</span>
                      </td>
                      <td>
                        <span>{{ getProductPrice('discount_price', item.product_price, item.maxOptionPrice) }}</span> ₩<br/>
                        <span>({{ item.product_price.discount_price | comma }} {{ scrapInfo.currency_unit.unit }})</span>
                      </td>
                      <td>
                        <!-- *** 옵션 START *** -->
                        <table>
                          <tr>
                            <th v-for="name in item.optionNameList">
                              {{ getOptionName(item.optionNameMap[name].option) }}
                            </th>
                            <th>표시 추가금액</th>
                          </tr>
                          <tr v-for="(compoundOption) in item.compoundOptionMapList">
                            <td v-for="value in item.optionNameList">
                              {{ compoundOption[value].value }}
                            </td>
                            <td>
                              <span>{{ getOptionPrice(compoundOption.additional_price, item.maxOptionPrice) }}</span> ₩<br/>
                              <span>({{ compoundOption.additional_price | comma }} {{ scrapInfo.currency_unit.unit }})</span>
                            </td>
                          </tr>
                        </table>
                        <!-- *** 옵션 END *** -->
                      </td>
                      <td>{{ item.fail_reason }}</td>
                    </template>
                  </data-table>
                  <!-- *** temp product END *** -->

                  <div class="but_wrap text-right m_t_20">
                    <a @click="moveCrawlingList" class="line_but pull-left">목록</a>
                    <a @click="btnSelectedTransfer">선택 상품 게시</a>
                    <a @click="btnAllTransfer">전체 상품 게시</a>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
      <StoreAdminFooter></StoreAdminFooter>
    </div>
  </div>
  </client-only>
</template>
<script src="assets/javascripts/store_admin/crawling/_id/index.js"></script>
