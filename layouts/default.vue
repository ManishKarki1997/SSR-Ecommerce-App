<template>
  <div class="relative w-full min-h-screen bg-primary">
    <Header v-if="showNavbar" />

    <main
      style="min-height:80vh"
      :class="[showNavbar ? 'mt-32' : 'mt-8']"
      class="px-6 md:px-6 lg:px-24 bg-primary"
    >
      <Nuxt keep-alive />
    </main>

    <Footer />

    <Cart />
    <NotificationList />
  </div>
</template>

<script>
import { mapState } from "vuex";

import AOS from "aos";
import "aos/dist/aos.css";
import { extend, localize } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import { messages } from "vee-validate/dist/locale/en.json";

import { toggleTheme } from "~/utils";
import Header from "~/components/Common/Header.vue";
import Footer from "@/components/Common/Footer.vue";
import SecondaryHeader from "@/components/SecondaryHeader.vue";
import NotificationList from "@/components/Common/NotificationList.vue";
import Cart from "@/components/User/Cart.vue";

export default {
  components: {
    Header,
    NotificationList,
    Cart,
    SecondaryHeader,
    Footer
  },
  data() {
    return {
      pagesToDisableNavbar: ["admin"]
    };
  },
  computed: {
    ...mapState(["alreadyTriedLogin", "isLoggedIn"]),
    showNavbar() {
      return !this.pagesToDisableNavbar.some(x =>
        this.$route.path.startsWith(`/${x}`)
      );
    }
  },
  head() {
    return {
      meta: [
        {
          name: "description",
          content:
            "Electronic devices, gadgets and accessories shop. | Buy Acer, Dell, Asus, Razer, Apple laptops and ultrabooks at affordable prices"
        },
        {
          name: "keywords",
          content:
            "Acer, Apple, Razer, Asus, Dell, Logitech, MSI, Alienware, Ecommerce Nepal, Nepal"
        },
        { name: "robots", content: "INDEX,FOLLOW" },
        { property: "og:title", content: "VaryaCommerce" },
        {
          property: "og:description",
          content:
            "Electronic devices, gadgets and accessories shop. | Buy Acer, Dell, Asus, Razer, Apple laptops and ultrabooks at affordable prices"
        },
        { property: "twitter:title", content: "VaryaCommerce" },
        {
          property: "twitter:description",
          content:
            "Electronic devices, gadgets and accessories shop. | Buy Acer, Dell, Asus, Razer, Apple laptops and ultrabooks at affordable prices"
        }
      ]
    };
  },
  mounted() {
    this.fetchBrandInfo();
    this.fetchLoggedInUser();
    this.fetchHeaderCategories();

    AOS.init();
    let themeToSet = "";

    if (process.client) {
      const savedTheme =
        window && window.localStorage.getItem("varya-commerce-theme");

      themeToSet = savedTheme || "light";

      if (!savedTheme) {
        const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
        if (userMedia.matches) {
          themeToSet = "dark";
        }
      }

      this.$store.commit("SET_THEME_MODE", themeToSet);
      toggleTheme(themeToSet);
    }

    Object.keys(rules).forEach(rule => {
      extend(rule, {
        // eslint-disable-next-line spaced-comment
        /*eslint import/namespace: ['error', { allowComputed: true }] */
        ...rules[rule], // copies rule configuration
        message: messages[rule] // assign message
      });
    });

    extend(
      "confirmPassword",
      (value, [otherValue]) => {
        return value === otherValue;
      },
      {
        hasTarget: true
      }
    );
    extend("customMax", {
      getMessage: field => "The " + field + " value is not truthy.",
      validate: (value, args) => {
        return value.length <= parseInt(args[0]);
      }
    });
    extend("customMin", {
      getMessage: field => "The " + field + " value is not truthy.",
      validate: (value, args) => {
        return value.length >= parseInt(args[0]);
      }
    });

    const dict = {
      fields: {
        "Confirm Password": {
          confirmPassword: "Passwords do not match",
          customMax: "Password should be less than 32 characters long",
          customMin: "Password should be at least 8 characters long"
        },
        Password: {
          customMax: "Password should be less than 32 characters long",
          customMin: "Password should be at least 8 characters long"
        }
      }
    };
    localize("en", dict);

    // for now, check localstorage logged in
    // if (window.localStorage.getItem("varya-commerce-loggedin")) {
    //   this.fetchLoggedInUser();
    // }
  },
  methods: {
    async fetchLoggedInUser() {
      if (this.alreadyTriedLogin && !this.isLoggedIn) return;
      try {
        this.$store.commit("auth/SET_LOADING_USER", true);
        const res = await this.$store.dispatch("auth/fetchCurrentUser");

        if (res.data.payload.user !== undefined) {
          this.$store.commit("SET_IS_LOGGED_IN", true);
          this.$store.commit("auth/SET_USER", res.data.payload.user);
          this.$store.commit("auth/SET_CART", res.data.payload.user.cart);
          this.$store.commit(
            "auth/SET_WISHLIST",
            res.data.payload.user.wishlist
          );
          this.$store.commit("auth/SET_LOADING_USER", false);
        }
      } catch (error) {
        if (error.response.status === 400) {
          this.$store.commit("SET_IS_LOGGED_IN", false);
        }
      } finally {
        this.$store.commit("SET_ALREADY_TRIED_LOGIN", true);
      }
    },
    async fetchHeaderCategories() {
      await this.$store.dispatch("fetchHeaderCategories");
    },
    async fetchBrandInfo() {
      await this.$store.dispatch("fetchBrandInfo");
    }
  }
};
</script>
