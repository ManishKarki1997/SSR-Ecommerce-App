<template>
  <div
    class="sticky top-0 left-0 z-20 flex items-center justify-between w-full py-6 mb-16 bg-primary page-header text-primary"
  >
    <div class="flex items-center w-3/12 h-full">
      <div @click="$router.go(-1)" class="mr-2 cursor-pointer">
        <Icon name="arrow-left" />
      </div>
      <p class="text-lg font-bold ">{{ title }}</p>
    </div>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon";

export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  components: {
    Icon
  }
};
</script>
