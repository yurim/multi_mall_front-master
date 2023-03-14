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
                <li class="page_title"><div>상품목록</div></li>
                <li>
                  <ul class="flex_wrap index_present_condition">
                    <li>
                      <div class="info_wrap">
                        <div class="img_wrap">
                          <img src="@/assets/img/admin/icon/admin_product_01.png" alt="전체상품 아이콘">
                        </div>
                        <div class="text_wrap">전체상품</div>
                        <div class="num_wrap">{{ count.totalCount }} 건</div>
                      </div>
                    </li>
                    <li>
                      <div class="info_wrap">
                        <div class="img_wrap">
                          <img src="@/assets/img/admin/icon/admin_product_02.png" alt="판매중상품 아이콘">
                        </div>
                        <div class="text_wrap">판매중</div>
                        <div class="num_wrap">{{ count.isSaleCount }} 건</div>
                      </div>
                    </li>
<!--                    <li>-->
<!--                      <div class="info_wrap">-->
<!--                        <div class="img_wrap">-->
<!--                          <img src="@/assets/img/admin/icon/admin_product_03.png" alt="품절상품 아이콘">-->
<!--                        </div>-->
<!--                        <div class="text_wrap">품절</div>-->
<!--                        <div class="num_wrap">{{ count.isSoldOutCount }} 건</div>-->
<!--                      </div>-->
<!--                    </li>-->
                    <li>
                      <div class="info_wrap">
                        <div class="img_wrap">
                          <img src="@/assets/img/admin/icon/admin_product_04.png" alt="재재상품 아이콘">
                        </div>
                        <div class="text_wrap">상품제재</div>
                        <div class="num_wrap">{{ count.isBlockedCount }} 건</div>
                      </div>
                    </li>
                    <li>
                      <div class="info_wrap">
                        <div class="img_wrap">
                          <img src="@/assets/img/admin/icon/admin_product_05.png" alt="중복상품 아이콘">
                        </div>
                        <div class="text_wrap">중복상품</div>
                        <div class="num_wrap">{{ count.isDuplicatedCount }} 건</div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>

              <div class="tab_menu_wrap">
                <ul>
                  <li><a :class="searchType === 'normal' ? 'on' : ''" @click="clickSearchType('normal')">일반 검색</a></li>
                  <li><a :class="searchType === 'code' ? 'on' : ''" @click="clickSearchType('code')">상품코드 검색</a></li>
                  <li><a :class="searchType === 'name' ? 'on' : ''" @click="clickSearchType('name')">상품명 검색</a></li>
                </ul>
              </div>

              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
                 v-show="searchType === 'normal'"
              >
                <ul class="search_wrap">
                  <li>
                    <div class="title">카테고리</div>
                    <div class="body">
                      <search-category
                        ref="searchCategories"
                        :classify="'categories'"
                      />
                    </div>
                  </li>
                  <li>
                    <div class="title">상세검색</div>
                    <div class="body">

                      <search-select-input
                        ref="searchKeyword"
                        :classify="'keyword'"
                        :items="[
                            // { text: '전체', value: '' },
                            // { text: '상품코드', value: 'id' },
                            // { text: '상품명', value: 'name', isChecked: false },
                            { text: '매장명', value: 'store', isChecked: false },
                          ]"
                        :placeholder="'내용을 입력해주세요.'"
                      ></search-select-input>
                    </div>
                  </li>
                  <li>
                    <div class="title">판매상태</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchFilterIsSale"
                        :classify="'is_sale'"
                        :items="[
                            { text: '판매중', value: 'true', isChecked: true },
                            { text: '판매중지', value: 'false', isChecked: true },
                            // { text: '품절', value: 'sold_out', isChecked: true }, // TODO 추후 추가
                            { text: '상품제재', value: 'blocked', isChecked: false },
                          ]"
                      ></search-checkbox>
                    </div>
                  </li>
                  <li>
                    <div class="title">전시상태</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchFilterIsListed"
                        :classify="'is_listed'"
                        :items="[
                            { text: '전시중', value: true, isChecked: true },
                            { text: '전시중지', value: false, isChecked: true },
                          ]"
                      ></search-checkbox>
                    </div>
                  </li>
                  <li>
                    <div class="title">할인여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchFilterIsDiscount"
                        :classify="'is_discount'"
                        :items="[
                            { text: '할인중', value: true, isChecked: true },
                            { text: '할인안함', value: false, isChecked: true },
                          ]"
                      ></search-checkbox>
                    </div>
                  </li>
                  <li>
                    <div class="title">상품구분</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchFilterIsTarget"
                        :classify="'target'"
                        :items="targets"
                      ></search-checkbox>
                    </div>
                  </li>
                  <li>
                    <div class="title">EP연동 여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsFixedEp"
                        :classify="'is_fixed_ep'"
                        :items="[
                          { text: 'EP연동 고정', value: true, isChecked: true },
                          { text: 'EP연동 미고정', value: false, isChecked: true },
                          { text: 'EP연동 제외', value: 'cannot', isChecked: false },
                        ]"
                      ></search-checkbox>
                    </div>
                  </li>

                  <li>
                    <div class="title">가격비교 그룹지정 여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsPriceGroup"
                        :classify="'is_price_group'"
                        :items="[
                          { text: '그룹지정 완료', value: true, isChecked: true },
                          { text: '그룹미지정', value: false, isChecked: true },
                          { text: '그룹지정 제외', value: 'cannot', isChecked: false },
                        ]"
                      ></search-checkbox>
                    </div>
                  </li>

                  <li>
                    <div class="title">중복상품</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsFilterIsDuplicated"
                        :classify="'is_duplicated'"
                        :items="[
                            { text: '중복상품만 보기', value: true, isChecked: false },
                          ]"
                      ></search-checkbox>
                    </div>
                  </li>
                  <li>
                    <div class="title">등록기간</div>
                    <div class="body">
                      <div class="select_date_wrap">
                        <search-date-picker ref="searchDatePicker" />
                      </div>
                    </div>
                  </li>
                </ul>
              </search-form>
              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
                 v-show="searchType === 'name'"
              >
                <ul class="search_wrap">
                  <li>
                    <div class="title">상품명 검색</div>
                    <div class="body">
                      <search-input
                        ref="searchProductName"
                        :classify="'product_name'"
                      ></search-input>
                    </div>
                  </li>
                </ul>
              </search-form>
              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
                 v-show="searchType === 'code'"
              >
                <ul class="search_wrap">
                  <li>
                    <div class="title">상품코드 검색</div>
                    <div class="body">
                      <search-textarea
                        ref="searchProductIds"
                        :classify="'product_ids'"
                        :placeholder="'엔터(Enter)로 구분하여 다중 검색'"
                      ></search-textarea>
                    </div>
                  </li>
                </ul>
              </search-form>

              <ul class="table_wrap">
                <li class="page_title">
                  <div v-if="searchType === 'name'" class="pull-left">조회결과 <span>(총 {{ hitCount }}개)</span></div>
                  <div v-else class="pull-left">조회결과 <span>(총 {{ totalCount }}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <a class="gray_but" @click.prevent="downloadExcel">전체항목 엑셀다운</a>
                  </div>
                  <div class="square_but_wrap pull-right">
                    <a class="gray_but m_r_0" @click.prevent="selectDownloadExcel">선택항목 엑셀다운</a>
                    <select class="m_r_5" v-model="targetExcelDownloadType">
                      <option v-for="type in excelDownloadTypes" :value="type.key">{{type.text}}</option>
                    </select>
                  </div>
                </li>

                <li class="pull-left">
                  <!-- TODO EP 연동 추가됨 -->
                  <div class="only_select_wrap">
                    <select>
                      <option>EP 연동상태 설정</option>
                      <option>EP 연동 고정</option>
                      <option>EP 연동 미고정</option>
                      <option>EP 연동 제외</option>
                    </select>
                  </div>
                  <div class="square_but_wrap">
                    <a class="line_but" @click="isSaleTrue">판매중</a>
                    <a class="line_but" @click="isSaleFalse">판매중지</a>
                    <a class="line_but" @click="isListedTrue">전시중</a>
                    <a class="line_but" @click="isListedFalse">전시중지</a>
                    <a class="line_but" @click="updateCategory">상품 카테고리 일괄 변경</a>
                    <a class="line_but" @click="selectedBlocked">선택 상품제재</a>
                    <a class="red_line_but" @click="selectedDelete">선택 상품삭제</a>
                    <a class="gray_line_but" @click="recoverDeletedProduct">삭제상품 복구</a>
                    <a class="line_but" @click="clickCreatePriceGroup">선택 상품 그룹 생성</a>
                    <!-- TODO PriceGroupChange 팝업 연결만 시킴 -->
                    <a class="line_but" @click="priceGroupChange">기존 가격비교 그룹으로 추가</a>
                    <a class="line_but pull-right" @click="patchProducts">변경사항 저장</a>
                  </div>
                </li>

                <li>
                  <span class="table_size_s">
                    <data-table
                      ref="dataTable"
                      :loading="loading"
                      :headers="headers"
                      :items="products"
                      :total="totalCount"
                      :onTableOption="onTableOption"
                      selectType="multi"
                      :defaultPageSize="pageSize"
                    >
                      <template v-slot:body="{item, itemIndex}">
                        <td>
                          <span class="text"><nuxt-link :to="`/super_admin/product/${item.id}`">{{ $moment(item.created_at).format('YYYY-MM-DD') }}</nuxt-link></span>
                        </td>
                        <td>
                          <span class="text">
                            <nuxt-link :to="`/super_admin/product/${item.id}`">{{ item.id }}</nuxt-link>
                          </span>
                        </td>
                        <td>
                          <span class="text">{{ item.target }}</span>
                        </td>
                        <td>
                          <div v-if="!item.can_price_group">그룹 지정 제외</div>
                          <div class="small_btn_wrap" v-if="item.product_price_group_id">
                            <span class="group_id">{{ item.product_price_group_id }}</span>
                            <nuxt-link :to="`/super_admin/product/price_group/${item.product_price_group_id}`" class="line_but m_l_5">그룹관리</nuxt-link>
                          </div>
                          <div v-else>그룹 미지정</div>
                        </td>
                        <td>
                          <span class="thumbnail_wrap">
                            <DefaultImage :imageUrl="item.main_image" />
                          </span>
                        </td>
                        <td>
                          <span class="text"><input type="text" v-model="item.name"></span>
                        </td>
                        <td>
                          <span class="text">
                            <nuxt-link :to="`/super_admin/store/${item.store_id}`">{{ item.store_name }}</nuxt-link>
                          </span>
                        </td>
                        <td><span class="text">{{ item.category }}</span></td>
                        <td>
                          <span class="text">
                            <select v-model="item.is_sale">
                              <option :value="true">판매중</option>
                              <option :value="false">판매안함</option>
                            </select>
                          </span>
                        </td>
                        <td>
                          <span class="text">
                            <select v-model="item.is_listed">
                              <option :value="true">전시중</option>
                              <option :value="false">전시안함</option>
                            </select>
                          </span>
                        </td>
                        <td>
                          <span class="text">{{ item.is_duplicated ? '중복확인' : '-' }}</span>
                        </td>
                        <td>
                          <span class="text">
                            <input
                              type="text"
                              v-model.lazy="item.price"
                              v-on:keyup="comma"
                              @blur="blurPrice(itemIndex, 'price')"
                            >
                          </span>
                        </td>
                        <td>
                          <span class="text">
                            <input
                              type="text"
                              v-model="item.discount_price"
                              v-on:keyup="comma"
                              @blur="blurPrice(itemIndex, 'discount_price')"
                            >
                          </span>
                        </td>
                        <td>
                          <span class="text" v-if="item.discount_type.indexOf('NONE') > -1">없음</span>
                          <span class="text" v-else-if="item.discount_type.indexOf('PRICE') > -1">금액</span>
                          <span class="text" v-else-if="item.discount_type.indexOf('PRCNT') > -1">퍼센트</span>
                          <span class="text" v-else>없음</span>
                        </td>
                        <td><span class="text">{{ item.sale_count ? item.sale_count : '0' }}</span></td>
                        <td><span class="text">{{ item.like_count ? item.like_count : '0' }}</span></td>
                        <td>
                          <span class="text">
                            <a @click="blockStatusChange(item.id, item.is_blocked)">{{ item.is_blocked ? '제재해제' : '제재' }}</a>
                          </span>
                        </td>
                        <td>
                          <span class="square_but_wrap">
                            <a type="button" class="line_but" v-if="item.is_blocked">링크</a>
                            <nuxt-link :to="`/product/${item.id}`" class="line_but" v-else>링크</nuxt-link>
                          </span>
                        </td>
                        <td>
                          <span class="square_but_wrap">
                            <a type="button" :href="item.affiliate_url" target="_blank" v-if="item.affiliate_url">링크</a>
                          </span>
                        </td>
                      </template>
                    </data-table>
                  </span>
                </li>
              </ul>

            </div>

          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/super_admin/product/index.js"></script>
