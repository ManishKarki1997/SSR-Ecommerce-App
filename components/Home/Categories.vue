<template>
  <div>
    <BlockHeaderUI>
      <template #left>
        Popular Categories
      </template>
    </BlockHeaderUI>

    <div
      class="grid w-full xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12"
      v-if="!isLoading && categories"
    >
      <nuxt-link
        :to="'/categories/' + category.slug"
        v-for="(category, idx) in categories.slice(0, 6)"
        :key="category.uid"
        data-aos="fade-up"
        :data-aos-delay="idx * 50"
        data-aos-duration="700"
        data-aos-easing="ease-in-out"
        class=""
      >
        <div class="w-full overflow-hidden rounded-lg h-36">
          <img
            :src="category.imageUrl"
            :alt="'category image for ' + category.name"
            class="object-cover w-full h-full transition-all duration-300 transform cursor-pointer hover:scale-110"
          />
        </div>
        <div class="w-full py-2 text-center">
          <h4>{{ category.name }}</h4>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CategoryCard from "@/components/Common/CategoryCard.vue";
import BlockHeaderUI from "@/components/Common/BlockHeaderUI.vue";

export default {
  components: {
    CategoryCard,
    BlockHeaderUI
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("categories", ["isLoading", "categories"])
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      this.$store.dispatch("categories/fetchUserCategories", {
        subCategoriesOnly: true
      });
    }
  }
};
</script>
