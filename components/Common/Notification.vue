<template>
  <div
    :class="[notification.type === undefined ? 'info' : notification.type]"
    class="flex max-w-xl px-4 py-4 rounded-lg shadow-2xl notification bg-secondary"
  >
    <div
      class="w-16 h-16 mr-2 icon-wrapper"
      :class="[notification.type === undefined ? 'info' : notification.type]"
    >
      <Icon
        :name="
          notification.type === undefined
            ? 'info'
            : iconTypes[notification.type]
        "
      />
    </div>

    <div class="">
      <h4 class="text-lg font-semibold text-primary">
        {{ notification.title }}
      </h4>
      <p class="text-sm text-secondary">
        {{ notification.description }}
      </p>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon";

export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  components: {
    Icon
  },
  data() {
    return {
      timeoutRef: null,
      iconTypes: {
        warning: "alert-circle",
        danger: "error",
        success: "check-circle",
        info: "info-circle"
      }
    };
  },
  mounted() {
    this.timeoutRef = setTimeout(() => {
      this.removeNotification();
    }, this.notification?.duration || 3000000);
  },
  beforeDestroy() {
    clearTimeout(this.timeoutRef);
  },
  methods: {
    removeNotification() {
      this.$store.dispatch("removeNotification", this.notification);
    }
  }
};
</script>

<style lang="scss" scoped>
.notification {
  &.info {
    /* @apply border border-blue-500; */
    @apply border-l-4 border-blue-500;
  }

  &.success {
    /* @apply border border-green-500; */
    @apply border-l-4 border-green-500;
  }

  &.warning {
    /* @apply border border-yellow-500; */
    @apply border-l-4 border-yellow-500;
  }

  &.danger {
    /* @apply border border-red-500; */
    @apply border-l-4 border-red-500;
  }
}
.icon-wrapper {
  svg {
    width: 48px !important;
    height: 48px !important;
  }

  &.info {
    svg {
      @apply text-blue-600;
    }
  }

  &.success {
    svg {
      @apply text-green-600;
    }
  }

  &.danger {
    svg {
      @apply text-red-600;
    }
  }

  &.warning {
    svg {
      @apply text-yellow-600;
    }
  }
}
</style>
