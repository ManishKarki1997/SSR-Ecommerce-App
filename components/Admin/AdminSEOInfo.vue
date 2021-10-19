<template>
  <div>
    <div v-if="brandInfoCopy" class="w-full px-4 py-4 bg-secondary rounded-xl">
      <div class="mb-6 ">
        <label class="font-semibold " for="phoneNumbers">SEO Information</label>
      </div>
      <div class="w-full ">
        <UploadImages
          class="mb-6 "
          :max="1"
          :initial-files="seo.ogImage ? [{ imageUrl: seo.ogImage }] : null"
          uploadMsg="Brand Logo"
          @changed="handleSetUploadedImages"
        />

        <div class="flex items-center space-x-2">
          <FormInput input-name="Meta Title" v-model="seo.metaTitle" />
          <FormInput
            input-name="Meta Description"
            v-model="seo.metaDescription"
          />
        </div>

        <div class="flex items-center mt-5 space-x-2">
          <FormInput input-name="OG Title" v-model="seo.ogTitle" />
          <FormInput input-name="OG Description" v-model="seo.ogDescription" />
        </div>

        <div class="mt-5">
          <BaseButton
            :isLoading="isProcessing"
            :disabled="isProcessing"
            @click="handleUpdateSEOInfo"
            type="primary"
            icon-left="edit"
          >
            Update SEO
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon";
import FormInput from "@/components/UI/FormInput.vue";
import BaseButton from "@/components/UI/Button.vue";
import UploadImages from "vue-upload-drop-images";
import { readFileData } from "@/utils";

export default {
  props: {
    brandInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    Icon,
    FormInput,
    BaseButton,
    UploadImages
  },
  data() {
    return {
      brandInfoCopy: null,
      imagesData: [],
      isProcessing: false,
      seo: {
        metaTitle: "",
        metaDescription: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: ""
      }
    };
  },
  watch: {
    brandInfo: {
      immediate: true,
      handler(newVal) {
        if (newVal && !this.brandInfoCopy) {
          this.brandInfoCopy = JSON.parse(JSON.stringify(newVal));
          this.seo = newVal.seo
            ? JSON.parse(JSON.stringify(newVal.seo))
            : { ...this.seo };
        }
      }
    }
  },
  methods: {
    handleSetUploadedImages(imagesToUpload) {
      this.imagesData = imagesToUpload;
    },
    async handleUploadOGImage(imageToUpload) {
      try {
        const file = await readFileData(imageToUpload);
        const res = await this.$cloudinary.upload(file, {
          folder: "varyaCommerce/brand",
          uploadPreset: process.env.PRESET_NAME,
          useFileName: true,
          filenameOverride: `og-image`
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
    async handleUpdateSEOInfo() {
      try {
        this.isProcessing = true;
        let newOGImageUrl = "";

        // new og image selected. upload it to cloudinary and get the url
        if (this.imagesData.length > 0) {
          newOGImageUrl = await this.handleUploadOGImage(this.imagesData[0]);
        }

        const payload = {
          schemaName: "SEO",
          actionType: "UPDATE",
          payload: {
            ...this.seo,
            ogImage: newOGImageUrl || this.seo.ogImage
          }
        };
        const res = await this.$store.dispatch("updateBrandDetails", payload);
        this.seo = {
          ...res.data.payload.seo
        };
        this.$store.dispatch("addNotification", {
          title: "Success",
          description: "SEO updated successfully",
          type: "success"
        });
      } catch (error) {
        if (error) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description:
              error.response?.data?.message ||
              "Something went wrong while updating the SEO information.",
            type: "danger"
          });
        }
      } finally {
        this.isProcessing = false;
      }
    }
  }
};
</script>

<style></style>
