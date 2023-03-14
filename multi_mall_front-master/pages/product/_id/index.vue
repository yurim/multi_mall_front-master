<template>
  <div class="userWrap">

    <!-- 셀퍼 상품 타입 태그 Start -->
    <selper style="display:none;" class="__selperProductType" eventtype="ViewContent" desc="셀퍼상품타입태그" :platform="selperPlatform" ostype="pc">
      <selper :class="`__selperProductItemProductType${index + 1}`" :desc="`상품카테고리${index + 1}`"
              v-for="(category, index) in product.category_list" :key="category._id">{{ category.name}}</selper>
    </selper>
    <!-- 셀퍼 상품 타입 태그 End -->
    <!-- 셀퍼 상품 상세 태그 Start -->
    <selper style="display:none;" class="__selperProductItem" eventtype="ViewContent" desc="셀퍼상품상세태그" :platform="selperPlatform" ostype="pc">
      <selper class="__selperProductItemId"         desc="상품아이디">{{ product.id }}</selper>
      <selper class="__selperProductItemBasePrice"         desc="상품가격">{{ product.price }}</selper>
      <selper class="__selperProductItemSalePrice"         desc="상품판매가격">{{ product.discount_price ? product.discount_price : product.price }}</selper>
      <selper class="__selperProductItemShippingPrice"     desc="배송비">{{ product.delivery_info.default_fee }}</selper>
      <selper class="__selperProductItemCurrency"         desc="통화">KRW</selper>
      <selper class="__selperProductItemName"         desc="상품이름">{{ product.name }}</selper>
      <selper class="__selperProductItemAvailability"         desc="재고">I</selper>
      <selper class="__selperProductItemAvailableQuantity"     desc="상품재고수량">0</selper>
      <selper class="__selperProductItemQuantity"         desc="상품수량">1</selper>
      <selper class="__selperProductItemDescription"     desc="상품설명">{{ product.content }}</selper>
      <selper class="__selperProductItemBrand"         desc="브랜드명">{{ product.store_name_kor }}</selper>
      <selper class="__selperProductItemImageUrl"         desc="상품이미지">{{ product.main_image }}</selper>
      <selper class="__selperProductItemOption"         desc="상품옵션">
        <template v-for="(option, index) in product.options">{{ option.name }}{{ index < product.options.length - 1 ? ',' : null}}</template>
      </selper>
      <selper class="__selperProductItemEnc"         desc="">{{ (userId && userGrade === 0) ? userId : null }}</selper>
    </selper>
    <!-- 셀퍼 상품 상세 태그 End -->

    <Header></Header>
    <v-container>

      <div class="product_show_wrap">
        <div class="top_info_wrap">

          <!-- 왼쪽-->
          <div class="top_info_wrap__left">
            <!-- *** 옵션 이미지 미리보기 START *** -->
            <div class="option_action_img_wrap" v-show="optionPreviewImage">
              <DefaultImage :imageUrl="optionPreviewImage"/>
            </div>
            <!-- *** 옵션 이미지 미리보기 END *** -->
            <div class="m_b_10 color_black">
              <template v-for="(category, index) in product.category_list">
                {{ category.name }} {{ index < product.category_list.length - 1 ? '>' : '' }}
              </template>
            </div>
            <div class="slide_vis">
              <div class="thumb-example">
                <swiper class="swiper gallery-top" :options="swiperOptionTop" ref="swiperTop">
                  <swiper-slide class="slide-0"><DefaultImage :imageUrl="product.main_image" /></swiper-slide>

                  <swiper-slide v-for="(item, index) in product.additional_images" :class="`slide-${index+1}`" :key="`slide_${index}`">
                    <DefaultImage :imageUrl="item.image" />
                  </swiper-slide>
                  <div class="swiper-button-next swiper-button-white" slot="button-next"></div>
                  <div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>
                </swiper>
                <!-- swiper2 Thumbs -->
                <swiper class="swiper gallery-thumbs" :options="swiperOptionThumbs" ref="swiperThumbs">
                  <swiper-slide class="slide-0">
                    <div class="img_bg_wrap" v-bind:style="{ backgroundImage: `url(${ product.main_image ? product.main_image : require('@/assets/img/product_default_img.png') })` }" ></div>
                  </swiper-slide>
                  <swiper-slide v-for="(item, index) in product.additional_images" :class="`slide-${index+1}`"
                                :key="`thumbs_${index}`">
                    <DefaultImage :imageUrl="item.image" />
                  </swiper-slide>
                </swiper>
              </div>
            </div>
          </div>

          <!-- 오른쪽-->
          <div class="product_info_wrap top_info_wrap__right">
            <ul class="ul_table_wrap m_t_20">
              <!-- todo: 상품 번호 체크 -->
              <li class="color_gray_70">상품번호 : {{ product.id }}</li>
              <li>
                <span class="color_main_01"><b>{{ product.store_name_kor }}</b></span>
                <ul class="product_icon_wrap">
