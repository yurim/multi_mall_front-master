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

<!--              <div class="tab_menu_wrap">-->
<!--                  <ul>-->
<!--                    <li><a :class="searchType === 'normal' ? 'on' : ''" @click="clickSearchType('normal')">일반 검색</a></li>-->
<!--                    <li><a :class="searchType === 'code' ? 'on' : ''" @click="clickSearchType('code')">상품코드 검색</a></li>-->
<!--                    <li><a :class="searchType === 'name' ? 'on' : ''" @click="clickSearchType('name')">상품명 검색</a></li>-->
<!--                  </ul>-->
<!--                </div>-->

              <search-form :onSearch="onSearch" :onReset="onReset" v-show="searchType === 'normal'">
                <ul class="search_wrap">
                  <li class="page_title"><div>11번가 상품 연동</div></li>
                  <li>
                    <div class="tab_menu_wrap">
                      <ul>
                        <li><a :class="searchType === 'normal' ? 'on' : ''" @click="clickSearchType('normal')">일반 검색</a></li>
                        <li><a :class="searchType === 'code' ? 'on' : ''" @click="clickSearchType('code')">상품코드 검색</a></li>
                        <li><a :class="searchType === 'name' ? 'on' : ''" @click="clickSearchType('name')">상품명 검색</a></li>
                      </ul>
                    </div>
                  </li>
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
                          { text: '전시중', value: true, isChecked: false },
                          { text: '전시중지', value: false, isChecked: false },
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

<!--                  <li>-->
<!--                    <div class="title">11번가 연동상태</div>-->
<!--                    <div class="body">-->
<!--                      <search-checkbox-->
<!--                        ref="searchSt11Status"-->
<!--                        :classify="'st11_status'"-->
<!--                        :items="Object.keys(st11_status_map).map((key) => ({text: st11_status_map[key], value: key, isChecked: false}))"-->
<!--                      ></search-checkbox>-->
<!--                    </div>-->
<!--                  </li>-->

<!--                  <li>-->
<!--                    <div class="title">11번가 연동 잠금여부</div>-->
<!--                    <div class="body">-->
<!--                      <search-checkbox-->
<!--                        ref="searchSt11IsLocked"-->
<!--                        :classify="'st11_is_locked'"-->
<!--                        :items="[-->
<!--                          { text: '잠금', value: true, isChecked: false },-->
<!--                          { text: '잠금안함', value: false, isChecked: false },-->
<!--                        ]"-->
<!--                      ></search-checkbox>-->
<!--                    </div>-->
<!--                  </li>-->

<!--                  <li>-->
<!--                    <div class="title">11번가 연동 메세지</div>-->
<!--                    <div class="body">-->
<!--                      <search-input-->
<!--                        ref="searchSt11Message"-->
<!--                        :classify="'st11_message'"-->
<!--                        :placeholder="'내용을 입력해주세요.'"-->
<!--                      ></search-input>-->
<!--                    </div>-->
<!--                  </li>-->

<!--                  <li>-->
<!--                    <div class="title">11번가 연동기간</div>-->
<!--                    <div class="body">-->
<!--                      <div class="select_date_wrap">-->
<!--                        <search-date-picker ref="searchDatePicker"></search-date-picker>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </li>-->

                </ul>
              </search-form>
              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
                v-show="searchType === 'code'"
              >
                <ul class="search_wrap">
                  <li class="page_title"><div>11번가 상품 연동</div></li>
                  <li>
                    <div class="tab_menu_wrap">
                      <ul>
                        <li><a :class="searchType === 'normal' ? 'on' : ''" @click="clickSearchType('normal')">일반 검색</a></li>
                        <li><a :class="searchType === 'code' ? 'on' : ''" @click="clickSearchType('code')">상품코드 검색</a></li>
                        <li><a :class="searchType === 'name' ? 'on' : ''" @click="clickSearchType('name')">상품명 검색</a></li>
                      </ul>
                    </div>
                  </li>
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

              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
                v-show="searchType === 'name'"
              >
                <ul class="search_wrap">
                  <li class="page_title"><div>11번가 상품 연동</div></li>
                  <li>
                    <div class="tab_menu_wrap">
                      <ul>
                        <li><a :class="searchType === 'normal' ? 'on' : ''" @click="clickSearchType('normal')">일반 검색</a></li>
                        <li><a :class="searchType === 'code' ? 'on' : ''" @click="clickSearchType('code')">상품코드 검색</a></li>
                        <li><a :class="searchType === 'name' ? 'on' : ''" @click="clickSearchType('name')">상품명 검색</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div class="title">상품명 검색</div>
                    <div class="body">
                      <search-input
                        ref="searchProductName"
                        :classify="'product_name'"
                        :placeholder="'내용을 입력해주세요.'"
                      ></search-input>
                    </div>
                  </li>
                </ul>
              </search-form>

              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">
                    조회결과 <span>(총 {{ totalCount }}개)</span>
                  </div>
                  <div class="square_but_wrap pull-right">
                    <div class="pull-right">
                      <a class="gray_but" @click.prevent="downloadExcelExhibition">기획전 엑셀 다운로드</a>
                    </div>
                  </div>
                </li>

                <li class="pull-left">
                  <div class="only_select_wrap">
                    <select @change="setIsLocked($event)">
                      <option value="">연동잠금설정</option>
                      <option value="true">잠금</option>
                      <option value="false">잠금안함</option>
                    </select>
                  </div>
                  <div class="square_but_wrap">
                    <a class="line_but" @click="clickCreateSt11Product">선택상품 11번가 연동</a>
                    <a class="line_but" @click="clickUpdateSt11Product">기존 설정값으로 재연동</a>
                    <a class="line_but" @click="updateAllSt11Product">연동완료 상품 전체 재연동</a>
                    <a class="pull-right" @click="clickDeleteSt11Product">선택상품 연동 해제</a>
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
                    <template v-slot:body="{ item }">
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
                        <span class="text">{{ item.name }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.category }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.is_sale ? '판매중' : '판매중지' }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.is_listed ? '전시중' : '전시안함' }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.price | comma }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.discount_price | comma }}</span>
                      </td>
                      <td>
                        <span class="square_but_wrap">
                          <a type="button" class="line_but" v-if="item.is_blocked || !item.is_listed">링크</a>
                          <nuxt-link :to="`/product/${item.id}`" class="line_but" v-else>링크</nuxt-link>
                        </span>
                      </td>
                      <td>
                        <span class="text" v-if="item.st11_product">
                          <select v-model="item.st11_product.is_locked" @change="setProductIsLocked(item.st11_product)">
                            <option :value="true">잠금</option>
                            <option :value="false">잠금안함</option>
                          </select>
                        </span>
                      </td>
                      <td>
                        <span class="text" v-if="item.st11_product">{{ st11_status_map[item.st11_product.status] }}</span>
                      </td>
                      <td>
                        <span class="text" v-if="item.st11_product">{{ item.st11_product.message }}</span>
                      </td>
                      <td>
                        <span class="square_but_wrap" v-if="item.st11_product && item.st11_product.st11_remote_uid">
                          <a :href="`http://www.11st.co.kr/products/${item.st11_product.st11_remote_uid}`" target="_blank">링크</a>
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
      <StoreAdminFooter></StoreAdminFooter>
    </div>
  </div>
  </client-only>
</template>

<script src="@/assets/javascripts/store_admin/product/st11"></script>
