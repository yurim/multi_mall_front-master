<template>
  <div class="userWrap">
    <Header></Header>
    <v-container>

      <div>
        <div class="list_title_wrap border_b_dark">
          <span>주문/결제</span>
          <span class="sub_title">{{ isNormalUser ? '회원주문' : '비회원주문' }}</span>
          <span class="order_step_list_wrap ">장바구니 > <span class="color_black">주문/결제</span> > 주문완료</span>
        </div>
      </div>

      <div class="col_wrap m_t_20" sticky-container>
        <div class="col_too">
          <ul class="product_cart_list_wrap line_bottom product_readonly" v-for="storeGroup in storeGroupList">
            <!-- li 1개 = 제품 1개-->
            <li>
              <div class="brand_name_wrap">
                <span>Store : </span><span class="color_main_01 f_bold">{{getFirstObject(storeGroup).store.name_kor}}</span>
              </div>

              <div class="item_list_wrap" v-for="deliveryGroup in storeGroup">
                <div class="product_cart_list_wrap__product_wrap" v-for="productGroup in deliveryGroup">

                  <div class="product_cart_list_wrap__right_wrap w_100">
                    <div class="product_cart_list_wrap__right_wrap__img">
                      <img v-if="getFirstObject(productGroup).product_info.main_image" :src="getFirstObject(productGroup).product_info.main_image">
                      <img v-else alt="제품 이미지" src="@/assets/img/product_default_img.png">
                    </div>
                    <div class="product_cart_list_wrap__right_wrap__title w_calc_normal">
                      <div class="title_wrap">{{getFirstObject(productGroup).product_info.name}}</div>
                      <div class="info_price">
                        <span>판매원가</span>
                        <span class="fs_normal">{{ getFirstObject(productGroup).product_info.price | comma }}원</span>
                        <span><b class="color_main_01">-{{ (1 - (getFirstObject(productGroup).product_info.discount_price / getFirstObject(productGroup).product_info.price)) * 100 | rate }}</b>% 적용</span>
                      </div>
                    </div>
                  </div>

                  <div class="d_ib_100">
                    <ul class="product_cart_list_wrap__price_wrap">
                      <!--                  옵션 1개당 li 1개-->
                      <li v-for="cart in productGroup">
                        <div class="product_cart_list_wrap__price_wrap__title">
                          <div class="order_cart_list">
                            <div class="option">선택 옵션</div>
                            <span class="order_info">{{cart.option_info.option_str_list.join(' / ')}}</span>
                          </div>
                        </div>
                        <div v-if="cart.option_info.additional_price === 0"><em>옵션 추가금액</em> 없음</div>
                        <div v-else><em>옵션 추가금액</em> {{cart.option_info.additional_price | comma}}<em>원</em></div>
                        <div class="right_txt">
                          <span><em>할인적용가</em> <b class="color_main_01">{{ getProductPrice(cart) | comma}}</b>원</span>
                          <span class="total_price_wrap__number">
                            <div class="product-count readonly m_r_0">
                              <span class="m_r_0"><em>수량</em>{{cart.amount | comma}}</span>
                            </div>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                </div>

                  <div class="store_total_price_wrap d_ib_100">

                    <div>
                      <div class="store_total_price_wrap__delivery_fee"><em>배송비 </em>
                        <template v-if="getFirstObject(deliveryGroup).deliveryPrice > 0">
                          {{ getFirstObject(deliveryGroup).deliveryPrice | comma }}원
                          {{ getFirstObject(deliveryGroup).delivery_info.fee_pay_method === 'CSH_DLVRY' ? '(착불)' : '' }}
                        </template>
                        <template v-else>무료배송</template>
                      </div>
                      <div class="store_total_price_wrap__total_price"><em>결제 예정금액</em> <b><span class="color_main_01">{{ getFirstObject(deliveryGroup).totalPrice | comma }}</span>원</b></div>
                    </div>

                  </div>

              </div>

            </li>
          </ul>

          <ul class="shadow_none">
            <li>
              <table class="bg_line">
                <colgroup>
                  <col width="140">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th colspan="3">구매자 정보</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>이름 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="주문자 이름" v-model="user.name"></td>
                </tr>
                <tr>
                  <th>이메일 <span class="color_r">*</span></th>
                  <td>
                    <div class="email_form_wrap">
                      <input type="text" placeholder="주문자 이메일" v-model="email">
                      <span>@</span>
                      <select v-model="emailDomain">
                        <option v-for="domain in emailDomainList" :value="domain">{{ domain }}</option>
                        <option value="">직접입력</option>
                      </select>
                      <input class="w_100 m_t_10" type="text" placeholder="내용을 입력해주세요." v-if="!emailDomain" v-model="emailSelf"/>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>전화번호 <span class="color_r">*</span></th>
                  <td>
                    <div class="d_ib_100 pull-left" :class="{ input_but_two_wrap: !isNormalUser }">
                      <input type="number" placeholder="'-'없이 숫자만 입력" v-model="user.phone" ref="phone">
                      <a href="javascript:;" v-show="!isNormalUser" class="gray_line_light_but" @click="sendSms" ref="send_sms">인증번호 받기</a>
                      <a href="javascript:;" v-show="!isNormalUser" class="gray_line_light_but display_none" @click="editPhone" ref="edit_phone">전화번호 수정</a>
                    </div>
                    <!-- 인증번호 받으면 .display_none 삭제 -->
                    <div class="input_but_wrap d_ib_100 pull-left m_t_10 display_none" ref="auth_num_wrap">
                      <input type="number" placeholder="인증번호" v-model="authNum">
                      <a class="gray_full_light_but" href="javascript:;" @click="checkSms">인증하기</a>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </li>
          </ul>

          <ul class="shadow_none">
            <li>
              <table class="bg_line">
                <colgroup>
                  <col width="140">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th colspan="3">
                    수령자 정보
                    <div class="checkbox_wrap pull-right font_nomal">
                      <input type="checkbox" id="check_receiver" @change="checkReceiver($event)">
                      <label for="check_receiver" class="font_12">주문자 정보와 동일</label>
                    </div>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-show="isNormalUser">
                  <th>배송지 선택 <span class="color_r">*</span></th>
                  <td>
                    <div class="but_wrap">
                      <a href="javascript:;" :class="selectedDeliveryBtnClass('default')" @click="defaultDelivery()">기본</a>
                      <a href="javascript:;" :class="selectedDeliveryBtnClass('new')" @click="newDelivery()">신규</a>
                      <a href="javascript:;" class="gray_line_light_but" @click="popAddressList">목록</a>
                    </div>
                  </td>
                </tr>
                <tr v-show="isNormalUser">
                  <th>배송지명 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="배송지 이름" v-model="delivery.address_name"></td>
                </tr>
                <tr>
                  <th>수령인<span class="color_r">*</span></th>
                  <td><input type="text" placeholder="수령인 이름" v-model="delivery.receiver_name"></td>
                </tr>
                <tr>
                  <th>전화번호 <span class="color_r">*</span></th>
                  <td>
                    <input type="text" placeholder="'-'없이 숫자만 입력" v-model="delivery.phone">
                  </td>
                </tr>
                <tr>
                  <th>전화번호2</th>
                  <td>
                    <input type="text" placeholder="'-'없이 숫자만 입력" v-model="delivery.phone2">
                  </td>
                </tr>
                <tr>
                  <th>배송지 주소 <span class="color_r">*</span></th>
                  <td>
                    <div class="input_but_wrap d_ib_100 pull-left m_b_10">
                      <input type="number" placeholder="우편번호" v-model="delivery.zipcode">
                      <a href="javascript:;" class="gray_full_light_but" @click="searchAddress">우편번호 찾기</a>
                    </div>
                    <div class="input_wrap d_ib_100 pull-left m_b_10">
                      <input type="text" placeholder="주소" v-model="delivery.address">
                    </div>
                    <div class="input_wrap d_ib_100 pull-left m_b_10">
                      <input type="text" placeholder="상세주소" v-model="delivery.detail_address">
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>배송 메모</th>
                  <td>
                    <div class="select_input_wrap">

                      <select v-model="selectedDlvryMsg" @change="selectDlvryMsg">
                        <option v-for="message in deliveryMessageList" :key="message">{{ message }}</option>
                      </select>
                      <input type="text" placeholder="내용을 입력해주세요." v-model="delivery_message">
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </li>
          </ul>

          <ul class="shadow_none">
            <li v-show="isNormalUser">
              <table class="bg_line">
                <colgroup>
                  <col width="140">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th colspan="3">포인트 사용</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>보유 포인트</th>
                  <td><span class="color_main_01">{{ user.current_point | comma }}</span> P</td>
                </tr>
                <tr>
                  <th>사용 포인트</th>
                  <td>
                    <div class="input_but_wrap d_ib_100">
                      <input
                        type="number"
                        placeholder="사용 포인트 입력"
                        @keyup="changeUsingPoint($event)"
                        @focusout="focusoutPoint()"
                        v-model="totalPriceInfo.pointSalePrice">
                      <a href="javascript:;" class="gray_full_light_but" @click="useAllPoint">전액사용</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>잔액 포인트</th>
                  <td>{{ balancePoint | comma }} P</td>
                </tr>
                </tbody>
              </table>
            </li>
          </ul>

          <ul class="shadow_none">
            <li>
              <table class="bg_line">
                <colgroup>
                  <col width="140">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th colspan="3">결제 수단</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td colspan="2">
                    <div class="arrow_radio_wrap">
                      <template v-for="payment in paymentMethods">
                        <input type="radio" :id="`payment_${payment.id}`" v-model="paymentMethod" :value="payment.code" name="payment">
                        <label :for="`payment_${payment.id}`">{{ payment.name }}</label>
                      </template>
                    </div>
                  </td>
                </tr>
