<template>
  <div class="w-full ">
    <observer @on-change="onChange">
      <BlockHeaderUI>
        <template #left>
          Related Products
        </template>
      </BlockHeaderUI>

      <div
        v-if="isLoadingRelatedProducts && !relatedProducts"
        class="relative w-full h-32"
      >
        <Spinner dark />
      </div>

      <div
        v-if="
          !isLoadingRelatedProducts &&
            relatedProducts &&
            relatedProducts.length === 0
        "
        class="flex items-center justify-center w-full h-32"
      >
        <p class="italic ">No related products available at the moment.</p>
      </div>

      <div
        v-if="
          !isLoadingRelatedProducts &&
            relatedProducts &&
            relatedProducts.length > 0
        "
        class="products-grid"
      >
        <ProductCard
          v-for="(product, index) in relatedProducts"
          :key="'related-product' + product.uid"
          :product="product"
          :idx="index"
        />
      </div>
    </observer>
  </div>
</template>

<script>
import Observer from "vue-intersection-observer";

import Spinner from "@/components/Common/Spinner.vue";
import ProductCard from "@/components/Common/ProductCard.vue";
import BlockHeaderUI from "@/components/Common/BlockHeaderUI.vue";

export default {
  components: {
    Observer,
    Spinner,
    ProductCard,
    BlockHeaderUI
  },
  data() {
    return {
      isLoadingRelatedProducts: false,
      relatedProducts: null,
      visible: false
    };
  },
  // async fetch() {
  //   this.isLoadingRelatedProducts = true;

  //   try {
  //     const slug = this.$route.params.slug;

  //     if (!slug) {
  //       return this.$store.dispatch("addNotification", {
  //         title: "Error",
  //         description: "Invalid Product Slug",
  //         type: "danger"
  //       });
  //     }

  //     const res = await this.$axios.$get("products/relatedProducts/" + slug);

  //     this.relatedProducts = res.payload.relatedProducts;
  //   } catch (error) {
  //     if (error) {
  //       console.log(error);
  //       this.$store.dispatch("addNotification", {
  //         title: "Error",
  //         description: "Couldn't fetch related products",
  //         type: "danger"
  //       });
  //     }
  //   } finally {
  //     this.isLoadingRelatedProducts = false;
  //   }
  // },

  methods: {
    onChange(entry, obv) {
      this.visible = entry.isIntersecting;
      if (this.visible) {
        if (!this.relatedProducts) {
          // this.$fetch();
          this.fetchRelatedProducts();
        }
      }
    },

    async fetchRelatedProducts() {
      this.isLoadingRelatedProducts = true;

      try {
        const slug = this.$route.params.slug;

        if (!slug) {
          return this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Invalid Product Slug",
            type: "danger"
          });
        }

        const res = await this.$axios.$get("products/relatedProducts/" + slug);
        this.relatedProducts = res.payload.relatedProducts;
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Couldn't fetch related products",
            type: "danger"
          });
        }
      } finally {
        this.isLoadingRelatedProducts = false;
      }
    }
  }
};
</script>
