<template>
  <div class="w-full bg-primary">
    <div class="flex items-center justify-between h-12 ">
      <h4 class="text-base font-semibold md:text-xl text-primary">
        {{ filterName }}
      </h4>

      <button @click="toggleMinimize">
        <Icon v-if="!isMinimized" name="minus" />
        <Icon v-if="isMinimized" name="plus" />
      </button>
    </div>

    <ul
      v-if="listItems"
      class="transition-all duration-300 "
      :class="[
        isMinimized ? ' max-h-0 overflow-hidden' : 'max-h-64 overflow-auto'
      ]"
    >
      <li
        v-for="(item, idx) in listItems"
        :key="filterName + item.name + idx"
        class="flex items-center mb-4 space-x-2 text-base cursor-pointer hover:text-blue-700"
        :class="[
          selectedItem && selectedItem.name === item.name
            ? ' text-blue-700'
            : 'text-secondary'
        ]"
        @click="onSelectItem(item)"
      >
        <p class="text-sm ">{{ item.name }}</p>

        <div
          :class="[
            selectedItem && selectedItem.name === item.name
              ? ' text-blue-700'
              : 'text-secondary'
          ]"
          class="ml-8 text-sm"
        >
          <p class="" v-if="subTextKey">
            ({{ resolveObjectAccessUsingKey(item, subTextKey) }})
          </p>
          <p class="" v-if="subText">{{ item[subText] }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { objectKeyAccessByStringResolve } from "@/utils";

import Icon from "@/components/UI/Icon.vue";

export default {
  components: {
    Icon
  },
  props: {
    subText: {
      type: String,
      default: ""
    },
    subTextKey: {
      type: String,
      default: ""
    },
    enableDefaultSelect: {
      type: Boolean,
      default: false
    },
    filterName: {
      type: String,
      required: true
    },
    listItems: {
      type: Array,
      required: true
    },
    extraData: {
      type: [Object, Array],
      required: false
    },
    minimized: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isMinimized: false,
      selectedItem: null
    };
  },
  mounted() {
    this.isMinimized = this.minimized;

    if (this.enableDefaultSelect) {
      this.selectedItem =
        this.listItems && this.listItems.length > 0 && this.listItems[0];
    }
  },
  methods: {
    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
    },
    onSelectItem(item) {
      if (!this.selectedItem || this.selectedItem.name !== item.name) {
        this.selectedItem = item;
      } else {
        this.selectedItem = null;
      }

      this.$emit("selected", this.selectedItem, this.extraData);
    },
    resolveObjectAccessUsingKey(obj, key) {
      return objectKeyAccessByStringResolve(key, obj);
    }
  }
};
</script>
