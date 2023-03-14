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
                <li class="page_title"><div>상품등록</div></li>
                <li>
                  <div class="title">카테고리<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <search-category ref="searchCategories" :classify="'categories'" @setCategory="getCategory" />
                  </div>
                </li>

                <li>
                  <div class="title">상품명<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="input_but_wrap">
                      <input type="text" placeholder="내용을 입력해주세요." v-model="product.name" v-on:keyup="resetIsCheckedProductName" />
                      <a v-if="!isCheckedProductName" class="small_but_style" v-on:click="checkProductName">중복검사</a>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">상품구분</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <template v-for="(target, i) in targets">
                        <input type="radio" name="productTarget" :id="target.key" :key="`target_${i}_${target.key}`" :value="target.key" v-model="product.target" v-on:change="setIsAbroad" />
                        <label :for="target.key" :key="`target_${target.key}`">{{ target.value }}</label>
                      </template>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">진열상태<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="isListed" id="isListedTrue" :value="true" v-model="product.is_listed" />
                      <label for="isListedTrue">진열함</label>
                      <input type="radio" name="isListed" id="isListedFalse" :value="false" v-model="product.is_listed" />
                      <label for="isListedFalse">진열안함</label>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">판매상태<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="isSale" id="isSaleTrue" :value="true" v-model="product.is_sale" />
                      <label for="isSaleTrue">판매중</label>
                      <input type="radio" name="isSale" id="isSaleFalse" :value="false" v-model="product.is_sale" />
                      <label for="isSaleFalse">판매중지</label>
                    </div>
                  </div>
                </li>

                <li v-if="product.is_sale">
                  <div class="title">몰리에서 구매 가능 여부<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="isDisplayOnly" id="isDisplayOnlyFalse" :value="false" v-model="product.display_only" />
                      <label for="isDisplayOnlyFalse">몰리에서 구매 가능</label>
                      <input type="radio" name="isDisplayOnly" id="isDisplayOnlyTrue" :value="true" v-model="product.display_only" />
                      <label for="isDisplayOnlyTrue">몰리에서 구매 불가</label>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">해외상품여부</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="isAbroadProduct" id="direct" :value="false" v-model="product.is_abroad" />
                      <label for="direct">국내상품</label>
                      <input type="radio" name="isAbroadProduct" id="abroad" :value="true" v-model="product.is_abroad" />
                      <label for="abroad">해외상품</label>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">상품링크</div>
                  <div class="body">
                    <input type="text" v-model="product.detail_url" placeholder="" v-on:keyup="validateUrl(product.detail_url)" />
                    <div class="font_12 color_r" v-if="product.detail_url && !validateUrl(product.detail_url)">유효하지 않은 URL입니다</div>
                  </div>
                </li>

                <li>
                  <div class="title">어필리에이트 링크</div>
                  <div class="body">
                    <input type="text" v-model="product.affiliate_url" placeholder="" v-on:keyup="validateUrl(product.affiliate_url)"/>
                    <div class="font_12 color_r" v-if="product.affiliate_url && !validateUrl(product.affiliate_url)">유효하지 않은 URL입니다</div>
                  </div>
                </li>

                <li>
                  <div class="title">
                    가격비교 그룹<br>
                    매칭 대상 여부
                  </div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="canPriceGroup" id="canPriceGroupTrue" :value="true" v-model="product.can_price_group" />
                      <label for="canPriceGroupTrue">매칭대상 설정중</label>
                      <input type="radio" name="canPriceGroup" id="canPriceGroupFalse" :value="false" v-model="product.can_price_group" />
                      <label for="canPriceGroupFalse">매칭대상 제외</label>
                    </div>
                  </div>
                </li>

                <li v-if="product.is_abroad">
                  <div class="title">직접구매가<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="select_div_wrap">
                      <div>
                        <input type="number" class="m_r_10 text-right" placeholder="0" @blur="blurPrice" v-model="product.abroad_price.price" v-on:keyup="calcAbroadPrice"/>
                        <span v-if="abroadPriceInWon" class="color_b">약 {{ abroadPriceInWon | comma }} 원</span>
                      </div>
                      <span>
                      <select v-model="product.abroad_price.currency_unit" v-on:change="calcAbroadPrice">
                        <option v-for="currencyUnit in currencyUnits" v-bind:value="currencyUnit"
                                v-bind:key="currencyUnit.iso">{{ currencyUnit.unit }} ({{ currencyUnit.name }})</option>
                      </select>
                    </span>
                    </div>
                  </div>
                </li>

                <li v-if="!product.display_only">
                  <div class="title">몰리판매가<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <input type="number" class="w_25 m_r_10 pull-left text-right" placeholder="0" @blur="blurPrice" v-model="product.price" /><span>원</span>
                  </div>
                </li>

                <li v-if="!product.display_only">
                  <div class="title">몰리판매가 할인설정</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="isDiscount" id="type_NONE" :value="'NONE'" v-model="product.discount_type" v-on:change="resetDiscount" checked />
                      <label for="type_NONE">없음</label>
                      <input type="radio" name="isDiscount" id="type_PRICE" :value="'PRICE'" v-model="product.discount_type" v-on:change="resetDiscount" />
                      <label for="type_PRICE">금액</label>
                      <input type="radio" name="isDiscount" id="type_PRCNT" :value="'PRCNT'" v-model="product.discount_type" v-on:change="resetDiscount" />
                      <label for="type_PRCNT">퍼센트</label>
                    </div>
                    <div class="text_input_wrap w_100" v-if="product.discount_type !== 'NONE'">
                      <span>판매가에서</span>
                      <input type="number" :placeholder="product.discount_type === 'PRICE' ? '금액' : '%'" v-model="discountValue" />
                      <span>{{ product.discount_type === 'PRICE' ? '원' : '%' }} 할인</span>
                      <a v-on:click="applyDiscount">적용</a>
                    </div>
                  </div>
                </li>

                <li v-if="product.discount_type !== 'NONE' && !product.display_only">
                  <div class="title">할인 판매가</div>
                  <div class="body">{{ product.discount_price | comma }}<span>원</span></div>
                </li>

              </ul>

              <ul>
                <li class="page_title"><div>옵션정보</div></li>
                <!-- 옵션 사용 안함 클릭시 s -->
                <li>
                  <div class="title">옵션사용 여부</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <template v-for="type in option_type">
                        <!-- TODO 나중에 옵션 없음 제외 풀기 -->
                        <template v-if="type.key !== 'NONE'">
                          <input type="radio" name="option_type" :id="type.key" :key="type.key" :value="type.key" v-model="product.option_type" v-on:change="resetOptionType(type.key)" />
                          <label :for="type.key" :key="type.value">
                            {{ type.value }}
                          </label>
                        </template>
                      </template>
                    </div>
                  </div>
                </li>
                <!-- 옵션 사용 안함 클릭시 e -->

                <!-- 조합형, 단독형 선택 s -->
                <li v-if="product.option_type !== 'NONE'">
                  <div class="title">옵션유형</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="optionType" id="standard" v-model="product.use_option_image" :value="false" checked />
