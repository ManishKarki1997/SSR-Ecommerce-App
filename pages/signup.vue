<template>
  <div
    style="height:calc(100vh - 10rem)"
    class="flex items-center justify-center bg-transparent sm:px-6 lg:px-8"
  >
    <div
      class="w-full max-w-xl px-6 py-8 mt-32 space-y-8 rounded-lg bg-secondary"
    >
      <div>
        <div class="flex justify-center w-full text-indigo-600">
          <Icon
            name="bolt"
            style="width:48px;height:48px;fill:#4F46E5 !important;"
          />
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-center text-primary">
          Signup for an account
        </h2>
        <p class="mt-2 text-sm text-center text-secondary">
          Or
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log into your account
          </router-link>
        </p>
      </div>
      <ValidationObserver
        ref="signupObserver"
        tag="form"
        @submit.prevent="handleSignup"
        class="mt-8 space-y-6"
      >
        <div class="-space-y-px rounded-md shadow-sm">
          <FormInput
            class="mb-4"
            input-name="Name"
            placeholder="Name"
            icon-left="user"
            :clearable="true"
            validationRules="required"
            v-model.trim="user.name"
          />

          <FormInput
            class="mb-4"
            type="email"
            input-name="Email"
            placeholder="Email"
            icon-left="email"
            :clearable="true"
            validationRules="required"
            v-model.trim="user.email"
          />

          <div class="flex items-center justify-between space-x-8 ">
            <div class="w-full mt-4">
              <FormInput
                input-name="Password"
                vid="Password"
                type="password"
                placeholder="Password"
                icon-left="password-lock"
                :clearable="true"
                validationRules="required|customMin:8|customMax:32"
                v-model.trim="user.password"
              />
            </div>
            <div class="w-full mt-4">
              <FormInput
                input-name="Confirm Password"
                type="password"
                placeholder="Confirm Password"
                icon-left="password-lock"
                :clearable="true"
                validation-rules="required|customMin:8|customMax:32|confirmPassword:@Password"
                v-model.trim="user.confirmPassword"
              />
            </div>
          </div>
        </div>

        <div>
          <BaseButton
            type="primary"
            block
            :disabled="isSigningUp"
            @click="handleSignup"
          >
            Sign Up
          </BaseButton>
        </div>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon";
import FormInput from "@/components/UI/FormInput.vue";
import BaseButton from "@/components/UI/Button.vue";

import { ValidationObserver } from "vee-validate";
import { transformAPIErrors } from "~/utils";

export default {
  components: {
    Icon,
    FormInput,
    ValidationObserver,
    BaseButton
  },
  data() {
    return {
      isSigningUp: false,
      user: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    };
  },
  methods: {
    async handleSignup() {
      this.isSigningUp = true;

      try {
        const valid = await this.$refs.signupObserver.validate();
        if (!valid) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please fill in the required fields",
            type: "danger"
          });
          this.isSigningUp = false;
          return;
        }

        const res = await this.$store.dispatch("auth/registerUser", this.user);
        this.$store.dispatch("addNotification", {
          title: "Success",
          type: "success",
          description: res.data.message
        });

        this.$router.push("/login");
      } catch (error) {
        if (error.response) {
          const errors = transformAPIErrors(error);
          this.$refs.signupObserver.setErrors(errors);

          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
        }
      } finally {
        this.isSigningUp = false;
      }
    }
  }
};
</script>
