<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_three">

              <ul>
                <li class="page_title">
                  <nuxt-link class="btn_small m_r_10" to="/super_admin/site/agreement/terms">이용약관</nuxt-link>
                  <nuxt-link class="btn_small m_r_10" to="/super_admin/site/agreement/privacy">개인정보 처리방침</nuxt-link>
                  <nuxt-link class="btn_small m_r_10" to="/super_admin/site/agreement/third">제 3자 정보 제공동의</nuxt-link>
                  <nuxt-link class="btn_small m_r_10" to="/super_admin/site/agreement/exchng">교환약관</nuxt-link>
                  <nuxt-link class="btn_small m_r_10" to="/super_admin/site/agreement/rtrn">환불약관</nuxt-link>
                  <nuxt-link class="btn_small m_r_10" to="/super_admin/site/agreement/n_mmbr_buy">비회원 구매약관</nuxt-link>
                </li>
              </ul>

              <ul>
                <li class="page_title">{{ agreement.agreement_type_str }}</li>
                <li>
                  <div class="title">{{ agreement.agreement_type_str }}</div>
                  <div class="body">

                    <div class="editor_show_wrap m_b_20">
                      <SummernoteEditor :preview="true" :detailContent="agreement.content" />
                    </div>

                    <div class="but_wrap text-center">
                      <nuxt-link :to="`/super_admin/site/agreement/edit/${agreement.agreement_type}`">수정</nuxt-link>
                    </div>

                  </div>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </div>
      <SuperAdminFooter></SuperAdminFooter>
    </div>
  </div>
</template>
<script src="@/assets/javascripts/super_admin/site/agreement/_id/index.js"></script>
