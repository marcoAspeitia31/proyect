<template>
  <div class="card">
    <div class="card-body">
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
        </div>
        <div id="map" class="map-container"></div>
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
  </div>
</template>



<script>
import { ref, push, set, onValue } from 'firebase/database';
import { db } from '@/firebase';
import Swal from 'sweetalert2';


export default {
  title: "SK-Sucursales",
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
      map: null,
      marker: null,
      geocoder: new google.maps.Geocoder(),
      autocomplete: null,
    };
  },
  mounted() {
    this.initializeAutocomplete();
    this.initializeMap();
  },
  methods: {
    initializeAutocomplete() {
      const input = document.getElementById('branch-address');
      if (input && !this.autocomplete) {
        this.autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
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
        this.updateMap(location);
      }
    },
    updateMap(location) {
      if (this.marker) {
        this.marker.setPosition(location);
        this.map.setCenter(location);
      }
    },
    initializeMap() {
      const mapCenter = { lat: 19.432608, lng: -99.133209 }; // Default center
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
    createNewBranch() {
  if (this.newBranch.name && this.newBranch.division && this.newBranch.address && this.newBranch.latitude && this.newBranch.longitude && this.newBranch.phone) {
    // Usa la ruta correcta para almacenar las sucursales
    const branchRef = push(ref(db, '/projects/superkomprasBackoffice/stores'));  // Cambiar 'branches' por 'stores'
    set(branchRef, this.newBranch)
      .then(() => {
        Swal.fire('Sucursal creada', 'La sucursal ha sido creada exitosamente', 'success');
        this.resetForm();  // Limpiar el formulario después de crear
      })
      .catch((error) => {
        Swal.fire('Error', 'Hubo un problema al crear la sucursal', 'error');
        console.error('Error al crear sucursal: ', error);
      });
  } else {
    Swal.fire('Formulario incompleto', 'Por favor llena todos los campos', 'warning');
  }
},
cancelCreate() {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Los cambios no guardados se perderán",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No, continuar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.resetForm();  // Limpia el formulario si se confirma
    }
  });
},
resetForm() {
  this.newBranch = {
    name: '',
    division: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: ''
  };
  if (this.marker && this.map) {
    const defaultPosition = { lat: 19.432608, lng: -99.133209 }; // Coordenadas predeterminadas
    this.marker.setPosition(defaultPosition);
    this.map.setCenter(defaultPosition);
  }
},
fetchBranches() {
  const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');  // Asegúrate de que la ruta es correcta
  onValue(branchesRef, (snapshot) => {
    const branches = [];
    snapshot.forEach((childSnapshot) => {
      const branch = childSnapshot.val();
      branches.push({ id: childSnapshot.key, ...branch });
    });
    this.branches = branches;
  }, (error) => {
    console.error('Error al obtener sucursales: ', error);
  });
}
  }
};
</script>

<style scoped>

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
  font-weight:bold;
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
  justify-content:flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 1em;
  border:none;
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
