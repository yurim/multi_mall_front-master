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
                <li class="page_title"><div>회원정보</div></li>
                <li>
                  <div class="title">이름</div>
                  <div class="body">{{ userInfo.name }}</div>
                </li>
                <li>
                  <div class="title">이메일</div>
                  <div class="body">{{ userInfo.email }}</div>
                </li>
                <li>
                  <div class="title">전화번호</div>
                  <div class="body">{{ userInfo.phone | contact }}</div>
                </li>
                <li>
                  <div class="title">가입일</div>
                  <div class="body">{{ userInfo.created_at | date }}</div>
                </li>
                <li>
                  <div class="title">휴면여부</div>
                  <div class="body">{{ userInfo.is_dormant ? '정상' : '휴면' }}</div>
                </li>
                <li>
                  <div class="title">현재 포인트</div>
                  <div class="body">
                    {{ userInfo.current_point | comma }}p
                    <a class="btn_small" @click="updateCurrentPoint">수정</a>
                  </div>
                </li>
              </ul>

              <ul>
                <li class="page_title"><div>포인트 사용내역</div></li>
                <li>
                  <table>
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>포인트 구분</th>
                        <th>포인트</th>
                        <th>사유</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(data, i) in userInfo.point_history" :key="`data_${i}`">
                        <td>{{ data.created_at | date }}</td>
                        <td>{{ data.type === 'save' ? '적립' : '차감' }}</td>
                        <td>{{ data.point | comma }}</td>
                        <td>{{ data.type_str }}</td>
                      </tr>
                    </tbody>
                  </table>
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
<script src="@/assets/javascripts/super_admin/user/_id/index.js"></script>
