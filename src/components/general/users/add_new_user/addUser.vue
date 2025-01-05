<template>
  <div class="card">
    <div class="card-body">
      <nav aria-label="breadcrumb" class="float-right">
      <ol class="breadcrumb">
      <li class="breadcrumb-item">
      <router-link to="/">Home</router-link>
      </li>
      <li class="breadcrumb-item">
      <router-link to="#">Usuario</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">Nuevo Usuario</li>
  </ol>
</nav>

      <!-- Campo para el nombre -->
      <div class="input">
        <label for="name">Nombre</label>
        <input type="text" id="name" v-model="values.name" required />
      </div>

      <!-- Campo para el email -->
      <div class="input">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="values.email" required />
      </div>

      <!-- Campo para la contraseña -->
      <div class="input">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="values.password" required />
      </div>

      <!-- Campo para confirmar la contraseña -->
      <div class="input">
        <label for="confirmPassword">Confirma Contraseña</label>
        <input type="password" id="confirmPassword" v-model="values.confirmPassword" required />
      </div>

      <!-- Selector de roles -->
      <div class="input">
        <label for="rol">Selecciona un rol</label>
        <select name="rol" id="rol" v-model="values.rol">
          <option value="" disabled selected>Selecciona un rol</option>
          <option value="Administrador">Administrador</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Sucursal">Sucursal</option>
        </select>
      </div>

      <!-- Selector de sucursales -->
      <div class="input">
        <label for="defaultStore">Selecciona una sucursal</label>
        <select name="defaultStore" id="defaultStore" v-model="values.defaultStore" required>
          <option value="" disabled selected>Selecciona una sucursal</option>
          <!-- Lista de sucursales -->
          <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
        </select>
      </div>

      <!-- Campo oculto para el estatus -->
      <input type="hidden" v-model="values.status" value="activo" />

      <!-- Botón de registro -->
      <button @click="confirmRegister" type="button" class="btn btn-primary">Registrar Usuario</button>
    </div>
  </div>
</template>

<script>
import { db, ref, set } from '@/firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import bcrypt from 'bcryptjs';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      values: {
        name: "",
        rol: "",
        defaultStore: "",
        status: "activo",
        email: "",
        password: "",
        confirmPassword: ""
      },
      stores: [
        { id: "7104", name: "SK LAS MARINAS" },
        { id: "7105", name: "SK LERMA" },
        { id: "7120", name: "SK TOLLOCAN" },
        { id: "7121", name: "SK PINO SUAREZ" },
        { id: "7122", name: "SK TENANCINGO" },
        { id: "7125", name: "SK SAN BUENA VENTURA" },
        { id: "7126", name: "SK CENTRO" },
        { id: "7127", name: "SK LA ASUNCION" },
        { id: "7128", name: "SK SANTIAGO TIANGUISTENCO" },
        { id: "7129", name: "SK ATLACOMULCO" },
        { id: "7130", name: "SK ZITACUARO" },
        { id: "7150", name: "SK IXTLAHUACA" },
        { id: "7305", name: "SKM ZITACUARO" },
        { id: "7306", name: "SKM VALLE DE BRAVO AV TOLUCA" },
        { id: "7308", name: "SKM SAN PEDRO" },
        { id: "7309", name: "SKM SAN MATEO" },
        { id: "7310", name: "SKM LAS PARTIDAS" },
        { id: "7319", name: "SKM LEANDRO VALLE" },
        { id: "7323", name: "SKM FIDEL VELAZQUEZ" },
        { id: "7324", name: "SKM VALLE DE BRAVO" },
        { id: "7331", name: "SKM XONACATLAN" },
        { id: "7332", name: "SKM ALAMEDA" },
        { id: "7333", name: "SKM GALERIAS" },
        { id: "7334", name: "SKM METEPEC" },
        { id: "7335", name: "SKM LERDO" },
        { id: "7337", name: "SKM XINANTECATL" },
        { id: "7338", name: "SKM SEMINARIO" },
        { id: "7339", name: "SKM ATLACOMULCO" },
        { id: "7344", name: "SKM SANTIAGO MILTEPEC" },
        { id: "7346", name: "SKM TENANGO" },
        { id: "7347", name: "SKM IXTLAHUACA" }
      ]
    };
  },
  computed: {
    isFormValid() {
      const { name, email, password, confirmPassword, rol, defaultStore } = this.values;
      return name && email && password && confirmPassword && rol && defaultStore;
    },
    arePasswordsMatching() {
      return this.values.password === this.values.confirmPassword;
    }
  },
  methods: {
    async confirmRegister() {
      if (!this.isFormValid) {
        this.showAlert('error', 'Campos incompletos', 'Por favor, completa todos los campos antes de registrar.');
        return;
      }

      if (!this.arePasswordsMatching) {
        this.showAlert('error', 'Error', 'Las contraseñas no coinciden.');
        return;
      }

      const confirmation = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres registrar este usuario?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'No, cancelar',
      });

      if (confirmation.isConfirmed) {
        this.registerUser();
      }
    },

    async registerUser() {
      try {
        const { email, password } = this.values;
        const hashedPassword = await bcrypt.hash(password, 10);
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(db, `/projects/superkomprasBackoffice/users/${user.uid}`), {
          name: this.values.name,
          rol: this.values.rol,
          defaultStore: this.values.defaultStore,
          status: "Activo",
          email,
          hashedPassword
        });

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          showConfirmButton: false,
          timer: 1500
        });

        this.resetFields();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: this.getErrorMessage(error.code)
        });
      }
    },

    resetFields() {
      this.values = {
        name: "",
        rol: "",
        defaultStore: "",
        email: "",
        password: "",
        confirmPassword: "",
        status: "activo"
      };
    },

    getErrorMessage(errorCode) {
      switch (errorCode) {
        case 'auth/email-already-in-use': return 'Este correo electrónico ya está en uso.';
        case 'auth/invalid-email': return 'El formato del correo electrónico es inválido.';
        case 'auth/operation-not-allowed': return 'La operación no está permitida.';
        case 'auth/weak-password': return 'La contraseña es demasiado débil.';
        default: return 'Error al registrar usuario. Por favor, intenta de nuevo.';
      }
    }
  }
};
</script>

<style>
.input {
  margin-bottom: 20px;
  position: relative;
}

select, input {
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