<!--                  <li>-->
<!--                    <div class="share_icon_wrap">-->
<!--                      <a href="javascript:;" @click="clickShareBtn">-->
<!--                        <img alt="기본 이미지" src="@/assets/img/user/icon/share.png">-->
<!--                      </a>-->
<!--&lt;!&ndash;                      공유 이미지 클릭시 display_none 토글&ndash;&gt;-->
<!--                      &lt;!&ndash; todo: 공유하기 기능 추가 &ndash;&gt;-->
<!--                      <ul class="share_icon_wrap__share_icon_list_wrap" v-show="showShareWrap">-->
<!--                        <li><a href="javascript:;"><img alt="기본 이미지" src="@/assets/img/user/icon/share.png"></a></li>-->
<!--                        <li><a href="javascript:;"><img alt="기본 이미지" src="@/assets/img/user/icon/share.png"></a></li>-->
<!--                        <li><a href="javascript:;"><img alt="기본 이미지" src="@/assets/img/user/icon/share.png"></a></li>-->
<!--                        <li><a href="javascript:;"><img alt="기본 이미지" src="@/assets/img/user/icon/share.png"></a></li>-->
<!--                        <li><a href="javascript:;"><img alt="기본 이미지" src="@/assets/img/user/icon/share.png"></a></li>-->
<!--                      </ul>-->
<!--                    </div>-->
<!--                  </li>-->
                  <li>
                    <div>
