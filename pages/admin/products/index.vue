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
                Price
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
              <td class="py-2 border-none ">
                <p class="text-primary">{{ idx + 1 }}</p>
              </td>

              <td class="py-2 border-none ">
                <div class="w-16 h-16 overflow-hidden rounded-lg">
                  <img
                    v-if="product.images.length > 0"
                    class="object-cover w-full h-full "
                    :src="product.images[0].imageUrl"
                    alt=""
                  />
                </div>
              </td>

              <td class="border-none ">
                <p class="primary">
                  {{ product.name }}
                </p>
              </td>
              <td class="border-none ">
                <p class="primary">
                  {{ product.categoryName }}
                </p>
              </td>
              <td class="border-none ">
                <p class="text-primary">
                  {{ product.subCategoryName }}
                </p>
              </td>
              <td class="border-none ">
                <div class="flex items-center space-x-2">
                  <p
                    v-if="productDiscountAndPrice(product).discount !== 0"
                    class="text-primary"
                  >
                    {{ productDiscountAndPrice(product).discountedPrice }}
                  </p>
                  <p
                    :class="[
                      productDiscountAndPrice(product).discount === 0
                        ? 'text-primary'
                        : 'text-secondary line-through text-sm'
                    ]"
                    class=""
                  >
                    {{ productDiscountAndPrice(product).originalPrice }}
                  </p>
                  <p
                    v-if="productDiscountAndPrice(product).discount !== 0"
                    class="text-sm text-white bg-red-500"
                  >
                    -{{ productDiscountAndPrice(product).discount }}
                  </p>
                </div>
              </td>
              <td class="border-none td-data">
                <div
                  class="flex items-center space-x-4 action-btn-icons-wrapper"
                >
                  <span
                    @click="onClickUpdateDiscount(product)"
                    v-tooltip="'Update Discount'"
                    class="cursor-pointer "
                  >
                    <Icon name="coupon" />
                  </span>
                  <span
                    @click="onClickQuickEditProduct(product)"
                    v-tooltip="'Quick Edit'"
                    class="cursor-pointer "
                  >
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

    <SidebarProductModal
      :meta-info="productSidebarMetaInfo"
      :isVisible="isQuickEditProductModalActive"
      @closeModal="handleCloseQuickEditModal"
      @handleOkAction="onHandleOkAction"
    />

    <Modal
      @clickOutside="handleCloseDiscountModal"
      :is-visible="isUpdateDiscountModalActive"
    >
      <div
        class="w-10/12 px-4 py-4 rounded-lg pointer-events-auto bg-primary md:w-10/12 lg:w-8/12"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-primary">Update Discount</h3>
          <button @click="handleCloseDiscountModal">
            <Icon name="close" />
          </button>
        </div>

        <div
          v-if="selectedProductToDiscount"
          class="flex flex-col justify-between mt-8 md:flex-row"
        >
          <div class="flex space-x-2 ">
            <img
              class="w-24 h-24 rounded-lg "
              :src="selectedProductToDiscount.images[0].imageUrl"
            />

            <div class="text-right ">
              <h4 class="text-lg font-medium text-primary">
                {{ selectedProductToDiscount.name }}
              </h4>

              <p class="text-sm text-secondary">
                {{ constants.CURRENCY
                }}{{ selectedProductDiscountInfo.originalPrice }}
              </p>
              <p class="text-sm ">
                -{{ selectedProductDiscountInfo.discountedValue
                }}{{ selectedProductDiscountInfo.discountedUnit }}
              </p>
              <div style="height:1px" class="w-full bg-accent"></div>
              <p class="text-sm text-secondary">
                {{ constants.CURRENCY
                }}{{ selectedProductDiscountInfo.resultingAmount }}
              </p>
            </div>
          </div>

          <div>
            <div class="flex items-center space-x-2">
              <div>
                <p>Valid From</p>
                <vc-date-picker
                  :is-dark="false"
                  mode="dateTime"
                  class="inline-block h-full"
                  v-model="selectedProductDiscountApiPayload.validFrom"
                >
                  <template v-slot="{ inputValue, togglePopover }">
                    <div class="flex items-center">
                      <button
                        class="p-2 bg-blue-100 border border-blue-200 rounded-l text-primary hover:bg-blue-200 focus:bg-blue-500 focus:text-white focus:border-blue-500 focus:outline-none"
                        @click="togglePopover()"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          class="w-4 h-4 fill-current"
                        >
                          <path
                            d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
                          ></path>
                        </svg>
                      </button>
                      <input
                        :value="inputValue"
                        class="w-full px-2 py-1 text-gray-700 bg-white border rounded-r appearance-none focus:outline-none focus:border-blue-500"
                        readonly
                      />
                    </div>
                  </template>
                </vc-date-picker>
              </div>
              <div>
                <p>Valid Until</p>
                <vc-date-picker
                  mode="dateTime"
                  class="inline-block h-full"
                  v-model="selectedProductDiscountApiPayload.validUntil"
                >
                  <template v-slot="{ inputValue, togglePopover }">
                    <div class="flex items-center">
                      <button
                        class="p-2 text-blue-600 bg-blue-100 border border-blue-200 rounded-l hover:bg-blue-200 focus:bg-blue-500 focus:text-white focus:border-blue-500 focus:outline-none"
                        @click="togglePopover()"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          class="w-4 h-4 fill-current"
                        >
                          <path
                            d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
                          ></path>
                        </svg>
                      </button>
                      <input
                        :value="inputValue"
                        class="w-full px-2 py-1 text-gray-700 bg-white border rounded-r appearance-none focus:outline-none focus:border-blue-500"
                        readonly
                      />
                    </div>
                  </template>
                </vc-date-picker>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <FormInput
                class=""
                input-name="Discount Amount"
                type="number"
                step="0.01"
                v-model="selectedProductDiscountApiPayload.discountedValue"
              />

              <FormSelect
                :show-delete-btn="false"
                class="-mb-6"
                label="Unit"
                :initial-value="initialDiscountUnit"
                :list-items="discountUnitTypes"
                @selected="onDiscountUnitSelected"
              />
            </div>
          </div>
        </div>
        <!-- action buttons -->
        <div class="flex items-center mt-8 space-x-2">
          <BaseButton @click="updateDiscount" type="primary">
            Update Discount
          </BaseButton>

          <BaseButton
            v-if="
              selectedProductToDiscount &&
                selectedProductToDiscount.productDiscount.length > 0
            "
            @click="onClickRemoveDiscount"
            text
            type="danger"
          >
            Remove Discount
          </BaseButton>

          <BaseButton @click="handleCloseDiscountModal" text>
            Cancel
          </BaseButton>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon";
