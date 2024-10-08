<template>
  <div class="card">
    <div class="card-body">
      <h3>Gestión de Sucursales</h3>

      <button @click="createSucursal" class="create-button">
        <vue-feather icon="plus-circle" /> Crear Sucursal
      </button>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Verificar si hay sucursales disponibles -->
          <tr v-if="!sucursales || sucursales.length === 0">
            <td colspan="4">No hay sucursales disponibles.</td>
          </tr>
          <tr v-for="(sucursal, index) in sucursales" :key="sucursal.id">
            <td>{{ sucursal.nombre }}</td>
            <td>{{ sucursal.direccion }}</td>
            <td>{{ sucursal.telefono }}</td>
            <td class="action-cell">
              <!-- Botones de acciones -->
              <button @click="editSucursal(sucursal)" class="edit-button">
                <vue-feather icon="edit-2" /> Editar
              </button>
              <button @click="deleteSucursal(sucursal.id)" class="delete-button">
                <vue-feather icon="trash" /> Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Formulario de edición de sucursal -->
      <div v-if="selectedSucursal" class="edit-form">
        <h4>Editar Sucursal</h4>
        <form @submit.prevent="updateSucursal">
          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="selectedSucursal.nombre" type="text" required />
          </div>
          <div class="form-group">
            <label>Dirección:</label>
            <input v-model="selectedSucursal.direccion" type="text" required />
          </div>
          <div class="form-group">
            <label>Teléfono:</label>
            <input v-model="selectedSucursal.telefono" type="text" required />
          </div>
          <button type="submit" class="save-button">Guardar</button>
          <button type="button" @click="cancelEdit" class="cancel-button">Cancelar</button>
        </form>
      </div>

      <!-- Formulario para crear una nueva sucursal -->
      <div v-if="isCreating" class="create-form">
        <h4>Crear Nueva Sucursal</h4>
        <form @submit.prevent="createNewSucursal">
          <div class="form-group">
            <label>Nombre:</label>
            <input v-model="newSucursal.nombre" type="text" required />
          </div>
          <div class="form-group">
            <label>Dirección:</label>
            <input v-model="newSucursal.direccion" type="text" required />
          </div>
          <div class="form-group">
            <label>Teléfono:</label>
            <input v-model="newSucursal.telefono" type="text" required />
          </div>
          <button type="submit" class="save-button">Crear</button>
          <button type="button" @click="cancelCreate" class="cancel-button">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VueFeather from 'vue-feather';

export default {
  name: 'SucursalesCrud',
  components: {
    VueFeather // Registrar el componente localmente
  },
  data() {
    return {
      selectedSucursal: null, // Sucursal seleccionada para editar
      isCreating: false, // Estado para mostrar el formulario de creación
      newSucursal: { // Datos para la nueva sucursal
        nombre: '',
        direccion: '',
        telefono: ''
      }
    };
  },
  computed: {
    ...mapGetters(['sucursales'])
  },
  created() {
    this.fetchSucursales(); // Cargar sucursales al montar el componente
    this.$store.dispatch('fetchCurrentUser'); // Asegurarse de que el usuario actual está cargado
  },
  methods: {
    ...mapActions(['fetchSucursales', 'createSucursal', 'updateSucursal', 'deleteSucursal']),
    
    // Seleccionar una sucursal para editar
    editSucursal(sucursal) {
      this.selectedSucursal = { ...sucursal }; // Clonar la sucursal seleccionada
    },
    
    // Cancelar la edición
    cancelEdit() {
      this.selectedSucursal = null; // Limpiar la sucursal seleccionada
    },
    
    // Actualizar la sucursal
    updateSucursal() {
      if (!this.selectedSucursal.nombre || !this.selectedSucursal.direccion || !this.selectedSucursal.telefono) {
        alert('Por favor, completa todos los campos.');
        return;
      }
      this.$store.dispatch('updateSucursal', this.selectedSucursal);
      this.selectedSucursal = null; // Limpiar la sucursal seleccionada
    },
    
    // Eliminar una sucursal
    deleteSucursal(sucursalId) {
      if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
        this.$store.dispatch('deleteSucursal', sucursalId);
      }
    },
    
    // Mostrar el formulario para crear una nueva sucursal
    createSucursal() {
      this.isCreating = true;
    },
    
    // Cancelar la creación
    cancelCreate() {
      this.isCreating = false;
      this.newSucursal = { nombre: '', direccion: '', telefono: '' };
    },
    
    // Crear una nueva sucursal
    createNewSucursal() {
      if (!this.newSucursal.nombre || !this.newSucursal.direccion || !this.newSucursal.telefono) {
        alert('Por favor, completa todos los campos.');
        return;
      }
      this.$store.dispatch('createSucursal', this.newSucursal);
      this.cancelCreate(); // Limpiar el formulario de creación
    }
  }
};
</script>

<style scoped>
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

/* Botones */
.edit-button, .delete-button, .create-button {
  display: inline-flex;
  align-items: center;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 5px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.edit-button {
  background-color: #007bff; /* Azul */
}
.edit-button:hover {
  background-color: #0056b3; /* Azul más oscuro */
}

.delete-button {
  background-color: #dc3545; /* Rojo */
}
.delete-button:hover {
  background-color: #c82333; /* Rojo más oscuro */
}

.create-button {
  background-color: #28a745; /* Verde */
}
.create-button:hover {
  background-color: #218838; /* Verde más oscuro */
}

/* Formularios de edición y creación */
.edit-form, .create-form {
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
  background-color: #4caf50; /* Verde */
  color: white;
}
.save-button:hover {
  background-color: #45a049; /* Verde más oscuro */
}

.cancel-button {
  background-color: #f44336; /* Rojo */
  color: white;
}
.cancel-button:hover {
  background-color: #d32f2f; /* Rojo más oscuro */
}
</style>