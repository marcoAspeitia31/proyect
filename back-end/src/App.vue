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
      return this.$store.state.functionalities?.user || null;
    },
  },
  watch: {
    $route(to, from) {
      this.verifyUserAuthentication();
    },
  },
  created() {
    this.verifyUserAuthentication();
  },
  methods: {
    verifyUserAuthentication() {
      if (!this.user) {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            this.$store.dispatch("functionalities/setUser", userData);
          } catch (error) {
            console.error("Error al parsear los datos del usuario: ", error);
            localStorage.removeItem("user");
          }
        } else {
          if (this.$route.name !== "log_in") {
            this.$router.push({ name: "log_in" });
          }
        }
      }
    },
  },
};
</script>
