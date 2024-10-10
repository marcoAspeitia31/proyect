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
      // Verifica si el usuario está autenticado al cambiar la ruta
      this.verifyUserAuthentication();
    },
  },
  created() {
    // Verifica si el usuario está autenticado cuando el componente se carga
    this.verifyUserAuthentication();
  },
  methods: {
    verifyUserAuthentication() {
      // Si no hay usuario en Vuex, intenta cargarlo desde localStorage
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
          // Si no se encuentra el usuario, redirige al login
          if (!this.$route.path.includes("/log_in")) {
            this.$router.push("/log_in");
          }
        }
      }
    },
  },
};
</script>
