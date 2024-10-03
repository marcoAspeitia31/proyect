<template>
  <div class="card">
    <div class="card-body">

      <div class="input">
        <label for="name">Nombre</label>
        <input type="text" id="name" v-model="values.name" required />
      </div>

      <div class="input">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="values.email" required />
      </div>

      <div class="input">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="values.password" required />
      </div>

      <div class="input">
        <label for="confirmPassword">Confirma Contraseña</label>
        <input type="password" id="confirmPassword" v-model="values.confirmPassword" required />
      </div>

      <div class="input">
        <label for="role">Selecciona un rol</label>
        <select name="role" id="role" v-model="values.role" @focus="select('role')" @blur="handleFocusOut('role')">
          <option value="" disabled selected>Selecciona un rol</option>
          <option value="Administrador">Administrador</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Sucursal">Sucursal</option>
        </select>
      </div>

      <!-- Selector de Sucursales -->
      <div class="input">
        <label for="defaultStore">Selecciona una sucursal</label>
        <select name="defaultStore" id="defaultStore" v-model="values.defaultStore" required>
          <option value="" disabled selected>Selecciona una sucursal</option>
          <option value="7104">SK LAS MARINAS</option>
          <option value="7105">SK LERMA</option>
          <option value="7120">SK TOLLOCAN</option>
          <option value="7121">SK PINO SUAREZ</option>
          <option value="7122">SK TENANCINGO</option>
          <option value="7125">SK SAN BUENA VENTURA</option>
          <option value="7126">SK CENTRO</option>
          <option value="7127">SK LA ASUNCION</option>
          <option value="7128">SK SANTIAGO TIANGUISTENCO</option>
          <option value="7129">SK ATLACOMULCO</option>
          <option value="7130">SK ZITACUARO</option>
          <option value="7150">SK IXTLAHUACA</option>
          <option value="7305">SKM ZITACUARO</option>
          <option value="7306">SKM VALLE DE BRAVO AV TOLUCA</option>
          <option value="7308">SKM SAN PEDRO</option>
          <option value="7309">SKM SAN MATEO</option>
          <option value="7310">SKM LAS PARTIDAS</option>
          <option value="7319">SKM LEANDRO VALLE</option>
          <option value="7323">SKM FIDEL VELAZQUEZ</option>
          <option value="7324">SKM VALLE DE BRAVO</option>
          <option value="7331">SKM XONACATLAN</option>
          <option value="7332">SKM ALAMEDA</option>
          <option value="7333">SKM GALERIAS</option>
          <option value="7334">SKM METEPEC</option>
          <option value="7335">SKM LERDO</option>
          <option value="7337">SKM XINANTECATL</option>
          <option value="7338">SKM SEMINARIO</option>
          <option value="7339">SKM ATLACOMULCO</option>
          <option value="7344">SKM SANTIAGO MILTEPEC</option>
          <option value="7346">SKM TENANGO</option>
          <option value="7347">SKM IXTLAHUACA</option>
        </select>
      </div>

      <!-- El campo de estatus está fijo en "activo", así que no se necesita en el formulario -->
      <input type="hidden" v-model="values.status" value="activo" />

      <!-- Botón de registro -->
      <button @click="registerUser" class="btn btn-primary">Registrar Usuario</button>
    </div>
  </div>
</template>

<script>
import { db, ref, set } from '@/firebase'; // Verifica que esta ruta sea correcta
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      values: {
        name: "",
        role: "",
        defaultStore: "",
        status: "activo",
        email: "",
        password: "",
        confirmPassword: ""
      },
      selected: {
        role: false
      }
    };
  },
  methods: {
    select(field) {
      this.selected[field] = true;
    },
    handleFocusOut(field) {
      this.values[field] === "" && (this.selected[field] = false);
    },
    async registerUser() {
      const { email, password, confirmPassword, role, name, defaultStore } = this.values;

      // Verificar que las contraseñas coincidan
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }

      try {
        // Crear usuario en Firebase Authentication
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar datos del usuario en Realtime Database
        await set(ref(db, `users/${user.uid}`), {
          name, // Guardar el nombre
          role,
          defaultStore, // Guardar la sucursal seleccionada
          status: "activo", // Guardar estatus como "activo"
          email
        });

        // Restablecer campos
        this.resetFields();
        alert('Usuario registrado exitosamente!');
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert(this.getErrorMessage(error.code));
      }
    },
    resetFields() {
      this.values.name = "";
      this.values.role = "";
      this.values.defaultStore = "";
      this.values.password = "";
      this.values.confirmPassword = "";
    },
    getErrorMessage(errorCode) {
      switch (errorCode) {
        case 'auth/email-already-in-use':
          return 'Este correo electrónico ya está en uso.';
        case 'auth/invalid-email':
          return 'El formato del correo electrónico es inválido.';
        case 'auth/operation-not-allowed':
          return 'La operación no está permitida.';
        case 'auth/weak-password':
          return 'La contraseña es demasiado débil.';
        default:
          return 'Error al registrar usuario. Por favor, intenta de nuevo.';
      }
    }
  },
};
</script>

<style>
.input {
  margin-bottom: 20px;
  position: relative;
}

select,
input {
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

.btn {
  margin-top: 20px;
}
</style>
