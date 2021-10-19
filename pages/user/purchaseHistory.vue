<template>
  <div class="w-full pt-16 bg-primary">
    <div class="w-full text-center">
      <h4 class="text-2xl font-semibold underline text-primary">
        My Purchase History
      </h4>
    </div>

    <div class="mt-16 ">
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
              Quantity
            </th>
            <th class="py-2 ">
              Price
            </th>
            <th class="py-2 ">
              Date Purchased
            </th>
          </tr>
        </thead>
      </table>

      <div class="mt-4 ">
        <!-- showing spinner while fetching -->
        <div
          v-if="isFetchingPurchaseHistory && !purchaseHistory"
          class="relative w-full h-32 mt-16"
        >
          <Spinner dark title="Fetching your purchase history" />
        </div>

        <!-- Error while fetching -->
        <div
          v-if="!isFetchingPurchaseHistory && !purchaseHistory"
          class="flex items-center justify-center w-full h-32 mt-16 "
        >
          <p class="italic ">Couldn't fetch your purchase history.</p>
        </div>

        <!-- Nothing yet purchased -->
        <div
          v-if="
            !isFetchingPurchaseHistory &&
              purchaseHistory &&
              purchaseHistory.length === 0
          "
          class="flex items-center justify-center w-full h-32 mt-16 "
        >
          <p class="italic ">You haven't purchased anything yet.</p>
        </div>

        <!-- data is available, show in a table -->
        <table
          v-if="!isFetchingPurchaseHistory && purchaseHistory"
          class="relative w-full whitespace-no-wrap border-collapse table-auto bg-primary table-striped table-header--data"
        >
          <tbody>
            <tr
              v-for="(purchaseItem, idx) in purchaseHistory"
              :key="'purchase-history-' + purchaseItem.id"
            >
              <!-- SN -->
              <td class="px-3 py-2 border-none">
                <p class="text-primary">{{ idx + 1 }}</p>
              </td>

              <!-- Product Image -->
              <td class="px-3 py-2 border-none">
                <div
                  v-if="
                    purchaseItem.product.images !== undefined &&
                      purchaseItem.product.images.length > 0
                  "
                  class="w-24 h-24 overflow-hidden rounded-lg"
                >
                  <img
                    class="object-cover w-full h-full "
                    :src="purchaseItem.product.images[0].imageUrl"
                    alt=""
                  />
                </div>

                <div v-if="purchaseItem.product.images === undefined">
                  <p class="italic">No image available for this product</p>
                </div>
              </td>

              <!-- product name -->
              <td class=" border-noneuserId">
                <p class="primary">
                  {{ purchaseItem.product.name }}
                </p>
              </td>

              <!-- quantity -->
              <td class=" border-nonefirstName">
                <p class="primary">
                  {{ purchaseItem.quantity }}
                </p>
              </td>

              <!-- price -->
              <td class=" border-nonefirstName">
                <p class="primary">
                  {{ purchaseItem.totalPrice }}
                </p>
              </td>

              <!-- purchased date -->
              <td class=" border-nonefirstName">
                <p class="primary">
                  {{ handleDateFormat(purchaseItem.createdAt) }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/Common/Spinner.vue";

import { formatDate } from "@/utils/dateFns";

export default {
  components: {
    Spinner
  },
  data() {
    return {
      isFetchingPurchaseHistory: false,
      purchaseHistory: null
    };
  },
  mounted() {
    this.fetchPurchaseHistory();
  },
  methods: {
    handleDateFormat(date) {
      return formatDate(date, "do MMMM , yyyy");
    },
    async fetchPurchaseHistory() {
      try {
        this.isFetchingPurchaseHistory = true;
        const res = await this.$store.dispatch("products/fetchPurchaseHistory");
        const { history } = res.data.payload;
        console.log(history);
        this.purchaseHistory = history;
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description:
              "Something went wrong while fetching your purchase history",
            type: "danger"
          });
        }
      } finally {
        this.isFetchingPurchaseHistory = false;
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
  }
}
</style>
