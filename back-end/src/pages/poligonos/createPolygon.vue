<template>
  <div class="create-polygon-container">
    <nav aria-label="breadcrumb" class="float-right">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item">
          <router-link to="#">Poligonos</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Crear Poligonos
        </li>
      </ol>
    </nav>
    <div class="controls">
      <select
        v-model="selectedBranchId"
        @change="selectBranch"
        class="branch-selector"
      >
        <option disabled value="">Seleccione una sucursal</option>
        <option
          v-for="branch in activeBranches"
          :key="branch.id"
          :value="branch.id"
        >
          {{ branch.name }}
        </option>
      </select>
      <button
        v-if="selectedBranchId && polygon"
        @click="savePolygon"
        class="save-button"
      >
        Guardar Polígono
      </button>
    </div>
    <div ref="googleMap" class="map-container"></div>
  </div>
</template>
<script>
import {
  ref,
  onValue,
  set,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "@/firebase";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      activeBranches: [],
      selectedBranchId: "",
      selectedBranch: null,
      map: null,
      markers: [],
      polygon: null,
    };
  },
  methods: {
    loadActiveBranches() {
      const branchesRef = query(
        ref(db, "/projects/superkomprasBackoffice/stores"),
        orderByChild("status"),
        equalTo("activo")
      );
      onValue(
        branchesRef,
        (snapshot) => {
          const branches = [];
          snapshot.forEach((childSnapshot) => {
            const branch = childSnapshot.val();
            branch.id = childSnapshot.key;
            branches.push(branch);
          });
          this.activeBranches = branches;
        },
        (error) => {
          console.error("Failed to load active branches:", error);
        }
      );
    },
    selectBranch() {
      this.selectedBranch = this.activeBranches.find(
        (branch) => branch.id === this.selectedBranchId
      );
      if (this.polygon) {
        this.polygon.setMap(null);
        this.polygon = null;
      }
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
      this.createPolygon();
    },
    initializeMap() {
      if (!this.map) {
        const mapOptions = {
          center: { lat: 19.4326, lng: -99.1332 },
          zoom: 12,
        };
        this.map = new google.maps.Map(this.$refs.googleMap, mapOptions);
        this.map.addListener("click", (e) => {
          this.addPoint(e.latLng);
        });
      }
    },
    addPoint(position) {
      const marker = new google.maps.Marker({
        position,
        map: this.map,
        draggable: true,
      });
      this.markers.push(marker);
      this.createPolygon();
    },
    createPolygon() {
      if (this.polygon) {
        this.polygon.setPaths(
          this.markers.map((marker) => marker.getPosition())
        );
      } else {
        this.polygon = new google.maps.Polygon({
          paths: this.markers.map((marker) => marker.getPosition()),
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: this.map,
        });
      }
    },
    savePolygon() {
      if (!this.polygon || !this.selectedBranch) {
        Swal.fire(
          "Error!",
          "No hay un polígono para guardar o no se ha seleccionado una sucursal válida.",
          "error"
        );
        return;
      }

      const paths = this.polygon
        .getPath()
        .getArray()
        .map((p) => ({
          lat: p.lat(),
          lng: p.lng(),
        }));

      const polygonID = `Poligono-${this.selectedBranch.division}-${Math.floor(
        Math.random() * 10000
      )}`;
      const polygonRef = ref(
        db,
        `/projects/superkomprasBackoffice/polygons/${polygonID}`
      );

      set(polygonRef, {
        coordinates: { paths }, // Solo paths dentro de coordinates
        name: this.selectedBranch.name, // Nombre de la sucursal fuera de coordinates
        tienda: this.selectedBranch.division, // ID o división de la sucursal fuera de coordinates
      })
        .then(() => {
          Swal.fire("Guardado!", "Polígono guardado con éxito.", "success");
          this.polygon.setMap(null);
          this.polygon = null;
          this.markers.forEach((marker) => marker.setMap(null));
          this.markers = [];
        })
        .catch((error) => {
          Swal.fire(
            "Error!",
            "Error al guardar el polígono: " + error.message,
            "error"
          );
        });
    },
  },
  mounted() {
    this.loadActiveBranches();
    this.initializeMap();
  },
};
</script>

<style scoped>
.create-polygon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.controls {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

.branch-selector {
  width: 30%;
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.map-container {
  height: 500px;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.save-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #45a049;
}
</style>
