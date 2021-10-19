<template>
  <div
    :class="[title ? 'flex-col' : 'flex-row']"
    class="flex items-center w-full h-full spinner-wrapper"
  >
    <div :class="[darkClass]" class="loader-circular"></div>
    <p class="mt-2" v-if="title">{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    dark: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    darkClass() {
      return this.dark ? "dark" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
.loader-circular {
  border: 4px solid #dad7d7;
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  margin: 0 auto;

  &.dark {
    border: 4px solid #323538;
    border-top: 4px solid #aaa;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
