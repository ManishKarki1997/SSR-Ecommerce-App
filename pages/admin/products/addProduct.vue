<template>
  <div class="w-full min-h-screen bg-primary">
    <AdminPageHeader title="Add Product"> </AdminPageHeader>

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
        <div class="flex items-center mb-16 spacing-x-12">
          <FormSelect
            v-if="minimalCategories"
            :initial-value="minimalCategories[0]"
            :list-items="minimalCategories || []"
            label="Category"
            @selected="handleSelectCategory"
            class="-mt-3 w-72"
          />

          <FormSelect
            :list-items="subCategories || []"
            label="SubCategory"
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
          type="number"
          icon-left="align-justify"
          :clearable="true"
          validationRules="required|customMin:0"
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
      <div class="mb-8 ">
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
        @changed="handleSetUploadedImages"
      />

      <div class="w-full lg:w-9/12" v-if="!uploadImagesFromDevice">
        <div class="flex items-center space-x-6">
          <FormInput input-name="Image Url" v-model="imageFromUrl" />
          <span v-if="tempImages.length < 3" @click="addImagesFromUrl">
            <Icon name="plus" />
          </span>
        </div>

        <div class="flex items-center space-x-4">
          <div
            v-for="(image, index) in tempImages"
            :key="image + '-' + index"
            class="relative w-48 h-48 rounded-lg"
          >
            <span
              @click="removeImagesFromUrl(index)"
              class="absolute px-1 py-1 text-red-500 bg-red-200 rounded-lg cursor-pointer remove-image-wrapper -top-2 -right-2"
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
              :list-items="filter.filterOptions"
              :initial-value="filter.filterOptions[0]"
              @selected="handleSelectFilterOption"
            />
          </template>
          <template v-if="filter.filterType === 'SINGLE_SELECT'">
            <label>{{ filter.name }}</label>
            <FormInput
              class="mt-5"
              :show-label="false"
              :input-name="'Input for ' + filter.name"
              v-model="filter.value"
            />
          </template>
        </div>
      </div>

      <div class="mt-6">
        <BaseButton
          :disabled="isAddingProduct"
          type="primary"
          @click="onClickAddProduct"
        >
          Add Product
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
      isAddingProduct: false,
      newProduct: {
        name: "",
        shortInfo: "",
        description: "",
        editorDescription: "",
        price: "",
        categoryName: "",
        subCategoryName: "",
        images: [],
        filters: []
      },
      tempImages: [
        {
          imageUrl: "https://images3.alphacoders.com/116/thumb-1920-1164575.png"
        }
      ],
      imageFromUrl: "",
      imagesData: null,
      uploadImagesFromDevice: false
    };
  },
  computed: {
    ...mapState("categories", ["minimalCategories"])
  },
  mounted() {
    if (!this.minimalCategories) {
      this.fetchMinimalCategories();
    }
    // this.fetchFiltersForSubCategory();
  },
  methods: {
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

      this.newProduct.filters = res.data.payload.filters.map((x, i) => ({
        ...x,
        categoryName: this.newProduct.categoryName,
        subCategoryName: this.newProduct.subCategoryName,
        value:
          x.filterType === "MULTIPLE_SELECT" ? x.filterOptions[0].name : null
      }));
    },
    async fetchMinimalCategories() {
      const res = await this.$store.dispatch(
        "categories/fetchMinimalCategories"
      );
      this.selectedCategory = res.data.payload.categories[0];
      if (res.data.payload.categories.length > 0) {
        this.newProduct.categoryName = res.data.payload.categories[0].name;
      }
      this.fetchSubCatgoriesForCategory();
    },
    async fetchSubCatgoriesForCategory() {
      try {
        const res = await this.$store.dispatch(
          "categories/fetchSubcategoriesForACategory",
          {
            categoryName: this.selectedCategory.name,
            minimal: true
          }
        );

        this.subCategories = res.data.payload.subCategories;
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Couldn't fetch subcategories data",
            type: "danger"
          });
        }
      }
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
    removeImagesFromUrl(idx) {
      if (this.tempImages.length === 0) return;

      this.tempImages.splice(idx, 1);
    },
    handleSetUploadedImages(imagesToUpload) {
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
          this.isAddingProduct = false;
          return false;
        }

        if (!this.newProduct.categoryName || !this.newProduct.subCategoryName) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description:
              "Please select category and subcategory for the product",
            type: "danger"
          });
          this.isAddingProduct = false;
          return false;
        }

        if (!this.newProduct.price <= 0) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please set the price to be more than 0",
            type: "danger"
          });
          this.isAddingProduct = false;
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
    async onClickAddProduct() {
      try {
        this.isAddingProduct = true;
        if (!this.isProductDetailsValid()) {
          this.isAddingProduct = false;
          return;
        }

        if (!this.uploadImagesFromDevice) {
          this.newProduct.images = [...this.tempImages];
        } else {
          for (const img of this.imagesData) {
            const url = await this.handleImagesUpload(this.newProduct, img);
            this.newProduct.images.push({
              imageUrl: url
            });
          }
        }

        const res = await this.$store.dispatch(
          "products/addProduct",
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
            type: "error"
          });
        }
      } finally {
        this.isAddingProduct = false;
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
