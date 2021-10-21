<template>
  <div class="w-full bg-primary">
    <BlockHeaderUI>
      <template #left>
        Latest Products
      </template>

      <template #right>
        <button
          @click="$router.push('/latestProducts')"
          class="flex items-center text-secondary "
        >
          <span>Explore More</span>
          <Icon name="arrow-right" />
        </button>
      </template>
    </BlockHeaderUI>

    <div
      v-if="isLoadingLatestProducts && !latestProducts"
      class="relative w-full h-32"
    >
      <Spinner dark title="Fetching products" />
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import ProductCard from "@/components/Common/ProductCard.vue";
import Spinner from "@/components/Common/Spinner.vue";
import BlockHeaderUI from "@/components/Common/BlockHeaderUI.vue";
import Icon from "@/components/UI/Icon.vue";
import BaseButton from "@/components/UI/Button.vue";

export default {
  components: {
    ProductCard,
    Spinner,
    BlockHeaderUI,
    Icon,
    BaseButton
  },
  computed: {
    ...mapState("products", ["latestProducts"])
  },
  data() {
    return {
      isLoadingLatestProducts: false
    };
  },
  mounted() {
    this.fetchLatestProducts();
  },
  methods: {
    handleSelectProduct(product) {
      this.$router.push(`/products/${product.slug}`);
    },
    async fetchLatestProducts() {
      try {
        this.isLoadingLatestProducts = true;
        const res = await this.$store.dispatch("products/fetchProducts", {
          take: 10
        });
        this.$store.commit(
          "products/SET_LATEST_PRODUCTS",
          res.data.payload.products
        );
      } catch (error) {
        if (error && error.response) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
        }
      } finally {
        this.isLoadingLatestProducts = false;
      }
    }
  }
};
</script>
