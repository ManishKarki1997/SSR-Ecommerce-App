<template>
  <div>
    <ValidationObserver
      ref="brandInfoObserver"
      tag="form"
      @submit.prevent="onSubmitBrandInfo"
      class="mt-8 space-y-6"
    >
      <div class="rounded-md shadow-sm ">
        <UploadImages
          class="mb-6 "
          :max="1"
          uploadMsg="Brand Logo"
          :initial-files="
            brandInfoCopy.logo ? [{ imageUrl: brandInfoCopy.logo }] : null
          "
          @changed="handleSetUploadedImages"
        />
        <div class="flex mb-6 space-x-8">
          <FormInput
            class=""
            input-name="Brand Name"
            type="text"
            icon-left="text"
            :clearable="true"
            :show-required-field-asterisk="true"
            validationRules="required"
            v-model="brandInfoCopy.name"
          />
          <FormInput
            class=""
            input-name="Subtitle"
            type="text"
            icon-left="text"
            :clearable="true"
            validationRules=""
            v-model="brandInfoCopy.subtitle"
          />
        </div>
        <FormInput
          class="mb-6"
          input-name="Short Description"
          type="text"
          component-type="textarea"
          icon-left="text"
          :max-length="300"
          :clearable="true"
          :show-required-field-asterisk="true"
          validationRules=""
          v-model="brandInfoCopy.description"
        />

        <div>
          <BaseButton
            type="primary"
            :disabled="isProcessing"
            :isLoading="isProcessing"
            htmlType="submit"
            iconLeft="plane"
            >Update</BaseButton
          >
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver } from "vee-validate";

import Icon from "@/components/UI/Icon";
import FormInput from "@/components/UI/FormInput.vue";
import BaseButton from "@/components/UI/Button.vue";
import { readFileData } from "@/utils";
import UploadImages from "vue-upload-drop-images";

export default {
  props: {
    brandInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    ValidationObserver,
    Icon,
    FormInput,
    BaseButton,
    UploadImages
  },
  data() {
    return {
      imagesData: [],
      isProcessing: false,
      brandInfoCopy: null
    };
  },
  watch: {
    brandInfo: {
      immediate: true,
      handler(newVal) {
        if (newVal && !this.brandInfoCopy) {
          this.brandInfoCopy = JSON.parse(JSON.stringify(newVal));
        }
      }
    }
  },
  mounted() {},
  methods: {
    async handleSaveBrandInfo() {
      try {
        const res = await this.$store.dispatch(
          "addBrandInfoDetails",
          this.brandInfo
        );
        console.log(res.data.payload);
      } catch (error) {
        if (error) {
          console.log(error.response);
        }
      }
    },
    handleSetUploadedImages(imagesToUpload) {
      this.imagesData = imagesToUpload;
    },
    async handleUploadBrandLogo(imageToUpload) {
      try {
        const file = await readFileData(imageToUpload);
        const res = await this.$cloudinary.upload(file, {
          folder: "varyaCommerce/brand",
          uploadPreset: process.env.PRESET_NAME,
          useFileName: true,
          filenameOverride: `brand-logo`
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
    async onSubmitBrandInfo() {
      try {
        this.isProcessing = true;

        let brandLogoUrl = "";

        if (this.imagesData?.length > 0) {
          brandLogoUrl = await this.handleUploadBrandLogo(this.imagesData[0]);
        }
        const payload = {
          schemaName: "BRAND_INFO",
          actionType: "UPDATE",
          payload: {
            name: this.brandInfoCopy.name,
            description: this.brandInfoCopy.description,
            subtitle: this.brandInfoCopy.subtitle,
            logo: brandLogoUrl || this.brandInfoCopy.logo || ""
          }
        };

        const res = await this.$store.dispatch("updateBrandDetails", payload);
        this.brandInfoCopy = {
          ...this.brandInfoCopy,
          ...res.data.payload.brandInfo
        };

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: "Info updated successfully",
          type: "success"
        });
      } catch (error) {
        if (error.response) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description:
              error.response.message === undefined
                ? "Something went wrong"
                : error.response.message,
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
