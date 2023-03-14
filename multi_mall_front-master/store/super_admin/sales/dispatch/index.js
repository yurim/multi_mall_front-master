import _ from 'lodash';

const state = () => ({
  totalCount: 0,
  orderProducts: [],
  pageSize: 0,
});

const prefix = 'super_admin/sales/dispatch';

const actions = {
  async GetDataTable({ commit }, query) {
    const res = await this.$axios.get(`${prefix}`, { params: query });
    await commit('setDataTable', res.data);
  },
};

const mutations = {
  setDataTable(state, json) {
    state.orderProducts = json.data.orderProducts;
    state.totalCount = json.data.totalCount;
    state.pageSize = json.data.pageSize;
  },
  setDeliveryOrderProducts(state, json) {
    _.find(state.orderProducts, (orderProduct) => {
      if (_.includes(json.order_product_ids, orderProduct.id)) {
        orderProduct.deliveryCompany = json.delivery_company;
        orderProduct.invoiceNum = json.invoice_num;
      }
    });
  },
  setOrderStatusOrderProducts(state, json) {
    _.find(state.orderProducts, (orderProduct) => {
      if (_.includes(json.order_product_ids, orderProduct.id)) {
        orderProduct.orderStatusStr = json.orderStatusStr;
        orderProduct.orderStatus = json.orderStatus;
        orderProduct.orderSubStatusStr = json.orderSubStatusStr;
        orderProduct.orderSubStatus = json.orderSubStatus;
      }
    });
  },
};

const getters = {
  orderProducts: (state) => state.orderProducts,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
