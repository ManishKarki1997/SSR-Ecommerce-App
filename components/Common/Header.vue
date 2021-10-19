<template>
  <header class="fixed top-0 left-0 z-20 w-full px-6 py-6 lg:px-12 bg-primary">
    <div class="flex items-center justify-between">
      <div class="w-3/12 brand md:w-2/12">
        <nuxt-link to="/" class="text-primary">
          <span class="text-4xl font-bold ">V</span>
          <span class="-ml-2 ">arya</span>
        </nuxt-link>
      </div>

      <div class="hidden md:flex md:w-6/12 lg:w-7/12">
        <form class="w-full " @submit.prevent="handleSearchProducts">
          <FormInput
            class="mt-5"
            input-name="Search Products"
            :show-label="false"
            placeholder="Search for a product"
            type="text"
            icon-left="search"
            :clearable="true"
            v-model="searchText"
          />
        </form>
      </div>

      <client-only>
        <ul
          class="items-center justify-end hidden space-x-8 md:flex action-items md:w-6/12 lg:w-3/12"
        >
          <li v-if="!user">
            <BaseButton @click="$router.push('/login')" text>
              Login
            </BaseButton>
          </li>
          <li v-if="!user">
            <BaseButton @click="$router.push('/signup')" type="primary">
              Signup
            </BaseButton>
          </li>

          <li>
            <button
              aria-label="Theme Button"
              @click="handleToggleTheme"
              class="mt-2 text-primary"
            >
              <Icon v-if="themeMode === 'dark'" name="sun" />
              <Icon v-if="themeMode === 'light'" name="moon" />
            </button>
          </li>

          <li v-if="user">
            <button
              aria-label="Cart Button"
              @click="setCartSidebar"
              class="relative mt-2"
            >
              <span @click="setCartSidebar">
                <Icon class="cursor-pointer " name="basket" />
              </span>

              <div
                class="absolute flex items-center w-5 h-5 bg-blue-700 rounded-full -top-3 -right-2 justify-items-center"
              >
                <span class="w-full text-xs text-white ">
                  {{ cart ? cart.length : 0 }}
                </span>
              </div>
            </button>
          </li>

          <!-- wishlist -->

          <!-- <li>
        <button @click="$router.push('/user/wishlist')" class="relative mt-2">
          <Icon name="heart" />
          <div
            class="absolute flex items-center w-5 h-5 bg-red-600 rounded-full -top-3 -right-2 justify-items-center"
          >
            <span class="w-full text-xs text-white ">
              {{ wishlist ? wishlist.length : 0 }}
            </span>
          </div>
        </button>
      </li> -->

          <li v-if="user">
            <div class="relative w-10 h-10 rounded-full">
              <!-- @click="$router.push('/admin')" -->
              <img
                @click="handleClickUserAvatar"
                class="object-cover w-full h-full rounded-full cursor-pointer profile-image"
                :src="user.avatar"
                alt=""
              />

              <ContextMenu
                v-if="isProfileContextMenuActive"
                class="absolute z-50 w-56 top-12 right-2 bg-secondary"
                :compact="false"
                :menuItems="profileContextMenuItems"
                trigger=".profile-image"
                @selected="handleSelectProfileMenuItem"
                @clickedOutside="handleClickOutsideProfileMenu"
              >
              </ContextMenu>
            </div>
          </li>
        </ul>

        <!-- mobile menu -->
        <ul class="flex items-center space-x-4 md:hidden">
          <li class="-mt-2 ">
            <button
              aria-label="Theme Button"
              @click="handleToggleTheme"
              class="mt-2 text-primary"
            >
              <Icon v-if="themeMode === 'dark'" name="sun" />
              <Icon v-if="themeMode === 'light'" name="moon" />
            </button>
          </li>

          <li class="relative ">
            <button
              aria-label="Mobile Menu Toggle Button"
              @click="isMobileMenuActive = true"
              class="ml-auto"
            >
              <Icon name="menu" />
            </button>
          </li>
        </ul>

        <!-- mobile hamburger menu items-->
        <transition name="fade" mode="out-in">
          <div
            v-if="isMobileMenuActive && headerCategories"
            class="fixed top-0 left-0 z-50 w-full h-full px-6 py-6 bg-secondary"
          >
            <div class="flex items-center justify-between mb-16">
              <nuxt-link to="/" class="text-primary">
                <span class="text-4xl font-bold ">V</span>
                <span class="-ml-2 ">arya</span>
              </nuxt-link>

              <button
                aria-label="Close Mobile Menu Button"
                @click="isMobileMenuActive = false"
              >
                <Icon name="close" />
              </button>
            </div>

            <ul style=" height:80%" class="flex flex-col overflow-auto">
              <li
                class="mb-4 "
                v-for="category in headerCategories"
                :key="'mobile-menu-item-' + category.name + '-' + category.id"
              >
                <button
                  aria-label="Category Accordion Button"
                  @click="gotoCategory({ category }, true)"
                  class="flex items-center justify-between space-x-4"
                >
                  <span @click.stop="handleSelectMobileMenuItem(category)">
                    <Icon
                      name="arrow-up"
                      :class="[
                        activeMobileMenuItemUid === category.uid
                          ? 'rotate-180'
                          : 'rotate-90'
                      ]"
                      class="w-4 h-4 transition-all duration-300 transform"
                    />
                  </span>
                  <span class="text-base font-normal ">{{
                    category.name
                  }}</span>
                </button>

                <ul
                  v-if="activeMobileMenuItemUid === category.uid"
                  :class="[
                    activeMobileMenuItemUid === category.uid
                      ? 'max-h-64 overflow-auto'
                      : 'max-h-0 overflow-hidden'
                  ]"
                  class="mt-4 ml-6 transition-all duration-1000 sub-menu"
                >
                  <li
                    v-for="subCategory in category.subCategories"
                    :key="
                      'menu-subcategory-' +
                        subCategory.name +
                        '-' +
                        subCategory.id
                    "
                    class="mb-4 text-sm"
                  >
                    <button
                      aria-label="Sub Category Accordion Button"
                      @click="gotoCategory({ category, subCategory }, false)"
                      class="flex items-center space-x-2"
                    >
                      <div
                        class="w-2 h-2 border-2 border-blue-500 rounded-sm"
                      ></div>
                      <span class="text-sm">{{ subCategory.name }}</span>
                    </button>
                  </li>
                </ul>
              </li>

              <li class="relative flex items-center mt-auto space-x-4">
                <div
                  v-if="!user"
                  class="relative flex items-center mt-auto space-x-4"
                >
                  <BaseButton text>Login</BaseButton>
                  <BaseButton text type="primary" outlined>Register</BaseButton>
                </div>

                <div v-if="user" class="flex space-x-4 ">
                  <div class="w-10 h-10 rounded-full ">
                    <img
                      @click="handleClickUserAvatar"
                      class="object-cover w-full h-full rounded-full cursor-pointer profile-image"
                      :src="user.avatar"
                      alt=""
                    />
                  </div>
                  <div>
                    <p class=" text-primary">{{ user.name }}</p>
                    <p class="text-sm italic text-secondary">
                      {{ user.email }}
                    </p>
                  </div>
                </div>

                <ContextMenu
                  v-if="user && isProfileContextMenuActive"
                  class="absolute z-50 w-56 bottom-12 right-2 bg-tertiary"
                  :compact="false"
                  :menuItems="profileContextMenuItems"
                  trigger=".profile-image"
                  @selected="handleSelectProfileMenuItem"
                  @clickedOutside="handleClickOutsideProfileMenu"
                >
                </ContextMenu>
              </li>
            </ul>
          </div>
        </transition>
      </client-only>
    </div>

    <SecondaryHeader />
  </header>
