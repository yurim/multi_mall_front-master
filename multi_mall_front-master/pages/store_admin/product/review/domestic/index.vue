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
                  <li class="page_title"><div>국내 상품리뷰 관리</div></li>
                  <li>
                    <div class="title">카테고리</div>
                    <div class="body">
                      <search-category ref="searchCategories" :classify="'categories'" />
                    </div>
                  </li>

                  <li>
                    <div class="title">리뷰작성일</div>
                    <div class="body">
                      <div class="select_date_wrap">
                        <search-date-picker ref="searchDatePicker" />
                      </div>
                    </div>
                  </li>

                  <li>
                    <div class="title">점수</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchReviewScore"
                        :classify="'score'"
                        :items="[
                          { text: '1점', value: '1', isChecked: true},
                          { text: '2점', value: '2', isChecked: true},
                          { text: '3점', value: '3', isChecked: true},
                          { text: '4점', value: '4', isChecked: true},
                          { text: '5점', value: '5', isChecked: true},
                        ]"
                      />
                    </div>
                  </li>

                  <li>
                    <div class="title">답변여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsReply"
                        :classify="'is_reply'"
                        :items="[
                          { text: '답변완료', value: true, isChecked: true },
                          { text: '미답변', value: false, isChecked: true },
                        ]"
                      />
                    </div>
                  </li>

                  <li>
                    <div class="title">리뷰타입</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchReviewType"
                        :classify="'type'"
                        :items="[
                          { text: '포토', value: 'PHOTO', isChecked: true },
                          { text: '텍스트', value: 'TEXT', isChecked: true },
                        ]"
                      />
                    </div>
                  </li>
                  <!-- TODO 2차개발 시 -->
                  <!-- <li>
                    <div class="title">혜택지급여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsBenefit"
                        :classify="'is_benefit'"
                        :items="[
                          { text: '지급함', value: true, isChecked: false },
                          { text: '지급안함', value: false, isChecked: false },
                        ]"
                      />
                    </div>
                  </li> -->

                  <li>
                    <div class="title">베스트리뷰 여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsBest"
                        :classify="'is_best'"
                        :items="[
                          { text: 'Y', value: true, isChecked: true },
                          { text: 'N', value: false, isChecked: true },
                        ]"
                      />
                    </div>
                  </li>

                  <li>
                    <div class="title">상세검색</div>
                    <div class="body">
                      <search-select-input
                        ref="searchSelectInput"
                        :classify="'keyword'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '리뷰글번호', value: 'id', isChecked: false },
                            { text: '상품코드', value: 'product_id', isChecked: false },
                            { text: '상품주문번호', value: 'order_num', isChecked: false },
                          ]"
                        :placeholder="'내용을 입력해주세요.'"
                      ></search-select-input>
                    </div>
                  </li>

                </ul>
              </search-form>

              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{ totalCount }}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <div class="pull-right">
                      <div class="input_file_wrap">
                        <input type="file" id="naver_review_file" v-on:change="uploadNaverReview" accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"/>
                        <label for="naver_review_file" class="gray_but">네이버리뷰 엑셀등록</label>
                      </div>
                    </div>
                    <div class="pull-right">
                      <a class="gray_but" v-on:click="selectDownloadExcel">선택항목 엑셀다운</a>
                      <a class="gray_but" v-on:click="downloadExcel">전체항목 엑셀다운</a>
                    </div>
                  </div>
                </li>

                <li>
                  <span class="table_size_s">
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="reviews"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    selectType="multi"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td><span class="text"><nuxt-link :to="`/store_admin/product/${item.product_id}`">{{ item.product_id }}</nuxt-link></span></td>
                      <td><span class="text"><nuxt-link :to="`/store_admin/product/${item.product_id}`">{{ item.product_name }}</nuxt-link></span></td>
                      <td>
                        <span class="text" v-if="item.review_type === 'PHOTO'">포토</span>
                        <span class="text" v-else>일반</span>
                      </td>
                      <td><span class="text">{{ item.user }}</span></td>
                      <td><span class="text"><a v-on:click="detailReview(item)">{{ item.content }}</a></span></td>
                      <td>
                        <span class="thumbnail_wrap" v-if="item.review_type === 'PHOTO'">
                          <DefaultImage :imageUrl="item.review_image" />
                        </span>
                      </td>
                      <td><span class="text">{{ item.score }}</span></td>
                      <td><span class="text">{{ item.category }}</span></td>
                      <td><span class="text">{{ $moment(item.created_at).format('YYYY-MM-DD') }}</span></td>
                      <td><span class="text">{{ $moment(item.updated_at).format('YYYY-MM-DD') }}</span></td>
                      <td>
                        <span class="text" v-if="item.is_best">Y</span>
                        <span class="text" v-else>N</span>
                      </td>
                      <td><span class="text">{{ item.order_num }}</span></td>
                      <td><span class="text">{{ item.id }}</span></td>
                      <td>
                        <span class="text" v-if="item.is_replied">답변완료</span>
                        <span class="text" v-else>미답변</span>
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
<script src="@/assets/javascripts/store_admin/product/review/domestic/index.js"></script>
