<template>
  <client-only>
  <div class="adminWrap">
    <div class="body_wrap">
      <StoreAdminHeader></StoreAdminHeader>
      <StoreAdminSideNav></StoreAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">
            <div class="col_three">

              <ul class="table_wrap">
                <li class="page_title"><div>배송비 템플릿</div></li>
                <li>
                  <div class="square_but_wrap pull-right m_b_10">
                    <a v-on:click="selectedDeleteDelivery">선택삭제</a>
                  </div>
                </li>
                <li>
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="deliveries"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    selectType="multi"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td><span class="text"><nuxt-link :to="`/store_admin/template/delivery/${item.id}`">{{ item.name }}</nuxt-link></span></td>
                      <td><span class="text">{{ item.delivery_fee_type_str }}</span></td>
                      <td><span class="text">{{ item.default_fee | comma }}원</span></td>
                      <td><span class="text">{{ item.created_at | date }}</span></td>
                      <td><span class="text">{{ item.updated_at | date }}</span></td>
                      <td>
                        <span class="square_but_wrap">
                          <nuxt-link class="line_but" :to="`/store_admin/template/delivery/edit/${item.id}`">수정</nuxt-link>
                        </span>
                      </td>
                    </template>
                  </data-table>
                  <div class="but_wrap text-right m_t_10 d_ib_100">
                    <nuxt-link to="/store_admin/template/delivery/new">템플릿 등록</nuxt-link>
                  </div>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>
      <StoreAdminFooter></StoreAdminFooter>
    </div>
  </div>
  </client-only>
</template>
<script src="@/assets/javascripts/store_admin/template/delivery/index.js"></script>
