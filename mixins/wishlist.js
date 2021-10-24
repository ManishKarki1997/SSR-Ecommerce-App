import { mapState } from "vuex";

export const wishlistMixin = {
  computed: {
    ...mapState("auth", ["wishlist"])
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

      this.isAddingItemToWishlist = true;
      if (this.checkIfProductPresentInWishlist(product)) {
        await this.$store.dispatch("auth/removeProductFromWishlist", {
          productUid: this.product.uid,
          wishlistId: this.checkIfProductPresentInWishlist(product).id
        });
      } else {
        await this.$store.dispatch("auth/addProductToWishlist", {
          product
        });
      }

      // to prevent spam clicking
      setTimeout(() => {
        this.isAddingItemToWishlist = false;
      }, 1500);
    }
  }
};
