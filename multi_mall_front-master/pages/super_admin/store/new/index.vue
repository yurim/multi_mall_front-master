<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>
      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">
            <form>
              <div class="col_three">
                <ul>
                  <li class="page_title">
                    <div>매장정보</div>
                  </li>
                  <li>
                    <div class="title">매장명<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <input type="text" placeholder="내용을 입력해주세요." v-model.lazy="store.name_kor">
                    </div>
                  </li>
                  <!-- <li>
                    <div class="title">매장명(영문)<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <input type="text" placeholder="내용을 입력해주세요." v-model.lazy="store.name_eng">
                    </div>
                  </li> -->
                  <li>
                    <div class="title">쇼핑몰 URL</div>
                    <div class="body">
                      <input type="text" placeholder="내용을 입력해주세요." v-model.lazy="store.url" @change="isUrl">
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="is_crawling" v-model="store.is_crawling" @click="isCrawling">
                        <label for="is_crawling">크롤링 연동</label>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="title">매장 형태<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="radio_wrap">
                        <template v-for="type in storeTypes">
                          <input type="radio" :id="type.key" :value="type.key" name="storeType"
                                 v-model="store.store_type" :key="type.value">
                          <label :for="type.key" :key="type.key">{{ type.value }}</label>
                        </template>
                      </div>
                      <div class="checkbox_wrap"
                           v-if="store.store_type === 'ROAD' || store.store_type === 'INTERNET' || store.store_type === 'BRAND'">
                        <input type="checkbox" id="has_abroad_product" v-model="store.has_abroad_product">
                        <label for="has_abroad_product">해외제품 취급함</label>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="title">매장 주소<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="address_wrap">
                        <input type="text" placeholder="우편번호" @click="setAddress('store')" v-model="store.zipcode">
                        <a id="store" @click="postCode">우편번호</a>
                        <input type="text" placeholder="주소" @click="setAddress('store')" v-model="store.address">
                        <input type="text" placeholder="상세주소" v-model.lazy="store.detail_address">
                      </div>
                      <div class="color_main_01">매장이 따로 없다면 사업자등록증상의 사업장주소를 입력해주세요.</div>
                    </div>
                  </li>
                  <li>
                    <div class="title">고객센터 연락처<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="number" placeholder="- 를 제외한 번호만 입력해주세요."
                                             v-model.lazy="store.cs_phone"></div>
                  </li>
                  <li>
                    <div class="title">대표 상품군<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="mount_child__btn_wrap">
                        <div>
                          <select @change="selectedCategories" v-for="(categories, i) in categories_list" :id="i"
                                  :key="i">
                            <option value="">선택</option>
                            <option
                              v-for="category in categories"
                              :key="`category_${category._id}`"
                              :value="category._id"
                              :name="category.name"
                            >{{ category.name }}
                            </option>
                          </select>
                        </div>
                        <div class="fix"><a @click="addCategoryGroup">추가</a></div>
                      </div>

                      <div class="category_list_wrap w_100" v-if="store.represent_categories_list.length > 0">
                        <div class="m_r_10" v-for="(categoryGroup, i) in store.represent_categories_list" :key="i">
                          <ul>
                            <li v-for="category in categoryGroup" v-bind:key="category._id">{{ category.name }}</li>
                          </ul>
                          <a v-on:click="deleteCategory(i)">삭제</a>
                        </div>
                      </div>

                    </div>
                  </li>
                  <li>
                    <div class="title">타겟 연령층<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="checkbox_wrap">
                        <template v-for="target in store.age_target_codes">
                          <input type="checkbox" name="targetAge" :id="`${target.name}_${target.code}`"
                                 v-model="target.is_checked" :key="target.name" @change="setTarget">
                          <label :for="`${target.name}_${target.code}`" :key="target.code">{{ target.name }}</label>
                        </template>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="title">카카오톡 플러스 친구 링크</div>
                    <div class="body"><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="store.kakao_plus_url">
                    </div>
                  </li>
                  <li>
                    <div class="title">인스타그램 아이디</div>
                    <div class="body"><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="store.instagram_id">
                    </div>
                  </li>
                </ul>

                <ul>
                  <li>
                    <div class="title">매장 프로필 이미지<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="input_file_wrap">
                        <span class="thumbnail_wrap m_r_10" v-if="profileURL">
                          <a @click.prevent="deleteImage('profile')" class="del_icon">X</a>
                          <img id="profile_name" :src="profileURL">
                        </span>
                        <input type="file" id="profile" @change="imageUpload" accept="image/*">
                        <label for="profile">등록</label>
                        <span class="m_l_10 color_main_01">권장 사이즈 : 640 x 640, 최대 10MB까지 가능</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="title">
                      <div class="text_left">매장 대표상품 선택</div>
                      <span class="text_center">(3개)</span>
                    </div>
                    <div class="body">
                      <span>대표상품은 매장 등록 후 수정하여</span>
                    </div>
                  </li>
                </ul>

                <ul>
                  <li class="page_title">
                    <div>담당자 정보</div>
                  </li>
                  <li>
                    <div class="title">어드민 아이디(이메일)<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="email" placeholder="이메일을 입력해주세요." v-model.lazy="admin.email"></div>
                  </li>
                  <li>
                    <div class="title">어드민 비밀번호<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="password" placeholder="비밀번호를 입력해주세요." v-model.lazy="admin.password">
                    </div>
                  </li>
                  <li>
                    <div class="title">담당자명<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="admin.name"></div>
                  </li>
                  <li>
                    <div class="title">담당자연락처<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="number" placeholder="- 를 제외한 번호만 입력해주세요." v-model.lazy="admin.phone">
                    </div>
                  </li>
                </ul>

                <ul>
                  <li class="page_title">
                    <div>반품/교환 주소</div>
                  </li>
                  <li>
                    <div class="title">반품/교환지<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="address_wrap">
                        <input type="text" placeholder="우편번호" @click="setAddress('return_exchange_address')"
                               v-model="return_exchange_address.zipcode">
                        <a id="return_exchange_address" @click="postCode">우편번호</a>
                        <input type="text" placeholder="주소" @click="setAddress('return_exchange_address')"
                               v-model="return_exchange_address.address">
                        <input type="text" placeholder="상세주소" v-model.lazy="return_exchange_address.detail_address">
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="title">반품/교환 택배사 선택<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <select v-model="return_exchange_address.delivery_company">
                        <option value="">택배사 선택</option>
                        <option v-for="deliveryCompany in deliveryCompanies" :key="deliveryCompany.value"
                                :value="deliveryCompany.key">
                          {{ deliveryCompany.value }}
                        </option>
                      </select>
                    </div>
                  </li>
                </ul>

                <ul>
                  <li class="page_title">
                    <div>반품비용 수령 계좌</div>
                  </li>
                  <li>
                    <div class="title">은행명<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <input type="text" placeholder="은행명" v-model="return_exchange_account_info.bank_name">
                    </div>
                  </li>
                  <li>
                    <div class="title">예금주명<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <input type="text" placeholder="예금주명" v-model="return_exchange_account_info.holder_name">
                    </div>
                  </li>
                  <li>
                    <div class="title">계좌번호<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <input type="number" placeholder="계좌번호" v-model="return_exchange_account_info.account">
                    </div>
                  </li>
                </ul>

                <ul>
                  <li class="page_title">
                    <div>사업자 정보</div>
                  </li>
                  <li>
                    <div class="title">대표자명<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="text" placeholder="내용을 입력해주세요."
                                             v-model.lazy="business_info.ceo_name"></div>
                  </li>
                  <li>
                    <div class="title">상호명<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="text" placeholder="내용을 입력해주세요."
                                             v-model.lazy="business_info.company_name"></div>
                  </li>
                  <li>
                    <div class="title">사업자 등록번호<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="number" placeholder="- 를 제외한 번호만 입력해주세요."
                                             v-model.lazy="business_info.license_num"></div>
                  </li>
                  <li>
                    <div class="title">통신판매 신고번호<span class="color_r">&#42;</span></div>
                    <div class="body"><input type="text" placeholder="- 를 제외한 번호만 입력해주세요."
                                             v-model.lazy="business_info.sale_num"></div>
                  </li>
                </ul>

                <ul>
                  <li class="page_title">
                    <div>구매/배송대행 권한설정</div>
                  </li>
                  <li>
                    <div class="title l_h_20">구매/배송대행업체 <br/>선택 가능여부</div>
                    <div class="body">
                      <div class="radio_wrap">
                        <input type="radio" id="selectable" v-model="agency_auth_info.agency_selectable" :value="true">
                        <label for="selectable">선택 가능</label>
                        <input type="radio" id="not_selectable" v-model="agency_auth_info.agency_selectable" :value="false">
                        <label for="not_selectable">선택 불가</label>
                      </div>
                    </div>
                  </li>
                  <li v-if="agency_auth_info.agency_selectable">
                    <div class="title">11번가 연동 여부</div>
                    <div class="body">
                      <div class="checkbox_wrap pull-left">
                        <input type="checkbox" id="st11_linkable" v-model="agency_auth_info.st11_linkable">
                        <label for="st11_linkable">11번가 연동 가능</label>
                      </div>
                      <div class="text_input_wrap pull-left m_t_0">
                        <div>API KEY :</div>
                        <input type="text" placeholder="API KEY 입력" v-model="agency_auth_info.st11_api_key" :disabled="!agency_auth_info.st11_linkable">
                      </div>
                    </div>
                  </li>
                </ul>

                <ul>
                  <li>
                    <div class="title">사업자등록증<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="input_file_wrap">
                        <span class="thumbnail_wrap m_r_10" v-if="licenseURL">
                          <a class="del_icon" @click="deleteImage('license')">X</a>
                          <img id="license_name" :src="licenseURL">
                        </span>
                        <input type="file" id="license" @change="imageUpload" accept="image/*">
                        <label for="license">등록</label>
                        <span class="m_l_10 color_main_01">권장 사이즈 : 640 x 640, 최대 10MB까지 가능</span>
                      </div>
                    </div>
                  </li>
                </ul>

                <ul>
                  <li>
                    <div class="title">통신판매업 신고증<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="input_file_wrap">
                        <span class="thumbnail_wrap m_r_10" v-if="saleURL">
                          <a class="del_icon" @click="deleteImage('sale')">X</a>
                          <img id="sale_name" :src="saleURL">
                        </span>
                        <input type="file" id="sale" @change="imageUpload" accept="image/*">
                        <label for="sale">등록</label>
                        <span class="m_l_10 color_main_01">권장 사이즈 : 640 x 640, 최대 10MB까지 가능</span>
                      </div>
                    </div>
                  </li>
                </ul>

                <!-- *** 연동 권한 START *** -->
                <ul>
                  <li>
                    <div class="title">연동 권한</div>
                    <div class="body">
                      <div class="checkbox_wrap">
                        <template v-for="(data, i) in linkageTypes">
                          <input type="checkbox" name="linkage_auth" :id="data.linkage_type" v-model="data.is_selected" :key="`link_${data.linkage_type}`">
                          <label :for="data.linkage_type" :key="`link_${data.linkage_name}`" >{{ data.linkage_name }}</label>
                        </template>
                      </div>
                    </div>
                  </li>
                  <li v-for="(data, i) in linkageTypes" v-if="data.is_selected" :key="data.linkage_type">
                    <div class="title">{{ data.linkage_name }} 연동권한</div>
                    <div class="body">
                      <div class="small_btn_wrap m_b_10">
                        <a @click="generateAPIKey(i)">API KEY 생성</a>
                      </div>
                      <input type="text" placeholder="API KEY" readonly="readonly" v-model="data.api_key">
                      <div class="radio_wrap m_b_10">
                        <input type="radio" :id="`${data.linkage_type}_is_allowed_true`" v-model="data.is_allowed_all_ip" :value="true">
                        <label :for="`${data.linkage_type}_is_allowed_true`">전체 IP 허용</label>
                        <input type="radio" :id="`${data.linkage_type}_is_allowed_false`" v-model="data.is_allowed_all_ip" :value="false">
                        <label :for="`${data.linkage_type}_is_allowed_false`">전체 IP 허용안함</label>
                      </div>

                      <ul class="change_list_wrap" v-if="!data.is_allowed_all_ip">
                        <li v-for="(ip, ipIndex) in data.white_list_ips" :key="`${data.linkage_type}_white_ip_${ipIndex}`">
                          <input type="text" placeholder="IP를 입력해주세요." v-model="data.white_list_ips[ipIndex]">
                          <a @click="addWhiteIp(i)" v-if="ipIndex === data.white_list_ips.length - 1">+</a>
                          <a @click="removeWhiteIp(i, ipIndex)" v-if="data.white_list_ips.length > 1">-</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
                <!-- *** 연동 권한 END *** -->

                <ul>
                  <li class="page_title">
                    <div>정산 정보</div>
                  </li>
                  <li>
                    <div class="title">은행명<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <input
                        type="text"
                        placeholder="내용을 입력해주세요."
                        v-model.lazy="balance_account_info.bank_name"
                      >
                    </div>
                  </li>
                  <li>
                    <div class="title">예금주명<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <input
                        type="text"
                        placeholder="내용을 입력해주세요."
                        v-model.lazy="balance_account_info.holder_name"
                      >
                    </div>
                  </li>
                  <li>
                    <div class="title">계좌번호<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <input
                        type="number"
                        placeholder="- 를 제외한 번호만 입력해주세요."
                        v-model.lazy="balance_account_info.account"
                      >
                    </div>
                  </li>
                  <li>
                    <div class="title">수수료율<span class="color_r">&#42;</span></div>
                    <div class="body">
                      <div class="input_unit_wrap">
                        <input
                          type="number"
                          placeholder="%를 입력해주세요"
                          v-model.lazy="balance_account_info.commission_rate"
                        >
                        <div>%</div>
                      </div>
                    </div>
                  </li>
                </ul>

                <div class="but_wrap text-center">
                  <nuxt-link to="/super_admin/store" class="line_but">취소</nuxt-link>
                  <a @click="createStore">등록</a>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
</template>

<script src="@/assets/javascripts/super_admin/store/new/index.js"></script>
