<template>
  <div class="select-div">
    <div class="relative flex items-center">
      <label
        v-if="showLabel && label"
        id="listbox-label"
        class="mr-2 text-primary"
      >
        {{ label }}
      </label>

      <Spinner dark v-if="isLoadingList" />
    </div>

    <div class="relative mt-1">
      <button
        @click="toggleExpand"
        type="button"
        class="relative w-full h-10 py-2 pl-3 pr-10 text-left border border-gray-300 rounded-md shadow-sm cursor-default bg-secondary focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
      >
        <div class="flex items-center">
          <img
            v-if="selectedItem && selectedItem.imageUrl !== undefined"
            :src="selectedItem.imageUrl"
            alt=""
            class="flex-shrink-0 w-6 h-6 rounded-full"
          />
          <span class="block ml-3 truncate">
            {{ initial ? initial.name : selectedItem ? selectedItem.name : "" }}
            <!-- {{ selectedItem ? selectedItem.name : "" }} -->
          </span>
        </div>
        <span
          class="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none"
        >
          <!-- Heroicon name: solid/selector -->
          <svg
            class="w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>

      <ul
        ref="listItemsWrapper"
        v-if="listItems"
        class="absolute z-40 w-full px-4 py-1 mt-1 overflow-auto text-base border border-gray-300 rounded-md shadow-lg list-items bg-primary max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        :class="[{ expanded: isExpanded }]"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
      >
        <li
          v-for="listItem in listItems"
          :key="listItem.id || listItem.name"
          :class="{ 'pl-3 pr-9': listItem.imageUrl !== undefined }"
          class="relative px-2 py-2 my-2 rounded-lg cursor-pointer select-none group text-primary hover:bg-btnPrimary hover:text-white"
          id="listbox-option-0"
          role="option"
          @click="handleSelectItem(listItem)"
        >
          <div class="flex items-center">
            <div
              v-if="listItem.imageUrl !== undefined"
              class="flex-shrink-0 w-6 h-6 overflow-hidden rounded-full"
            >
              <img
                :src="listItem.imageUrl"
                alt=""
                class="object-cover w-full h-full "
              />
            </div>

            <span
              :class="[listItem.imageUrl === undefined ? 'ml-0' : 'ml-3 ']"
              class="block font-normal truncate"
            >
              {{ listItem.name }}
            </span>
          </div>

          <span
            v-if="showDeleteBtn"
            @click.stop="handleDeleteEvent(listItem)"
            class="absolute inset-y-0 right-0 flex items-center pr-4 group-hover:text-white delete-icon text-primaryTextOpposite"
          >
            <Icon name="trash" />
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon.vue";
import Spinner from "@/components/Common/Spinner.vue";

export default {
  props: {
    label: {
      type: String
    },
    showDeleteBtn: {
      type: Boolean,
      default: true
    },
    isLoadingList: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    initialValue: {
      type: Object,
      default: null
    },
    listItems: {
      type: Array,
      required: true
    }
  },
  components: {
    Icon,
    Spinner
  },
  data() {
    return {
      selectedItem: null,
      isExpanded: false,
      initial: null
    };
  },

  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    handleSelectItem(listItem) {
      this.initial = null;
      this.selectedItem = listItem;
      this.$emit("selected", listItem);
      this.toggleExpand();
    },
    handleDeleteEvent(listItem) {
      this.$emit("delete", listItem);
    },
    handleClickOutsideListener(e) {
      const inside = e.target.closest(`.select-div`);

      if (!inside) {
        if (this.isExpanded) {
          this.isExpanded = false;
        }
      }
    }
  },
  watch: {
    initialValue: {
      handler(val) {
        if (val) {
          this.initial = val;
        }
      },
      immediate: true
    }
  },
  mounted() {
    document.addEventListener("click", e => this.handleClickOutsideListener(e));
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutsideListener);
  }
};
</script>

<style lang="scss" scoped>
.list-items {
  opacity: 0;
  height: 0;
  overflow: hidden;

  &.expanded {
    opacity: 1;
    height: auto;
    max-height: 12rem;
    overflow-y: auto;
  }

  li {
    .delete-icon {
      svg {
        width: 16px !important;
        height: 16px !important;
      }
    }

    &:hover {
      .delete-icon {
        svg {
          fill: white !important;
        }
      }
    }
  }
}
</style>
