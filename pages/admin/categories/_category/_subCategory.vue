<template>
  <div>
    <AdminPageHeader title="Products">
      <div class="flex items-center space-x-2">
        <BaseButton @click="fetchProducts" icon-right="refresh"
          >Refresh</BaseButton
        >
        <BaseButton type="primary" @click="onClickAddProduct"
          >Add Product</BaseButton
        >
      </div>
    </AdminPageHeader>

    <div>
      <div
        class="grid grid-cols-2 gap-x-12 gap-y-24 categories-list lg:grid-cols-4 md:grid-cols-3"
        v-if="products"
      >
        <ProductCard
          v-for="(product, index) in products"
          :key="'product-' + product.name"
          :product="product"
          :idx="index"
          :showWishlistAndCartBtns="false"
          @openContextMenu="onTriggerContextMenu"
          :activeContextMenuItem="activeContextMenuItem"
          @click="selectProduct(product)"
        />
      </div>

      <div
        v-if="isLoadingProducts"
        class="flex items-center justify-center w-full h-16 mt-16"
      >
        <Spinner dark title="Loading Products" />
      </div>

      <div
        v-if="products && pagination.hasNext"
        class="flex justify-center w-full mt-32"
      >
        <BaseButton @click="handleLoadMore">Load More</BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import ProductCard from "@/components/Common/ProductCard.vue";
import Spinner from "@/components/Common/Spinner.vue";

export default {
  components: {
    Icon,
    AdminPageHeader,
    ProductCard,
    BaseButton,
    Spinner
  },
  data() {
    return {
      pagination: {
        take: 10,
        skip: 0,
        hasNext: true
      },
      activeContextMenuItem: null,
      isLoadingProducts: false
    };
  },
  computed: {
    ...mapState("products", ["allProducts"]),
    products() {
      if (!this.allProducts) return null;

      return this.allProducts.filter(
        x =>
          x.categorySlug === this.$route.params.category &&
          x.subCategorySlug === this.$route.params.subCategory
      );
    }
  },
  mounted() {
    if (
      !this.allProducts ||
      (this.$route.params.category &&
        this.allProducts &&
        !this.allProducts.find(
          x =>
            x.categoryName === this.$route.params.category &&
            x.subCategoryName === this.$route.params.subCategory
        ))
    ) {
      this.fetchProducts();
    }
  },
  methods: {
    onClickAddProduct() {},
    selectProduct(product) {
      console.log(product);
    },
    onTriggerContextMenu(menuItem) {
      this.activeContextMenuItem = menuItem;
    },
    async fetchProducts() {
      this.isLoadingProducts = true;
      try {
        const res = await this.$store.dispatch(
          "products/fetchProductsForCategorySubCategory",
          {
            categorySlug: this.$route.params.category,
            subCategorySlug: this.$route.params.subCategory,
            take: this.pagination.take,
            skip: this.pagination.skip
          }
        );

        this.$store.commit("products/SET_ALL_PRODUCTS", {
          products: res.data.payload.products,
          merge: this.allProducts ? true : false
        });

        if (res.data.payload.products.length === 0) {
          this.pagination = {
            ...this.pagination,
            hasNext: false
          };
        }

        this.isLoadingProducts = false;
      } catch (error) {
        if (error.response) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            type: "error",
            description: error.response.data.message
          });
        }
      }
    },
    handleLoadMore() {
      this.pagination = {
        ...this.pagination,
        take: this.pagination.take,
        skip: this.pagination.take
      };
      this.fetchProducts();
    }
  }
};
</script>
