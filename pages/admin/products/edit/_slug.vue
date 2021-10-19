<template>
  <div class="w-full min-h-screen bg-primary">
    <AdminPageHeader title="Update Product"> </AdminPageHeader>

    <div class="flex items-center mb-6 space-x-2 tabs">
      <button
        @click="handleSetActivePage(tab)"
        v-for="(tab, idx) in tabs"
        :key="'tab-' + idx + 1"
        :class="[{ 'border border-gray-300': activeTab === tab.slug }]"
        class="px-6 py-2 rounded-lg text-primary bg-secondary"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- basic information tab -->
    <div class="w-full mt-16">
      <ValidationObserver
        v-show="activeTab === 'basic-information'"
        ref="productBasicInfoObserver"
        tag="form"
        class="space-y-6"
      >
        <div
          v-if="
            minimalCategories && subCategories && newProduct.name !== undefined
          "
          class="flex items-center mb-16 spacing-x-12"
        >
          <FormSelect
            v-if="minimalCategories"
            :initial-value="minimalCategories[0]"
            :list-items="minimalCategories || []"
            label="Category"
            :show-delete-btn="false"
            @selected="handleSelectCategory"
            class="-mt-3 w-72"
          />

          <FormSelect
            :initial-value="selectedSubCategory"
            :list-items="subCategories"
            label="SubCategory"
            :show-delete-btn="false"
            @selected="handleSelectSubcategory"
            class="ml-8 -mt-3 w-72"
          />
        </div>

        <div class="flex justify-between space-x-8 ">
          <FormInput
            class=""
            input-name="Name"
            type="text"
            icon-left="rename"
            :clearable="true"
            validationRules="required"
            v-model="newProduct.name"
          />

          <FormInput
            class=""
            input-name="Short Info"
            type="text"
            icon-left="align-justify"
            :clearable="true"
            validationRules="required|customMax:120"
            :max-length="120"
            v-model="newProduct.shortInfo"
          />
        </div>

        <FormInput
          class=""
          input-name="Price"
          icon-left="align-justify"
          :clearable="true"
          validationRules="required"
          v-model="newProduct.price"
        />

        <FormInput
          class=""
          input-name="Description"
          component-type="textarea"
          :clearable="true"
          validationRules="required"
          v-model="newProduct.description"
        />
      </ValidationObserver>
    </div>

    <div v-show="activeTab === 'detailed-information'" class="">
      <Editor v-model="newProduct.editorDescription" />
    </div>

    <div v-show="activeTab === 'images'" class="">
      <!-- just disable toggling when in update mode -->
      <div v-if="false" class="mb-8 ">
        <div class="flex items-center mb-2">
          <label for="imageUploadType" class="w-64 mr-4">{{
            uploadImagesFromDevice ? "Upload from Computer" : "Upload from URL"
          }}</label>
          <CheckboxToggle
            :show-labels="false"
            v-model="uploadImagesFromDevice"
          />
        </div>
      </div>

      <UploadImages
        v-if="uploadImagesFromDevice"
        :max="3"
        uploadMsg="Product Images"
        :initial-files="tempImages"
        @changed="handleSetUploadedImages"
      />

      <div class="w-full lg:w-9/12" v-if="!uploadImagesFromDevice">
        <div class="flex space-x-6">
          <FormInput input-name="Image Url" v-model="imageFromUrl" />
          <span
            class="w-10 h-10 px-2 py-2 mt-12 rounded-lg bg-secondary"
            v-if="tempImages.length < 3"
            @click="addImagesFromUrl"
          >
            <Icon name="plus" />
          </span>
        </div>

        <div class="flex items-center mt-10 space-x-4">
          <div
            v-for="(image, index) in tempImages"
            :key="image + '-' + index"
            class="relative w-48 h-48 rounded-lg"
          >
            <span
              @click="removeImagesFromUrl(image, index)"
              class="absolute px-1 py-1 bg-red-200 rounded-lg cursor-pointer remove-image-wrapper -top-2 -right-2"
            >
              <Icon name="trash" />
            </span>
            <img
              class="object-cover w-full h-full rounded-xl"
              :src="image.imageUrl"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'filters'">
      <div class="flex flex-wrap items-center justify-between">
        <div
          v-for="filter in newProduct.filters"
          :key="'filter-' + filter.id"
          class="w-5/12 mb-8"
        >
          <template v-if="filter.filterType === 'MULTIPLE_SELECT'">
            <label>{{ filter.name }}</label>

            <FormSelect
              v-if="filter.filterOptions && filter.filterOptions.length > 0"
              :list-items="filter.filterOptions"
              :show-delete-btn="false"
              :initial-value="getInitialSelectedFilterOption(filter)"
              @selected="handleSelectFilterOption"
            />
          </template>
          <template v-if="filter.filterType === 'SINGLE_SELECT'">
            <label>{{ filter.name }}</label>
            <FormInput
              class="mt-5"
              :show-label="false"
              :value="filter.value"
              :input-name="'Input for ' + filter.name"
              v-model="filter.value"
            />
          </template>
        </div>
      </div>

      <div class="mt-6">
        <BaseButton
          :disabled="isUpdatingProduct"
          type="primary"
          @click="onClickUpdateProduct"
        >
          Update Product
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";

