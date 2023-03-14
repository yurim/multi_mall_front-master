<template>
  <div class="adminWrap">
    <div class="body_wrap">
      <SuperAdminHeader></SuperAdminHeader>
      <SuperAdminSideNav></SuperAdminSideNav>

      <div class="content_wrap">
        <div class="content_box_wrap">
          <div class="col_wrap admin_main_wrap">
            <div class="col_one">
              <ul class="first_ul">
                <li class="page_title">
                  <div>판매현황</div>
                  <span>(최근 2주)</span>
                  <div class="admin_main_sale_wrap pull-right">
                    <img alt="판매현황 아이콘" src="@/assets/img/admin/icon/admin_main_01.png">
                  </div>
                </li>
                <li>
                  <ul class="admin_main_sale_board">
                    <li>
                      <nuxt-link to="/super_admin/sales/not_paid">
                        <div class="img_wrap">
                          <img alt="입금대기 아이콘" src="@/assets/img/admin/icon/admin_main_sale_01.png">
                        </div>
                        <div class="text_wrap">입금대기</div>
                        <div class="num_wrap">{{ getStatusSalesNotPaid }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/dispatch?order_status=DLVRY_WAIT&order_sub_status=NEW_ORDR">
                        <div class="img_wrap">
                          <img alt="상품준비중 아이콘" src="@/assets/img/admin/icon/admin_main_sale_02.png">
                        </div>
                        <div class="text_wrap">결제완료</div>
                        <div class="num_wrap">{{ getStatusSalesPaid }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/dispatch?order_status=DLVRY_WAIT&order_sub_status=CHCK_DLVRY">
                        <div class="img_wrap">
                          <img alt="배송준비 아이콘" src="@/assets/img/admin/icon/admin_main_sale_03.png">
                        </div>
                        <div class="text_wrap">배송준비</div>
                        <div class="num_wrap">{{ getStatusSalesDeliveryWait }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/dispatch?order_status=DLVRNG">
                        <div class="img_wrap">
                          <img alt="배송중 아이콘" src="@/assets/img/admin/icon/admin_main_sale_04.png">
                        </div>
                        <div class="text_wrap">배송중</div>
                        <div class="num_wrap">{{ getStatusSalesDelivering }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/dispatch?order_status=DLVRY_CMPLT">
                        <div class="img_wrap">
                          <img alt="배송완료 아이콘" src="@/assets/img/admin/icon/admin_main_sale_05.png">
                        </div>
                        <div class="text_wrap">배송완료</div>
                        <div class="num_wrap">{{ getStatusSalesDeliveryComplete }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/decide">
                        <div class="img_wrap">
                          <img alt="구매확정 아이콘" src="@/assets/img/admin/icon/admin_main_sale_06.png">
                        </div>
                        <div class="text_wrap">구매확정</div>
                        <div class="num_wrap">{{ getStatusSalesDCDPRCHS }}</div>
                      </nuxt-link>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul>
                <li class="page_title">
                  <div>입점 현황</div>
                  <div class="admin_main_sale_wrap pull-right">
                    <img alt="입점 현황 아이콘" src="@/assets/img/admin/icon/admin_main_07.png" />
                  </div>
                </li>
                <li>
                  <ul class="flex_wrap">
                    <li>
                      <nuxt-link to="/super_admin/store?filter_storeStateType=NORMAL">
                        <div class="text_wrap">입점매장</div>
                        <div class="num_wrap">{{ getStatusEnterNormal }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/store?filter_storeStateType=ENTR_RQSTD">
                        <div class="text_wrap">입점요청</div>
                        <div class="num_wrap">{{ getStatusEnterRequest }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/store?filter_storeStateType=LEAVE_RQSTD">
                        <div class="text_wrap">퇴점요청</div>
                        <div class="num_wrap">{{ getStatusEnterLeaveRequest }}</div>
                      </nuxt-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <div class="col_one">
              <ul>
                <li class="page_title">
                  <div>판매 처리지연 현황</div>
                  <div class="admin_main_sale_wrap pull-right">
                    <img
                      alt="판매 처리지연 현황 아이콘"
                      src="@/assets/img/admin/icon/admin_main_02.png">
                  </div>
                </li>
                <li>
                  <ul class="flex_wrap">
                    <li>
                      <nuxt-link to="/super_admin/sales/dispatch?order_status=DLVRY_WAIT&order_sub_status=DLY_DLVRY">
                        <div class="text_wrap">발송지연</div>
                        <div class="num_wrap">{{ getStatusSaleDelayDelivery }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/cancel?order_sub_status=DLY_CNCL">
                        <div class="text_wrap">취소지연</div>
                        <div class="num_wrap">{{ getStatusSaleDelayCancel }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/return_delivery?order_sub_status=DLY_RTRN">
                        <div class="text_wrap">반품지연</div>
                        <div class="num_wrap">{{ getStatusSaleDelayReturn }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/exchange?order_sub_status=DLY_EXCHNG">
                        <div class="text_wrap">교환지연</div>
                        <div class="num_wrap">{{ getStatusSaleDelayExchange }}</div>
                      </nuxt-link>
                    </li>
                  </ul>
                </li>
              </ul>

              <ul>
                <li class="page_title">
                  <div>취소/반품/교환 현황</div>
                  <div class="admin_main_sale_wrap pull-right">
                    <img
                      alt="취소/반품/교환 현황 아이콘"
                      src="@/assets/img/admin/icon/admin_main_06.png">
                  </div>
                </li>
                <li>
                  <ul class="flex_wrap">
                    <li>
                      <nuxt-link to="/super_admin/sales/cancel?order_sub_status=RQST_CNCL">
                        <div class="text_wrap">취소요청</div>
                        <div class="num_wrap">{{ getStatusOrderSubCancel }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/return_delivery?order_sub_status=RQST_RTRN">
                        <div class="text_wrap">반품요청</div>
                        <div class="num_wrap">{{ getStatusOrderSubReturn }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/sales/exchange?order_sub_status=RQST_EXCHNG">
                        <div class="text_wrap">교환요청</div>
                        <div class="num_wrap">{{ getStatusOrderSubExchange }}</div>
                      </nuxt-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <div class="col_one">
              <ul>
                <li class="page_title">
                  <div>미답변 문의 현황</div>
                  <div class="admin_main_sale_wrap pull-right">
                    <img
                      alt="미답변 문의 현황 아이콘"
                      src="@/assets/img/admin/icon/admin_main_03.png">
                  </div>
                </li>
                <li>
                  <ul class="flex_wrap">
                    <li>
                      <nuxt-link to="/super_admin/product/qna?is_reply=false">
                        <div class="text_wrap">미답변 상품문의</div>
                        <div class="num_wrap">{{ getStatusNoAnswer }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/product/qna?is_reply=false">
                        <div class="text_wrap">미답변 1:1문의</div>
                        <div class="num_wrap">{{ getStatusNoAnswerOneToOne }}</div>
                      </nuxt-link>
                    </li>
                  </ul>
                </li>
              </ul>

              <ul>
                <li class="page_title">
                  <div>상품현황</div>
                  <div class="admin_main_sale_wrap pull-right">
                    <img
                      alt="상품현황 아이콘"
                      src="@/assets/img/admin/icon/admin_main_04.png">
                  </div>
                </li>
                <li>
                  <ul class="flex_wrap">
                    <li>
                      <nuxt-link to="/super_admin/product/?is_sale=true">
                        <div class="text_wrap">판매중</div>
                        <div class="num_wrap">{{ getStatusProductSale }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/product/?is_sale=false">
                        <div class="text_wrap">판매중지</div>
                        <div class="num_wrap">{{ getStatusProductNotSale }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/product/?is_listed=true">
                        <div class="text_wrap">진열중</div>
                        <div class="num_wrap">{{ getStatusProductListed }}</div>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link to="/super_admin/product/?is_listed=false">
                        <div class="text_wrap">진열중지</div>
                        <div class="num_wrap">{{ getStatusProductNotListed }}</div>
                      </nuxt-link>
                    </li>
                  </ul>
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
<script src="@/assets/javascripts/super_admin/main/index.js"></script>
