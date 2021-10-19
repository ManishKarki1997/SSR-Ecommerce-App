import { generateUrl } from "~/utils";

export default $axios => ({
  registerUser(user) {
    return $axios.post("users", user);
  },
  loginUser(user) {
    return $axios.post("users/login", user, {
      withCredentials: true
    });
  },
  logoutUser(user) {
    return $axios.post("users/logout", user, {
      withCredentials: true
    });
  },
  fetchCurrentUser() {
    return $axios.get("users/me", {
      withCredentials: true
    });
  },
  updateProfile(user) {
    return $axios.put("users", user, {
      withCredentials: true
    });
  },

  // cart
  fetchUserCart() {
    return $axios.get("cart", {
      withCredentials: true
    });
  },
  addProductToCart(payload) {
    return $axios.post("cart", payload, {
      withCredentials: true
    });
  },
  removeProductFromCart(payload) {
    const url = generateUrl("cart", payload);
    return $axios.delete(url, {
      withCredentials: true
    });
  },

  // wishlist
  fetchUserWishlist() {
    return $axios.get("wishlist", {
      withCredentials: true
    });
  },
  addProductToWishlist(payload) {
    return $axios.post("wishlist", payload, {
      withCredentials: true
    });
  },
  removeProductFromWishlist(payload) {
    const url = generateUrl("wishlist", payload);
    return $axios.delete(url, {
      withCredentials: true
    });
  }
});
