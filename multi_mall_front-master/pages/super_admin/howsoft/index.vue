<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="content_web">
            <div class="content_40"> <!-- 왼쪽 -->
              <div class="layout_body">
                <ul class="search_list m_b_10">
                  <li>
                    <div class="title_text">Query Type</div>
                    <div class="body_text">
                      <div class="select_wrap">
                        <select v-model="selectedQueryType">
                          <option v-for="queryType in queryTypes" :value="queryType.type">{{ queryType.name }}</option>
                        </select>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div class="title_text">Collection</div>
                    <div class="body_text">
                      <div class="select_wrap">
                        <select v-model="selectedCollection">
                          <option v-for="collection in collections" :value="collection.name">{{ collection.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </li>
                </ul>
                <ul v-if="selectedQueryType === 'find'">
                  <li>
                    <div class="color_main_01 m_b_10"><b>Filters</b></div>
                    <div class="m_b_20">
                      <textarea v-model="params.filters" rows="5" placeholder='json 입력, " " 사용'></textarea>
                    </div>
                  </li>
                  <li>
                    <div class="color_main_01 m_b_10"><b>Sort</b></div>
                    <div class="m_b_20">
                      <textarea v-model="params.sort" rows="5" placeholder='json 입력, " " 사용'></textarea>
                    </div>
                  </li>
                  <li v-if="['product', 'st11_product'].indexOf(selectedCollection) > -1">
                    <div class="color_main_01 m_b_10"><b>Projection</b></div>
                    <div class="m_b_20">
                      <textarea v-model="params.projection" rows="5" placeholder='json 입력, " " 사용'></textarea>
                    </div>
                  </li>
                </ul>
                <ul v-else-if="selectedQueryType === 'find_aggregate'">
                  <li>
                    <div class="color_main_01 m_b_10"><b>Pipelines</b></div>
                    <div class="m_b_20">
                      <textarea v-model="params.pipelines" rows="20" placeholder='Array'></textarea>
                    </div>
                  </li>
                </ul>
                <ul v-else-if="selectedQueryType === 'find_page'">
                  <li>
                    <div class="color_main_01 m_b_10"><b>Filters</b></div>
                    <div class="m_b_20">
                      <textarea v-model="params.filters" rows="5" placeholder='json 입력, " " 사용'></textarea>
                    </div>
                  </li>
                  <li>
                    <div class="color_main_01 m_b_10"><b>Sort</b></div>
                    <div class="m_b_20">
                      <textarea v-model="params.sort" rows="5" placeholder='json 입력, " " 사용'></textarea>
                    </div>
                  </li>
                  <li>
                    <div class="color_main_01 m_b_10"><b>Page Size</b></div>
                    <div class="m_b_20">
                      <input v-model="params.page_size"/>
                    </div>
                  </li>
                  <li>
                    <div class="color_main_01 m_b_10"><b>Next Cursor</b></div>
                    <div class="m_b_20">
                      <input v-model="params.next_cursor"/>
                    </div>
                  </li>
                </ul>
                <ul v-else-if="selectedQueryType === 'update'">
                  <li>
                    <div class="color_main_01 m_b_10"><b>Update</b></div>
                    <p>* id를 기준으로 모든 필드가 업데이트되므로 주의해서 사용하세요!!!!!</p>
                    <p>* id를 포함한 모델의 모든 필드를 입력해야 함</p>
                    <div class="m_b_20">
                      <textarea v-model="params.update" rows="20" placeholder='1건 업데이트'></textarea>
                    </div>
                  </li>
                </ul>
                <ul v-else-if="selectedQueryType === 'find_update'">
                </ul>
              </div>

              <div class="popup_btn_wrap text-center">
                <button @click="apply">적용</button>
              </div>
            </div>

            <div class="content_60"> <!-- 오른쪽 -->
              <div class="layout_body">
                <ul>
                  <json-viewer :value="resultJsonData" copyable></json-viewer>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/super_admin/howsoft/index.js"></script>
