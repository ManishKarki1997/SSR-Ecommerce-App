<template>
  <div class="">
    <AdminPageHeader title="SubCategories">
      <BaseButton type="primary" @click="onClickCreateCategory"
        >Create Subcategory</BaseButton
      >
    </AdminPageHeader>

    <div class="w-full h-full ">
      <div
        v-if="
          !isLoadingSubcategories && subCategories && subCategories.length === 0
        "
        class="flex items-center justify-center w-full mt-48 "
      >
        <div class="no-categories-wrapper">
          <Icon name="empty-white-box" />
          <p>No Subcategories available</p>
        </div>
      </div>

      <div
        class="grid grid-cols-2 gap-x-12 gap-y-24 categories-list lg:grid-cols-4 md:grid-cols-3"
        v-if="!isLoadingSubcategories && subCategories"
      >
        <CategoryCard
          v-for="subCategory in subCategories"
          :key="'subCategory-' + subCategory.name"
          :category="subCategory"
          @openContextMenu="onTriggerContextMenu"
          :activeContextMenuItem="activeContextMenuItem"
          @click="viewSubCategoryProducts(subCategory)"
          @selectedContextMenu="handleSelectedContextOption"
        />
      </div>

      <div
        v-if="isLoadingSubcategories"
        class="flex items-center justify-center w-full h-16 mt-16"
      >
        <Spinner dark title="Loading Subcategories" />
      </div>

      <div
        v-if="subCategories && pagination.hasNext"
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
import { ValidationObserver } from "vee-validate";

import { readFileData, transformAPIErrors } from "@/utils";
import Icon from "@/components/UI/Icon";
import FormInput from "@/components/UI/FormInput";
import BaseButton from "@/components/UI/Button";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import CategoryCard from "@/components/Common/CategoryCard.vue";
import ModalSidebar from "@/components/Common/ModalSidebar.vue";
import Spinner from "@/components/Common/Spinner.vue";
import UploadImages from "vue-upload-drop-images";
import SidebarCategoryModal from "@/components/Admin/SidebarCategoryModal.vue";

