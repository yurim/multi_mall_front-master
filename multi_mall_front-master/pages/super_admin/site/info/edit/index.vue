<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_three">

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="2">쇼핑몰 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>쇼핑몰 명 <span class="color_r">*</span></th>
                  <td>
                    <input
                      type="text"
                      placeholder="내용을 입력해주세요."
                      v-model.lazy="siteInfo.name"
                    >
                  </td>
                </tr>
                <tr>
                  <th>사이트 소개 <span class="color_r">*</span></th>
                  <td>
                    <div class="text_length_notation_input_wrap">
                      <input
                        type="text"
                        placeholder="내용을 입력해주세요."
                        v-model="textLength"
                      >
                      <!--                      v-model.lazy="siteInfo.desc"-->
                      <div class="text_length_wrap"><em>{{ textLength.length }}</em>80 </div>
                    </div>
                    <div class="color_r m_t_5">* 공백포함: 30자 이상 80자 이하</div>
                  </td>
                </tr>
                <tr v-for="template in fileTemplateDataList">
                  <th>{{template.title}} <span class="color_r">*</span></th>
                  <td>
                    <div class="input_file_wrap">
                      <span class="thumbnail_wrap m_r_10" v-if="siteInfo[template.fieldName] !== ''">
                        <a class="del_icon" @click="deleteImage(template.fieldName)">X</a>
                        <a class="edit_icon" @click="updateImage(template.fieldName)">수정</a>
                        <img :alt="template.title" :id="template.fieldName" :src="siteInfo[template.fieldName]">
                      </span>
                      <input
                        type="file"
                        :id="`${template.fieldName}_input`"
                        @change="imageUpload($event, template.fieldName)"
                        :accept="template.acceptExt">
                      <label :for="`${template.fieldName}_input`">첨부파일 등록</label>
                      <span class="m_l_10 color_main_01">권장 사이즈 : {{template.recommendSizeText}} <br/> {{template.constraintText}}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>기본 적립금 설정</th>
                  <td>
                    <div class="text_input_wrap">
                      <span>할인가,특가를 적용한 판매가의</span>
                      <input type="number" placeholder="%를 입력해주세요." v-model.lazy="siteInfo.saving_rate">
                      <span>%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>키워드</th>
                  <td>
                    <div class="border_b7 p_10">
                      <ul class="border_list_wrap keyword_wrap">
                        <li v-for="(keyword, i) in keywords" v-bind:key="keyword" class="m_b_5">
                          <a @click="deleteKeyword" :id="i">x</a> {{ keyword }}
                        </li>
                        <input type="text" v-on:keyup.enter="addKeywords" class="keyword">
                      </ul>
                    </div>
                    <span class="color_main_01">{{ message }}</span>
                  </td>
                </tr>

                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="2">사업자 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>사업자등록번호 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.license_num"></td>
                </tr>
                <tr>
                  <th>업체명 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.company_name"></td>
                </tr>
                <tr>
                  <th>대표전화 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.phone"></td>
                </tr>
                <tr>
                  <th>대표자 성명 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.ceo_name"></td>
                </tr>
                <tr>
                  <th>팩스</th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.fax"></td>
                </tr>
                <tr>
                  <th>대표 이메일 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.email"></td>
                </tr>
                <tr>
                  <th>통신판매 신고번호 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.sale_num"></td>
                </tr>
                <tr>
                  <th>업태 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.status"></td>
                </tr>
                <tr>
                  <th>종목 <span class="color_r">*</span></th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="businessInfo.item"></td>
                </tr>
                <tr>
                  <th>사업장 주소 <span class="color_r">*</span></th>
                  <td>
                    <div class="address_wrap">
                      <input type="text" placeholder="우편번호" @click="postCode" v-model.lazy="businessInfo.zipcode">
                      <a @click="postCode">우편번호</a>
                      <input type="text" placeholder="주소" v-model.lazy="businessInfo.address">
                    </div>
                  </td>
                </tr>

                </tbody>
              </table>

              <table class="show_table">
                <colgroup>
                  <col width="120">
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <td class="page_title" colspan="2">고객센터 정보</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th>상담/주문전화</th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="csInfo.phone"></td>
                </tr>
                <tr>
                  <th>상담/주문 이메일</th>
                  <td><input type="text" placeholder="내용을 입력해주세요." v-model.lazy="csInfo.email"></td>
                </tr>
                <tr>
                  <th>CS 운영시간</th>
                  <td>
                    <div>
                      <textarea class="border_b7 max_h_xs" cols="5" rows="10" v-model.lazy="csInfo.cs_time"></textarea>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>네이버 톡톡 소스코드 입력</th>
                  <td>
                    <div class="radio_wrap pull-left w_100 m_b_20">
                      <input type="radio" id="NAVERTure" :value="true" name="NAVER" v-model="snsInfo.NAVER.is_used">
                      <label for="NAVERTure">사용</label>
                      <input type="radio" id="NAVERFalse" :value="false" name="NAVER" v-model="snsInfo.NAVER.is_used">
                      <label for="NAVERFalse">사용안함</label>
                    </div>
                    <div v-if="snsInfo.NAVER.is_used === true">
                      <input type="text" v-model="snsInfo.NAVER.url" class="m_b_5">
                      <textarea class="border_b7 max_h_xs" cols="5" rows="10" v-model.lazy="snsInfo.NAVER.script"></textarea>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>카카오 플러스 친구</th>
                  <td>
                    <div class="radio_wrap pull-left w_100 m_b_20">
                      <input type="radio" id="KAKAOTure" :value="true" name="KAKAO" v-model="snsInfo.KAKAO.is_used">
                      <label for="KAKAOTure">사용</label>
                      <input type="radio" id="KAKAOFalse" :value="false" name="KAKAO" v-model="snsInfo.KAKAO.is_used">
                      <label for="KAKAOFalse">사용안함</label>
                    </div>
                    <div v-if="snsInfo.KAKAO.is_used === true">
                      <input type="text" v-model="snsInfo.KAKAO.url" class="m_b_5">
                      <textarea class="border_b7 max_h_xs" cols="5" rows="10" v-model.lazy="snsInfo.KAKAO.script"></textarea>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>인스타그램 URL</th>
                  <td>
                    <div class="radio_wrap pull-left w_100 m_b_20">
                      <input type="radio" id="INSTATrue" :value="true" name="INSTA" v-model="snsInfo.INSTA.is_used">
                      <label for="INSTATrue">사용</label>
                      <input type="radio" id="INSTAFalse" :value="false" name="INSTA" v-model="snsInfo.INSTA.is_used">
                      <label for="INSTAFalse">사용안함</label>
                    </div>
                    <div v-if="snsInfo.INSTA.is_used === true">
                      <input type="text" v-model="snsInfo.INSTA.url" class="m_b_5">
                      <textarea class="border_b7 max_h_xs" cols="5" rows="10" v-model.lazy="snsInfo.INSTA.script"></textarea>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>페이스북 URL</th>
                  <td>
                    <div class="radio_wrap pull-left w_100 m_b_20">
                      <input type="radio" id="FACETure" :value="true" name="FACE" v-model="snsInfo.FACE.is_used">
                      <label for="FACETure">사용</label>
                      <input type="radio" id="FACEFalse" :value="false" name="FACE" v-model="snsInfo.FACE.is_used">
                      <label for="FACEFalse">사용안함</label>
                    </div>
                    <div v-if="snsInfo.FACE.is_used === true">
                      <input type="text" v-model="snsInfo.FACE.url" class="m_b_5">
                      <textarea class="border_b7 max_h_xs" cols="5" rows="10" v-model.lazy="snsInfo.FACE.script"></textarea>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>

              <div class="but_wrap text-center">
                <nuxt-link to="/super_admin/site/info" class="line_but">목록</nuxt-link>
                <a @click="patchSiteInfo">저장</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/super_admin/site/info/edit/index.js"></script>
