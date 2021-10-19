<template>
  <button
    :type="htmlType"
    :disabled="disabled"
    @click="!disabled && $emit('click')"
    class="flex items-center px-6 py-2 rounded-lg cursor-pointer base-btn"
    :class="[
      btnType,
      btnOutlined,
      isBtnText,
      btnSize,
      btnTextColor,
      btnDisabled,
      btnBlock
    ]"
  >
    <slot name="iconLeft">
      <span v-if="iconLeft" class="flex items-center icon icon-left">
        <Icon :name="iconLeft" />
      </span>
    </slot>

    <span
      class="flex items-center justify-center w-full text-primaryTextOpposite"
      v-if="isLoading"
    >
      <svg
        class="w-5 h-5 fill-current animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-0"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>

    <span class="flex items-center" v-if="!isLoading">
      <slot />
    </span>

    <slot name="iconRight">
      <span v-if="iconRight" class="flex items-center icon icon-right">
        <Icon :name="iconRight" />
      </span>
    </slot>
  </button>
</template>

<script>
import Icon from "@/components/UI/Icon";

export default {
  props: {
    iconLeft: {
      type: String,
      default: ""
    },
    iconRight: {
      type: String,
      default: ""
    },
    block: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },

    outlined: {
      type: Boolean,
      default: false
    },
    htmlType: {
      type: String,
      default: "button"
    },
    type: {
      type: String,
      default: ""
    },
    textColor: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "normal"
    }
  },
  components: {
    Icon
  },
  computed: {
    btnBlock() {
      return this.block && "block";
    },
    btnType() {
      return this.type && "bg-" + this.type;
    },
    isBtnText() {
      return this.text && this.type ? "text-" + this.type : null;
    },
    btnOutlined() {
      return this.outlined && "outlined";
    },
    btnSize() {
      return this.size && `${"size-" + this.size}`;
    },
    btnTextColor() {
      return this.textColor && `${"text-" + this.textColor} `;
    },
    btnDisabled() {
      return this.disabled && `disabled`;
    }
  }
};
</script>

<style lang="scss">
button.block {
  @apply w-full flex items-center justify-center;
}

button {
  &.disabled {
    cursor: not-allowed;
  }
}

.icon {
  svg {
    height: 20px !important;
    width: 20px !important;
    fill: currentColor;
  }
}

.base-btn {
  @apply px-6 py-2   text-base flex items-center space-x-2;
  color: var(--primary-text);

  &:hover {
    /* @apply bg-transparent; */
    color: var(--primary-text);
    background: var(--tertiary-background);
  }

  &.small {
    @apply py-2 px-4 text-sm;
  }
  &.large {
    @apply py-3 px-8;
  }

  &.bg-dark {
    @apply bg-gray-900 text-white;

    &:hover {
      @apply bg-black;
    }

    &.disabled {
      background: var(--btn-dark-disabled);

      &:hover {
        background: var(--btn-dark-disabled);
      }
    }
  }

  &.outlined {
    @apply border border-gray-700;
  }

  &.bg-primary {
    @apply text-white;
    /* background: #4f46e5 ; */
    background: var(--btn-primary);

    svg {
      fill: white !important;
    }

    &:hover {
      /* background: #4338ca ; */
      background: var(--btn-primary-hover);
    }

    &.disabled {
      background: var(--btn-primary-disabled);

      &:hover {
        background: var(--btn-primary-disabled);
      }
    }
  }

  &.bg-danger {
    @apply bg-red-500 text-white;

    &:hover {
      @apply bg-red-600;
    }

    svg {
      fill: white !important;
      color: white !important;
    }

    &.outlined {
      @apply border-red-600 text-gray-900 bg-transparent;
    }
    &.disabled {
      background: var(--btn-danger-disabled);

      &:hover {
        background: var(--btn-danger-disabled);
      }
    }
  }

  /* text colors */
  &.text-primary {
    @apply text-blue-700 bg-transparent hover:bg-blue-200;
  }
  &.text-danger {
    @apply text-red-700 bg-transparent hover:bg-red-200;
  }
}
</style>
