<template>
  <div class="w-full min-h-screen bg-primary">
    <div class="pb-96">
      <FlashSale class="mt-56 " />
      <HomeProducts class="mt-56" />
      <HomeCategories class="mt-56" />
      <HomeCategoryBlock
        :category-slug="categorySlugs[idx]"
        v-for="(products, idx) in productsResponseArr"
        :key="'home-category-' + idx"
        :products="products"
        class="mt-48"
        categorySlug="laptops"
      />
      <!-- <HomeCategoryBlock class="mt-48" categorySlug="consoles" />
      <HomeCategoryBlock class="mt-48" categorySlug="accessories" /> -->
    </div>
  </div>
</template>

<script>
import { generateUrl } from "@/utils";

import HomeCategories from "@/components/Home/Categories.vue";
import HomeProducts from "@/components/Home/LatestProducts.vue";
import HomeCategoryBlock from "@/components/Home/HomeCategoryBlock.vue";
import FlashSale from "@/components/Home/FlashSale.vue";

export default {
  components: {
    HomeProducts,
    HomeCategories,
    HomeCategoryBlock,
    FlashSale
  },
  head() {
    return {
      title: `Varya Commerce`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Electronic devices, gadgets and accessories shop. | Buy Acer, Dell, Asus, Razer, Apple laptops and ultrabooks at affordable prices`
        }
      ]
    };
  },
  data() {
    return {
      categorySlugs: ["laptops", "consoles", "accessories"],
      productsResponseArr: null
    };
  },
  async fetch() {
    try {
      const res = await Promise.all(
        this.categorySlugs.map(s => this.fetchCategoryProducts(s))
      );
      this.productsResponseArr = res
        .map(r => r.payload.products)
        .filter(p => p.length > 0);
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  },
  methods: {
    fetchCategoryProducts(categorySlug) {
      const url = generateUrl("products/category", {
        take: 5,
        categorySlug
      });
      return this.$axios.$get(url);
    }
  }
};
</script>
