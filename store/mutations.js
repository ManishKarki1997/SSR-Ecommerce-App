const mutations = {
  SET_BRAND_INFO(state, brandInfo) {
    state.brandInfo = brandInfo;
  },
  SET_IS_LOADING(state, loading) {
    state.isLoading = loading;
  },
  SET_HEADER_CATEGORIES(state, headerCategories) {
    state.headerCategories = headerCategories;
  },
  SET_IS_LOGGED_IN(state, payload) {
    state.isLoggedIn = payload;
  },
  SET_THEME_MODE(state, payload) {
    state.themeMode = payload;
  },
  SET_IS_CART_SIDEBAR_SHOWING(state, payload) {
    state.isCartSidebarShowing = payload;
  },
  SET_ALREADY_TRIED_LOGIN(state, payload) {
    state.alreadyTriedLogin = payload;
  },
  ADD_NOTIFICATION(state, notification) {
    const notificationId = `${state.notifications.length +
      1}-${Date.now().toString(32)}`;

    state.notifications.push({
      ...notification,
      id: notificationId,
      type: notification.type || "success",
      duration: notification.duration || 3000
    });
  },
  REMOVE_NOTIFICATION(state, notification) {
    state.notifications = state.notifications.filter(
      n => n.id !== notification.id
    );
  }
};

export default mutations;
