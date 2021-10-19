import { generateUrl } from "@/utils";

export default $axios => ({
  fetchProducts(payload) {
    const url = generateUrl("products", payload);
    return $axios.get(url);
  },
  fetchRelatedProducts(slug) {
    return $axios.get(`products/relatedProducts/${slug}`);
  },
  fetchSearchedProducts(payload) {
    const url = `products/search?${payload}`;
    return $axios.get(url);
  },
  fetchPurchaseHistory() {
    return $axios.get(`orders`, {
      withCredentials: true
    });
  },
  checkout(payload) {
    return $axios.post(`orders`, payload, {
      withCredentials: true
    });
  },
  confirmPayment(payload) {
    return $axios.post(`orders/confirmPayment`, payload, {
      withCredentials: true
    });
  },
  fetchFilteredProducts(payload) {
    // const url = generateUrl("products/filtered", payload);
    const url = `products/filtered?${payload}`;
    return $axios.get(url);
  },
  fetchProductsForCategorySubCategory(payload) {
    const url = generateUrl("products/category", payload);
    // console.log({ url, includes: url.includes("&") });
    let parsedUrl = url;
    if (parsedUrl.includes("&")) {
      parsedUrl = url.replace(" & ", "*");
    }
    return $axios.get(parsedUrl, {
      withCredentials: true
    });
  },
  fetchSingleProduct(slug) {
    return $axios.get(`products/single/${slug}`);
  },
  addProduct(payload) {
    return $axios.post("products", payload, {
      withCredentials: true
    });
  },
  updateProduct(payload) {
    return $axios.put("products", payload, {
      withCredentials: true
    });
  },

  // product questions
  addProductQuestion(payload) {
    return $axios.post("questions", payload, {
      withCredentials: true
    });
  },
  answerProductQuestion(payload) {
    return $axios.post("questions/answer", payload, {
      withCredentials: true
    });
  },
  updateProductQuestionAnswer(payload) {
    return $axios.put("questions/answer", payload, {
      withCredentials: true
    });
  },
  deleteQuestionAnswer(payload) {
    const url = generateUrl("questions", payload);

    return $axios.delete(url, {
      withCredentials: true
    });
  },

  // product reviews
  fetchProductReviews(payload) {
    const url = generateUrl(`reviews/${payload.productId}`, payload);
    return $axios.get(url);
  },
  reviewProduct(payload) {
    return $axios.post(`reviews`, payload, {
      withCredentials: true
    });
  },
  updateProductReview(payload) {
    return $axios.put(`reviews`, payload, {
      withCredentials: true
    });
  },
  deleteProductReview(reviewId) {
    return $axios.delete(`reviews/${reviewId}`, {
      withCredentials: true
    });
  }
});
