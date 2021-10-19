<template>
  <div class="relative w-full py-24 bg-primary">
    <div
      v-if="isLoadingCategory && detailedCategories[categoryName] === undefined"
      class="w-full h-32"
    >
      <Spinner dark title="Fetching category" />
    </div>
    <div
      v-if="
        !isLoadingCategory && detailedCategories[categoryName] !== undefined
      "
    >
      <!-- category header -->
      <div class="flex flex-col items-center w-full h-32 mt-32">
        <div class="flex flex-col items-center ">
          <h4 class="text-lg font-bold lg:text-3xl md:text-xl text-primary">
            {{ detailedCategories[categoryName].name }}
          </h4>

          <p class="my-2 text-secondary">
            {{ detailedCategories[categoryName].description }}
          </p>

          <div class="flex items-center mt-2 space-x-2">
            <div class="flex items-center justify-center w-full">
              <h4 class="mr-2 font-semibold text-primary">
                {{ detailedCategories[categoryName].totalProducts }}
              </h4>
              <p class=" text-secondary">products</p>
            </div>

            <div class="flex items-center justify-center w-full">
              <h4 class="mr-2 font-semibold text-primary">
                {{ detailedCategories[categoryName].totalSubCategories }}
              </h4>
              <p class=" text-secondary">subcategories</p>
            </div>
          </div>
        </div>
      </div>

      <!-- sub categories card -->
      <div class="mt-4 mb-24 md:mt-16 ">
        <div
          class="grid w-full grid-cols-1 mx-auto lg:w-7/12 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 place-items-center place-content-center"
        >
          <nuxt-link
            :to="'/categories/' + categoryName + '/' + subCategory.slug"
            v-for="(subCategory, idx) in detailedCategories[categoryName]
              .subCategories"
            :key="subCategory.uid"
            data-aos="fade-up"
            :data-aos-delay="idx * 50"
            data-aos-duration="700"
            data-aos-easing="ease-in-out"
            class="w-48 h-48 "
          >
            <div class="w-full overflow-hidden rounded-lg h-36">
              <img
                :src="subCategory.imageUrl"
                :alt="'category image for ' + subCategory.name"
                class="object-cover w-full h-full transition-all duration-300 transform cursor-pointer hover:scale-110"
              />
            </div>

            <div class="w-full py-2 text-center">
              <h4>{{ subCategory.name }}</h4>
            </div>
          </nuxt-link>
        </div>
      </div>

      <!-- main -->
      <div class="relative">
        <div class="flex w-full ">
          <aside class="hidden md:block md:w-3/12">
            <div class="sticky left-0 z-10 top-24">
              <MultiRangeSlider class="mb-4" @changed="handlePriceChange" />

              <SingleTextSelect
                v-if="detailedCategories[categoryName] !== undefined"
                :list-items="detailedCategories[categoryName].subCategories"
                sub-text-key="_count.products"
                filter-name="Subcategories"
              />
              <SingleTextSelect
                :list-items="productsSortFilters"
                filter-name="Product Type"
              />
            </div>
          </aside>

          <div class="w-full px-8 lg:w-9/12">
            <!-- product sort dropdown -->
            <div class="sticky left-0 z-20 pb-4 bg-primary top-24">
              <div
                class="flex items-center justify-between w-full filters-header"
              >
                <div class="flex items-center w-full space-x-2 lg:w-1/2">
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
              v-if="detailedCategories[categoryName].products !== undefined"
              class="grid w-full grid-cols-1 mt-16 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-36"
            >
              <ProductCard
                v-for="(product, idx) in detailedCategories[categoryName]
                  .products"
                :key="'category-product ' + product.uid"
                :idx="idx + 1"
                :product="product"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- <pre v-if="detailedCategories[categoryName] !== undefined">{{
        detailedCategories[categoryName]
      }}</pre> -->
    </div>
  </div>
</template>

<script>
const queryString = require("query-string");
import { mapState } from "vuex";
import Spinner from "@/components/Common/Spinner.vue";
import SelectDropdown from "@/components/UI/Select.vue";
import ProductCard from "@/components/Common/ProductCard.vue";
import SingleTextSelect from "@/components/UI/Filters/SingleTextSelect.vue";
import MultiRangeSlider from "@/components/UI/Filters/MultiRangeSlider.vue";

export default {
  components: {
    Spinner,
    SelectDropdown,
    ProductCard,
    SingleTextSelect,
    MultiRangeSlider
  },
  computed: {
    ...mapState("categories", ["detailedCategories"])
  },
  data() {
    return {
      categoryName: "",
      isLoadingCategory: false,
      isLoadingProducts: false,
      productParams: null,
      queryParams: null,
      priceParams: null,
      sortParams: null,
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
      ]
    };
  },
  async mounted() {
    this.categoryName = this.$route.params.category;

    this.queryParams = {
      categoryName: this.categoryName
    };

    if (
      this.categoryName &&
      this.detailedCategories[this.categoryName] === undefined
    ) {
      this.handleInitialDataFetching();
      //   this.fetchSingleCategory();
    }
  },
  methods: {
    handlePriceChange(value) {
      const priceParams = {
        price: JSON.stringify({
          min: value[0],
          max: value[1]
        })
      };
      this.priceParams = priceParams;
      this.fetchProducts();
    },
    async handleInitialDataFetching() {
      await this.fetchSingleCategory();

      await this.fetchProducts();
    },
    async fetchSingleCategory() {
      try {
        this.isLoadingCategory = true;
        const res = await this.$store.dispatch(
          "categories/fetchSingleCategory",
          {
            slug: this.categoryName,
            includeProducts: false
          }
        );
        this.$store.commit(
          "categories/ADD_CATEGORY_TO_DETAILED_CATEGORY",
          res.data.payload.category
        );
        // this.subCategory = res.data.payload.category;
      } catch (error) {
      } finally {
        this.isLoadingCategory = false;
      }
    },
    async fetchProducts() {
      try {
        const params = queryString.stringify({
          ...(this.sortParams && this.sortParams),
          ...(this.priceParams && this.priceParams),
          ...(this.queryParams && this.queryParams)
        });

        this.isLoadingProducts = true;
        const res = await this.$store.dispatch(
          "products/fetchFilteredProducts",
          params
        );
        if (this.detailedCategories[this.categoryName]) {
          const payload = {
            ...this.detailedCategories[this.categoryName],
            products: res.data.payload.products
          };

          this.$store.commit(
            "categories/ADD_CATEGORY_TO_DETAILED_CATEGORY",
            payload
          );
        }
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
    }
  }
};
</script>
