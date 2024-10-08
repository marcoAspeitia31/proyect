<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-header">
          <h3>Gestión de Roles</h3>
        </div>
        <div class="card-body">
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
              <tr v-if="filteredUsers.length === 0">
                <td colspan="4">No hay usuarios disponibles.</td>
              </tr>
              <tr v-for="(user, index) in filteredUsers" :key="index">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.rol }}</td>
                <td>
                  <!-- Botón para editar el rol del usuario -->
                  <button @click="editRole(user)">Editar Rol</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, ref, onValue } from '@/firebase'; 

export default {
  data() {
    return {
      users: [],
      searchQuery: '', // Propiedad para el término de búsqueda
    };
  },
  computed: {
    filteredUsers() {
      // Filtrar los usuarios según el término de búsqueda
      return this.users.filter(user => {
        return (
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.rol.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    }
  },
  created() {
    this.fetchUsers();
  },
  methods: {
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
    editRole(user) {
      // Lógica para editar el rol del usuario
      console.log('Editar rol de:', user.name);
    }
  }
};
</script>

<style>
/* Estilos básicos para la tabla */
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

input[type="text"] {
  margin-bottom: 20px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
}
</style>
