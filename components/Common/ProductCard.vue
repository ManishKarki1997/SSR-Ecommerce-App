<template>
  <div
    data-aos="fade-up"
    data-aos-offset="100"
    :data-aos-delay="idx * 50"
    data-aos-duration="400"
    data-aos-easing="ease-in-out"
    class="relative w-full h-64 cursor-pointer product-card group"
    @click="handleSelectProduct"
  >
    <!-- wishlist / heart button -->
    <div
      v-if="showWishlistAndCartBtns"
      class="absolute top-0 right-0 z-20 px-2 py-2"
    >
      <div class="mb-2">
        <button
          @click.stop="onClickWishlistProduct"
          v-if="!isInWishlist"
          class="visible px-1 py-1 rounded-full md:invisible icon-wrapper outlined heart-icon group-hover:visible "
        >
          <Icon name="heart" class="w-6 h-6" />
        </button>

        <button
          class=" icon-wrapper heart-icon filled"
          @click.stop="onClickWishlistProduct"
          v-if="isInWishlist"
        >
          <Icon name="heart-fill" />
        </button>
      </div>

      <div>
        <button
          @click.stop="onClickAddProductToCart"
          v-if="!checkIfProductPresentInCart"
          class="visible px-1 py-1 rounded-full md:invisible group-hover:visible icon-wrapper cart-icon outlined"
        >
          <Icon name="cart-fill" class="w-6 h-6" />
        </button>

        <button
          @click.stop="onClickAddProductToCart"
          v-if="checkIfProductPresentInCart"
          class="visible md:invisible icon-wrapper group-hover:visible cart-icon filled"
        >
          <Icon class="" name="cart-fill" />
        </button>
      </div>
    </div>

    <div class="w-full h-full overflow-hidden rounded-lg">
      <img
        v-lazy-load
        v-if="product.images !== undefined && product.images.length > 0"
        class="object-cover w-full h-full"
        :data-src="product.images[0].imageUrl"
        :alt="'Image for ' + product.name"
      />
    </div>

    <!-- product discount -->
    <div
      v-if="productDiscountAndPrice.discount"
      style="top:-12px;left:-12px;"
      class="absolute top-0 left-0 z-30 flex items-center justify-center px-4 py-1 text-white rounded bg-btnDanger"
    >
      <p>-{{ productDiscountAndPrice.discount }}</p>
    </div>

    <div class="mt-2">
      <div class="flex items-center space-x-2">
        <!-- <p class="text-xs text-secondary">{{ product.categoryName }}</p>
        <p v-if="product.subCategoryName !== undefined">&bull;</p> -->
        <p
          @click.stop="handleClickSubCategory"
          v-if="product.subCategoryName !== undefined"
          class="text-xs text-secondary"
        >
          {{ product.subCategoryName }}
        </p>
      </div>

      <h4 class="my-1 font-bold text-md">{{ product.name }}</h4>

      <div class="flex items-center space-x-2 pricing">
        <h6 class="text-base font-medium text-accent">
          ${{ parseFloat(productDiscountAndPrice.discountedPrice).toFixed(2) }}
        </h6>
        <p
          v-if="productDiscountAndPrice.discount"
          class="text-red-300 line-through "
        >
          <span>
            {{
              parseFloat(productDiscountAndPrice.originalPrice).toFixed(2)
            }}</span
          >
        </p>
      </div>
    </div>

    <div
      class="absolute top-0 left-0 z-10 w-full h-full bg-black rounded-lg opacity-20"
    ></div>

    <div
      v-if="user && user.role !== 'USER'"
      class="absolute top-0 right-0 z-50 flex flex-col items-end justify-end more-option-icon-wrapper text-primaryBgText"
    >
      <span
        v-if="showContextMenuIcon"
        @click.stop="onTriggerContextMenu"
        class=" menu-icon group-hover:block"
        :class="[
          activeContextMenuItem && activeContextMenuItem.id === product.id
            ? 'context-menu-icon block'
            : 'hidden'
        ]"
      >
        <Icon class="w-8 h-8 cursor-pointer" name="horizontal-menu" />
      </span>
      <ContextMenu
        v-if="activeContextMenuItem && activeContextMenuItem.id === product.id"
        :menuItems="contextMenuItems"
        :activeContextMenuItem="activeContextMenuItem"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/UI/Icon.vue";
import ContextMenu from "@/components/Common/ContextMenu.vue";
import { calculateProductPriceAndDiscount } from "~/utils";
import { calculateCountdown } from "@/utils/dateFns";
import { wishlistMixin } from "@/mixins/wishlist";
import { cartMixin } from "@/mixins/cart";
import constants from "@/utils/constants";

export default {
  props: {
    idx: {
      type: Number,
      required: false
    },
    product: {
      type: Object,
      required: true
    },
    showWishlistAndCartBtns: {
      type: Boolean,
      default: true
    },
    defaultEventHandle: {
      type: Boolean,
      default: true
    },
    activeContextMenuItem: {
      type: [String, Number, Object],
      required: false
    }
  },
  components: {
    Icon,
    ContextMenu
  },

  mixins: [wishlistMixin, cartMixin],

  computed: {
    ...mapState("auth", ["wishlist", "user", "cart"]),

    appConstants() {
      return constants;
    },

    showContextMenuIcon() {
      return this.$route.path.startsWith(`/admin`);
    },
    isInWishlist() {
      return (
        this.wishlist &&
        this.wishlist.find(w => w.product.uid === this.product.uid)
      );
    },
    checkIfProductPresentInCart() {
      return (
        this.cart &&
        this.product &&
        this.cart.find(x => x.product.uid === this.product.uid)
      );
    },
    productDiscountAndPrice() {
      return calculateProductPriceAndDiscount(this.product);
    },

    productHasDiscountAlready() {
      return this.product && this.product.productDiscount.length > 0;
    }
  },
  data() {
    return {
      tempDate: Date.now(),
      contextMenuItems: [
        {
          name: "Quick Edit",
          iconName: "edit"
        },
        {
          name: "Edit",
          iconName: "edit"
        }
      ]
    };
  },
  mounted() {
    document.addEventListener("click", e => this.handleClickOutsideListener(e));
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutsideListener);
  },
  methods: {
    onClickAddProductToCart() {
      this.handleAddRemoveProductToCart(this.product);
    },
    onClickWishlistProduct() {
      this.handleAddRemoveProductToWishlist(this.product);
    },
    handleSelectProduct() {
      if (this.defaultEventHandle) {
        this.$router.push(`/products/${this.product.slug}`);
      } else {
        this.$emit("click", this.product);
      }
    },
    handleClickSubCategory() {
      if (this.defaultEventHandle) {
        this.$router.push(
          `/categories/${this.product.categorySlug}/${this.product.subCategorySlug}`
        );
      } else {
        this.$emit("clickSubCategory", this.product);
      }
    },
    handleClickOutsideListener(e) {
      const inside = e.target.closest(`.context-menu-icon`);
      if (e.target.classList.contains("icon") && inside) {
        this.svgClickedCount += 1;
      }

      if (!inside) {
        this.$emit("openContextMenu");
      }
    },
    onTriggerContextMenu() {
      this.$emit(
        "openContextMenu",
        this.activeContextMenuItem?.id === this.product.id ? null : this.product
      );
    }
  }
};
</script>

<style lang="scss">
.product-card .more-option-icon-wrapper {
  right: 8px;
  top: 8px;

  .menu-icon {
    svg {
      fill: white !important;
    }
  }
}
</style>
