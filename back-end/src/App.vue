<template>
  <component
    :is="this.$route.meta.layout || 'div'"
    :breadcrumbs="this.$route.meta.breadcrumb"
  >
    <router-view />
    <logoutModal />
  </component>
</template>
<script>
import logoutModal from "@/layouts/common/modals/logoutModal.vue";
export default {
  components: { logoutModal },
  computed: {
    user() {
      return this.$store.state.functionalities.user;
    },
  },
  watch: {
    $route(to, from) {
      if (!this.user) {
        if (!this.$route.path.includes("/log_in")) this.$router.push("/log_in");
      }
    },
  },
};
</script>
