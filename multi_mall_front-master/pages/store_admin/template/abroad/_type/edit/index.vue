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
                  <div>{{ template.template_type_str }} 템플릿 수정</div>
                </li>
                <li class="pull-left">
                  <div class="square_but_wrap">
                    <nuxt-link
                      :class="template_type === 'top' ? 'small_but_style' : 'line_but'"
                      to="/store_admin/template/abroad/top/edit"
                    >
                      상단템플릿
                    </nuxt-link>
                    <nuxt-link
                      :class="template_type === 'bottom' ? 'small_but_style' : 'line_but'"
                      to="/store_admin/template/abroad/bottom/edit"
                    >
                      하단템플릿
                    </nuxt-link>
                  </div>
                </li>
                <li>
                  <div class="title">템플릿명</div>
                  <div class="body">
                    <input type="text" v-model="template.name" placeholder="내용을 입력하세요.">
                  </div>
                </li>
                <li>
                  <div class="title">내용</div>
                  <div class="body">
                    <client-only>
                      <SummernoteEditor @setDetailContent="onEditor" :detailContent="template.content" :detailImageArr="template.template_images" />
                    </client-only>
                    <div class="but_wrap text-center m_t_10 d_ib_100">
                      <nuxt-link class="line_but" :to="`/store_admin/template/abroad/${template_type}`">취소</nuxt-link>
                      <a v-on:click="updateTemplate">저장</a>
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
<script src="@/assets/javascripts/store_admin/template/abroad/_type/edit/index.js"></script>
