<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

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
                    <div>회원관리</div>
                    <div class="square_but_wrap pull-right">
                      <a class="gray_but" @click.prevent="downloadExcel('all')">회원목록 전체 엑셀다운</a>
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
                            { text: '이름', value: 'name', isChecked: false },
                            { text: '연락처', value: 'contact', isChecked: false },
                            { text: '이메일', value: 'email', isChecked: false },
                          ]"
                        :placeholder="'내용을 입력해주세요.'"
                      ></search-select-input>
                    </div>
                  </li>
                  <li>
                    <div class="title">가입기간</div>
                    <div class="body">
                      <div class="select_date_wrap">
                        <search-date-picker
                          ref="searchDatePicker"
                        ></search-date-picker>
                      </div>
                    </div>
                  </li>
                </ul>
              </search-form>
              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{ totalCount }}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <a class="gray_but" @click.prevent="downloadExcel('match')">검색 결과 전체 엑셀다운</a>
                    <a class="gray_but m_r_0" @click.prevent="downloadExcel('select')">선택항목 엑셀다운</a>
                  </div>
                </li>
                <li>
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="users"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    selectType="multi"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td><span class="text">{{ item.created_at }}</span></td>
                      <td><span class="text">{{ item.email }}</span></td>
                      <td><span class="text">{{ item.phone | contact }}</span></td>
                      <td><span class="text"><nuxt-link :to="`/super_admin/user/${item.id}`">{{ item.name }}</nuxt-link></span></td>
                      <td><span class="text"><button @click="benefit(item)">지급</button></span></td>
                      <td>
                        <span class="text" v-if="item.is_dormant === true">휴면</span>
                        <span class="text" v-else>정상</span>
                      </td>
                    </template>
                  </data-table>
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
<script src="@/assets/javascripts/super_admin/user/index.js"></script>
