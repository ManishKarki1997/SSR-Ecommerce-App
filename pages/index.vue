<template>
  <div class="w-full min-h-screen bg-primary">
    <div class="pb-96">
      <HomeProducts class="mt-56" />
      <HomeCategories class="mt-56" />
      <HomeCategoryBlock class="mt-48" categorySlug="laptops" />
      <HomeCategoryBlock class="mt-48" categorySlug="consoles" />
      <HomeCategoryBlock class="mt-48" categorySlug="accessories" />
    </div>
  </div>
</template>

<script>
import HomeCategories from "@/components/Home/Categories.vue";
import HomeProducts from "@/components/Home/LatestProducts.vue";
import HomeCategoryBlock from "@/components/Home/HomeCategoryBlock.vue";

export default {
  components: {
    HomeProducts,
    HomeCategories,
    HomeCategoryBlock
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
  }
};
</script>