<!--                      v-on:change="initOptionImage()"-->
                      <label for="standard">일반 옵션</label>
                      <input type="radio" name="optionType" id="image" v-model="product.use_option_image" :value="true" />
                      <label for="image">이미지 옵션</label>
                    </div>
                  </div>
                </li>
                <li v-if="product.option_type !== 'NONE'">
                  <div class="title">옵션입력</div>
                  <div class="body">
                    <div>
                      <table>
                        <colgroup>
                          <col width="200" />
                        </colgroup>
                        <thead>
                          <tr>
                            <th>옵션명</th>
                            <th>옵션값</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(option, i) in options" v-bind:key="i">
                            <td><input type="text" placeholder="예시: 컬러(25자 제한)" v-model="option.name" /></td>
                            <td>
                              <div class="mount_li__btn_wrap">
                                <div class="v_select_wrap">
                                <vue-select taggable multiple :noDrop="true" :map-keydown="optionHandlers" placeholder="예시: 블랙, 화이트(엔터로 구분)" v-model="option.values" :create-option="option => ({id: option.toLowerCase(), label: option})"></vue-select>
<!--                                  옵션명 및 옵션값 id 가 label 과 같은 값이 들어가지만 중복이 허용되지 않으므로 유니크 id로 사용하게 하였음-->
                                </div>
                                <a v-on:click="addOptions">+</a>
                                <a v-if="i > 0" v-on:click="deleteOptions(i)">-</a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div class="but_wrap m_t_10">
                        <a v-on:click="applyOptionList">옵션목록으로 적용</a>
                      </div>
                    </div>
                  </div>
                </li>
                <!-- 조합형, 단독형 선택 e -->
              </ul>

              <!-- 조합형 s -->
              <ul v-if="product.option_type === 'ASSCTN'">
                <li class="title">옵션목록</li>
                <li>
                  <div class="table_top_wrap square_but_wrap">
                    <a class="gray_but" v-on:click="setOptionImage" v-if="product.use_option_image">옵션이미지</a>
                    <div>
                      <div class="font_12">옵션추가금액</div>
                      <input type="number" placeholder="숫자만 입력" id="additional_price" v-model="optionCheckUpdate.additionalPrice"/>
                    </div>
                    <div>
                      <div class="font_12">재고수량</div>
                      <input type="number" placeholder="숫자만 입력" id="inventory_amount" v-model="optionCheckUpdate.inventoryAmount"/>
                    </div>
                    <div>
                      <div class="font_12">사용여부</div>
                      <select id="is_available" v-model="optionCheckUpdate.isAvailable">
                        <option value="">선택</option>
                        <option v-bind:value="false">N</option>
                        <option v-bind:value="true">Y</option>
                      </select>
                    </div>

                    <a class="gray_but" v-on:click="changeSelectedOption">선택목록 일괄수정</a>
                    <a class="gray_but_light" v-on:click="deleteSelectedOption">선택삭제</a>
                  </div>
                  <!-- 조합형 일반, 이미지 옵션 클릭시 s -->

                  <table>
                    <colgroup>
                      <col width="40" />
                      <col width="100" v-if="product.use_option_image" />
                      <!-- 옵션명 개수에 따라 col 추가-->
                      <template v-if="product.options.length < 1">
                        <col>
                      </template>
                      <template v-else>
                        <col v-for="count in product.options.length" v-bind:key="`options_col_${count}`" />
                      </template>
                      <!-- 고정되어야할 col-->
                      <col width="130" />
                      <col width="130" />
                      <col width="100" />
                      <col width="100" />
                      <col width="60" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th rowspan="2">
                          <div class="only_checkbox_wrap">
                            <input type="checkbox" id="option_all" v-on:click="checkOption" />
                            <label for="option_all"></label>
                          </div>
                        </th>
                        <th rowspan="2" v-if="product.use_option_image">옵션이미지</th>
                        <th v-bind:colspan="product.options.length > 1 ? product.options.length : 1">옵션명</th>
                        <th rowspan="2">옵션가 추가금액</th>
                        <th rowspan="2">재고관리 여부</th>
                        <th rowspan="2">재고수량</th>
                        <th rowspan="2">사용여부</th>
                        <th rowspan="2">삭제</th>
                      </tr>
                      <tr v-if="product.options.length > 0">
                        <th v-for="(option, i) in product.options" v-bind:key="i">{{ option.name }}</th>
                      </tr>
                    </thead>
                    <tbody>
                    <template v-if="product.option_compositions.length > 0">
                      <tr v-for="(composition, i) in product.option_compositions" v-bind:key="`option_composition_${i}`">
                        <td>
                          <div class="only_checkbox_wrap">
                            <input type="checkbox" v-bind:id="`oc_checkbox_${i}`" :value="i" class="oc_checkbox" v-on:click="checkOption" />
                            <label v-bind:for="`oc_checkbox_${i}`"></label>
                          </div>
                        </td>
                        <td v-if="product.use_option_image">
                          <template v-for="(option_value, k) in composition.option_values">
                            <span v-if="optionValueImageMap[`${option_value.option.name}_${option_value.name}`]" v-bind:key="`option_value_image_${k}`" class="thumbnail_wrap m_r_10">
                              <img v-bind:src="optionValueImageMap[`${option_value.option.name}_${option_value.name}`].image" v-bind:id="`option_value_image_${k}`" />
                            </span>
                          </template>
                        </td>
                        <td v-for="(option_value, j) in composition.option_values" v-bind:key="`option_value_${i}_${j}`">
                          <span>{{ option_value.name }}</span>
                        </td>
                        <td><input type="number" placeholder="100" v-model="composition.additional_price" @blur="blurOptionPrice(i)"/></td>
                        <td>
                          <select v-model="composition.is_inventory_managed">
                            <option v-bind:value="false">N</option>
                            <option v-bind:value="true">Y</option>
                          </select>
                        </td>
                        <td><input type="number" placeholder="0" v-model="composition.inventory_amount" /></td>
                        <td>
                          <select v-model="composition.is_available">
                            <option v-bind:value="false">N</option>
                            <option v-bind:value="true">Y</option>
                          </select>
                        </td>
                        <td>
                          <span class="small_but_wrap">
                            <a class="line_but" v-on:click="deleteOption(i)">삭제</a>
                          </span>
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr><td colspan="99">옵션을 입력해주세요.</td></tr>
                    </template>
                    </tbody>
                  </table>
                  <!-- TODO 나중에 조합형 일반, 이미지 옵션 클릭시 e -->
