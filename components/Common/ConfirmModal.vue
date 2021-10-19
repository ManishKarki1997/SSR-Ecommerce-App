<template>
  <div>
    <Modal
      @clickOutside="handleCloseConfirmModal"
      :is-visible="modalOptions.isVisible || false"
    >
      <div
        class="w-10/12 px-8 py-8 shadow-xl pointer-events-auto modal-content-wrapper bg-secondary text-primary rounded-2xl lg:w-4/12 md:6/12 max-h-96"
      >
        <div class="flex">
          <div :class="modalOptions.theme" class="w-1/12 mt-1 icon-theme">
            <Icon
              class="w-6 h-6 fill-current"
              :name="iconTypes[modalOptions.theme]"
            />
          </div>

          <div
            v-if="modalOptions && Object.keys(modalOptions).length > 0"
            class="w-11/12"
          >
            <div class="flex justify-between w-full">
              <div class="w-11/12 ">
                <h4 class="mb-2 text-xl font-semibold">
                  {{ modalOptions.title }}
                </h4>
                <p class="font-light text-secondary">
                  {{ modalOptions.subtitle }}
                </p>
              </div>

              <div class="w-1/12 ">
                <div
                  @click="handleCloseConfirmModal"
                  class="flex items-center justify-center w-10 h-10 -mt-1 rounded-full cursor-pointer bg-primary hover:bg-tertiary"
                >
                  <Icon class="w-6 h-6" name="close" />
                </div>
              </div>
            </div>

            <div class="flex items-center mt-4 space-x-2">
              <BaseButton
                @click="handleEmitButtonEvents('DANGER')"
                v-if="dangerButtonInfo"
                type="danger"
                >{{ dangerButtonInfo.text }}</BaseButton
              >
              <BaseButton
                @click="handleEmitButtonEvents('PRIMARY')"
                v-if="primaryButtonInfo"
                type="primary"
                >{{ primaryButtonInfo.text }}</BaseButton
              >
              <BaseButton @click="handleCloseConfirmModal">Cancel</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Common/Modal";
import Icon from "@/components/UI/Icon.vue";
import BaseButton from "@/components/UI/Button.vue";

export default {
  props: {
    modalOptions: {
      type: Object,
      required: true
    }
  },
  components: {
    Modal,
    Icon,
    BaseButton
  },
  data() {
    return {
      buttonTypes: {
        CANCEL: "CANCEL",
        DANGER: "DANGER",
        PRIMARY: "PRIMARY"
      },
      iconTypes: {
        warning: "alert-circle",
        danger: "error",
        success: "check-circle",
        info: "info-circle"
      }
    };
  },
  computed: {
    dangerButtonInfo() {
      if (!this.modalOptions) return null;

      return this.modalOptions.buttonTypesArray.find(
        x => x.type === this.buttonTypes.DANGER
      );
    },
    primaryButtonInfo() {
      if (!this.modalOptions) return null;

      return this.modalOptions.buttonTypesArray.find(
        x => x.type === this.buttonTypes.PRIMARY
      );
    }
  },
  watch: {
    modalOptions: {
      handler(newVal) {
        if (newVal?.isVisible) {
          setTimeout(() => {
            document
              .querySelector(".modal-content-wrapper")
              .classList.add("appear");
          }, 50);
        }
      }
    }
  },
  methods: {
    handleCloseConfirmModal() {
      document
        .querySelector(".modal-content-wrapper")
        .classList.remove("appear");

      setTimeout(() => {
        this.$emit("closeModal");
      }, 200);
    },
    handleEmitButtonEvents(emitType) {
      this.$emit("onClickButton", emitType);
      if (emitType === "CANCEL") {
        this.isModalVisible = false;
      }
    }
  }
};
</script>

<style lang="scss">
.modal-content-wrapper {
  opacity: 0;
  transition: all 0.1s ease;

  &.appear {
    opacity: 1;
  }
}

.icon-theme {
  &.danger {
    svg {
      fill: var(--btn-danger) !important;
    }
  }

  &.success,
  &.info {
    svg {
      fill: var(--btn-primary) !important;
    }
  }
}
</style>
