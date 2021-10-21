const actions = {
  fetchProducts({ commit }, payload) {
    return this.$productRepository.fetchProducts(payload);
  },
  fetchRelatedProducts({ commit }, slug) {
    return this.$productRepository.fetchRelatedProducts(slug);
  },
  fetchFlashSaleProducts({ commit }, slug) {
    return this.$productRepository.fetchFlashSaleProducts(slug);
  },
  fetchSearchedProducts({ commit }, slug) {
    return this.$productRepository.fetchSearchedProducts(slug);
  },
  fetchPurchaseHistory({ commit }) {
    return this.$productRepository.fetchPurchaseHistory();
  },
  fetchFilteredProducts({ commit }, payload) {
    return this.$productRepository.fetchFilteredProducts(payload);
  },
  fetchProductsForCategorySubCategory({ commit }, payload) {
    return this.$productRepository.fetchProductsForCategorySubCategory(payload);
  },
  fetchSingleProduct({ commit }, payload) {
    return this.$productRepository.fetchSingleProduct(payload);
  },
  addProduct({ commit }, payload) {
    return this.$productRepository.addProduct(payload);
  },
  updateProduct({ commit }, payload) {
    return this.$productRepository.updateProduct(payload);
  },
  checkout({ commit }, payload) {
    return this.$productRepository.checkout(payload);
  },
  confirmPayment({ commit }, payload) {
    return this.$productRepository.confirmPayment(payload);
  },

  // product questions
  addProductQuestion({ commit }, payload) {
    return this.$productRepository.addProductQuestion(payload);
  },
  answerProductQuestion({ commit }, payload) {
    return this.$productRepository.answerProductQuestion(payload);
  },
  updateProductQuestionAnswer({ commit }, payload) {
    return this.$productRepository.updateProductQuestionAnswer(payload);
  },
  deleteQuestionAnswer({ commit }, payload) {
    return this.$productRepository.deleteQuestionAnswer(payload);
  },

  // product reviews
  fetchProductReviews({ commit }, payload) {
    return this.$productRepository.fetchProductReviews(payload);
  },
  reviewProduct({ commit }, payload) {
    return this.$productRepository.reviewProduct(payload);
  },
  updateProductReview({ commit }, payload) {
    return this.$productRepository.updateProductReview(payload);
  },
  deleteProductReview({ commit }, payload) {
    return this.$productRepository.deleteProductReview(payload);
  }
};

export default actions;
