<template>
  <div class="edit-polygon-container">
    <div class="polygon-search">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar polígono..."
        @input="filterPolygons"
        class="input-field"
      />
      <select
        v-model="selectedPolygonId"
        @change="loadPolygonData"
        class="select-field"
      >
        <option disabled value="">Seleccione un polígono</option>
        <option
          v-for="polygon in filteredPolygons"
          :key="polygon.id"
          :value="polygon.id"
        >
          {{ polygon.name }}
        </option>
      </select>
    </div>

    <!-- Información del polígono -->
    <div class="polygon-info">
      <label for="polygonId">ID del Polígono:</label>
      <input id="polygonId" v-model="polygon.uid" type="text" readonly />

      <label for="polygonName">Nombre de Polígono:</label>
      <input id="polygonName" v-model="polygon.name" type="text" readonly />

      <label for="branchName">Nombre de Sucursal:</label>
      <input id="branchName" v-model="polygon.tienda" type="text" readonly />
    </div>

    <!-- Contenedor para el mapa -->
    <div ref="googleMap" class="map-container"></div>

    <!-- Botones de acciones -->
    <div class="action-buttons">
      <button @click="resetPolygon" class="reset-button">Reiniciar Polígono</button>
      <button @click="savePolygonChanges" class="save-button">Guardar Cambios</button>
    </div>
  </div>
</template>

<script>
import { ref, onValue, update } from "firebase/database";
import { db } from "@/firebase";
import { nextTick } from "vue";
import Swal from "sweetalert2"; // Importa SweetAlert2

export default {
  props: ["polygonId"],
  data() {
    return {
      polygons: [],
      filteredPolygons: [],
      searchQuery: "",
      selectedPolygonId: null,
      polygon: { uid: "", name: "", tienda: "", paths: [] },
      map: null,
      currentPolygon: null,
      newPath: [],
    };
  },
  watch: {
    searchQuery() {
      this.filterPolygons();
    },
    polygonId: {
      immediate: true,
      handler(newVal) {
        this.selectedPolygonId = newVal;
        this.loadPolygonData();
      },
    },
  },
  mounted() {
    this.loadPolygons();
    this.initializeMap();
  },
  methods: {
    loadPolygons() {
      const polygonsRef = ref(db, `/projects/superkomprasBackoffice/polygons`);
      onValue(polygonsRef, (snapshot) => {
        const polygonsData = snapshot.val();
        this.polygons = Object.keys(polygonsData).map((key) => ({
          id: key,
          name: polygonsData[key].name,
          additionalIdentifier: polygonsData[key].additionalIdentifier || "N/A",
        }));
        this.filterPolygons();
      });
    },
    filterPolygons() {
      if (this.searchQuery) {
        this.filteredPolygons = this.polygons.filter((polygon) =>
          polygon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.filteredPolygons = this.polygons;
      }
    },
    loadPolygonData() {
      if (!this.selectedPolygonId) {
        this.polygon = { uid: "", name: "", tienda: "", paths: [] };
        return;
      }
      const polygonRef = ref(
        db,
        `/projects/superkomprasBackoffice/polygons/${this.selectedPolygonId}`
      );
      onValue(polygonRef, (snapshot) => {
        const polygonData = snapshot.val();
        if (polygonData) {
          this.polygon = {
            uid: this.selectedPolygonId,
            name: polygonData.name || "N/A",
            tienda: polygonData.tienda || "N/A",
            paths: polygonData.coordinates?.paths || [],
          };
          nextTick(() => this.displayPolygon());
        }
      });
    },
    initializeMap() {
      if (!this.map) {
        const mapOptions = {
          center: { lat: 19.4326, lng: -99.1332 },
          zoom: 12,
        };
        this.map = new google.maps.Map(this.$refs.googleMap, mapOptions);

        // Añadir evento de clic para agregar puntos al redibujar el polígono
        this.map.addListener("click", (event) => {
          this.addPoint(event.latLng);
        });
      }
    },
    displayPolygon() {
      this.clearPolygon();
      this.newPath = []; // Reinicia el path para el redibujado

      if (this.polygon.paths && this.polygon.paths.length > 0) {
        const polygonPaths = this.polygon.paths.map(
          (path) => new google.maps.LatLng(path.lat, path.lng)
        );
        this.currentPolygon = new google.maps.Polygon({
          paths: polygonPaths,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: this.map,
        });

        const bounds = new google.maps.LatLngBounds();
        this.currentPolygon.getPath().forEach((latLng) => bounds.extend(latLng));
        this.map.fitBounds(bounds);
      }
    },
    addPoint(latLng) {
      this.newPath.push({ lat: latLng.lat(), lng: latLng.lng() });

      if (this.currentPolygon) {
        this.currentPolygon.setMap(null);
      }

      this.currentPolygon = new google.maps.Polygon({
        paths: this.newPath,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.map,
      });
    },
    resetPolygon() {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esto reiniciará el polígono a su estado original.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, reiniciar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.newPath = [];
          if (this.currentPolygon) {
            this.currentPolygon.setMap(null);
          }
          this.currentPolygon = null;
          Swal.fire("Reiniciado", "El polígono ha sido reiniciado.", "success");
        }
      });
    },
    savePolygonChanges() {
      if (this.newPath.length > 0) {
        const polygonRef = ref(
          db,
          `/projects/superkomprasBackoffice/polygons/${this.selectedPolygonId}/coordinates`
        );

        update(polygonRef, { paths: this.newPath })
          .then(() => {
            Swal.fire("Guardado", "Cambios guardados correctamente.", "success");
          })
          .catch((error) => {
            console.error("Error al guardar cambios:", error);
            Swal.fire("Error", "Hubo un problema al guardar los cambios.", "error");
          });
      } else {
        Swal.fire("Sin cambios", "No se han definido puntos para el polígono.", "info");
      }
    },
    clearPolygon() {
      if (this.currentPolygon) {
        this.currentPolygon.setMap(null);
      }
      this.currentPolygon = null;
    },
  },
};
</script>

<style scoped>
.edit-polygon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
  background: #fff;
}
.polygon-search {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin-bottom: 20px;
}
.input-field,
.select-field {
  flex: 1;
  margin: 0 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.polygon-info {
  display: flex;
  flex-direction: column;
  width: 80%;
}
.polygon-info label,
.polygon-info input {
  margin-top: 10px;
  padding: 8px;
  width: 100%;
}
.map-container {
  height: 400px;
  width: 100%;
  margin-top: 20px;
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.reset-button,
.save-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.reset-button {
  background-color: #f44336;
}
</style>