<!--                  <div class="but_wrap m_t_10">-->
<!--                    <a v-on:click="addOption">+ 옵션추가</a>-->
<!--                  </div>-->
                </li>
              </ul>
              <!-- 조합형 e -->

              <!-- 단독형 s -->
              <ul v-else-if="product.option_type === 'STDALN'">
                <li class="title">옵션목록</li>
                <li>
                  <div class="table_top_wrap square_but_wrap">
                    <a class="gray_but" v-on:click="setOptionImage" v-if="product.use_option_image">옵션이미지</a>
                    <div>
                      <div class="font_12">사용여부</div>
                      <select id="is_available" v-model="optionCheckUpdate.isAvailable">
                        <option value="">선택</option>
                        <option v-bind:value="true">Y</option>
                        <option v-bind:value="false">N</option>
                      </select>
                    </div>

                    <a class="gray_but" v-on:click="changeSelectedOption">선택목록 일괄수정</a>
                    <a class="gray_but_light" v-on:click="deleteSelectedOption">선택삭제</a>
                  </div>
                  <!-- 단독형 일반, 이미지 옵션 클릭시 s -->
                  <table>
                    <colgroup>
                      <col width="40" />
                      <col width="130" v-if="product.use_option_image" />
                      <col width="130" />
                      <col width="100" />
                      <col width="100" />
                      <col width="60" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>
                          <div class="only_checkbox_wrap">
                            <input type="checkbox" id="stdaln_option_all" v-on:click="checkOption" />
                            <label for="stdaln_option_all"></label>
                          </div>
                        </th>
                        <th v-if="product.use_option_image">옵션이미지</th>
                        <th>옵션명</th>
                        <th>옵션값</th>
                        <th>사용여부</th>
                        <th>삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(composition, i) in product.option_compositions" v-bind:key="i">
                        <td>
                          <div class="only_checkbox_wrap">
                            <input type="checkbox" v-bind:id="`oc_checkbox_${i}`" :value="i" class="oc_checkbox" v-on:click="checkOption" />
                            <label v-bind:for="`oc_checkbox_${i}`"></label>
                          </div>
                        </td>
                        <td v-if="product.use_option_image">
                          <template v-for="(option_value, k) in composition.option_values">
                            <span v-if="optionValueImageMap[`${option_value.option.name}_${option_value.name}`]" v-bind:key="`image_${k}`" class="thumbnail_wrap m_r_10">
                              <img v-bind:src="optionValueImageMap[`${option_value.option.name}_${option_value.name}`].image" v-bind:id="`image_${k}`" />
                            </span>
                          </template>
                        </td>
                        <template v-for="option_value in composition.option_values">
                          <td v-bind:key="`name_${option_value.name}`">
                            <span>{{ option_value.option.name }}</span>
                          </td>
                          <td v-bind:key="`value_${option_value.name}`">
                            <span>{{ option_value.name }}</span>
                          </td>
                        </template>
                        <td>
                          <select v-model="composition.is_available">
                            <option v-bind:value="false">N</option>
                            <option v-bind:value="true">Y</option>
                          </select>
                        </td>
                        <td>
                          <span class="small_but_wrap">
                            <a class="line_but" v-on:click="deleteOption(i)">삭제</a>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- TODO 나중에 단독형 일반, 이미지 옵션 클릭시 e -->
