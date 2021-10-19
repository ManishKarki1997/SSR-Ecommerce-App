<template>
  <div class="overflow-hidden rounded-lg shadow-lg bg-secondary context-menu">
    <ul class="w-full h-full ">
      <li
        v-for="menuItem in menuItems"
        :key="'menu-item-' + menuItem.name"
        :class="[compact ? 'py-2 px-2 ' : 'py-3 px-3']"
        class="w-full cursor-pointer hover:bg-tertiary"
        @click.stop="onMenuItemClick(menuItem)"
      >
        <div v-if="menuItem.iconName !== undefined" class="icon">
          <Icon :name="menuItem.iconName" />
        </div>
        <p class="text-base tracking-wide">{{ menuItem.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon.vue";
export default {
  props: {
    menuItems: {
      type: Array,
      required: true
    },
    activeContextMenuItem: {
      type: [String, Number, Object],
      required: false
    },
    compact: {
      type: Boolean,
      default: true
    },
    // clicking outside this trigger determines that the click is 'clicked outside'
    trigger: {
      type: String,
      required: false
    }
  },
  components: {
    Icon
  },
  mounted() {
    document.addEventListener("click", e => this.handleClickOutsideListener(e));
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutsideListener);
  },
  methods: {
    onMenuItemClick(menuItem) {
      this.$emit("selected", menuItem);
    },
    handleClickOutsideListener(e) {
      const inside = e.target.closest(this.trigger);
      if (!inside) {
        this.$emit("clickedOutside");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.context-menu {
  min-width: 150px !important;

  ul {
    li {
      display: flex;
      align-items: center;
      @apply space-x-2 text-primary;

      p {
        font-size: 0.9rem;
      }

      .icon {
        svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }
      }
    }
  }
}
</style>
