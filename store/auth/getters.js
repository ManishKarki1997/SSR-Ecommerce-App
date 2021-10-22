export default {
  user: state => {
    return state.user;
  },
  isLoadingUser: state => state.isLoadingUser,
  attemptedLogin: state => state.attemptedLogin
};