export default {
  components: {
    Icon,
    AdminPageHeader,
    CategoryCard,
    BaseButton,
    Spinner,
    ModalSidebar,
    FormInput,
    UploadImages,
    ValidationObserver,
    SidebarCategoryModal
  },
  data() {
    return {
      initialFiles: ["https://wallpaperset.com/w/full/1/a/6/52649.jpg"],
      pagination: {
        take: 10,
        skip: 0,
        hasNext: true
      },
      categorySidebarMetaInfo: {
        isForCategory: false,
        editMode: false,
        categoryData: null,
        isProcessingApi: false
      },
      isCategoryModalVisible: false,
      activeContextMenuItem: null,
      isLoadingSubcategories: false,
      subCategories: null,
      categoryName: "",
      categorySlug: "",
      initialSubCategoryDetails: null
    };
  },
  computed: {},
  mounted() {
    this.categoryName = this.$route.params.category;
    this.categorySlug = this.$route.query.categorySlug;

    this.fetchSubcategoriesForACategory();
  },
  methods: {
    onClickCreateCategory() {
      this.isCategoryModalVisible = true;
    },
    onHandleOkAction(category, imagesData) {
      if (!this.categorySidebarMetaInfo.editMode) {
        this.handleCreateSubCategory(category, imagesData);
      } else {
        this.handleUpdateCategory(category, imagesData);
      }
    },
    async handleUpdateCategory(category, imagesData) {
      this.isHandlingCategory = true;

      if (this.categorySidebarMetaInfo.isProcessingApi) return;

      this.categorySidebarMetaInfo.isProcessingApi = true;

      const payload = {
        isCategory: false,
        id: category.id,
        uid: category.uid,
        imageUrl: category.imageUrl,
        description: category.description,
        parentId: category.parentId,
        parentName: category.parentName,
        parentSlug: category.parentSlug,
        isDeleted: category.isDeleted,
        slug: category.slug,
        updatedAt: category.updatedAt,
        createdAt: category.createdAt,
        name: category.name,
        originalName: this.categorySidebarMetaInfo.categoryData.name,
        originalParentName: this.categorySidebarMetaInfo.categoryData
          .parentName,
        originalParentSlug: this.categorySidebarMetaInfo.categoryData.parentSlug
      };

      try {
        if (imagesData.length > 0) {
          if (imagesData[0].name !== undefined) {
            const imageUrl = await this.handleImagesUpload(payload, imagesData);

            payload.imageUrl = imageUrl;
          }
        }

        const res = await this.$store.dispatch(
          "categories/updateCategory",
          payload
        );

        // just remove the subCategory from the list if it has been changed to another category
        if (payload.originalParentName !== payload.parentName) {
          this.subCategories = this.subCategories.filter(
            s => s.uid !== res.data.payload.category.uid
          );
        } else {
          this.subCategories = this.subCategories.map(s =>
            s.uid === res.data.payload.category.uid
              ? res.data.payload.category
              : s
          );
        }

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: "SubCategory updated successfully",
          type: "success"
        });
      } catch (error) {
        if (error.response) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong",
            type: "danger"
          });
          console.log(error);
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
    async handleCreateSubCategory(category, imagesData) {
      this.isHandlingCategory = true;

      if (this.categorySidebarMetaInfo.isProcessingApi) return;

      if (!this.categoryName.trim() || !this.categorySlug.trim()) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description:
            "Category Name and Slug not present. Please don't modify data in the url",
          type: "danger"
        });
        return;
      }

      this.categorySidebarMetaInfo.isProcessingApi = true;

      const imageUrl = await this.handleImagesUpload(category, imagesData);
      // const imageUrl =
      //   "https://res.cloudinary.com/dnoibyqq2/image/upload/v1634973673/varyaCommerce/categories/subCategory-Parametric_Transformer_jkkgcz.jpg";

      try {
        const payload = {
          ...category,
          categorySlug: this.categorySlug,
          categoryName: this.categoryName,
          imageUrl
        };

        const res = await this.$store.dispatch(
          "categories/createCategory",
          payload
        );
        this.$store.dispatch("addNotification", {
          title: "Success",
          description: res.data.message,
          type: "success"
        });
        this.subCategories.push(res.data.payload.category);
      } catch (error) {
        if (error.response) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
          const errors = transformAPIErrors(error);
          this.$refs.categoryObserver.setErrors(errors);
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
          filenameOverride: `subCategory-${category.name}`
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
          isForCategory: false,
          categoryData: category,
          isProcessingApi: false
        };
      }
    },

    viewSubCategoryProducts(subCategory) {
      this.$router.push(
        `/admin/categories/${this.$route.params.category}/${subCategory.slug}`
      );
    },
    onTriggerContextMenu(menuItem) {
      this.activeContextMenuItem = menuItem;
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
    async fetchSubcategoriesForACategory() {
      this.isLoadingSubcategories = true;
      try {
        const res = await this.$store.dispatch(
          "categories/fetchSubcategoriesForACategory",
          {
            take: this.pagination.take || 10,
            skip: this.pagination.skip || 0,
            categoryName: this.categoryName
          }
        );

        if (!this.subCategories) {
          this.subCategories = res.data.payload.subCategories;
        } else {
          // just to be absolutely sure there is no duplicate
          res.data.payload.subCategories.forEach(s => {
            if (!this.subCategories.find(x => x.uid === s.uid)) {
              this.subCategories.push(s);
            }
          });
        }

        if (res.data.payload.subCategories.length === 0) {
          this.pagination = {
            ...this.pagination,
            hasNext: false
          };
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      } finally {
        this.isLoadingSubcategories = false;
      }
    },
    handleLoadMore() {
      this.pagination = {
        ...this.pagination,
        includeSubCategories: false,
        skip: this.pagination.skip + this.pagination.take,
        take: this.pagination.take
      };
      this.fetchSubcategoriesForACategory();
    }
  }
};
</script>

<style lang="scss">
.no-categories-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    width: 4rem !important;
    height: 4rem !important;
    fill: var(--primary-text);
  }
}
</style>
