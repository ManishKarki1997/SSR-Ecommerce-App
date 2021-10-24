<template>
  <div>
    <p>{{ current }}</p>
  </div>
</template>

<script>
import { calculateCountdown } from "@/utils/dateFns";

export default {
  props: {
    interval: {
      type: Number,
      default: 1
    },
    initial: {
      type: Number
    }
  },
  data() {
    return {
      current: this.initial,
      timerInterval: null
    };
  },
  methods: {
    onInterval() {
      this.current = this.current -= this.interval;
      if (this.current <= 0) {
        clearInterval(this.timerInterval);
        this.current = 0;
      }
    }
  },
  mounted() {
    this.timerInterval = setInterval(this.onInterval, this.interval * 1000);
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
  }
};
</script>
