<template>
  <div class="w-full bg-primary">
    <BlockHeaderUI>
      <template #left>
        Flash Sales
      </template>

      <template #right>
        <button
          @click="$router.push('/flash-sales')"
          class="flex items-center text-secondary "
        >
          <span>Explore More Items On Sale</span>
          <Icon name="arrow-right" />
        </button>
      </template>
    </BlockHeaderUI>

    <div>
      <!-- error while fetching -->
      <div class="w-full h-32" v-if="error">
        <p class="mt-2 text-lg text-primary">
          Couldn't fetch flash sale products
        </p>
      </div>

      <!-- loading spinner -->
      <div
        v-if="isLoadingProducts && !flashSaleProducts"
        class="relative w-full h-32"
      >
        <Spinner dark title="Fetching products on sale" />
      </div>

      <div class="products-grid" v-if="!isLoadingProducts && flashSaleProducts">
        <ProductCard
          @click="handleSelectProduct(product)"
          v-for="(sale, idx) in flashSaleProducts"
          :key="'sale- ' + sale.id"
          :idx="idx + 1"
          :product="sale.product"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/Common/ProductCard.vue";
import Spinner from "@/components/Common/Spinner.vue";
import BlockHeaderUI from "@/components/Common/BlockHeaderUI.vue";
import Icon from "@/components/UI/Icon.vue";
import BaseButton from "@/components/UI/Button.vue";

export default {
  components: {
    BlockHeaderUI,
    Spinner,
    ProductCard,
    Icon,
    BaseButton
  },
  data() {
    return {
      isLoadingProducts: false,
      error: false,
      flashSaleProducts: null
    };
  },
  async fetch() {
    try {
      this.isLoadingProducts = true;
      const res = await this.$axios.$get("products/flashSale", {
        take: 8
      });
      this.flashSaleProducts = res.payload.products;
    } catch (error) {
      if (error) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description: "Couldn't fetch flash sale products",
          type: "danger"
        });
        this.error = true;
      }
    } finally {
      this.isLoadingProducts = false;
    }
  }
};
</script>
