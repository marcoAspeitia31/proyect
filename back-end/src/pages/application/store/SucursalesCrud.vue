<template>
  <div class="card">
    <div class="card-body">
      <form @submit.prevent="createNewBranch" class="branch-form">
        <div class="form-group">
          <label for="branchName">Nombre de la Sucursal:</label>
          <input v-model="newBranch.name" type="text" required class="form-control" />
        </div>
        <div class="form-group">
          <label>División:</label>
          <input v-model="newBranch.division" type="text" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Dirección:</label>
          <input id="branch-address" v-model="newBranch.address" type="text" required class="form-control" placeholder="Ingresa la dirección" />
          <button type="button" @click="showMapModal" class="btn btn-primary">Seleccionar en el Mapa</button>
        </div>
        <div class="form-group latitude-longitude">
          <div class="latitude">
            <label>Latitud:</label>
            <input v-model="newBranch.latitude" type="text" required class="form-control" />
          </div>
          <div class="longitude">
            <label>Longitud:</label>
            <input v-model="newBranch.longitude" type="text" required class="form-control" />
          </div>
        </div>
        <div class="form-group">
          <label>Teléfono:</label>
          <input v-model="newBranch.phone" type="text" required class="form-control" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Crear Sucursal</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Modal del Mapa -->
    <div v-if="isMapModalVisible" class="map-modal">
      <div class="modal-content">
        <span class="close" @click="hideMapModal">&times;</span>
        <h4>Seleccionar Ubicación en el Mapa</h4>
        <div id="map" class="map-container"></div>
        <button @click="confirmLocation" class="btn btn-primary">Confirmar Ubicación</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, push, set, onValue } from 'firebase/database';
import { db } from '@/firebase';
import Swal from 'sweetalert2';

export default {
  name: 'BranchForm',
  data() {
    return {
      newBranch: {
        name: '',
        division: '',
        address: '',
        latitude: '',
        longitude: '',
        phone: ''
      },
      isMapModalVisible: false,
      map: null,
      marker: null,
      geocoder: new google.maps.Geocoder(), // Inicializamos el Geocoder
      autocomplete: null, // Para manejar Google Places Autocomplete
    };
  },
  mounted() {
    this.initializeAutocomplete(); // Inicializamos Autocomplete cuando se monta el componente
  },
  methods: {
    initializeAutocomplete() {
      const input = document.getElementById('branch-address');
      if (input && !this.autocomplete) {
        this.autocomplete = new google.maps.places.Autocomplete(input, {
          types: ['geocode']
        });
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
      }
    },
    handlePlaceSelect() {
      const place = this.autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        this.newBranch.latitude = location.lat();
        this.newBranch.longitude = location.lng();
        this.newBranch.address = place.formatted_address;

        if (this.map && this.marker) {
          this.marker.setPosition(location);
          this.map.setCenter(location);
        }
      }
    },
    showMapModal() {
      this.isMapModalVisible = true;
      this.$nextTick(() => {
        this.initializeMap();
      });
    },
    hideMapModal() {
      this.isMapModalVisible = false;
    },
    initializeMap() {
      const hasCoordinates = this.newBranch.latitude && this.newBranch.longitude;
      const mapCenter = hasCoordinates
        ? { lat: parseFloat(this.newBranch.latitude), lng: parseFloat(this.newBranch.longitude) }
        : { lat: 19.432608, lng: -99.133209 }; // Ubicación predeterminada

      if (!this.map) {
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: mapCenter,
          zoom: 15
        });

        this.marker = new google.maps.Marker({
          position: mapCenter,
          map: this.map,
          draggable: true
        });

        google.maps.event.addListener(this.marker, 'dragend', this.handleMarkerPositionChange);
        google.maps.event.addListener(this.map, 'click', (event) => {
          this.marker.setPosition(event.latLng);
          this.handleMarkerPositionChange();
        });
      } else {
        this.map.setCenter(mapCenter);
        this.marker.setPosition(mapCenter);
      }

      google.maps.event.trigger(this.map, 'resize');
    },
    handleMarkerPositionChange() {
      const pos = this.marker.getPosition();
      this.newBranch.latitude = pos.lat();
      this.newBranch.longitude = pos.lng();
      this.geocodePosition(pos);
    },
    geocodePosition(pos) {
      this.geocoder.geocode({ location: pos }, (results, status) => {
        if (status === 'OK') {
          this.newBranch.address = results[0].formatted_address;
        }
      });
    },
    confirmLocation() {
      this.isMapModalVisible = false;
    },
    createNewBranch() {
      if (!this.newBranch.name || !this.newBranch.division || !this.newBranch.address || !this.newBranch.latitude || !this.newBranch.longitude || !this.newBranch.phone) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor completa todos los campos antes de crear la sucursal.'
        });
        return;
      }

      const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
      const newBranchRef = push(branchesRef);

      set(newBranchRef, {
        name: this.newBranch.name,
        division: this.newBranch.division,
        address: this.newBranch.address,
        latitude: this.newBranch.latitude,
        longitude: this.newBranch.longitude,
        phone: this.newBranch.phone
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Sucursal creada',
          text: 'La sucursal ha sido creada exitosamente.'
        });
        this.resetForm();
        this.fetchBranches();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `No se pudo crear la sucursal: ${error.message}`
        });
      });
    },
    cancelCreate() {
      this.resetForm();
    },
    resetForm() {
      this.newBranch = { name: '', division: '', address: '', latitude: '', longitude: '', phone: '' };
      this.isMapModalVisible = false;
    },
    fetchBranches() {
      const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
      onValue(branchesRef, (snapshot) => {
        const data = snapshot.val();
        const branches = [];
        if (data) {
          for (let id in data) {
            branches.push({ ...data[id], id });
          }
        }
        this.branches = branches;
      });
    }
  }
};
</script>

<style scoped>
.map-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  width: 80%;
  max-width: 600px;
  text-align: center;
  position: relative;
}

.map-container {
  height: 400px;
  width: 100%;
}

.close {
  position:absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}

.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
}

.card-body {
  padding: 20px;
}

.form-title {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.branch-form, .branches-list {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display:block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.latitude-longitude {
  display: flex;
  gap: 20px;
}

.latitude, .longitude {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