<!--                  <div class="but_wrap m_t_10">-->
<!--                    <a v-on:click="addOptionList">+ 옵션추가</a>-->
<!--                  </div>-->
                </li>
              </ul>
              <!-- 단독형 e -->

              <!-- 조합형, 단독형 옵션이미지 노출여부 s -->
<!--              <ul v-if="product.use_option_image">-->
<!--                <li class="title">옵션이미지 노출여부</li>-->
<!--                <li>-->
<!--                  <div class="radio_wrap">-->
<!--                    <input type="radio" id="isShowOptionImageShow" v-model="product.is_show_option_image" :value="true">-->
<!--                    <label for="isShowOptionImageShow">노출함</label>-->
<!--                    <input type="radio" id="isShowOptionImageHide" v-model="product.is_show_option_image" :value="false">-->
<!--                    <label for="isShowOptionImageHide">노출안함</label>-->
<!--                  </div>-->
<!--                </li>-->
<!--              </ul>-->
              <!-- 조합형, 단독형 옵션이미지 노출여부 e -->

              <!-- 메인, 추가 이미지 s -->
              <ul>
                <li class="page_title"><div>상품이미지</div></li>
                <li>
                  <div class="title">대표이미지<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="input_file_wrap">
                      <span class="thumbnail_wrap" v-if="product.main_image.dataUrl">
                        <a class="del_icon" v-on:click="deleteMainImage">X</a><a class="edit_icon" v-on:click="updateMainImage">수정</a>
                        <img id="main_image" v-bind:src="product.main_image.dataUrl" />
                      </span>
                      <input type="file" id="main_image_file" v-on:change="uploadMainImage" accept="image/*" />
                      <label for="main_image_file" v-if="!product.main_image.dataUrl">첨부파일 등록</label>
                      <span class="m_l_20 color_main_01">권장 사이즈 : 640 x 640, 최대 10MB까지 가능</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">추가이미지<br />({{ product.additional_images.length }}/{{ additionalImageMaxCount }})</div>
                  <div class="body">
                    <div class="input_file_wrap">
                      <template v-if="product.additional_images.length > 0">
                        <span class="thumbnail_wrap m_r_10" v-for="(image, i) in product.additional_images" v-bind:key="i">
                          <a class="del_icon" v-on:click="deleteAdditionalImage(i)">X</a>
                          <a class="edit_icon"><label :for="`update_additional_images_${i}`">수정</label></a>
                          <img v-bind:id="`additional_image_${i}`" v-bind:src="image.dataUrl" />
                          <input type="file" :id="`update_additional_images_${i}`" accept="image/*" v-on:change="updateImage($event, i)" />
                        </span>
                      </template>
                      <input type="file" id="additional_images" multiple v-on:change="additionalImages" accept="image/*" />
                      <label for="additional_images" v-if="product.additional_images.length < additionalImageMaxCount">첨부파일 등록</label>
                      <div class="m_l_20 color_main_01">
                        권장 사이즈 : 640 x 640, 최대 10MB까지 가능<br />
                        추가 이미지는 최대 5개까지 설정할 수 있습니다.<br />
                        jpg, jpeg, gif, png, bmp 형식의 정지 이미지만 등록됩니다.
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">상세이미지/설명<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <client-only>
                      <SummernoteEditor @setDetailContent="onEditor"></SummernoteEditor>
                    </client-only>
                  </div>
                </li>
              </ul>
              <!-- 메인, 추가 이미지 e -->

              <!-- 배송정보 s -->
              <ul>
                <li class="page_title"><div>배송정보</div></li>
                <li>
                  <div class="title">배송비<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <select class="d_ib_100" v-on:change="selectedDeliveryInfo">
                      <option value="">선택</option>
                      <option v-for="(info, i) in deliveryInfos" v-bind:key="info.id" v-bind:value="info.id">{{ info.name }}</option>
                    </select>
                    <a class="middle_but_style pull-right" v-on:click="updateDelivery">수정</a>
                  </div>
                </li>
              </ul>

              <ul v-if="isUpdateDeliveryTemplate">
                <li>
                  <div class="title">묶음배송</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="deliveryGroup" id="isDeliveryGroupTrue" :value="true" v-model="isDeliveryGroup" v-on:change="resetDeliveryGroupId" />
                      <label for="isDeliveryGroupTrue">가능</label>
                      <input type="radio" name="deliveryGroup" id="isDeliveryGroupFalse" :value="false" v-model="isDeliveryGroup" v-on:change="resetDeliveryGroupId" />
                      <label for="isDeliveryGroupFalse">불가(개별계산)</label>
                    </div>
                    <div v-if="isDeliveryGroup">
                      <select v-model="product.delivery_info.delivery_group_id" v-on:change="setSelectedDeliveryGroup">
                        <option value="">선택</option>
                        <option v-for="item in deliveryGroups" v-bind:key="`delivery_group_${item.id}`" v-bind:value="item.id">{{ item.name }}</option>
                      </select>
                      <div>계산방식: {{ isSmaller }}</div>
                      <div>제주/도서산간 추가배송비 : {{ isCountryMountain }}</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">배송방법<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <select v-model="product.delivery_info.delivery_method" :disabled="delivery_info_for_delivery_group">
                      <option value="">선택</option>
                      <option v-for="method in deliveryMethod" v-bind:key="method.key" v-bind:value="method.key">{{ method.value }}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">배송비 지불 방법<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="radio_wrap">
                      <template v-for="(method, i) in feePayMethod">
                        <input type="radio" name="feePayMethod" v-bind:id="method.key" v-bind:key="i" v-bind:value="method.key" v-model="product.delivery_info.fee_pay_method" :disabled="delivery_info_for_delivery_group"/>
                        <label v-bind:for="method.key" v-bind:key="method.key">{{ method.value }}</label>
                      </template>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">배송비 유형<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <select v-model="product.delivery_info.delivery_fee_type" v-on:change="resetDeliveryFeeType">
                      <option value="">선택</option>
                      <option v-for="feeType in deliveryFeeType" v-bind:key="feeType.key" v-bind:value="feeType.key">{{ feeType.value }}</option>
                    </select>
                  </div>
                </li>
                <!-- 무료를 제외한 -->
                <li v-if="!['', 'FREE'].includes(product.delivery_info.delivery_fee_type)">
                  <div class="title">기본 배송비</div>
                  <div class="body">
                    <div class="text_input_wrap m_t_0 pull-left">
                      <input type="number" placeholder="0" v-model="product.delivery_info.default_fee" /><span>원</span>
                    </div>
                  </div>
                </li>

                <li v-if="!['', 'FREE', 'CHARGE'].includes(product.delivery_info.delivery_fee_type)">
                  <!-- 조건부무료 -->
                  <div class="title">배송비 조건</div>
                  <div class="body" v-if="product.delivery_info.delivery_fee_type === 'CNDTN'">
                    <div>상품 판매가 합계(판매자가 설정한 할인판매가 + 옵션추가금액)</div>
                    <div class="text_input_wrap">
                      <input type="number" v-model="product.delivery_info.condition_value" />
                      <div>원 이상 무료</div>
                    </div>
                  </div>

                  <div class="body" v-if="product.delivery_info.delivery_fee_type === 'AMOUNT'">
                    <!-- 수량별 -->
                    <div class="text_input_wrap">
                      <input type="number" placeholder="0" v-model="product.delivery_info.condition_value" />
                      <span>개마다 기본배송비 반복 부과</span>
                    </div>
                  </div>

                  <div class="body" v-if="product.delivery_info.delivery_fee_type === 'AREA'">
                    <!-- 구간별 -->
