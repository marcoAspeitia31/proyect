<template>
  <div class="branches-list">
    <!-- Tabla de sucursales -->
    <table>
      <thead>
        <tr>
          <th>Sucursal</th>
          <th>División</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!branches || branches.length === 0">
          <td colspan="5">No hay sucursales disponibles.</td>
        </tr>
        <tr v-else v-for="(branch, index) in branches" :key="branch.id || index">
          <td>{{ branch.name }}</td>
          <td>{{ branch.division }}</td>
          <td>{{ branch.address }}</td>
          <td>{{ branch.phone }}</td>
          <td>
            <button @click="editBranch(branch)" class="btn btn-sm btn-edit">Editar</button>
            <button @click="showMapModal(branch)" class="btn btn-sm btn-map">Mapa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para editar sucursales -->
    <div v-if="selectedBranch" class="modal">
      <div class="modal-content">
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
          <div class="form-group">
            <label>Teléfono:</label>
            <input v-model="selectedBranch.phone" required placeholder="Teléfono" />
          </div>
          <button type="submit" class="btn btn-save">Guardar Cambios</button>
          <button type="button" @click="closeModal">Cancelar</button>
        </form>
      </div>
    </div>

    <!-- Modal del Mapa -->
    <div v-if="isMapModalVisible" class="map-modal">
      <div class="modal-content">
        <span class="close" @click="closeMapModal">&times;</span>
        <h4>Seleccionar Ubicación en el Mapa</h4>
        <div id="map" class="map-container"></div>
        <button @click="confirmLocation" class="btn btn-primary">Confirmar Ubicación</button>
      </div>
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
      isMapModalVisible: false,
      map: null,
      marker: null,
      geocoder: new google.maps.Geocoder(), // Inicializamos el Geocoder de Google Maps
      autocomplete: null, // Para manejar el Autocomplete
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
        this.initializeAutocomplete(); // Inicializar Autocomplete cuando se edita la sucursal
      });
    },
    showMapModal(branch) {
      this.selectedBranch = Object.assign({}, branch);
      this.isMapModalVisible = true;
      this.$nextTick(() => {
        this.initializeMap();
      });
    },
    initializeAutocomplete() {
      // Inicializar el campo Autocomplete de Google Places para el input de dirección
      const input = document.getElementById('branch-address');
      if (input && !this.autocomplete) {
        this.autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode'],
        });
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
      }
    },
    handlePlaceSelect() {
      const place = this.autocomplete.getPlace();
      if (place.geometry) {
        // Actualizar la latitud, longitud y dirección cuando el usuario selecciona una opción
        const location = place.geometry.location;
        this.selectedBranch.latitude = location.lat();
        this.selectedBranch.longitude = location.lng();
        this.selectedBranch.address = place.formatted_address;

        if (this.map && this.marker) {
          this.marker.setPosition(location);
          this.map.setCenter(location);
        }
      } else {
        console.error('No se encontró una ubicación válida en Autocomplete.');
      }
    },
    initializeMap() {
      const hasCoordinates = this.selectedBranch && this.selectedBranch.latitude && this.selectedBranch.longitude;
      const mapCenter = hasCoordinates ? 
        { lat: parseFloat(this.selectedBranch.latitude), lng: parseFloat(this.selectedBranch.longitude) } :
        { lat: 19.432608, lng: -99.133209 }; // Ubicación predeterminada

      if (!this.map) {
        // Inicializar el mapa si no existe
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: mapCenter,
          zoom: 15
        });

        // Crear el marcador si no existe
        this.marker = new google.maps.Marker({
          position: mapCenter,
          map: this.map,
          draggable: true
        });

        // Eventos para arrastrar el marcador o hacer clic en el mapa
        google.maps.event.addListener(this.marker, 'dragend', this.handleMarkerPositionChange);
        google.maps.event.addListener(this.map, 'click', (event) => {
          this.marker.setPosition(event.latLng);
          this.handleMarkerPositionChange();
        });
      } else {
        // Si el mapa ya existe, solo actualizar el centro y la posición del marcador
        this.map.setCenter(mapCenter);
        this.marker.setPosition(mapCenter);
      }

      // Ajustar el mapa al contenedor
      google.maps.event.trigger(this.map, 'resize');
    },
    handleMarkerPositionChange() {
      const pos = this.marker.getPosition();
      this.selectedBranch.latitude = pos.lat();
      this.selectedBranch.longitude = pos.lng();
      this.geocodePosition(pos);
    },
    geocodePosition(pos) {
      this.geocoder.geocode({ 'location': pos }, (results, status) => {
        if (status === 'OK') {
          this.selectedBranch.address = results[0].formatted_address;
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    },
    confirmLocation() {
      this.isMapModalVisible = false;
      Swal.fire('Ubicación Confirmada', 'La ubicación ha sido actualizada en el formulario.', 'success');
    },
    closeMapModal() {
      this.isMapModalVisible = false;
    },
    closeModal() {
      this.selectedBranch = null;
      this.isMapModalVisible = false;
    },
    saveBranch() {
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
};
</script>

<style scoped>
.modal, .map-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* Asegúrate de que la modal tiene un z-index suficiente para estar encima */
}
.map-modal {
  z-index: 1060; /* Asegurarse de que la modal del mapa está encima de la modal de edición */
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
}
.map-container {
  height: 400px;
  width: 100%;
}
.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}
.btn, .btn-sm, .btn-edit, .btn-map, .btn-save, .btn-cancel {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
}
.btn-sm {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 5px;
}
.btn-edit, .btn-map {
  background-color: #007bff;
  color: white;
}
.btn-edit:hover, .btn-map:hover {
  background-color: #0056b3;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}
.btn-save {
  background-color: #28a745;
  color: white;
}
.btn-save:hover {
  background-color: #218838;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}
.btn-cancel {
  background-color: #6c757d;
  color: white;
  margin-right: 0;
}
.btn-cancel:hover {
  background-color: #5a6268;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}
</style>
