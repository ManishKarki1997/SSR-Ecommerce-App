<template>
  <div class="min-h-screen">
    <AdminPageHeader title="Filters">
      <div class="flex items-center space-x-2">
        <BaseButton type="primary">View Filter</BaseButton>
      </div>
    </AdminPageHeader>

    <h4>View Filter</h4>
    <p>{{ $route.params.subCategory }}</p>
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
  }
};
</script>
