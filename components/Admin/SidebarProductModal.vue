<template>
  <div>
    <ModalSidebar
      @closeModal="handleCloseProductModal"
      :is-visible="isVisible"
      title="Quick Edit Product"
    >
      <ValidationObserver
        ref="productBasicInfoObserver"
        tag="form"
        @submit.prevent="handleProductAction"
        class=""
        v-if="newProduct.name !== undefined"
      >
        <FormInput
          v-model="newProduct.name"
          clearable
          input-name="Product Name"
          validation-rules="required"
        />

        <FormInput
          v-model="newProduct.description"
          input-name="Description"
          component-type="textarea"
          validation-rules="required"
        />
        <FormInput
          v-model="newProduct.price"
          clearable
          type="number"
          step="0.01"
          input-name="Price"
          validation-rules="required|customMin:0"
        />

        <FormSelect
          v-if="headerCategories"
          :show-delete-btn="false"
          class="mb-6"
          label="Category"
          :initial-value="initialProductCategory"
          :is-loading-list="isFetchingMinimalCategories"
          :list-items="headerCategories || []"
          @selected="onCategorySelected"
        />

        <FormSelect
          v-if="subCategoriesList"
          :show-delete-btn="false"
          class="mb-6"
          label="Sub Category"
          :initial-value="initialProductSubCategory"
          :is-loading-list="isFetchingMinimalCategories"
          :list-items="subCategoriesList"
          @selected="onSubCategorySelected"
        />

        <!-- <div class="my-8 ">
          <label for="discount">Discount</label>
          <div class="flex items-center space-x-2">
            <p class="space-x-2 ">
              <span class="text-sm text-white bg-red-500">
                -{{ productPrice.discount }}
              </span>
              <span>off of</span>
              <span>
                {{ productPrice.originalPrice }}
              </span>
            </p>
          </div>
        </div> -->

        <div class="mt-4">
          <BaseButton
            :isLoading="metaInfo.isProcessingApi"
            :disabled="metaInfo.isProcessingApi"
            htmlType="submit"
            type="primary"
            >Edit Product</BaseButton
          >
        </div>
      </ValidationObserver>
    </ModalSidebar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UploadImages from "vue-upload-drop-images";
import { ValidationObserver } from "vee-validate";
import ModalSidebar from "@/components/Common/ModalSidebar";
import BaseButton from "@/components/UI/Button";
import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/Select";
import { calculateProductPriceAndDiscount } from "~/utils";

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    metaInfo: {
      type: Object,
      required: false,
      default() {
        return {
          isProcessingApi: false,
          productData: null
        };
      }
    }
  },
  components: {
    UploadImages,
    ValidationObserver,
    ModalSidebar,
    BaseButton,
    FormInput,
    FormSelect
  },
  computed: {
    ...mapState(["headerCategories"]),
    ...mapState("categories", ["minimalCategories"]),

    subCategoriesList() {
      if (!this.initialProductCategory) return null;

      return this.headerCategories.find(
        c => c.slug === this.newProduct.categorySlug
      )?.subCategories;
    },
    initialProductCategory() {
      if (!this.headerCategories) return null;

      return this.headerCategories.find(
        c => c.slug === this.newProduct.categorySlug
      );
    },
    initialProductSubCategory() {
      if (!this.initialProductCategory) return;

      return this.initialProductCategory.subCategories.find(
        s => s.slug === this.newProduct.subCategorySlug
      );
    }
  },
  data() {
    return {
      productPrice: "",
      imagesData: [],
      isFetchingMinimalCategories: false,
      newProduct: {
        name: "",
        description: "",
        imageUrl: "https://wallpaperset.com/w/full/1/a/6/52649.jpg",
        categorySlug: "",
        subCategorySlug: ""
      }
    };
  },
  mounted() {
    if (!this.headerCategories) {
      this.fetchMinimalCategories();
    }
  },
  watch: {
    isVisible: {
      handler(val) {
        if (val) {
          this.newProduct = JSON.parse(
            JSON.stringify(this.metaInfo.productData)
          );
          this.calculateProductDiscountAndPrice();
        }
      },
      immediate: true
    }
  },
  methods: {
    calculateProductDiscountAndPrice() {
      this.productPrice = calculateProductPriceAndDiscount(this.newProduct);
    },
    async fetchMinimalCategories() {
      this.isFetchingMinimalCategories = true;
      await this.$store.dispatch("fetchHeaderCategories");
      this.isFetchingMinimalCategories = false;
    },
    async handleProductAction() {
      this.isHandlingCategory = true;

      const valid = await this.isProductDetailsValid();
      if (!valid) return;

      this.$emit("handleOkAction", {
        ...this.newProduct,
        editorDescription: this.newProduct.editorDescription || ""
      });
    },
    onCategorySelected(selectedCategory) {
      if (!selectedCategory || selectedCategory.id === undefined) return;
      this.newProduct.categorySlug = selectedCategory.slug;
      this.newProduct.categoryName = selectedCategory.name;
      if (this.subCategoriesList.length > 0) {
        this.newProduct.subCategorySlug = this.subCategoriesList[0].slug;
      }
    },
    onSubCategorySelected(selectedSubCategory) {
      this.newProduct.subCategorySlug = selectedSubCategory.slug;
      this.newProduct.subCategoryName = selectedSubCategory.name;
    },
    handleCloseProductModal() {
      if (this.metaInfo.isProcessingApi) return;
      this.$emit("closeModal");
    },
    async isProductDetailsValid() {
      try {
        const valid = await this.$refs.productBasicInfoObserver.validate();
        if (!valid) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please fill in the required fields",
            type: "danger"
          });

          return false;
        }

        if (!this.newProduct.categoryName || !this.newProduct.subCategoryName) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description:
              "Please select category and subcategory for the product",
            type: "danger"
          });

          return false;
        }

        // this.newProduct.price = this.productPrice.discountedPrice;

        if (parseFloat(this.newProduct.price) <= 0) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please set the price to be more than 0",
            type: "danger"
          });
          return false;
        }
      } catch (error) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description:
            "Something went wrong. Please make sure product details are valid",
          type: "danger"
        });
      }
      return true;
    }
  }
};
</script>
