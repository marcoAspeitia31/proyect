<template>
  <div>
    <div v-if="pages.length > 0">
      <!-- Renderiza la paginación y el contenido de la página -->
      <ul>
        <li v-for="(item, index) in pages" :key="index">
          {{ item }}
        </li>
      </ul>

      <!-- Controles de paginación -->
      <div class="pagination-controls">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Siguiente</button>
      </div>
    </div>
    <div v-else>
    </div>
  </div>
</template>

<script>
export default {
  props: ["allData"],
  data() {
    return {
      totalPages: 0, // Inicializar en 0 para evitar errores si no hay datos
      currentPage: 1,
      contentToShow: 10, // Número de elementos por página
      pages: [], // Datos paginados para mostrar en la vista
    };
  },
  methods: {
    changePage(toPage) {
      // Asegúrate de que 'toPage' esté dentro del rango de páginas
      if (toPage > 0 && toPage <= this.totalPages) {
        let toSend = {
          toPage: toPage,
          totalPages: this.totalPages,
          currentPage: this.currentPage,
          allData: this.allData,
        };

        // Actualizar la página actual solo si está dentro del rango
        this.currentPage = toPage;

        // Enviar la solicitud para cambiar la página
        this.$store.dispatch("functionalities/changePage", toSend)
          .then((response) => {
            this.pages = [...response]; // Actualizar los datos paginados
          })
          .catch((error) => {
            console.error("Error al cambiar de página:", error);
          });
      }
    },
  },
  mounted() {
    // Verifica si 'allData' está definido y tiene longitud antes de calcular la paginación
    if (Array.isArray(this.allData) && this.allData.length > 0) {
      this.totalPages = Math.ceil(this.allData.length / this.contentToShow);

      // Enviar la solicitud inicial para cargar la primera página
      let toSend = {
        toPage: 1,
        totalPages: this.totalPages,
        currentPage: 1,
        allData: this.allData,
      };

      this.$store.dispatch("functionalities/changePage", toSend)
        .then((response) => {
          this.pages = [...response];
        })
        .catch((error) => {
          console.error("Error al cargar la primera página:", error);
        });
    } else {
      console.warn("allData no está disponible o no tiene elementos.");
      this.pages = []; // Inicializar 'pages' en vacío para evitar problemas
    }
  },
  watch: {
    // Observa los cambios en 'allData' para recalcular la paginación
    allData: {
      handler(newData) {
        if (Array.isArray(newData) && newData.length > 0) {
          this.totalPages = Math.ceil(newData.length / this.contentToShow);

          let toSend = {
            toPage: 1,
            totalPages: this.totalPages,
            currentPage: 1,
            allData: newData,
          };

          this.$store.dispatch("functionalities/changePage", toSend)
            .then((response) => {
              this.pages = [...response];
              this.currentPage = 1; // Reinicia la página actual a la primera
            })
            .catch((error) => {
              console.error("Error al recalcular la paginación:", error);
            });
        } else {
          console.warn("allData no está disponible o no tiene elementos.");
          this.pages = [];
          this.totalPages = 0; // Reiniciar totalPages si no hay datos
        }
      },
      immediate: true, // Ejecuta el observador inmediatamente al cargar el componente
      deep: true,
    },
  },
};
</script>

<style scoped>
.pagination-controls {
  margin-top: 10px;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
