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
                  <li class="page_title"><div>상품문의</div></li>
                  <li>
                  <li>
                    <div class="title">등록기간</div>
                    <div class="body">
                      <div class="select_date_wrap">
                        <search-date-picker ref="searchDatePicker" />
                      </div>
                    </div>
                  </li>

                  <li>
                    <div class="title">답변여부</div>
                    <div class="body">
                      <search-checkbox
                        ref="searchIsReply"
                        :classify="'is_reply'"
                        :items="[
                          { text: '답변완료', value: true, isChecked: is_reply },
                          { text: '미답변', value: false, isChecked: true },
                        ]"
                      ></search-checkbox>
                    </div>
                  </li>

                  <li>
                    <div class="title">상세검색</div>
                    <div class="body">
                      <div class="select_input_wrap">
                        <search-select-input
                          ref="searchKeyword"
                          :classify="'keyword'"
                          :items="[
                            { text: '전체', value: '', isChecked: false },
                            { text: '상품명', value: 'product_name', isChecked: false },
                            { text: '문의번호', value: 'id', isChecked: false },
                            { text: '상품코드', value: 'product_id', isChecked: false },
                          ]"
                          :placeholder="'내용을 입력해주세요.'"
                        ></search-select-input>
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
                  <span class="table_size_auto">
                    <data-table
                      ref="dataTable"
                      :loading="loading"
                      :headers="headers"
                      :items="qnas"
                      :total="totalCount"
                      :onTableOption="onTableOption"
                      selectType="multi"
                      :defaultPageSize="pageSize"
                      class="word-break"
                    >
                      <template v-slot:body="{item}">
                        <td>
                          <span class="text">
                            <nuxt-link :to="`/product/${item.product_id}`">{{ item.product_id }}</nuxt-link>
                          </span>
                        </td>
                        <td>
                          <span class="text">
                            <nuxt-link :to="`/product/${item.product_id}`">{{ item.product_name }}</nuxt-link>
                          </span>
                        </td>
                        <td><span class="text">{{ item.user_id }}</span></td>
                        <td>
                          <span class="thumbnail_wrap">
                            <DefaultImage :imageUrl="item.product_image" />
                          </span>
                        </td>
                        <td><span class="text"><a @click.prevent="detailQna(item)">{{ item.content }}</a></span></td>
                        <td><span class="text">{{ item.created_at | date }}</span></td>
                        <td><span class="text">{{ item.updated_at | date }}</span></td>
                        <td><span class="text">{{ item.id }}</span></td>
                        <td>
                          <span class="text" v-if="item.is_replied === true">완료</span>
                          <span class="text" v-else-if="item.is_replied === false">미완료</span>
                          </td>
                        <td>
                          <span class="text" v-if="item.is_show === true">노출</span>
                          <span class="text" v-else-if="item.is_show === false">노출 안 함</span>
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
<script src="@/assets/javascripts/store_admin/product/qna/index.js"></script>
