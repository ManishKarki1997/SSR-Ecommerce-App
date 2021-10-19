const actions = {
  async fetchAllFilters({ commit }) {
    const res = await this.$filterRepository.fetchAllFilters();
    commit("SET_FILTERS", res.data.payload.filters);
  },
  async fetchFiltersForASubcategory({ commit }, payload) {
    return this.$filterRepository.fetchFiltersForASubcategory(payload);
  },
  async createFilter({ commit }, payload) {
    return this.$filterRepository.createFilter(payload);
  },
  async updateFilter({ commit }, payload) {
    return this.$filterRepository.updateFilter(payload);
  }
};

export default actions;
