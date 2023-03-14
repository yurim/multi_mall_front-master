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
                <li class="page_title">
                  <div>{{ templateName }} 템플릿 상세</div>
                </li>

                <li>
                  <div class="title">템플릿명</div>
                  <div class="body">
                    <input type="text" v-model="notice.name">
                  </div>
                </li>

                <li>
                  <div class="title">등록일</div>
                  <div class="body">{{ $moment(notice.created_at).format('YYYY.MM.DD') }}</div>
                </li>

                <li>
                  <div class="title">내용</div>
                  <div class="body">
                    <client-only>
                      <SummernoteEditor @setDetailContent="onEditorChange" :detailContent="notice.content" :detailImageArr="notice.template_images" />
                    </client-only>
                    <div class="but_wrap text-center m_t_10 d_ib_100">
                      <nuxt-link class="line_but" :to="`/store_admin/template/notices/${templateType}/${notice.id}`">취소</nuxt-link>
                      <a v-on:click="updateNotices">저장</a>
                      <a class="pull-right" v-on:click="deleteNotices">삭제</a>
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
<script src="@/assets/javascripts/store_admin/template/notices/_type/edit/_id/index.js"></script>
