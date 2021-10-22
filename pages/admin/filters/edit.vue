<template>
  <div class="min-h-screen">
    <AdminPageHeader
      :title="subCategoryName ? subCategoryName + ' Filters' : 'Loading...'"
    >
    </AdminPageHeader>

    <div class="content-wrapper">
      <div class="flex items-center mb-6 spacing-x-12">
        <FormSelect
          v-if="minimalCategories"
          :initial-value="minimalCategories[0]"
          :list-items="minimalCategories || []"
          label="Category"
          @selected="handleSelectCategory"
          class="-mt-3 w-72"
        />

        <FormSelect
          v-if="selectedSubCategory"
          :list-items="subCategories || []"
          label="SubCategory"
          :initial-value="selectedSubCategory"
          @selected="handleSelectSubcategory"
          class="ml-8 -mt-3 w-72"
        />
      </div>

      <div class="rounded-lg shadow bg-primary">
        <table
          class="w-full whitespace-no-wrap border-collapse table-auto bg-primary table-striped table-header"
        >
          <thead>
            <tr class="border-b border-gray-300">
              <th class="py-2 ">
                Name
              </th>
              <th class="py-2 ">
                New Filter Option
              </th>
              <th class="py-2 ">
                Filters
              </th>
              <th class="py-2 ">
                Visible to visitors
              </th>
              <th class="py-2 ">
                Manual Input
              </th>
              <th class="py-2 ">
                Action
              </th>
            </tr>
          </thead>
        </table>

        <div class="data-content-wrapper">
          <table
            class="w-full whitespace-no-wrap border-collapse table-auto data-table bg-primary table-striped table-header--data"
          >
            <ValidationObserver
              ref="filtersDataObserver"
              tag="thead"
              class="mt-8 space-y-6"
            >
              <tr
                v-for="(filter, index) in filters"
                :key="filter.name"
                class=""
              >
                <td class="py-2 ">
                  <FormInput
                    class="mt-4"
                    :show-label="false"
                    :input-name="filter.name + ' Option'"
                    validation-rules="required:customMin:1"
                    v-model="filter.name"
                  />
                </td>
                <td class="py-2 ">
                  <div class="flex items-center -mt-5">
                    <FormInput
                      v-if="temporaryNewFilterNamesObj && filters"
                      :input-name="filter.name + ' Option ' + index + 1"
                      label="Option"
                      :show-label="false"
                      v-model="temporaryNewFilterNamesObj[filter.name]"
                    />
                    <span
                      @click="
                        addFilterOptionValueToDropdown(filter, {
                          filterInputName: filter.name + ' Option ' + index + 1
                        })
                      "
                      class="px-2 py-2 mb-4 ml-2 rounded-full bg-secondary"
                    >
                      <Icon name="plus" />
                    </span>
                  </div>
                </td>
                <td class="py-2 ">
                  <FormSelect
                    :initial-value="filter.filterOptions[0]"
                    :list-items="filter.filterOptions"
                    @delete="handleDeleteFilterOption($event, filter)"
                    class="-mt-10"
                  />
                </td>
                <td class="py-2 ">
                  <CheckBoxToggle
                    class="-mt-8"
                    v-model="filter.isVisibleToVisitors"
                  />
                </td>
                <td class="py-2 ">
                  <CheckBoxToggle class="-mt-8" v-model="filter.filterType" />
                </td>
                <td class="py-2 ">
                  <div
                    class="flex items-center space-x-4 action-btn-icons-wrapper -mt-7"
                  >
                    <span
                      class="cursor-pointer "
                      @click="handleDeleteFilter(filter)"
                    >
                      <Icon name="trash" />
                    </span>
                  </div>
                </td>
              </tr>

              <tr>
                <td class="py-2 ">
                  <FormInput
                    class="mt-4"
                    :show-label="false"
                    input-name="New Filter Row Name"
                    validation-rules="required:customMin:1"
                    v-model="newFilterRow.name"
                  />
                </td>

                <td class="py-2 ">
                  <div class="flex items-center -mt-5">
                    <FormInput
                      input-name="New Filter Option Value"
                      label="Option"
                      :show-label="false"
                      v-model="newFilterRow.tempFilterOptionName"
                    />

                    <span
                      @click="
                        addFilterOptionValueToDropdown(null, {
                          filterInputName: 'New Filter Option Value',
                          ofNewRow: true
                        })
                      "
                      class="px-2 py-2 mb-4 ml-2 rounded-full bg-secondary"
                    >
                      <Icon name="plus" />
                    </span>
                  </div>
                </td>

                <td class="py-2 ">
                  <FormSelect
                    :list-items="newFilterRow.filterOptions"
                    @delete="handleDeleteFilterOption($event, filter, true)"
                    class="-mt-10"
                  />
                </td>

                <td class="py-2 ">
                  <CheckBoxToggle
                    class="-mt-8"
                    v-model="newFilterRow.isVisibleToVisitors"
                  />
                </td>

                <td class="py-2 ">
                  <CheckBoxToggle
                    class="-mt-8"
                    v-model="newFilterRow.filterType"
                  />
                </td>

                <td class="py-2 ">
                  <div
                    class="flex items-center space-x-4 action-btn-icons-wrapper -mt-7"
                  >
                    <span
                      class="cursor-pointer "
                      @click="handleConfirmNewRowAddition"
                    >
                      <Icon name="plus" />
                    </span>
                    <!-- <span
                      class="cursor-pointer "
                      @click="handleEditFilter(groupedFiltersBySubCategory[k])"
                    >
                      <Icon name="edit" />
                    </span>
                    <span
                      class="cursor-pointer "
                      @click="
                        handleDeleteFilter(groupedFiltersBySubCategory[k])
                      "
                    >
                      <Icon name="trash" />
                    </span> -->
                  </div>
                </td>
              </tr>
            </ValidationObserver>
          </table>
        </div>

        <BaseButton type="primary" @click="handleUpdateFilters">
          Update Filter
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";

