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
                  <td>
                    <div class="address_wrap">
                      <input type="text" placeholder="우편번호" v-model="store.zipcode">
                      <a id="store" @click="postCode">우편번호</a>
                      <input type="text" placeholder="주소" v-model="store.address">
                      <input type="text" placeholder="상세주소" v-model="store.detail_address">
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>고객센터 연락처</th>
                  <td><input type="number" v-model="store.cs_phone"></td>
                </tr>
                <tr>
                  <th>타겟연령층</th>
                  <td>
                    <div class="checkbox_wrap label_line_height">
                      <template v-for="age_target in store.age_target_codes">
                        <input type="checkbox" :id="`target_old_id_${age_target.code}`" v-model="age_target.is_checked">
                        <label :for="`target_old_id_${age_target.code}`">{{age_target.name}}</label>
                      </template>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>대표 상품군</th>
                  <td>
                    <div class="mount_child__btn_wrap pull-left">
                      <div>
                        <select @change="selectedCategories" v-for="(categories, i) in categories_list" :id="i" v-bind:key="i">
                          <option value="">선택</option>
                          <option
                            v-for="category in categories"
                            v-bind:key="category._id"
                            :value="category._id"
                            :name="category.name"
                          >{{ category.name }}</option>
                        </select>
                      </div>
                      <div class="fix"><a @click="addCategoryGroup">추가</a></div>
                    </div>
                    <!--                    선택된 리스트들-->
                    <div class="admin_category w_100 pull-left">
                    <div class="category_list_wrap" v-if="store.represent_categories_list.length > 0">
                      <div v-for="(categoryGroup, i) in store.represent_categories_list" v-bind:key="i">
                        <ul>
                          <li v-for="category in categoryGroup" v-bind:key="category._id" :data-id="category._id">{{ category.name }}</li>
                        </ul>
                        <a @click="deleteCategory(i)">삭제</a>
                      </div>
                    </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>카카오톡 플러스친구 url</th>
                  <td><input type="text" v-model="store.kakao_plus_url"></td>
                </tr>
                <tr>
                  <th>인스타그램 아이디</th>
                  <td><input type="text" v-model="store.instagram_id"></td>
                </tr>
                <tr>
                  <th>매장 프로필 이미지</th>
                  <td>
                    <div class="input_file_wrap">
                      <span class="thumbnail_wrap m_r_10" v-if="profilePreview">
                          <a @click.prevent="deleteImage('profile')" class="del_icon">X</a>
                          <img id="profile_name" :src="profilePreview">
                        </span>
                      <input type="file" id="profile" @change="imageUpload($event)" ref="profile" accept="image/*">
                      <label for="profile">등록</label>
                      <span class="m_l_10 color_main_01">권장 사이즈 : 640 x 640 , 최대 10MB까지 가능</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>매장 프로필 이미지(앱용)</th>
                  <td>
                    <div class="input_file_wrap">
                      <span class="thumbnail_wrap m_r_10" v-if="logo">
                          <a @click.prevent="deleteImage('logo')" class="del_icon">X</a>
                          <img id="logo_name" :src="logoPreview">
                        </span>
                      <input type="file" id="logo" @change="imageUpload($event)" ref="logo" accept="image/*">
                      <label for="logo">등록</label>
                      <span class="m_l_10 color_main_01">
                        권장 사이즈 : 약 2:1비율(미정) , 최대 10MB까지 가능
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>대표상품</th>
                  <td>
                    <table class="show_table">
                      <colgroup>
                        <col width="160">
                        <col>
                      </colgroup>
                      <thead>
                      <tr>
                        <th>이미지</th>
                        <th>상품명</th>
                        <th>할인적용가</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="product in store.represent_products">
                        <td>
                          <span class="thumbnail_wrap m_r_10">
                            <img v-if="product.main_image" alt="기본 이미지" :src="product.main_image">
                            <img v-else alt="기본 이미지" src="@/assets/img/admin/default_img.png">
                          </span>
                        </td>
                        <td>{{product.name}}</td>
                        <td>{{product.discount_price ? product.discount_price : product.price | comma}}</td>
                      </tr>
                      </tbody>
                    </table>
                    <div class="but_wrap text-right m_t_10">
                      <a href="javascript:;" @click="isSetRepresentProduct = !isSetRepresentProduct">상품수정하기</a>
                    </div>
                  </td>
                </tr>

                </tbody>
              </table>

              <div v-if="isSetRepresentProduct" class="m_t_10 m_b_20 p_r_10 d_ib_100">
                <RepresentativeProduct :isSuper="false" :storeId="store.id" :selectedRepresentProductCallback="selectedRepresentProductCallback" />
              </div>

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
                  <td>
                    <div class="address_wrap">
                      <input type="text" placeholder="우편번호" v-model="store.store_return_exchange_address.zipcode">
                      <a id="store_return_exchange_address" @click="postCode">우편번호</a>
                      <input type="text" placeholder="주소" v-model="store.store_return_exchange_address.address">
                      <input type="text" placeholder="상세주소" v-model="store.store_return_exchange_address.detail_address">
                    </div>
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
                  <td class="page_title" colspan="2">반품비용 수령 계좌</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>은행명</th>
                  <td>
                    <div class="address_wrap">
                      <input type="text" v-model="store.store_return_exchange_account_info.bank_name">
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>예금주명</th>
                  <td>
                    <div class="address_wrap">
                      <input type="text" v-model="store.store_return_exchange_account_info.holder_name">
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>계좌번호</th>
                  <td>
                    <div class="address_wrap">
                      <input type="text" v-model="store.store_return_exchange_account_info.account">
                    </div>
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
                  <th>사업자 등록증 이미지</th>
                  <td>
                    <div class="input_file_wrap">
                        <span class="thumbnail_wrap m_r_10" v-if="licensePreview">
                          <a class="del_icon" @click="deleteImage('license')">X</a>
                          <img id="license_name" :src="licensePreview">
                        </span>
                      <input type="file" id="license" ref="license" @change="imageUpload" accept="image/*">
                      <label for="license">등록</label>
                      <span class="m_l_10 color_main_01">권장 사이즈 : 640 x 640, 최대 10MB까지 가능</span>
                    </div>
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
                <a href="javascript:" @click="updateCancel">취소</a>
                <a href="javascript:" class="line_but" @click="updateStore">저장</a>
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

<script src="@/assets/javascripts/store_admin/store/_id/edit/index.js"></script>
