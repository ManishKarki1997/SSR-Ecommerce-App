<template>
  <div class="h-screen ">
    <Header />
    <div class="flex items-center justify-center h-full">
      <div class="text-center ">
        <h1 class="mb-2 text-xl text-primary" v-if="error.statusCode === 404">
          Page not found
        </h1>
        <h1 class="mb-2 text-xl text-primary" v-else>An error occurred</h1>
        <p v-if="error.message" class="mb-6 text-lg text-secondary">
          {{ error.message }}
        </p>

        <div class="flex items-center justify-center">
          <BaseButton
            class="px-6 py-2 mt-6 mr-6 text-white rounded-lg bg-btnDark"
            @click="$router.go(-1)"
            >Go Back</BaseButton
          >

          <BaseButton
            class="px-6 py-2 mt-6 text-white rounded-lg bg-btnPrimary hover:bg-btnPrimary hover:text-white"
            @click="$router.push('/')"
            >Home</BaseButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "~/components/Common/Header.vue";
import BaseButton from "@/components/UI/Button.vue";

export default {
  props: ["error"],
  components: {
    Header,
    BaseButton
  },
  layout: "error" // you can set a custom layout for the error page
};
</script>
