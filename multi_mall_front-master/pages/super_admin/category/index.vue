<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap">

            <div class="col_half">
              <ul>
                <li class="page_title m_b_10">카테고리 설정</li>
                <li>
                  <div class="square_but_wrap text-right m_b_10">
                    <a href="javascript:;" class="black_line_but" @click="createCategory">하위 카테고리 추가</a>
                    <a href="javascript:;" class="black_line_but" @click="deleteCategory">삭제</a>
                  </div>
                  <div class="admin_ztree_wrap">
                  <div class="ztree_wrap">
                    <v-treeview
                      activatable
                      hoverable
                      :active.sync="active"
                      :items="categories"
                      transition
                      :return-object="true"
                      item-key="_id"
                      :load-children="fetchItems"
                    ></v-treeview>
                  </div>
                 </div>
                </li>

                <li>
                  <div class="but_wrap text-center">
                    <a href="javascript:;" class="line_but" @click="up">UP</a>
                    <a href="javascript:;" class="line_but" @click="down">DOWN</a>
                    <a href="javascript:;" class="line_but" @click="top">TOP</a>
                    <a href="javascript:;" class="line_but" @click="bottom">BOTTOM</a>
                  </div>
                </li>
              </ul>
            </div>

            <div class="col_half">
              <ul>
                <li class="page_title">카테고리 내용</li>
                <li>
                  <div class="title">카테고리명</div>
                  <div class="body">
                    <input type="text" v-model="selectedCategory.name" maxlength="40">
                    {{selectedCategory.name.length}}/40
                  </div>
                </li>
                <li>
                  <div class="title">네이버 카테고리 ID</div>
                  <div class="body">
                    <input type="text" v-model="selectedCategory.naver_category_id">
                  </div>
                </li>
                <li>
                  <div class="title">노출여부</div>
                  <div class="body">
                    <div class="radio_wrap">
                      <input type="radio" id="test1-1" name="test1" :value="true" v-model="selectedCategory.is_show">
                      <label for="test1-1">노출함</label>
                      <input type="radio" id="test1-2" name="test1" :value="false" v-model="selectedCategory.is_show">
                      <label for="test1-2">노출안함</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="title">PC용 카테고리 배너</div>
                  <div class="body">
                    <div class="input_file_wrap">
                        <span class="thumbnail_wrap m_r_10" >
                          <a class="del_icon" >X</a>
                          <!--                          이미지 등록시  src 교체 -->
                          <img src="@/assets/img/product_default_img.png">
                        </span>
                      <input type="file" id="test2" multiple="multiple" accept="image/*" >
                      <label for="test2" >첨부파일 등록</label>
                    </div>
                    <span class="color_main_01">권장 사이즈 1920 x 640 최대 10mb, 확장자 jpg, png 등록가능</span>
                  </div>
                </li>
                <li>
                  <div class="title">MOBILE용 카테고리 배너</div>
                  <div class="body">
                    <div class="input_file_wrap">
                        <span class="thumbnail_wrap m_r_10" >
                          <a class="del_icon" >X</a>
                          <!--                          이미지 등록시  src 교체 -->
                          <img src="@/assets/img/product_default_img.png">
                        </span>
                      <input type="file" id="test" multiple="multiple" accept="image/*" >
                      <label for="test" >첨부파일 등록</label>
                    </div>
                    <span class="color_main_01">권장 사이즈 1120 x 120 최대 10mb, 확장자 jpg, png 등록가능</span>
                  </div>
                </li>

                <li>
                  <div class="but_wrap text-center">
                    <a href="javascript:;" @click="updateCategory">적용</a>
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

<script src="@/assets/javascripts/super_admin/category/index.js"></script>
