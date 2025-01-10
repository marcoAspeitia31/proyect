<template>
  <div class="card">
    <div class="card-body">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="float-right">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="#">Usuario</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Total de Usuarios
          </li>
        </ol>
      </nav>

      <!-- Tabla para listar usuarios -->
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Sucursal</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Verificar si hay usuarios disponibles -->
          <tr v-if="users.length === 0">
            <td colspan="6">No hay usuarios disponibles.</td>
          </tr>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.rol }}</td>
            <td>{{ getStoreName(user.defaultStore) }}</td>
            <td>{{ user.status }}</td>
            <td class="action-cell">
              <!-- Botón de Editar con confirmación SweetAlert -->
              <button @click="confirmEditUser(user)" class="edit-button">
                Editar usuario
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario de edición de usuario -->
      <div v-if="selectedUser" class="edit-form">
        <h4>Editar Usuario</h4>
        <form @submit.prevent="confirmUpdateUser">
          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="selectedUser.name" type="text" />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="selectedUser.email" type="email" />
          </div>
          <div class="form-group">
            <label>Rol:</label>
            <input v-model="selectedUser.rol" type="text" />
          </div>
          <div class="form-group">
            <label>Sucursal:</label>
            <select v-model="selectedUser.defaultStore">
              <option
                v-for="(storeName, storeCode) in stores"
                :key="storeCode"
                :value="storeCode"
              >
                {{ storeName }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Estatus:</label>
            <select v-model="selectedUser.status">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <button type="submit" class="save-button">
             Guardar
          </button>
          <button type="button" @click="cancelEdit" class="cancel-button">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { db, ref, onValue, update } from "@/firebase";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      users: [], // Lista de usuarios
      stores: {
        7104: "SK LAS MARINAS",
        7105: "SK LERMA",
        7120: "SK TOLLOCAN",
        7121: "SK PINO SUAREZ",
        7122: "SK TENANCINGO",
        7125: "SK SAN BUENA VENTURA",
        7126: "SK CENTRO",
        7127: "SK LA ASUNCION",
        7128: "SK SANTIAGO TIANGUISTENCO",
        7129: "SK ATLACOMULCO",
        7130: "SK ZITACUARO",
        7150: "SK IXTLAHUACA",
        7305: "SKM ZITACUARO",
        7306: "SKM VALLE DE BRAVO AV TOLUCA",
        7308: "SKM SAN PEDRO",
        7309: "SKM SAN MATEO",
        7310: "SKM LAS PARTIDAS",
        7319: "SKM LEANDRO VALLE",
        7323: "SKM FIDEL VELAZQUEZ",
        7324: "SKM VALLE DE BRAVO",
        7331: "SKM XONACATLAN",
        7332: "SKM ALAMEDA",
        7333: "SKM GALERIAS",
        7334: "SKM METEPEC",
        7335: "SKM LERDO",
        7337: "SKM XINANTECATL",
        7338: "SKM SEMINARIO",
        7339: "SKM ATLACOMULCO",
        7344: "SKM SANTIAGO MILTEPEC",
        7346: "SKM TENANGO",
        7347: "SKM IXTLAHUACA",
      },
      selectedUser: null, // Usuario seleccionado para editar
    };
  },
  created() {
    this.fetchUsers(); // Llama a fetchUsers al crear el componente
  },
  methods: {
    // Obtener todos los usuarios de Firebase
    fetchUsers() {
      const usersRef = ref(db, "/projects/superkomprasBackoffice/users");
      onValue(
        usersRef,
        (snapshot) => {
          const data = snapshot.val();
          this.users = [];

          if (data) {
            for (let id in data) {
              this.users.push({ ...data[id], id });
            }
          }
        },
        (error) => {
          console.error("Error al obtener los datos de Firebase:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al cargar los usuarios.",
          });
        }
      );
    },
    // Obtener el nombre de la sucursal
    getStoreName(code) {
      return this.stores[code] || code;
    },
    // Confirmar antes de seleccionar un usuario para editar
    confirmEditUser(user) {
      Swal.fire({
        title: "¿Editar Usuario?",
        text: "¿Estás seguro de que deseas editar este usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, editar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.editUser(user);
        }
      });
    },
    // Seleccionar un usuario para editar
    editUser(user) {
      this.selectedUser = { ...user }; // Clona el usuario seleccionado para evitar mutaciones no deseadas
    },
    // Cancelar la edición
    cancelEdit() {
      this.selectedUser = null; // Limpia el usuario seleccionado
    },
    // Confirmar antes de actualizar los datos del usuario
    confirmUpdateUser() {
      Swal.fire({
        title: "¿Guardar cambios?",
        text: "¿Estás seguro de que deseas guardar los cambios?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateUser();
        }
      });
    },
    // Actualizar los datos del usuario
    updateUser() {
      const userRef = ref(
        db,
        `/projects/superkomprasBackoffice/users/${this.selectedUser.id}`
      );

      update(userRef, {
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        rol: this.selectedUser.rol,
        defaultStore: this.selectedUser.defaultStore,
        status: this.selectedUser.status,
      })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Usuario actualizado correctamente",
          });
          this.selectedUser = null; // Limpia el usuario seleccionado
          this.fetchUsers(); // Vuelve a cargar los usuarios
        })
        .catch((error) => {
          console.error("Error al actualizar el usuario:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al actualizar el usuario.",
          });
        });
    },
  },
};
</script>

<style scoped>
.edit-form {
  background: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
}
.map-container {
  height: 400px;
  width: 100%;
}
.btn,
.btn-sm,
.btn-edit,
.btn-save {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease,
    transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}
.btn-edit,
.btn-save,
.btn-close {
  color: white;
}
.btn-edit {
  background-color: #007bff;
}
.btn-edit:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}
.btn-save {
  background-color: #28a745;
}
.btn-save:hover {
  background-color: #218838;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}
</style>
