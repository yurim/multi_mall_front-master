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
                <li class="page_title"><div>상품목록</div></li>
                <li>
                  <ul class="flex_wrap index_present_condition">
                    <li>
                      <div class="info_wrap">
                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_product_01.png" alt="전체상품 아이콘" /></div>
                        <div class="text_wrap">전체상품</div>
                        <div class="num_wrap">{{ count.totalCount }} 건</div>
                      </div>
                    </li>
                    <li>
                      <div class="info_wrap">
                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_product_02.png" alt="판매중상품 아이콘" /></div>
                        <div class="text_wrap">판매중</div>
                        <div class="num_wrap">{{ count.isSaleCount }} 건</div>
                      </div>
                    </li>
<!--                    <li>-->
<!--                      <div class="info_wrap">-->
<!--                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_product_03.png" alt="품절상품 아이콘" /></div>-->
<!--                        <div class="text_wrap">품절</div>-->
<!--                        <div class="num_wrap">{{ count.isSoldOutCount }} 건</div>-->
<!--                      </div>-->
<!--                    </li>-->
                    <li>
                      <div class="info_wrap">
                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_product_04.png" alt="재재상품 아이콘" /></div>
                        <div class="text_wrap">상품제재</div>
                        <div class="num_wrap">{{ count.isBlockedCount }} 건</div>
                      </div>
                    </li>
                    <li>
                      <div class="info_wrap">
                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_product_05.png" alt="중복상품 아이콘" /></div>
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
                      <search-category ref="searchCategories" :classify="'categories'" />
                    </div>
                  </li>

                  <li>
                    <div class="title">판매상태</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsSale"
                        :classify="'is_sale'"
                        :items="[
                          { text: '판매중', value: 'true', isChecked: false },
                          { text: '판매중지', value: 'false', isChecked: false },
                          // { text: '품절', value: 'sold_out', isChecked: true },
                          { text: '상품제재', value: 'blocked', isChecked: false },
                        ]"
                      ></search-checkbox>
                    </div>
                  </li>

                  <li>
                    <div class="title">전시상태</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsListed"
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
                        ref="searchIsDiscount"
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
                        ref="searchTarget"
                        :classify="'target'"
                        :items="targets"
                      ></search-checkbox>
                    </div>
                  </li>

                  <li>
                    <div class="title">중복상품</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsDuplicated"
                        :classify="'is_duplicated'"
                        :items="[
                          { text: '중복상품만 보기', value: true, isChecked: false },
                        ]"
                      ></search-checkbox>
                    </div>
                  </li>

                  <!-- <li>
                    <div class="title">자사몰전송</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchFilterMallSend"
                        :classify="'filter_isLink'"
                        :items="[
                          { text: '연동됨', value: true, isChecked: true },
                          { text: '연동안됨', value: false, isChecked: true },
                        ]"
                      ></search-checkbox>
                    </div>
                  </li> -->

                  <li>
                    <div class="title">등록기간</div>
                    <div class="body">
                      <div class="select_date_wrap">
                        <search-date-picker ref="searchDatePicker"></search-date-picker>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div class="title">ep 고정여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsFixedEp"
                        :classify="'is_fixed_ep'"
                        :items="[
                          { text: '고정', value: true, isChecked: true },
                          { text: '미고정', value: false, isChecked: true },
                          { text: '제외', value: 'cannot', isChecked: false },
                        ]"
                      ></search-checkbox>
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
                    <div class="pull-right">
                      <a class="line_but" @click="resizeImage">대표/옵션이미지 사이즈 수정</a>
                      <a class="line_but" @click="recoverDeletedProduct">삭제상품 복구</a>
                      <a class="line_but" @click="updateOptionPrice">옵션 추가금액 형식 변경</a>
                      <div class="square_but_wrap pull-right">
                        <select class="m_r_5" v-model="targetExcelDownloadType">
                          <option v-for="type in excelDownloadTypes" :value="type.key">{{type.text}}</option>
                        </select>
                        <a class="gray_but" @click.prevent="selectDownloadExcel">선택항목 엑셀다운</a>
                        <a class="gray_but" @click.prevent="downloadExcel">전체항목 엑셀다운</a>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="pull-left">
                  <div class="only_select_wrap">
                    <select @change="setIsFixed">
                      <option value="">ep 고정 변경</option>
                      <option value="true">고정</option>
                      <option value="false">미고정</option>
                    </select>
                  </div>
                  <div class="square_but_wrap">
                    <a class="line_but" @click="isSaleTrue">판매중</a>
                    <a class="line_but" @click="isSaleFalse">판매중지</a>
                    <a class="line_but" @click="isListedTrue">전시중</a>
                    <a class="line_but" @click="isListedFalse">전시중지</a>
