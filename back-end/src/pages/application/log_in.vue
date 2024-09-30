<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-section">
          <div class="materialContainer">
            <div class="box">
              <div class="login-title">
                <h2>Iniciar Sesion</h2>
              </div>
              <div class="input">
                <label
                  for="username"
                  :style="[
                    { 'line-height': selected['username'] ? '18px' : '60px' },
                  ]"
                >
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  v-model="values.username"
                  required
                  v-on:blur="handleFocusOut('username')"
                  @focus.prevent="select('username')"
                />
                <span
                  class="spin"
                  :style="[{ width: selected['username'] ? '100%' : '0%' }]"
                ></span>
              </div>

              <div class="input">
                <label
                  for="password"
                  :style="[
                    { 'line-height': selected['password'] ? '18px' : '60px' },
                  ]"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  v-model="values.password"
                  v-on:blur="handleFocusOut('password')"
                  @focus.prevent="select('password')"
                />
                <span
                  class="spin"
                  :style="[{ width: selected['password'] ? '100%' : '0%' }]"
                ></span>
              </div>

              <a
                href="javascript:void(0)"
                @click.prevent="$router.push('/forgot_password')"
                class="pass-forgot"
              >
                ¿Recuperar Contraseña?
              </a>

              <div class="button login">
                <button
                  href="javascript:void(0)"
                  @click.prevent="handleLogin"
                  type="submit"
                >
                  <span>Ingresar</span>
                  <i class="fa fa-check"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Importa Firebase Auth

export default {
  title: "SK Iniciar Sesion",
  data() {
    return {
      values: {
        username: "", // Email del usuario
        password: "", // Contraseña del usuario
      },
      selected: { username: false, password: false }, // Para manejar la selección de los inputs
      submitted: false, // Para controlar si el formulario ha sido enviado
    };
  },
  methods: {
    async handleLogin() {
      const auth = getAuth();
      try {
        // Iniciar sesión con el método de Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.values.username,
          this.values.password
        );
        const user = userCredential.user;

        alert('Inicio de sesión exitoso');
        // Guardar el usuario en localStorage para mantener la sesión
        localStorage.setItem("user", JSON.stringify(user));
        // Actualizar el estado global de la sesión en Vuex
        this.$store.dispatch("functionalities/setUser", { user: true });
        // Redirigir al usuario al home después de iniciar sesión
        this.$router.push("/");
      } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        alert('Las credenciales son incorrectas o no existe el usuario.');
      }
    },
    handleFocusOut(field) {
      // Maneja cuando el campo pierde el foco
      this.values[field] === "" && (this.selected[field] = false);
    },
    select(textbox) {
      // Maneja cuando el campo es seleccionado
      this.selected[textbox] = true;
    },
  },
  created() {
    // Verifica si el usuario ya está logueado al cargar el componente
    var user = localStorage.getItem("user") || false;
    this.$store.dispatch("functionalities/setUser", { user: user });
    if (user) {
      this.$router.push("/"); // Si el usuario ya está logueado, lo redirige al home
    }
  },
  mounted() {
    // Maneja la selección inicial de los campos si ya tienen valores
    this.values.username.length != 0
      ? (this.selected.username = true)
      : (this.selected.username = false);
    this.values.password.length != 0
      ? (this.selected.password = true)
      : (this.selected.password = false);
  },
};
</script>

<style>
/* Agrega tus estilos personalizados aquí */
.input {
  margin-bottom: 20px;
  position: relative;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

label {
  font-size: 16px;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.pass-forgot {
  display: block;
  margin-top: 10px;
  color: #007bff;
  cursor: pointer;
}

.pass-forgot:hover {
  text-decoration: underline;
}
</style>
