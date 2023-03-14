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
                <li class="page_title"><div>{{ templateName }} 템플릿 목록</div></li>
                <li class="pull-right">
                  <div class="square_but_wrap">
                    <a v-on:click="selectedDeleteNotices">선택삭제</a>
                  </div>
                </li>

                <li>
                  <data-table
                    ref="dataTable"
                    :loading="loading"
                    :headers="headers"
                    :items="notices"
                    :total="totalCount"
                    :onTableOption="onTableOption"
                    selectType="multi"
                    :defaultPageSize="pageSize"
                  >
                    <template v-slot:body="{item}">
                      <td>
                        <span class="text">
                          <nuxt-link :to="`/store_admin/template/notices/${templateType}/${item.id}`">{{ item.name }}</nuxt-link>
                        </span>
                      </td>
                      <td><span class="text">{{ $moment(item.created_at).format('YYYY.MM.DD') }}</span></td>
                      <td>
                        <span class="text square_but_wrap">
                          <nuxt-link class="line_but" :to="`/store_admin/template/notices/${templateType}/edit/${item.id}`">수정</nuxt-link>
                        </span>
                      </td>
                    </template>
                  </data-table>
                  <div class="but_wrap text-right m_t_10 d_ib_100">
                    <nuxt-link :to="`/store_admin/template/notices/${templateType}/new`">템플릿 등록</nuxt-link>
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
<script src="@/assets/javascripts/store_admin/template/notices/_type/index.js"></script>
