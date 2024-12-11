<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-section">
          <div class="materialContainer">
            <div class="box">
              <!-- Logo -->
              <div class="login-logo">
                <img :src="logoPath" alt="Super Kompras Logo" />
              </div>
              <!-- Título -->
              <div class="login-title">
                <h2>Iniciar Sesión</h2>
              </div>
              <!-- Input de Email -->
              <div class="input">
                <label
                  for="username"
                  :style="{
                    'line-height': selected['username'] ? '18px' : '60px',
                  }"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  v-model="values.username"
                  @blur="handleFocusOut('username')"
                  @focus.prevent="select('username')"
                />
                <span
                  class="spin"
                  :style="{ width: selected['username'] ? '100%' : '0%' }"
                ></span>
              </div>
              <!-- Input de Contraseña -->
              <div class="input">
                <label
                  for="password"
                  :style="{
                    'line-height': selected['password'] ? '18px' : '60px',
                  }"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  v-model="values.password"
                  @blur="handleFocusOut('password')"
                  @focus.prevent="select('password')"
                />
                <span
                  class="spin"
                  :style="{ width: selected['password'] ? '100%' : '0%' }"
                ></span>
              </div>
              <!-- Recuperar Contraseña -->
              <a
                @click.prevent="$router.push({ name: 'forgot_password' })"
                class="pass-forgot"
              >
                ¿Recuperar Contraseña?
              </a>
              <!-- Botón de Login -->
              <div class="button login">
                <button @click.prevent="handleLogin" type="submit">
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db, ref, get } from "@/firebase";
import Swal from "sweetalert2";
import logo from "@/assets/images/logo/favicon1.png"; // Importar el logo

export default {
  title: "SK Iniciar Sesión",
  data() {
    return {
      logoPath: logo, // Ruta del logo
      values: {
        username: "",
        password: "",
      },
      selected: { username: false, password: false },
    };
  },
  methods: {
    handleLogin() {
      const auth = getAuth();
      signInWithEmailAndPassword(
        auth,
        this.values.username,
        this.values.password
      )
        .then((userCredential) => {
          const user = userCredential.user;
          const userRef = ref(
            db,
            `/projects/superkomprasBackoffice/users/${user.uid}`
          );
          get(userRef).then((userSnapshot) => {
            if (userSnapshot.exists()) {
              const userData = userSnapshot.val();
              this.$store.dispatch("functionalities/setUser", {
                user: {
                  uid: user.uid,
                  email: user.email,
                  rol: userData.rol,
                  permissions: userData.permissions,
                },
              });
              Swal.fire({
                icon: "success",
                title: "¡Inicio de sesión exitoso!",
                text: "Bienvenido de nuevo",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push("/");
            } else {
              throw new Error("No se encontraron datos del usuario.");
            }
          });
        })
        .catch((error) => {
          console.error("Error al iniciar sesión: ", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Las credenciales son incorrectas o no existe el usuario.",
          });
        });
    },
    handleFocusOut(field) {
      this.selected[field] = this.values[field] !== "";
    },
    select(field) {
      this.selected[field] = true;
    },
  },
  mounted() {
    this.selected.username = this.values.username.length !== 0;
    this.selected.password = this.values.password.length !== 0;
  },
};
</script>

<style scoped>
/* Estilos adaptados al logo */
.login-section {
  color: #ffffff; /* Blanco */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-logo {
  text-align: center;
  margin-bottom: 20px;
}

.login-logo img {
  max-width: 150px;
}

.input {
  margin-bottom: 20px;
  position: relative;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #007bff; /* Azul claro */
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
  color: #001f3f; /* Azul oscuro */
}

label {
  font-size: 16px;
  color: #ffffff; /* Blanco */
  display: block;
  margin-bottom: 5px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ff3366; /* Rojo */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #cc0033; /* Rojo oscuro */
}

.pass-forgot {
  display: block;
  margin-top: 10px;
  color: #ffcc00; /* Amarillo */
  cursor: pointer;
}

.pass-forgot:hover {
  text-decoration: underline;
}
</style>
