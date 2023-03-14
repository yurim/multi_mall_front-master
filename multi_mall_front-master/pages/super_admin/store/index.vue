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
                <li class="page_title"><div>입점 매장 목록</div></li>
                <li>
                  <ul class="flex_wrap index_present_condition">
                    <li v-on:click="searchStoreStatus('ENTR_RQSTD')">
                      <div class="info_wrap">
                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_store_01.png" alt="입점 요청 아이콘">
                        </div>
                        <div class="text_wrap">입점 요청</div>
                        <div class="num_wrap">{{ count.enterRequested }} 건</div>
                      </div>
                    </li>
                    <li v-on:click="searchStoreStatus('NORMAL')">
                      <div class="info_wrap">
                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_store_02.png" alt="총 입점매장 아이콘"></div>
                        <div class="text_wrap">총 입점매장</div>
                        <div class="num_wrap">{{ count.total }} 건</div>
                      </div>
                    </li>
                    <li v-on:click="searchStoreStatus('LEAVE_RQSTD')">
                      <div class="info_wrap">
                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_store_03.png" alt="퇴점 요청 아이콘">
                        </div>
                        <div class="text_wrap">퇴점 요청</div>
                        <div class="num_wrap">{{ count.leaveRequested }} 건</div>
                      </div>
                    </li>
                    <li v-on:click="searchStoreStatus('BLOCKED')">
                      <div class="info_wrap">
                        <div class="img_wrap"><img src="@/assets/img/admin/icon/admin_store_03.png" alt="제재 아이콘">
                        </div>
                        <div class="text_wrap">제재매장</div>
                        <div class="num_wrap">{{ count.blocked }} 건</div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>

              <search-form
                :onSearch="onSearch"
                :onReset="onReset"
              >
              <ul class="search_wrap">
                <li>
                  <div class="title">매장명</div>
                  <div class="body">
                    <search-store-list
                      ref="searchList"
                      :classify="'store_name'"
                      placeholder="매장을 선택해주세요."
                      :items="storeSearchList"
                      :curr-page="storeCurrPage"
                      :page-size="storePageSize"
                      :total-count="storeTotalCount"
                      :selectId="'store_name_select'"
                      :on-change="onChangeStore"
                      :on-reset="onResetStore"
                      key="id"
                      value="name_kor"
                    />
                  </div>
                </li>
                <li>
                  <div class="title">상세검색</div>
                  <div class="body">
                    <search-select-input
                      ref="searchFilterType"
                      :classify="'keyword'"
                      :items="[
                            { text: '전체', value: '' },
                            { text: '매장번호', value: '매장번호', isChecked: false },
                            { text: '대표자명', value: '대표자명', isChecked: false },
                            { text: '연락처', value: '연락처', isChecked: false },
                            { text: '이메일', value: '이메일', isChecked: false },
                          ]"
                      :placeholder="'내용을 입력해주세요.'"
                    ></search-select-input>
                  </div>
                </li>
                <li>
                  <div class="title">소재지</div>
                  <div class="body">
                    <search-select
                      ref="searchFilterSido"
                      :classify="'filter_sido'"
                      :items="[
                        { text: '전국', value: '' },
                        { text: '서울특별시', value: '서울특별시', isChecked: false },
                        { text: '부산광역시', value: '부산광역시', isChecked: false },
                        { text: '대구광역시', value: '대구광역시', isChecked: false },
                        { text: '인천광역시', value: '인천광역시', isChecked: false },
                        { text: '광주광역시', value: '광주광역시', isChecked: false },
                        { text: '대전광역시', value: '대전광역시', isChecked: false },
                        { text: '울산광역시', value: '울산광역시', isChecked: false },
                        { text: '세종특별자치시', value: '세종특별자치시', isChecked: false },
                        { text: '경기도', value: '경기도', isChecked: false },
                        { text: '강원도', value: '강원도', isChecked: false },
                        { text: '충청북도', value: '충청북도', isChecked: false },
                        { text: '충청남도', value: '충청남도', isChecked: false },
                        { text: '전라북도', value: '전라북도', isChecked: false },
                        { text: '전라남도', value: '전라남도', isChecked: false },
                        { text: '경상북도', value: '경상북도', isChecked: false },
                        { text: '경상남도', value: '경상남도', isChecked: false },
                        { text: '제주특별자치도', value: '제주특별자치도', isChecked: false},
                      ]"
                      :onChange="getSidoData"
                    />
                    <search-select
                      v-if="sido && sigunguCodes.length > 0"
                      ref="searchFilterSigungu"
                      :classify="'filter_sigungu'"
                      :items="sigunguCodes"
                      :placeholder="'소재지 입력'"
                    ></search-select>
                    <search-input
                      v-if="sido && sigunguCodes.length > 0"
                      ref="searchFilterAddress"
                      :classify="'filter_address'"
                    />
                  </div>
                </li>
                <li>
                  <div class="title">매장구분</div>
                  <div class="body">
                    <search-checkbox
                      ref="searchStoreType"
                      :classify="'filter_storeType'"
                      :items="[
                            { text: '로드샵', value: 'ROAD', isChecked: true },
                            { text: '인터넷쇼핑몰', value: 'INTERNET', isChecked: true },
                            { text: '디자이너 브랜드', value: 'BRAND', isChecked: true },
                            { text: '해외직구 쇼핑몰', value: 'ABROAD', isChecked: true },
                          ]"
                    ></search-checkbox>
                  </div>
                </li>
                <li>
                  <div class="title">입점형태</div>
                  <div class="body">
                    <search-checkbox
                      ref="searchStoreStateType"
                      :classify="'filter_storeStateType'"
                      :items="[
                        { text: '입점요청', value: 'ENTR_RQSTD', isChecked: true },
                        { text: '입점완료', value: 'NORMAL', isChecked: true },
                        { text: '퇴점요청', value: 'LEAVE_RQSTD', isChecked: true },
                        { text: '퇴점완료', value: 'LEAVED', isChecked: false },
                        { text: '입점거부', value: 'ENTR_RJCT', isChecked: false },
                        { text: '제재매장', value: 'BLOCKED', isChecked: false },
                      ]"
                    ></search-checkbox>
                  </div>
                </li>
                <li>
                  <div class="title">노출상태</div>
                  <div class="body">
                    <search-checkbox
                      ref="searchFilterIsShow"
                      :classify="'filter_isshow'"
                      :items="[
                            { text: '노출', value: true, isChecked: true },
                            { text: '노출안함', value: false, isChecked: true },
                          ]"
                    ></search-checkbox>
                  </div>
                </li>
                <!-- TODO EP연동제외 여부 새로 추가됨 -->
                <li>
                  <div class="title">EP연동제외 여부</div>
                  <div class="body">
                    <div class="checkbox_wrap">
                      <input type="checkbox" id="test_1" checked>
                      <label for="test_1">EP 연동중</label>
                      <input type="checkbox" id="test_2" checked>
                      <label for="test_2">EP 연동 제외</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">해외상품 취급매장</div>
                  <div class="body">
                    <search-checkbox
                      ref="searchFilterAbroad"
                      :classify="'filter_abroad'"
                      :items="[
                            { text: '해외상품 취급매장만 보기', value: true, isChecked: false },
                          ]"
                    ></search-checkbox>
                  </div>
                </li>
              </ul>
              </search-form>

              <ul class="table_wrap">
                <li class="page_title">
                  <div class="pull-left">조회결과 <span>(총 {{ totalCount }}개)</span></div>
                  <div class="square_but_wrap pull-right">
                    <div class="pull-right">
                      <a class="gray_but" @click.prevent="selectDownloadExcel">선택항목 엑셀다운</a>
                      <a class="gray_but" @click.prevent="downloadExcel">전체항목 엑셀다운</a>
                    </div>
                  </div>
                </li>

                <li class="pull-left">
                  <!-- TODO EP 연동 샐랙트 추가됨 -->
                  <div class="only_select_wrap">
                    <select>
                      <option>EP 연동중으로 변경</option>
                      <option>EP 연동제외로 변경</option>
                    </select>
                  </div>
                  <div class="square_but_wrap">
                    <a class="line_but" @click="isShowTrue">노출</a>
                    <a class="line_but" @click="isShowFalse">노출안함</a>
                    <nuxt-link class="pull-right" to="/super_admin/store/new">매장등록</nuxt-link>
                  </div>
                </li>

                <li>
                  <span class="table_size_xs">
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="stores"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    selectType="multi"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td>
                        <span class="text">{{ item.id }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.enter_date }}</span>
                      </td>
                      <td>
                        <span class="text">
                          <nuxt-link :to="`/super_admin/store/${item.id}`">{{ item.name_kor }}{{ item.name_eng ? `(${item.name_eng})` : '' }}</nuxt-link>
                        </span>
                      </td>
                      <td>
                        <span class="text">{{ item.store_type }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.manager_name }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.manager_phone | contact }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.manager_email }}</span>
                      </td>
                      <td>
                        <span class="text">{{ item.address }}</span>
                      </td>
                      <td class="text-center">
                        <span class="text">{{ item.store_state_type }}</span>
                      </td>
                      <td class="text-center">
                        <span class="text" v-if="item.is_show === true">노출</span>
                        <span class="text" v-else>노출안함</span>
                      </td>
                      <td class="text-center">
                        <span class="square_but_wrap">
                          <a v-on:click="routeToStoreAdmin(item.id)" class="line_but">이동</a>
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
<script src="@/assets/javascripts/super_admin/store/index.js"></script>
