<template>
  <div class="adminWrap">
    <SuperAdminHeader></SuperAdminHeader>
    <SuperAdminSideNav></SuperAdminSideNav>
    <div class="content_wrap">
      <div class="content_box_wrap">
        <div class="col_wrap">
          <div class="col_three">
            <ul>
              <li class="page_title">
                <div>해외 쇼핑몰 속성관리</div>
              </li>
              <li>
                <table>
                  <colgroup></colgroup>
                  <thead>
                  <tr>
                    <th>해외쇼핑몰 이름</th>
                    <th>CODE</th>
                    <th>구매대행 필요여부</th>
                    <th>배송대행 필요여부</th>
                    <th>수정/삭제</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="target in targetInfo">
                    <td>
                      <input v-if="target.editMode" type="text" v-model="target.name">
                      <span v-else>{{ target.name }}</span>
                    </td>
                    <td>{{ target.code }}</td>
                    <td>
                      <div v-if="target.editMode">
                        <select v-model="target.require_purchase">
                          <option :value="true">Y</option>
                          <option :value="false">N</option>
                        </select>
                      </div>
                      <div v-else>
                        <span v-if="target.require_purchase" class="color_g">Y</span>
                        <span v-else class="color_r">N</span>
                      </div>
                    </td>
                    <td>
                      <div v-if="target.editMode">
                        <select v-model="target.require_delivery">
                          <option :value="true">Y</option>
                          <option :value="false">N</option>
                        </select>
                      </div>
                      <div v-else>
                        <span v-if="target.require_delivery" class="color_g">Y</span>
                        <span v-else class="color_r">N</span>
                      </div>
                    </td>
                    <td>
                      <div v-if="target.editMode" class="square_but_wrap text_center">
                        <a v-on:click="saveRow(target)">저장</a>
                        <a v-on:click="deleteTarget(target)" class="line_but">삭제</a>
                      </div>
                      <div v-else class="square_but_wrap text_center">
                        <a v-on:click="editRow(target)">수정</a>
                        <a v-on:click="deleteTarget(target)" class="line_but">삭제</a>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
            <span :hidden="true">{{ editToggle }}</span>
            <table>
              <colgroup>
                <col width="300">
                <col>
                <col width="220">
                <col width="80">
              </colgroup>
              <thead>
              <tr>
                <th>해외쇼핑몰 이름</th>
                <th>CODE</th>
                <th colspan="2">속성선택</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td><input type="text" placeholder="쇼핑몰 이름을 입력해주세요" v-model="newTarget.name"></td>
                <td><input class="w_100" type="text" v-model="newTarget.code"></td>
                <td>
                  <div class="checkbox_wrap pull-left">
                    <input type="checkbox" id="require_purchase" v-model="newTarget.require_purchase">
                    <label for="require_purchase">구매대행</label>
                    <input type="checkbox" id="require_delivery" v-model="newTarget.require_delivery">
                    <label for="require_delivery">배송대행</label>
                  </div>
                </td>
                <td>
                  <div class="square_but_wrap text_center">
                    <a type="button" v-on:click="addNewTarget">추가</a>
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
</template>
<script src="@/assets/javascripts/super_admin/target/info/index.js"></script>
