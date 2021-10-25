<template>
  <div class="">
    <BlockHeaderUI>
      <template #left>
        Flash Sales
      </template>

      <template #right>
        <button
          @click="$router.push('/flash-sales')"
          class="flex items-center text-secondary "
        >
          <span>More Items On Sale</span>
          <Icon name="arrow-right" />
        </button>
      </template>
    </BlockHeaderUI>

    <div
      v-if="isLoadingProducts && !flashSaleProducts"
      class="relative w-full h-32"
    >
      <Spinner dark title="Fetching products on sale" />
    </div>

    <div
      v-if="!isLoadingProducts && flashSaleProducts"
      class="flex flex-col w-full md:flex-row md:space-x-8"
    >
      <!-- main product -->
      <div
        data-aos="fade-up"
        data-aos-offset="100"
        :data-aos-delay="0"
        data-aos-duration="400"
        data-aos-easing="ease-in-out"
        class="flex w-full px-4 py-4 space-x-6 transition-colors duration-300 border border-transparent rounded-lg hover:border hover:border-blue-700 main-product md:w-8/12"
      >
        <div
          v-if="flashSaleProducts[0].product.images.length > 0"
          class="w-full md:w-5/12"
        >
          <div class="overflow-hidden rounded">
            <img
              class="object-cover w-full h-full "
              :src="flashSaleProducts[0].product.images[0].imageUrl"
              alt=""
            />
          </div>

          <div class="flex items-center w-full space-x-2 "></div>
        </div>

        <div class="w-full px-2 md:w-7/12">
          <nuxt-link
            :to="`/products/${flashSaleProducts[0].product.slug}`"
            class="text-lg font-bold text-primary"
          >
            {{ flashSaleProducts[0].product.name }}
          </nuxt-link>

          <div class="flex items-center my-4 space-x-4">
            <div
              class="flex items-center justify-center w-16 px-2 py-1 text-white rounded bg-btnDanger"
            >
              <p class="text-sm ">
                {{
                  productDiscountAndPrice(flashSaleProducts[0].product).discount
                }}
                Off
              </p>
            </div>

            <div class="flex items-center space-x-2">
              <p class="font-bold">
                ${{
                  productDiscountAndPrice(flashSaleProducts[0].product)
                    .discountedPrice
                }}
              </p>
              <p class="text-sm line-through text-secondary">
                {{
                  productDiscountAndPrice(flashSaleProducts[0].product)
                    .discountUnit
                }}{{
                  productDiscountAndPrice(flashSaleProducts[0].product)
                    .originalPrice
                }}
              </p>
            </div>
          </div>

          <p class="w-9/12 mt-2 font-medium text-md text-secondary">
            {{ flashSaleProducts[0].product.description }}
          </p>

          <div class="flex items-center mt-6 space-x-2 text-secondary">
            <p>Offer ends in</p>
            <p
              v-if="testIfDateAfter(null, flashSaleProducts[0].validFrom)"
              class=" text-accent"
            >
              <SaleCountdownTimer :sale="flashSaleProducts[0]" />
            </p>
          </div>

          <div class="flex items-center mt-4 space-x-4">
            <template>
              <button
                v-if="!isProductPresentInWishlist(flashSaleProducts[0].product)"
                @click="onClickWishlistProduct(flashSaleProducts[0].product)"
              >
                <Icon class="hover:text-red-500" name="heart" />
              </button>
              <button
                v-if="isProductPresentInWishlist(flashSaleProducts[0].product)"
                @click="onClickWishlistProduct(flashSaleProducts[0].product)"
              >
                <Icon name="heart-fill" />
              </button>
            </template>

            <template>
              <button
                v-if="!isProductPresentInCart(flashSaleProducts[0].product)"
                @click="onClickAddProductToCart(flashSaleProducts[0].product)"
              >
                <Icon class="hover:text-blue-500" name="cart-outline" />
              </button>
              <button
                v-if="isProductPresentInCart(flashSaleProducts[0].product)"
                @click="onClickAddProductToCart(flashSaleProducts[0].product)"
              >
                <Icon name="cart-fill" />
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- other products -->
      <div
        class="flex flex-col w-full px-4 py-4 space-y-8 transition-colors duration-300 border border-transparent rounded hover:border hover:border-blue-700 md:w-4/12"
      >
        <div
          data-aos="fade-up"
          data-aos-offset="100"
          :data-aos-delay="idx * 50"
          data-aos-duration="400"
          data-aos-easing="ease-in-out"
          v-for="(sale, idx) in flashSaleProducts.slice(1, 4)"
          :key="'mini-sale' + sale.product.uid"
          class="flex space-x-2"
        >
          <div class="w-32 h-32 overflow-hidden rounded">
            <img
              class="object-cover w-full h-full "
              :src="sale.product.images[0].imageUrl"
              alt=""
            />
          </div>

          <div>
            <nuxt-link :to="`/products/${sale.product.slug}`" class="text-sm">
              {{ sale.product.name }}
            </nuxt-link>

            <div class="flex items-center mt-2 space-x-4">
              <div
                class="flex items-center justify-center w-12 px-1 py-1 text-white rounded bg-btnDanger"
              >
                <p class="text-sm ">
                  -{{ productDiscountAndPrice(sale.product).discount }}
                </p>
              </div>

              <div class="flex items-center space-x-2">
                <p class="font-bold">
                  {{ productDiscountAndPrice(sale.product).discountedPrice }}
                  {{ productDiscountAndPrice(sale.product).discountUnit }}
                </p>
                <p class="text-sm line-through text-secondary">
                  {{ productDiscountAndPrice(sale.product).originalPrice }}
                  {{ productDiscountAndPrice(sale.product).discountUnit }}
                </p>
              </div>
            </div>

            <div class="mt-2">
              <p
                v-if="testIfDateAfter(null, flashSaleProducts[0].validFrom)"
                class="text-sm text-accent"
              >
                <SaleCountdownTimer :sale="sale" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import queryString from "query-string";

