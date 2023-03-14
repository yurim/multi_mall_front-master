const urlPrefix = 'super_admin/sales/amazic9';

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

  agencyList: [{ name: '미지정' }],
  agencyTotalCount: 0,
  agencyPageSize: 0,
  agencyCurrPage: 0,

  storeList: [],
  storeTotalCount: 0,
  storePageSize: 0,
  storeCurrPage: 0,
});

const actions = {
  async getOrderDeliveryRequests({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/get_data_table`, {
      params: query,
    });
    await commit('setOrderDeliveryRequests', res.data);
  },
  async getAgencyList({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/get_agency_list`, { params: query });
    const result = {
      data: res.data.data,
      page: (query && query.page) ? query.page : 1,
    };
    await commit('setAgencyList', result);
  },
  async getStoreList({ commit }, query) {
    const res = await this.$axios.get(`${urlPrefix}/get_stores_by_agency`, { params: query });
    const result = {
      data: res.data.data,
      page: (query && query.page) ? query.page : 1,
    };
    await commit('setStoreList', result);
  },
  async resetAgencyList({ commit }) {
    await commit('resetAgencyList');
  },
  async resetStoreList({ commit }) {
    await commit('resetStoreList');
  },
};

const mutations = {
  async setOrderDeliveryRequests(state, res) {
    state.orderDeliveryRequests = initOrderDeliveryRequests(res.data.orderDeliveryRequests);
    state.totalCount = res.data.totalCount;
    state.pageSize = res.data.pageSize;
    state.notAssignedSPDATotalCount = res.data.not_assigned_spda_total_count;
  },
  async setAgencyList(state, result) {
    if (result.data.agencyList.length > 0) {
      state.agencyCurrPage = result.page;
    }
    state.agencyList = state.agencyList.concat(result.data.agencyList);
    state.agencyTotalCount = result.data.agencyTotalCount;
    state.agencyPageSize = result.data.agencyPageSize;
  },
  async setStoreList(state, result) {
    if (result.data.storeList.length > 0) {
      state.storeCurrPage = result.page;
    }
    state.storeList = state.storeList.concat(result.data.storeList);
    state.storeTotalCount = result.data.storeTotalCount;
    state.storePageSize = result.data.storePageSize;
  },
  async resetAgencyList(state) {
    state.agencyList = [{ name: '미지정' }];
    state.agencyCurrPage = 1;
    state.agencyTotalCount = 0;
    state.agencyPageSize = 0;
  },
  async resetStoreList(state) {
    state.storeList = [];
    state.storeCurrPage = 1;
    state.storeTotalCount = 0;
    state.storePageSize = 0;
  },
};

const getters = {
  orderDeliveryRequests: (state) => state.orderDeliveryRequests,
  orderProductDeliveryRequestsMap: (state) => state.orderProductDeliveryRequestsMap,
  totalCount: (state) => state.totalCount,
  pageSize: (state) => parseInt(state.pageSize, 10),
  notAssignedSPDATotalCount: (state) => state.notAssignedSPDATotalCount,

  agencyList: (state) => state.agencyList,
  agencyCurrPage: (state) => state.agencyCurrPage,
  agencyTotalCount: (state) => state.agencyTotalCount,
  agencyPageSize: (state) => state.agencyPageSize,

  storeList: (state) => state.storeList,
  storeCurrPage: (state) => state.storeCurrPage,
  storeTotalCount: (state) => state.storeTotalCount,
  storePageSize: (state) => state.storePageSize,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
