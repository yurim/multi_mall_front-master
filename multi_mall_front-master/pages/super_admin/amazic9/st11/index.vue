<template>
  <div class="adminWrap">
    <SuperAdminHeader></SuperAdminHeader>
    <SuperAdminSideNav></SuperAdminSideNav>
    <div class="content_wrap">
      <div class="content_box_wrap">
        <div class="col_wrap">
          <div class="col_three">
            <!-- *** 배송대행신청 목록 - 11번가 START *** -->
            <!-- *** 검색 START *** -->
            <search-form
              :onSearch="onSearch"
              :onReset="onReset">
              <!-- search_wrap에 체크박스는 모두 체크가 되어있어야 함-->
              <ul class="search_wrap">
                <li>
                  <!-- 'a 클릭시' 미지정된 주문번호들만 보여줘야함 -->
                  <div>담당 업체 미지정 건수 : <a href="javascript:;" class="color_b">50</a>건</div>
                </li>
                <li>
                  <div class="title">상세검색</div>
                  <div class="body">
                    <search-select-input
                      ref="searchKeyword"
                      :classify="'keyword'"
                      :items="[
                        { text: '전체', value: '' },
                        { text: '주문번호', value: '' },
                        { text: '상품 주문번호', value: '' },
                        { text: '수취인명', value: '' },
                        { text: '구매자명', value: '' },
                        { text: '구매자 연락처', value: '' },
                        { text: '구매자 아이디', value: '' },
                        { text: '상품코드', value: '' },
                        { text: '판매 매장명', value: '' }
                      ]"
                      :placeholder="'내용을 입력해주세요.'"
                    ></search-select-input>
                  </div>
                </li>
                <li>
                  <div class="title">조회기간</div>
                  <div class="body">
                    <div class="select_date_wrap">
                      <search-date-picker
                        ref="searchDatePicker"
                        dateFormat="YYYY-MM-DDzz"
                      ></search-date-picker>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">담당업체</div>
                  <div class="body">
                    <select>
                      <option>전체</option>
                      <option>미지정</option>
                      <option>업체1</option>
                      <option>업체2</option>
                      <option>업체3</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">판매매장</div>
                  <div class="body">
                    <select>
                      <option>전체</option>
                    </select>
                  </div>
                </li>
                <li>
                  <div class="title">배송대행 필요여부</div>
                  <div class="body">
                    <div class="checkbox_wrap">
                      <input type="checkbox" id="item_1" checked>
                      <label for="item_1">필요</label>
                      <input type="checkbox" id="item_2" checked>
                      <label for="item_2">불필요</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">구매확인 필요</div>
                  <div class="body">
                    <div class="checkbox_wrap">
                      <input type="checkbox" id="item_3" checked>
                      <label for="item_3">필요함</label>
                      <input type="checkbox" id="item_4" checked>
                      <label for="item_4">필요안함</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">구매대행 상태</div>
                  <div class="body">
                    <div class="checkbox_wrap">
                      <input type="checkbox" id="item_5" checked>
                      <label for="item_5">전부 구매완료된 주문건</label>
                      <input type="checkbox" id="item_6" checked>
                      <label for="item_6">미완료가 포함된 주문건</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">배송신청 상태</div>
                  <div class="body">
                    <div class="select_input_wrap">
                      <div class="checkbox_wrap">
                        <input type="checkbox" id="item_7" checked>
                        <label for="item_7">신청완료</label>
                        <input type="checkbox" id="item_8" checked>
                        <label for="item_8">미신청</label>
                      </div>
                      <select>
                        <option>세부상태 전체</option>
                        <option>신청가능</option>
                        <option>구매미완료</option>
                        <option>외주업체소관</option>
                        <option>담당자 미지정</option>
                      </select>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">구매처</div>
                  <div class="body">
                    <div class="checkbox_wrap">
                      <input type="checkbox" id="item_9" checked>
                      <label for="item_9">직접등록</label>
                      <input type="checkbox" id="item_10" checked>
                      <label for="item_10">알리익스프레스</label>
                      <input type="checkbox" id="item_11" checked>
                      <label for="item_11">핀둬둬</label>
                      <input type="checkbox" id="item_12" checked>
                      <label for="item_12">타오바오</label>
                    </div>
                  </div>
                </li>
              </ul>
            </search-form>
            <!-- *** 검색 END *** -->
            <ul class="table_wrap">
              <li class="page_title">
                <div class="pull-left">조회결과 <span>200건</span></div>
                <div class="square_but_wrap pull-right">
                  <div class="pull-right">
                    <a class="gray_but" href="javascript:;">엑셀 다운로드</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="table_scroll_m">
                  <table>
                    <colgroup></colgroup>
                    <thead>
                    <tr>
                      <th rowspan="2">선택</th>
                      <th rowspan="2">판매매장</th>
                      <th rowspan="2">담당 업체</th>
                      <th rowspan="2">주문일시</th>
                      <th rowspan="2">주문번호</th>
                      <th rowspan="2">배송대행<br/>필요여부</th>
                      <th rowspan="2">배송대행<br/>신청상태</th>
                      <th rowspan="2">배송대행<br/>신청번호</th>
                      <th colspan="3">국내 발송정보</th>
                      <th rowspan="2">상품주문번호</th>
                      <th rowspan="2">주문상태</th>
                      <th rowspan="2">구매처</th>
                      <th rowspan="2">구매상태</th>
                      <th rowspan="2">구매확인<br/>필요</th>
                      <th colspan="3">해외 주문정보</th>
                      <th rowspan="2">수취인 명</th>
                      <th rowspan="2">수취인 연락처</th>
                      <th rowspan="2">수취인 주소</th>
                      <th rowspan="2">상품이미지</th>
                      <th rowspan="2">상품명</th>
                    </tr>
                    <tr>
                      <th>택배사</th>
                      <th>국내 운송장번호</th>
                      <th>저장</th>
                      <th>해외 주문번호</th>
                      <th>해외 운송장번호</th>
                      <th>저장</th>
                    </tr>
                    </thead>
                    <!--(선택 checkbox, 판매매장 a 링크는 활성화)를 제외한 테이블내의 모든 조작 기능이 비활성화 되야함  -->
                    <tbody>
                    <!-- *** 미신청(구매미완료) START *** -->
                    <tr>
                      <td rowspan="2">
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_1_1">
                          <label for="product_check_1_1"></label>
                        </div>
                      </td>
                      <td rowspan="2">
                        <div>어디어디</div>
                        <a href="javascript:;" class="color_b">매장바로가기</a>
                      </td>
                      <td rowspan="2">
                        <select disabled>
                          <option>어메이직구</option>
                        </select>
                      </td>
                      <td rowspan="2">2020.01.01<br/>10:10:10</td>
                      <td rowspan="2">
                        <a href="javascript:;" class="color_b">123123112</a>
                      </td>
                      <td rowspan="2">
                        <span class="color_g">필요</span>
                      </td>
                      <td rowspan="2">
                        <div class="color_r">미신청<br/><span>(구매 미완료)</span></div>
                      </td>
                      <td rowspan="2">-</td>
                      <td rowspan="2">
                        <select disabled>
                          <option>CJ대한통운</option>
                        </select>
                      </td>
                      <td rowspan="2">
                        <input type="text" placeholder="국내 운송장번호 입력" disabled>
                      </td>
                      <td rowspan="2"></td>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>핀둬둬</td>
                      <td>
                        <span class="color_r">미완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_2_2" checked disabled>
                          <label for="product_check_2_2"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <tr>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>핀둬둬</td>
                      <td>
                        <span class="color_g">구매완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_3_3" checked disabled>
                          <label for="product_check_3_3"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <!-- *** 미신청(구매미완료) END *** -->
                    <!-- *** 신청완료 START *** -->
                    <tr>
                      <td rowspan="2">
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_4_4">
                          <label for="product_check_4_4"></label>
                        </div>
                      </td>
                      <td rowspan="2">
                        <div>어디어디</div>
                        <a href="javascript:;" class="color_b">매장바로가기</a>
                      </td>
                      <td rowspan="2">
                        <select disabled>
                          <option>어메이직구</option>
                        </select>
                      </td>
                      <td rowspan="2">2020.01.01<br/>10:10:10</td>
                      <td rowspan="2">
                        <a href="javascript:;" class="color_b">123123112</a>
                      </td>
                      <td rowspan="2">
                        <span class="color_g">필요</span>
                      </td>
                      <td rowspan="2">
                        <div class="color_g">신청완료</div>
                      </td>
                      <td rowspan="2">
                        <a href="javascript:;" class="color_b">1234567</a>
                      </td>
                      <td rowspan="2">
                        <select disabled>
                          <option>CJ대한통운</option>
                        </select>
                      </td>
                      <td rowspan="2">
                        <input type="text" placeholder="국내 운송장번호 입력" disabled>
                      </td>
                      <td rowspan="2"></td>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>핀둬둬</td>
                      <td>
                        <span class="color_g">구매완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_5_5" checked disabled>
                          <label for="product_check_5_5"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <tr>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>타오바오</td>
                      <td>
                        <span class="color_g">구매완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_6_6" checked disabled>
                          <label for="product_check_6_6"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <!-- *** 신청완료 END *** -->
                    <!-- *** 미신청(신청하기) START *** -->
                    <tr>
                      <td rowspan="2">
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_7_7">
                          <label for="product_check_7_7"></label>
                        </div>
                      </td>
                      <td rowspan="2">
                        <div>어디어디</div>
                        <a href="javascript:;" class="color_b">매장바로가기</a>
                      </td>
                      <td rowspan="2">
                        <select disabled>
                          <option>어메이직구</option>
                        </select>
                      </td>
                      <td rowspan="2">2020.01.01<br/>10:10:10</td>
                      <td rowspan="2">
                        <a href="javascript:;" class="color_b">123123112</a>
                      </td>
                      <td rowspan="2">
                        <span class="color_g">필요</span>
                      </td>
                      <td rowspan="2">
                        <div class="color_r">미신청</div>
                      </td>
                      <td rowspan="2">-</td>
                      <td rowspan="2">
                        <select disabled>
                          <option>CJ대한통운</option>
                        </select>
                      </td>
                      <td rowspan="2">
                        <input type="text" placeholder="국내 운송장번호 입력" disabled>
                      </td>
                      <td rowspan="2"></td>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>핀둬둬</td>
                      <td>
                        <span class="color_g">구매완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_8_8" checked disabled>
                          <label for="product_check_8_8"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <tr>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>타오바오</td>
                      <td>
                        <span class="color_g">구매완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_9_9" checked disabled>
                          <label for="product_check_9_9"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <!-- *** 미신청(신청하기) END *** -->
                    <!-- *** 미신청(업체 미지정) START *** -->
                    <tr>
                      <td rowspan="2">
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_10_10">
                          <label for="product_check_10_10"></label>
                        </div>
                      </td>
                      <td rowspan="2">
                        <div>어디어디</div>
                        <a href="javascript:;" class="color_b">매장바로가기</a>
                      </td>
                      <td rowspan="2">
                        <select disabled>
                          <option>미지정</option>
                        </select>
                      </td>
                      <td rowspan="2">2020.01.01<br/>10:10:10</td>
                      <td rowspan="2">
                        <a href="javascript:;" class="color_b">123123112</a>
                      </td>
                      <td rowspan="2">-</td>
                      <td rowspan="2">
                        <div class="color_r">미신청<br/><span>(업체 미지정)</span></div>
                      </td>
                      <td rowspan="2">-</td>
                      <td rowspan="2">
                        <select disabled>
                          <option>CJ대한통운</option>
                        </select>
                      </td>
                      <td rowspan="2">
                        <input type="text" placeholder="국내 운송장번호 입력" disabled>
                      </td>
                      <td rowspan="2"></td>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>핀둬둬</td>
                      <td>
                        <span class="color_r">미완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_11_11" checked disabled>
                          <label for="product_check_11_11"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <tr>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>타오바오</td>
                      <td>
                        <span class="color_g">구매완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_12_12" checked disabled>
                          <label for="product_check_12_12"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <!-- *** 미신청(업체 미지정) END *** -->
                    <!-- *** 미신청(신청 불필요) START *** -->
                    <tr>
                      <td rowspan="2">
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_13_13">
                          <label for="product_check_13_13"></label>
                        </div>
                      </td>
                      <td rowspan="2">
                        <div>어디어디</div>
                        <a href="javascript:;" class="color_b">매장바로가기</a>
                      </td>
                      <td rowspan="2">
                        <select disabled>
                          <option>ck</option>
                        </select>
                      </td>
                      <td rowspan="2">2020.01.01<br/>10:10:10</td>
                      <td rowspan="2">
                        <a href="javascript:;" class="color_b">123123112</a>
                      </td>
                      <td rowspan="2">
                        <span class="color_r">불필요</span>
                      </td>
                      <td rowspan="2">
                        <div class="color_r">미신청<br/><span>(신청불필요)</span></div>
                      </td>
                      <td rowspan="2">-</td>
                      <td rowspan="2">
                        <select disabled>
                          <option>CJ대한통운</option>
                        </select>
                      </td>
                      <td rowspan="2">
                        <input type="text" placeholder="국내 운송장번호 입력" disabled>
                      </td>
                      <td rowspan="2"></td>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>배송준비중</td>
                      <td>핀둬둬</td>
                      <td>
                        <span class="color_y">구매필요<br/>없음</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_14_14" checked disabled>
                          <label for="product_check_14_14"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <tr class="bg_yellow">
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>상품준비중</td>
                      <td>
                        <span>알리</span>
                      </td>
                      <td>
                        <span class="color_r">미완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_15_15" checked disabled>
                          <label for="product_check_15_15"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <!-- *** 미신청(신청 불필요) END *** -->
                    <!-- *** 부분신청완료 START *** -->
                    <tr>
                      <td rowspan="2">
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_16_16">
                          <label for="product_check_16_16"></label>
                        </div>
                      </td>
                      <td rowspan="2">
                        <div>어디어디</div>
                        <a href="javascript:;" class="color_b">매장바로가기</a>
                      </td>
                      <td rowspan="2">
                        <select disabled>
                          <option>어메이직구</option>
                        </select>
                      </td>
                      <td rowspan="2">2020.01.01<br/>10:10:10</td>
                      <td rowspan="2">
                        <a href="javascript:;" class="color_b">123123112</a>
                      </td>
                      <td rowspan="2">
                        <span class="color_g">필요</span>
                      </td>
                      <td rowspan="2">
                        <div class="color_y">부분신청완료</div>
                      </td>
                      <td>
                        <a href="javascript:;" class="color_b">1234567</a>
                      </td>
                      <td>
                        <select disabled>
                          <option>CJ대한통운</option>
                        </select>
                      </td>
                      <td>
                        <input type="text" placeholder="국내 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>
                        <span>배송준비중</span>
                      </td>
                      <td>핀둬둬</td>
                      <td>
                        <span class="color_g">구매완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_17_17" checked disabled>
                          <label for="product_check_17_17"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>
                        <select disabled>
                          <option>CJ대한통운</option>
                        </select>
                      </td>
                      <td>
                        <input type="text" placeholder="국내 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>
                        <a href="javascript:;" class="color_b">1023456455</a>
                      </td>
                      <td>
                        <span>배송준비중</span>
                      </td>
                      <td>핀둬둬</td>
                      <td>
                        <span class="color_r">미완료</span>
                      </td>
                      <td>
                        <div class="only_checkbox_wrap">
                          <input type="checkbox" id="product_check_18_18" checked disabled>
                          <label for="product_check_18_18"></label>
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 주문번호 입력" disabled>
                      </td>
                      <td>
                        <input type="text" placeholder="해외 운송장번호 입력" disabled>
                      </td>
                      <td></td>
                      <td>홍길동</td>
                      <td>01055556666</td>
                      <td>서울 어디어디 어디어디</td>
                      <td>
                        <span class="thumbnail_wrap">
                          <img src="@/assets/img/product_default_img.png" alt="기본이미지">
                        </span>
                      </td>
                      <td>2021년 봄 신상 루즈핏 디자인의 블라우스 셔츠</td>
                    </tr>
                    <!-- *** 부분신청완료 END *** -->
                    </tbody>
                  </table>
                </div>
                <!-- 페이지네이션 넣어주세요-->
                <div class="pagenation_wrap"></div>
              </li>
            </ul>
            <!-- *** 배송대행신청 목록 - 11번가 END *** -->
          </div>
        </div>
      </div>
    </div>
    <SuperAdminFooter></SuperAdminFooter>
  </div>
</template>
