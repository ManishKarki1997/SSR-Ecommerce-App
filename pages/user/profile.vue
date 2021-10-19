<template>
  <div
    style="height:calc(100vh - 6rem)"
    class="flex justify-center w-full h-full bg-primary"
  >
    <div v-if="!user" class="relative w-full h-full mt-64">
      <Spinner dark title="Loading Profile Info" />
    </div>

    <div v-if="user" class="mt-32 text-center lg:w-7/12 sm:w-11/12">
      <div class="w-48 h-48 mx-auto">
        <img
          class="object-cover w-full h-full rounded-full"
          :src="user.avatar"
          alt=""
        />
      </div>

      <div class="mt-4">
        <h4 class="text-xl ">{{ user.name }}</h4>
        <p class="text-sm italic text-secondary">{{ user.email }}</p>
      </div>

      <div class="flex items-center justify-center w-full mt-8 space-x-4 ">
        <button
          @click="onClickShowUpdateBasicInfoModal"
          class="px-4 py-2 rounded-md bg-secondary hover:bg-tertiary"
        >
          Update Profile
        </button>

        <button
          @click="onClickShowUpdatePasswordsInfoModal"
          class="px-4 py-2 rounded-md bg-secondary hover:bg-tertiary"
        >
          Change Password
        </button>
      </div>
    </div>

    <Modal
      @clickOutside="resetUserInfo"
      :isVisible="isUpdateBasicInfoModalVisible"
    >
      <div
        class="w-10/12 px-4 py-4 rounded-lg pointer-events-auto lg:w-6/12 md:8/12 bg-primary"
      >
        <ValidationObserver
          ref="basicInfoObserver"
          tag="form"
          @submit.prevent="handleUpdateUserProfile"
          class="mt-8 space-y-6"
        >
          <div class="-space-y-px rounded-md shadow-sm">
            <div class="w-24 h-24 mx-auto">
              <img
                class="object-cover w-full h-full rounded-full"
                :src="userCopy.avatar"
                alt=""
              />
            </div>

            <FormInput
              class=""
              input-name="Name"
              type="text"
              icon-left="text"
              :clearable="true"
              validationRules="required"
              v-model="userCopy.name"
            />
            <FormInput
              class=""
              input-name="Profile Image"
              type="text"
              icon-left="text"
              :clearable="true"
              validationRules="required"
              v-model="userCopy.avatar"
            />
          </div>

          <div>
            <BaseButton
              type="primary"
              block
              :disabled="isUpdatingBasicProfileInfo"
              htmlType="submit"
            >
              Update Profile
            </BaseButton>
          </div>
        </ValidationObserver>
      </div>
    </Modal>

    <Modal
      @clickOutside="resetPasswordsInfo"
      :isVisible="isUpdatePasswordModalVisible"
    >
      <div
        class="w-10/12 px-4 py-4 rounded-lg pointer-events-auto lg:w-6/12 md:8/12 bg-primary"
      >
        <ValidationObserver
          ref="passwordInfoObserver"
          tag="form"
          @submit.prevent="handleUpdateUserProfile"
          class="mt-8 space-y-6"
        >
          <div class="-space-y-px rounded-md shadow-sm">
            <FormInput
              class=""
              input-name="Current Password"
              type="password"
              icon-left="password-lock"
              :clearable="true"
              validationRules="required"
              v-model="userCopy.currentPlainTxtPassword"
            />
            <FormInput
              class=""
              input-name="Password"
              type="password"
              icon-left="password-lock"
              :clearable="true"
              validationRules="required|customMin:8|customMax:32"
              v-model="userCopy.newPlainTxtPassword"
            />
            <FormInput
              class=""
              input-name="Confirm Password"
              type="password"
              icon-left="password-lock"
              :clearable="true"
              validation-rules="required|customMin:8|customMax:32|confirmPassword:@Password"
              v-model="userCopy.newPlainTxtConfirmPassword"
            />
          </div>

          <div>
            <BaseButton
              type="primary"
              block
              :disabled="isUpdatingBasicProfileInfo"
              htmlType="submit"
            >
              Update Profile
            </BaseButton>
          </div>
        </ValidationObserver>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";
import Modal from "@/components/Common/Modal";

import FormInput from "@/components/UI/FormInput.vue";
import BaseButton from "@/components/UI/Button.vue";
import Spinner from "@/components/Common/Spinner.vue";

export default {
  components: {
    Modal,
    ValidationObserver,
    FormInput,
    BaseButton,
    Spinner
  },
  data() {
    return {
      isUpdateBasicInfoModalVisible: false,
      isUpdatePasswordModalVisible: false,
      isUpdatingBasicProfileInfo: false,
      isUpdatingPasswordsInfo: false,
      userCopy: {
        name: "",
        email: "",
        avatar: "",
        password: "",
        currentPlainTxtPassword: "",
        newPlainTxtPassword: "",
        newPlainTxtConfirmPassword: "",
        isUpdatingPasswordField: false
      }
    };
  },
  computed: {
    ...mapState("auth", ["user"])
  },
  watch: {
    user: {
      handler(newUser) {
        if (newUser) {
          this.setUserCopyObj();
        }
      }
    }
  },
  methods: {
    setUserCopyObj() {
      this.userCopy = {
        ...this.userCopy,
        name: this.user.name,
        email: this.user.email,
        avatar: this.user.avatar,
        password: this.user.password,
        isUpdatingPasswordField: false,
        currentPlainTxtPassword: "",
        newPlainTxtPassword: "",
        newPlainTxtConfirmPassword: ""
      };
    },
    onClickShowUpdateBasicInfoModal() {
      this.isUpdateBasicInfoModalVisible = true;
    },
    onClickShowUpdatePasswordsInfoModal() {
      this.isUpdatePasswordModalVisible = true;
      this.userCopy.isUpdatingPasswordField = true;
    },
    resetUserInfo() {
      this.isUpdateBasicInfoModalVisible = false;
      this.isUpdatePasswordModalVisible = false;
      this.setUserCopyObj();
    },
    resetPasswordsInfo() {
      this.isUpdatePasswordModalVisible = false;
      this.setUserCopyObj();
    },
    async handleUpdateUserProfile() {
      this.isUpdatingBasicProfileInfo = true;
      this.isUpdatingPasswordsInfo = true;
      try {
        let valid = false;
        if (this.userCopy.isUpdatingPasswordField) {
          valid = await this.$refs.passwordInfoObserver.validate();
        } else {
          valid = await this.$refs.basicInfoObserver.validate();
        }

        if (!valid) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please fill in the required fields",
            type: "danger"
          });

          this.isUpdatingBasicProfileInfo = false;
          this.isUpdatingPasswordsInfo = false;

          return;
        }

        const res = await this.$store.dispatch(
          "auth/updateProfile",
          this.userCopy
        );

        console.log(res.data);

        this.$store.commit("auth/UPDATE_USER", res.data.payload.user);

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: "Profile updated successfully",
          type: "success"
        });

        this.resetUserInfo();
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error?.response?.data?.message,
            type: "danger"
          });
        }
      } finally {
        this.isUpdatingBasicProfileInfo = false;
        this.isUpdatingPasswordsInfo = false;
      }
    }
  }
};
</script>
