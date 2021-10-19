<template>
  <div>
    <div class="flex items-center justify-end mb-8">
      <BaseButton @click="handleQuestionBtnAction" text type="primary">{{
        editMode ? "Update Question" : "Ask Question"
      }}</BaseButton>
    </div>

    <div class="flex items-center justify-center w-full h-16">
      <p class="italic text-primary" v-if="product.qna.length === 0">
        No questions asked for this product.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-x-12 gap-y-20 lg:grid-cols-1">
      <div
        v-for="(question, index) in product.qna.filter(
          x => x.questionId === null
        )"
        :key="'questions-for-' + product.id + '-' + question.id"
      >
        <ProductQuestionCard
          :question="question"
          :index="index"
          :hasAnswers="answersOfProductQuestions[question.id] !== undefined"
          @handleAnswerQuestion="handleAnswerQuestion"
          @handleDeleteQuestion="handleOnClickDeleteQuestionAnswer"
        />
        <ProductQuestionCard
          v-if="answersOfProductQuestions[question.id]"
          :question="answersOfProductQuestions[question.id]"
          :index="index"
          :hasAnswers="answersOfProductQuestions[question.id] !== undefined"
          @handleQuestionUpdate="handleQuestionUpdate"
          @handleAnswerQuestion="handleAnswerQuestion"
          @handleDeleteQuestion="handleOnClickDeleteQuestionAnswer"
        />
      </div>
    </div>

    <ModalSidebar
      @closeModal="handleCloseQuestionModal"
      :is-visible="isAskQuestionModalVisible"
      :show-back-arrow="false"
      :title="headerTitle"
      size="small"
    >
      <ValidationObserver
        ref="qnaObserver"
        tag="form"
        @submit.prevent="handleQuestionAction"
        class=""
      >
        <div
          class="px-2 py-2 bg-tertiary"
          v-if="
            productQuestionActionTypes &&
              currentProductQuestionActionType ===
                productQuestionActionTypes.ANSWER
          "
        >
          <p v-if="answeringQuestionInfo" class="leading-8 ">
            {{ answeringQuestionInfo.qnaText }}
          </p>
        </div>

        <FormInput
          v-model="questionData.qnaText"
          clearable
          :input-name="isAnsweringQuestion || editMode ? 'Answer' : 'Question'"
          validation-rules="required"
          component-type="textarea"
          :max-length="300"
        />

        <BaseButton
          :isLoading="isPostingQuestion"
          :disabled="isPostingQuestion"
          htmlType="submit"
          type="primary"
          >Submit</BaseButton
        >
      </ValidationObserver>
    </ModalSidebar>

    <ConfirmModal
      :modal-options="confirmModalOptions"
      @onClickButton="handleOnClickConfirmModalButtons"
      @closeModal="handleCloseConfirmModal"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ValidationObserver } from "vee-validate";

import ProductQuestionCard from "@/components/Product/ProductQuestionCard.vue";
import ModalSidebar from "@/components/Common/ModalSidebar";
import BaseButton from "@/components/UI/Button";
import FormInput from "@/components/UI/FormInput";
import FormSelect from "@/components/UI/Select";
import ConfirmModal from "@/components/Common/ConfirmModal.vue";

import { productQuestionActionTypes } from "@/static/enums";

