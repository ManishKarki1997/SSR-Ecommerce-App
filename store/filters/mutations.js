const mutations = {
  SET_FILTERS(state, filters) {
    state.allFilters = filters;
  },
  ADD_FILTER(state, filter) {
    state.allFilters.push(filter);
  }
};

export default mutations;
