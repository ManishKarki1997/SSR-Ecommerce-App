<template>
  <div class="relative w-full py-16 bg-primary">
    <div v-if="isLoadingProducts && !products" class="w-full h-32">
      <Spinner dark title="Fetching products" />
    </div>

    <!-- main -->
    <div class="relative">
      <div class="flex flex-col w-full md:flex-row ">
        <aside class="hidden md:block md:w-3/12">
          <div class="sticky left-0 z-10 top-24">
            <MultiRangeSlider class="mb-4" @changed="handlePriceChange" />

            <template v-if="categorySelectItems">
              <SingleTextSelect
                class="mb-8"
                :minimized="true"
                :list-items="categorySelectItems"
                filter-name="Category"
                @selected="handleSelectCategoryFilter"
              />
            </template>
          </div>
        </aside>

        <div class="w-full lg:w-9/12 md:px-8">
          <!-- product sort dropdown -->
          <div class="sticky left-0 z-50 pb-4 bg-primary md:top-18 top-20">
            <div
              class="flex flex-col items-center justify-between w-full md:flex-row filters-header"
            >
              <div class="md:block">
                <p>
                  Search results for <strong>`{{ searchQuery }}`</strong>
                </p>
              </div>
              <div class="flex items-center pt-6 space-x-2 md:pt-0">
                <p class="font-semibold text-primary">Sort By</p>
                <SelectDropdown
                  class="w-56"
                  :show-delete-btn="false"
                  :initial-value="productsSortFilters[0]"
                  :list-items="productsSortFilters"
                  @selected="handleSelectFilter"
                />
              </div>
            </div>
          </div>

          <!-- products list -->
          <div
            class="grid w-full grid-cols-1 mt-16 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-36"
          >
            <ProductCard
              v-for="(product, idx) in products"
              :key="'subcategory-product ' + product.uid"
              :idx="idx + 1"
              :product="product"
            />
          </div>

          <div class="flex items-center justify-center w-full h-16">
            <p class=" text-primary" v-if="products && products.length === 0">
              No products found
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- mobile filters component -->
    <div class="fixed z-50 block bottom-8 right-8 md-hidden">
      <button
        @click.stop="isMobileFiltersContentActive = true"
        aria-label="Filter Menu Toggle Button"
        class="px-2 py-2 ml-auto rounded bg-tertiary"
      >
        <Icon name="filter" />
      </button>

      <!-- filters content -->
      <div
        class="fixed top-0 left-0 hidden w-full h-screen md:block overscroll-auto bg-primary"
        v-if="isMobileFiltersContentActive"
      >
        <div class="relative flex flex-col h-full">
          <div class="h-full px-6 mt-32">
            <MultiRangeSlider class="mb-4" @changed="handlePriceChange" />

            <template v-if="categorySelectItems">
              <SingleTextSelect
                class="mb-8"
                :minimized="true"
                :list-items="categorySelectItems"
                filter-name="Category"
                @selected="handleSelectCategoryFilter"
              />
            </template>
          </div>

          <button
            @click.stop="isMobileFiltersContentActive = false"
            aria-label="Filter Menu Toggle Button"
            class="absolute px-2 py-2 ml-auto rounded bg-tertiary bottom-8 right-8"
          >
            <Icon name="close" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
const queryString = require("query-string");

import Spinner from "@/components/Common/Spinner.vue";
import SelectDropdown from "@/components/UI/Select.vue";
import ProductCard from "@/components/Common/ProductCard.vue";
import SingleTextSelect from "@/components/UI/Filters/SingleTextSelect.vue";
import MultiRangeSlider from "@/components/UI/Filters/MultiRangeSlider.vue";
import Icon from "@/components/UI/Icon.vue";

import { cartMixin } from "@/mixins/cart.js";
import { wishlistMixin } from "@/mixins/wishlist.js";

export default {
  components: {
    ProductCard,
    SingleTextSelect,
    MultiRangeSlider,
    Spinner,
    SelectDropdown,
    Icon
  },
  data() {
    return {
      isLoadingProducts: false,
      isMobileFiltersContentActive: false,
      sortParams: null,
      priceParams: null,
      productsSortFilters: [
        {
          name: "Latest",
          filterName: "createdAt",
          sort: "desc"
        },
        {
          name: "Oldest",
          filterName: "createdAt",
          sort: "asc"
        }
      ],
      products: null,
      searchQuery: "",
      categorySlug: ""
    };
  },
  mixins: [cartMixin, wishlistMixin],
  watch: {
    "$route.query.searchQuery": {
      handler: function(newVal) {
        if (!newVal) return;
        this.searchQuery = newVal;
        this.fetchProducts();
      },
      deep: true
    }
  },
  mounted() {
    this.searchQuery = this.$route.query?.searchQuery;
    const priceParams = {
      price: JSON.stringify({
        min: 0,
        max: 5000
      })
    };

    this.priceParams = priceParams;
    this.fetchProducts();
  },
  computed: {
    ...mapState(["headerCategories"]),
    categorySelectItems() {
      if (!this.headerCategories) return null;

      return this.headerCategories.map(c => ({
        name: c.name,
        slug: c.slug,
        id: c?.id,
        uid: c?.uid
      }));
    }
  },
  methods: {
    async fetchProducts() {
      const params = queryString.stringify({
        searchQuery: this.searchQuery,
        categorySlug: this.categorySlug,
        ...this.priceParams,
        ...this.categoryParams,
        ...(this.sortParams && this.sortParams)
      });

      try {
        this.isLoadingProducts = true;
        const res = await this.$store.dispatch(
          "products/fetchSearchedProducts",
          params
        );

        this.products = res.data.payload.products;
      } catch (error) {
      } finally {
        this.isLoadingProducts = false;
      }
    },
    handleSelectFilter(filter) {
      const sortParams = {
        sort: JSON.stringify({
          name: filter.filterName,
          sortBy: filter.sort
        })
      };
      this.sortParams = sortParams;
      this.fetchProducts();
    },
    handlePriceChange(value) {
      const priceParams = {
        price: JSON.stringify({
          min: parseInt(value[0]),
          max: parseInt(value[1])
        })
      };
      this.priceParams = priceParams;
      this.isMobileFiltersContentActive = false;
      this.fetchProducts();
    },
    handleSelectCategoryFilter(category) {
      this.categorySlug = category.slug;
      this.isMobileFiltersContentActive = false;

      this.fetchProducts();
    }
  }
};
</script>

<style></style>
