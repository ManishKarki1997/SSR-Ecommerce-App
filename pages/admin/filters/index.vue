<template>
  <div class="min-h-screen pb-24">
    <AdminPageHeader title="Filters">
      <div class="flex items-center space-x-2">
        <BaseButton
          type="primary"
          @click="$router.push('/admin/filters/create')"
          >Create Filter</BaseButton
        >
      </div>
    </AdminPageHeader>

    <div class=" content-wrapper">
      <div class="rounded-lg shadow bg-primary">
        <table
          class="w-full whitespace-no-wrap border-collapse table-auto bg-primary table-striped table-header"
        >
          <thead>
            <tr class="border-b border-gray-300">
              <th class="py-2 ">
                SN
              </th>
              <th class="py-2 ">
                Image
              </th>
              <th class="py-2 ">
                Subcategory Name
              </th>
              <th class="py-2 ">
                Category Name
              </th>
              <th class="py-2 ">
                Filters
              </th>
              <th class="py-2 ">
                Actions
              </th>
            </tr>
          </thead>
        </table>

        <div class="table-data-wrapper">
          <div
            v-if="isFetchingFilters"
            class="flex items-center justify-center w-full h-32 mt-16"
          >
            <Spinner dark title="Loading Filters" />
          </div>

          <div
            class="w-full h-32 mt-16 text-center"
            v-if="
              !isFetchingFilters &&
                groupedFiltersBySubCategory &&
                Object.keys(groupedFiltersBySubCategory).length === 0
            "
          >
            <p class="text-primary">No Filters Available</p>
          </div>
        </div>

        <table
          v-if="!isFetchingFilters && groupedFiltersBySubCategory"
          class="relative w-full whitespace-no-wrap border-collapse table-auto bg-primary table-striped table-header--data"
        >
          <tbody>
            <tr
              v-for="(k, idx) in Object.keys(groupedFiltersBySubCategory)"
              :key="groupedFiltersBySubCategory[k].subCategoryName"
            >
              <td class="px-3 py-2 border-none">
                <p class="text-primary">{{ idx + 1 }}</p>
              </td>

              <td class="px-3 py-2 border-none">
                <div class="w-16 h-16 overflow-hidden rounded-lg">
                  <img
                    class="object-cover w-full h-full "
                    :src="groupedFiltersBySubCategory[k].imageUrl"
                    alt=""
                  />
                </div>
              </td>

              <td class=" border-noneuserId">
                <p class="primary">
                  {{ groupedFiltersBySubCategory[k].subCategoryName }}
                </p>
              </td>
              <td class=" border-nonefirstName">
                <p class="primary">
                  {{ groupedFiltersBySubCategory[k].categoryName }}
                </p>
              </td>
              <td class=" border-nonelastName">
                <div class="flex flex-wrap items-center space-x-2">
                  <p
                    class="text-sm text-primary"
                    v-for="(f, i) in groupedFiltersBySubCategory[k].filters"
                    :key="f.subCategoryName + '-' + f.name + f.id"
                  >
                    {{
                      i === groupedFiltersBySubCategory[k].filters.length - 1
                        ? `${f.name}`
                        : `${f.name},`
                    }}
                  </p>
                </div>
              </td>
              <td class=" border-noneaction-td-data">
                <div
                  class="flex items-center space-x-4 action-btn-icons-wrapper"
                >
                  <span
                    class="cursor-pointer "
                    @click="handleEditFilter(groupedFiltersBySubCategory[k])"
                  >
                    <Icon name="edit" />
                  </span>
                  <span
                    class="cursor-pointer "
                    @click="handleDeleteFilter(groupedFiltersBySubCategory[k])"
                  >
                    <Icon name="trash" />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import Spinner from "@/components/Common/Spinner.vue";

export default {
  components: {
    Icon,
    BaseButton,
    AdminPageHeader,
    Spinner
  },
  data() {
    return {
      isFetchingFilters: false
    };
  },
  computed: {
    ...mapState("filters", ["allFilters"]),
    groupedFiltersBySubCategory() {
      if (!this.allFilters) return null;

      let groupedFilters = {};

      this.allFilters.forEach(x => {
        if (groupedFilters[x.subCategoryName] === undefined) {
          // no filter with this subCategory exists, just set it
          console.log(x);
          groupedFilters[x.subCategoryName] = {
            subCategoryName: x.subCategoryName,
            categoryName: x.categoryName,
            imageUrl: x.category?.imageUrl,
            filters: [x]
          };
        } else {
          if (
            !groupedFilters[x.subCategoryName].filters.find(
              f => f.name === x.name
            )
          ) {
            groupedFilters[x.subCategoryName] = {
              ...groupedFilters[x.subCategoryName],
              filters: [...groupedFilters[x.subCategoryName].filters, x]
            };
          }
        }
      });

      return groupedFilters;
    }
  },
  mounted() {
    // if (!this.allFilters) {
    this.fetchFilters();
    // }
  },
  methods: {
    fetchFilters() {
      this.isFetchingFilters = true;
      this.$store.dispatch("filters/fetchAllFilters");
      this.isFetchingFilters = false;
    },
    handleEditFilter(filter) {
      this.$router.push(
        `/admin/filters/edit?subCategory=${filter.subCategoryName}&category=${filter.categoryName}`
      );

      //   this.$router.push(`/admin/filters/${filter.subCategoryName}/edit`);
    },
    handleDeleteFilter(filter) {}
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

    /* sn */
    &:first-child {
      width: 5%;
    }

    /* Sub category image */
    &:nth-child(2) {
      width: 10%;
    }

    /* Sub category name */
    &:nth-child(3) {
      width: 20%;
    }

    /* category name */
    &:nth-child(4) {
      width: 20%;
    }

    /* filters */
    &:nth-child(5) {
      width: 35%;
    }

    /* filters */
    &:nth-child(6) {
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
</style>
