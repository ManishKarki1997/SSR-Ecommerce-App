<template>
  <ModalSidebar
    @closeModal="handleCloseCartModal"
    :is-visible="isCartSidebarShowing"
    :show-back-arrow="false"
    title="Cart"
  >
    <transition-group
      v-if="cart"
      class="py-4 overflow-y-auto"
      tag="ul"
      mode="out-in"
      name="fade-slide"
    >
      <li
        v-for="cartItem in cart"
        :key="'cart-item-' + cartItem.id"
        class="px-4 py-4 mb-6 rounded-lg bg-primary"
      >
        <div class="w-full ">
          <div class="flex justify-between">
            <div class="flex w-10/12 space-x-4">
              <nuxt-link
                :to="`/products/${cartItem.product.slug}`"
                class="w-4/12 h-24 overflow-hidden rounded-md cursor-pointer"
              >
                <img
                  :src="cartItem.product.images[0].imageUrl"
                  :alt="cartItem.product.name + ' Image'"
                  class="object-cover w-full h-full"
                />
              </nuxt-link>

              <div class="w-8/12">
                <nuxt-link
                  class="text-sm text-primary"
                  :to="`/products/${cartItem.product.slug}`"
                  >{{ cartItem.product.name }}</nuxt-link
                >

                <div class="flex items-center my-2 space-x-4">
                  <button
                    @click="
                      handleItemCountIncrementDecrement(cartItem, 'DECREMENT')
                    "
                    class="px-1 py-1 rounded-full bg-tertiary text-primary"
                  >
                    <Icon class="w-4 h-4" name="minus" />
                  </button>
                  <p class="text-sm ">{{ cartItem.count }}</p>
                  <button
                    @click="
                      handleItemCountIncrementDecrement(cartItem, 'INCREMENT')
                    "
                    class="px-1 py-1 rounded-full bg-tertiary text-primary"
                  >
                    <Icon class="w-4 h-4" name="plus" />
                  </button>
                </div>

                <!-- remove button -->
                <div>
                  <button
                    @click="removeCartItem(cartItem)"
                    class="text-sm text-primary"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 class="my-2 text-lg text-accent">
                <span>{{ constants.CURRENCY }}</span>
                <span>{{
                  (cartItem.count * cartItem.product.price).toFixed(2)
                }}</span>
              </h3>
            </div>
          </div>
        </div>
      </li>
    </transition-group>

    <div class="w-full h-full text-center " v-if="cart && cart.length === 0">
      <p class="italic text-secondary">Cart is empty</p>
    </div>

    <BaseButton
      v-if="cart && cart.length > 0"
      :is-loading="isLoadingCheckout"
      :disabled="isLoadingCheckout"
      type="primary"
      @click="handleCheckout"
      >Checkout</BaseButton
    >
  </ModalSidebar>
</template>

<script>
import { mapState } from "vuex";
import { loadStripe } from "@stripe/stripe-js";

import ModalSidebar from "@/components/Common/ModalSidebar.vue";
import Icon from "@/components/UI/Icon.vue";
import BaseButton from "@/components/UI/Button.vue";

import constants from "@/utils/constants";

export default {
  components: {
    ModalSidebar,
    Icon,
    BaseButton
  },

  computed: {
    ...mapState(["isCartSidebarShowing"]),
    ...mapState("auth", ["cart", "user", "isFetchingCart"])
  },
  data() {
    return {
      constants: {},
      publishableKey: "",
      stripe: null,
      isLoadingCheckout: false,
      tempCart: null,
      isRemovingFromCart: false
    };
  },
  mounted() {
    this.publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    this.constants = constants;

    this.handleLoadStripe();
  },
  methods: {
    async fetchUserCart() {
      this.$store.dispatch("auth/fetchUserCart");
    },
    async handleLoadStripe() {
      const stripe = await loadStripe(this.publishableKey);
      this.stripe = stripe;
    },
    async handleCheckout() {
      this.isLoadingCheckout = true;

      try {
        const res = await this.$store.dispatch("products/checkout", {
          email: this.user.email,
          products: this.cart
        });
        this.$store.commit(
          "auth/SET_STRIPE_PAYMENT_INTENT_ID",
          res.data.payload.session.payment_intent
        );
        this.stripe.redirectToCheckout({
          sessionId: res.data.payload.session.id
        });
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            type: "danger",
            title: "Error",
            description: "Something went wrong",
            duration: 3000
          });
        }
      } finally {
        // sometimes take too long to redirect to stripe.com site
        // os, don't want user to repeatedly click on it
        // this.isLoadingCheckout = false;
      }
    },
    handleCloseCartModal() {
      this.$store.commit("SET_IS_CART_SIDEBAR_SHOWING", false);
    },
    handleItemCountIncrementDecrement(cartItem, type) {
      this.$store.commit("auth/HANDLE_ITEM_COUNT_IN_CART", {
        cartItem,
        type
      });
    },
    async removeCartItem(cartItem) {
      if (this.isRemovingFromCart) return;
      try {
        this.isRemovingFromCart = true;
        const payload = {
          cartItemId: cartItem.id,
          productUid: cartItem.product.uid
        };
        await this.$store.dispatch("auth/removeProductFromCart", payload);
      } catch (error) {
      } finally {
        this.isRemovingFromCart = false;
      }
    }
  }
};
</script>
