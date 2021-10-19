<template>
  <div
    @click="handleSelectCategory"
    class="relative w-full h-64 cursor-pointer category-card group"
  >
    <div class="w-full h-full overflow-hidden rounded-lg">
      <img
        class="object-cover w-full h-full "
        :src="category.imageUrl"
        :alt="'Image for ' + category.name"
      />
    </div>

    <div class="mt-2 text-center">
      <h4 class="font-bold text-md ">{{ category.name }}</h4>
    </div>

    <div
      class="absolute top-0 left-0 z-10 w-full h-full bg-black rounded-lg opacity-20"
    ></div>

    <div
      class="absolute top-0 right-0 z-50 flex flex-col items-end justify-end more-option-icon-wrapper text-primaryBgText"
    >
      <span
        @click.stop="onTriggerContextMenu"
        class=" menu-icon group-hover:block"
        :class="[
          activeContextMenuItem && activeContextMenuItem.id === category.id
            ? 'context-menu-icon block'
            : 'hidden'
        ]"
      >
        <Icon class="cursor-pointer " name="horizontal-menu" />
      </span>
      <ContextMenu
        v-if="activeContextMenuItem && activeContextMenuItem.id === category.id"
        :menuItems="contextMenuItems"
        :activeContextMenuItem="activeContextMenuItem"
        @selected="handleSelectedOption"
      />
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon.vue";
import ContextMenu from "@/components/Common/ContextMenu.vue";

export default {
  props: {
    category: {
      type: Object,
      required: true
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
  data() {
    return {
      contextMenuItems: [
        {
          name: "Quick Edit",
          iconName: "edit",
          menuName: "quick-edit"
        },
        {
          name: "Edit",
          iconName: "edit",
          menuName: "edit"
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
    handleSelectedOption(selectedOption) {
      this.$emit("selectedContextMenu", this.category, selectedOption);
    },
    handleSelectCategory() {
      this.$emit("click", this.category);
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
        this.activeContextMenuItem?.id === this.category.id
          ? null
          : this.category
      );
    }
  }
};
</script>

<style lang="scss">
.category-card .more-option-icon-wrapper {
  right: 8px;
  top: 8px;

  .menu-icon {
    svg {
      fill: white !important;
    }
  }
}
</style>
