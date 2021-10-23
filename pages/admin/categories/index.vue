<template>
  <div>
    <AdminPageHeader title="Categories">
      <BaseButton type="primary" @click="onClickCreateCategory"
        >Create Category</BaseButton
      >
    </AdminPageHeader>

    <div class="pb-16 ">
      <div
        class="grid grid-cols-2 gap-x-12 gap-y-24 categories-list lg:grid-cols-4 md:grid-cols-3"
        v-if="categories"
      >
        <CategoryCard
          v-for="category in categories"
          :key="'category-' + category.name"
          :category="category"
          @openContextMenu="onTriggerContextMenu"
          :activeContextMenuItem="activeContextMenuItem"
          @click="selectCategory"
          @selectedContextMenu="handleSelectedContextOption"
        />
      </div>

      <div
        v-if="isLoadingCategories"
        class="flex items-center justify-center w-full h-16 mt-16"
      >
        <Spinner dark title="Loading Categories" />
      </div>

      <div
        v-if="categories && pagination.hasNext"
        class="flex justify-center w-full mt-32"
      >
        <BaseButton @click="handleLoadMore">Load More</BaseButton>
      </div>
    </div>

    <SidebarCategoryModal
      :meta-info="categorySidebarMetaInfo"
      :isVisible="isCategoryModalVisible"
      @closeModal="handleCloseCategoryModal"
      @handleOkAction="onHandleOkAction"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";
import FormInput from "@/components/UI/FormInput";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import CategoryCard from "@/components/Common/CategoryCard.vue";
import Spinner from "@/components/Common/Spinner.vue";
import { readFileData } from "@/utils";
import UploadImages from "vue-upload-drop-images";
import { ValidationObserver } from "vee-validate";
import ModalSidebar from "@/components/Common/ModalSidebar.vue";
import SidebarCategoryModal from "@/components/Admin/SidebarCategoryModal.vue";

export default {
  components: {
    Icon,
    AdminPageHeader,
    CategoryCard,
    BaseButton,
    Spinner,
    ValidationObserver,
    UploadImages,
    ModalSidebar,
    FormInput,
    SidebarCategoryModal
  },
  data() {
    return {
      pagination: {
        take: 10,
        skip: 0,
        hasNext: true
      },
      categorySidebarMetaInfo: {
        isForCategory: true,
        editMode: false,
        categoryData: null,
        isProcessingApi: false
      },
      categories: null,
      activeContextMenuItem: null,
      isLoadingCategories: false,
      isHandlingCategory: false,
      isCategoryModalVisible: false,
      newCategory: {
        name: "",
        description: "",
        imageUrl: "https://wallpaperset.com/w/full/1/a/6/52649.jpg"
      }
    };
  },
  computed: {},
  mounted() {
    if (!this.categories) {
      this.fetchCategories();
    }
  },
  methods: {
    onHandleOkAction(category, imagesData) {
      if (!this.categorySidebarMetaInfo.editMode) {
        this.handleCreateCategory(category, imagesData);
      } else {
        this.handleUpdateCategory(category, imagesData);
      }
    },
    async handleUpdateCategory(category, imagesData) {
      this.isHandlingCategory = true;
      category.isCategory = true;
      if (category.name !== this.categorySidebarMetaInfo.categoryData.name) {
        category.originalName = this.categorySidebarMetaInfo.categoryData.name;
        category.originalSlug = this.categorySidebarMetaInfo.categoryData.slug;
      }

      if (this.categorySidebarMetaInfo.isProcessingApi) return;

      this.categorySidebarMetaInfo.isProcessingApi = true;

      try {
        if (imagesData.length > 0) {
          if (imagesData[0].name !== undefined) {
            const imageUrl = await this.handleImagesUpload(
              category,
              imagesData
            );
            category.imageUrl = imageUrl;
          }
        }

        const res = await this.$store.dispatch(
          "categories/updateCategory",
          category
        );
        this.categories = this.categories.map(c =>
          c.uid === res.data.payload.category.uid
            ? res.data.payload.category
            : c
        );

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: res.data.message,
          type: "success"
        });
      } catch (error) {
        if (error || error.response) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "error"
          });
          // console.log(error);
        }
      } finally {
        this.isCategoryModalVisible = false;
        this.categorySidebarMetaInfo = {
          ...this.categorySidebarMetaInfo,
          isProcessingApi: false,
          editMode: false,
          isForCategory: true,
          categoryData: null
        };
      }
    },
    async handleCreateCategory(category, imagesData) {
      this.isHandlingCategory = true;

      if (this.categorySidebarMetaInfo.isProcessingApi) return;

      this.categorySidebarMetaInfo.isProcessingApi = true;

      const imageUrl = await this.handleImagesUpload(category, imagesData);

      try {
        const res = await this.$store.dispatch("categories/createCategory", {
          ...category,
          imageUrl
        });
        this.$store.dispatch("addNotification", {
          title: "Success",
          description: res.data.message,
          type: "success"
        });
        this.categories.push(res.data.payload.category);
      } catch (error) {
        if (error.response) {
          const errors = transformAPIErrors(error);
          this.$refs.categoryObserver.setErrors(errors);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
        }
      } finally {
        this.isCategoryModalVisible = false;
        this.categorySidebarMetaInfo = {
          isProcessingApi: false,
          editMode: false,
          isForCategory: true
        };
      }
    },
    async handleImagesUpload(category, imagesToUpload) {
      try {
        const file = await readFileData(imagesToUpload[0]);
        const res = await this.$cloudinary.upload(file, {
          folder: "varyaCommerce/categories",
          uploadPreset: process.env.PRESET_NAME,
          useFileName: true,
          filenameOverride: `category-${category.name}`
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
    handleSelectedContextOption(category, selectedOption) {
      if (selectedOption.menuName === "quick-edit") {
        this.isCategoryModalVisible = true;
        this.activeContextMenuItem = null;
        this.categorySidebarMetaInfo = {
          editMode: true,
          isForCategory: true,
          categoryData: category,
          isProcessingApi: false
        };
      }
    },
    handleCloseCategoryModal() {
      this.isCategoryModalVisible = false;
      this.categorySidebarMetaInfo = {
        ...this.categorySidebarMetaInfo,
        isProcessingApi: false,
        categoryData: null,
        editMode: false
      };
    },
    onClickCreateCategory() {
      this.isCategoryModalVisible = true;
    },
    resetCategory() {
      Object.keys(this.newCategory).forEach(x => (this.newCategory[x] = ""));
    },
    selectCategory(category) {
      // this.$router.push(`categories/${category.slug}`);
      this.$router.push(
        `categories/${category.name}?categorySlug=${category.slug}`
      );
    },
    onTriggerContextMenu(menuItem) {
      this.activeContextMenuItem = menuItem;
    },
    async fetchCategories() {
      this.isLoadingCategories = true;
      const res = await this.$store.dispatch("categories/fetchCategories", {
        take: this.pagination.take,
        skip: this.pagination.skip,
        includeSubCategories: false
      });

      this.categories = res.data.payload.categories;

      if (res.data.payload.categories.length === 0) {
        this.pagination = {
          ...this.pagination,
          hasNext: false
        };
      }

      this.isLoadingCategories = false;
    },
    handleLoadMore() {
      this.pagination = {
        ...this.pagination,
        includeSubCategories: false,
        take: this.pagination.take * 2,
        skip: this.pagination.take
      };
      this.fetchCategories();
    }
  }
};
</script>
