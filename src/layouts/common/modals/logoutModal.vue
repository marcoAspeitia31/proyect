<template>
  <div
    class="modal fade"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <h5 class="modal-title" id="staticBackdropLabel">Cerrar Sesion</h5>
          <p>¿Estás segur@ de que quieres cerrar sesión?</p>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>

          <div class="button-box">
            <button type="button" class="btn btn--no" data-bs-dismiss="modal">
              No
            </button>
            <button
              type="button"
              @click="handleLogout"
              data-bs-dismiss="modal"
              class="btn btn--yes btn-primary"
            >
              Si
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleLogout() {
      console.log("comming to logout");
      this.$store.dispatch("functionalities/logoutUser");
      this.$router.push("/log_in");
    },
  },
};
</script>

<style></style>
