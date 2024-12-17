<template>
  <div class="container">
    <nav aria-label="breadcrumb" class="float-right">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link to="#">Gestion de Sucursales</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Direccion de Sucursales
        </li>
      </ol>
    </nav>
    <div v-if="isLoading">Cargando sucursales...</div>

    <div v-else class="branches-list">
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
          <tr v-if="filteredBranches.length === 0">
            <td colspan="5">No hay sucursales disponibles.</td>
          </tr>
          <tr
            v-for="(branch, index) in filteredBranches"
            :key="branch.id || index"
          >
            <td>{{ branch.name }}</td>
            <td>{{ branch.division }}</td>
            <td>{{ branch.address }}</td>
            <td>{{ branch.phone }}</td>
            <td>
              <button class="marker-button" @click="selectBranch(branch)">
                Ir al marcador
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="map-container" ref="googleMap"></div>
  </div>
</template>

<script>
import { ref, onValue } from "firebase/database";
import { db } from "@/firebase";

export default {
  name: "ListStores",
  data() {
    return {
      branches: [],
      selectedBranch: null,
      map: null,
      marker: null,
      isLoading: true,
    };
  },
  computed: {
    filteredBranches() {
      return this.branches.filter((branch) => branch.status === "activo");
    },
  },
  methods: {
    selectBranch(branch) {
      this.selectedBranch = branch;
      if (this.map) {
        const newCenter = { lat: branch.latitude, lng: branch.longitude };
        this.map.setCenter(newCenter);
        this.moveMarker(newCenter);
      }
    },
    moveMarker(position) {
      if (this.marker) {
        this.marker.setPosition(position);
      } else {
        this.marker = new google.maps.Marker({
          position: position,
          map: this.map,
          title: this.selectedBranch.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10, // size
            fillColor: "#F00",
            fillOpacity: 0.4,
            strokeWeight: 0.4,
          },
        });
      }
    },
    initializeMap() {
      const mapOptions = {
        center: { lat: 19.4326, lng: -99.1332 }, // Centro de CDMX
        zoom: 12,
      };
      this.map = new google.maps.Map(this.$refs.googleMap, mapOptions);
      this.branches.forEach((branch) => {
        if (branch.status === "activo") {
          this.moveMarker({ lat: branch.latitude, lng: branch.longitude });
        }
      });
    },
    loadGoogleMapsScript() {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCQaNQ9r1XYhZjx9J3ZsLQqJ8yDK2T6gPo&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        window.initMap = () => this.initializeMap();
      } else {
        this.initializeMap();
      }
    },
  },
  mounted() {
    this.loadGoogleMapsScript();
    const branchesRef = ref(db, "/projects/superkomprasBackoffice/stores");
    onValue(branchesRef, (snapshot) => {
      const branches = [];
      snapshot.forEach((childSnapshot) => {
        const branch = childSnapshot.val();
        branch.id = childSnapshot.key;
        branches.push(branch);
      });
      this.branches = branches;
      this.isLoading = false;
    });
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.branches-list {
  margin-bottom: 20px;
}
.map-container {
  height: 300px;
  width: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.marker-button {
  background-color: #4caf50; /* Green background */
  color: white; /* White text */
  border: none; /* No border */
  padding: 10px 20px; /* Padding around text */
  text-align: center; /* Centered text */
  text-decoration: none; /* No underline */
  display: inline-block; /* Inline block */
  font-size: 14px; /* Larger text size */
  margin: 4px 2px; /* Some margin */
  cursor: pointer; /* Pointer cursor on hover */
  border-radius: 8px; /* Rounded corners */
  transition: background-color 0.3s; /* Smooth transition for hover effect */
}

.marker-button:hover {
  background-color: #45a049; /* Darker green background on hover */
}
</style>
