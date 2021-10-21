<template>
  <div class="pt-16 pb-32">
    <BlockHeaderUI>
      <template #left>
        Latest Products
      </template>
    </BlockHeaderUI>

    <div
      v-if="isLoadingLatestProducts && !latestProducts"
      class="relative w-full h-32"
    >
      <Spinner dark title="Fetching products" />
    </div>

    <div
      v-if="
        !isLoadingLatestProducts &&
          latestProducts &&
          latestProducts.length === 0
      "
      class="flex items-center justify-center w-full h-72"
    >
      <p class="italic text-secondary">No products found</p>
    </div>

    <div
      class="products-grid"
      v-if="!isLoadingLatestProducts && latestProducts"
    >
      <ProductCard
        @click="handleSelectProduct(product)"
        v-for="(product, idx) in latestProducts"
        :key="'latest-product ' + product.uid"
        :idx="idx + 1"
        :product="product"
      />
    </div>

    <div
      v-if="latestProducts && pagination.hasNext"
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
import { mapState } from "vuex";

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
      title: `Latest Products | Varya Commerce`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `All the newly stocked latest products available. | Varya Commerce`
        }
      ]
    };
  },
  data() {
    return {
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

  computed: {
    ...mapState("products", ["latestProducts"])
  },
  mounted() {
    const routePage = this.$route.query?.page;

    if (routePage !== undefined && parseInt(routePage) > 1) {
      this.pagination.page = this.$route.query.page;
      this.pagination.skip = this.pagination.take * this.pagination.page;
    }

    if (this.latestProducts) {
      this.pagination.skip = this.pagination.take;
    } else {
      this.fetchLatestProducts();
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
        path: "latestProducts",
        query: { page: this.pagination.page }
      });

      this.fetchLatestProducts();
    },
    async fetchLatestProducts() {
      try {
        if (this.latestProducts) {
          this.isLoadingMoreProducts = true;
        } else {
          this.isLoadingLatestProducts = true;
        }
        const payload = {
          take: this.pagination.take,
          skip: this.pagination.skip
        };

        const res = await this.$store.dispatch(
          "products/fetchProducts",
          payload
        );

        if (this.latestProducts) {
          this.$store.commit(
            "products/ADD_LATEST_PRODUCTS",
            res.data.payload.products
          );
        } else {
          this.$store.commit(
            "products/SET_LATEST_PRODUCTS",
            res.data.payload.products
          );
        }

        if (res.data.payload.products.length === 0) {
          this.pagination.hasNext = false;
        }
      } catch (error) {
        if (error) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong while fetching latest products.",
            type: "danger"
          });
        }
      } finally {
        this.isLoadingMoreProducts = false;
        this.isLoadingLatestProducts = false;
      }
    }
  }
};
</script>

<style lang="scss">
.heart-icon {
  &:hover {
    path {
      fill: red;
      stroke: red;
    }
  }
}
</style>
