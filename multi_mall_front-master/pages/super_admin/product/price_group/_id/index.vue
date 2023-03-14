<template>
  <client-only>
    <div class="adminWrap">
      <div class="body_wrap">
        <SuperAdminHeader></SuperAdminHeader>
        <SuperAdminSideNav></SuperAdminSideNav>

        <div class="content_wrap">
          <div class="content_box_wrap">
            <div class="col_wrap">
              <div class="col_three">

                <table class="show_table">
                  <colgroup>
                    <col width="160">
                    <col width="350">
                    <col width="160">
                    <col>
                  </colgroup>
                  <thead>
                  <tr>
                    <td class="page_title" colspan="4">가격 비교그룹 상세</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th>가격비교 그룹번호</th>
                    <td>{{ priceGroup.id }}</td>
                    <th>가격비교 그룹 생성일자</th>
                    <td>{{ priceGroup.created_at }}</td>
                  </tr>
                  <tr>
                    <th>카테고리</th>
                    <td colspan="3">{{ priceGroup.category }}</td>
                  </tr>
                  </tbody>
                </table>
                <ul>
                  <li class="page_title">
                    <div class="pull-left">가격 비교그룹 상품</div>
                    <div class="square_but_wrap pull-right">
                      <a class="red_but" @click="showPriceGroupCancellationPopup">그룹해제</a>
                    </div>
                  </li>
                  <li>
                    <div class="price_comparison_group_wrap">
                      <span class="color_gray_7">같은 그룹상품 개수 : <em class="color_main_01">{{ priceGroup.products ? priceGroup.products.length : 0 }}</em></span>
                      <ul class="price_comparison_group_list" v-if="priceGroup.products && priceGroup.products.length > 0">
                        <li v-for="(product) in priceGroup.products">
                          <div class="price_comparison_wrap">
                            <div class="img_wrap">
                              <DefaultImage :imageUrl="product.main_image" />
                            </div>
                            <div class="text_wrap">
                              <div v-if="product.id === priceGroup.lowest_product_id">
                                <span class="main_item">대표</span>
                              </div>
                              <div><em>상품코드 :</em> {{ product.id }}</div>
                              <div><em>상품명 :</em> {{ product.name }}</div>
                              <div><em>카테고리 :</em> {{ product.category }}</div>
                              <div>
                                <em>할인 적용가 :</em>
                                <span v-if="product.discount_price && product.discount_price > 0">{{ product.discount_price | comma }}</span>
                                <span v-else-if="product.price && product.price > 0">{{ product.price | comma }}</span>
                                <span v-else>-</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
                <div class="but_wrap text-center">
                  <nuxt-link to="/super_admin/product/price_group" class="line_but">목록으로</nuxt-link>
                  <nuxt-link :to="`/super_admin/product/price_group/edit/${priceGroup.id}`">수정</nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SuperAdminFooter></SuperAdminFooter>
      </div>
    </div>
  </client-only>
</template>
<script src="@/assets/javascripts/super_admin/product/price_group/_id/index.js"></script>
