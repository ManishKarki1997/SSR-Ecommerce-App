<template>
  <div v-if="brandInfoCopy">
    <ValidationObserver
      ref="contactInfoObserver"
      tag="form"
      @submit.prevent="updateContactInfo"
      class="mt-8 space-y-6"
    >
      <!-- Phone Numbers -->
      <div class="w-full px-4 py-4 mb-16 bg-secondary rounded-xl">
        <div class="mb-6 ">
          <label class="font-semibold " for="phoneNumbers"
            >Phone Number(s)</label
          >
        </div>
        <div class="grid grid-cols-2 gap-8">
          <div
            v-for="number in brandInfoCopy.contactNumber"
            :key="'contact-number-' + number.id"
            class="flex space-x-2"
          >
            <FormInput
              class=""
              input-name="Phone Number"
              :showLabel="false"
              type="number"
              icon-left="bolt"
              :clearable="false"
              v-model="number.number"
            />

            <div class="flex items-center space-x-1">
              <button
                type="button"
                @click="handleUpdateNumber(number)"
                class="flex justify-center w-8 h-8 -mt-3"
              >
                <Icon class="w-4 h-4 " name="edit" />
              </button>
              <button
                type="button"
                @click="handleDeleteNumber(number)"
                class="flex justify-center w-8 h-8 -mt-3"
              >
                <Icon class="w-4 h-4 " name="trash" />
              </button>
            </div>
          </div>

          <div class="flex items-center -mt-2 space-x-2">
            <FormInput
              class=""
              input-name="New Number"
              :showLabel="false"
              type="number"
              icon-left="bolt"
              :clearable="false"
              v-model="newNumber"
            />

            <button
              type="button"
              @click="handleAddNewNumber"
              class="flex justify-center w-16 h-10 "
            >
              <Icon class="w-6 h-6 " name="plus" />
            </button>
          </div>
        </div>
      </div>

      <!-- Social Medias -->
      <div class="w-full px-4 py-4 bg-secondary rounded-xl">
        <div class="mb-6 ">
          <label class="font-semibold cursor-pointer" for="phoneNumbers"
            >Social Media(s)</label
          >
        </div>
        <div class="w-full">
          <table
            class="relative w-full whitespace-no-wrap table-auto table-striped "
          >
            <thead>
              <tr class="w-full ">
                <th class="px-2 py-6">
                  Media Name
                </th>
                <th class="px-2 py-6">
                  Profile Url Link
                </th>
                <th class="px-2 py-6">Action</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(social, idx) in brandInfoCopy.socialMedias">
                <tr
                  v-if="social.name !== undefined"
                  :key="'social-media-#' + idx"
                  class=""
                >
                  <td class="px-2 py-6">
                    <FormSelect
                      class="-mt-4"
                      :list-items="socialMediaLists"
                      :initial-value="mapSocialMediaItem(social)"
                    />
                  </td>
                  <td class="px-2 py-6">
                    <FormInput
                      :show-label="false"
                      v-model="social.profileUrl"
                      :input-name="social.name"
                    />
                  </td>
                  <td class="px-2 py-6">
                    <div class="flex items-center space-x-1">
                      <button
                        type="button"
                        @click="handleUpdateSocialMedia(social)"
                        class="flex justify-center w-8 h-8 "
                      >
                        <Icon class="w-4 h-4 " name="edit" />
                      </button>
                      <button
                        @click="handleDeleteSocialMediaFromList(social)"
                        class="flex justify-center w-8 h-8 "
                      >
                        <Icon class="w-4 h-4 " name="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>

              <!-- new media list row -->
              <tr>
                <td class="px-2 py-6 ">
                  <FormSelect
                    class=""
                    @selected="onNewSocialMediaItemSelected"
                    :list-items="socialMediaLists"
                  />
                </td>
                <td>
                  <FormInput
                    class="mt-5"
                    :show-label="false"
                    v-model="newSocialMediaInfo.profileUrl"
                    input-name="New Media Profile Url"
                  />
                </td>
                <td class="px-2 py-6">
                  <button
                    type="button"
                    @click="onConfirmAddNewMedia"
                    class="flex justify-center w-16 h-10 mt-2"
                  >
                    <Icon class="w-6 h-6 " name="plus" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Social Medias -->
      <div class="w-full px-4 py-4 bg-secondary rounded-xl">
        <div class="mb-6 ">
          <label class="font-semibold " for="phoneNumbers"
            >Location Information</label
          >
        </div>
        <div class="w-full ">
          <div class="flex items-center space-x-2">
            <FormInput v-model="locationInfo.street" input-name="Street" />
            <FormInput v-model="locationInfo.city" input-name="City" />
          </div>

          <div class="flex items-center mt-5 space-x-2">
            <FormInput v-model="locationInfo.district" input-name="District" />
            <FormInput v-model="locationInfo.zone" input-name="Zone" />
          </div>

          <div class="flex items-center mt-5 space-x-2">
            <FormInput v-model="locationInfo.state" input-name="State" />
            <FormInput v-model="locationInfo.country" input-name="Country" />
          </div>

          <div class="mt-5">
            <BaseButton
              @click="handleUpdateLocation"
              type="primary"
              htmlType="button"
              icon-left="edit"
            >
              Update Location
            </BaseButton>
          </div>
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
import FormSelect from "@/components/UI/Select.vue";

