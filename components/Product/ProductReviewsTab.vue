<template>
  <div>
    <div class="flex items-center justify-end mb-8 space-x-4">
      <BaseButton @click="handleOnClickReviewBtn" text type="primary">{{
        userHasReviewedTheProduct ? "Update Review" : "Review Product"
      }}</BaseButton>

      <BaseButton
        type="danger"
        v-if="userHasReviewedTheProduct"
        @click="handleOnClickDeleteReview"
      >
        Delete Review
      </BaseButton>
    </div>

    <div v-if="productReviews" class="mt-4">
      <div class="flex items-center justify-center w-full h-16">
        <p class="italic text-primary" v-if="productReviews.length === 0">
          No reviews for this product yet.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 gap-x-2 gap-y-12">
        <ProductReviewCard
          v-for="review in productReviews"
          :key="'review-for-' + product.id + '-id-' + review.id"
          :review="review"
        />
      </div>

      <div
        v-if="pagination.hasNext"
        class="flex items-center justify-center mt-8"
      >
        <BaseButton
          :isLoading="isLoadingMoreReviews"
          @click="handleLoadMoreReviews"
          :disabled="!pagination.hasNext"
        >
          Load More Reviews
        </BaseButton>
      </div>
    </div>

    <ModalSidebar
      @closeModal="handleCloseReviewModal"
      :is-visible="isReviewProductModalVisible"
      :show-back-arrow="false"
      :title="headerTitle"
    >
      <ValidationObserver
        ref="reviewsObserver"
        tag="form"
        @submit.prevent="handleReviewAction"
        class=""
      >
        <!-- small product card -->
        <div v-if="product" class="flex">
          <div class="w-32 h-24">
            <img
              class="object-cover w-full h-full origin-bottom rounded"
              :src="product.images[0].imageUrl"
              alt=""
            />
          </div>

          <div class="w-9/12 px-2">
            <h4>{{ product.name }}</h4>

            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <p class="mr-1 text-blue-500">{{ productPricing.currency }}</p>
                <p class="text-blue-500 ">
                  {{ productPricing.discountedPrice }}
                </p>
              </div>

              <div v-if="productPricing.discount > 0" class="flex items-center">
                <p class="line-through">
                  <span>{{ productPricing.currency }}</span
                  ><span>{{ productPricing.originalPrice }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <FormInput
          v-model="reviewData.comment"
          clearable
          input-name="Review"
          validation-rules="required"
          component-type="textarea"
          :max-length="300"
        />

        <FormInput
          v-model="reviewData.rating"
          clearable
          input-name="Rating"
          validation-rules="required|numeric|min_value:1|max_value:5"
        />

        <BaseButton
          :isLoading="isReviewingProduct"
          :disabled="isReviewingProduct"
          htmlType="submit"
          type="primary"
        >
          {{
            productReviewsActionTypes &&
            currentProductReviewActionType ===
              productReviewsActionTypes.UPDATE_REVIEW
              ? "Update Review"
              : "Review"
          }}
        </BaseButton>
      </ValidationObserver>
    </ModalSidebar>

    <ConfirmModal
      :modal-options="confirmModalOptions"
      @onClickButton="handleOnClickConfirmModalButtons"
      @closeModal="handleCloseConfirmModal"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";

import ProductReviewCard from "@/components/Product/ProductReviewCard.vue";
import ModalSidebar from "@/components/Common/ModalSidebar";
import BaseButton from "@/components/UI/Button";
import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/Select";
import ConfirmModal from "@/components/Common/ConfirmModal.vue";

import { productReviewsActionTypes } from "@/static/enums";
import calculateProductPriceAndDiscount from "@/utils/calculateProductPriceAndDiscount";

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    ValidationObserver,
    ProductReviewCard,
    ModalSidebar,
    FormInput,
    BaseButton,
    FormSelect,
    ConfirmModal
  },

  data() {
    return {
      productReviews: null,
      editMode: false,
      headerTitle: "Review Product",
      currentProductReviewActionType: "",
      isReviewingProduct: false,
      selectedReviewInfo: null,
      productReviewsActionTypes: null,
      isReviewProductModalVisible: false,
      isLoadingMoreReviews: false,
      reviewData: {
        comment: "",
        rating: "",
        productId: ""
      },
      pagination: {
        take: 10,
        skip: 0,
        hasNext: true
      },
      confirmModalOptions: {
        isVisible: false,
        theme: "danger",
        title: "Delete Review?",
        subtitle: "This process cannot be undone.",
        buttonTypesArray: [
          {
            type: "DANGER",
            text: "Delete"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("auth", ["user"]),
    productPricing() {
      return this.product && calculateProductPriceAndDiscount(this.product);
    },
    userHasReviewedTheProduct() {
      return !this.productReviews || !this.user
        ? false
        : this.productReviews.find(r => this.user.email === r.user.email);
    }
  },
  mounted() {
    this.productReviewsActionTypes = productReviewsActionTypes;

    if (!this.productReviews) {
      this.fetchProductReviews();
    }
  },
  methods: {
    handleCloseReviewModal() {
      this.resetReviewData();
      this.isReviewProductModalVisible = false;
    },
    resetReviewData() {
      this.reviewData = {
        ...this.reviewData,
        comment: "",
        rating: ""
      };

      this.isReviewingProduct = false;
      this.reviewInfo = null;
      this.headerTitle = "Review Product";
    },
    handleOnClickReviewBtn() {
      if (!this.user) {
        return this.$router.push("/login");
      }

      if (this.userHasReviewedTheProduct) {
        this.reviewData = {
          productId: this.product.id,
          comment: this.userHasReviewedTheProduct.comment,
          rating: this.userHasReviewedTheProduct.rating
        };

        this.currentProductReviewActionType = this.productReviewsActionTypes.UPDATE_REVIEW;

        this.isReviewProductModalVisible = true;
        return;
      }
      this.currentProductReviewActionType = this.productReviewsActionTypes.REVIEW;
      this.reviewData = {
        productId: this.product.id,
        comment: "",
        rating: ""
      };

      this.isReviewProductModalVisible = true;
    },
    async handleReviewAction() {
      const valid = await this.$refs.reviewsObserver.validate();
      if (!valid) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description: "Please fill in the required fields",
          type: "danger"
        });
        return;
      }

      this.reviewData = {
        ...this.reviewData,
        productId: this.product.id
      };

      if (
        this.currentProductReviewActionType ===
        this.productReviewsActionTypes.REVIEW
      ) {
        this.handleReviewProduct();
      } else if (
        this.currentProductReviewActionType ===
        this.productReviewsActionTypes.UPDATE_REVIEW
      ) {
        this.handleUpdateReview();
      }
    },
    async fetchProductReviews() {
      try {
        if (this.pagination.skip > 0) {
          this.isLoadingMoreReviews = true;
        }
        const res = await this.$store.dispatch("products/fetchProductReviews", {
          productId: this.product.id,
          take: this.pagination.take,
          skip: this.pagination.skip
        });

        if (this.productReviews) {
          res.data.payload.reviews.forEach(r => {
            if (!this.productReviews.find(x => x.id === r.id)) {
              this.productReviews.push(r);
            }
          });
        } else {
          this.productReviews = res.data.payload.reviews;
        }

        this.pagination.hasNext =
          this.product._count.reviews >
          this.pagination.take * (this.pagination.skip || 1);
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Couldn't fetch product reviews",
            type: "danger"
          });
        }
      } finally {
        this.isLoadingMoreReviews = false;
      }
    },
    async handleReviewProduct() {
      try {
        const res = await this.$store.dispatch(
          "products/reviewProduct",
          this.reviewData
        );

        this.productReviews.unshift({
          user: this.user,
          ...res.data.payload.review
        });

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: res.data.message,
          type: "success"
        });

        this.resetReviewData();
        this.isReviewProductModalVisible = false;
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong while posting your review.",
            type: "danger"
          });
        }
      }
    },
    async handleUpdateReview() {
      try {
        const res = await this.$store.dispatch("products/updateProductReview", {
          ...this.reviewData,
          reviewId: this.userHasReviewedTheProduct.id
        });

        const updatedReview = {
          user: this.user,
          ...res.data.payload.review
        };

        this.productReviews = this.productReviews.map(x =>
          x.id === updatedReview.id ? updatedReview : x
        );

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: res.data.message,
          type: "success"
        });

        this.resetReviewData();
        this.isReviewProductModalVisible = false;
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
        }
      } finally {
        this.currentProductReviewActionType = this.productReviewsActionTypes.REVIEW;
      }
    },
    handleLoadMoreReviews() {
      if (this.pagination.hasNext) {
        this.pagination = {
          ...this.pagination,
          skip: this.pagination.skip + 1
        };
      }

      this.fetchProductReviews();
    },
    handleOnClickDeleteReview() {
      this.confirmModalOptions = {
        isVisible: true,
        theme: "danger",
        title: "Delete your review?",
        subtitle: "This process cannot be undone",
        buttonTypesArray: [
          {
            type: "DANGER",
            text: "Delete"
          }
        ]
      };
    },
    handleOnClickConfirmModalButtons(emitType) {
      if (emitType === "DANGER") {
        this.deleteReview();
      }
    },
    async deleteReview() {
      try {
        const res = await this.$store.dispatch(
          "products/deleteProductReview",
          this.userHasReviewedTheProduct.id
        );
        this.productReviews = this.productReviews.filter(
          r => r.id !== this.userHasReviewedTheProduct.id
        );

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: res.data.message,
          type: "success"
        });

        this.handleCloseConfirmModal();
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
        }
      }
    },
    handleCloseConfirmModal() {
      this.confirmModalOptions = {
        ...this.confirmModalOptions,
        isVisible: false
      };
    }
  }
};
</script>
