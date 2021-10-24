<template>
  <div v-if="headerCategories" class="w-64 text-primary">
    <div class="flex items-center mb-6 space-x-4">
      <Icon name="menu" />
      <h4 class="text-lg font-semibold ">Browse Categories</h4>
    </div>

    <ul class="">
      <li
        v-for="menuItem in headerCategories"
        :key="'menu-item-' + menuItem.name"
        class="relative mb-6 group "
      >
        <nuxt-link
          class="flex items-center justify-between "
          :to="`/categories/${menuItem.slug}`"
        >
          <div
            class="flex items-center space-x-4 transition-transform duration-300 transform group-hover:text-accent group-hover:translate-x-4"
          >
            <span>
              <Icon
                name="refresh"
                class=" text-secondary group-hover:text-accent"
              />
            </span>
            <span class="text-sm font-normal ">{{ menuItem.name }}</span>
          </div>
          <span>
            <Icon name="arrow-right" class="w-6 h-6" />
          </span>
        </nuxt-link>

        <ul
          class="absolute z-20 invisible w-56 px-4 py-4 -ml-2 rounded -top-6 group-hover:visible bg-primary left-56"
        >
          <li
            v-for="subCategory in menuItem.subCategories"
            :key="'sub-category-' + subCategory.name"
            class="mb-4 "
          >
            <nuxt-link
              class="group"
              :to="'/categories/' + menuItem.slug + '/' + subCategory.slug"
            >
              <div
                class="flex items-center space-x-4 transition-transform duration-300 transform subcategory-menu-wrapper hover:text-accent hover:translate-x-4"
              >
                <span>
                  <Icon class="w-4 h-4" name="basket" />
                </span>
                <span class="text-sm font-semibold ">{{
                  subCategory.name
                }}</span>
              </div>
            </nuxt-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/UI/Icon.vue";

export default {
  components: {
    Icon
  },
  computed: {
    ...mapState(["headerCategories"])
  }
};
</script>

<style lang="scss" scoped>
.subcategory-menu-wrapper {
  &:hover {
    svg {
      color: var(--text-accent);
    }
  }
}
</style>
