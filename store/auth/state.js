const state = () => ({
  isLoadingUser: false,
  attemptedLogin: false,
  user: null,
  cart: null,
  stripePaymentIntentId: null,
  isFetchingCart: false,
  wishlist: null,
  isFetchingWishlist: false
});

export default state;
