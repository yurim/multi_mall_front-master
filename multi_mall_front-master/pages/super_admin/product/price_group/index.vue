<template>
  <client-only>
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
                    <div>조회결과</div>
                  </li>
                  <li>
                    <ul class="flex_wrap index_present_condition">
                      <li class="text-left m_l_20">
                        <div class="info_wrap">
                          <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_product_06.png" alt="가격비교 아이콘"/>
                          </div>
                          <div class="text_wrap">가격비교 그룹</div>
                          <div class="num_wrap">{{ totalCount }}</div>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>

                <div class="tab_menu_wrap">
                  <ul>
                    <li><a :class="searchType === 'normal' ? 'on' : ''" @click="clickSearchType('normal')">일반 검색</a></li>
                    <li><a :class="searchType === 'code' ? 'on' : ''" @click="clickSearchType('code')">그룹번호 검색</a></li>
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
                      <div class="title">그룹생성기간</div>
                      <div class="body">
                        <div class="select_date_wrap">
                          <search-date-picker ref="searchDatePicker"></search-date-picker>
                        </div>
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
                      <div class="title">그룹번호</div>
                      <div class="body">
                        <search-textarea
                        ref="searchGroupIds"
                        :classify="'group_ids'"
                        :placeholder="'엔터(Enter)로 구분하여 다중 검색'"
                      ></search-textarea>
                      </div>
                    </li>
                  </ul>
                </search-form>

                <ul class="table_wrap">
                  <li class="page_title">
                    <div class="pull-left">조회결과 <span>(총 {{ totalCount }}개)</span></div>
                  </li>
                  <li class="pull-left">
                    <div class="square_but_wrap">
                      <nuxt-link to="/super_admin/product/price_group/new" class="line_but">새 그룹 생성</nuxt-link>
                    </div>
                  </li>
                  <li>
                    <div class="table_scroll_m">
                      <data-table
                        ref="dataTable"
                        :loading="loading"
                        :headers="headers"
                        :items="priceGroups"
                        :total="totalCount"
                        :onTableOption="onTableOption"
                        :defaultPageSize="pageSize"
                      >
                        <template v-slot:body="{item}">
                          <td>
                            <span class="text">
                              <nuxt-link :to="`/super_admin/product/price_group/${item.id}`">{{ item.id }}</nuxt-link>
                            </span>
                          </td>
                          <td>
                            <div class="square_but_wrap">
                              <nuxt-link :to="`/super_admin/product/price_group/${item.id}`" class="line_but">그룹 관리</nuxt-link>
                            </div>
                          </td>
                          <td>
                            <span class="text">{{ $moment(item.created_at).format('YYYY-MM-DD') }}</span>
                          </td>
                          <td>
                            <span class="text">{{ item.group_product_ids.length }}</span>
                          </td>
                          <td>
                            <span class="thumbnail_wrap">
                                <DefaultImage :imageUrl="item.image"/>
<!--                              <nuxt-link :to="`/super_admin/product/${item.lowest_product_id}`">-->
<!--                              </nuxt-link>-->
                            </span>
                          </td>
                          <td>
                            <span class="text">{{ item.sort_price | comma }}</span>
                          </td>
                          <td>
                            <span class="text">
                              <nuxt-link :to="`/super_admin/store/${item.store_id}`">{{ item.store_name }}</nuxt-link>
                            </span>
                          </td>
                          <td>
                            <span class="text">{{ item.category }}</span>
                          </td>
                          <td>
                            <span class="text">
                              <nuxt-link :to="`/super_admin/product/${item.lowest_product_id}`">{{ item.lowest_product_id }}</nuxt-link>
                            </span>
                          </td>
                          <td>
                            <span class="text">
                              <nuxt-link :to="`/super_admin/product/${item.lowest_product_id}`">{{ item.product_name }}</nuxt-link>
                            </span>
                          </td>
                        </template>
                      </data-table>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <SuperAdminFooter></SuperAdminFooter>
      </div>
    </div>
  </client-only>
</template>
<script src="@/assets/javascripts/super_admin/product/price_group/index.js"></script>