<!--                      둘중하나 토글-->
                      <!-- todo: 3차 개발 -->
                      <a class="display_none">
                        <img alt="찜하기" src="@/assets/img/user/icon/like_off.png">
                      </a>
                      <a class="display_none">
                        <img alt="찜완료" src="@/assets/img/user/icon/like_on.png">
                      </a>
                    </div>
                  </li>
                  <li>
                    <div class="square_but_wrap">
                      <nuxt-link :to="`/store/${product.store_id}`" class="text">브랜드홈</nuxt-link>
                      <a class="line_but" v-on:click="popStoreInfo">판매자 상세정보</a>
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <div class="tit">상품명</div>
                <div class="body">
                  <div>{{ product.name }}</div>
                  <div class="reaction">
                    <div class="data_star" v-if="product.total_score > 0 && (product.total_review_count + product.abroad_total_review_count) > 0">
                      <div class="only_star"></div>
                      <em>{{ (product.total_score / (product.total_review_count + product.abroad_total_review_count)) | ceil(1) }}</em>
                    </div>
                    <div class="data_star" v-else>
                      <div class="only_star disabled"></div>
                      <em>0</em>
                    </div>
                    <div class="data"><em>{{ product.total_sale_count | kUnit | comma }}</em>개 판매</div>
                    <div class="data">
                      <a href="#review">
                        <em>{{ (product.total_review_count + product.abroad_total_review_count) | kUnit | comma }}</em>개의 리뷰
                      </a>
                    </div>
                  </div>
                </div>
              </li>
              <li v-if="['111', '101', '011', '001'].indexOf(sale_type) > -1">
                <!-- (몰리판매불가 o|x, 해외상품여부 o|x, 링크있음 o ) 상태일때만 '직접 구매가'가 보여져야함 -->
                <div class="tit">직접 구매가</div>
                <div>
                  <template v-if="product.abroad_price && product.abroad_price.price > 0">
                    <em>{{ product.abroad_price.price | comma }}</em>원
                  </template>
                  <template v-else>
                    <em>-</em>
                  </template>
                </div>
              </li>
              <!-- 판매중이 아닐 시 상품 판매정보는 보여주지 않음 -->
              <template v-if="product.is_sale && !product.display_only">
                <li>
                  <div class="tit">몰리 판매가</div>
                  <div class="body" v-if="product.discount_price">
                    <span class="font_16 m_r_10"><b class="color_main_01">{{ product.discount_price | comma }}</b>원</span>
                    <span><em class="color_main_01">-{{ (1 - product.discount_price / product.price) * 100 | rate }}</em>% 적용</span>
                  </div>
                  <div class="body" v-else>
                    <span class="font_16 m_r_10"><b class="color_main_01 font">{{ product.price | comma }}</b>원</span>
                  </div>

                  <span class="font_12 color_gray_7 m_t_20">몰리의 판매가는  판매원가 + 최대 50%(상품 하자 및 반품책임 수수료) + 무게에 따른 배송비를 포함하여 <span class="color_black">구매대행 형식</span>으로 판매를 진행합니다.</span>
                </li>

                <li>
                  <div class="tit">배송방법</div>
                  <div class="body">{{ (product.delivery_info) ? product.delivery_info.delivery_method_str : '' }}</div>
                </li>
                <li>
                  <div class="tit">배송비</div>
                  <div class="body">
                    <div v-if="product.delivery_info && (product.delivery_info.default_fee > 0)">
                      {{ product.delivery_info.default_fee | comma }}원
                      <span>{{ (product.delivery_info) ? product.delivery_info.fee_pay_method_str : '' }}</span>
                    </div>
                    <div v-else>무료배송</div>
                  </div>
                </li>
                <li>
                  <div class="tit">적립금</div>
                  <div class="body" v-if="product.discount_price">
                   <em class="color_main_01">{{ Math.floor(product.discount_price * product.saving_rate / 100) | comma }}</em> point (<em class="color_main_01">{{ product.saving_rate }}</em>%적립)
                  </div>
                  <div class="body" v-else>
                    {{ Math.floor(product.price * product.saving_rate / 100) | comma }} point ({{ product.saving_rate }}%적립)
                  </div>
                </li>
                <!-- 하단은 옵션-->

                <!-- *** 옵션 START *** -->
                <li v-for="(productOption, index) in options" :key="productOption.name" class="v-select_wrap">
                  <div class="tit">{{ productOption.name }}</div>
                  <div class="body" @mouseleave="hiddenOptionPreview">
                    <vue-select :options="productOption.option_values" placeholder="옵션을 선택하세요." label="value" :searchable="false"
                              v-model="selectedOptionValues[index]" @input="changeOption(index)">
                      <!-- 옵션 리스트 -->
                      <template v-slot:option="option">
                        <div @mouseenter="product.use_option_image && option.image ? showOptionPreview(option) : ''" class="option_list_wrap">
                          <div class="img_wrap">
                            <DefaultImage :imageUrl="option.image" v-if="product.use_option_image && option.image"/>
                          </div>
                          <span>{{ option.value }}</span>
                          <template v-if="option.additionalPrice && option.additionalPrice !== 0">
                            <span>({{ option.additionalPrice > 0 ? '+' : '' }}{{ option.additionalPrice | comma }}원)</span>
                          </template>
                          {{ (option.isSoldOut) ? '[품절]' : '' }}
                        </div>
                      </template>
                      <!-- 옵션이 없는 경우 -->
                      <div slot="no-options">상위 옵션을 선택해주세요.</div>
                      <!-- 선택된 옵션 보여지는 부분 -->
                      <template #selected-option-container="{ option }">
                        <div class="vs__selected">
                          {{ option.value }}
                          <template v-if="option.additionalPrice && option.additionalPrice !== 0">
                            ({{ option.additionalPrice > 0 ? '+' : '' }}{{ option.additionalPrice | comma }}원)
                          </template>
                        </div>
                      </template>
                    </vue-select>
                  </div>
                </li>
              </template>
              <!-- *** 옵션 END *** -->
            </ul>

            <!-- *** 선택한 옵션 START *** -->
            <!-- 판매중이 아닐 시 상품 옵션 정보는 보여주지 않음 -->
            <ul class="top_info_wrap__right__option_list" v-if="product.is_sale && !product.display_only">
              <li v-for="(selectedItem, index) in selectedOptionCompositions">
                <div class="top_info_wrap__right__option_list__wrap">
                <div class="top_info_wrap__right__option_list__title">
                  {{ selectedItem.value }}
                  <template v-if="selectedItem.additional_price && selectedItem.additional_price > 0">
                   <em class="color_gray_70 m_l_5">추가금액 (+{{ selectedItem.additional_price | comma }}원)</em>
                  </template>
                </div>

                <div class="top_info_wrap__right__option_list__icon" v-show="product.option_type !== 'NONE'">
                  <a @click="delSelectedOption(index)">
                    <img alt="닫기 아이콘" src="@/assets/img/user/icon/main_close_icon.png">
                  </a>
                </div>

                  <div class="total_price_wrap__number">
                    <div class="product-count">
                      <a class="minus_but" @click="decAmount" :index="index"></a>
                      <input type="number" class="count-textbox" :value="selectedItem.amount" :index="index"
                             @change="changeOptionAmount">
                      <a class="plus_but" @click="incAmount" :index="index"></a>
                    </div>
                  </div>
                <div class="total_price_wrap__price pull-right">{{ selectedItem.price * selectedItem.amount | comma }}원</div>
                </div>
              </li>
            </ul>
            <!-- *** 선택한 옵션 END *** -->

            <!-- *** 주문금액 START *** -->
            <!-- 판매중이 아닐 시 상품 주문금액 정보는 보여주지 않음 -->
            <div class="total_area m_b_20" v-if="product.is_sale && !product.display_only">
              <div>총 주문금액</div>
              <div class="pull-right font_24">
                <b class="color_main_01">{{ selectedTotalPrice | comma }}</b>원 (<b class="color_main_01">{{ selectedTotalAmount | comma }}</b>개)
              </div>
            </div>
            <!-- *** 주문금액 END *** -->

            <!-- *** 가격비교 버튼 start *** -->
            <div class="price_compare_btn_wrap" v-if="product.product_price_group_id">
              <nuxt-link :to="`/price_group/${product.id}`" class="price_compare">비슷한 상품 가격 비교하기!</nuxt-link>
            </div>
            <!-- *** 가격비교 버튼 End *** -->

            <!-- *** 상품상태[판매중] START *** -->
            <template v-if="product.is_sale">
              <!-- *** 구매하기 버튼 START *** -->
              <div class="product_btn_wrap">
                <a v-if="!product.display_only" class="gray_line_but" @click="addCarts()">장바구니 담기</a>
                <template v-if="sale_type === '011'"><!-- 몰리판매불가 x, 해외상품여부 o, 링크있음 o -->
                  <a class="line_but line_h_18" :href="product.detail_url" target="_blank">
                      <template v-if="product.abroad_price && product.abroad_price.price > 0">
                        <b>{{ product.abroad_price.price | comma }}</b> 원에 직구하기
                        <div class="guide_txt">옵션에 따라 금액이 바뀔 수 있습니다.</div>
                      </template>
                      <template v-else>
                        <em>-</em>
                        <div class="guide_txt">옵션에 따라 금액이 바뀔 수 있습니다.</div>
                      </template>
                  </a>
                  <a @click="buy()">몰리에서 구매하기</a>
                </template>
                <template v-else-if="sale_type === '010'"><!-- 몰리판매불가 x, 해외상품여부 o, 링크있음 x -->
                  <a @click="buy()">몰리에서 구매하기</a>
                </template>
                <template v-else-if="sale_type === '000'"><!-- 몰리판매불가 x, 해외상품여부 x, 링크있음 x -->
                  <a @click="buy()">몰리에서 구매하기</a>
                </template>
                <template v-else-if="sale_type === '001'"><!-- 몰리판매불가 x, 해외상품여부 x, 링크있음 o -->
                  <a class="line_but line_h_18" :href="product.detail_url" target="_blank">
                    <template v-if="product.abroad_price && product.abroad_price.price > 0">
                      <b>{{ product.abroad_price.price | comma }}</b> 원에 구매하러가기
                      <div class="guide_txt">옵션에 따라 금액이 바뀔 수 있습니다.</div>
                    </template>
                    <template v-else>
                      <em>-</em>
                      <div class="guide_txt">옵션에 따라 금액이 바뀔 수 있습니다.</div>
                    </template>
                  </a>
                  <a @click="buy()">몰리에서 구매하기</a>
                </template>
                <template v-else-if="sale_type === '111'"><!-- 몰리판매불가 o, 해외상품여부 o, 링크있음 o -->
                  <a class="line_but line_h_18" :href="product.detail_url" target="_blank">
                    <template v-if="product.abroad_price && product.abroad_price.price > 0">
                      <b>{{ product.abroad_price.price | comma }}</b> 원에 직구하기
                      <div class="guide_txt">옵션에 따라 금액이 바뀔 수 있습니다.</div>
                    </template>
                    <template v-else>
                      <em>-</em>
                      <div class="guide_txt">옵션에 따라 금액이 바뀔 수 있습니다.</div>
                    </template>
                  </a>
                </template>
                <template v-else-if="sale_type === '101'"><!-- 몰리판매불가 o, 해외상품여부 x, 링크있음 o -->
                  <a class="line_but line_h_18" :href="product.detail_url" target="_blank">
                    <template v-if="product.abroad_price && product.abroad_price.price > 0">
                      <b>{{ product.abroad_price.price | comma }}</b> 원에 구매하러가기
                      <div class="guide_txt">옵션에 따라 금액이 바뀔 수 있습니다.</div>
                    </template>
                    <template v-else>
                      <em>-</em>
                      <div class="guide_txt">옵션에 따라 금액이 바뀔 수 있습니다.</div>
                    </template>
                  </a>
                </template>
              </div>

              <!-- *** 네이버페이 버튼 START *** -->
              <div class="naver_btn_wrap">
                <div id="naverPayWrap" style="float: right; margin-top: 10px;"></div>
              </div>
              <!-- *** 네이버페이 버튼 END *** -->
              <!-- *** 구매하기 버튼 END *** -->
            </template>
            <!-- *** 상품상태[판매중] END *** -->

            <!-- *** 상품상태[판매중지] START (판매중지 표시)*** -->
            <template v-else>
              <div class="product_btn_wrap m_t_20">
                <span class="unsell_product">판매중지된 상품입니다.</span>
              </div>
            </template>
            <!-- *** 상품상태[판매중지] END *** -->

          </div>
        </div>

        <!-- 하단 상세이미지 부분-->
        <div class="bottom_info_wrap" sticky-container>

          <!-- 왼쪽-->
          <div class="bottom_info_wrap_left">

            <!-- 관련상품 todo: 2/3차 개발 -->