<!--                    <div class="radio_wrap">-->
<!--                      <input type="radio" id="conditionValueToo" name="conditionValue" v-on:change="conditionValue(2)" />-->
<!--                      <label for="conditionValueToo">2구간</label>-->
<!--                      <input type="radio" id="conditionValueThree" name="conditionValue" v-on:change="conditionValue(3)" />-->
<!--                      <label for="conditionValueThree">3구간</label>-->
<!--                    </div>-->
                    <div class="text_input_wrap">
                      <input type="number" placeholder="0" v-model="product.delivery_info.condition_value" /><span>개 까지 추가배송비없음</span>
                    </div>
                    <div class="text_input_wrap">
                      <span>초과 구매시 추가배송비</span>
                      <input type="number" placeholder="0" v-model="product.delivery_info.additional_fee" /><span>원</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">제주/도서산간 추가 배송비</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" name="setMountainArea" id="isMountainAreaTrue" v-bind:value="true" v-model="isCountryMountainDelivery" v-on:change="setIsCountryMountainDelivery" :disabled="isDisabledCountryMountainDelivery" />
                      <label for="isMountainAreaTrue">설정</label>
                      <input type="radio" name="setMountainArea" id="isMountainAreaFalse" v-bind:value="false" v-model="isCountryMountainDelivery" v-on:change="setIsCountryMountainDelivery" :disabled="isDisabledCountryMountainDelivery" />
                      <label for="isMountainAreaFalse">설정안함</label>
                      <a class="m_l_20 color_b under_line" v-on:click="popMountainousArea">도서산간지역 확인</a>
                    </div>
                    <div class="radio_wrap m_b_10" v-if="isCountryMountainDelivery">
                      <span>배송권역</span>
                      <input type="radio" name="area_num" id="TOTAL" :value="2" v-model="selectedAreaNum" v-on:change="setCountryMountainDelivery" />
                      <label for="TOTAL">2권역</label>
                      <input type="radio" name="area_num" id="JEJU-CNTRY_MNTN" :value="3" v-model="selectedAreaNum" v-on:change="setCountryMountainDelivery" />
                      <label for="JEJU-CNTRY_MNTN">3권역</label>
                    </div>
                    <div class="text_input_wrap d_ib_100 m_t_0" v-for="(item, i) in Object.values(product.country_mountain_deliveries)" v-bind:key="item.area_type">
                      <div v-if="item.area_type === 'TOTAL'">제주 및 도서산간 추가배송비</div>
                      <div v-else-if="item.area_type === 'JEJU'">제주 추가배송비</div>
                      <div v-else>제주 외 도서산간 추가배송비</div>
                      <input type="number" v-model="item.additional_price" /><span>원</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div class="title">출고지(매장주소)<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div>
                      <span>({{ product.delivery_info.departure_zipcode }}){{ product.delivery_info.departure_address }} {{ product.delivery_info.departure_detail_address }}</span>
                      <span>
                        <a class="small_but_style m_l_20" v-on:click="popAddress('departure')">주소 수정</a>
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">반품/교환 택배사<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <select v-model="product.delivery_info.delivery_company">
                      <option value="">택배사 선택</option>
                      <option v-for="(item, i) in deliveryCompany" v-bind:key="`delivery_company_${item.key}`" v-bind:value="item.key">{{ item.value }}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">반품배송비(편도)<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="text_input_wrap">
                      <input type="number" v-model="product.delivery_info.return_fee" />
                      <span>원</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">반품배송비(왕복)<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <div class="text_input_wrap">
                      <input type="number" v-model="product.delivery_info.exchange_fee" />
                      <span>원</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">반품/교환지<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <span>({{ product.delivery_info.arrival_zipcode }}){{ product.delivery_info.arrival_address }} {{ product.delivery_info.arrival_detail_address }}</span>
                    <span>
                      <a class="small_but_style m_l_20" v-on:click="popAddress('arrival')">주소 수정</a>
                    </span>
                  </div>
                </li>
              </ul>
              <!-- 배송정보 e -->

              <!-- 정보고시 s -->
              <ul>
                <li>
                  <div class="title">배송정보고시<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <select v-model="product.delivery_notice_template_id">
                      <option value="">선택</option>
                      <option v-for="notice in templates.DLVRY_NTC" v-bind:value="notice.id" v-bind:key="notice.id">{{ notice.name }}</option>
                    </select>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">교환/반품<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <select v-model="product.exchange_refund_template_id">
                      <option value="">선택</option>
                      <option v-for="notice in templates.EXCHNG_RTND" v-bind:value="notice.id" v-bind:key="notice.id">{{ notice.name }}</option>
                    </select>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">해외상품정보고시 노출여부</div>
                  <div class="body">
                    <div class="checkbox_wrap">
                      <input type="checkbox" id="isShowAbroadTemplate" v-model="product.is_show_abroad_template">
                      <label for="isShowAbroadTemplate">등록된 해외상품정보고시 노출</label>
                    </div>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">추가 상품정보 고시<span class="color_r">&#42;</span></div>
                  <div class="body">
                    <select v-model="product.product_notice_template_id">
                      <option value="">선택</option>
                      <option v-for="notice in templates.PRDCT_NTC" v-bind:value="notice.id" v-bind:key="notice.id">{{ notice.name }}</option>
                    </select>
                  </div>
                </li>
              </ul>
              <!-- 정보고시 e -->

              <div class="but_wrap text-center">
                <nuxt-link class="line_but" to="/store_admin/product">취소</nuxt-link>
                <a v-on:click="createProduct">등록</a>
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
<script src="@/assets/javascripts/store_admin/product/new/index.js"></script>
