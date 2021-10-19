<template>
  <div class="flex w-full sm:flex-row">
    <!-- user icon -->
    <div class="w-2/12 mr-6 md:mr-10 sm:w-1/12 ">
      <div class="w-16 h-16 overflow-hidden rounded-full">
        <img
          class="object-cover w-full h-full "
          :src="review.user.avatar"
          alt=""
        />
      </div>
    </div>

    <!-- review -->
    <div class="w-10/12 sm:w-11/12">
      <div class="flex flex-col sm:flex-row sm:items-center">
        <h4 class="text-lg font-semibold sm:mr-4 text-primary">
          {{ review.user.name }}
        </h4>
        <p class="text-sm text-secondary">
          {{ handleFormatDate(review.createdAt) }}
        </p>
      </div>

      <div class="flex items-center mt-2">
        <span
          class="mr-1"
          v-for="r in review.rating"
          :key="'review-star-filled' + r"
        >
          <Icon class="w-5 h-5 text-yellow-500" name="starFill" />
        </span>
        <span
          class="mr-1"
          v-for="r in 5 - review.rating"
          :key="'review-star-unfilled' + r"
        >
          <Icon class="w-5 h-5 text-yellow-500" name="star" />
        </span>
      </div>

      <div class="w-full mt-4 md:w-10/12">
        <p class="leading-7 text-primary">
          {{ review.comment }}
        </p>
      </div>

      <!-- action buttons -->
      <div class="flex items-center mt-4 space-x-6">
        <!-- <button class="px-6 py-2 text-red-600 rounded-lg hover:bg-red-200">
          Delete
        </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/UI/Icon.vue";
import { formatDate } from "@/utils/dateFns";

export default {
  components: {
    Icon
  },
  props: {
    review: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleFormatDate(date) {
      return formatDate(date, "do MMMM , yyyy");
    }
  }
};
</script>
