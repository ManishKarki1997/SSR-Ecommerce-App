<template>
  <div class="purchase-success">
    <div
      class="flex flex-col items-center w-11/12 px-4 py-4 rounded-xl content md:w-5/12 bg-secondary"
    >
      <Icon name="delivery-truck" />

      <div class="w-10/12 ">
        <h4 class="text-lg font-semibold ">Your order has been placed.</h4>
        <p class="mt-2 font-light ">
          We will deliver the product(s) to you as soon as possible. Stay tuned!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";

import { mapState } from "vuex";

export default {
  components: {
    Icon,
    BaseButton
  },
  computed: {
    ...mapState("auth", ["user", "cart"])
  },
  watch: {
    cart: {
      // it might take a while to have the cart load, in which case, the cart will be null, so the confirmPayment will be invalid
      // so, watch the cart object and send the request only when the products are available
      handler(newVal) {
        if (newVal !== null) {
          this.confirmPayment();
        }
      }
    }
  },
  methods: {
    async confirmPayment() {
      const stripePaymentIntentId = localStorage.getItem(
        "VARYA_STRIPE_PAYMENT_INTENT_ID"
      );

      if (!stripePaymentIntentId) {
        this.$router.push("/");
        return;
      }

      const res = await this.$store.dispatch("products/confirmPayment", {
        products: this.cart,
        paymentIntentId: stripePaymentIntentId
      });

      if (res.data.error) {
        this.$store.dispatch("addNotification", {
          type: "error",
          title: "Error",
          description: "Something went wrong",
          duration: 3000
        });
        return;
      }
      this.$store.dispatch("addNotification", {
        type: "success",
        title: "Success",
        description: res.data.message,
        duration: 3000
      });
      this.$store.commit("auth/RESET_CART");
      this.$store.commit("auth/DELETE_STRIPE_PAYMENT_INTENT_ID");
    }
  }
};
</script>

<style lang="scss" scoped>
.purchase-success {
  min-height: 50vh;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    margin-top: 4rem;
    text-align: center;
  }
}
</style>
