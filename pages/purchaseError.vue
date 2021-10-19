<template>
  <div class="purchase-error">
    <div
      class="flex flex-col items-center w-11/12 px-4 py-4 rounded-xl content md:w-5/12 bg-secondary"
    >
      <Icon class="w-16 h-16 fill-current " name="delivery-truck-error" />

      <div class="w-10/12 ">
        <h4 class="text-lg font-semibold ">Something went wrong</h4>
        <p class="mt-2 font-light ">
          Your order could not be placed. Please check if your card has
          sufficient balance.
        </p>
      </div>
    </div>
    <!-- <div class="content">
      <div class="error-icon-wrapper">
        <Icon name="delivery-truck-error" />
      </div>
      <div class="header">
        <h4>Something went wrong!</h4>
      </div>
      <p>
        Please check that you have enough balance in your card or contact your
        card provider.
      </p>

      <div class="action-buttons">
        <BaseButton type="primary" @click="$router.push('/cart')"
          >Cart</BaseButton
        >
        <BaseButton type="dark" @click="$router.push('/')">Home</BaseButton>
      </div>
    </div> -->
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";

export default {
  components: {
    Icon,
    BaseButton
  }
};
</script>

<style lang="scss" scoped>
.purchase-error {
  min-height: 50vh;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}
.content {
  width: 60%;
  margin-top: 4rem;
  text-align: center;
}
</style>
