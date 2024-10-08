<template>
  <div class="row">
    <!-- chart card section start -->
    <div class="col-sm-6 col-xxl-3 col-lg-6">
      <div class="b-b-primary border-5 border-0 card o-hidden">
        <div class="custome-1-bg b-r-4 card-body">
          <div class="media align-items-center static-top-widget">
            <div class="media-body p-0">
              <span class="m-0">Ganancias Totales</span>
              <h4 class="mb-0 counter">0
                <span class="badge badge-light-primary grow">
                  <vueFeather type="trending-down" />
                </span>
              </h4>
            </div>
            <div class="align-self-center text-center">
              <vueFeather type="database" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-6 col-xxl-3 col-lg-6">
      <div class="b-b-danger border-5 border-0 card o-hidden">
        <div class="custome-2-bg b-r-4 card-body">
          <div class="media static-top-widget">
            <div class="media-body p-0">
              <span class="m-0">Total de Pedidos</span>
              <h4 class="mb-0 counter">0
                <span class="badge badge-light-danger grow">
                  <vueFeather type="trending-down" />
                </span>
              </h4>
            </div>
            <div class="align-self-center text-center">
              <vueFeather type="shopping-bag" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-6 col-xxl-3 col-lg-6">
      <div class="b-b-secondary border-5 border-0 card o-hidden">
        <div class="custome-3-bg b-r-4 card-body">
          <div class="media static-top-widget">
            <div class="media-body p-0">
              <span class="m-0">Reseñas</span>
              <h4 class="mb-0 counter">0
                <span class="badge badge-light-secondary grow">
                  <vueFeather type="trending-up" />
                  0
                </span>
              </h4>
            </div>
            <div class="align-self-center text-center">
              <vueFeather type="message-circle" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-sm-6 col-xxl-3 col-lg-6">
      <div class="b-b-success border-5 border-0 card o-hidden">
        <div class="custome-4-bg b-r-4 card-body">
          <div class="media static-top-widget">
            <div class="media-body p-0">
              <span class="m-0">Total Usuarios</span>
              <h4 class="mb-0 counter">{{ totalUsers }}
                <span class="badge badge-light-success grow">
                  <vueFeather type="trending-down" />
                </span>
              </h4>
            </div>
            <div class="align-self-center text-center">
              <vueFeather type="user-plus" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- chart card section End -->

    <!-- Earning chart start-->
    <div class="col-xl-4">
      <div class="card o-hidden card-hover">
        <div class="card-header border-0 pb-1">
          <div class="card-header-title">
            <h4>Ganancias</h4>
          </div>
        </div>
        <div class="card-body p-0">
          <div id="bar-chart-earning">
            <apexchart
              type="line"
              height="350"
              :options="earningChart.chartOptions"
              :series="earningChart.series"
            >
            </apexchart>
          </div>
        </div>
      </div>
    </div>
    <!-- Earning chart end-->

    <!-- Report chart start-->
    <div class="col-xl-8">
      <div class="card o-hidden">
        <div class="card-header border-0 pb-1">
          <div class="card-header-title">
            <h4>Informe de ingresos</h4>
          </div>
        </div>
        <div class="card-body p-0">
          <div id="report-chart">
            <apexchart
              type="bar"
              height="350"
              :options="revenueChart.chartOptions"
              :series="revenueChart.series"
            >
            </apexchart>
          </div>
        </div>
      </div>
    </div>
    <!-- Report chart end-->
  </div>
</template>

<script>
import charts from "@/data/charts.js";
import { getDatabase, ref, get } from "firebase/database"; 
import { firebaseApp } from "@/firebase"; // Asegúrate de tener la configuración correcta

const db = getDatabase(firebaseApp);

export default {
  title: "SK-Dashboard",
  data() {
    return {
      earningChart: charts.earningChart,
      revenueChart: charts.revenueChart,
      visitorChart: charts.visitorChart,
      totalUsers: 0, // Inicializamos el total de usuarios
    };
  },
  methods: {
    async fetchTotalUsers() {
      try {
        // Obtener la referencia de la base de datos a la colección de usuarios
        const snapshot = await get(ref(db, "/projects/superkomprasBackoffice/users/"));
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          // Contar el número de usuarios
          this.totalUsers = Object.keys(usersData).length;
        } else {
          console.warn("No se encontraron usuarios en la base de datos.");
          this.totalUsers = 0; // Asegurarse de manejar el caso donde no haya usuarios
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    },
  },
  created() {
    this.fetchTotalUsers(); // Llamar la función al crear el componente
  },
};
</script>

<style scoped>
/* Estilos personalizados para el dashboard */
.b-b-primary { border-bottom-color: #007bff; }
.b-b-danger { border-bottom-color: #dc3545; }
.b-b-secondary { border-bottom-color: #6c757d; }
.b-b-success { border-bottom-color: #28a745; }
.custome-1-bg { background-color: #e9ecef; }
.custome-2-bg { background-color: #f8d7da; }
.custome-3-bg { background-color: #e2e3e5; }
.custome-4-bg { background-color: #d4edda; }

#bar-chart-earning, #report-chart {
  min-height: 350px;
}
</style>
