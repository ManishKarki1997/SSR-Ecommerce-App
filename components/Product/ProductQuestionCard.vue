<template>
  <!-- data-aos="fade-up"
    data-aos-offset="200"
    :data-aos-delay="index * 50"
    data-aos-duration="700"
    data-aos-easing="ease-in-out"
    data-aos-mirror="false" -->
  <div
    :class="[
      question.questionId !== null
        ? 'md:ml-12 ml-6 border-green-500 hover:bg-transparent mt-4 border-2'
        : 'bg-transparent hover:bg-tertiary'
    ]"
    class="flex flex-col w-full px-4 py-4 rounded md:flex-row "
  >
    <!-- user icon -->
    <div class="w-full h-full mr-6 md:w-1/12">
      <img
        class="object-cover w-16 h-16 rounded-full"
        :src="question.user.avatar"
        alt=""
      />
    </div>

    <!-- review -->
    <div class="w-full mt-4 md:w-11/12 sm:mt-0 md:mt-0">
      <div class="flex flex-col lg:flex-row lg:items-center">
        <h4 class="text-lg font-semibold sm:mr-4 text-primary">
          {{ question.user.name }}
        </h4>
        <p class="text-sm text-secondary">
          {{ handleFormatDate(question.createdAt) }}
        </p>
      </div>

      <div class="w-full mt-4">
        <p class="font-normal leading-7 text-primary">
          {{ question.qnaText }}
        </p>
      </div>

      <!-- action buttons -->
      <div class="flex items-center mt-4 space-x-6">
        <button
          v-if="
            question.questionId === null &&
              !hasAnswers &&
              user &&
              user.role !== 'USER'
          "
          @click="handleClickAnswerQuestion"
          class="px-6 py-2 text-green-600 rounded-lg hover:bg-green-200"
        >
          Answer
        </button>
        <button
          v-if="question.questionId !== null && user && user.role !== 'USER'"
          @click="handleClickUpdateQuestion"
          class="px-6 py-2 text-blue-600 rounded-lg hover:bg-blue-200"
        >
          Update
        </button>
        <button
          @click="handleClickDeleteQuestion"
          class="px-6 py-2 text-red-600 rounded-lg hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formatDate } from "@/utils/dateFns";

export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    question: {
      type: Object,
      required: true
    },
    hasAnswers: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("auth", ["user"])
  },
  data() {
    return {};
  },
  methods: {
    handleFormatDate(date) {
      return formatDate(date, "do MMMM , yyyy");
    },
    handleClickUpdateQuestion() {
      this.$emit("handleQuestionUpdate", this.question);
    },
    handleClickAnswerQuestion() {
      this.$emit("handleAnswerQuestion", this.question);
    },
    handleClickDeleteQuestion() {
      this.$emit("handleDeleteQuestion", this.question);
    }
  }
};
</script>
