<template>
  <div
    v-if="isVisible"
    style="z-index:1000"
    class="fixed top-0 right-0 flex justify-end w-full h-screen modal-sidebar"
  >
    <div
      @click="handleCloseModal"
      class="w-full h-screen bg-black opacity-75"
    ></div>

    <div
      :class="[size === 'small' ? 'w-4/12' : 'w-5/12']"
      class="fixed top-0 right-0 z-50 h-screen px-4 py-4 overflow-y-auto rounded-tl-xl rounded-bl-xl sidebar-content-wrapper content lg:px-6 lg:py-6 bg-secondary"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 ">
          <span v-if="showBackArrow">
            <Icon name="arrow-left" />
          </span>
          <h4 class="text-lg font-semibold ">{{ title }}</h4>
        </div>

        <span class="w-6 h-6 cursor-pointer" @click="handleCloseModal">
          <Icon name="close" />
        </span>
      </div>

      <div class="mt-8 content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon.vue";

export default {
  props: {
    size: {
      type: String,
      default: "small",
      validator: function(value) {
        return ["small", "normal"].indexOf(value) !== -1;
      }
    },
    title: {
      type: String,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: false
    },
    showBackArrow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Icon
  },
  watch: {
    isVisible: {
      handler(newVal) {
        if (newVal) {
          setTimeout(() => {
            document
              .querySelector(".sidebar-content-wrapper")
              .classList.add("slide-in");
          }, 50);
        }
      }
    }
  },

  methods: {
    handleCloseModal() {
      document
        .querySelector(".sidebar-content-wrapper")
        .classList.remove("slide-in");

      setTimeout(() => {
        this.$emit("closeModal");
      }, 250);
    }
  }
};
</script>

<style lang="scss">
.sidebar-content-wrapper {
  transform: translateX(600px);
  transition: all 0.3s;
  opacity: 0;

  &.slide-in {
    transform: translateX(0px);
    opacity: 1;
  }
}
</style>
