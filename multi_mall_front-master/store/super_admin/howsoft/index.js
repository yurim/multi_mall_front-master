const prefix = 'super_admin/howsoft';

const state = () => ({
});

const actions = {
  async executeQuery(context, data) {
    const res = await this.$axios.post(`${prefix}/query`, data);
    return res.data;
  },
};

const mutations = {
};

const getters = {
};

export default {
  state,
  actions,
  mutations,
  getters,
};
