<template>
  <div class="flex flex-col w-full md:flex-row md:justify-between">
    <MegaMenu class="hidden w-full md:4/12 lg:w-2/12 md:block" />
    <HeroSlider class="w-full md:8/12 lg:w-9/12" />
  </div>
</template>

<script>
import HeroSlider from "@/components/Home/HeroSlider.vue";
import MegaMenu from "@/components/Home/MegaMenu.vue";

export default {
  components: {
    HeroSlider,
    MegaMenu
  }
};
</script>
