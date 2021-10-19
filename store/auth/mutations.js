const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  UPDATE_USER(state, user) {
    state.user = {
      ...state.user,
      ...user
    };
  },
  SET_STRIPE_PAYMENT_INTENT_ID(state, stripePaymentIntentId) {
    if (stripePaymentIntentId) {
      state.stripePaymentIntentId = stripePaymentIntentId;
      window.localStorage.setItem(
        "VARYA_STRIPE_PAYMENT_INTENT_ID",
        stripePaymentIntentId
      );
    }
  },
  DELETE_STRIPE_PAYMENT_INTENT_ID(state) {
    state.stripePaymentIntentId = null;
    window.localStorage.removeItem("VARYA_STRIPE_PAYMENT_INTENT_ID");
  },
  SET_CART(state, cart) {
    state.cart = cart;
  },
  SET_IS_FETCHING_CART(state, isFetchingCart) {
    state.isFetchingCart = isFetchingCart;
  },
  ADD_PRODUCT_TO_CART(state, payload) {
    state.cart = [...(state.cart && state.cart), { ...payload }];
  },
  REMOVE_PRODUCT_FROM_CART(state, cartItemId) {
    state.cart = state.cart.filter(x => x.id != cartItemId);
  },
  RESET_CART(state) {
    state.cart = [];
  },
  // Increment/Decrement product count in the cart
  HANDLE_ITEM_COUNT_IN_CART(state, { cartItem, type }) {
    if (state.cart) {
      state.cart = state.cart.map(c => {
        let countValue = c.count;

        if (type === "INCREMENT") {
          countValue = c.count + 1;
        } else {
          countValue = c.count === 0 ? 0 : c.count - 1;
        }

        if (c.id === cartItem.id) {
          return {
            ...c,
            count: countValue
          };
        }
        return c;
      });
    }
  },

  // wishlist
  SET_WISHLIST(state, wishlist) {
    state.wishlist = wishlist;
  },
  SET_IS_FETCHING_WISHLIST(state, isFetchingWishlist) {
    state.isFetchingWishlist = isFetchingWishlist;
  },
  ADD_PRODUCT_TO_WISHLIST(state, payload) {
    state.wishlist = [...(state.wishlist && state.wishlist), { ...payload }];
  },
  REMOVE_PRODUCT_FROM_WISHLIST(state, wishlistId) {
    state.wishlist = state.wishlist.filter(x => x.id != wishlistId);
  }
};

export default mutations;
