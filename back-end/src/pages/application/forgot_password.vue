<template>
  <div class="login-section">
    <div class="materialContainer">
      <div class="box">
        <div class="login-title">
          <h2>Recuperar Contraseña</h2>
        </div>
        <div class="input">
          <label
            for="emailname"
            :style="[{ 'line-height': selected['email'] ? '18px' : '60px' }]"
          >
            Ingresa tu correo electrónico
          </label>
          <input
            type="text"
            name="email"
            id="emailname"
            v-model="email"
            @focus.prevent="select('email')"
            @blur="handleFocusOut('email')"
            :class="{ 'is-invalid': !validEmail && submitted }"
          >
          <span
            class="spin"
            :style="[{ width: selected['email'] ? '100%' : '0%' }]"
          ></span>
          <div class="invalid-feedback" v-if="!validEmail && submitted">
            Por Favor Ingresa un correo válido.
          </div>
        </div>
        <div class="button login button-1">
          <button @click.prevent="handleRecoverPassword">
            <span>Enviar</span>
            <i class="fa fa-check"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default {
  title: "SK Recuperar-Contraseña",
  data() {
    return {
      email: '', // Propiedad que se enlaza con v-model
      selected: { email: false },
      validEmail: true,
      submitted: false,
    };
  },
  methods: {
    select(textbox) {
      if (textbox === "email") this.selected["email"] = true;
    },
    handleFocusOut(field) {
      if (field === 'email' && this.email === '') {
        this.selected.email = false;
      }
    },
    async handleRecoverPassword() {
      this.submitted = true;
      this.validEmail = this.validateEmail(this.email);
      if (this.validEmail) {
        try {
          const auth = getAuth();
          await sendPasswordResetEmail(auth, this.email);
          alert('Se ha enviado un correo de recuperación a tu email.');
          this.$router.push('/'); // Redirigir después de enviar
        } catch (error) {
          console.error("Error al enviar el correo de recuperación: ", error);
          alert('Hubo un error al enviar el correo de recuperación.');
        }
      }
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación simple de correo
      return re.test(email);
    },
  },
};
</script>

<style>
.invalid-feedback {
  color: red;
}
</style>
