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
              <!-- *** 검색 START *** -->
              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
              >
                <ul class="search_wrap">
                  <li class="page_title">
                    <div>외부 상품 연동 목록</div>
                  </li>
                  <li>
                    <div class="title">검색조건</div>
                    <div class="body">
                      <search-select-input
                        ref="searchKeyword"
                        :classify="'keyword'"
                        :items="[
                            { text: '전체', value: '' },
                            { text: '상품명', value: 'name' },
                          ]"
                        :placeholder="'내용을 입력해주세요.'"
                      ></search-select-input>
                    </div>
                  </li>
                  <li>
                    <div class="title">카테고리</div>
                    <div class="body">
                      <search-input
                        ref="searchCategory"
                        :classify="'category'"
                      ></search-input>
                    </div>
                  </li>

                  <li>
                    <div class="title">전송기간</div>
                    <div class="body">
                      <div class="select_date_wrap">
                        <search-date-picker
                          ref="searchDatePicker"
                          dateFormat="YYYY-MM-DDzz"
                        ></search-date-picker>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div class="title">연동대상</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsTransferred"
                        :classify="'linkage_type'"
                        :items="searchLinkageTypes"
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
                          { text: '중복상품만 보기', value: true, isChecked: false }
                        ]"
                      ></search-checkbox>
                    </div>
                  </li>
                </ul>
              </search-form>
              <!-- *** 검색 END *** -->

              <!-- *** 외부 상품 리스트 START *** -->
              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{ totalCount }}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <div class="pull-right">
                      <a href="javascript:;" v-on:click="btnSelectedTransfer">선택상품 등록하기</a>
                    </div>
                  </div>
                </li>

                <li>
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="linkageProducts"
                    :total="totalCount"
                    :defaultPageSize="pageSize"
                    :draggable="false"
                    selectType="multi"
                    :itemKey="'_id'"
                  >
                    <template v-slot:body="{item}">
                      <td>{{ item.name }}</td>
                      <td>{{ (item.linkage_category.full_name) ? item.linkage_category.full_name : item.name }}</td>
                      <td>{{ item.created_at | date }}</td>
                      <td>
                        <template v-if="item.currency_unit.iso !== 'KRW'">
                          {{ item.price | comma }} ({{ item.currency_unit.unit }})
                        </template>
                        <template v-else>-</template>
                      </td>
                      <td>
                        <template v-if="item.currency_unit.iso === 'KRW'">
                          {{ item.price | comma }}
                        </template>
                        <template v-else>-</template>
                      </td>
                      <td>
                        <template v-if="item.currency_unit.iso === 'KRW'">
                          {{ item.discount_price | comma }}
                        </template>
                        <template v-else>-</template>
                      </td>
                      <td>{{ item.is_duplicated ? '중복' : '-' }}</td>
                      <td>{{ item.linkage_type_str }}</td>
                      <td>{{ item.is_abroad ? '해외' : '일반' }}</td>
                    </template>
                  </data-table>
                </li>
              </ul>
              <!-- *** 외부 상품 리스트 END *** -->

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </client-only>
</template>

<script src="@/assets/javascripts/store_admin/product/linkage"></script>
