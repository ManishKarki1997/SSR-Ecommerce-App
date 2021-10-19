const actions = {
  async fetchSingleCategory({ commit, dispatch }, payload) {
    return this.$categoryRepository.fetchSingleCategory(payload);
  },
  async fetchCategories({ commit, dispatch }, payload) {
    try {
      const res = await this.$categoryRepository.fetchCategories(payload);
      commit("SET_ALL_CATEGORIES", res.data.payload.categories);
      return res;
    } catch (error) {
      if (error.response) {
        dispatch(
          "addNotification",
          {
            type: "error",
            title: "Error",
            description: error.response.data.message
          },
          { root: true }
        );
      }
    }
  },
  async fetchMinimalCategories({ commit, dispatch }, payload) {
    try {
      const res = await this.$categoryRepository.fetchMinimalCategories(
        payload
      );
      commit("SET_MINIMAL_CATEGORIES", res.data.payload.categories);
      return res;
    } catch (error) {
      if (error.response) {
        dispatch(
          "addNotification",
          {
            type: "error",
            title: "Error",
            description: error.response.data.message
          },
          { root: true }
        );
      }
    }
  },
  async fetchSubcategoriesForACategory({ commit, dispatch }, payload) {
    try {
      const res = await this.$categoryRepository.fetchSubcategoriesForACategory(
        payload
      );

      const { categoryName } = payload;
      commit("SET_SUBCATEGORIES", {
        categoryName,
        subCategories: res.data.payload.subCategories
      });
      return res;
    } catch (error) {
      if (error.response) {
        dispatch(
          "addNotification",
          {
            type: "error",
            title: "Error",
            description: error.response.data.message
          },
          { root: true }
        );
      }
    }
  },
  async createCategory({ commit }, payload) {
    return this.$categoryRepository.createCategory(payload);
  },
  async updateCategory({ commit }, payload) {
    return this.$categoryRepository.updateCategory(payload);
  },

  // for the clients. is basically same as above
  async fetchUserCategories({ commit, dispatch }, payload) {
    try {
      commit("SET_LOADING", true);
      const res = await this.$categoryRepository.fetchCategories(payload);
      commit("SET_CATEGORIES", res.data.payload.categories);
      commit("SET_LOADING", false);
      return res;
    } catch (error) {
      if (error.response) {
        dispatch(
          "addNotification",
          {
            type: "error",
            title: "Error",
            description: error.response.data.message
          },
          { root: true }
        );
      }
    }
  }
};

export default actions;
