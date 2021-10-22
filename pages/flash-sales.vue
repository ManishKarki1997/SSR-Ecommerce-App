<template>
  <div class="pt-16 pb-48">
    <BlockHeaderUI>
      <template #left>
        Flash Sales
      </template>
    </BlockHeaderUI>

    <div
      v-if="isLoadingProducts && !flashSaleProducts"
      class="relative w-full h-32"
    >
      <Spinner dark title="Fetching products" />
    </div>

    <div
      v-if="
        !isLoadingLatestProducts &&
          flashSaleProducts &&
          flashSaleProducts.length === 0
      "
      class="flex items-center justify-center w-full h-72"
    >
      <p class="italic text-secondary">No products found</p>
    </div>

    <div class="products-grid" v-if="flashSaleProducts">
      <ProductCard
        @click="handleSelectProduct(product)"
        v-for="(sale, idx) in flashSaleProducts"
        :key="'flash-product-sale ' + sale.id"
        :idx="idx + 1"
        :product="sale.product"
      />
    </div>

    <div
      v-if="flashSaleProducts && pagination.hasNext"
      class="flex items-center justify-center mt-48"
    >
      <BaseButton
        :isLoading="isLoadingMoreProducts"
        @click="handleLoadMoreProducts"
        :disabled="!pagination.hasNext"
      >
        Load More Products
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { generateUrl } from "@/utils";

import BaseButton from "@/components/UI/Button";
import BlockHeaderUI from "@/components/Common/BlockHeaderUI.vue";
import ProductCard from "@/components/Common/ProductCard.vue";
import Icon from "@/components/UI/Icon.vue";
import Spinner from "@/components/Common/Spinner.vue";

export default {
  components: {
    BaseButton,
    BlockHeaderUI,
    ProductCard,
    Icon,
    Spinner
  },
  head() {
    return {
      title: `Flash Sales | Varya Commerce`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Latest products discounted for a limited time | Varya Commerce`
        }
      ]
    };
  },
  data() {
    return {
      isLoadingProducts: false,
      error: false,
      flashSaleProducts: null,
      isLoadingLatestProducts: false,
      isLoadingMoreProducts: false,
      pagination: {
        page: 1,
        take: 8,
        skip: 0,
        hasNext: true
      }
    };
  },
  async fetch() {
    try {
      const routePage = this.$route.query?.page;

      if (routePage !== undefined && parseInt(routePage) > 1) {
        this.pagination.page = this.$route.query.page;
        this.pagination.skip = this.pagination.take * this.pagination.page;
      }

      const payload = {
        take: this.pagination.take,
        skip: this.pagination.skip
      };

      this.isLoadingProducts = true;
      if (this.flashSaleProducts) {
        this.isLoadingMoreProducts = true;
      }
      const url = generateUrl("products/flashSale", payload);
      const res = await this.$axios.$get(url);

      if (res.payload.products.length === 0) {
        this.pagination.hasNext = false;
      }

      if (this.flashSaleProducts) {
        this.flashSaleProducts = [
          ...this.flashSaleProducts,
          ...res.payload.products
        ];
      } else {
        this.flashSaleProducts = res.payload.products;
      }
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
      this.isLoadingMoreProducts = false;
    }
  },

  methods: {
    async handleLoadMoreProducts() {
      if (this.pagination.hasNext) {
        this.pagination = {
          ...this.pagination,
          skip: this.pagination.skip + this.pagination.take,
          page: parseInt(this.pagination.page) + 1
        };
      }

      await this.$router.push({
        path: "flash-sales",
        query: { page: this.pagination.page }
      });

      this.$fetch();
    }
  }
};
</script>

<style lang="scss">
/* .heart-icon {
  &:hover {
    path {
      fill: red;
      stroke: red;
    }
  }
} */
</style>
