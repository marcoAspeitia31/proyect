<template>
  <div class="card">
    <div class="card-body">
      <input type="text" v-model="searchQuery" placeholder="Buscar usuario..." />
      <!-- Tabla para listar usuarios con roles -->
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Verificar si hay usuarios disponibles -->
          <tr v-if="!users || users.length === 0">
            <td colspan="4">No hay usuarios disponibles.</td>
          </tr>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.rol }}</td>
            <td class="action-cell">
              <button @click="editUser(user)" class="edit-button">Editar Rol</button>

            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Formulario de edición de rol -->
      <div v-if="selectedUser" class="edit-form">
        <h4>Editar Rol del Usuario</h4>
        <form @submit.prevent="updateUserRole">
          <div class="form-group">
            <label>Rol:</label>
            <select v-model="selectedUser.rol">
              <option value="Administrador">Administrador</option>
              <option value="Sistemas">Sistemas</option>
              <option value="Sucursal">Sucursal</option>
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
      users: [], // Lista de usuarios inicializada como un array vacío
      selectedUser: null // Usuario seleccionado para editar el rol
    };
  },
  created() {
    this.fetchUsers(); // Cargar usuarios al montar el componente
  },
  methods: {
    // Obtener todos los usuarios de Firebase
    fetchUsers() {
      const usersRef = ref(db, '/projects/superkomprasBackoffice/users');
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        this.users = []; // Asegúrate de reiniciar el array de usuarios

        if (data) {
          for (let id in data) {
            this.users.push({ ...data[id], id });
          }
        } else {
          console.log("No se encontraron usuarios en la base de datos.");
        }
      }, (error) => {
        console.error("Error al obtener los datos de Firebase:", error);
        alert('Hubo un error al cargar los usuarios.');
      });
    },
    // Seleccionar un usuario para editar su rol
    editUser(user) {
      this.selectedUser = { ...user }; // Clona el usuario seleccionado para editar su rol
    },
    // Cancelar la edición
    cancelEdit() {
      this.selectedUser = null; // Limpia el usuario seleccionado
    },
    // Actualizar el rol del usuario
    updateUserRole() {
      const userRef = ref(db, `/projects/superkomprasBackoffice/users/${this.selectedUser.id}`);
      update(userRef, {
        rol: this.selectedUser.rol
      }).then(() => {
        alert('Rol actualizado correctamente');
        this.selectedUser = null; // Limpia el usuario seleccionado
        this.fetchUsers(); // Vuelve a cargar los usuarios
      }).catch((error) => {
        console.error("Error al actualizar el rol:", error);
        alert('Hubo un error al actualizar el rol del usuario.');
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
  background-color: #007bff; /* Azul */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.edit-button:hover {
  background-color: #0056b3; /* Azul más oscuro al pasar el mouse */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-button:active {
  background-color: #003f7f; /* Azul aún más oscuro al hacer clic */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
