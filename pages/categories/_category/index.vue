<template>
  <div class="relative w-full py-8 pb-32 md:pt-24 bg-primary">
    <div
      v-if="isLoadingCategory && detailedCategories[categoryName] === undefined"
      class="w-full h-32"
    >
      <Spinner dark title="Fetching category" />
    </div>

    <client-only>
      <div
        v-if="
          !isLoadingCategory && Object.keys(detailedCategories).length === 0
        "
        class="flex items-center justify-center w-full h-32 mt-32 text-center"
      >
        <div class="flex flex-col items-center ">
          <Icon name="category" />
          <p class="mt-2 text-lg text-primary">
            Category with that name not found
          </p>
        </div>
      </div>
    </client-only>

    <div
      v-if="
        !isLoadingCategory && detailedCategories[categoryName] !== undefined
      "
    >
      <!-- category header -->
      <div class="flex flex-col items-center w-full h-32 md:mt-32">
        <div class="flex flex-col items-center ">
          <h4 class="text-lg font-bold lg:text-3xl md:text-xl text-primary">
            {{ detailedCategories[categoryName].name }}
          </h4>

          <p class="my-2 text-center text-secondary">
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
      <div class="mt-12 mb-24 md:mt-16 ">
        <div
          class="grid w-full grid-cols-1 mx-auto lg:w-7/12 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 place-items-center place-content-center"
        >
          <nuxt-link
            :to="'/categories/' + categoryName + '/' + subCategory.slug"
            v-for="(subCategory, idx) in detailedCategories[categoryName]
              .subCategories"
            :key="subCategory.uid"
            data-aos="fade-up"
            :data-aos-delay="idx * 70"
            data-aos-duration="500"
            data-aos-easing="ease-in-out"
            class="w-full md:w-48 md:h-48"
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
            <div class="sticky left-0 z-10 top-20">
              <MultiRangeSlider class="mb-4" @changed="handlePriceChange" />

              <SingleTextSelect
                class="mt-10"
                v-if="detailedCategories[categoryName] !== undefined"
                :list-items="detailedCategories[categoryName].subCategories"
                sub-text-key="totalProducts"
                filter-name="Subcategories"
                @selected="handleSubCategorySelected"
              />
            </div>
          </aside>

          <div class="w-full px-0 md:px-8 lg:w-9/12">
            <!-- product sort dropdown -->
            <div class="sticky left-0 z-50 pb-4 top-20 bg-primary ">
              <div
                class="flex items-center justify-between w-full filters-header"
              >
                <div
                  class="flex items-center w-full mt-4 space-x-2 md:mt-0 lg:w-1/2"
                >
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

            <div
              v-if="
                !isLoadingProducts &&
                  detailedCategories[categoryName] !== undefined &&
                  detailedCategories[categoryName].products &&
                  detailedCategories[categoryName].products.length === 0
              "
              class="flex items-center justify-center w-full h-16"
            >
              <p class=" text-primary">
                No products found
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- mobile filters component -->
      <div
        v-if="!isMobileFiltersContentActive"
        class="fixed z-50 block bottom-8 right-8 md-hidden"
      >
        <button
          @click.stop="isMobileFiltersContentActive = true"
          aria-label="Filter Menu Toggle Button"
          class="px-2 py-2 ml-auto rounded md:hidden bg-tertiary"
        >
          <Icon name="filter" />
        </button>
      </div>
      <!-- filters content -->
      <div
        class="fixed top-0 left-0 w-full h-screen overscroll-auto bg-primary"
        v-if="isMobileFiltersContentActive"
      >
        <div class="flex flex-col h-full">
          <div class="h-full px-6 mt-32">
            <MultiRangeSlider class="mb-4" @changed="handlePriceChange" />

            <SingleTextSelect
              class="mt-10"
              v-if="detailedCategories[categoryName] !== undefined"
              :list-items="detailedCategories[categoryName].subCategories"
              sub-text-key="totalProducts"
              filter-name="Subcategories"
              @selected="handleSubCategorySelected"
            />
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
const queryString = require("query-string");
import { mapState } from "vuex";
import Spinner from "@/components/Common/Spinner.vue";
import SelectDropdown from "@/components/UI/Select.vue";
import ProductCard from "@/components/Common/ProductCard.vue";
import SingleTextSelect from "@/components/UI/Filters/SingleTextSelect.vue";
import MultiRangeSlider from "@/components/UI/Filters/MultiRangeSlider.vue";
import Icon from "@/components/UI/Icon.vue";

export default {
  components: {
    Spinner,
    SelectDropdown,
    ProductCard,
    SingleTextSelect,
    MultiRangeSlider,
    Icon
  },
  computed: {
    ...mapState("categories", ["detailedCategories"])
  },
  data() {
    return {
      categoryName: "",
      isLoadingCategory: false,
      isLoadingProducts: false,
      isMobileFiltersContentActive: false,
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
  head() {
    return {
      title: `${this.detailedCategories[this.categoryName]?.name ||
        this.categoryName} | Varya Commerce`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `${
            this.detailedCategories[this.categoryName] !== undefined
              ? this.detailedCategories[this.categoryName].description
              : this.categoryName
          } | Varya Commerce`
        },
        {
          name: "twitter:image",
          content: `${this.detailedCategories[this.categoryName] !==
            undefined && this.detailedCategories[this.categoryName].imageUrl}`
        },
        {
          name: "og:image",
          content: `${this.detailedCategories[this.categoryName] !==
            undefined && this.detailedCategories[this.categoryName].imageUrl}`
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
    handleSubCategorySelected(subCategory) {
      this.$router.push(`/categories/${this.categoryName}/${subCategory.slug}`);
    },
    handlePriceChange(value) {
      const priceParams = {
        price: JSON.stringify({
          min: value[0],
          max: value[1]
        })
      };
      this.priceParams = priceParams;
      this.isMobileFiltersContentActive = false;
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
      } catch (error) {
        if (error) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Couldn't fetch the products",
            type: "danger"
          });
        }
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
      if (this.isLoadingProducts) return;

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
