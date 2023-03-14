<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">
            <div class="col_three">
              <table>
                <colgroup>
                  <col width="160">
                  <col width="160">
                  <col>
                  <col>
                </colgroup>
                <thead>
                <tr>
                  <th>택배사 이름</th>
                  <th>택배사 코드</th>
                  <th>운송장번호 조회 URL</th>
                  <th v-if="editMode"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in courierInfo">
                  <td>
                      <input v-if="editMode" type="text" v-model="item.code">
                      <span v-else>{{ item.code }}</span>
                  </td>
                  <td>
                    <input v-if="editMode" type="text" v-model="item.name">
                    <span v-else>{{ item.name }}</span>
                  </td>
                  <td>
                    <input class="w_100" v-if="editMode" type="text" v-model="item.value">
                    <span v-else>{{ item.value }}</span>
                  </td>
                  <td v-if="editMode" width="120">
                  <div class="square_but_wrap text_center">
                    <a type="button" v-on:click="saveInfo(item)">저장</a>
                    <a type="button" class="line_but" v-on:click="deleteInfo(item)">삭제</a>
                  </div>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="square_but_wrap m_b_20">
                <div v-if="!editMode">
                  <a type="button" v-on:click="toggleEditMode">편집</a>
                </div>
                <div v-else>
                  <a type="button" v-on:click="toggleEditMode">편집취소</a>
                </div>
              </div>
              <table>
                <colgroup>
                  <col width="160">
                  <col width="160">
                  <col>
                  <col width="80">
                </colgroup>
                <thead>
                <tr>
                  <th colspan="4">택배사 정보 추가</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td><input type="text" v-model="newCourier.name" placeholder="택배사 이름"></td>
                  <td><input type="text" v-model="newCourier.code" placeholder="택배사 코드"></td>
                  <td><input type="text" class="w_100" v-model="newCourier.value" placeholder="운송장번호 조회 URL"></td>
                  <td>
                 <div class="square_but_wrap text_center">
                  <a type="button" v-on:click="saveInfo()">추가</a>
                 </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/super_admin/site/couriers/index.js"></script>
