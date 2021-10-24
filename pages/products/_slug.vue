<template>
  <div class="w-full min-h-screen py-16">
    <div
      v-if="isLoadingProduct"
      class="flex items-center justify-center w-full h-96"
    >
      <div>
        <Spinner title="Loading Product..." :dark="true" />
      </div>
    </div>

    <div v-if="!isLoadingProduct && product">
      <!-- product basic info (images and descriptions) -->
      <div class="flex flex-col md:flex-row">
        <!-- product images -->
        <div class="w-full md:w-5/12">
          <!-- selected image -->
          <div
            class="w-full mb-4 overflow-hidden rounded-lg cursor-pointer h-80 md:h-96"
          >
            <img
              v-lazy-load
              class="object-cover w-full h-full"
              :data-src="activeProductImage.imageUrl"
              alt=""
            />
          </div>

          <!-- thumbnails -->
          <div class="grid grid-cols-2 gap-4 md:grid-cols-2">
            <div
              @click="viewProductImage(img)"
              v-for="img in nonDefaultProductImages"
              :key="'non-default-image' + img.id"
              class="w-full h-48 overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                v-lazy-load
                class="object-cover w-full h-full "
                :data-src="img.imageUrl"
                alt=""
              />
            </div>
          </div>
        </div>

        <div class="w-full px-0 py-8 md:py-0 md:px-8 md:w-7/12">
          <div class="mb-6 ">
            <h4 class="text-3xl font-bold">
              {{ product.name }}
            </h4>

            <client-only>
              <div class="flex items-center mb-6 space-x-4">
                <h3 class="my-2 text-2xl text-accent">
                  <span>{{ constants.CURRENCY }}</span>
                  <span>{{ productPricingDetails.discountedPrice }}</span>
                </h3>

                <h3
                  v-if="productPricingDetails.discountAmt > 0"
                  class="my-2 ml-4 text-lg line-through text-secondary"
                >
                  <span>{{ constants.CURRENCY }}</span>
                  <span>{{ productPricingDetails.originalPrice }}</span>
                </h3>

                <p
                  v-if="productPricingDetails.discountAmt > 0"
                  class="px-2 py-1 text-sm text-white bg-red-500 rounded"
                >
                  -{{ productPricingDetails.discount }}
                </p>

                <div
                  v-if="productPricingDetails.discount > 0"
                  class="px-2 py-1 text-white bg-red-500 rounded"
                >
                  {{ productPricingDetails.discount }}% off
                </div>
              </div>
            </client-only>

            <p class="font-normal leading-7 text-secondary">
              {{ product.description }}
            </p>
          </div>

          <!-- product quantity button -->
          <div class="flex items-center space-x-4">
            <h4 class="text-lg text-primary">Quantity</h4>

            <div class="flex items-center border-gray-300 bg-primary ">
              <button @click="handleProductQty(false)" class="px-2 ">
                <Icon name="minus" />
              </button>
              <input
                aria-label="Product Quantity Count"
                v-model="productQtyCount"
                class="w-12 px-4 py-2 text-center bg-transparent outline-none product-qty-input"
                type="number"
                min="1"
              />
              <button @click="handleProductQty(true)" class="px-2 ">
                <Icon name="plus" />
              </button>
            </div>
          </div>

          <!-- sales countdown -->

          <div v-if="saleCountdown" class="flex items-center my-8 space-x-2">
            <h4>Sale ends in</h4>
            <p class="font-bold text-red-500">{{ saleCountdown }}</p>
          </div>

          <!-- add to cart / wishlist -->
          <div class="flex flex-row flex-wrap mt-6">
            <div class="mb-4 mr-0 sm:mr-4 sm:mb-4">
              <BaseButton
                @click="onClickAddItemToCart"
                :disabled="isAddingItemToCart"
                icon-left="basket"
                :type="isProductPresentInCart(product) ? 'danger' : 'primary'"
              >
                {{
                  isProductPresentInCart(product)
                    ? "Remove From Cart"
                    : "Add To Cart"
                }}
              </BaseButton>
            </div>

            <div class="">
              <BaseButton
                :disabled="isAddingItemToWishlist"
                @click="onClickAddItemToWishlist"
                icon-left="heart"
                :type="isProductPresentInWishlist ? 'danger' : null"
              >
                {{
                  isProductPresentInWishlist
                    ? "Remove From Wishlist"
                    : "Add To Wishlist"
                }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 ">
        <!-- products info tab buttons -->
        <div class="w-full lg:w-7/12">
          <div class="grid grid-cols-2 gap-2 lg:gap-6 md:grid-cols-4">
            <button
              @click="activeProductTab = productTab.key"
              :class="[
                activeProductTab === productTab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'text-primary'
              ]"
              class="relative w-full px-8 py-2 transition-all duration-200 border border-gray-400 rounded hover:border-blue-600 hover:text-blue-600"
              v-for="productTab in productTabs"
              :key="productTab.key"
            >
              {{ productTab.name }}

              <span v-if="product._count[productTab.dbName] !== undefined"
                >({{ product._count[productTab.dbName] }})</span
              >
            </button>
            <!-- <button
              @click="activeProductTab = productTab.key"
              :class="{
                'bg-btnPrimary text-white': activeProductTab === productTab.key
              }"
              class="relative w-full px-8 py-2 rounded-lg hover:bg-btnPrimary hover:text-white"
              v-for="productTab in productTabs"
              :key="productTab.key"
            >
              {{ productTab.name }}

              <span v-if="product._count[productTab.dbName] !== undefined"
                >({{ product._count[productTab.dbName] }})</span
              >
            </button> -->
          </div>
        </div>

        <!-- product tab contents -->
        <div
          v-if="!isLoadingProduct && product"
          class="py-8 tab-content-wrapper"
        >
          <transition name="fade" mode="out-in">
            <ProductDescriptionTab
              :displayMode="true"
              :product="product"
              v-if="activeProductTab === 'description'"
            />
            <ProductSpecificationTab
              :product="product"
              v-if="activeProductTab === 'specifications'"
            />
            <ProductReviewsTab
              :product="product"
              v-if="activeProductTab === 'reviews'"
            />
            <ProductQuestionsTab
              ref="productQuestions"
              :product="product"
              v-if="activeProductTab === 'questions'"
              @handleQnAAction="handleQnAAction"
              @handleAnswerUpdate="handleAnswerUpdate"
              @handleAskQuestion="handleAskQuestion"
              @handleAnswerQuestion="handleAnswerQuestion"
            />
          </transition>
        </div>
      </div>

      <div class="mt-16">
        <RelatedProducts />
      </div>
    </div>

    <!-- temp padding div for now -->
    <div class="w-full h-64"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/UI/Icon.vue";
