import _ from 'lodash';

const urlPrefix = 'super_admin/sales/order';

const state = () => ({
  orderProducts: [],
  totalCount: 0,
  pageSize: 0,
});

const actions = {
  async getOrderProducts({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/getDataTable`, {
      params: query,
    });
    await commit('setOrderProducts', res.data.data);
    return res.data;
  },
  async setDelay(context, data) {
    return await this.$axios.post(`${urlPrefix}/setDelay`, data);
  },
  async setCancel(context, data) {
    return await this.$axios.post(`${urlPrefix}/setCancel`, data);
  },
  async setReturn(context, data) {
    return await this.$axios.post(`${urlPrefix}/setReturn`, data);
  },
  async setExchange(context, data) {
    return await this.$axios.post(`${urlPrefix}/setExchange`, data);
  },
};

const mutations = {
  setOrderProducts(state, data) {
    if (data.orderProducts) state.orderProducts = data.orderProducts;
    if (data.totalCount) state.totalCount = data.totalCount;
    if (data.pageSize) state.pageSize = data.pageSize;
  },
  setOrderStatusOrderProducts(state, json) {
    _.find(state.orderProducts, (orderProduct) => {
      if (_.includes(json.order_product_ids, orderProduct.id)) {
        orderProduct.orderStatus = json.orderStatus;
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
