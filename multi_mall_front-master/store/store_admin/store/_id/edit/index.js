const prefix = 'store_admin/store';

const state = () => ({
  store: {},
  categories: [],
});

const actions = {
  async getStore({ commit }, id) {
    const res = await this.$axios.get(`${prefix}/${id}`);
    await commit('setStore', res.data);
  },
  async getCategories({ commit }, query) {
    const res = await this.$axios.get('super_admin/category', { params: query });
    if (query) return res.data;
    await commit('setCategories', res.data.data);
  },
  async updateStore(context, store) {
    const formData = new FormData();
    Object.keys(store).forEach((key) => {
      let data = store[key];
      if (!(data instanceof File) && typeof data === 'object') data = JSON.stringify(data);
      formData.append(key, data);
    });

    return await this.$axios.post(`${prefix}/${store.id}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

const mutations = {
  setStore(state, res) {
    state.store = res.data.store;
  },
  setCategories(state, res) {
    if (res.categories) {
      res.categories.forEach((category) => {
        if (category.hasChild) category.children = [];
      });
      state.categories = res.categories;
    }
  },
};

const getters = {
  store: (state) => state.store,
  categories: (state) => state.categories,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
