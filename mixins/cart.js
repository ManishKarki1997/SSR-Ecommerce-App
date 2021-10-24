import { mapState } from "vuex";
import calculateProductPriceAndDiscount from "@/utils/calculateProductPriceAndDiscount";

export const cartMixin = {
  computed: {
    ...mapState("auth", ["cart"])
  },
  data() {
    return {
      isRemovingFromCart: false,
      isAddingItemToCart: false
    };
  },
  methods: {
    isProductPresentInCart(product) {
      return (
        this.cart &&
        product &&
        this.cart.find(x => x.product.uid === product.uid)
      );
    },
    productPricing(product) {
      return product && calculateProductPriceAndDiscount(product);
    },

    async handleAddRemoveProductToCart(product) {
      if (this.isAddingItemToCart) return;

      this.isAddingItemToCart = true;
      if (this.isProductPresentInCart(product)) {
        const cartItemId = this.cart.find(c => c.product.uid === product.uid)
          .id;
        const payload = {
          cartItemId,
          productUid: product.uid
        };
        await this.$store.dispatch("auth/removeProductFromCart", payload);
      } else {
        const payload = {
          count: this.productQtyCount || 1,
          totalPrice:
            (this.productQtyCount || 1) *
            this.productPricing(product).discountedPrice,
          product
        };

        await this.$store.dispatch("auth/addProductToCart", payload);
      }

      // prevent spam clicking
      setTimeout(() => {
        this.isAddingItemToCart = false;
      }, 1000);
    }
  }
};