export default {
  props: {
    product: {
      type: Object,
      required: false
    }
  },
  components: {
    ProductQuestionCard,
    ModalSidebar,
    ValidationObserver,
    BaseButton,
    FormInput,
    FormSelect,
    ConfirmModal
  },
  data() {
    return {
      isAskQuestionModalVisible: false,
      headerTitle: "Ask a question",
      currentProductQuestionActionType: "",
      isPostingQuestion: false,
      isAnsweringQuestion: false,
      answeringQuestionInfo: null,
      editMode: false,
      productQuestionActionTypes: null,
      deleteQuestionAnswerPayload: null,
      questionData: {
        qnaText: "",
        productId: ""
      },
      confirmModalOptions: {
        isVisible: false,
        theme: "success",
        title: "Delete answer?",
        subtitle: "This process cannot be undone.",
        buttonTypesArray: [
          {
            type: "DANGER",
            text: "Delete"
          }
        ]
      }
    };
  },
  mounted() {
    this.productQuestionActionTypes = productQuestionActionTypes;
  },
  computed: {
    ...mapState("auth", ["user"]),
    answersOfProductQuestions() {
      if (!this.product) return {};
      const answers = this.product.qna.filter(x => x.questionId !== null);

      const answersObj = {};
      answers.forEach(a => {
        answersObj[a.questionId] = {
          ...a
        };
      });

      return answersObj;
    }
  },
  methods: {
    findParentQuestionOfAnswer(questionId) {
      return this.product
        ? this.product.qna.find(x => x.questionId === questionId)
        : null;
    },
    handleCloseQuestionModal() {
      this.resetQuestionData();
      this.isAskQuestionModalVisible = false;
    },
    resetQuestionData() {
      this.questionData = {
        ...this.questionData,
        qnaText: ""
      };

      this.isAnsweringQuestion = false;
      this.answeringQuestionInfo = null;
      this.headerTitle = "Ask a question";
    },
    handleQuestionBtnAction() {
      if (!this.user) {
        return this.$router.push("/login");
      }

      this.headerTitle = "Ask a question";
      this.currentProductQuestionActionType = this.productQuestionActionTypes.ASK_QUESTION;
      this.questionData = {
        qnaText: "",
        productId: this.product.id
      };

      this.isAskQuestionModalVisible = true;
    },
    async handleQuestionAction() {
      try {
        const valid = await this.$refs.qnaObserver.validate();
        if (!valid) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Please fill in the required fields",
            type: "danger"
          });
          return;
        }

        if (
          this.currentProductQuestionActionType ===
          this.productQuestionActionTypes.UPDATE_ANSWER
        ) {
          this.$emit("handleAnswerUpdate", this.questionData);
        } else if (
          this.currentProductQuestionActionType ===
          this.productQuestionActionTypes.ASK_QUESTION
        ) {
          this.$emit("handleAskQuestion", this.questionData);
        } else if (
          this.currentProductQuestionActionType ===
          this.productQuestionActionTypes.ANSWER
        ) {
          const payload = {
            qnaText: this.questionData.qnaText,
            productId: this.answeringQuestionInfo.productId,
            questionId: this.answeringQuestionInfo.id
          };

          this.$emit("handleAnswerQuestion", payload);
          this.handleCloseQuestionModal();
          this.resetQuestionData();
        }
      } catch (error) {
        if (error) {
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong.",
            type: "danger"
          });
          console.log(error);
        }
      }
    },
    handleAnswerQuestion(question) {
      this.headerTitle = "Answer the question";

      this.currentProductQuestionActionType = this.productQuestionActionTypes.ANSWER;
      this.answeringQuestionInfo = question;
      this.isAskQuestionModalVisible = true;
    },
    handleQuestionUpdate(question) {
      this.currentProductQuestionActionType = this.productQuestionActionTypes.UPDATE_ANSWER;
      this.headerTitle = "Update your answer";

      this.questionData = {
        qnaText: question.qnaText,
        productId: question.productId,
        qnaId: question.id,
        questionId: question.questionId
      };

      this.isAskQuestionModalVisible = true;
    },
    handleOnClickConfirmModalButtons(emitType) {
      if (emitType === "DANGER") {
        this.deleteQuestionAnswer();
      }
    },
    handleCloseConfirmModal() {
      this.deleteQuestionAnswerPayload = {
        questionId: "",
        answerId: ""
      };
      this.confirmModalOptions = {
        ...this.confirmModalOptions,
        isVisible: false
      };
    },
    handleOnClickDeleteQuestionAnswer(payload) {
      const payloadToSend = {
        questionId: payload.id,
        answerId:
          payload.questionId === null
            ? this.findParentQuestionOfAnswer(payload.id)?.id
            : null
      };

      this.deleteQuestionAnswerPayload = payloadToSend;
      this.confirmModalOptions = {
        isVisible: true,
        theme: "danger",
        title:
          payload.questionId !== null
            ? "Delete this answer?"
            : "Delete this Question?",
        subtitle: "This process cannot be undone",
        buttonTypesArray: [
          {
            type: "DANGER",
            text: "Delete"
          }
        ]
      };
    },
    async deleteQuestionAnswer() {
      try {
        const res = await this.$store.dispatch(
          "products/deleteQuestionAnswer",
          this.deleteQuestionAnswerPayload
        );
        this.$store.dispatch("addNotification", {
          title: "Success",
          description: res.data.message,
          type: "success"
        });

        this.product.qna = this.product.qna.filter(
          q => q.id !== this.deleteQuestionAnswerPayload.answerId
        );
        this.product.qna = this.product.qna.filter(
          q => q.id !== this.deleteQuestionAnswerPayload.questionId
        );

        this.handleCloseConfirmModal();
      } catch (error) {
        if (error) {
          console.log(error);
          this.$store.dispatch("addNotification", {
            title: "Error",
            description: "Something went wrong",
            type: "danger"
          });
        }
      }
    }
  }
};
</script>
