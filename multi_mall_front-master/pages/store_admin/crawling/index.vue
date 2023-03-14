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

              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
              >
                <ul class="search_wrap">
                  <li class="page_title">
                    <div>크롤링데이터 목록</div>
                  </li>
                  <li>
                    <div class="title">크롤링 대상</div>
                    <div class="body">
                      <search-select
                        ref="searchTarget"
                        :classify="'target'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '알리익스프레스', value: 'ALI' },
                            { text: '타오바오', value: 'TAOBAO'},
                          ]"
                      ></search-select>
                    </div>
                  </li>
                  <li>
                    <div class="title">카테고리</div>
                    <div class="body">
                      <search-input
                        v-show="false"
                        ref="searchCategory"
                        :classify="'category'"
                      ></search-input>
                      <input type="text" placeholder="검색어를 입력해 주세요."
                             v-on:input="categoryKeyword=$event.target.value"
                             v-on:keyup="searchCategoryKeyword"
                             v-on:click="setVisibleSearchBox"
                             v-click-outside="setInvisibleSearchBox"
                      />
                      <div class="category_search_word_wrap" v-show="isVisibleSearchBox">
                        <div class="search_word_empty" v-if="categoryKeywords.length === 0">카테고리가 없습니다.</div>
                        <ul class="category_search_word_box">
                          <li v-for="keyword in categoryKeywords">
                            <a class="keyword" :id="`${keyword}`" v-on:click="setSearchCategory">{{ keyword }}</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div class="title">상품게시 완료여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsTransferred"
                        :classify="'is_transferred'"
                        :items="[
                            { text: '완료', value: 'true', isChecked: true },
                            { text: '미완료', value: 'false', isChecked: true },
                          ]"
                      ></search-checkbox>
                    </div>
                  </li>

                  <li>
                    <div class="title">크롤링기간</div>
                    <div class="body">
                      <div class="select_date_wrap">
                        <search-date-picker
                          ref="searchDatePicker"
                          dateFormat="YYYY-MM-DDzz"
                          :dateTypes="[
                            { text: '시작일시', value: 'started_at' },
                            { text: '종료일시', value: 'ended_at' },
                          ]"
                        ></search-date-picker>
                      </div>
                    </div>
                  </li>
                </ul>
              </search-form>

              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{ totalCount }}개)</span></div>
                </li>

                <li>
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="scrapInfos"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    :defaultPageSize="pageSize"
                    :draggable="false"
                    :selectable="false"
                  >
                    <template v-slot:body="{item}">
                      <td>
                        <nuxt-link :to="`/store_admin/crawling/${item._id}`" class="text">
                          {{ item.dwhale_scrap_info_id }}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/store_admin/crawling/${item._id}`" class="text">
                          {{ item.target_str }}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/store_admin/crawling/${item._id}`" class="text">
                          {{ item.category.name }}
                        </nuxt-link>
                      </td>
                      <td>
                        <nuxt-link :to="`/store_admin/crawling/${item._id}`" class="text">
                          {{ item.currency_unit.unit }}
                        </nuxt-link>
                      </td>
                      <td><span class="text">{{ item.scrap_page | comma }}</span></td>
                      <td><span class="text">{{ item.started_at | date }}</span></td>
                      <td><span class="text">{{ item.ended_at | date }}</span></td>
                      <td><span class="text">{{ item.scrap_item_num | comma }}</span></td>
                      <td><span class="text">{{ item.transfer_item_num | comma }}</span></td>
                      <td><span class="text">{{ item.is_transferred ? '완료' : '미완료' }}</span></td>
                    </template>
                  </data-table>
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

<script src="@/assets/javascripts/store_admin/crawling/index.js"></script>
