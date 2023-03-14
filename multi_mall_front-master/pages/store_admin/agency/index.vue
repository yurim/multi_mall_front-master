<template>
  <client-only>
  <div class="adminWrap">
    <StoreAdminHeader></StoreAdminHeader>
    <StoreAdminSideNav></StoreAdminSideNav>
    <div class="content_wrap">
      <div class="content_box_wrap">
        <div class="col_wrap">
          <div class="col_three">
            <ul>
              <li class="page_title">
                <div>구매 / 배송 대행업체 관리</div>
              </li>
              <span :hidden="true">{{ editToggle }}</span>
              <li>
                <table>
                  <colgroup></colgroup>
                  <thead>
                  <tr>
                    <th>업체명</th>
                    <th>구매대행 가능</th>
                    <th>구매확인 필요</th>
                    <th>배송대행 가능</th>
                    <th>배송대행 신청 필요</th>
                    <th>수정/삭제</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="agency in agencyInfo">
                    <td>{{ agency.name }}</td>
                    <td>
                      <div v-if="agency.editMode">
                        <select v-model="agency.is_purchasing_agency">
                          <option :value="true">Y</option>
                          <option :value="false">N</option>
                        </select>
                      </div>
                      <div v-else>
                        <span v-if="agency.is_purchasing_agency">Y</span>
                        <span v-else>N</span>
                      </div>
                    </td>
                    <td>
                      <div v-if="agency.editMode">
                        <select v-model="agency.require_purchase_confirm" :disabled="!agency.is_purchasing_agency">
                          <option :value="true">필요</option>
                          <option :value="false">불필요</option>
                        </select>
                      </div>
                      <div v-else-if="!agency.editMode && !agency.is_purchasing_agency">
                        <span>-</span>
                      </div>
                      <div v-else>
                        <span v-if="agency.require_purchase_confirm">필요</span>
                        <span v-else>불필요</span>
                      </div>
                    </td>
                    <td>
                      <div v-if="agency.editMode">
                        <select v-model="agency.is_delivery_agency">
                          <option :value="true">Y</option>
                          <option :value="false">N</option>
                        </select>
                      </div>
                      <div v-else>
                        <span v-if="agency.is_delivery_agency">Y</span>
                        <span v-else>N</span>
                      </div>
                    </td>
                    <td>
                      <div v-if="agency.editMode">
                        <select v-model="agency.require_delivery_request" :disabled="!agency.is_delivery_agency">
                          <option :value="true">필요</option>
                          <option :value="false">불필요</option>
                        </select>
                      </div>
                      <div v-else-if="!agency.editMode && !agency.is_delivery_agency">
                        <span>-</span>
                      </div>
                      <div v-else>
                        <span v-if="agency.require_delivery_request">필요</span>
                        <span v-else>불필요</span>
                      </div>
                    </td>
                    <td>
                      <div v-if="agency.editMode" class="square_but_wrap text_center">
                        <a v-on:click="saveRow(agency)">저장</a>
                        <a v-on:click="deleteAgency(agency)" class="line_but">삭제</a>
                      </div>
                      <div v-else class="square_but_wrap text_center">
                        <a v-on:click="editRow(agency)">수정</a>
                        <a v-on:click="deleteAgency(agency)" class="line_but">삭제</a>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
            <table>
              <colgroup>
                <col width="160">
                <col>
                <col width="160">
                <col>
              </colgroup>
              <tbody>
              <tr>
                <th>업체명</th>
                <td colspan="3"><input type="text" placeholder="업체명입력" v-model="newAgency.name"></td>
              </tr>
              <tr>
                <th>구매 대행여부</th>
                <td>
                  <select v-model="newAgency.is_purchasing_agency">
                    <option :value="true">Y</option>
                    <option :value="false">N</option>
                  </select>
                </td>
                <th>구매 필요 여부</th>
                <td>
                  <select v-model="newAgency.require_purchase_confirm" :disabled="!newAgency.is_purchasing_agency">
                    <option :value="true">필요</option>
                    <option :value="false">불필요</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>배송 대행여부</th>
                <td>
                  <select v-model="newAgency.is_delivery_agency">
                    <option :value="true">Y</option>
                    <option :value="false">N</option>
                  </select>
                </td>
                <th>배송대행 신청 필요 여부</th>
                <td>
                  <select v-model="newAgency.require_delivery_request" :disabled="!newAgency.is_delivery_agency">
                    <option :value="true">필요</option>
                    <option :value="false">불필요</option>
                  </select>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="but_wrap text_center">
              <a v-on:click="addNewAgency">추가</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <StoreAdminFooter></StoreAdminFooter>
  </div>
  </client-only>
</template>
<script src="@/assets/javascripts/store_admin/agency/index.js"></script>
