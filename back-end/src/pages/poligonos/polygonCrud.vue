<template>
  <div class="container">
    <nav aria-label="breadcrumb" class="float-right">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">Polígonos</li>
      </ol>
    </nav>
    <div v-if="isLoading">
      Cargando sucursales...
    </div>
    <div v-else class="branches-list">
      <table>
        <thead>
          <tr>
            <th>Sucursal</th>
            <th>División</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredBranches.length === 0">
            <td colspan="4">No hay sucursales disponibles.</td>
          </tr>
          <tr v-for="(branch, index) in filteredBranches" :key="branch.id">
            <td>{{ branch.name }}</td>
            <td>{{ branch.division }}</td>
            <td>{{ branch.phone }}</td>
            <td>
              <div class="button-group">
                <button class="button" @click="startPolygon(branch)">Crear</button>
                <button class="button" @click="displayPolygons(branch)">Ver</button>
                <button class="button" @click="savePolygon" :disabled="!polygon">Guardar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="activePolygons.length > 0" class="polygons-list">
      <h3>Polígonos Activos</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre División</th>
            <th>Vertices Guardas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(polygon, index) in activePolygons" :key="index">
            <td>{{ polygon.name }}</td>
            <td>{{ polygon.vertices }}</td>
            <td>
              <button class="button" @click="confirmDelete(index)">Eliminar</button>
              <button class="button" @click="editPolygon(index)">Editar</button>
              <button class="button" @click="saveEditedPolygon">Actualizar Cambios</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="map-container" ref="googleMap"></div>
  </div>
</template>

<script>
import { ref, onValue, query, remove, set, push, update } from 'firebase/database';
import { db } from '@/firebase';
import Swal from 'sweetalert2';

