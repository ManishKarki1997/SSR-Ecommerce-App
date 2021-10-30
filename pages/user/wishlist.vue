<template>
  <div class="pt-16 ">
    <div class="w-full text-center">
      <h4 class="text-2xl font-semibold text-primary">My Wishlist</h4>
    </div>

    <div
      v-if="wishlist && wishlist.length > 0"
      class="mt-16 overflow-auto lg:overflow-visible"
    >
      <table class="table w-full space-y-6 text-sm border-separate table-fixed">
        <thead class="">
          <tr>
            <th class="p-3 text-left">
              <span class="text-lg font-semibold ">
                Product
              </span>
            </th>
            <th class="p-3 text-left">
              <span class="text-lg font-semibold ">
                Price
              </span>
            </th>
            <th class="p-3 text-left">
              <span class="text-lg font-semibold ">
                Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="wishlistItem in wishlist"
            :key="'wishlist-key-' + wishlistItem.id"
            class="w-full "
          >
            <td class="p-3">
              <div class="flex items-center space-x-6">
                <nuxt-link
                  :to="'/products/' + wishlistItem.product.name"
                  class="w-32 h-24 overflow-hidden rounded-md cursor-pointer"
                >
                  <img
                    :src="wishlistItem.product.images[0].imageUrl"
                    :alt="'Product Image of ' + wishlistItem.product.name"
                    class="object-cover object-top w-full h-full"
                  />
                </nuxt-link>

                <nuxt-link
                  class="text-base "
                  :to="'/products/' + wishlistItem.product.name"
                  >{{ wishlistItem.product.name }}</nuxt-link
                >
              </div>
            </td>

            <td class="p-3">
              <p class="text-base text-primary">
                <span>{{ constants.CURRENCY }}</span>
                <span>{{
                  productDiscountAndPrice(wishlistItem.product).discountedPrice
                }}</span>
                <!-- <span>{{ wishlistItem.product.price }}</span> -->
              </p>
            </td>

            <td class="p-3">
              <div class="flex flex-col md:flex-row md:items-center">
                <button
                  @click="handleQuickViewProduct(wishlistItem.product)"
                  class="px-6 py-2 text-xs text-white rounded-lg bg-btnPrimary md:text-base"
                >
                  Quick View
                </button>
                <div
                  class="flex items-center justify-center mt-4 ml-0 md:ml-6 md:mt-0"
                >
                  <!-- <button
                    @click="handleAddRemoveProductToCart(wishlistItem.product)"
                    class="px-6 py-2 text-xs rounded text-primary md:text-base"
                  >
                    {{
                      isProductPresentInCart(wishlistItem.product)
                        ? "Remove From Cart"
                        : "Add To Cart"
                    }}
                  </button> -->
                  <button
                    @click="handleAddRemoveProductToWishlist(wishlistItem)"
                    class="px-6 py-2 text-xs rounded text-primary md:text-base"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="flex items-center justify-center w-full h-32 mt-32 text-center"
      v-if="wishlist && wishlist.length === 0"
    >
      <div class="flex flex-col items-center">
        <Icon name="inbox" />
        <p class="mt-2 text-lg text-primary">
          Wishlist is empty
        </p>
      </div>
    </div>

    <transition v-if="selectedProductToQuickView" name="fade" mode="out-in">
      <ProductQuickView
        :product="selectedProductToQuickView"
        @closeModal="closeQuickViewModal"
        @handleProductAddRemove="handleAddRemoveProductToCart"
      />
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";

import constants from "@/utils/constants";

import BaseButton from "@/components/UI/Button.vue";
import Icon from "@/components/UI/Icon.vue";
import ProductQuickView from "@/components/User/ProductQuickView.vue";
import { calculateProductPriceAndDiscount } from "~/utils";

export default {
  components: {
    BaseButton,
    ProductQuickView,
    Icon
  },
  computed: {
    ...mapState("auth", ["wishlist", "cart"])
  },
  data() {
    this.constants = constants;

    return {
      isRemovingProductFromWishlist: false,
      selectedProductToQuickView: null
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
    productDiscountAndPrice(product) {
      return product && calculateProductPriceAndDiscount(product);
    },

    async handleAddRemoveProductToCart(product) {
      if (this.isProductPresentInCart(product)) {
        const cartItemId = this.cart.find(c => c.product.uid === product.uid)
          ?.id;

        const payload = {
          cartItemId,
          productUid: product.uid
        };
        await this.$store.dispatch("auth/removeProductFromCart", payload);
      } else {
        const payload = {
          count: 1,
          totalPrice: product.price,
          product
        };

        await this.$store.dispatch("auth/addProductToCart", payload);
      }
    },
    async handleAddRemoveProductToWishlist(wishlistItem) {
      this.isRemovingProductFromWishlist = true;
      await this.$store.dispatch("auth/removeProductFromWishlist", {
        productUid: wishlistItem.product.uid,
        wishlistId: wishlistItem.id
      });

      // to prevent spam clicking
      setTimeout(() => {
        this.isRemovingProductFromWishlist = false;
      }, 1500);
    },
    closeQuickViewModal() {
      this.selectedProductToQuickView = null;
    },
    handleQuickViewProduct(product) {
      this.selectedProductToQuickView = product;
    }
  }
};
</script>

<style lang="scss" scoped>
table {
  tr th,
  tr td {
    &:first-child {
      width: 55%;
    }

    &:nth-child(2) {
      width: 10%;
    }

    &:nth-child(3) {
      width: 35%;
    }
  }
}
</style>
