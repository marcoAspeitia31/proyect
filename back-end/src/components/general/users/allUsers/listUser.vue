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
            </tr>
          </thead>
          <tbody>
            <!-- Verificar si hay usuarios disponibles -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5">No hay usuarios disponibles.</td>
            </tr>
            <tr v-for="(user, index) in filteredUsers" :key="index">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.rol }}</td>
              <td>{{ getStoreName(user.defaultStore) }}</td>
              <td>{{ user.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { db, ref, onValue } from '@/firebase';
  
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
      };
    },
    created() {
      this.fetchUsers(); // Llama a fetchUsers al crear el componente
    },
    computed: {
      // Filtrar solo los usuarios activos
      filteredUsers() {
        return this.users.filter(user => user.status === 'activo');
      }
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
      getStoreName(code) {
        return this.stores[code] || code;
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
  </style>
  