import { transformAPIErrors } from "@/utils";

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
    FormSelect,
    FormInput,
    BaseButton
  },
  data() {
    return {
      locationInfo: {
        street: "",
        city: "",
        country: "",
        district: "",
        zone: "",
        state: ""
      },
      expandedState: {
        phoneNumbersExpanded: true,
        socialMediasExpanded: true,
        locationInformationExpanded: true
      },
      brandInfoCopy: null,
      newSocialMediaInfo: {
        name: "",
        profileUrl: "",
        socialMediaIconUrl: ""
      },
      newNumber: "",
      socialMediaLists: [
        {
          name: "Facebook",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/1024px-Facebook_icon_2013.svg.png"
        },
        {
          name: "Twitter",
          imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNckwjz7SYrIckc3aLTmGJuzAEhpHp50Ts52V35k123IfhfvAtZ2yttPteB_bLKDh35Hs&usqp=CAU"
        },
        {
          name: "Instagram",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/900px-Instagram_icon.png"
        }
      ]
    };
  },
  watch: {
    brandInfo: {
      immediate: true,
      handler(newVal) {
        if (newVal && !this.brandInfoCopy) {
          this.brandInfoCopy = JSON.parse(JSON.stringify(newVal));
          this.locationInfo = newVal.location
            ? JSON.parse(JSON.stringify(newVal.location))
            : this.locationInfo;
        }
      }
    }
  },

  methods: {
    mapSocialMediaItem(media) {
      return {
        ...media,
        imageUrl: media?.socialMediaIconUrl
      };
    },

    onNewSocialMediaItemSelected(media) {
      this.newSocialMediaInfo.name = media.name;
      this.newSocialMediaInfo.socialMediaIconUrl = media.imageUrl;
    },
    async onConfirmAddNewMedia() {
      if (!this.newSocialMediaInfo.profileUrl.trim()) {
        const errors = {
          "New Media Profile Url": [
            "Please enter a valid URL to your shop's profile page"
          ]
        };
        this.$refs.contactInfoObserver.setErrors(errors);
        return;
      }

      if (
        this.brandInfoCopy.socialMedias.find(
          m => m.name === this.newSocialMediaInfo.name
        )
      ) {
        return this.$store.dispatch("addNotification", {
          title: "Error",
          description: `The social media '${this.newSocialMediaInfo.name}' is already on the list`,
          type: "danger"
        });
      }

      this.brandInfoCopy = {
        ...this.brandInfoCopy,
        socialMedias: [
          ...this.brandInfoCopy.socialMedias,
          {
            ...this.newSocialMediaInfo
          }
        ]
      };

      const payload = {
        actionType: "ADD",
        schemaName: "SOCIAL_MEDIA",
        payload: {
          name: this.newSocialMediaInfo.name,
          socialMediaIconUrl: this.newSocialMediaInfo.socialMediaIconUrl,
          profileUrl: this.newSocialMediaInfo.profileUrl
        }
      };

      await this.updateBrandDetails(payload);

      this.$nextTick(() => {
        this.newSocialMediaInfo = {
          name: "",
          profileUrl: "",
          socialMediaIconUrl: ""
        };
        this.$refs.contactInfoObserver.reset();
      });
    },
    async handleUpdateNumber(number) {
      const payload = {
        actionType: "UPDATE",
        schemaName: "NUMBER",
        payload: {
          ...number
        }
      };

      const res = await this.updateBrandDetails(payload);
    },
    async handleUpdateLocation() {
      const payload = {
        actionType: "UPDATE",
        schemaName: "LOCATION",
        payload: {
          ...this.locationInfo
        }
      };

      await this.updateBrandDetails(payload);
    },
    async handleUpdateSocialMedia(social) {
      console.log(social);
      const payload = {
        actionType: "UPDATE",
        schemaName: "SOCIAL_MEDIA",
        payload: {
          ...social
        }
      };

      await this.updateBrandDetails(payload);
    },
    async handleDeleteSocialMediaFromList(media) {
      const payload = {
        schemaName: "SOCIAL_MEDIA",
        id: media.id
      };
      this.brandInfoCopy = {
        ...this.brandInfoCopy,
        socialMedias: this.brandInfoCopy.socialMedias.filter(
          m => m.name !== media.name
        )
      };
      this.deleteItems(payload);
    },
    async deleteItems(payload) {
      try {
        await this.$store.dispatch("deleteBrandDetails", payload);
        this.$store.dispatch("addNotification", {
          title: "Success",
          description: "Item deleted successfully",
          type: "success"
        });
      } catch (error) {
        if (error) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong",
            type: "danger"
          });
        }
      }
    },
    async handleAddNewNumber() {
      if (!this.newNumber.trim()) {
        const errors = {
          "New Number": ["Please enter a valid phone number"]
        };
        this.$refs.contactInfoObserver.setErrors(errors);
        return;
      }

      const payload = {
        actionType: "ADD",
        schemaName: "NUMBER",
        payload: {
          number: this.newNumber
        }
      };

      const res = await this.updateBrandDetails(payload);

      const id = res.data.payload.number.id;

      this.brandInfoCopy.contactNumber.push({
        id,
        number: this.newNumber
      });

      this.$nextTick(() => {
        this.newNumber = "";
        this.$refs.contactInfoObserver.reset();
      });
    },
    async handleDeleteNumber(number) {
      const payload = {
        schemaName: "NUMBER",
        id: number.id
      };
      await this.deleteItems(payload);
      this.brandInfoCopy.contactNumber = this.brandInfoCopy.contactNumber.filter(
        n => n.number !== number.number
      );
    },
    async updateBrandDetails(payload) {
      try {
        const res = await this.$store.dispatch("updateBrandDetails", payload);
        this.$store.dispatch("addNotification", {
          title: "Success",
          description:
            payload.actionType === "UPDATE"
              ? "Updated successfully"
              : "Added successfully",
          type: "success"
        });
        return res;
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong",
            type: "danger"
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
table {
  thead {
    tr th {
      font-weight: 400;
      font-size: 0.9rem;
    }
  }

  td,
  th {
    text-align: left;

    &:first-child,
    &:nth-child(2) {
      width: 40%;
    }

    &:nth-child(3) {
      width: 20%;
    }
  }
}
</style>
