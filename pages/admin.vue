<template>
  <div class="relative flex bg-primary">
    <Sidebar class="fixed top-0 left-0 w-2/12" />

    <main
      style="margin-left:16%"
      class="w-full min-h-screen px-6 pb-6 md:w-10/12"
    >
      <nuxt />
    </main>
  </div>
</template>

<script>
import Sidebar from "@/components/Admin/Sidebar";
export default {
  components: {
    Sidebar
  },
  middleware: "auth"
};
</script>
