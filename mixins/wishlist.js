import { mapState } from "vuex";

export const wishlistMixin = {
  computed: {
    ...mapState("auth", ["wishlist", "user"])
  },
  data() {
    return {
      isAddingItemToWishlist: false
    };
  },
  methods: {
    checkIfProductPresentInWishlist(product) {
      return (
        this.wishlist &&
        product &&
        this.wishlist.find(x => x.product.uid === product.uid)
      );
    },

    async handleAddRemoveProductToWishlist(product) {
      if (this.isAddingItemToWishlist) return;

      if (!this.user) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description: "Please log in to your account first",
          type: "danger"
        });
        return;
      }

      this.isAddingItemToWishlist = true;
      if (this.checkIfProductPresentInWishlist(product)) {
        await this.$store.dispatch("auth/removeProductFromWishlist", {
          productUid: product.uid,
          wishlistId: this.checkIfProductPresentInWishlist(product).id
        });
      } else {
        await this.$store.dispatch("auth/addProductToWishlist", {
          product
        });
      }

      this.isAddingItemToWishlist = false;
    }
  }
};
