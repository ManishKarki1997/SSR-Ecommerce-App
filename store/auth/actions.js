const actions = {
  registerUser({ commit }, payload) {
    return this.$authRepository.registerUser(payload);
  },
  loginUser({ commit }, payload) {
    return this.$authRepository.loginUser(payload);
  },
  updateProfile({ commit }, payload) {
    return this.$authRepository.updateProfile(payload);
  },
  async logoutUser({ commit }, payload) {
    await this.$authRepository.logoutUser(payload);
    commit("SET_USER", null);
    commit("SET_CART", null);
    commit("SET_WISHLIST", null);
    window && window.localStorage.setItem("varya-commerce-loggedin", false);
  },
  fetchCurrentUser({ commit }) {
    return this.$authRepository.fetchCurrentUser();
  },

  // cart
  async fetchUserCart({ commit, dispatch }) {
    try {
      commit("SET_IS_FETCHING_CART", true);
      const res = await this.$authRepository.fetchUserCart();

      const { cart } = res.data.payload;
      commit("SET_CART", cart);
      commit("SET_IS_FETCHING_CART", false);
    } catch (error) {
      if (error) {
        console.log(error);
        dispatch(
          "addNotification",
          {
            title: "Error",
            description: "Couldn't fetch your cart",
            type: "danger"
          },
          { root: true }
        );
      }
    }
  },

  async addProductToCart({ commit, dispatch }, payload) {
    try {
      const res = await this.$authRepository.addProductToCart(payload);

      const { cart } = res.data.payload;
      commit("ADD_PRODUCT_TO_CART", cart);
      dispatch(
        "addNotification",
        {
          title: "Success",
          description: "Product successfully added to the cart.",
          type: "success"
        },
        { root: true }
      );
    } catch (error) {
      if (error) {
        console.log(error);
        dispatch(
          "addNotification",
          {
            title: "Error",
            // description: "Something went wrong",
            description: error.response.message || "Something went wrong",
            type: "danger"
          },
          { root: true }
        );
      }
    }
  },
  async removeProductFromCart({ commit, dispatch }, payload) {
    try {
      const res = await this.$authRepository.removeProductFromCart(payload);

      const { cartItemId } = res.data.payload;
      commit("REMOVE_PRODUCT_FROM_CART", cartItemId);
      dispatch(
        "addNotification",
        {
          title: "Success",
          description: "Product successfully removed from the cart.",
          type: "success"
        },
        { root: true }
      );
    } catch (error) {
      if (error) {
        console.log(error);
        dispatch(
          "addNotification",
          {
            title: "Error",
            description: error.response.message || "Something went wrong",
            type: "danger"
          },
          { root: true }
        );
      }
    }
  },

  // wishlist
  async fetchUserWishlist({ commit, dispatch }) {
    try {
      commit("SET_IS_FETCHING_WISHLIST", true);
      const res = await this.$authRepository.fetchUserWishlist();

      const { wishlist } = res.data.payload;
      commit("SET_CART", wishlist);
      commit("SET_IS_FETCHING_WISHLIST", false);
    } catch (error) {
      if (error) {
        console.log(error);
        dispatch(
          "addNotification",
          {
            title: "Error",
            description: "Couldn't fetch your wishlist",
            type: "danger"
          },
          { root: true }
        );
      }
    }
  },

  async addProductToWishlist({ commit, dispatch }, payload) {
    try {
      const res = await this.$authRepository.addProductToWishlist(payload);

      const { wishlist } = res.data.payload;
      const wishlistToSave = {
        ...wishlist,
        product: payload.product
      };
      commit("ADD_PRODUCT_TO_WISHLIST", wishlistToSave);

      dispatch(
        "addNotification",
        {
          title: "Success",
          description: "Product successfully added to the wishlist.",
          type: "success"
        },
        { root: true }
      );
    } catch (error) {
      if (error) {
        console.log(error);
        dispatch(
          "addNotification",
          {
            title: "Error",
            description: "Something went wrong",
            type: "danger"
          },
          { root: true }
        );
      }
    }
  },
  async removeProductFromWishlist({ commit, dispatch }, payload) {
    try {
      const res = await this.$authRepository.removeProductFromWishlist(payload);

      const { wishlistId } = res.data.payload;
      commit("REMOVE_PRODUCT_FROM_WISHLIST", wishlistId);
      dispatch(
        "addNotification",
        {
          title: "Success",
          description: "Product successfully removed from the cart.",
          type: "success"
        },
        { root: true }
      );
    } catch (error) {
      if (error) {
        console.log(error);
        dispatch(
          "addNotification",
          {
            title: "Error",
            description: "Something went wrong",
            type: "danger"
          },
          { root: true }
        );
      }
    }
  }
};

export default actions;
