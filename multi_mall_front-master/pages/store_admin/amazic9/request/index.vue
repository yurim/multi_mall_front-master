<template>
  <client-only>
  <div class="adminWrap">
    <StoreAdminHeader></StoreAdminHeader>
    <StoreAdminSideNav></StoreAdminSideNav>
    <div class="content_wrap">
      <div class="content_box_wrap">
        <div class="col_wrap">
          <div class="col_three">
            <ul class="table_wrap">
              <li class="title">배송대행 신청서 작성</li>
              <li class="page_title">
                <div class="pull-left">수령인 정보</div>
              </li>
              <li>
                <!-- *** 수령인 정보 START *** -->
                <table>
                  <colgroup>
                    <col width="150px">
                    <col>
                    <col width="150px">
                    <col>
                  </colgroup>
                  <tbody class="tbody_group">
                  <tr>
                    <th>*받는 사람 성명</th>
                    <td>
                      <div class="input_but_wrap">
                        <input type="text" v-model="deliveryRequest.kor_name" placeholder="내용을 입력해주세요.">
                        <a href="javascript:;" @click="translateName">번역하기</a>
                      </div>
                    </td>
                    <th>*받는 사람 영문이름</th>
                    <td>
                      <div class="input_but_wrap">
                        <input type="text" v-model="deliveryRequest.eng_name" placeholder="내용을 입력해주세요.">
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>*받는 사람 연락처</th>
                    <td>
                      <div class="input_but_wrap">
                        <input type="text" v-model="deliveryRequest.phone" placeholder="'-'없이 숫자만 입력">
                      </div>
                    </td>
                    <th>*개인통관부호</th>
                    <td>
                      <div class="input_but_wrap">
                        <input type="text" v-model="deliveryRequest.clearance_num" placeholder="내용을 입력해주세요.">
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>*우편번호</th>
                    <td colspan="3">
                      <div class="input_but_wrap">
                        <input type="text" v-model="deliveryRequest.zipcode" @click="searchAddress" placeholder="내용을 입력해주세요." readonly>
                        <a href="javascript:;" @click="searchAddress">우편번호 찾기</a>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>*받는사람 주소</th>
                    <td colspan="3">
                      <div class="input_but_wrap">
                        <input type="text" v-model="deliveryRequest.address" @click="searchAddress" placeholder="내용을 입력해주세요." readonly>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>*상세 주소</th>
                    <td colspan="3">
                      <div class="input_but_wrap">
                        <input type="text" v-model="deliveryRequest.detail_address" placeholder="내용을 입력해주세요.">
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>배송 요청사항</th>
                    <td colspan="3">
                      <div class="input_but_wrap">
                        <input type="text" v-model="deliveryRequest.delivery_note" placeholder="내용을 입력해주세요.">
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <!-- *** 수령인 정보 END *** -->
              </li>
            </ul>
            <ul class="table_wrap">
              <li class="page_title">
                <div class="pull-left">제품정보</div>
              </li>
              <li>
                <!-- *** 제품 정보 item START *** -->
                <table v-for="(deliveryProduct, dpIndex) in deliveryProducts" :key="deliveryProduct.info.order_num">
                  <colgroup>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                  </colgroup>
                  <tbody class="tbody_group">
                  <tr>
                    <th>상품 주문번호</th>
                    <th colspan="2">주문한 상품명</th>
                    <th>주문한 상품옵션</th>
                    <th colspan="2">주문한 상품 이미지</th>
                    <th>주문상태</th>
                  </tr>
                  <tr class="tbody_group_list">
                    <td>
                      <div class="body">
                        <nuxt-link :to="`/store_admin/sales/${deliveryProduct.info.order_num}`" class="text">
                          {{ deliveryProduct.info.order_num }}
                        </nuxt-link>
                      </div>
                    </td>
                    <td colspan="2">
                      <div class="body">
                        <span>{{ (deliveryProduct.info.product.name) ? deliveryProduct.info.product.name : '-' }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="body">
                        <span>{{ deliveryProduct.info.product.option_names }}</span>
                      </div>
                    </td>
                    <td colspan="2">
                      <span class="thumbnail_wrap">
                        <DefaultImage :imageUrl="deliveryProduct.info.product.main_image"/>
                      </span>
                    </td>
                    <td>
                      <div class="body">
                        <span>{{ deliveryProduct.info.order_status_str }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr class="tbody_group_list">
                    <th>
                      <template v-if="deliveryProduct.target !== 'PDD'">*</template>해외 주문번호
                    </th>
                    <th>*품목</th>
                    <th>*제품명(영문)</th>
                    <th>*옵션</th>
                    <th>*구매처(영문)</th>
                    <th>*수량</th>
                    <th>*단가</th>
                  </tr>
                  <tr class="tbody_group_list">
                    <td>
                      <div class="body">
                        <input type="text" v-model="deliveryProduct.order_num">
                      </div>
                    </td>
                    <td class="list_half">
                      <div class="title">품목:</div>
                      <div class="body">
                        <div class="select_wrap">
                          <VueSelectSearch
                            :items="items" :curr-page="itemCurrPage" :page-size="itemPageSize" :total-count="itemTotalCount" :selectId="`${dpIndex}`"
                            :on-change="onChange" :on-reset="onReset" :on-select="onSelect" key="id" value="value"/>
                        </div>
                      </div>
                    </td>
                    <td class="list_half">
                      <div class="title">제품명:</div>
                      <div class="body">
                        <input type="text" v-model="deliveryProduct.eng_name">
                      </div>
                    </td>
                    <td class="list_half">
                      <div class="title">옵션:</div>
                      <div class="body">
                        <input type="text" v-model="deliveryProduct.option">
                      </div>
                    </td>
                    <td>
                      <input type="text" v-model="deliveryProduct.purchase_place">
                    </td>
                    <td>
                      <input type="number" v-model="deliveryProduct.amount" @input="calcTotalPrice">
                    </td>
                    <td class="list_half">
                      <div class="input_wrap">
                        <input type="number" v-model="deliveryProduct.price" @input="calcTotalPrice">
                        <select v-model="deliveryProduct.currency_unit" @change="calcTotalPrice">
                          <option value="">단위 선택</option>
                          <option v-for="currencyUnit in currencyUnits" :key="currencyUnit.id" :value="currencyUnit">{{ currencyUnit.iso }}</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr class="tbody_group_list">
                    <th>*옵션이미지</th>
                    <td colspan="9">
                      <div class="radio_wrap">
                        <input type="radio" :id="`select_option_image_${dpIndex}`" v-model="deliveryProduct.option_image.type" value="select">
                        <label :for="`select_option_image_${dpIndex}`">대표 이미지에서 선택</label>
                        <input type="radio" :id="`upload_option_image_${dpIndex}`" v-model="deliveryProduct.option_image.type" value="upload">
                        <label :for="`upload_option_image_${dpIndex}`">직접 업로드</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 대표이미지 선택 START *** -->
                  <tr class="tbody_group_list" v-if="deliveryProduct.option_image.type === 'select'">
                    <td colspan="9">
                      <ul class="group_list_style">
                        <li v-for="(additional_image, aiIndex) in deliveryProduct.info.product.additional_images" :key="additional_image.order">
                          <div class="title">
                            <div class="radio_wrap">
                              <input type="radio" :id="`${dpIndex}_option_images_${aiIndex}`" v-model="deliveryProduct.selected_option_image" :value="additional_image">
                              <label :for="`${dpIndex}_option_images_${aiIndex}`">
                                <span class="thumbnail_wrap">
                                  <DefaultImage :imageUrl="additional_image.image"/>
                                </span>
                              </label>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <!-- *** 대표이미지 선택 END *** -->
                  <!-- *** 직접 업로드 START *** -->
                  <tr class="tbody_group_list" v-else-if="deliveryProduct.option_image.type === 'upload'">
                    <td colspan="9">
                      <div class="input_file_wrap">
                        <span class="m_r_10">이미지를 업로드 해주세요</span>
                        <span class="thumbnail_wrap m_r_10" v-if="deliveryProduct.option_image.dataUrl">
                            <a class="del_icon" @click="deleteOptionImage(dpIndex)">X</a>
                            <a class="edit_icon" @click="updateOptionImage(dpIndex)">수정</a>
                             <img :src="deliveryProduct.option_image.dataUrl" alt="상품 이미지">
                          </span>
                        <input type="file" :id="`option_image_file_${dpIndex}`" multiple="multiple" accept="image/*"
                               @change="uploadOptionImage($event, dpIndex)">
                        <label :for="`option_image_file_${dpIndex}`" v-if="!deliveryProduct.option_image.dataUrl">첨부파일 등록</label>
                      </div>
                    </td>
                  </tr>
                  <!-- *** 직접 업로드 END *** -->

                  <tr class="tbody_group_list">
                    <th>
                      <template v-if="deliveryProduct.target !== 'PDD'">*</template>해외트래킹넘버
                    </th>
                    <td colspan="8">
                      <input type="text" v-model="deliveryProduct.tracking_num">
                    </td>
                  </tr>
                  <tr class="tbody_group_list">
                    <th>*해외제품 URL</th>
                    <td colspan="8">
                      <input type="text" v-model="deliveryProduct.url">
                    </td>
                  </tr>
                  <tr class="tbody_group_list">
                    <td colspan="9" class="border_none">
                      <div class="color_r">* 핀둬둬 상품일 경우에는 해외주문번호 및 해외 트래킹넘버는 필수 입력사항이 아닙니다.</div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <!-- *** 제품 정보 item END *** -->
              </li>
            </ul>

            <ul class="table_wrap">
              <li class="page_title">
                <div class="pull-left">총 신청 제품 내역</div>
              </li>
              <li>
                <table>
                  <tbody class="tbody_group">
                  <tr>
                    <th>
                      <div class="total">총 제품 수량: <span>{{ totalAmount | comma }}</span></div>
                    </th>
                    <th v-for="(value, key) in totalPrices">
                      <div class="cap">총액({{ key }}): <span>{{ value | comma }}</span></div>
                    </th>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
            <ul class="table_wrap">
              <li class="page_title">
                <div class="pull-left">유형</div>
              </li>
              <li>
                <table>
                  <tbody class="tbody_group">
                  <tr>
                    <td>
                      <ul class="group_list">
                        <li>
                          <div>배송유형</div>
                        </li>
                        <li>
                          <div class="radio_wrap">
                            <template v-for="type in delivery_types">
                              <input type="radio" :id="`delivery_type_${type.key}`" :value="type.key" v-model="deliveryRequest.delivery_type">
                              <label :for="`delivery_type_${type.key}`">{{ type.value }}</label>
                            </template>
                          </div>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
            <ul class="table_wrap">
              <li class="page_title">
                <div class="pull-left">해외배송 규정 및 안내</div>
              </li>
              <li>
                <div class="caution_text">
                  <div>필독!! 신청시 주의사항</div>
                  <div>
                    *아래사항은 필독 사항입니다. 꼭 정독 후 동의 해주시기 바랍니다.<br/>
                    아래에서 명시된 사안으로 피해가 발생될시에는 당사에서 책임지지 않습니다.
                  </div>
                </div>
              </li>
              <li>
                <div class="editor_show_wrap m_b_10" v-html="tempTerms.replace(/\n/g, '<br/>')">
                </div>
                <div class="checkbox_wrap m_b_20">
                  <input type="checkbox" id="terms" v-model="termsAgree">
                  <label for="terms">유의사항을 모두 숙지하였으며, 위약관에 동의합니다.</label>
                </div>
              </li>
            </ul>
            <div class="but_wrap text-center">
              <button class="line_but" @click="$router.go(-1)">취소</button>
              <button @click="requestDelivery">신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <StoreAdminFooter></StoreAdminFooter>
  </div>
  </client-only>
</template>
<script src="assets/javascripts/store_admin/amazic9/request/index.js"></script>