<!--                휴대폰 결제는 현재 PG사에서 지원하지 않아 안내 내용 주석처리-->
<!--                <tr>-->
<!--                  <td colspan="2">-->
<!--                    <div class="explain_wrap">-->
<!--                      핸드폰 결제는 통신료 결제와 통합관리로 환불 제약이 있습니다.<br>-->
<!--                      모바일 결제사의 규정에 따라 부분취소 불가하며 취소환불은 당월 (1일-말일)까지만 가능합니다.<br>-->
<!--                      결제일로부터 달이 지난경우 수수료(3.75%) 차감 후 환불 또는 적립금 환불만 가능합니다.<br>-->
<!--                      이점 양해부탁드립니다.-->
<!--                    </div>-->
<!--                  </td>-->
<!--                </tr>-->
                </tbody>
              </table>
            </li>
          </ul>

          <ul v-if="checkAbroadProduct" class="shadow_none">
            <li>
              <table class="bg_line">
                <colgroup>
                  <col width="170">
                </colgroup>
                <thead>
                <tr>
                  <th colspan="3">개인통관고유부호</th>
                </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>개인통관<br/>고유부호 입력 <span class="color_r">*</span></th>
                    <td>
                      <input type="text" placeholder="P로 시작하는 정보 입력" v-model="clearanceNum">
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="color_gray_70">
                      <div class="text_btn_wrap m_b_20">
                        <div>
                          해외직배송 상품은 관세청 통관을 위해 구매고객의 고유식별정보를 판매자에게 제공합니다.
                          개인통관고유부호는 통관시 주민등록번호 대신 사용 가능한 번호로, 관세청 사이트에서 발급받으실 수 있습니다.
                        </div>
                      </div>

                      <div class="but_wrap m_b_20">
                        <a href="https://unipass.customs.go.kr/csp/persIndex.do" class="gray_line_but p_l_30 p_r_30" target="_blank">개인통관부호 발급받기</a>
                      </div>

                      <div class="border_explain_wrap font_14">
                        개인통관고유부호는 해외직배송 상품 통관 시 주민등록번호 대신 사용 가능한 번호로, 개인통관고유부호 발급 사이트에서 발급 받으실 수 있습니다.<br/>
                        <br/>
                        <b>개인통관고유부호 발급방법</b><br/>
                        <br/>
                          1. 개인통관고유부호 발급사이트 방문  https://p.customs.go.kr<br/>
                          2. 사이트 홈 하단에서 이름과 주민등록번호 입력 후 [확인] 클릭<br/>
                          3. 본인인증 진행 (공인인증서 또는 휴대폰 인증으로 진행 가능)<br/>
                          4. 개인통관고유부호 등록 화면에서 6가지 항목 입력<br/>
                          5. 입력 완료되면 P 로 시작하는 개인통관고유부호 발급 완료<br/>
                          6. 발급된 개인통관 고유부호 확인<br/>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="color_gray_70">
                      <div class="checkbox_wrap">
                          <input type="checkbox" id="check_abroad" v-model="termsAgree.abroad">
                          <label for="check_abroad">(필수) 해외직배송 상품의 수입신고를 위한 개인통관고유부호 수집에 동의합니다.</label>
                        </div>
                      <div class="pull-left border_explain_wrap m_t_10 font_14">
                        개인통관고유부호 수집 - 개인통관고유부호는 수입통관 업무처리를 위해 수집하며, 다음 주문 시 사용할 수 있도록 서비스 이용기간 동안 보관합니다.
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="color_gray_70">
                      <div class="checkbox_wrap">
                          <input type="checkbox" id="check_abroad2" v-model="termsAgree.abroad2">
                          <label for="check_abroad2">(필수) 해외직배송 상품의 수입신고를 위한 개인통관고유부호의 판매자 제공에 동의합니다.</label>
                        </div>
                      <div class="pull-left border_explain_wrap font_14 m_t_10">
                        개인통관고유부호 제공 - 수입통관 업무처리를 위해 본 상품 판매자에게 개인통관고유부호를 제공합니다.
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          </ul>

          <ul class="shadow_none">
            <li>
              <table class="bg_line">
                <colgroup>
                  <col width="150">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th colspan="3">이용약관</th>
