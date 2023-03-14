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

              <table class="show_table">
                <colgroup>
                  <col width="160">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="2">매장 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>매장명(한글)</th>
                  <td>{{store.name_kor}}</td>
                </tr>
                <tr>
                  <th>매장명(영문)</th>
                  <td>{{store.name_eng}}</td>
                </tr>
                <tr>
                  <th>쇼핑몰 URL</th>
                  <td>{{store.url}}</td>
                </tr>
                <tr>
                  <th>담당자</th>
                  <td>{{store.store_admin_name}}</td>
                </tr>
                <tr>
                  <th>담당자 연락처</th>
                  <td>{{store.store_admin_phone}}</td>
                </tr>
                <tr>
                  <th>매장 형태</th>
                  <td>{{store.store_type}}</td>
                </tr>
                <tr>
                  <th>매장 주소</th>
                  <td>{{store.address}} {{store.detail_address}}</td>
                </tr>
                <tr>
                  <th>고객센터 연락처</th>
                  <td>{{store.cs_phone}}</td>
                </tr>
                <tr>
                  <th>타겟연령층</th>
                  <td>
                    <ul>
                      <li>{{store.age_target_codes.filter((v) => v.is_checked).map((v) => v.name).join(', ')}}</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>대표 상품군</th>
                  <td>
                    <div class="category_list_wrap p_t_0" v-if="store.represent_categories_list.length > 0">
                      <div v-for="(represent_categories, i) in store.represent_categories_list" :key="i">
                        <ul class="m_r_20">
                          <li v-for="category in represent_categories" :key="category._id">{{ category.name }}</li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>카카오톡 플러스친구 url</th>
                  <td>{{store.kakao_plus_url}}</td>
                </tr>
                <tr>
                  <th>인스타그램 아이디</th>
                  <td>{{store.instagram_id}}</td>
                </tr>
                <tr>
                  <th>매장 프로필 이미지</th>
                  <td>
                      <span class="thumbnail_wrap m_r_10">
                        <img v-if="profilePreview" alt="매장프로필 이미지" :src="profilePreview">
                        <img v-else alt="기본 이미지" src="@/assets/img/admin/default_img.png">
                      </span>
                  </td>
                </tr>
                <tr>
                  <th>매장 프로필 이미지(앱용)</th>
                  <td>
                      <span class="thumbnail_wrap m_r_10">
                        <img v-if="logo" alt="매장프로필 이미지" :src="logo">
                        <img v-else alt="기본 이미지" src="@/assets/img/admin/default_img.png">
                      </span>
                  </td>
                </tr>

                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="160">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="2">반품/교환 주소</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>반품/교환지</th>
                  <td>{{(store.store_return_exchange_address) ? `${store.store_return_exchange_address.address} ${store.store_return_exchange_address.detail_address}` : ''}}</td>
                </tr>
                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="160">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="2">반품비용 수령 계좌</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>은행명</th>
                  <td>{{(store.store_return_exchange_account_info) ? store.store_return_exchange_account_info.bank_name : ''}}</td>
                </tr>
                <tr>
                  <th>예금주명</th>
                  <td>{{(store.store_return_exchange_account_info) ? store.store_return_exchange_account_info.holder_name : ''}}</td>
                </tr>
                <tr>
                  <th>계좌번호</th>
                  <td>{{(store.store_return_exchange_account_info) ? store.store_return_exchange_account_info.account : ''}}</td>
                </tr>
                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="160">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="2">사업자 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>사업자등록번호</th>
                  <td>{{store.store_business_info.license_num}}</td>
                </tr>
                <tr>
                  <th>상호명</th>
                  <td>{{store.store_business_info.company_name}}</td>
                </tr>
                <tr>
                  <th>통신판매업등록번호</th>
                  <td>{{store.store_business_info.sale_num}}</td>
                </tr>
                <tr>
                  <th>대표자 성명</th>
                  <td>{{store.store_business_info.ceo_name}}</td>
                </tr>

                <tr>
                  <th>사업자 등록증</th>
                  <td>
                      <span class="thumbnail_wrap m_r_10">
                        <img v-if="licensePreview" alt="매장프로필 이미지" :src="licensePreview">
                        <img v-else alt="기본 이미지" src="@/assets/img/admin/default_img.png">
                      </span>
                  </td>
                </tr>
                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="160">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="2">정산 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>은행명</th>
                  <td>{{ (store.store_balance_account_info) ? store.store_balance_account_info.bank_name : '' }}</td>
                </tr>
                <tr>
                  <th>예금주명</th>
                  <td>{{ (store.store_balance_account_info) ? store.store_balance_account_info.holder_name : '' }}</td>
                </tr>
                <tr>
                  <th>계좌번호</th>
                  <td>{{ (store.store_balance_account_info) ? store.store_balance_account_info.account : '' }}</td>
                </tr>
                </tbody>
              </table>

              <div class="but_wrap text-center">
                <nuxt-link :to="`/store_admin/store/${store.id}/edit`" class="line_but">수정</nuxt-link>
                <a v-if="store.store_state_type === 'NORMAL'" href="javascript:" @click="btnStoreLeave">퇴점신청</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StoreAdminFooter></StoreAdminFooter>
    </div>
  </div>
  </client-only>
</template>

<script src="@/assets/javascripts/store_admin/store/_id/index.js"></script>
