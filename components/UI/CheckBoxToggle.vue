<template>
  <div class="flex flex-col w-16">
    <label
      v-if="label"
      class="block mb-2 mr-3 text-sm font-bold text-primary"
      >{{ label }}</label
    >
    <div class="relative flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        class="transition-colors bg-red-500 rounded-full appearance-none cursor-pointer h-7 w-14 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500"
        :checked="value"
        @change="handleChange"
      />
      <span
        v-if="showLabels && !value"
        class="absolute text-xs font-medium text-white pointer-events-none left-8"
      >
        Off
      </span>
      <span
        v-if="showLabels && value"
        class="absolute text-xs font-medium text-white pointer-events-none left-2"
      >
        On
      </span>
      <span
        class="absolute w-5 h-5 transition-transform transform bg-gray-200 rounded-full pointer-events-none right-10"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showLabels: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number, Boolean],
      required: false,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    handleChange(e) {
      this.$emit("input", e.target.checked);
    }
  }
};
</script>

<style>
input:checked {
  background-color: #22c55e; /* bg-green-500 */
}

input:checked ~ span:last-child {
  --tw-translate-x: 1.7rem; /* translate-x-7 */
}
</style>
