const urlPrefix = 'store_admin/sales/amazic9';

function initOrderDeliveryRequests(orderDeliveryRequests) {
  const list = [];
  orderDeliveryRequests.forEach((v) => {
    v.firstOPDR = v.order_product_delivery_requests[0];
    if (v.firstOPDR && !v.firstOPDR.order_product.order_product_delivery) {
      v.firstOPDR.order_product.order_product_delivery = {
        delivery_company: '',
      };
    }

    v.order_product_delivery_requests.forEach((opdr) => {
      opdr.editAbroadOrderNum = opdr.abroad_order_num;
      opdr.editAbroadTrackingNum = opdr.abroad_tracking_num;
      if (!opdr.order_product.order_product_delivery) {
        opdr.order_product.order_product_delivery = {
          delivery_company: '',
        };
      }
    });
    if (v.firstOPDR) list.push(v);
  });
  return list;
}

const state = () => ({
  orderDeliveryRequests: [],
  orderProductDeliveryRequestsMap: {},
  totalCount: 0,
  pageSize: 0,
  notAssignedSPDATotalCount: 0,
});

const actions = {
  async getOrderDeliveryRequests({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/get_data_table`, {
      params: query,
    });
    await commit('setOrderDeliveryRequests', res.data);
  },
  async updateCheckPurchasing(context, data) {
    const res = await this.$axios.put(`${urlPrefix}/update_check_purchasing`, data);
    return res.data;
  },
  async updateCheckDelivery(context, data) {
    const res = await this.$axios.put(`${urlPrefix}/update_check_delivery`, data);
    return res.data;
  },
  async updateAbroadOrder(context, data) {
    const res = await this.$axios.put(`${urlPrefix}/update_abroad_order`, data);
    return res.data;
  },
  async updateInvoiceNum(context, data) {
    const res = await this.$axios.put(`${urlPrefix}/update_invoice_num`, data);
    return res.data;
  },
};

const mutations = {
  async setOrderDeliveryRequests(state, res) {
    state.orderDeliveryRequests = initOrderDeliveryRequests(res.data.orderDeliveryRequests);
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
    state.notAssignedSPDATotalCount = res.data.not_assigned_spda_total_count;
  },
};

const getters = {
  orderDeliveryRequests: (state) => state.orderDeliveryRequests,
  orderProductDeliveryRequestsMap: (state) => state.orderProductDeliveryRequestsMap,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  notAssignedSPDATotalCount: (state) => state.notAssignedSPDATotalCount,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
