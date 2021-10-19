<template>
  <footer v-if="showFooter" class="w-full px-6 py-6 lg:px-12 bg-secondary">
    <div class="grid grid-cols-1 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
      <!-- brand info -->
      <div class="">
        <h4 class=" text-primary">
          <span class="text-4xl font-bold ">V</span>
          <span class="-ml-2 ">arya</span>
        </h4>
        <p class="w-9/12 mt-4 text-base text-secondary">
          Latest electronic products, accessories, gadgets and more.
        </p>
      </div>

      <!-- links -->
      <div class="">
        <p class="font-semibold text-primary">Links</p>
        <ul class="mt-2">
          <li class="mb-2 text-sm text-secondary hover:text-accent">
            <nuxt-link to="/">Home</nuxt-link>
          </li>
          <li class="mb-2 text-sm text-secondary hover:text-accent">
            <nuxt-link to="/">Latest Products</nuxt-link>
          </li>
          <li class="mb-2 text-sm text-secondary hover:text-accent">
            <nuxt-link :to="user ? '/user/profile' : '/login'"
              >My Account</nuxt-link
            >
          </li>
        </ul>
      </div>

      <!-- contact info -->
      <div class="">
        <p class="font-semibold text-primary">Contact Us</p>
        <ul class="mt-2">
          <li
            class="flex items-center mb-2 space-x-1 text-sm text-secondary hover:text-accent"
          >
            <span>
              <Icon class="w-4 h-4 " name="email" />
            </span>
            <p>varyacommerce@gmail.com</p>
          </li>

          <li
            class="flex items-center mb-2 space-x-1 text-sm text-secondary hover:text-accent"
          >
            <span>
              <Icon class="w-4 h-4 " name="phone-call" />
            </span>
            <p>+49 9423 2584</p>
          </li>

          <li
            class="flex items-center mb-2 space-x-1 text-sm text-secondary hover:text-accent"
          >
            <span>
              <Icon class="w-4 h-4 " name="location" />
            </span>
            <p>Kurfurstendam, Berlin</p>
          </li>
        </ul>
      </div>

      <!-- popular categories -->
      <div class="">
        <p class="font-semibold text-primary">Popular Categories</p>
        <ul class="mt-2">
          <li
            class="flex items-center mb-2 space-x-1 text-sm text-secondary hover:text-accent"
          >
            <nuxt-link to="/categories/laptops">Laptops</nuxt-link>
          </li>

          <li
            class="flex items-center mb-2 space-x-1 text-sm text-secondary hover:text-accent"
          >
            <nuxt-link to="/categories/consoles">Consoles</nuxt-link>
          </li>

          <li
            class="flex items-center mb-2 space-x-1 text-sm text-secondary hover:text-accent"
          >
            <nuxt-link to="/categories/accessories">Accessories</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/UI/Icon.vue";

export default {
  components: {
    Icon
  },
  data() {
    return {
      pagesToDisableFooter: ["login", "signup", "admin"]
    };
  },
  computed: {
    ...mapState("auth", ["user"]),
    showFooter() {
      return !this.pagesToDisableFooter.some(x =>
        this.$route.path.startsWith(`/${x}`)
      );
    }
  }
};
</script>
