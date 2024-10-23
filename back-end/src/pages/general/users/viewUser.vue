<template>
  <div class="user-details">
    <!-- Breadcrumb para navegación -->
    <nav aria-label="breadcrumb" class="float-right">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="#">Usuario</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Detalles de Usuario</li>
        </ol>
      </nav>
    <!-- Formulario para mostrar los detalles del usuario seleccionado -->
    <div class="card" v-if="selectedUser">
      <div class="card-body">
        <!-- Campo para el nombre -->
        <div class="input">
          <label for="name">Nombre:</label>
          <span>{{ selectedUser.name }}</span>
        </div>

        <!-- Campo para el email -->
        <div class="input">
          <label for="email">Email:</label>
          <span>{{ selectedUser.email }}</span>
        </div>

        <!-- Selector de roles -->
        <div class="input">
          <label for="rol">Rol:</label>
          <span>{{ selectedUser.rol }}</span>
        </div>

        <!-- Selector de sucursales -->
        <div class="input">
          <label for="defaultStore">Sucursal:</label>
          <span>{{ findStoreName(selectedUser.defaultStore) }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Selecciona un usuario para ver sus detalles.</p>
    </div>
    
    <!-- Tabla de usuarios -->
    <table class="table">
      <thead>
        <tr>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" @click="selectUser(user)">
          <td>{{ user.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db, ref, onValue } from '@/firebase';

export default {
  data() {
    return {
      users: [], // Todos los usuarios
      selectedUser: null, // Usuario seleccionado
      stores: [ // Lista de todas las sucursales
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
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      const usersRef = ref(db, '/projects/superkomprasBackoffice/users');
      onValue(usersRef, (snapshot) => {
        const usersArray = [];
        snapshot.forEach(childSnapshot => {
          const user = childSnapshot.val();
          user.id = childSnapshot.key;
          usersArray.push(user);
        });
        this.users = usersArray;
      });
    },
    selectUser(user) {
      this.selectedUser = user;
    },
    findStoreName(storeId) {
      const store = this.stores.find(s => s.id === storeId);
      return store ? store.name : 'Desconocida';
    }
  }
};
</script>


<style scoped>
/* Estilos Generales */
body {
  font-family: 'Arial', sans-serif; /* Usa una tipografía limpia y profesional */
  background-color: #f4f4f4; /* Color de fondo suave */
  color: #333; /* Color de texto oscuro para mejorar la legibilidad */
}

/* Estilos para la tabla */
.table {
  width: 100%;
  margin: 20px auto; /* Centra la tabla y añade espacio */
  border-collapse: collapse;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1); /* Sombra suave para la tabla */
}

.table th, .table td {
  padding: 12px 15px; /* Aumenta el padding para una mejor visualización */
  border-bottom: 1px solid #ddd; /* Líneas sutiles entre filas */
}

.table th {
  background-color: #f8f8f8; /* Color de fondo para encabezados */
}

.table tr:hover {
  background-color: #f0f0f0; /* Resalta filas al pasar el mouse */
}

/* Estilos para la tarjeta de detalles */
.card {
  background: #fff;
  box-shadow: 0 2px 20px rgba(0,0,0,0.05);
  border-radius: 8px; /* Bordes redondeados */
  padding: 20px;
  margin: 20px auto; /* Espacio alrededor de la tarjeta */
  max-width: 500px; /* Controla la anchura máxima de la tarjeta */
}

.input label {
  font-weight: bold; /* Texto en negrita para etiquetas */
  margin-bottom: 5px;
}

.input span {
  display: block;
  padding: 8px; /* Espacio dentro de los span */
  background: #f9f9f9; /* Fondo sutil para los campos */
  border: 1px solid #eee; /* Borde sutil para los campos */
  border-radius: 4px; /* Bordes redondeados para los campos */
}

/* Margen entre los inputs */
.input {
  margin-bottom: 15px;
}
</style>
