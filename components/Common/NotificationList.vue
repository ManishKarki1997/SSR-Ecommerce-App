<template>
  <div
    v-if="notifications.length > 0"
    class="w-11/12 mx-auto notification-list-wrapper md:w-4/12 md:ml-auto"
  >
    <transition-group class="notification-list" tag="div" name="slide-in">
      <Notification
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        class="mb-4"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Notification from "./Notification";

export default {
  components: {
    Notification
  },
  computed: {
    ...mapState(["notifications"])
  }
};
</script>

<style lang="scss" scoped>
.slide-in-leave-active,
.slide-in-enter-active {
  transition: 0.3s;
}
.slide-in-enter {
  transform: translate(100%, 0);
}
.slide-in-leave-to {
  transform: translate(100%, 0);
}
.notification-list-wrapper {
  /* width: 30vw; */
  height: 30vh;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  /* @media (max-width: 360px) {
    width: 100%;
    bottom: 0;
  } */

  .notification-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
  }
}
</style>
