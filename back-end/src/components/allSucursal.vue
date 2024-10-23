<template>
  <div class="branches-list">
    <nav aria-label="breadcrumb" class="float-right">
      <ol class="breadcrumb">
      <li class="breadcrumb-item">
      <router-link to="/">Home</router-link>
      </li>
      <li class="breadcrumb-item">
      <router-link to="#">Gestion de Sucursales</router-link>
      </li>
      <li class="breadcrumb-item active" aria-current="page">Total de sucursales</li>
  </ol>
</nav>
    <!-- Tabla de sucursales -->
    <table>
      <thead>
        <tr>
          <th>Sucursal</th>
          <th>División</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!branches || branches.length === 0">
          <td colspan="6">No hay sucursales disponibles.</td>
        </tr>
        <tr v-else v-for="(branch, index) in branches" :key="branch.id || index">
          <td>{{ branch.name }}</td>
          <td>{{ branch.division }}</td>
          <td>{{ branch.address }}</td>
          <td>{{ branch.phone }}</td>
          <td>
            <label class="switch">
              <input type="checkbox" :checked="branch.status === 'activo'" @change="toggleStatus(branch)">
              <span class="slider round"></span>
            </label>
          </td>
          <td>
            <button @click="editBranch(branch)" class="btn btn-sm btn-edit"><i class="fas fa-edit"></i></button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulario de edición visible en la página principal -->
    <div v-if="selectedBranch" class="edit-form">
      <form @submit.prevent="saveBranch">
        <div class="form-group">
          <label>Nombre de la Sucursal:</label>
          <input v-model="selectedBranch.name" required placeholder="Nombre de la Sucursal" />
        </div>
        <div class="form-group">
          <label>División:</label>
          <input v-model="selectedBranch.division" required placeholder="División" />
        </div>
        <div class="form-group">
          <label>Dirección:</label>
          <input id="branch-address" v-model="selectedBranch.address" required placeholder="Dirección" />
        </div>
        <!-- Mapa integrado directamente -->
        <div id="map" class="map-container"></div>
        <div class="form-group">
          <label>Teléfono:</label>
          <input v-model="selectedBranch.phone" required placeholder="Teléfono" />
        </div>
        <button type="submit" class="btn btn-save"><i class="fas fa-save"></i></button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onValue, update } from 'firebase/database';
import { db } from '@/firebase';
import Swal from 'sweetalert2';