<!--                  <th colspan="3">개인통관번호/이용약관</th>-->
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td colspan="2" class="color_gray_70">
                    <div class="checkbox_wrap m_b_10">
                      <input type="checkbox" id="check_terms_all" @click="agreeAllTerms($event)">
                      <label for="check_terms_all"><b>모든 이용약관에 동의합니다.</b></label>
                    </div>
                    <div class="text_btn_wrap m_b_10">
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="check_terms_privacy" v-model="termsAgree.privacy">
                        <label for="check_terms_privacy">(필수) 개인정보 처리방침</label>
                      </div>

                      <div class="square_but_wrap">
                        <a class="gray_line_light_but" id="privacy" v-on:click="popTerms('privacy', '개인정보 처리방침')">자세히 보기</a>
                      </div>
                    </div>
                    <div class="text_btn_wrap">
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="check_terms" v-model="termsAgree.terms">
                        <label for="check_terms">(필수) 이용약관</label>
                      </div>

                      <div class="square_but_wrap">
                        <a class="gray_line_light_but" id="terms" v-on:click="popTerms('terms', '이용약관')">자세히 보기</a>
                      </div>
                    </div>
                  </td>
                </tr>
<!--                <tr>-->
<!--                  <td colspan="2"><b>주문자 약관 동의</b></td>-->
<!--                </tr>-->
<!--                <tr>-->
<!--                  <td colspan="2">-->
<!--                    <div class="text_btn_wrap">-->
<!--                      <div class="checkbox_wrap">-->
<!--                        <input type="checkbox" id="check_buyer_terms" v-model="termsAgree.buyer">-->
<!--                        <label for="check_buyer_terms">(필수) 주문자 약관</label>-->
<!--                      </div>-->