<!--            <div>-->
<!--              <div class="list_title_wrap"><span>관련상품</span></div>-->
<!--              <ul class="bottom_info_wrap_left__relation_product_wrap">-->
<!--                <li>-->
<!--                  <div class="bottom_info_wrap_left__relation_product_wrap__img_wrap">-->
<!--                    <img alt="기본 이미지" src="assets/img/product_default_img.png">-->
<!--                  </div>-->
<!--                  <div>-->
<!--                    플라워 드레스 001-->
<!--                    플라워 드레스 001-->
<!--                  </div>-->
<!--                  <div class="color_main_01"><b>32,000원</b></div>-->
<!--                </li>-->
<!--              </ul>-->
<!--            </div>-->

            <!-- 탭메뉴 START -->
            <scrollactive class="my-nav text-center" :active-class="'on'" :modify-url="false" id="review">
              <ul class="tab_detail_content">
                <li class="on"><a href="#review" class="scrollactive-item">상품 구매리뷰 <span>({{ product.total_review_count + product.abroad_total_review_count | kUnit | comma }})</span></a></li>
                <li><a href="#detail" class="scrollactive-item">상품상세</a></li>
                <li><a href="#exchange" class="scrollactive-item">반품/교환정보</a></li>
                <li><a href="#question" class="scrollactive-item">상품문의 <span>({{ questionTotalCount | comma }})</span></a></li>
              </ul>
            </scrollactive>
            <!-- 탭메뉴 END -->

            <!-- 상품리뷰 START -->
            <product-review :product="this.product"/>
            <!-- 상품리뷰 END -->

            <!-- 해외상품정보고시 (상단) START -->
            <div v-if="product.is_show_abroad_template && product.ntc_list.ABRD_PRDCT_TOP_NTC">
              <div class="product_title"><span>해외상품정보고시</span></div>
              <SummernoteEditor :preview="true" summernoteId="templateAPTN" :detailContent="product.ntc_list.ABRD_PRDCT_TOP_NTC.content"
                                :detailImageArr="product.ntc_list.ABRD_PRDCT_TOP_NTC.images" />
            </div>
            <!-- 해외상품정보고시 (상단) END -->

            <!-- 상세페이지 내용 START -->
            <scrollactive class="my-nav text-center" :active-class="'on'" :modify-url="false" id="detail">
              <ul class="tab_detail_content">
                <li><a href="#review" class="scrollactive-item">상품 구매리뷰 <span>({{ reviewTotalCount | kUnit | comma }})</span></a></li>
                <li class="on"><a href="#detail" class="scrollactive-item">상품상세</a></li>
                <li><a href="#exchange" class="scrollactive-item">반품/교환정보</a></li>
                <li><a href="#question" class="scrollactive-item">상품문의 <span>({{ questionTotalCount | comma}})</span></a></li>
              </ul>
            </scrollactive>

            <div class="detail_wrap">
              <SummernoteEditor :preview="true" summernoteId="productDetail" :detailContent="product.content" :detailImageArr="product.detail_images" />
            </div>
            <!-- 상세페이지 내용 END -->

            <!-- 해외상품정보고시 (하단) START -->
            <div v-if="product.is_show_abroad_template && product.ntc_list.ABRD_PRDCT_BTM_NTC">
              <div class="product_title"><span>해외상품정보고시</span></div>
              <SummernoteEditor :preview="true" summernoteId="templateAPBN" :detailContent="product.ntc_list.ABRD_PRDCT_BTM_NTC.content"
                                :detailImageArr="product.ntc_list.ABRD_PRDCT_BTM_NTC.images" />
            </div>
            <!-- 해외상품정보고시 (하단) END -->

            <!-- 상품 정보 제공 고시 내용 START -->
            <div v-if="product.ntc_list && product.ntc_list.PRDCT_NTC">
              <div class="product_title"><span>상품 정보 제공 고시</span></div>
              <SummernoteEditor :preview="true" summernoteId="templatePN" :detailContent="product.ntc_list.PRDCT_NTC.content"
                                :detailImageArr="product.ntc_list.PRDCT_NTC.images" />
            </div>
            <!-- 상품 정보 제공 고시 내용 END -->

            <!-- 배송정보고시 START -->
            <div v-if="product.ntc_list && product.ntc_list.DLVRY_NTC">
              <div class="product_title"><span>배송정보고시</span></div>
              <SummernoteEditor :preview="true" summernoteId="templateDN" :detailContent="product.ntc_list.DLVRY_NTC.content"
                                :detailImageArr="product.ntc_list.DLVRY_NTC.images" />
            </div>
            <!-- 배송정보고시 START -->

            <!-- 반품/교환정보 내용 START -->
            <scrollactive class="my-nav text-center" :active-class="'on'" :modify-url="false" id="exchange">
              <ul class="tab_detail_content">
                <li><a href="#review" class="scrollactive-item">상품 구매리뷰 <span>({{ reviewTotalCount | kUnit | comma }})</span></a></li>
                <li><a href="#detail" class="scrollactive-item">상품상세</a></li>
                <li class="on"><a href="#exchange" class="scrollactive-item">반품/교환정보</a></li>
                <li><a href="#question" class="scrollactive-item">상품문의 <span>({{ questionTotalCount | comma }})</span></a></li>
              </ul>
            </scrollactive>

            <div v-if="product.ntc_list && product.ntc_list.EXCHNG_RTND">
              <div class="product_title m_t_0"><span>반품/교환정보</span></div>
              <SummernoteEditor :preview="true" summernoteId="templateER" :detailContent="product.ntc_list.EXCHNG_RTND.content"
                                :detailImageArr="product.ntc_list.EXCHNG_RTND.images" />
            </div>
            <!-- 반품/교환정보 내용 END -->

            <!-- 상품문의 START -->
            <scrollactive class="my-nav text-center" :active-class="'on'" :modify-url="false" id="question">
              <ul class="tab_detail_content">
                <li><a href="#review" class="scrollactive-item">상품 구매리뷰 <span>({{ reviewTotalCount | kUnit | comma }})</span></a></li>
                <li><a href="#detail" class="scrollactive-item">상품상세</a></li>
                <li><a href="#exchange" class="scrollactive-item">반품/교환정보</a></li>
                <li class="on"><a href="#question" class="scrollactive-item">상품문의 <span>({{ questionTotalCount | comma }})</span></a></li>
              </ul>
            </scrollactive>
            <product-question/>
            <!-- 상품문의 END -->

          </div>

          <!-- 오른쪽에 따라다니는 부분 스티키 -->
          <!-- 판매중이 아닐 시 우측 옵션/구매버튼 영역은 보여주지 않음 -->
          <div class="bottom_info_wrap_right" v-if="product.is_sale && !product.display_only">
            <div class="sticky_option" v-sticky sticky-offset="{top: 80, bottom: 30}" sticky-side="both" on-stick="onStick" sticky-z-index="20">
              <!-- 옵션이 나오는 ul-->
              <ul class="bottom_info_wrap_right__select_wrap">
                <li v-for="(productOption, index) in options" :key="productOption.name" class="v-select_wrap">
                  <vue-select :options="productOption.option_values" placeholder="옵션을 선택하세요." label="value" :searchable="false"
                              v-model="selectedOptionValues[index]" @input="changeOption(index)">
                    <!-- 옵션 리스트 -->
                    <template v-slot:option="option">
                      <!-- todo: (임시코드)이미지 크기 수정해주세요 -->
                      <div class="img_wrap">
                        <DefaultImage :imageUrl="option.image" v-if="product.use_option_image && option.image"/>
                      </div>
                      <span>{{ option.value }}</span>
                      <template v-if="option.additionalPrice && option.additionalPrice !== 0">
                        <span>({{ option.additionalPrice > 0 ? '+' : '' }}{{ option.additionalPrice | comma }}원)</span>
                      </template>
                      {{ (option.isSoldOut) ? '[품절]' : '' }}
                    </template>
                    <!-- 옵션이 없는 경우 -->
                    <div slot="no-options">상위 옵션을 선택해주세요.</div>
                    <!-- 선택된 옵션 보여지는 부분 -->
                    <template #selected-option-container="{ option }">
                      <div class="vs__selected">
                        {{ option.value }}
                        <template v-if="option.additionalPrice && option.additionalPrice !== 0">
                          ({{ option.additionalPrice > 0 ? '+' : '' }}{{ option.additionalPrice | comma }}원)
                        </template>
                      </div>
                    </template>
                  </vue-select>
                </li>
              </ul>

              <!-- *** 선택한 옵션 START *** -->
              <ul class="bottom_info_wrap_right__option_list">
                <!-- 제품 1종류 -->
                <li v-for="(selectedItem, index) in selectedOptionCompositions">
                  <div class="bottom_info_wrap__right__option_list__title">
                    {{ selectedItem.value }}
                    <template v-if="selectedItem.additional_price && selectedItem.additional_price > 0">
                      (+{{ selectedItem.additional_price | comma }}원)
                    </template>
                  </div>

                  <div class="bottom_info_wrap__right__option_list__icon" v-show="product.option_type !== 'NONE'">
                    <a @click="delSelectedOption(index)">
                      <img alt="삭제" src="@/assets/img/user/icon/main_close_icon.png">
                    </a>
                  </div>
                  <div>
                    <div class="total_price_wrap__number">
                      <div class="product-count">
                        <a class="minus_but" @click="decAmount" :index="index"></a>
                        <input type="text" class="count-textbox" :value="selectedItem.amount" :index="index"
                               @change="changeOptionAmount">
                        <a class="plus_but" @click="incAmount" :index="index"></a>
                      </div>
                    </div>
                  </div>
                  <div class="total_price_wrap__price pull-right">{{ selectedItem.price * selectedItem.amount | comma }}원</div>
                </li>
              </ul>
              <!-- *** 선택한 옵션 END *** -->

              <!-- 최종 금액, 최종 제품 갯수-->
              <div class="total_area m_b_20">
                <div><b>주문금액</b></div>
                <div class="pull-right color_main_01">
                  <b>{{ selectedTotalPrice | comma }}원 ({{ selectedTotalAmount | comma }}개)</b>
                </div>
              </div>

              <!-- *** 상품상태[판매중] START *** -->
              <!-- *** 구매하기 버튼 START *** -->
              <div class="but_wrap">
                <a class="gray_line_but" @click="addCarts()">장바구니</a>
                <template v-if="!this.product.display_only"><!-- 몰리판매불가 x -->
                  <a @click="buy()">몰리에서 구매</a>
                </template>
              </div>
              <div class="naver_btn_wrap">
              </div>
              <!-- *** 구매하기 버튼 END *** -->
              <!-- *** 상품상태[판매중] END *** -->
            </div>
          </div>
        </div>

      </div>

    </v-container>
    <Footer :ScrollBtn="true"></Footer>
  </div>
</template>

<script src="@/assets/javascripts/product/_id/index.js"></script>
