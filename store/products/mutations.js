const mutations = {
  SET_ALL_PRODUCTS(state, { products, merge = false }) {
    if (merge) {
      products.forEach(x => {
        if (!state.allProducts.find(prod => x.uid === prod.uid)) {
          state.allProducts.push(x);
        }
      });
    } else {
      state.allProducts = products;
    }
  },

  SET_LATEST_PRODUCTS(state, latestProducts) {
    state.latestProducts = latestProducts;
  },
  ADD_LATEST_PRODUCTS(state, products) {
    state.latestProducts = [...state.latestProducts, ...products];
  }
};

export default mutations;
