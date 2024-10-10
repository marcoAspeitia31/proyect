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
                  :style="[{ 'line-height': selected['username'] ? '18px' : '60px' }]"
                >
                  Email
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
                  :style="[{ 'line-height': selected['password'] ? '18px' : '60px' }]"
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db, ref, get } from '@/firebase'; // Importar Firebase Realtime Database
import Swal from "sweetalert2"; // Importa SweetAlert2

export default {
  title: "SK Iniciar Sesion",
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
    async handleLogin() {
      const auth = getAuth();
      try {
        console.log("Intentando iniciar sesión...");

        // Iniciar sesión con el método de Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.values.username,
          this.values.password
        );
        const user = userCredential.user;

        // Obtener los datos del usuario desde Firebase Realtime Database
        const userRef = ref(db, `/projects/superkomprasBackoffice/users/${user.uid}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();

          // Guardar el rol y permisos en el estado global de Vuex
          this.$store.dispatch("functionalities/setUser", {
            user: {
              uid: user.uid,
              email: user.email,
              rol: userData.rol,
              permissions: userData.permissions
            }
          });

          // Guardar en localStorage después del login exitoso
          localStorage.setItem("user", JSON.stringify({
            uid: user.uid,
            email: user.email,
            rol: userData.rol,
            permissions: userData.permissions
          }));

          // Mostrar alerta de inicio de sesión exitoso con SweetAlert
          Swal.fire({
            icon: "success",
            title: "¡Inicio de sesión exitoso!",
            text: "Bienvenido de nuevo",
            showConfirmButton: false,
            timer: 1500
          });

          // Redirigir al usuario al home después de iniciar sesión
          this.$router.push("/");
        } else {
          throw new Error("No se encontraron datos del usuario.");
        }
      } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        // Mostrar alerta de error con SweetAlert
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Las credenciales son incorrectas o no existe el usuario.",
        });
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
  mounted() {
    console.log("El componente de inicio de sesión se montó correctamente");
    // Maneja la selección inicial de los campos si ya tienen valores
    this.selected.username = this.values.username.length != 0;
    this.selected.password = this.values.password.length != 0;
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
