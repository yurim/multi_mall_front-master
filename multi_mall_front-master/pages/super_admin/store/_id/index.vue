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
                <li class="page_title"><div>매장정보</div></li>
                <li>
                  <div class="title">매장명</div>
                  <div class="body">{{ store.name_kor }}</div>
                </li>
                <!-- <li>
                  <div class="title">매장명(영문)</div>
                  <div class="body">{{ store.name_eng }}</div>
                </li> -->
                <li>
                  <div class="title">쇼핑몰 URL</div>
                  <div class="body"><a>{{ store.url }}</a></div>
                </li>
                <li>
                  <div class="title">담당자</div>
                  <div class="body">{{ store.manager_name }}</div>
                </li>
                <li>
                  <div class="title">담당자 연락처</div>
                  <div class="body">{{ store.manager_phone | contact }}</div>
                </li>
                <li>
                  <div class="title">매장 형태</div>
                  <div class="body">{{ store.store_type }}</div>
                </li>
                <li>
                  <div class="title">매장 주소</div>
                  <div class="body">({{ store.zipcode }}) {{ store.address }} {{ store.detail_address }}</div>
                </li>
                <li>
                  <div class="title">고객센터 연락처</div>
                  <div class="body">{{ store.cs_phone | contact }}</div>
                </li>
                <li>
                  <div class="title">대표 상품군</div>
                  <div class="body">
                    <div class="category_list_wrap p_t_0" v-if="store.represent_categories_list.length > 0">
                      <div v-for="(represent_categories, i) in store.represent_categories_list" :key="i" style="padding-right: 10px;">
                        <ul>
                          <li v-for="category in represent_categories" :key="category._id">{{ category.name }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">타겟 연령층</div>
                  <div class="body">{{ ageTargetStr }}</div>
                </li>
                <li>
                  <div class="title">카카오톡 플러스 친구 링크</div>
                  <div class="body">{{ store.kakao_plus_url ? store.kakao_plus_url : '' }}</div>
                </li>
                <li>
                  <div class="title">인스타그램 아이디</div>
                  <div class="body">{{ store.instagram_id ? store.instagram_id : '' }}</div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">매장 프로필 이미지</div>
                  <div class="body">
                      <span class="thumbnail_wrap" v-if="store.profile"><DefaultImage :imageUrl="store.profile" /></span>
                  </div>
                </li>
                <li>
                  <div class="title">매장 대표상품 선택<br>(최대 3개)</div>
                  <div class="body">
                    <table>
                      <colgroup>
                        <col width="100">
                        <col>
                        <col width="200">
                      </colgroup>
                      <thead>
                      <tr>
                        <th>이미지</th>
                        <th>상품명</th>
                        <th>할인적용가</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(represent_product, i) in store.represent_products" :key="`product_${i}`">
                        <td>
                          <DefaultImage :imageUrl="represent_product.main_image" />
                        </td>
                        <td>{{ represent_product.name }}</td>
                        <td>{{ represent_product.discount_price ? represent_product.discount_price : represent_product.price | comma }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>담당자 정보</div></li>
                <li>
                  <div class="title">어드민 아이디</div>
                  <div class="body">{{ store.store_admin_email }}</div>
                </li>
                <li>
                  <div class="title">담당자명</div>
                  <div class="body">{{ store.store_admin_name }}</div>
                </li>
                <li>
                  <div class="title">담당자연락처</div>
                  <div class="body">{{ store.store_admin_phone | contact }}</div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>반품/교환 주소</div></li>
                <li>
                  <div class="title">반품/교환지</div>
                  <div class="body">({{ store.store_return_exchange_address.zipcode }}) {{ store.store_return_exchange_address.address }} {{ store.store_return_exchange_address.detail_address }}</div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>반품비용 수령 계좌</div></li>
                <li>
                  <div class="title">은행명</div>
                  <div class="body">{{ store.store_return_exchange_account_info.bank_name }}</div>
                </li>
                <li>
                  <div class="title">예금주명</div>
                  <div class="body">{{ store.store_return_exchange_account_info.holder_name }}</div>
                </li>
                <li>
                  <div class="title">계좌번호</div>
                  <div class="body">{{ store.store_return_exchange_account_info.account }}</div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>사업자 정보</div></li>
                <li>
                  <div class="title">대표자명</div>
                  <div class="body">{{ store.store_business_info.ceo_name }}</div>
                </li>
                <li>
                  <div class="title">상호명</div>
                  <div class="body">{{ store.store_business_info.company_name }}</div>
                </li>
                <li>
                  <div class="title">사업자 등록번호</div>
                  <div class="body">{{ store.store_business_info.license_num | license }}</div>
                </li>
                <li>
                  <div class="title">통신판매 신고번호</div>
                  <div class="body">{{ store.store_business_info.sale_num }}</div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">사업자등록증</div>
                  <div class="body">
                      <span class="thumbnail_wrap">
                        <DefaultImage :imageUrl="store.license_url" />
                      </span>
                  </div>
                </li>
              </ul>

              <ul>
                <li>
                  <div class="title">통신판매업 신고증</div>
                  <div class="body">
                      <span class="thumbnail_wrap">
                        <DefaultImage :imageUrl="store.sale_url" />
                      </span>
                  </div>
                </li>
              </ul>

              <!-- *** 연동 권한 START *** -->
              <ul>
                <li class="page_title">
                  <div>구매/배송대행 권한설정</div>
                </li>
                <li>
                  <div class="title l_h_20">구매/배송대행업체 <br/>선택 가능여부</div>
                  <div class="body">
                    <span v-if="store.agency_selectable">선택 가능</span>
                    <span v-else>선택 불가</span>
                  </div>
                </li>
                <li>
                  <div class="title">11번가 연동여부</div>
                  <div class="body">
                    <span v-if="store.st11_linkable">연동 가능</span>
                    <span v-else>연동 불가</span>
                  </div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>연동권한</div></li>
                <li>
                  <div class="title">상품연동권한</div>
                  <div class="body">
                    <span v-for="(data, i) in store.linkage_auth_list" :key="`title_${data.linkage_type}`">
                      {{data.linkage_name}}<template v-if="i < store.linkage_auth_list.length - 1">, </template>
                    </span>
                  </div>
                </li>
                <li v-for="data in store.linkage_auth_list" :key="`detail_${data.linkage_type}`">
                  <div class="title">{{ data.linkage_name }} 연동권한</div>
                  <div class="body">
                    <div>
                      <span>API KEY: </span><span>{{ data.api_key }}</span>
                    </div>
                    <div v-if="data.is_allowed_all_ip">
                      <span>전체 IP 허용: -</span>
                    </div>
                    <div v-else class="title_info_wrap">
                      <span class="text_title">전체 IP 허용 안함:</span>
                      <div class="text_info">
                        <p v-for="(ip, j) in data.white_list_ips" :key="`white_ip_${j}`">{{ ip }}</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <!-- *** 연동 권한 END *** -->

              <ul>
                <li class="page_title"><div>정산 정보</div></li>
                <li>
                  <div class="title">은행명</div>
                  <div class="body">{{ store.store_balance_account_info.bank_name }}</div>
                </li>
                <li>
                  <div class="title">예금주명</div>
                  <div class="body">{{ store.store_balance_account_info.holder_name }}</div>
                </li>
                <li>
                  <div class="title">계좌번호</div>
                  <div class="body">{{ store.store_balance_account_info.account }}</div>
                </li>
                <li>
                  <div class="title">수수료율</div>
                  <div class="body">{{ store.store_balance_account_info.commission_rate }} %</div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>입점상태변경 내역</div></li>
                <li>
                  <table>
                    <thead>
                    <tr>
                      <th>일시</th>
                      <th>입점상태</th>
                      <th>변경사유</th>
                    </tr>
                    </thead>
                    <tr v-for="his in store.store_state_histories">
                      <td>{{ his.created_at | date }}</td>
                      <td>{{ getStoreStateTypeString(his) }}</td>
                      <td>{{ his.reason }}</td>
                    </tr>
                  </table>
                </li>
              </ul>

              <ul>
                <li v-if="store.store_state_type === '입점요청'"> <!-- 입점요청 상태 -->
                  <div class="title">입점요청</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <nuxt-link class="line_but" :to="`/super_admin/store/edit/${store.id}`">수정</nuxt-link>
                      <a class="line_but" @click="patchStoreStateType('NORMAL')">입점승인</a>
                      <a class="line_but" @click="patchStoreStateType('ENTR_RJCT')">입점거부</a>
                      <nuxt-link to="/super_admin/store" class="line_but">목록</nuxt-link>
                    </div>
                  </div>
                </li>
                <li v-else-if="store.store_state_type === '입점 거부'"> <!-- 입점거부 상태 -->
                  <div class="title">입점거부</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a class="line_but" @click="patchStoreStateType('NORMAL')">입점승인으로 변경</a>
                      <nuxt-link to="/super_admin/store" class="line_but">목록</nuxt-link>
                    </div>
                  </div>
                </li>
                <li v-else-if="store.store_state_type === '정상'"> <!-- 입점완료 상태 -->
                  <div class="title">입점완료</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <nuxt-link class="line_but" :to="`/super_admin/store/edit/${store.id}`">수정</nuxt-link>
                      <a class="line_but" @click="patchStoreStateType('LEAVED')">퇴점처리</a>
                      <a class="line_but" @click="patchStoreStateType('BLOCKED')">매장제재</a>
                      <nuxt-link to="/super_admin/store" class="line_but">목록</nuxt-link>
                    </div>
                  </div>
                </li>
                <li v-else-if="store.store_state_type === '매장 제재'"> <!-- 매장제재 상태 -->
                  <div class="title">매장제재</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a class="line_but" @click="patchStoreStateType('NORMAL')">제재해제</a>
                      <nuxt-link to="/super_admin/store" class="line_but">목록</nuxt-link>
                    </div>
                  </div>
                </li>
                <li v-else-if="store.store_state_type === '퇴점 요청'"> <!-- 퇴점요청 상태 -->
                  <div class="title">퇴점요청</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <a class="line_but" @click="patchStoreStateType('LEAVED')">퇴점완료</a>
                      <nuxt-link to="/super_admin/store" class="line_but">목록</nuxt-link>
                    </div>
                  </div>
                </li>
                <li v-else-if="store.store_state_type === '퇴점'"> <!-- 퇴점완료 상태 -->
                  <div class="title">퇴점완료</div>
                  <div class="body">
                    <div class="small_but_wrap">
                      <nuxt-link to="/super_admin/store" class="line_but">목록</nuxt-link>
                    </div>
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
</template>
<script src="@/assets/javascripts/super_admin/store/_id/index.js"></script>
