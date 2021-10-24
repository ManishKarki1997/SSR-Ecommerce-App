<template>
  <div
    style="min-height:40vh"
    class="flex justify-center px-0 bg-transparent md:mt-0 md:items-center lg:px-8"
  >
    <div class="w-full max-w-lg px-8 py-8 space-y-8 rounded-lg bg-secondary">
      <div class="mt-4">
        <div class="flex justify-center w-full text-indigo-600">
          <Icon
            name="bolt"
            style="width:48px;height:48px;fill:#4F46E5 !important;"
          />
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-center text-primary">
          Login to your account
        </h2>
        <p class="mt-2 text-sm text-center text-secondary">
          Or
          <router-link
            to="/signup"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            signup for an account
          </router-link>
        </p>
      </div>
      <ValidationObserver
        ref="loginObserver"
        tag="form"
        @submit.prevent="handleLogin"
        class="mt-8 space-y-6"
      >
        <div class="-space-y-px rounded-md shadow-sm">
          <FormInput
            class=""
            input-name="Email"
            type="email"
            icon-left="email"
            :clearable="true"
            validationRules="required"
            v-model.trim="user.email"
          />

          <FormInput
            input-name="Password"
            type="password"
            icon-left="password-lock"
            :clearable="true"
            validationRules="required|customMin:8|customMax:32"
            v-model.trim="user.password"
          />
        </div>

        <div>
          <BaseButton
            type="primary"
            block
            :disabled="isLoggingIn"
            htmlType="submit"
          >
            Sign In
          </BaseButton>
        </div>

        <div class="flex items-center justify-center -mt-4">
          <div class="-mt-2 text-sm">
            <a
              href="#"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </a>
          </div>
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
import { transformAPIErrors } from "@/utils";

export default {
  components: {
    Icon,
    FormInput,
    BaseButton,
    ValidationObserver
  },
  data() {
    return {
      isLoggingIn: false,
      user: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    async handleLogin() {
      this.isLoggingIn = true;

      try {
        const valid = await this.$refs.loginObserver.validate();
        if (!valid) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please fill in the required fields",
            type: "danger"
          });
          this.isLoggingIn = false;
          return;
        }

        const res = await this.$store.dispatch("auth/loginUser", this.user);

        this.$store.commit("auth/SET_USER", res.data.payload.user);
        this.$store.commit("SET_IS_LOGGED_IN", true);

        this.$store.dispatch("addNotification", {
          title: "Success",
          type: "success",
          description: res.data.message
        });

        window && window.localStorage.setItem("varya-commerce-loggedin", true);
        this.$router.push("/");
      } catch (error) {
        if (error.response) {
          const errors = transformAPIErrors(error);
          this.$refs.loginObserver.setErrors(errors);

          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
        }
      } finally {
        this.isLoggingIn = false;
      }
    }
  }
};
</script>
