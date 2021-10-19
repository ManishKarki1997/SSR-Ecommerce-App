<template>
  <div
    v-if="isVisible"
    style="z-index:1000"
    class="fixed top-0 right-0 flex items-center justify-center w-full h-screen basic-modal"
  >
    <div
      @click="onClickOutside"
      class="z-20 w-full h-screen bg-black opacity-75"
    ></div>
    <div
      style="z-index:1000"
      class="fixed inset-0 flex items-center justify-center w-full h-full pointer-events-none"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    onClickOutside() {
      this.$emit("clickOutside");
    }
  }
};
</script>
