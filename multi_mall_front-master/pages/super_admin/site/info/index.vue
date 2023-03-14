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
                  <th>쇼핑몰 명칭</th>
                  <td v-if="siteInfo.name">{{ siteInfo.name }}</td>
                </tr>
                <tr>
                  <th>사이트 소개</th>
                  <td v-if="siteInfo.desc">{{ siteInfo.desc }}</td>
                </tr>
                <tr>
                  <th>OG이미지</th>
                  <td v-if="siteInfo.og_image">
                    <span class="thumbnail_wrap">
                      <DefaultImage :imageUrl="siteInfo.og_image" />
                      <!-- <img alt="OG이미지" :src="siteInfo.og_image"> -->
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>파비콘이미지</th>
                  <td v-if="siteInfo.favicon">
                    <span class="thumbnail_wrap">
                      <DefaultImage :imageUrl="siteInfo.favicon" />
                      <!-- <img alt="파비콘이미지" :src="siteInfo.favicon"> -->
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>쇼핑몰 로고</th>
                  <td v-if="siteInfo.logo">
                    <span class="thumbnail_wrap">
                      <DefaultImage :imageUrl="siteInfo.logo" />
                      <!-- <img alt="쇼핑몰로고 이미지" :src="siteInfo.logo"> -->
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>기본 적립금 설정</th>
                  <td v-if="siteInfo.saving_rate">판매가의 {{ siteInfo.saving_rate }}%</td>
                </tr>
                <tr>
                  <th>키워드</th>
                  <td v-if="siteInfo.keywords">#{{ siteInfo.keywords }}</td>
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
                  <th>사업자등록번호</th>
                  <!-- <td>{{ businessInfo.license_num | license }}</td> -->
                  <td v-if="businessInfo.license_num">{{ businessInfo.license_num }}</td>
                </tr>
                <tr>
                  <th>업체명</th>
                  <td v-if="businessInfo.company_name">{{ businessInfo.company_name }}</td>
                </tr>
                <tr>
                  <th>대표전화</th>
                  <td v-if="businessInfo.phone">{{ businessInfo.phone | contact }}</td>
                </tr>
                <tr>
                  <th>대표자 성명</th>
                  <td v-if="businessInfo.ceo_name">{{ businessInfo.ceo_name }}</td>
                </tr>
                <tr>
                  <th>팩스</th>
                  <td v-if="businessInfo.fax">{{ businessInfo.fax }}</td>
                </tr>
                <tr>
                  <th>대표 이메일</th>
                  <td v-if="businessInfo.email">{{ businessInfo.email }}</td>
                </tr>
                <tr>
                  <th>통신판매 신고번호</th>
                  <!-- <td>{{ businessInfo.sale_num | sale }}</td> -->
                  <td v-if="businessInfo.sale_num">{{ businessInfo.sale_num }}</td>
                </tr>
                <tr>
                  <th>업태</th>
                  <td v-if="businessInfo.status">{{ businessInfo.status }}</td>
                </tr>
                <tr>
                  <th>종목</th>
                  <td v-if="businessInfo.item">{{ businessInfo.item }}</td>
                </tr>
                <tr>
                  <th>사업장 주소</th>
                  <td v-if="businessInfo.zipcode && businessInfo.address">{{ businessInfo.zipcode === '' ? '' : `(${businessInfo.zipcode}) ` }}{{ businessInfo.address }}</td>
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
                  <td v-if="csInfo.phone">{{ csInfo.phone | contact }}</td>
                </tr>
                <tr>
                  <th>상담/주문 이메일</th>
                  <td v-if="csInfo.email">{{ csInfo.email }}</td>
                </tr>
                <tr>
                  <th>CS 운영시간</th>
                  <td v-if="csInfo.cs_time">{{ csInfo.cs_time }}</td>
                </tr>
                <tr>
                  <th>네이버 톡톡</th>
                  <td v-if="!snsInfo.NAVER || (snsInfo.NAVER.url === '' && snsInfo.NAVER.script === '')">
                    <div>사용안함</div>
                  </td>
                  <td v-else>
                    <div>주소 : {{ snsInfo.NAVER.url }}</div>
                    <div>소스코드 : {{ snsInfo.NAVER.script }}</div>
                  </td>
                </tr>
                <tr>
                  <th>카카오 플러스 친구</th>
                  <td v-if="!snsInfo.KAKAO || (snsInfo.KAKAO.url === '' && snsInfo.KAKAO.script === '')">
                    <div>사용안함</div>
                  </td>
                  <td v-else>
                    <div>주소 : {{ snsInfo.KAKAO.url }}</div>
                    <div>소스코드 : {{ snsInfo.KAKAO.script }}</div>
                  </td>
                </tr>
                <tr>
                  <th>인스타그램 URL</th>
                  <td v-if="!snsInfo.INSTA || (snsInfo.INSTA.url === '' && snsInfo.INSTA.script === '')">
                    <div>사용안함</div>
                  </td>
                  <td v-else>
                    <div>주소 : {{ snsInfo.INSTA.url }}</div>
                    <div>소스코드 : {{ snsInfo.INSTA.script }}</div>
                  </td>
                </tr>
                <tr>
                  <th>페이스북 URL</th>
                  <td v-if="!snsInfo.FACE || (snsInfo.FACE.url === '' && snsInfo.FACE.script === '')">
                    <div>사용안함</div>
                  </td>
                  <td v-else>
                    <div>주소 : {{ snsInfo.FACE.url }}</div>
                    <div>소스코드 : {{ snsInfo.FACE.script }}</div>
                  </td>
                </tr>
                </tbody>
              </table>

              <div class="but_wrap text-center">
                <nuxt-link :to="'/super_admin/site/info/edit'">수정</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/super_admin/site/info/index.js"></script>
