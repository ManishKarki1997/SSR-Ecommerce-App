<template>
  <div class="w-full min-h-screen bg-primary">
    <div class="pb-72">
      <HeroSection class="mt-16" />
      <FlashSalesVariant1 class="mt-32" />
      <!-- <FlashSale class="mt-56 " /> -->
      <AppServices class="mt-56" />
      <HomeProducts class="mt-32" />
      <HomeCategories class="mt-56" />
      <HomeCategoryBlock
        v-for="(products, idx) in productsResponseArr"
        :key="'home-category-' + idx"
        :category-slug="categorySlugs[idx]"
        :products="products"
        class="mt-36"
      />
    </div>
  </div>
</template>

<script>
import { generateUrl } from "@/utils";

import HeroSection from "~/components/Home/HeroSection.vue";
import HomeCategories from "@/components/Home/Categories.vue";
import HomeProducts from "@/components/Home/LatestProducts.vue";
import HomeCategoryBlock from "@/components/Home/HomeCategoryBlock.vue";
import FlashSale from "@/components/Home/FlashSale.vue";
import FlashSalesVariant1 from "@/components/Home/FlashSalesVariant1.vue";
import AppServices from "~/components/Home/AppServices.vue";

export default {
  components: {
    HeroSection,
    HomeProducts,
    HomeCategories,
    HomeCategoryBlock,
    FlashSale,
    FlashSalesVariant1,
    AppServices
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
