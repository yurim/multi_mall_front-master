const prefix = 'store_admin/product/batch_update';

const state = () => ({
  batchUpdateResult: [],
  progressTotal: 100,
  progressDone: 0,
  finished: false,
  startedAt: null,
  endedAt: null,
});

const actions = {
  async getBatchUpdateResult({ commit }) {
    const res = await this.$axios.get(`${prefix}/result`);
    await commit('setBatchUpdateResult', res.data);
  },
  async requestBatchUpdate(context, data) {
    return await this.$axios.post(`${prefix}`, data, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  },
};

const mutations = {
  setBatchUpdateResult(state, res) {
    if (res.data) {
      state.batchUpdateResult = res.data.result;
      state.progressTotal = res.data.progress_total;
      state.progressDone = res.data.progress_done;
      state.startedAt = res.data.started_at;
      state.endedAt = res.data.ended_at;
      state.finished = res.data.finished;
    } else {
      state.batchUpdateResult = [];
    }
  },
};

const getters = {
  batchUpdateResult: (state) => state.batchUpdateResult,
  progressTotal: (state) => state.progressTotal,
  progressDone: (state) => state.progressDone,
  finished: (state) => state.finished,
  startedAt: (state) => state.startedAt,
  endedAt: (state) => state.endedAt,
};

export default {
  state,
  actions,
  mutations,
  getters,
};
