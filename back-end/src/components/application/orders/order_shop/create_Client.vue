<template>
    <div class="card">
      <div class="card-body">
        <nav aria-label="breadcrumb" class="float-right">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Home</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="#">Pedidos</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/orders/client-directory">Directorio cliente</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">Crear Cliente</li>
          </ol>
        </nav>
  
        <!-- Campos del formulario -->
        <div class="input">
          <label for="name">Nombre</label>
          <input type="text" id="name" v-model="values.name" required />
        </div>
  
        <div class="input">
          <label for="address">Dirección</label>
          <input type="text" id="address" v-model="values.address" ref="autocomplete" required />
        </div>
  
        <div id="map" style="width: 100%; height: 400px; margin-bottom: 20px;"></div>
  
        <div class="input">
          <label for="references">Referencias</label>
          <input type="text" id="references" v-model="values.references" required />
        </div>
  
        <div class="input">
          <label for="phone">Teléfono</label>
          <input type="tel" id="phone" v-model="values.phone" required />
        </div>
  
        <div class="input">
          <label for="additionalPhone">Teléfono Adicional</label>
          <input type="tel" id="additionalPhone" v-model="values.additionalPhone" />
        </div>
  
        <div class="input">
          <label for="clubCard">Tarjeta Club</label>
          <input type="text" id="clubCard" v-model="values.clubCard" />
        </div>
  
        <!-- Botón de registro -->
        <button @click="confirmRegister" type="button" class="btn btn-primary">Registrar Cliente</button>
      </div>
    </div>
  </template>
  
  <script>
  import { db, ref, set } from '@/firebase';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        values: {
          name: "",
          address: "",
          references: "",
          phone: "",
          additionalPhone: "",
          clubCard: "",
          coordinates: { lat: null, lng: null },
          registryDate: Date.now(),
          updateDate: null,
        },
        autocomplete: null,
        map: null,
        marker: null,
      };
    },
    computed: {
      isFormValid() {
        const { name, address, phone } = this.values;
        return name && address && phone;
      },
    },
    methods: {
      async confirmRegister() {
        if (!this.isFormValid) {
          this.showAlert('error', 'Campos incompletos', 'Por favor, completa los campos obligatorios antes de registrar.');
          return;
        }
  
        const confirmation = await Swal.fire({
          title: '¿Estás seguro?',
          text: "¿Quieres registrar este cliente?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, registrar',
          cancelButtonText: 'No, cancelar',
        });
  
        if (confirmation.isConfirmed) {
          this.registerCustomer();
        }
      },
  
      async registerCustomer() {
        try {
          const customerId = Date.now().toString(); // Generar un ID único
  
          await set(ref(db, `/projects/superkomprasBackoffice/customer/${customerId}`), {
            name: this.values.name,
            address: this.values.address,
            references: this.values.references,
            phone: this.values.phone,
            additionalPhone: this.values.additionalPhone,
            clubCard: this.values.clubCard,
            coordinates: this.values.coordinates,
            registryDate: this.values.registryDate,
            updateDate: Date.now(),
          });
  
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            showConfirmButton: false,
            timer: 1500,
          });
  
          this.resetFields();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: 'Hubo un problema al registrar el cliente. Intenta de nuevo.',
          });
        }
      },
  
      resetFields() {
        this.values = {
          name: "",
          address: "",
          references: "",
          phone: "",
          additionalPhone: "",
          clubCard: "",
          coordinates: { lat: null, lng: null },
          registryDate: Date.now(),
          updateDate: null,
        };
        if (this.marker) this.marker.setMap(null);
      },
  
      showAlert(icon, title, text) {
        Swal.fire({
          icon,
          title,
          text,
        });
      },
  
      initAutocomplete() {
        const input = this.$refs.autocomplete;
        this.autocomplete = new google.maps.places.Autocomplete(input);
        this.autocomplete.addListener('place_changed', this.onPlaceChanged);
      },
  
      onPlaceChanged() {
        const place = this.autocomplete.getPlace();
        if (place.geometry) {
          this.values.address = place.formatted_address;
          this.values.coordinates.lat = place.geometry.location.lat();
          this.values.coordinates.lng = place.geometry.location.lng();
          this.updateMapLocation();
        } else {
          this.showAlert('error', 'Ubicación inválida', 'Por favor selecciona una dirección válida.');
        }
      },
  
      initMap() {
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 19.432608, lng: -99.133209 }, // Coordenadas iniciales (CDMX)
          zoom: 15,
        });
  
        this.marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
        });
  
        this.map.addListener('click', async (event) => {
          this.values.coordinates.lat = event.latLng.lat();
          this.values.coordinates.lng = event.latLng.lng();
          await this.getAddressFromCoordinates();
          this.updateMapLocation();
        });
  
        this.marker.addListener('dragend', async () => {
          this.values.coordinates.lat = this.marker.getPosition().lat();
          this.values.coordinates.lng = this.marker.getPosition().lng();
          await this.getAddressFromCoordinates();
        });
      },
  
      updateMapLocation() {
        const { lat, lng } = this.values.coordinates;
        const position = { lat, lng };
        this.map.setCenter(position);
        this.marker.setPosition(position);
      },
  
      async getAddressFromCoordinates() {
        const geocoder = new google.maps.Geocoder();
        const { lat, lng } = this.values.coordinates;
        const response = await geocoder.geocode({ location: { lat, lng } });
  
        if (response.results && response.results.length > 0) {
          this.values.address = response.results[0].formatted_address;
        } else {
          this.showAlert('error', 'Error al obtener dirección', 'No se pudo obtener la dirección para las coordenadas seleccionadas.');
        }
      },
    },
    mounted() {
      if (window.google && window.google.maps) {
        this.initAutocomplete();
        this.initMap();
      } else {
        console.error('Google Maps API no cargada correctamente.');
      }
    },
  };
  </script>
  
  <style>
  .input {
    margin-bottom: 20px;
    position: relative;
  }
  
  select, input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  label {
    font-size: 16px;
    color: #333;
    display: block;
    margin-bottom: 5px;
  }
  
  .btn {
    margin-top: 20px;
  }
  
  #map {
    margin-top: 20px;
  }
  </style>
  