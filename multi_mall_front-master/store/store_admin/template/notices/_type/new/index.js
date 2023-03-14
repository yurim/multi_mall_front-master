const prefix = 'store_admin/template';

const state = () => ({
});

const actions = {
  async createNotice(context, formData) {
    return await this.$axios.post(`${prefix}`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
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
