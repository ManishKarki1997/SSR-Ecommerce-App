<template>
  <div
    class="grid w-full grid-cols-2 px-8 py-12 rounded shadow-lg md:grid-cols-4 gap-x-8 gap-y-8 bg-secondary"
  >
    <div
      class="flex space-x-2"
      v-for="service in services"
      :key="'service-' + service.name"
    >
      <div class="w-8 h-8 ">
        <Icon
          class="w-full h-full stroke-1 text-accent"
          :name="service.iconName"
        />
      </div>
      <div>
        <h4 class="font-medium text-md">{{ service.name }}</h4>
        <p class="text-sm text-secondary">{{ service.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon.vue";

export default {
  components: {
    Icon
  },
  data() {
    return {
      services: [
        {
          iconName: "truck",
          name: "Free and Shipping",
          description: "For all orders over 50$"
        },
        {
          iconName: "money",
          name: "Money Back Guarantee",
          description: "Returned intact within a week"
        },
        {
          iconName: "secure-payment-line",
          name: "Secure Payment",
          description: "Payments through Stripe"
        },
        {
          iconName: "support",
          name: "Support",
          description: "24/7 fast customer support"
        }
      ]
    };
  }
};
</script>