</template>

<script>
import { mapState } from "vuex";

import { toggleTheme } from "@/utils";
import BaseButton from "@/components/UI/Button.vue";
import FormInput from "@/components/UI/FormInput.vue";
import Icon from "@/components/UI/Icon";
import ContextMenu from "@/components/Common/ContextMenu.vue";
import SecondaryHeader from "@/components/SecondaryHeader.vue";

export default {
  components: {
    BaseButton,
    Icon,
    ContextMenu,
    FormInput,
    SecondaryHeader
  },
  computed: {
    ...mapState(["themeMode", "headerCategories"]),
    ...mapState("auth", ["user", "cart", "wishlist"])
  },
  data() {
    return {
      isProfileContextMenuActive: false,
      activeMenuItem: null,
      isMobileMenuActive: false,
      searchText: "",
      profileContextMenuItems: [
        {
          iconName: "user",
          name: "Profile",
          type: "ROUTE",
          path: "/user/profile"
        },
        {
          iconName: "heart",
          name: "Wishlist",
          type: "ROUTE",
          path: "/user/wishlist"
        },
        {
          iconName: "basket",
          name: "Purchase History",
          type: "ROUTE",
          path: "/user/purchaseHistory"
        },
        {
          iconName: "log-out",
          type: "BUTTON",
          name: "Log Out",
          action: "LOGOUT"
        }
      ],
      activeMobileMenuItemUid: ""
    };
  },
  mounted() {},

  watch: {
    user: {
      handler(newVal) {
        if (
          (newVal && newVal?.role === "ADMIN") ||
          newVal?.role === "SUPER_ADMIN"
        ) {
          this.profileContextMenuItems.unshift({
            iconName: "category",
            name: "Dashboard",
            type: "ROUTE",
            path: "/admin"
          });

          this.profileContextMenuItems = this.profileContextMenuItems.filter(
            x => x.name !== "Profile"
          );
        }
      }
    }
  },

  methods: {
    gotoCategory({ category, subCategory }, isCategory) {
      this.isMobileMenuActive = false;
      this.activeMobileMenuItemUid = "";
      if (isCategory) {
        this.$router.push(`/categories/${category.slug}`);
      } else {
        this.$router.push(`/categories/${category.slug}/${subCategory.slug}`);
      }
    },
    handleClickUserAvatar() {
      this.isProfileContextMenuActive = !this.isProfileContextMenuActive;
    },
    handleSelectProfileMenuItem(item) {
      if (item.type === "ROUTE") {
        this.$router.push(item.path);
      } else {
        if (item.action === "LOGOUT") {
          this.$store.dispatch("auth/logoutUser");
        }
      }
    },
    handleLogout() {
      this.$store.dispatch("auth/logoutUser");
    },
    handleClickOutsideProfileMenu() {
      this.isProfileContextMenuActive = false;
    },
    handleToggleTheme() {
      const themeToSet = this.themeMode === "dark" ? "light" : "dark";
      this.$store.commit("SET_THEME_MODE", themeToSet);
      toggleTheme(this.themeMode);
    },
    setCartSidebar() {
      this.$store.commit("SET_IS_CART_SIDEBAR_SHOWING", true);
    },
    handleSearchProducts() {
      if (!this.searchText) return;
      this.$router.push(`/search?searchQuery=${this.searchText}`);
    },
    handleSelectMobileMenuItem(item) {
      this.activeMobileMenuItemUid =
        this.activeMobileMenuItemUid === item.uid ? "" : item.uid;
    }
  }
};
</script>

<style lang="scss">
header {
  z-index: 999 !important;

  .mega-menu {
    opacity: 0;
    visibility: hidden;
    /* display: none; */
    left: 0;
    position: absolute;
    text-align: left;
  }
  .hoverable {
    position: static;

    &:hover,
    .active-menu-item {
      .mega-menu {
        opacity: 1;
        visibility: visible;
        transition: all 0.3s ease-in-out;
        /* display: block; */
      }
    }

    &.mega-menu {
      display: block;
    }
  }
}
</style>
