import { generateUrl } from "@/utils";

const actions = {
  addNotification({ commit }, notification) {
    commit("ADD_NOTIFICATION", notification);
  },
  removeNotification({ commit }, notification) {
    commit("REMOVE_NOTIFICATION", notification);
  },
  async fetchHeaderCategories({ commit }) {
    try {
      const res = await this.$categoryRepository.fetchHeaderCategories();
      commit("SET_HEADER_CATEGORIES", res.data.payload.headerCategories);
    } catch (error) {
      if (error) {
        dispatch(
          "addNotification",
          {
            type: "error",
            title: "Error",
            description: "Couldn't fetch header menus"
          },
          { root: true }
        );
      }
    }
  },
  async fetchBrandInfo({ commit }) {
    try {
      const res = await this.$axios.get("/brand", {
        withCredentials: true
      });
      const { brandInfo } = res.data.payload;
      commit("SET_BRAND_INFO", brandInfo);
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  },
  addBrandInfoDetails({ commit }, payload) {
    return this.$axios.post("/brand", payload, {
      withCredentials: true
    });
  },
  addBrandDetails({ commit }, payload) {
    return this.$axios.post("/brand/single", payload, {
      withCredentials: true
    });
  },
  deleteBrandDetails({ commit }, payload) {
    const url = generateUrl("/brand/single", payload);
    return this.$axios.delete(url, {
      withCredentials: true
    });
  },
  updateBrandDetails({ commit }, payload) {
    return this.$axios.put("/brand/single", payload, {
      withCredentials: true
    });
  }
};

export default actions;
