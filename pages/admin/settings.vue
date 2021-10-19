<template>
  <div>
    <AdminPageHeader title="Settings"> </AdminPageHeader>

    <div class="grid grid-cols-2 gap-2 lg:gap-6 md:grid-cols-4">
      <button
        @click="activeSettingsTab = tab.key"
        :class="[
          activeSettingsTab === tab.key
            ? 'bg-tertiary text-accent font-semibold '
            : 'hover:text-accent'
        ]"
        class="relative w-full px-8 py-2 rounded-lg "
        v-for="tab in settingsTabs"
        :key="tab.key"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- settings tab contents -->
    <div v-if="brandInfo" class="px-8 py-8">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <AdminBrandInfo
            :brand-info="brandInfo"
            v-if="activeSettingsTab === 'brand-info'"
          />
          <AdminContactInfo
            :brand-info="brandInfo"
            v-if="activeSettingsTab === 'contact-info'"
          />
          <AdminSEOInfo
            :brand-info="brandInfo"
            v-if="activeSettingsTab === 'seo'"
          />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";

import Icon from "@/components/UI/Icon";
import FormInput from "@/components/UI/FormInput.vue";
import BaseButton from "@/components/UI/Button.vue";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import AdminBrandInfo from "@/components/Admin/AdminBrandInfo.vue";
import AdminSEOInfo from "@/components/Admin/AdminSEOInfo.vue";
import AdminContactInfo from "@/components/Admin/AdminContactInfo.vue";

export default {
  components: {
    AdminPageHeader,
    ValidationObserver,
    Icon,
    FormInput,
    BaseButton,
    AdminBrandInfo,
    AdminSEOInfo,
    AdminContactInfo
  },
  data() {
    return {
      settingsTabs: [
        {
          name: "Brand Info",
          key: "brand-info"
        },
        {
          name: "Contact Info",
          key: "contact-info"
        },
        {
          name: "SEO",
          key: "seo"
        }
      ],
      brandInfoCopy: {
        brandInfo: {
          name: "",
          subtitle: "",
          description: "",
          logo:
            "https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress"
        },
        contactInfo: {
          contactNumbers: [],
          location: {
            street: "",
            city: "",
            country: "",
            district: "",
            zone: "",
            state: ""
          },
          socialMedias: {
            name: "Facebook",
            profileUrl: "https://facebook.com/manishkarki97"
          }
        }
      },
      activeSettingsTab: "brand-info"
    };
  },
  computed: {
    ...mapState(["brandInfo"])
  }
};
</script>
