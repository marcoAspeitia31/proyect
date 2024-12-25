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
            Editar Cliente
          </li>
        </ol>
      </nav>

      <!-- Campos del formulario -->
      <div class="input">
        <label for="name">Nombre</label>
        <input type="text" id="name" v-model="values.name" required />
      </div>

      <div class="input">
        <label for="address">Dirección</label>
        <input
          type="text"
          id="address"
          v-model="values.address"
          ref="autocomplete"
          required
        />
      </div>

      <div
        id="map"
        style="width: 100%; height: 400px; margin-bottom: 20px"
      ></div>

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
        <input type="text" id="clubCard" v-model="values.clubCard" />
      </div>

      <!-- Botón de actualización -->
      <button @click="confirmRegister" type="button" class="btn btn-primary">
        Editar Cliente
      </button>
    </div>
  </div>
</template>

<script>
import { db, ref, onValue, update } from "@/firebase";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      customerId: null,
      values: {
        name: "",
        address: "",
        references: "",
        phone: "",
        additionalPhone: "",
        clubCard: "",
        coordinates: { lat: null, lng: null },
        registryDate: null,
        updateDate: null,
      },
      map: null,
      marker: null,
    };
  },
  methods: {
    loadCustomerData(customerId) {
      if (!this.map) {
        console.error("Map not initialized");
        return;
      }

      const customerRef = ref(
        db,
        `/projects/superkomprasBackoffice/customer/${customerId}`
      );
      onValue(customerRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.customerId = customerId;
          this.values = { ...this.values, ...data };
          if (
            data.coordinates &&
            data.coordinates.lat &&
            data.coordinates.lng
          ) {
            this.updateMapLocation(data.coordinates);
          }
        } else {
          Swal.fire(
            "No se encontraron datos",
            "El cliente solicitado no existe.",
            "error"
          );
        }
      });
    },
    updateMapLocation(coordinates) {
      if (!this.map) {
        console.error("Map not initialized");
        return;
      }

      const position = new google.maps.LatLng(coordinates.lat, coordinates.lng);
      this.map.setCenter(position);
      if (!this.marker) {
        this.marker = new google.maps.Marker({
          map: this.map,
          position: position,
          draggable: false, 
        });
      } else {
        this.marker.setPosition(position);
      }
    },
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 19.432608, lng: -99.133209 }, // Ubicación predeterminada
        zoom: 15,
      });

      this.map.addListener("tilesloaded", () => {
        const customerId = this.$route.query.id;
        if (customerId) {
          this.loadCustomerData(customerId);
        } else {
          Swal.fire("Error", "No se proporcionó un ID de cliente.", "error");
        }
      });
    },
    confirmRegister() {
      if (!this.customerId) {
        Swal.fire("Error", "No se pudo encontrar el cliente.", "error");
        return;
      }

      const customerRef = ref(
        db,
        `/projects/superkomprasBackoffice/customer/${this.customerId}`
      );

      const updatedData = {
        ...this.values,
        updateDate: new Date().toISOString(), // Fecha de actualización
      };

      update(customerRef, updatedData)
        .then(() => {
          Swal.fire(
            "Actualización exitosa",
            "Los datos del cliente se actualizaron correctamente.",
            "success"
          );
        })
        .catch((error) => {
          console.error("Error al actualizar los datos:", error);
          Swal.fire(
            "Error",
            "Ocurrió un problema al actualizar los datos del cliente.",
            "error"
          );
        });
    },
  },
  mounted() {
    this.initMap();
  },
};
</script>


<style>
.input {
  margin-bottom: 20px;
  position: relative;
}

select,
input {
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