<!--                    <a class="line_but" @click="selectedBlocked">선택 상품제재</a>-->
                    <a class="line_but" @click="selectedDelete">선택 상품삭제</a>
                    <a class="pull-right" @click="patchProducts">수정저장</a>
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
                    <template v-slot:body="{ item, itemIndex }">
                      <td>
                        <span class="text"
                          ><nuxt-link :to="`/store_admin/product/${item.id}`">{{ $moment(item.created_at).format('YYYY.MM.DD') }}</nuxt-link></span
                        >
                      </td>
                      <td>
                        <span class="text">
                          <nuxt-link :to="`/store_admin/product/${item.id}`">{{ item.id }}</nuxt-link>
                        </span>
                      </td>
                      <td>
                        <span class="text">{{ item.target }}</span>
                      </td>
                      <td>
                        <span class="thumbnail_wrap">
                          <DefaultImage :imageUrl="item.main_image" />
                        </span>
                      </td>
                      <td>
                        <span class="text"><input type="text" v-model="item.name" /></span>
                      </td>
                      <td>
                        <span class="text">{{ item.category }}</span>
                      </td>
                      <td>
                        <span class="text">
                          <select v-model="item.is_fixed_ep">
                            <option :value="true">고정</option>
                            <option :value="false">미고정</option>
                          </select>
                        </span>
                      </td>
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
                          <input type="text" v-model.lazy="item.price" v-on:keyup="comma" @blur="blurPrice(itemIndex, 'price')"/>
                        </span>
                      </td>
                      <td>
                        <span class="text">
                          <input type="text" v-model="item.discount_price" v-on:keyup="comma" @blur="blurPrice(itemIndex, 'discount_price')"/>
                        </span>
                      </td>
                      <td>
                        <span class="text" v-if="item.discount_type.indexOf('NONE') > -1">없음</span>
                        <span class="text" v-else-if="item.discount_type.indexOf('PRICE') > -1">금액</span>
                        <span class="text" v-else-if="item.discount_type.indexOf('PRCNT') > -1">퍼센트</span>
                        <span class="text" v-else>없음</span>
                      </td>
                      <td>
                        <span class="text">{{ item.sale_count ? item.sale_count : 0 }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.like_count ? item.like_count : 0 }}</span>
                      </td>
                      <td>
                        <span class="square_but_wrap">
                          <a type="button" class="line_but" v-if="item.is_blocked">링크</a>
                          <nuxt-link :to="`/product/${item.id}`" v-else>링크</nuxt-link>
                        </span>
                      </td>
                      <td>
                        <span class="square_but_wrap">
                          <a type="button" :href="item.affiliate_url" target="_blank" v-if="item.affiliate_url">링크</a>
                        </span>
                      </td>
                      <td>
                        <span class="text">{{ item.is_blocked ? 'Y' : 'N' }}</span>
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
      <StoreAdminFooter></StoreAdminFooter>
    </div>
  </div>
  </client-only>
</template>
<script src="@/assets/javascripts/store_admin/product/index.js"></script>
