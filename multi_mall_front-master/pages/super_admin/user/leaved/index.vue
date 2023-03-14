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
                  <li class="page_title">탈퇴한 회원 목록</li>
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
                    <div class="title">탈퇴일</div>
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
                  <div class="pull-left">조회결과 <span>(총 {{ users.length }}개)</span></div>
                </li>
                <li>
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="leavedUsers"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    selectType="multi"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td><span class="text">2020.07.21</span></td>
                      <td><span class="text">{{ item.email }}</span></td>
                      <td><span class="text">{{ item.phone | contact }}</span></td>
                      <td><span class="text">{{ item.name }}</span></td>
                      <td><span class="text">{{ item.reason }}</span></td>
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
<script src="@/assets/javascripts/super_admin/user/leaved/index.js"></script>