import Icon from "@/components/UI/Icon.vue";
import BaseButton from "@/components/UI/Button.vue";
import Spinner from "@/components/Common/Spinner.vue";
import SaleCountdownTimer from "@/components/UI/SaleCountdownTimer.vue";
import BlockHeaderUI from "@/components/Common/BlockHeaderUI.vue";

import { calculateProductPriceAndDiscount } from "~/utils";
import { calculateCountdown, checkIfDateAfter } from "@/utils/dateFns";
import { wishlistMixin } from "@/mixins/wishlist";
import { cartMixin } from "@/mixins/cart";

export default {
  components: {
    Icon,
    BaseButton,
    Spinner,
    SaleCountdownTimer,
    BlockHeaderUI
  },
  mixins: [wishlistMixin, cartMixin],
  data() {
    return {
      isLoadingProducts: false,
      error: false,
      flashSaleProducts: null
    };
  },
  computed: {
    ...mapState("auth", ["wishlist", "user", "cart"])
  },
  async fetch() {
    try {
      this.isLoadingProducts = true;
      const queryParams = queryString.stringify({
        take: 4
      });
      const res = await this.$axios.$get(`products/flashSale?${queryParams}`);
      this.flashSaleProducts = res.payload.products;
    } catch (error) {
      if (error) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description: "Couldn't fetch flash sale products",
          type: "danger"
        });
        this.error = true;
      }
    } finally {
      this.isLoadingProducts = false;
    }
  },
  methods: {
    testIfDateAfter(date = new Date(), dateToCompare, payload) {
      return checkIfDateAfter(date || new Date(), dateToCompare);
    },
    productDiscountAndPrice(product) {
      return calculateProductPriceAndDiscount(product);
    },
    calculateSaleCountdown(sale) {
      return calculateCountdown(sale.validFrom, sale.validUntil);
    },
    onClickWishlistProduct(product) {
      this.handleAddRemoveProductToWishlist(product);
    },
    onClickAddProductToCart(product) {
      this.handleAddRemoveProductToCart(product);
    },
    isProductPresentInWishlist(product) {
      return (
        this.wishlist &&
        product &&
        this.wishlist.find(x => x.product.uid === product.uid)
      );
    },
    isProductPresentInCart(product) {
      return (
        this.cart &&
        product &&
        this.cart.find(x => x.product.uid === product.uid)
      );
    }
  }
};
</script>