import BaseButton from "@/components/UI/Button";
import AdminPageHeader from "@/components/Common/AdminPageHeader.vue";
import Spinner from "@/components/Common/Spinner.vue";
import FormInput from "@/components/UI/FormInput.vue";
import FormSelect from "@/components/UI/Select.vue";
import Modal from "@/components/Common/Modal.vue";
import SidebarProductModal from "@/components/Admin/SidebarProductModal.vue";
import { calculateProductPriceAndDiscount } from "~/utils";
import constants from "@/utils/constants";
import { formatDate } from "@/utils/dateFns";

export default {
  components: {
    Icon,
    BaseButton,
    AdminPageHeader,
    Spinner,
    FormSelect,
    FormInput,
    SidebarProductModal,
    Modal
  },
  data() {
    if (process.client) {
      this.constants = constants;
    }
    return {
      isFetchingProducts: false,
      isQuickEditProductModalActive: false,
      isUpdateDiscountModalActive: false,
      selectedProductToQuickEdit: null,
      selectedProductToDiscount: null,
      selectedProductDiscountApiPayload: {
        removeDiscount: false,
        discountedValue: "",
        discountedUnit: ""
      },

      productSidebarMetaInfo: {
        productData: null,
        isProcessingApi: false
      },
      initialDiscountUnit: {
        value: "PERCENTAGE",
        name: "%"
      },
      discountUnitTypes: [
        {
          value: "PERCENTAGE",
          name: "%"
        },
        {
          value: "CURRENCY",
          name: "$"
        }
      ],
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
    },
    selectedProductDiscountInfo() {
      if (!this.selectedProductToDiscount) return;

      const originalPrice = this.selectedProductToDiscount.price;
      const discountedValue = this.selectedProductDiscountApiPayload
        .discountedValue;
      const discountedUnit = this.selectedProductDiscountApiPayload
        .discountedUnit;

      let resultingAmount = 0;

      if (discountedUnit === "%") {
        resultingAmount =
          originalPrice - (discountedValue / 100) * originalPrice;
      } else {
        resultingAmount = originalPrice - discountedValue;
      }

      return {
        removeDiscount: this.selectedProductDiscountApiPayload.removeDiscount,
        originalPrice,
        discountedValue,
        discountedUnit,
        resultingAmount: resultingAmount.toFixed(2)
      };
    }
  },

  methods: {
    handleFormatDate(date) {
      return formatDate(date, "yyyy/MM/dd HH:mm");
    },
    getDiscountProductPayload() {
      const date = new Date();
      date.setMinutes(date.getMinutes() - 1);
      const expiryDate = new Date(date);
      const discountId =
        this.selectedProductToDiscount.productDiscount.length > 0
          ? this.selectedProductToDiscount.productDiscount[0].id
          : null;

      const payload = {
        discountedUnit:
          this.selectedProductDiscountApiPayload.discountedUnit === "%"
            ? "PERCENTAGE"
            : "CURRENCY",
        discountedValue: this.selectedProductDiscountApiPayload.discountedValue,
        removeDiscount: this.selectedProductDiscountApiPayload.removeDiscount,
        validFrom: this.selectedProductDiscountApiPayload.validFrom,
        validUntil: this.selectedProductDiscountApiPayload.validUntil,
        expiryDate,
        discountId,
        productId: this.selectedProductToDiscount.id
      };

      return payload;
    },
    onClickRemoveDiscount() {
      if (this.selectedProductToDiscount.productDiscount.length === 0) {
        this.$store.dispatch("addNotification", {
          title: "Error",
          description: "The product does not have existing discount",
          type: "danger"
        });
        return;
      }

      this.selectedProductDiscountApiPayload.removeDiscount = false;
      this.updateDiscount();
    },
    async updateDiscount() {
      try {
        const payload = this.getDiscountProductPayload();

        const res = await this.$store.dispatch(
          "products/updateProductDiscount",
          payload
        );

        if (this.selectedProductDiscountApiPayload.removeDiscount) {
          this.products.find(
            p => p.uid === this.selectedProductToDiscount.uid
          ).productDiscount = [];
        } else {
          this.products.find(
            p => p.uid === this.selectedProductToDiscount.uid
          ).productDiscount = [res.data.payload.productDiscount];
        }
        this.selectedProductDiscountApiPayload.removeDiscount = false;
        this.selectedProductDiscountApiPayload.expiryDate = null;

        this.$store.dispatch("addNotification", {
          title: "Success",
          description: "Discount updated successfully",
          type: "success"
        });

        this.handleCloseDiscountModal();
      } catch (error) {
        if (error) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong",
            type: "danger"
          });
        }
      }
    },
    handleCloseDiscountModal() {
      this.selectedProductToDiscount = null;
      this.isUpdateDiscountModalActive = false;
    },
    onDiscountUnitSelected(unit) {
      this.initialDiscountUnit = {
        name: unit.name,
        value: unit.value
      };
      this.selectedProductDiscountApiPayload = {
        ...this.selectedProductDiscountApiPayload,
        discountedUnit: unit.name
      };
    },
    onClickUpdateDiscount(product) {
      if (product.productDiscount.length === 0) {
        this.selectedProductDiscountApiPayload = {
          discountedValue: 0,
          discountedUnit: this.initialDiscountUnit.value
        };
        this.selectedProductToDiscount = product;
        this.isUpdateDiscountModalActive = true;
        return;
      }

      this.selectedProductDiscountApiPayload = {
        validFrom: product.productDiscount[0].validFrom,
        validUntil: product.productDiscount[0].validUntil,
        discountedValue: product.productDiscount[0].discountedValue,
        discountedUnit:
          product.productDiscount[0].discountedUnit === "PERCENTAGE"
            ? "%"
            : this.constants.CURRENCY
      };

      this.initialDiscountUnit = {
        name:
          product.productDiscount[0].discountedUnit === "PERCENTAGE"
            ? "%"
            : this.constants.CURRENCY,
        value: product.productDiscount[0].discountedUnit
      };

      this.selectedProductToDiscount = product;
      this.isUpdateDiscountModalActive = true;
    },
    async onHandleOkAction(newProduct) {
      try {
        const res = await this.$store.dispatch(
          "products/quickUpdateProduct",
          newProduct
        );

        const { product } = res.data.payload;
        this.products = this.products.map(p =>
          p.uid === product.uid
            ? {
                ...newProduct,
                ...product
              }
            : p
        );
        this.handleCloseQuickEditModal();
      } catch (error) {
        if (error) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: error.response.data.message,
            type: "danger"
          });
        }
      }
    },
    onClickQuickEditProduct(product) {
      this.productSidebarMetaInfo = {
        ...this.productSidebarMetaInfo,
        productData: product
      };
      this.isQuickEditProductModalActive = true;
    },
    handleCloseQuickEditModal() {
      this.isQuickEditProductModalActive = false;
      this.selectedProductToQuickEdit = null;
    },
    productDiscountAndPrice(product) {
      return calculateProductPriceAndDiscount(product);
    },
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
      width: 25%;
    }

    /* category name */
    &:nth-child(4) {
      width: 15%;
    }

    /* sub category name */
    &:nth-child(5) {
      width: 15%;
    }

    /* price */
    &:nth-child(6) {
      width: 20%;
    }

    /* actions */
    &:nth-child(7) {
      width: 10%;

      .action-btn-icons-wrapper {
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>
