<template>
  <div class="card">
    <div class="card-body">
      <h3>Lista de Usuarios</h3>
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
              <!-- Botón de Editar con icono -->
              <button @click="editUser(user)" class="edit-button">
                ✏️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Formulario de edición de usuario -->
      <div v-if="selectedUser" class="edit-form">
        <h4>Editar Usuario</h4>
        <form @submit.prevent="updateUser">
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
              <option v-for="(storeName, storeCode) in stores" :key="storeCode" :value="storeCode">
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
          <button type="submit" class="save-button">Guardar</button>
          <button type="button" @click="cancelEdit" class="cancel-button">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { db, ref, onValue, update } from '@/firebase';

export default {
  data() {
    return {
      users: [], // Lista de usuarios
      stores: {
        "7104": "SK LAS MARINAS",
        "7105": "SK LERMA",
        "7120": "SK TOLLOCAN",
        "7121": "SK PINO SUAREZ",
        "7122": "SK TENANCINGO",
        "7125": "SK SAN BUENA VENTURA",
        "7126": "SK CENTRO",
        "7127": "SK LA ASUNCION",
        "7128": "SK SANTIAGO TIANGUISTENCO",
        "7129": "SK ATLACOMULCO",
        "7130": "SK ZITACUARO",
        "7150": "SK IXTLAHUACA",
        "7305": "SKM ZITACUARO",
        "7306": "SKM VALLE DE BRAVO AV TOLUCA",
        "7308": "SKM SAN PEDRO",
        "7309": "SKM SAN MATEO",
        "7310": "SKM LAS PARTIDAS",
        "7319": "SKM LEANDRO VALLE",
        "7323": "SKM FIDEL VELAZQUEZ",
        "7324": "SKM VALLE DE BRAVO",
        "7331": "SKM XONACATLAN",
        "7332": "SKM ALAMEDA",
        "7333": "SKM GALERIAS",
        "7334": "SKM METEPEC",
        "7335": "SKM LERDO",
        "7337": "SKM XINANTECATL",
        "7338": "SKM SEMINARIO",
        "7339": "SKM ATLACOMULCO",
        "7344": "SKM SANTIAGO MILTEPEC",
        "7346": "SKM TENANGO",
        "7347": "SKM IXTLAHUACA",
      }, // Mapa de sucursales
      selectedUser: null // Usuario seleccionado para editar
    };
  },
  created() {
    this.fetchUsers(); // Llama a fetchUsers al crear el componente
  },
  methods: {
    // Obtener todos los usuarios de Firebase
    fetchUsers() {
      const usersRef = ref(db, '/projects/superkomprasBackoffice/users');
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        this.users = [];

        if (data) {
          for (let id in data) {
            this.users.push({ ...data[id], id });
          }
        }
      }, (error) => {
        console.error("Error al obtener los datos de Firebase:", error);
        alert('Hubo un error al cargar los usuarios.');
      });
    },
    // Obtener el nombre de la sucursal
    getStoreName(code) {
      return this.stores[code] || code;
    },
    // Seleccionar un usuario para editar
    editUser(user) {
      this.selectedUser = { ...user }; // Clona el usuario seleccionado para evitar mutaciones no deseadas
    },
    // Cancelar la edición
    cancelEdit() {
      this.selectedUser = null; // Limpia el usuario seleccionado
    },
    // Actualizar los datos del usuario
    updateUser() {
      const userRef = ref(db, `/projects/superkomprasBackoffice/users/${this.selectedUser.id}`);
      update(userRef, {
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        rol: this.selectedUser.rol,
        defaultStore: this.selectedUser.defaultStore,
        status: this.selectedUser.status
      }).then(() => {
        alert('Usuario actualizado correctamente');
        this.selectedUser = null; // Limpia el usuario seleccionado
        this.fetchUsers(); // Vuelve a cargar los usuarios
      }).catch((error) => {
        console.error("Error al actualizar el usuario:", error);
        alert('Hubo un error al actualizar el usuario.');
      });
    }
  }
};
</script>

<style>
/* Estilos generales */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}
th {
  background-color: #f0f0f0;
}
td {
  font-size: 14px;
}
.action-cell {
  text-align: center;
}
.edit-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* Estilos del formulario de edición */
.edit-form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fafafa;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.save-button, .cancel-button {
  padding: 8px 12px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
  border-radius: 3px;
}
.save-button {
  background-color: #4caf50;
  color: white;
}
.cancel-button {
  background-color: #f44336;
  color: white;
}
</style>