import BaseButton from "@/components/UI/Button.vue";

import ProductDescriptionTab from "@/components/Product/ProductDescriptionTab.vue";
import ProductQuestionsTab from "@/components/Product/ProductQuestionsTab.vue";
import ProductReviewsTab from "@/components/Product/ProductReviewsTab.vue";
import RelatedProducts from "@/components/Product/RelatedProducts.vue";
import ProductSpecificationTab from "@/components/Product/ProductSpecificationTab.vue";
import Spinner from "@/components/Common/Spinner.vue";

import calculateProductPriceAndDiscount from "@/utils/calculateProductPriceAndDiscount";
import { cartMixin } from "@/mixins/cart.js";
import { wishlistMixin } from "@/mixins/wishlist.js";
import { calculateCountdown } from "@/utils/dateFns";
import constants from "@/utils/constants";

export default {
  components: {
    Icon,
    BaseButton,
    ProductDescriptionTab,
    ProductQuestionsTab,
    ProductReviewsTab,
    RelatedProducts,
    ProductSpecificationTab,
    Spinner
  },
  mixins: [cartMixin, wishlistMixin],
  head() {
    return {
      title: `${this.product ? this.product.name : this.slug} | Varya Commerce`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Buy ${
            this.product ? this.product.name : this.slug
          } on Varya Commerce`
        },
        {
          name: "twitter:image",
          content: `${this.product &&
            this.product?.images.length > 0 &&
            this.product.images[0].imageUrl}`
        },
        {
          name: "og:image",
          content: `${this.product &&
            this.product?.images.length > 0 &&
            this.product.images[0].imageUrl}`
        }
      ]
    };
  },
  data() {
    this.constants = constants;
    return {
      tempDate: Date.now(),
      countdownTimerInterval: null,
      slug: "",
      product: null,
      activeImageId: null,
      productQtyCount: 1,
      isLoadingProduct: false,
      isAddingItemToCart: false,
      isAddingItemToWishlist: false,
      productTabs: [
        {
          name: "Description",
          key: "description"
        },
        {
          name: "Specifications",
          key: "specifications"
        },
        {
          name: "Questions",
          key: "questions",
          dbName: "qna"
        },
        {
          name: "Reviews",
          key: "reviews",
          dbName: "reviews"
        }
      ],
      activeProductTab: "description"
    };
  },
  computed: {
    ...mapState("auth", ["user", "cart", "wishlist"]),

    saleCountdown() {
      if (
        !this.product ||
        (this.product && this.product.productDiscount.length === 0) ||
        !this.product.productDiscount[0].validUntil
      )
        return null;

      const discountCountdown = calculateCountdown(
        this.tempDate,
        this.product.productDiscount[0].validUntil
      );

      return discountCountdown;
    },

    isProductPresentInWishlist() {
      return (
        this.wishlist &&
        this.product &&
        this.wishlist.find(x => x.product.uid === this.product.uid)
      );
    },
    productPricingDetails() {
      return (
        !this.isLoadingProduct &&
        this.product &&
        calculateProductPriceAndDiscount(this.product)
      );
    },
    activeProductImage() {
      if (!this.product) return null;

      return this.product.images.find(x => x.id === this.activeImageId);
    },
    nonDefaultProductImages() {
      if (this.isLoadingProduct || !this.product) return null;

      return this.product.images.filter(x => x.id !== this.activeImageId);
    }
  },
  activated() {
    if (this.$fetchState.timestamp <= Date.now() - 90000) {
      this.$fetch();
    }
  },
  async fetch() {
    try {
      this.isLoadingProduct = true;
      const res = await this.$axios.$get(
        "products/single/" + this.$route.params.slug
      );
      this.product = res.payload.product;

      if (this.product.productDiscount.length === 0) {
        clearInterval(this.countdownTimerInterval);
      }

      this.activeImageId =
        this.product.images.find(x => x.isDefaultImage).id ||
        this.product.images[0].id;
    } catch (error) {
      if (error) {
        console.log(error);
      }
    } finally {
      this.isLoadingProduct = false;
    }
  },
  mounted() {
    this.countdownTimerInterval = setInterval(() => {
      this.tempDate = Date.now();
    }, 1000);
  },
  methods: {
    async onClickAddItemToWishlist() {
      if (!this.user) {
        return this.$router.push("/login");
      } else {
        this.handleAddRemoveProductToWishlist(this.product);
      }
    },
    async onClickAddItemToCart() {
      if (!this.user) {
        return this.$router.push("/login");
      } else {
        await this.handleAddRemoveProductToCart(this.product);
        this.productQtyCount = 1;
      }
    },
    handleProductQty(increment) {
      if (increment) {
        this.productQtyCount += 1;
      } else {
        this.productQtyCount =
          this.productQtyCount === 1 ? 1 : this.productQtyCount - 1;
      }
    },
    viewProductImage(image) {
      if (!image) return;

      this.activeImageId = image.id;
    },
    handleQnAAction(questionData, editMode) {
      if (editMode) {
        this.handleAnswerUpdate(questionData);
      } else {
        this.handleAskQuestion(questionData);
      }
    },
    async handleAskQuestion(questionData) {
      try {
        const res = await this.$store.dispatch(
          "products/addProductQuestion",
          questionData
        );

        this.$store.dispatch("addNotification", {
          title: "Success",
          type: "success",
          description: res.data.message
        });

        this.product.qna.unshift({
          ...res.data.payload.question,
          user: this.user
        });

        this.$refs.productQuestions.handleCloseQuestionModal();
      } catch (error) {
        if (error) {
          console.log(error);
        }
      }
    },
    async handleAnswerQuestion(questionData) {
      try {
        const res = await this.$store.dispatch(
          "products/answerProductQuestion",
          questionData
        );
        this.product.qna.push({
          user: this.user,
          ...res.data.payload.answer
        });

        this.$store.dispatch("addNotification", {
          title: "Success",
          type: "success",
          description: res.data.message
        });
      } catch (error) {
        if (error) {
          console.log(error);

          this.$store.dispatch("addNotification", {
            title: "Error",
            type: "error",
            description: "Something went wrong while answering the question"
          });
        }
      }
    },
    async handleAnswerUpdate(questionData) {
      try {
        const res = await this.$store.dispatch(
          "products/updateProductQuestionAnswer",
          questionData
        );

        const updatedAnswer = res.data.payload.answer;

        this.product.qna = this.product.qna.map(q =>
          q.id === updatedAnswer.id
            ? {
                ...updatedAnswer,
                user: this.user
              }
            : q
        );

        this.$store.dispatch("addNotification", {
          title: "Success",
          type: "success",
          description: res.data.message
        });

        this.$refs.productQuestions.handleCloseQuestionModal();
      } catch (error) {
        if (error) {
          console.log(error);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/* Chrome, Safari, Edge, Opera */
.product-qty-input::-webkit-outer-spin-button,
.product-qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.product-qty-input[type="number"] {
  -moz-appearance: textfield;
}
</style>
