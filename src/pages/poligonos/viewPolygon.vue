<template>
  <div class="polygons-list">
    <h3>Polígonos Activos</h3>
    
    <!-- Selector de sucursal -->
    <div>
      <label for="storeSelect">Filtrar por Sucursal:</label>
      <select id="storeSelect" v-model="selectedStore" @change="filterPolygons">
        <option value="">Todas las Sucursales</option>
        <option v-for="store in uniqueStores" :key="store" :value="store">{{ store }}</option>
      </select>
    </div>
    
    <table v-if="filteredPolygons && filteredPolygons.length > 0">
      <thead>
        <tr>
          <th>Nombre del Polígono</th>
          <th>Nombre de la Sucursal</th>
          <th>División</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="polygon in filteredPolygons" :key="polygon.uid">
          <td>{{ polygon.uid }}</td>
          <td>{{ polygon.name || "N/A" }}</td>
          <td>{{ polygon.tienda || "N/A" }}</td>
          <td>
            <button class="button" @click="confirmDelete(polygon.uid)">
              Eliminar
            </button>
            <button class="button" @click="redirectToEdit(polygon)">
              Editar
            </button>
            <button class="button" @click="showMap(polygon)">
              Ver
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p>No hay datos disponibles para mostrar.</p>
    </div>
    
    <!-- Mapa para mostrar el polígono seleccionado -->
    <div v-if="mapVisible" id="map" style="height: 500px; margin-top: 20px;"></div>
  </div>
</template>

<script>
import { ref, onValue, remove } from "firebase/database";
import { db } from "@/firebase";
import Swal from "sweetalert2";
import { Loader } from "@googlemaps/js-api-loader"; // Importamos el cargador de Google Maps
import router from "@/router";

export default {
  name: "ListPolygons",
  data() {
    return {
      polygons: [],
      selectedStore: "", // Almacena la sucursal seleccionada
      uniqueStores: [], // Almacena las sucursales únicas
      googleMapsApiLoaded: false, // Estado de carga de la API de Google Maps
      map: null, // Referencia al mapa
      mapVisible: false, // Controla la visibilidad del mapa
    };
  },
  computed: {
    filteredPolygons() {
      // Filtra los polígonos según la sucursal seleccionada
      if (this.selectedStore) {
        return this.polygons.filter(polygon => polygon.tienda === this.selectedStore);
      }
      return this.polygons; // Si no hay filtro, devuelve todos los polígonos
    },
  },
  mounted() {
    this.loadPolygons();
    this.loadGoogleMapsApi(); // Cargar la API de Google Maps al montar el componente
  },
  methods: {
    loadPolygons() {
      const polygonsRef = ref(db, "/projects/superkomprasBackoffice/polygons");

      // Cargar datos de los polígonos directamente
      onValue(polygonsRef, (snapshot) => {
        const loadedPolygons = [];
        const storesSet = new Set(); // Usamos un Set para obtener sucursales únicas

        snapshot.forEach((polySnapshot) => {
          const polyData = polySnapshot.val();
          const tiendaName = polyData.tienda ? polyData.tienda.trim() : "N/A";
          loadedPolygons.push({
            uid: polySnapshot.key,
            name: polyData.name ? polyData.name.trim() : "N/A",
            tienda: tiendaName,
            paths: polyData.coordinates.paths.map(path => ({ lat: path.lat, lng: path.lng })) // Almacenamos todos los paths del polígono
          });
          storesSet.add(tiendaName); // Agregar sucursal al Set
        });
        
        this.polygons = loadedPolygons;
        this.uniqueStores = Array.from(storesSet); // Convertir Set a Array
      });
    },
    async loadGoogleMapsApi() {
      try {
        const loader = new Loader({
          apiKey: 'AIzaSyCQaNQ9r1XYhZjx9J3ZsLQqJ8yDK2T6gPo', // Reemplaza con tu clave de API de Google Maps
          libraries: []
        });
        
        await loader.load();
        this.googleMapsApiLoaded = true;
      } catch (error) {
        console.error("Error al cargar la API de Google Maps:", error);
      }
    },
    showMap(polygon) {
      if (polygon.paths && polygon.paths.length > 0) {
        this.mapVisible = true;

        this.$nextTick(() => {
          if (!this.map) {
            this.map = new google.maps.Map(document.getElementById("map"), {
              center: polygon.paths[0],
              zoom: 13,
            });
          } else {
            this.map.setCenter(polygon.paths[0]);
          }

          // Crear los límites del polígono
          const bounds = new google.maps.LatLngBounds();
          const polygonPath = polygon.paths.map(path => {
            const latLng = new google.maps.LatLng(path.lat, path.lng);
            bounds.extend(latLng); // Extender los límites con cada coordenada
            return latLng;
          });

          // Crear y mostrar el polígono en el mapa
          new google.maps.Polygon({
            paths: polygonPath,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map: this.map,
          });

          // Ajustar el mapa a los límites del polígono
          this.map.fitBounds(bounds);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "No se pueden mostrar",
          text: "Este polígono no tiene coordenadas válidas.",
          confirmButtonColor: "#d33",
        });
      }
    },
    confirmDelete(uid) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borrar!",
      }).then((result) => {
        if (result.isConfirmed) {
          const polyRef = ref(db, `/projects/superkomprasBackoffice/polygons/${uid}`);
          remove(polyRef)
            .then(() => {
              Swal.fire("Eliminado!", "El polígono ha sido eliminado.", "success");
              this.loadPolygons();
            })
            .catch((error) => {
              console.error("Error al eliminar el polígono: ", error);
              Swal.fire("Error!", "No se pudo eliminar el polígono.", "error");
            });
        }
      });
    },
    redirectToEdit(polygon) {
      console.log("Navegando a editar polígono con ID:", polygon.uid); 
      router.push({ name: "editPolygon", params: { polygonId: polygon.uid } });
    },
  },
};
</script>

<style scoped>
.polygons-list {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.polygons-list h3 {
  color: #333;
  text-align: center;
}

.polygons-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.polygons-list th,
.polygons-list td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #ccc;
}

.polygons-list th {
  background-color: #f0f0f0;
}

.polygons-list td {
  background-color: #ffffff;
}

.button {
  margin-right: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #0056b3;
  color: white;
  cursor: pointer;
}

.button:hover {
  background-color: #003d82;
}

select {
  margin: 10px 0;
  padding: 8px;
  width: calc(100% - 20px);
}
</style>


<style scoped>
.polygons-list {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.polygons-list h3 {
  color: #333;
  text-align: center;
}

.polygons-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.polygons-list th,
.polygons-list td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #ccc;
}

.polygons-list th {
  background-color: #f0f0f0;
}

.polygons-list td {
  background-color: #ffffff;
}

.button {
  margin-right: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #0056b3;
  color: white;
  cursor: pointer;
}

.button:hover {
  background-color: #003d82;
}

select {
  margin: 10px 0;
  padding: 8px;
  width: calc(100% - 20px);
}
</style>