export default {
  name: 'ListStores',
  data() {
    return {
      branches: [],
      selectedBranch: null,
      map: null,
      markers: [],
      polygons: [],
      polygon: null,
      isLoading: true,
      activePolygons: []
    };
  },
  computed: {
    filteredBranches() {
      return this.branches.filter(branch => branch.status === 'activo');
    },
  },
  methods: {
    initializeMap() {
      const mapOptions = {
        center: { lat: 19.4326, lng: -99.1332 },
        zoom: 12
      };
      this.map = new google.maps.Map(this.$refs.googleMap, mapOptions);
      this.loadBranches();
    },
    loadGoogleMapsScript() {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCQaNQ9r1XYhZjx9J3ZsLQqJ8yDK2T6gPo&callback=initMap`;
        script.defer = true;
        document.head.appendChild(script);
        window.initMap = this.initializeMap.bind(this);
      } else {
        this.initializeMap();
      }
    },
    loadBranches() {
      const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
      onValue(branchesRef, (snapshot) => {
        const branches = [];
        snapshot.forEach((childSnapshot) => {
          const branch = childSnapshot.val();
          branch.id = childSnapshot.key;
          branches.push(branch);
        });
        this.branches = branches;
        this.isLoading = false;
      }, (error) => {
        console.error("Failed to load branches:", error);
        this.isLoading = false;
      });
    },
    addPoint(position) {
  const marker = new google.maps.Marker({
    position,
    map: this.map,
    draggable: true // Opcional, permite mover los marcadores
  });
  this.markers.push(marker);

  // Escuchar el evento drag en el marcador para actualizar el polígono
  marker.addListener('drag', () => {
    this.updatePolygon();
  });

  // Actualiza el polígono cada vez que se añade un nuevo marcador
  this.updatePolygon();
},
savePolygon() {
  if (!this.polygon || !this.selectedBranch) {
    Swal.fire('Error!', 'No hay un polígono para guardar o no se ha seleccionado una sucursal válida.', 'error');
    return;
  }

  // Obtener las coordenadas actuales de los vértices del polígono
  const paths = this.polygon.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));

  // Crear un nuevo polígono en Firebase si no existe una clave (es decir, es un polígono nuevo)
  if (!this.polygonKey) {
    const newPolygonRef = push(ref(db, `/projects/superkomprasBackoffice/polygons/${this.selectedBranch.id}`));
    this.polygonKey = newPolygonRef.key;
  }

  // Referencia al polígono en Firebase para actualizar o crear
  const polygonRef = ref(db, `/projects/superkomprasBackoffice/polygons/${this.selectedBranch.id}/${this.polygonKey}`);
  
  // Guardar o actualizar el polígono en Firebase
  set(polygonRef, {
    paths,
    name: this.selectedBranch.division // Asumiendo que el nombre del polígono es la división de la sucursal
  }).then(() => {
    Swal.fire('Guardado!', 'Polígono guardado con éxito en Firebase.', 'success');
    this.resetPolygonCreation(); // Resetear la creación para limpiar el mapa
  }).catch(error => {
    Swal.fire('Error!', 'Error al guardar el polígono: ' + error.message, 'error');
  });
},
updatePolygon() {
  if (this.polygon) {
    this.polygon.setMap(null); // Elimina el polígono actual
  }
  const paths = this.markers.map(marker => marker.getPosition());
  this.polygon = new google.maps.Polygon({
    paths,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    map: this.map
  });
},

displayPolygons(branch) {
  this.selectedBranch = branch;
  const polygonsRef = query(ref(db, `/projects/superkomprasBackoffice/polygons/${branch.id}`));

  onValue(polygonsRef, snapshot => {
    this.clearMap(); // Limpia los polígonos actuales antes de cargar nuevos
    this.polygons = [];
    this.activePolygons = [];

    snapshot.forEach(childSnapshot => {
      const { paths, name } = childSnapshot.val();
      const googlePaths = paths.map(p => new google.maps.LatLng(p.lat, p.lng));

      const polygon = new google.maps.Polygon({
        paths: googlePaths,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.map
      });

      this.polygons.push(polygon);
      this.activePolygons.push({ name, vertices: paths.length, key: childSnapshot.key });
    });
  }, { onlyOnce: true });
},
  confirmDelete(index) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletePolygon(index);
        Swal.fire(
          'Eliminado!',
          'El polígono ha sido eliminado.',
          'success'
        );
      }
    });
  },
    startPolygon(branch) {
      this.selectedBranch = branch;
      this.clearMap(); // Clears the map before starting a new polygon
      google.maps.event.addListener(this.map, 'click', event => {
        this.addPoint(event.latLng);
      });
    },
    editPolygon(index) {
  console.log("Polígonos actuales:", this.polygons);
  console.log("Índice solicitado:", index);
  console.log("Polígono en el índice:", this.polygons[index]);

  if (!this.polygons[index]) {
    Swal.fire('Error!', 'El polígono no existe.', 'error');
    return;
  }

  const polygonData = this.activePolygons[index];
  this.selectedBranch = this.branches.find(branch => branch.id === polygonData.key);

  this.clearMap();

  if (this.polygons[index]) {
    const paths = this.polygons[index].getPath().getArray();
    paths.forEach(latLng => {
      this.addPoint(latLng);
    });
    this.polygons[index].setMap(null);
    this.polygons.splice(index, 1);
    this.activePolygons.splice(index, 1);
  } else {
    console.error('El polígono no está definido:', this.polygons[index]);
  }
},
saveEditedPolygon() {
  if (!this.polygon || !this.selectedBranch) {
    Swal.fire('Error!', 'No hay un polígono para guardar o no se ha seleccionado una sucursal válida.', 'error');
    return;
  }

  // ObtIene las coordenadas actuales de los vértices del polígono
  const paths = this.polygon.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));

  // Referencia al polígono en Firebase para actualizar
  const polygonRef = ref(db, `/projects/superkomprasBackoffice/polygons/${this.selectedBranch.id}/${this.polygonKey}`);
  
  // Actualiza el polígono en Firebase con los nuevos puntos
  update(polygonRef, {
    paths,
    name: this.selectedBranch.division
  }).then(() => {
    Swal.fire('Guardado!', 'Polígono actualizado con éxito en Firebase.', 'success');
    this.resetPolygonCreation();
  }).catch(error => {
    Swal.fire('Error!', 'Error al guardar el polígono: ' + error.message, 'error');
  });
},

    resetPolygonCreation() {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      if (this.polygon) {
        this.polygon.setMap(null);
        this.polygon = null;
      }
    },
    clearMap() {
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      this.polygons.forEach(polygon => polygon.setMap(null));
      this.polygons = [];
      this.polygon = null;
    }
  },
  mounted() {
    this.loadGoogleMapsScript();
  }
};
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.branches-list, .polygons-list {
  margin-bottom: 20px;
}
.map-container {
  height: 500px;
  width: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align:left;
  vertical-align: middle;
}
.button-group {
  display: flex;
  justify-content: space-around;
}
.button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  margin: 2px;
}
.button:hover {
  background-color: #45a049;
}
</style>
