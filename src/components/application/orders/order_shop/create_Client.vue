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
            <router-link to="/orders/client-directory"
              >Directorio cliente</router-link
            >
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Crear Cliente
          </li>
        </ol>
      </nav>
      <!-- Botón para abrir la modal -->
      <button
        v-if="!isAddressConfirmed"
        @click="openAddressModal"
        class="btn btn-secondary mb-3"
      >
        Ingresar Dirección
      </button>

      <!-- Dirección confirmada -->
      <div v-if="isAddressConfirmed">
        <div class="input">
          <label for="address">Dirección (editable)</label>
          <input type="text" id="address" v-model="values.address" required />
        </div>
        <div
          id="map-static"
          style="width: 100%; height: 300px; margin-bottom: 20px"
        ></div>
      </div>

      <!-- Campos adicionales del formulario -->
      <div class="input">
        <label for="name">Nombre</label>
        <input type="text" id="name" v-model="values.name" required />
      </div>
      <div class="input">
        <label for="references">Referencias</label>
        <input
          type="text"
          id="references"
          v-model="values.references"
          required
        />
      </div>
      <div class="input">
        <label for="phone">Teléfono</label>
        <input type="tel" id="phone" v-model="values.phone" required />
      </div>
      <div class="input">
        <label for="additionalPhone">Teléfono Adicional</label>
        <input
          type="tel"
          id="additionalPhone"
          v-model="values.additionalPhone"
        />
      </div>
      <div class="input">
        <label for="clubCard">Tarjeta Club</label>
        <input
          type="text"
          id="clubCard"
          v-model="values.clubCard"
          @input="checkClubCardLength"
        />
        <p v-if="clubCardError" class="text-danger">
          El número de tarjeta debe tener 12 o 13 caracteres.
        </p>
      </div>
      <button @click="confirmRegister" type="button" class="btn btn-primary">
        Registrar Cliente
      </button>
    </div>

    <!-- Modal para ingresar dirección -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Ingresa Dirección</h3>
        <div class="input">
          <label for="modal-address">Dirección</label>
          <input
            type="text"
            id="modal-address"
            v-model="tempAddress"
            ref="modalAutocomplete"
          />
        </div>
        <div id="modal-map" style="width: 100%; height: 400px; margin-top: 20px"></div>
        <button @click="confirmAddress" class="btn btn-success mt-3">
          Confirmar Dirección
        </button>
        <button @click="closeModal" class="btn btn-primary mt-3">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db, ref, set } from "@/firebase";
import Swal from "sweetalert2";

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
      tempAddress: "",
      isAddressConfirmed: false,
      showModal: true,
      modalMap: null,
      modalMarker: null,
      staticMap: null,
      clubCardError: false,
    };
  },
  computed: {
    isFormValid() {
      const { name, address, phone, clubCard } = this.values;
      const clubCardValid = clubCard.length === 12 || clubCard.length === 13;
      return name && address && phone && clubCardValid;
    },
  },
  methods: {
    checkClubCardLength() {
      const length = this.values.clubCard.length;
      this.clubCardError = length !== 0 && (length < 12 || length > 13);
    },
    openAddressModal() {
      this.showModal = true;
      this.initModalMap();
    },
    closeModal() {
      this.showModal = false;
    },
    confirmAddress() {
  if (!this.modalMarker || !this.modalMarker.getPosition()) {
    this.showAlert(
      "error",
      "Posición no definida",
      "Por favor, selecciona una ubicación en el mapa."
    );
    return;
  }

  const position = this.modalMarker.getPosition();
  this.values.address = this.tempAddress;
  this.values.coordinates = {
    lat: position.lat(),
    lng: position.lng(),
  };
  this.isAddressConfirmed = true;
  this.closeModal();
  this.initStaticMap(); // Muestra el mapa estático después de cerrar la modal
},

    initModalMap() {
      if (this.modalMap) return;

      this.modalMap = new google.maps.Map(
        document.getElementById("modal-map"),
        {
          center: { lat: 19.28786, lng: -99.65324 },
          zoom: 15,
        }
      );
      this.modalMarker = new google.maps.Marker({
        map: this.modalMap,
        draggable: true,
      });

      this.modalMap.addListener("click", (event) => {
        this.modalMarker.setPosition(event.latLng);
      });

      this.initModalAutocomplete();
    },
    initModalAutocomplete() {
      const input = this.$refs.modalAutocomplete;
      const autocomplete = new google.maps.places.Autocomplete(input);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          this.tempAddress = place.formatted_address;
          this.modalMap.setCenter(place.geometry.location);
          this.modalMarker.setPosition(place.geometry.location);
        } else {
          alert("Selecciona una dirección válida.");
        }
      });
    },
    initStaticMap() {
      this.$nextTick(() => {
        const mapElement = document.getElementById("map-static");
        if (!mapElement) {
          console.error(
            "El elemento está ausente, no se puede inicializar el mapa estático."
          );
          return;
        }

        this.staticMap = new google.maps.Map(mapElement, {
          center: this.values.coordinates,
          zoom: 15,
        });

        new google.maps.Marker({
          position: this.values.coordinates,
          map: this.staticMap,
        });
      });
    },
    async confirmRegister() {
      this.checkClubCardLength();
      if (!this.isFormValid || this.clubCardError) {
        this.showAlert(
          "error",
          "Campos incompletos",
          "Por favor, completa todos los campos obligatorios correctamente antes de registrar."
        );
        return;
      }
      const confirmation = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres registrar este cliente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, registrar",
        cancelButtonText: "No, cancelar",
      });
      if (confirmation.isConfirmed) {
        this.registerCustomer();
      }
    },
    async registerCustomer() {
      try {
        const customerId = Date.now().toString(); // Generar un ID único
        await set(
          ref(db, `/projects/superkomprasBackoffice/customer/${customerId}`),
          {
            ...this.values,
            updateDate: Date.now(),
          }
        );
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          showConfirmButton: false,
          timer: 1500,
        });
        this.resetFields();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: "Hubo un problema al registrar el cliente. Intenta de nuevo.",
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
      this.tempAddress = "";
      this.isAddressConfirmed = false;
      if (this.staticMap) this.staticMap = null;
    },
    showAlert(icon, title, text) {
      Swal.fire({
        icon,
        title,
        text,
      });
    },
  },
  mounted() {
    if (!this.values.address) {
      this.openAddressModal();
    }
  },
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 90%; /* Aumenta el ancho */
  max-width: 800px; /* Máximo ancho */
  height: auto; /* Ajusta altura automáticamente */
  position: relative;
}

#modal-map {
  width: 100%;
  height: 400px; /* Aumenta la altura del mapa */
  border-radius: 5px;
  margin-top: 10px;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%; /* Más ancho en dispositivos pequeños */
  }
}

</style>