import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import Spinner from "@/components/Common/Spinner.vue";
import FormInput from "@/components/UI/FormInput.vue";
import CheckBoxToggle from "@/components/UI/CheckBoxToggle.vue";
import FormSelect from "@/components/UI/Select.vue";

export default {
  components: {
    Icon,
    BaseButton,
    AdminPageHeader,
    Spinner,
    FormInput,
    CheckBoxToggle,
    FormSelect,
    ValidationObserver
  },
  data() {
    return {
      validationObserverTypes: {
        EXISTING_DATA_OBSERVER: "filtersDataObserver",
        NEW_FILTER_ROW_OBSERVER: "newFilterRowDataObserver"
      },
      subCategoryName: "",
      categoryName: "",
      filters: null,
      selectedCategory: null,
      selectedSubCategory: null,
      subCategories: null,
      temporaryNewFilterNamesObj: null,
      checkboxValue: false,
      newFilterRow: {
        name: "",
        tempFilterOptionName: "",
        categoryName: "",
        parentCategoryName: "",
        filterOptions: [],
        isVisibleToVisitors: true,
        filterType: true
      },
      updatePayload: {
        filterOptionsToAdd: [],
        filterOptionsToDelete: [],
        filtersToDelete: [],
        filtersToAdd: []
      }
    };
  },
  computed: {
    ...mapState("categories", ["minimalCategories"]),
    filteredSubcategories() {
      if (!this.minimalCategories) return null;
    }
  },
  mounted() {
    this.subCategoryName = this.$route.query.subCategory;
    this.categoryName = this.$route.query.category;
    if (!this.subCategoryName || !this.categoryName) {
      this.$nuxt.error({
        statusCode: "403",
        message: "Category or Sub Category does not exist"
      });
    }

    // if (!this.minimalCategories) {
    //   this.fetchMinimalCategories();
    // }

    this.fetchFilter();
  },
  methods: {
    async handleUpdateFilters() {
      try {
        if (!this.categoryName) {
          this.$store.dispatch("addNotification", {
            type: "danger",
            title: "Invalid Data",
            description: "No category selected.",
            duration: 5000
          });
          return;
        }
        const invalidData = this.filters.filter((f, idx) => {
          if (f.name === "") {
            return f;
          }
          return null;
        });

        if (invalidData.length > 0) {
          this.$store.dispatch("addNotification", {
            type: "danger",
            title: "Invalid Data",
            description: "Please fill in all the required fields.",
            duration: 5000
          });
          return;
        }

        const payload = {
          subCategoryName: this.subCategoryName,
          categoryName: this.categoryName,
          filters: this.filters.map(x => ({
            ...x,
            filterType: x.filterType ? "MULTIPLE_SELECT" : "SINGLE_SELECT"
          })),
          filterOptionsToAdd: this.updatePayload.filterOptionsToAdd,
          filtersToDelete: this.updatePayload.filtersToDelete,
          filterOptionsToDelete: this.updatePayload.filterOptionsToDelete,
          filtersToAdd: this.updatePayload.filtersToAdd
        };

        const res = await this.$store.dispatch("filters/updateFilter", payload);
        if (res.data.payload.error) {
          this.$store.dispatch("addNotification", {
            type: "danger",
            title: "Error",
            description: "Something went wrong saving the filters.",
            duration: 5000
          });
          return;
        }

        this.$store.dispatch("addNotification", {
          type: "success",
          title: "Success",
          description: "Filters updated successfully.",
          duration: 5000
        });

        this.clearNewFilter();
        // eslint-disable-next-line no-unreachable
      } catch (error) {
        if (error.response) {
          this.$store.dispatch("addNotification", {
            type: "danger",
            title: "Something went wrong",
            description: error.response.data.message,
            duration: 5000
          });
        }
      }
    },
    async fetchMinimalCategories() {
      const res = await this.$store.dispatch(
        "categories/fetchMinimalCategories"
      );
      this.selectedCategory = res.data.payload.categories[0];
      this.fetchSubCatgoriesForCategory();
    },
    handleSelectCategory(category) {
      this.selectedCategory = category;
      this.fetchSubCatgoriesForCategory();
    },
    handleSelectSubcategory(subCategory) {
      this.selectedSubCategory = subCategory;
    },
    async fetchSubCatgoriesForCategory() {
      const res = await this.$store.dispatch(
        "categories/fetchSubcategoriesForACategory",
        {
          categoryName: this.selectedCategory.name,
          minimal: true
        }
      );
      this.subCategories = res.data.payload.subCategories;

      this.selectedSubCategory = res.data.payload.subCategories.find(
        x => x.name === this.subCategoryName
      );
      this.handleSelectSubcategory(this.selectedSubCategory);
    },
    async fetchFilter() {
      const res = await this.$store.dispatch(
        "filters/fetchFiltersForASubcategory",
        {
          categoryName: this.categoryName,
          subCategoryName: this.subCategoryName
        }
      );

      this.filters = res.data.payload.filters.map(x => ({
        ...x,
        filterType: x.filterType === "MULTIPLE_SELECT"
      }));

      this.filters.forEach(x => {
        this.temporaryNewFilterNamesObj = {
          ...(this.temporaryNewFilterNamesObj || {}),
          [x.name]: ""
        };
        this.temporaryNewFilterNamesObj[x.name] = "";
      });
    },

    handleDeleteFilterOption(option, filter, ofNewRow = false) {
      if (!ofNewRow) {
        const f = this.filters.find(x => x.id === filter.id);
        this.filters.find(
          x => x.id === filter.id
        ).filterOptions = f.filterOptions.filter(y => y.name !== option.name);
      } else {
        const f = this.newFilterRow.find(x => x.id === filter.id);
        this.newFilterRow.find(
          x => x.id === filter.id
        ).filterOptions = f.filterOptions.filter(y => y.name !== option.name);
      }

      this.updatePayload.filterOptionsToDelete.push({
        filterId: option.filterId,
        id: option.id,
        name: option.name,
        subCategoryName: filter.categoryName,
        categoryName: filter.parentCategoryName
      });
    },
    async handleDeleteFilter(filter) {
      const confirm = await window.confirm(
        "Are you sure you want to delete the filter?"
      );
      if (!confirm) return;

      this.updatePayload.filtersToDelete.push({
        filterId: filter.id,
        subCategoryName: filter.categoryName,
        categoryName: filter.parentCategoryName
      });

      this.filters = this.filters.filter(f => f.id !== filter.id);
    },
    addFilterOptionValueToDropdown(
      filter,
      { filterInputName, ofNewRow = false }
    ) {
      if (!ofNewRow) {
        const filterIdx = this.filters.findIndex(x => x.id === filter.id);

        if (filterIdx < 0) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Filter option does not exist",
            type: "danger"
          });
          return;
        }

        if (
          this.filters[filterIdx].filterOptions.find(
            y => y.name === this.temporaryNewFilterNamesObj[filter.name]
          )
        ) {
          const errItem = {
            [filterInputName]: ["Filter option with that name already exists"]
          };

          this.setValidationObserverErrors(
            this.validationObserverTypes.EXISTING_DATA_OBSERVER,
            errItem
          );

          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Filter option with that name already exists",
            type: "danger"
          });
          return;
        }

        this.filters[filterIdx].filterOptions.push({
          name: this.temporaryNewFilterNamesObj[filter.name],
          filterId: filter.id
        });

        this.updatePayload.filterOptionsToAdd.push({
          name: this.temporaryNewFilterNamesObj[filter.name],
          filterId: filter.id
        });
        this.temporaryNewFilterNamesObj[filter.name] = "";
      } else {
        if (
          this.newFilterRow.filterOptions.find(
            y => y.name === this.newFilterRow.tempFilterOptionName
          )
        ) {
          const errItem = {
            [filterInputName]: ["Filter option with that name already exists"]
          };

          this.setValidationObserverErrors(
            this.validationObserverTypes.EXISTING_DATA_OBSERVER,
            errItem
          );

          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Filter option with that name already exists",
            type: "danger"
          });
          return;
        }

        this.newFilterRow.filterOptions.push({
          name: this.newFilterRow.tempFilterOptionName
        });
      }

      this.newFilterRow.tempFilterOptionName = "";
    },
    async handleConfirmNewRowAddition() {
      const isValid = await this.$refs[
        this.validationObserverTypes.EXISTING_DATA_OBSERVER
      ].validate();

      if (!isValid) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description: "Please fill in the required fields",
          type: "danger"
        });
        return;
      }
      this.filters.push(this.newFilterRow);

      const payload = {
        name: this.newFilterRow.name,
        filterOptions: this.newFilterRow.filterOptions,
        isVisibleToVisitors: this.newFilterRow.isVisibleToVisitors,
        categoryName: this.categoryName,
        subCategoryName: this.subCategoryName
      };

      this.updatePayload.filtersToAdd.push(payload);
      this.resetNewFilterObj();
    },
    resetNewFilterObj() {
      this.newFilterRow = {
        name: "",
        tempFilterOptionName: "",
        parentCategoryName: "",
        filterOptions: [],
        isVisibleToVisitors: true
      };
      requestAnimationFrame(() => {
        this.$refs[this.validationObserverTypes.EXISTING_DATA_OBSERVER].reset();
      });
    },
    setValidationObserverErrors(observerName, errItem) {
      if (!observerName) return;
      this.$refs[observerName].setErrors(errItem);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-header,
.table-header--data {
  width: 100%;

  th,
  td {
    text-align: left;
    padding: 0 8px;

    /* Name */
    &:first-child {
      width: 15%;
    }

    /* New filter option */
    &:nth-child(2) {
      width: 20%;
    }

    /* filters dropdown */
    &:nth-child(3) {
      width: 20%;
    }

    /* visibility checkbox */
    &:nth-child(4) {
      width: 15%;
    }

    /* filter type */
    &:nth-child(4) {
      width: 15%;
    }

    /* Action */
    &:nth-child(5) {
      width: 10%;
      .action-btn-icons-wrapper {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}

.table-header--data {
  tr {
    &:first-child {
      td {
        padding-top: 1rem;
      }
    }
  }
}
</style>
