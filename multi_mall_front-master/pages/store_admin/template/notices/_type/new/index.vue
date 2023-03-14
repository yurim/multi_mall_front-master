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
                <li class="page_title"><div>{{ templateName }} 템플릿 등록</div></li>

                <li>
                  <div class="title">템플릿명</div>
                  <div class="body"><input type="text" v-model="notice.name"></div>
                </li>
                <li>
                  <div class="title">내용</div>
                  <div class="body">
                    <client-only>
                      <SummernoteEditor @setDetailContent="onEditor" />
                    </client-only>
                    <div class="but_wrap text-center m_t_10 d_ib_100">
                      <nuxt-link class="line_but" :to="`/store_admin/template/notices/${templateType}`">취소</nuxt-link>
                      <a v-on:click.prevent="createNotice">등록</a>
                    </div>
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
<script src="@/assets/javascripts/store_admin/template/notices/_type/new/index.js"></script>
