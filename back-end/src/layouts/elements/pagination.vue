<script>
export default {
  props: ["allData"],
  data() {
    return {
      totalPages: 0, // Inicializar en 0 para evitar errores si no hay datos
      currentPage: 1,
      contentToShow: 10,
      pages: [],
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
            this.pages = [...response];
          })
          .catch((error) => {
            console.error("Error al cambiar de página:", error);
          });
      }
    },
  },
  mounted() {
    // Verifica si 'allData' está definido y tiene longitud antes de calcular
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
    }
  },
};
</script>
