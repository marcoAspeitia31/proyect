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

              <a
                @click.prevent="$router.push({ name: 'forgot_password' })"
                class="pass-forgot"
              >
                ¿Recuperar Contraseña?
              </a>

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
import { db, ref, get } from "@/firebase"; // Importar Firebase Realtime Database
import Swal from "sweetalert2"; // Importa SweetAlert2

export default {
  title: "SK Iniciar Sesión",
  data() {
    return {
      values: {
        username: "", // Email del usuario
        password: "", // Contraseña del usuario
      },
      selected: { username: false, password: false }, // Para manejar la selección de los inputs
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
              localStorage.setItem(
                "user",
                JSON.stringify({
                  uid: user.uid,
                  email: user.email,
                  rol: userData.rol,
                  permissions: userData.permissions,
                })
              );
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
    checkAuthentication() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.$store.dispatch("functionalities/setUser", user);
        // Redirige al usuario a la página principal si ya está autenticado
        this.$router.push("/");
      }
    },
  },
  mounted() {
    console.log("El componente de inicio de sesión se montó correctamente");
    this.selected.username = this.values.username.length !== 0;
    this.selected.password = this.values.password.length !== 0;

    // Verificar si el usuario ya está logueado
    this.checkAuthentication();
  },
};
</script>

<style scoped>
/* Estilos personalizados */
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
  background-color: #4caf50;
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
