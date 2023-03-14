<template>
  <div class="adminWrap">
    <StoreAdminHeader></StoreAdminHeader>
    <StoreAdminSideNav></StoreAdminSideNav>
    <div class="content_wrap">
      <div class="content_box_wrap">
        <div class="col_wrap">
          <div class="col_three">
            <ul>
              <li class="page_title">
                <div>상품 일괄 수정</div>
                <div class="square_but_wrap pull-right">
                  <div class="pull-right">
                    <div class="input_file_wrap">
                      <input type="file" id="update_product_file" v-on:change="uploadProductExcel" accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"/>
                      <label for="update_product_file" class="gray_but">수정엑셀 업로드</label>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div v-if="batchUpdateResult.length > 0">
                  <span class="m_r_10"><em class="color_gray_70">시작: </em>{{ this.startedAt }}</span>
                  <span><em class="color_gray_70">종료: </em>{{ this.endedAt }}</span>
                </div>
              </li>
              <li>
                <table>
                  <colgroup></colgroup>
                  <thead>
                  <tr>
                    <th>처리상태</th>
                    <th>실패사유</th>
                    <th>상품코드</th>
                    <th>판매상태</th>
                    <th>진열상태</th>
                    <th>카테고리</th>
                    <th>상품명</th>
                    <th>가격</th>
                    <th>할인가격</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="result in batchUpdateResult">
                    <td v-if="result.success">성공</td>
                    <td v-else>실패</td>
                    <td>{{ result.message }}</td>
                    <td>{{ result.id }}</td>
                    <td>{{ result.is_sale }}</td>
                    <td>{{ result.is_listed }}</td>
                    <td>{{ result.category_name }}</td>
                    <td>{{ result.name }}</td>
                    <td>{{ result.price }}</td>
                    <td>{{ result.discount_price }}</td>
                  </tr>
                  <tr v-if="batchUpdateResult.length < 1">
                    <td colspan="9">처리결과가 없습니다.</td>
                  </tr>
                  </tbody>
                </table>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <StoreAdminFooter></StoreAdminFooter>
  </div>
</template>
<script src="@/assets/javascripts/store_admin/product/batch_update/index.js"></script>