<!--                      <div class="square_but_wrap">-->
<!--                        <a href="javascript:;" class="line_but">약관보기</a>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                    <div class="pull-left border_explain_wrap font_14 m_t_20">-->
<!--                      - 개인정보 제3자 제공에 동의 합니다.<br>-->
<!--                      - 결제대행서비스 이용 약관에 동의 합니다.<br>-->
<!--                      - 주문할 상품 설명에 명시된 내용와 사용조건을 확인 하였으며, 취소, 환불규정에 동의 합니다.-->
<!--                    </div>-->
<!--                  </td>-->
<!--                </tr>-->
                </tbody>
              </table>
            </li>
          </ul>

          <div class="but_wrap text-center p_10">
            <a href="javascript:;" @click="makePayment" class="w_100">결제하기</a>
          </div>

        </div>

        <!--        오른쪽 스티키 부분 따라다니는 부분 -->
        <div class="col_one sticky_wrap">
          <div class="sticky_shadow" v-sticky sticky-offset="{top: 80, bottom: 30}" sticky-side="both" on-stick="onStick" sticky-z-index="20">
            <ul class="order_total_list">
              <li class="title">최종 결제 금액</li>
              <li>
                <div class="cart_table_wrap">
                  <table class="none_border">
                    <colgroup>
                      <col width="200">
                      <col width="200">
                    </colgroup>
                    <tbody>
                    <tr>
                      <th>판매원가</th>
                      <td>{{ totalPriceInfo.productPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>배송비</th>
                      <td>{{ totalPriceInfo.deliveryPrice | comma }}원</td>
                    </tr>
                    <tr>
                      <th>할인금액</th>
                      <td v-if="totalPriceInfo.salePrice > 0">
                        - {{ totalPriceInfo.salePrice | comma }}원
                      </td>
                      <td v-else>-</td>
                    </tr>
                    <tr>
                      <th colspan="font_nomal">포인트 할인</th>
                      <td v-if="totalPriceInfo.pointSalePrice > 0">- {{ totalPriceInfo.pointSalePrice | comma }}원</td>
                      <td v-else>-</td>
                    </tr>
                    <!-- TODO 쿠폰할인은 2,3차 개발-->
                    <!--                  <tr>-->
                    <!--                    <th colspan="font_nomal">쿠폰 할인</th>-->
                    <!--                    <td v-if="totalPriceInfo.couponSalePrice > 0">- {{ totalPriceInfo.couponSalePrice | comma }}원</td>-->
                    <!--                    <td v-else>-</td>-->
                    <!--                  </tr>-->
                    </tbody>
                    <tfoot>
                    <tr>
                      <th>총 결제 예정금액</th>
                      <td>
                        <div>
                          <b><span class="price_sale_total">{{ totalPriceInfo.totalPrice | comma }}원 </span></b>({{ totalPriceInfo.totalQuantity | comma }}개)
                        </div>
                      </td>
                    </tr>
                    </tfoot>
                  </table>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </v-container>
    <Footer :ScrollBtn="true" ></Footer>
  </div>
</template>

<script src="@/assets/javascripts/order/index.js"></script>
