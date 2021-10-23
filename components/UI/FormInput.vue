<template>
  <ValidationProvider
    mode="eager"
    :bails="false"
    :name="customValidationFieldName || inputName"
    tag="div"
    :vid="vid"
    :rules="`${validationRules}`"
    class="w-full form-input"
    :class="[showLabel ? 'pt-6' : null]"
    :data-vv-as="customValidationFieldName"
    v-slot="{ errors }"
  >
    <div class="flex items-center justify-between">
      <label v-if="showLabel" :for="inputName" class="text-primary"
        >{{ label || inputName }}
        <span v-if="showRequiredFieldAsterisk" class="text-sm text-primary"
          >*</span
        >
      </label>

      <span v-if="maxLength > 0" class="text-sm text-primary"
        >{{ inputLength }}/{{ maxLength }}</span
      >
    </div>
    <div
      class="h-32 bg-secondary text-primary"
      v-if="componentType === 'textarea'"
    >
      <textarea
        class="block w-full h-full px-4 py-2 placeholder-gray-500 border border-gray-300 rounded text-primaryTextOpposite sm:text-sm bg-secondary"
        :name="inputName"
        :id="inputName"
        :type="type"
        :value="value"
        @input="handleOnChange"
      ></textarea>
    </div>

    <div
      v-if="componentType === 'input'"
      class="flex items-center h-10 px-4 border border-gray-300 rounded bg-secondary text-primaryTextOpposite focus:border-indigo-500"
      :class="[showLabel ? 'mt-1' : '-mt-4']"
    >
      <span class="mr-2 icon-wrapper" v-if="iconLeft">
        <Icon :name="iconLeft" v-if="iconLeft" />
      </span>

      <input
        :id="inputName"
        :name="inputName"
        :step="step"
        :type="type"
        :value="value"
        class="block w-full h-full placeholder-gray-500 bg-transparent appearance-none focus:outline-none sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
        :placeholder="placeholder"
        @input="handleOnChange"
      />

      <span class="ml-2 icon-wrapper" v-if="iconRight">
        <Icon :name="iconRight" v-if="iconRight" />
      </span>

      <span
        v-if="clearable && value"
        class="icon-right icon-wrapper"
        @click="clearValue"
      >
        <Icon name="close" />
      </span>
    </div>

    <div class="h-8 mt-1 error-messages" v-if="validationRules">
      <p
        class="flex text-sm text-red-600"
        v-for="(msg, index) in errors.slice(0, 1)"
        :key="`errror-${index}`"
      >
        <span class="mr-1 text-red-600 error-icon">
          <Icon name="alert-circle" />
        </span>
        <span class=""> {{ msg }}</span>
      </p>
    </div>
  </ValidationProvider>
</template>

<script>
import Icon from "@/components/UI/Icon";
import { ValidationProvider } from "vee-validate";

export default {
  props: {
    maxLength: {
      type: Number,
      default: 0
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    step: {
      type: String,
      required: false
    },
    showRequiredFieldAsterisk: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      required: false,
      default: ""
    },
    componentType: {
      type: String,
      default: "input"
    },
    label: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    placeholder: {
      type: String,
      default: ""
    },
    customValidationFieldName: {
      type: String,
      default: ""
    },
    validationRules: {
      type: String,
      default: ""
    },
    clearable: {
      type: Boolean,
      default: true
    },
    vid: {
      type: String,
      default: ""
    },
    inputName: {
      type: String,
      required: true
    },
    iconLeft: {
      type: String,
      default: ""
    },
    iconRight: {
      type: String,
      default: ""
    }
  },
  components: {
    Icon,
    ValidationProvider
  },
  data() {
    return {
      // value: "",
      inputLength: 0
    };
  },
  methods: {
    handleOnChange(e) {
      this.inputLength = e.target.value.length;
      if (
        this.maxLength === 0 ||
        (this.maxLength > 0 && e.target.value.length < this.maxLength)
      ) {
        this.$emit("input", e.target.value);
      }
    },
    clearValue() {
      // this.value = ''
      this.$emit("input", "");
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-wrapper {
  svg {
    width: 20px !important;
    height: 20px !important;
  }
}

.error-icon {
  .icon {
    fill: rgba(220, 38, 38) !important;
    width: 16px;
    height: 16px;
  }
}
</style>