export default {
  name: 'ListStores',
  data() {
    return {
      branches: [],
      selectedBranch: null,
      map: null,
      marker: null,
      geocoder: new google.maps.Geocoder(),
      autocomplete: null,
    };
  },
  mounted() {
    this.fetchBranches();
  },
  methods: {
    fetchBranches() {
      const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
      onValue(branchesRef, (snapshot) => {
        const branches = [];
        snapshot.forEach((childSnapshot) => {
          const branch = childSnapshot.val();
          branch.id = childSnapshot.key;
          branches.push(branch);
        });
        this.branches = branches;
      });
    },
    editBranch(branch) {
      this.selectedBranch = Object.assign({}, branch);
      this.$nextTick(() => {
        this.initializeAutocomplete();
        this.initializeMap();
      });
    },
    toggleStatus(branch) {
      branch.status = branch.status === 'activo' ? 'inactivo' : 'activo';
      const statusUpdate = { status: branch.status };
      const branchRef = ref(db, `/projects/superkomprasBackoffice/stores/${branch.id}`);
      update(branchRef, statusUpdate)
        .then(() => {
          Swal.fire('Éxito', 'Estado de la sucursal actualizado correctamente.', 'success');
        })
        .catch(error => {
          Swal.fire('Error', 'Hubo un error al actualizar el estado de la sucursal.', 'error');
          // Revertir el cambio en la interfaz si falla la actualización
          branch.status = branch.status === 'activo' ? 'inactivo' : 'activo';
        });
    },
    initializeAutocomplete() {
      const input = document.getElementById('branch-address');
      if (input) {
        if (this.autocomplete) {
          google.maps.event.clearInstanceListeners(this.autocomplete);
        }
        this.autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode'],
        });
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
      }
    },
    handlePlaceSelect() {
      const place = this.autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        if (this.selectedBranch) {
          this.selectedBranch.latitude = location.lat();
          this.selectedBranch.longitude = location.lng();
          this.selectedBranch.address = place.formatted_address;
          this.updateMap(location);
        } else {
          console.error('selectedBranch no está inicializado.');
        }
      } else {
        console.error('No se encontró una ubicación válida en Autocomplete.');
      }
    },
    updateMap(location) {
      if (this.map && this.marker) {
        this.marker.setPosition(location);
        this.map.setCenter(location);
      }
    },
    initializeMap() {
      const mapElement = document.getElementById('map');
      const hasCoordinates = this.selectedBranch && this.selectedBranch.latitude && this.selectedBranch.longitude;
      const mapCenter = hasCoordinates
        ? { lat: parseFloat(this.selectedBranch.latitude), lng: parseFloat(this.selectedBranch.longitude) }
        : { lat: 19.432608, lng: -99.133209 }; // Ubicación predeterminada

      if (this.map) {
        this.map = null;
        this.marker = null;
      }

      this.map = new google.maps.Map(mapElement, {
        center: mapCenter,
        zoom: 15,
      });

      this.marker = new google.maps.Marker({
        position: mapCenter,
        map: this.map,
        draggable: true,
      });

      google.maps.event.addListener(this.marker, 'dragend', this.handleMarkerPositionChange);
      google.maps.event.trigger(this.map, 'resize');
    },
    handleMarkerPositionChange() {
      const pos = this.marker.getPosition();
      if (this.selectedBranch) {
        this.selectedBranch.latitude = pos.lat();
        this.selectedBranch.longitude = pos.lng();
        this.geocodePosition(pos);
      }
    },
    geocodePosition(pos) {
      this.geocoder.geocode({ location: pos }, (results, status) => {
        if (status === 'OK' && results[0]) {
          this.selectedBranch.address = results[0].formatted_address;
        }
      });
    },
    saveBranch() {
      if (this.selectedBranch) {
        const branchRef = ref(db, `/projects/superkomprasBackoffice/stores/${this.selectedBranch.id}`);
        update(branchRef, this.selectedBranch)
          .then(() => {
            Swal.fire('Éxito', 'Sucursal actualizada exitosamente', 'success');
            this.closeModal();
          })
          .catch((error) => {
            Swal.fire('Error', 'Hubo un problema al actualizar la sucursal', 'error');
          });
      }
    },
    closeModal() {
      this.selectedBranch = null;
    },
  },
};
</script>

<style scoped>
/* Estilo general para la tabla */
table {
  width: 100%;
  border-collapse: collapse; /* Elimina el espacio entre las celdas */
}

th, td {
  text-align: center; /* Alineación central de texto y elementos */
  vertical-align: middle; /* Alinea verticalmente el contenido */
  padding: 10px; /* Espaciado entre contenido y borde de celda */
}

/* Estilo para el encabezado */
th {
  background-color: #f2f2f2;
  font-weight: bold;
  font-size: 16px;
}

/* Ajustar el tamaño del botón de edición */
.btn-edit {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #007bff;
  color: white;
  margin: 0 auto; /* Centra el botón dentro de la celda */
}

.btn-edit:hover {
  background-color: #0056b3;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

/* Mantener el tamaño del switch consistente */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin: 0 auto; /* Centra el switch dentro de la celda */
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Estilo para el estado "activo" e "inactivo" */
input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + .slider:before {
  color: black;
  font-size: 12px;
  line-height: 26px;
  text-align: center;
}

input[type="checkbox"]:checked + .slider:before {
  color: white;
}

/* Centra verticalmente el contenido en las celdas */
tbody tr td {
  vertical-align: middle;
}

/* Para asegurar que las filas se mantengan ordenadas en altura */
tbody tr {
  height: 60px; /* Establece una altura mínima para las filas */
  border-bottom: 1px solid #e0e0e0;
}

/* Estilo general de la tabla */
tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Alterna color de fondo para filas pares */
}
.map-container {
  width: 100%;
  height: 400px; /* Ajusta el alto según tus necesidades */
  margin-top: 20px;
}
.btn-save {
  width: 70px; /* Ajusta el ancho del botón según sea necesario */
  height: 40px; /* Ajusta la altura del botón */
  background-color: #28a745; /* Color verde */
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.btn-save:hover {
  background-color: #218838; /* Color más oscuro al pasar el cursor */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra al hacer hover */
  transform: scale(1.05); /* Ligero zoom al hacer hover */
}

.btn-save:active {
  background-color: #1e7e34; /* Color más oscuro al hacer clic */
  transform: scale(1); /* Restablece el tamaño al hacer clic */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Sombra más ligera al hacer clic */
}


</style>
