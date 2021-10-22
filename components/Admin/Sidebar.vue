<template>
  <aside class="h-screen px-4 py-4 bg-secondary text-primary">
    <div class="flex items-center justify-between h-12 px-4">
      <router-link to="/admin" class=" text-primary">
        <Icon style="width:32px;height:32px;" name="bolt" />
      </router-link>

      <button @click="handleToggleTheme" class="text-primary">
        <Icon v-if="themeMode === 'dark'" name="sun" />
        <Icon v-if="themeMode === 'light'" name="moon" />
      </button>
    </div>

    <div class="h-full ">
      <ul class="py-24">
        <li
          @click="$router.push(menuItem.link)"
          :class="[
            activeMenuItemLink === menuItem.link
              ? 'bg-accent text-white'
              : 'hover:bg-accent hover:text-white'
          ]"
          class="flex items-center w-full px-4 py-4 mb-4 space-x-4 rounded-lg cursor-pointer "
          v-for="menuItem in menuItems"
          :key="'menu-item-' + menuItem.name"
        >
          <Icon
            class="fill-current sidebar-menu-icon"
            :name="menuItem.iconName"
          />
          <nuxt-link :to="menuItem.link">{{ menuItem.name }}</nuxt-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import { mapState } from "vuex";
import Icon from "@/components/UI/Icon";
import { toggleTheme } from "@/utils";

export default {
  components: {
    Icon
  },
  data() {
    return {
      activeMenuItemLink: "",
      menuItems: [
        {
          name: "Dashboard",
          iconName: "home-smile",
          link: "/admin/dashboard"
        },
        {
          name: "Categories",
          iconName: "category",
          link: "/admin/categories"
        },
        {
          name: "Products",
          iconName: "basket",
          link: "/admin/products"
        },
        {
          name: "Filters",
          iconName: "category",
          link: "/admin/filters"
        },
        {
          name: "Settings",
          iconName: "cog",
          link: "/admin/settings"
        }
      ]
    };
  },
  computed: {
    ...mapState(["themeMode"])
  },
  methods: {
    handleToggleTheme() {
      const themeToSet = this.themeMode === "dark" ? "light" : "dark";
      this.$store.commit("SET_THEME_MODE", themeToSet);

      toggleTheme(this.themeMode);
    }
  },
  watch: {
    $route: {
      handler(newVal) {
        const split = newVal.fullPath.split("/");
        this.activeMenuItemLink = `/${split[1]}${
          split[2] ? "/" + split[2] : "/dashboard"
        }`;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar-menu-icon {
  fill: currentColor;
  color: currentColor;
}
</style>