import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";
import FormInput from "@/components/UI/FormInput";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import Spinner from "@/components/Common/Spinner.vue";
import FormSelect from "@/components/UI/Select.vue";
import CheckboxToggle from "@/components/UI/CheckBoxToggle.vue";
import Editor from "~/components/Common/Editor.vue";
import UploadImages from "vue-upload-drop-images";
import { readFileData, transformAPIErrors } from "@/utils";

export default {
  components: {
    BaseButton,
    AdminPageHeader,
    Spinner,
    FormSelect,
    Editor,
    ValidationObserver,
    Icon,
    FormInput,
    CheckboxToggle,
    UploadImages
  },
  data() {
    return {
      editorContents: "",
      activeTab: "basic-information",
      tabs: [
        {
          name: "Basic Information",
          slug: "basic-information"
        },
        {
          name: "Detailed Information",
          slug: "detailed-information"
        },
        {
          name: "Images",
          slug: "images"
        },
        {
          name: "Filters",
          slug: "filters"
        }
      ],
      subCategories: null,
      selectedCategory: null,
      selectedSubCategory: null,
      isUpdatingProduct: false,
      newProduct: {
        name: "",
        shortInfo: "",
        description: "",
        editorDescription: "",
        price: "",
        categoryName: "",
        subCategoryName: "",
        images: [],
        filters: [],
        imagesToDelete: []
      },
      tempImages: [],
      imageFromUrl: "",
      imagesData: null,
      uploadImagesFromDevice: false,
      originalProductData: null
    };
  },
  computed: {
    ...mapState("categories", ["minimalCategories"])
  },
  mounted() {
    this.fetchProductDetails();
  },
  methods: {
    getInitialSelectedFilterOption(filter) {
      if (!filter || !this.originalProductData) return {};

      let selected = {};

      this.originalProductData.filters.forEach(x => {
        filter.filterOptions.forEach(y => {
          if (y.name === x.value) {
            const updated = {
              name: x.value,
              id: x.id
            };
            selected = updated;
          }
        });
      });

      return selected;
    },
    async fetchProductDetails() {
      const res = await this.$store.dispatch(
        "products/fetchSingleProduct",
        this.$route.params.slug
      );
      this.newProduct = {
        ...res.data.payload.product,
        imagesToDelete: []
      };
      this.originalProductData = {
        ...res.data.payload.product
      };
      this.fetchMinimalCategories();
      this.fetchSubCatgoriesForCategory();
      this.fetchFiltersForSubCategory();
      this.tempImages = this.newProduct.images;
    },
    handleSelectFilterOption(selectedValue) {
      const idx = this.newProduct.filters.findIndex(
        x => x.id === selectedValue.filterId
      );
      if (!idx) {
        return;
      }
      this.newProduct.filters[idx].value = selectedValue.name;
    },
    handleSetActivePage(tab) {
      this.activeTab = tab.slug;
    },
    async fetchFiltersForSubCategory() {
      const res = await this.$store.dispatch(
        "filters/fetchFiltersForASubcategory",
        {
          // categoryName: "Electronic Devices",
          // subCategoryName: "Smartphones"
          categoryName: this.newProduct.categoryName,
          subCategoryName: this.newProduct.subCategoryName
        }
      );

      if (res.data.payload.filters.length === 0) {
        return;
      }
      this.newProduct.filters = res.data.payload.filters.map((x, i) => ({
        ...x,
        categoryName: this.newProduct.categoryName,
        subCategoryName: this.newProduct.subCategoryName,
        value:
          x.filterType === "MULTIPLE_SELECT" ? x.filterOptions[0]?.name : null
      }));
    },
    async fetchMinimalCategories() {
      const res = await this.$store.dispatch(
        "categories/fetchMinimalCategories"
      );

      if (res.data.payload.categories.length > 0) {
        this.selectedCategory = this.minimalCategories.find(
          x => x.name === this.newProduct.categoryName
        );
      }

      this.fetchSubCatgoriesForCategory();
    },
    async fetchSubCatgoriesForCategory() {
      const res = await this.$store.dispatch(
        "categories/fetchSubcategoriesForACategory",
        {
          categoryName: this.newProduct.categoryName,
          minimal: true
        }
      );
      this.subCategories = res.data.payload.subCategories;
      this.selectedSubCategory = this.subCategories.find(
        x => x.name === this.newProduct.subCategoryName
      );
    },
    handleSelectCategory(category) {
      this.selectedCategory = category;
      this.newProduct.categoryName = category.name;
      this.fetchSubCatgoriesForCategory();
    },
    handleSelectSubcategory(subCategory) {
      this.selectedSubCategory = subCategory;
      this.newProduct.subCategoryName = subCategory.name;
      this.fetchFiltersForSubCategory();
    },
    addImagesFromUrl() {
      if (this.tempImages.length === 3 || !this.imageFromUrl) return;

      this.tempImages.push({
        imageUrl: this.imageFromUrl
      });
      this.imageFromUrl = "";
    },
    removeImagesFromUrl(image, index) {
      if (this.tempImages.length === 0) return;

      if (
        this.originalProductData.images.find(x => x.imageUrl === image.imageUrl)
      ) {
        this.newProduct.imagesToDelete.push(image);
      }

      this.tempImages = this.tempImages.filter((x, i) => i != index);
      // this.tempImages.splice(index, 1);
    },
    handleSetUploadedImages(imagesToUpload, deletedFile) {
      // if (deletedFile) {
      //   this.tempImages = this.tempImages.filter(
      //     x => x.imageUrl !== deletedFile.imageUrl
      //   );
      //   this.newProduct.imagesToDelete.push(deletedFile);
      // }
      this.imagesData = imagesToUpload;
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
          this.isUpdatingProduct = false;
          return false;
        }

        if (!this.newProduct.categoryName || !this.newProduct.subCategoryName) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description:
              "Please select category and subcategory for the product",
            type: "danger"
          });
          this.isUpdatingProduct = false;
          return false;
        }

        if (parseFloat(this.newProduct.price) <= 0) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please set the price to be more than 0",
            type: "danger"
          });
          this.isUpdatingProduct = false;
          return false;
        }

        if (this.newProduct.images.length === 0) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please set at least one product image",
            type: "danger"
          });
          this.isUpdatingProduct = false;
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
    },
    async onClickUpdateProduct() {
      try {
        this.isUpdatingProduct = true;
        this.newProduct.images = this.tempImages;
        if (!this.isProductDetailsValid()) {
          this.isUpdatingProduct = false;
          return;
        }

        const res = await this.$store.dispatch(
          "products/updateProduct",
          this.newProduct
        );

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: "Product added successfully",
          type: "success"
        });
        this.$router.go(-1);
      } catch (error) {
        if (error) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
        }
      } finally {
        this.isUpdatingProduct = false;
      }
    },
    async handleImagesUpload(product, imageToUpload) {
      try {
        const file = await readFileData(imageToUpload);
        const res = await this.$cloudinary.upload(file, {
          folder: "varyaCommerce/products",
          uploadPreset: process.env.PRESET_NAME,
          useFileName: true,
          filenameOverride: `product-${product.name}`
        });
        return res.url;
      } catch (error) {
        if (error.response) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong while uploading the image",
            type: "danger"
          });
        }
      }
    },
    resetProduct() {
      Object.keys(this.newProduct).forEach(x => (this.newProduct[x] = ""));
      this.imageFromUrl = "";
      this.tempImages = [];
      this.uploadImagesFromDevice = false;
      this.imagesData = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.remove-image-wrapper {
  svg {
    fill: red !important;
    width: 20px;
    height: 20px;
  }
}
</style>
