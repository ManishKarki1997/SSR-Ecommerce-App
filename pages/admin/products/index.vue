<template>
  <div class="w-full min-h-screen bg-primary">
    <AdminPageHeader title="Products">
      <BaseButton
        type="primary"
        @click="$router.push('/admin/products/addProduct')"
        >Add Product</BaseButton
      >
    </AdminPageHeader>

    <div class="mt-8 content-wrapper">
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
                Name
              </th>
              <th class="py-2 ">
                Category
              </th>
              <th class="py-2 ">
                SubCategory
              </th>
              <th class="py-2 ">
                Actions
              </th>
            </tr>
          </thead>
        </table>

        <div class="table-data-wrapper">
          <div
            v-if="isFetchingProducts"
            class="flex items-center justify-center w-full h-32 mt-16"
          >
            <Spinner dark title="Loading Filters" />
          </div>

          <div
            class="w-full h-32 mt-16 text-center"
            v-if="!isFetchingProducts && products && products.length === 0"
          >
            <p class="text-primary">No Products Available</p>
          </div>
        </div>

        <table
          v-if="!isFetchingProducts && products"
          class="relative w-full whitespace-no-wrap border-collapse table-auto bg-primary table-striped table-header--data"
        >
          <tbody>
            <tr v-for="(product, idx) in products" :key="product.uid">
              <td class="px-3 py-2 border-none">
                <p class="text-primary">{{ idx + 1 }}</p>
              </td>

              <td class="px-3 py-2 border-none">
                <div class="w-16 h-16 overflow-hidden rounded-lg">
                  <img
                    v-if="product.images.length > 0"
                    class="object-cover w-full h-full "
                    :src="product.images[0].imageUrl"
                    alt=""
                  />
                </div>
              </td>

              <td class=" border-noneuserId">
                <p class="primary">
                  {{ product.name }}
                </p>
              </td>
              <td class=" border-nonefirstName">
                <p class="primary">
                  {{ product.categoryName }}
                </p>
              </td>
              <td class=" border-nonelastName">
                <p class="text-primary">
                  {{ product.subCategoryName }}
                </p>
              </td>
              <td class=" border-noneaction-td-data">
                <div
                  class="flex items-center space-x-4 action-btn-icons-wrapper"
                >
                  <span v-tooltip="'Quick Edit'" class="cursor-pointer ">
                    <Icon name="pen" />
                  </span>
                  <span
                    @click="onClickEditProduct(product)"
                    v-tooltip="'Edit'"
                    class="cursor-pointer "
                  >
                    <Icon name="edit" />
                  </span>
                  <span v-tooltip="'Delete product'" class="cursor-pointer ">
                    <Icon name="trash" />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-end w-full mt-6 space-x-4">
        <BaseButton
          :disabled="paginationDetails.page === 1"
          @click="handlePaginationPrevBtn"
          type="primary"
        >
          <Icon name="arrow-left" />
        </BaseButton>
        <div class="flex items-center">
          <h4>
            <strong>{{ paginationDetails.page }}</strong>
            /
            <strong>{{ lastPageBtn }}</strong>
          </h4>
        </div>
        <BaseButton @click="handlePaginationNextBtn" type="primary">
          <Icon name="arrow-right" />
        </BaseButton>
      </div>

   
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import Spinner from "@/components/Common/Spinner.vue";
import FormSelect from "@/components/UI/Select.vue";

export default {
  components: {
    Icon,
    BaseButton,
    AdminPageHeader,
    Spinner,
    FormSelect
  },
  data() {
    return {
      isFetchingProducts: false,
      products: null,
      paginationDetails: {
        hasNext: true,
        hasPrev: false,
        take: 8,
        skip: 6,
        page: 1,
        totalProductsCount: 0
      }
    };
  },
  mounted() {
    this.fetchProducts();
  },
  computed: {
    lastPageBtn() {
      return Math.ceil(
        this.paginationDetails.totalProductsCount / this.paginationDetails.take
      );
    }
  },
  methods: {
    handlePaginationPrevBtn() {
      this.paginationDetails.page =
        this.paginationDetails.page === 1 ? 1 : this.paginationDetails.page - 1;

      this.paginationDetails.skip =
        (this.paginationDetails.page - 1) * this.paginationDetails.take;

      this.fetchProducts();
    },
    handlePaginationNextBtn() {
      this.paginationDetails.page += 1;
      this.paginationDetails.skip =
        (this.paginationDetails.page - 1) * this.paginationDetails.take;

      this.fetchProducts();
    },
    onClickEditProduct(product) {
      this.$router.push(
        `/admin/products/edit/${product.slug}?category=${product.categoryName}&subCategory=${product.subCategory}`
      );
    },
    
    async fetchProducts() {
      try {
        this.isFetchingProducts = true;
        const res = await this.$store.dispatch("products/fetchProducts", {
          take: this.paginationDetails.take,
          skip: this.paginationDetails.skip
        });
        this.products = res.data.payload.products;

        if (res.data.payload.products === 0) {
          this.paginationDetails = {
            ...this.paginationDetails,
            hasNext: false,
            hasPrev: true
          };
        }

        this.paginationDetails.totalProductsCount =
          res.data.payload.totalProductsCount;
      } catch (error) {
        if (error) {
          console.log("Something went wrong");
        }
      } finally {
        this.isFetchingProducts = false;
      }
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

    /* sn */
    &:first-child {
      width: 5%;
    }

    /*  image */
    &:nth-child(2) {
      width: 10%;
    }

    /* Product name */
    &:nth-child(3) {
      width: 30%;
    }

    /* category name */
    &:nth-child(4) {
      width: 15%;
    }

    /* sub category name */
    &:nth-child(5) {
      width: 15%;
    }

    /* actions */
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
