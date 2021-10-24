<template>
  <div
    v-if="showSecondaryHeader"
    class="relative top-0 items-center justify-between hidden w-full h-16 mt-4 transition-all duration-100 secondary-header lg:flex"
  >
    <ul v-if="headerCategories" class="flex items-center space-x-6">
      <li
        v-for="menuItem in headerCategories"
        :key="'menu-item-' + menuItem.name"
        class="px-2 py-2 rounded-lg hoverable"
      >
        <nuxt-link :to="`/categories/${menuItem.slug}`">{{
          menuItem.name
        }}</nuxt-link>
        <div class="w-full py-4 mega-menu ">
          <div
            class="px-6 py-2 bg-white shadow-2xl rounded-xl menu-content-wrapper"
          >
            <nuxt-link
              :to="'/categories/' + menuItem.slug + '/' + subCategory.slug"
              v-for="subCategory in menuItem.subCategories"
              :key="'sub-category-' + subCategory.name"
              class="block my-4 text-black transition-all duration-300 transform cursor-pointer hover:translate-x-2 hover:text-acccent"
            >
              {{ subCategory.name }}
            </nuxt-link>
          </div>
        </div>
      </li>
    </ul>

    <ul class="flex items-center space-x-6">
      <!-- <li class="font-semibold cursor-pointer hover:text-accent">
        <nuxt-link to="/flash-sales">
        Flash Sale
        </nuxt-link>
      </li> -->
      <li
        v-if="headerCategories"
        class="font-semibold cursor-pointer hover:text-accent"
      >
        <nuxt-link to="/latest-products">
          Latest Arrivals
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      menuItems: [
        {
          name: "Laptops",
          path: "/products/laptops",
          subCategories: [
            {
              name: "Gaming Laptops",
              path: "/products/Laptops/Gaming Laptops"
            },
            {
              name: "Traditional Laptops",
              path: "/products/Laptops/Traditional Laptops"
            },
            {
              name: "Ultrabooks",
              path: "/products/Laptops/Ultrabooks"
            }
          ]
        },
        {
          name: "Consoles",
          path: "/products/consoles",
          subCategories: [
            {
              name: "Playstation",
              path: "/products/Consoles/Playstation"
            },
            {
              name: "XBox",
              path: "/products/Consoles/XBox"
            },
            {
              name: "Nintendo",
              path: "/products/Consoles/Nintendo"
            },
            {
              name: "Steam Deck",
              path: "/products/Consoles/Steam Deck"
            }
          ]
        },
        {
          name: "Storage",
          path: "/products/storage",
          subCategories: [
            {
              name: "HDD",
              path: "/products/Storage/HDD"
            },
            {
              name: "SSD",
              path: "/products/Storage/SSD"
            },
            {
              name: "USB",
              path: "/products/Storage/USB"
            }
          ]
        },
        {
          name: "Accessories",
          path: "/products/accessories",
          subCategories: [
            {
              name: "Headphones",
              path: "/products/Accessories/Headphones"
            },
            {
              name: "Speakers",
              path: "/products/Accessories/Speakers"
            },
            {
              name: "Printers",
              path: "/products/Accessories/Printers"
            }
          ]
        },
        {
          name: "Cables",
          path: "/products/cables",
          subCategories: [
            {
              name: "Chargers",
              path: "/products/Cables/Chargers"
            },
            {
              name: "USB Cables",
              path: "/products/Cables/USB Cables"
            }
          ]
        }
      ],
      pagesToDisableNavbar: ["login", "signup"]
    };
  },
  computed: {
    ...mapState(["headerCategories"]),
    showSecondaryHeader() {
      return !this.pagesToDisableNavbar.some(x =>
        this.$route.path.startsWith(`/${x}`)
      );
    }
  },
  mounted() {
    let lastScrollTop = 0;
    const secondaryHeader = document.querySelector(".secondary-header");

    document.addEventListener("scroll", () => {
      if (!secondaryHeader) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        secondaryHeader.classList.add("secondary-header-fade");
        // secondaryHeader.style.top = "-140px";
      } else {
        secondaryHeader.classList.remove("secondary-header-fade");
        // secondaryHeader.style.top = "0";
      }
      lastScrollTop = scrollTop;
    });
  }
};
</script>

<style lang="scss" scoped>
.mega-menu {
  opacity: 0;
  visibility: hidden;
  /* display: none; */
  position: absolute;
  min-width: 300px;
  left: 0;
  text-align: left;
  z-index: 1000;
}
.hoverable {
  position: relative;

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
</style>
