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
                    <col>
                  </colgroup>
                  <thead>
                  <tr>
                    <td class="page_title" colspan="2">가격 비교그룹 상세</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th>카테고리 선택</th>
                    <td>
                      <div class="four_select_wrap">
                        <select v-for="(categories, i) in copiedItems" v-bind:key="i"
                                v-model="selectedCategories[i]"
                                @change="selectedCategory(i)">
                          <option value="" selected>선택</option>
                          <option v-for="item in categories" v-bind:key="item.name"
                                  :value="item">{{ item.name }}</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <!-- *** 추가된 상품이 없을때 START *** -->
                <ul>
                  <li class="page_title">가격 비교그룹 상품</li>
                  <li>
                    <div class="price_comparison_group_wrap">
                      <span class="color_gray_7">같은 그룹상품 개수 : <em class="color_main_01">{{ priceGroup.products ? priceGroup.products.length : 0 }}</em></span>
                      <ul class="price_comparison_group_list only">
                        <li v-for="(product, i) in priceGroup.products" v-if="priceGroup.products && priceGroup.products.length > 0">
                          <div class="price_comparison_wrap">
                            <div class="img_wrap">
                              <DefaultImage :imageUrl="product.main_image" />
                            </div>
                            <div class="text_wrap">
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
                            <div class="text-right">
                              <div class="square_but_wrap">
                                <a class="red_line_but" @click="exceptFromGroup(product, i)">제외</a>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <a class="add_price_comparison_wrap" @click="showPriceGroupAdditionPopup">
                            <div class="add_icon"><i class="plus_icon"></i>미지정 상품추가</div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li class="page_title">지금 제외한 상품</li>
                  <li v-if="exceptionProductList && exceptionProductList.length > 0">
                    <div class="price_comparison_group_wrap">
                      <ul class="price_comparison_group_list">
                        <li v-for="(exceptionProduct, i) in exceptionProductList">
                          <div class="price_comparison_wrap">
                            <div class="img_wrap">
                              <DefaultImage :imageUrl="exceptionProduct.main_image" />
                            </div>
                            <div class="text_wrap">
                              <div><em>상품코드 :</em> {{ exceptionProduct.id }}</div>
                              <div><em>상품명 :</em> {{ exceptionProduct.name }}</div>
                              <div><em>카테고리 :</em> {{ exceptionProduct.category }}</div>
                              <div>
                                <em>할인 적용가 :</em>
                                <span v-if="exceptionProduct.discount_price && exceptionProduct.discount_price > 0">{{ exceptionProduct.discount_price | comma }}</span>
                                <span v-else-if="exceptionProduct.price && exceptionProduct.price > 0">{{ exceptionProduct.price | comma }}</span>
                                <span v-else>-</span>
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="square_but_wrap">
                                <a @click="addToGroup(exceptionProduct, i)">다시 추가</a>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li class="empty_text_wrap" v-else>
                    <div class="color_gray_7 p_10">제외된 상품이 없습니다.</div>
                  </li>
                </ul>
                <!-- *** 추가된 상품이 없을때 END *** -->
                <div class="but_wrap text-center">
                  <nuxt-link to="/super_admin/product/price_group" class="line_but">목록으로</nuxt-link>
                  <a href="javascript:" @click="createProductPriceGroup">등록</a>
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
<script src="@/assets/javascripts/super_admin/product/price_group/new/index.js"></script>
