<template>
  <Modal :isVisible="isModalVisible" @clickOutside="handleClickOutsideModal">
    <div
      v-if="product"
      style="min-height:20rem"
      class="z-50 w-11/12 px-4 py-4 mx-auto rounded-lg pointer-events-auto max-h-96 md:max-w-5xl bg-primary"
    >
      <div class="flex flex-col h-full md:flex-row">
        <div class="w-full h-full md:w-4/12">
          <img
            class="object-cover object-top w-full h-full rounded-xl"
            :src="product.images[0].imageUrl"
            alt=""
          />
        </div>

        <div class="w-full px-4 py-1 md:w-8/12">
          <div class="flex items-center justify-between">
            <h4 class="text-xl font-semibold">
              {{ product.name }}
            </h4>

            <button @click="handleClickOutsideModal" class="cursor-pointer ">
              <Icon class="w-6 h-6 text-primary" name="close" />
            </button>
          </div>

          <div>
            <h3 class="my-2 text-lg text-accent">
              <span>{{ constants.CURRENCY }}</span>
              <!-- <span>{{ product.price }}</span> -->
            </h3>
          </div>

          <div class="w-10/12 mt-2 overflow-auto max-h-48">
            <p class=" text-secondary">
              {{ product.description }}
            </p>
          </div>

          <div class="flex items-center mt-8 space-x-2">
            <BaseButton
              @click="emitProductAddRemoveFromCartEvent"
              icon-left="basket"
              :type="isProductPresentInCart ? 'danger' : 'primary'"
            >
              {{ isProductPresentInCart ? "Remove From Cart" : "Add To Cart" }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapState } from "vuex";

import Modal from "@/components/Common/Modal.vue";
import Icon from "@/components/UI/Icon.vue";
import BaseButton from "@/components/UI/Button.vue";

import constants from "@/utils/constants";

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    Modal,
    Icon,
    BaseButton
  },
  computed: {
    ...mapState("auth", ["cart"]),
    isProductPresentInCart() {
      return (
        this.cart &&
        this.product &&
        this.cart.find(x => x.product.uid === this.product.uid)
      );
    }
  },
  data() {
    this.constants = constants;

    return {
      isModalVisible: true
    };
  },
  methods: {
    handleClickOutsideModal() {
      this.$emit("closeModal");
    },
    emitProductAddRemoveFromCartEvent() {
      this.$emit("handleProductAddRemove", this.product);
    }
  }
};
</script>
