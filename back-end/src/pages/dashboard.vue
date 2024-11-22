<template>
  <div class="row">
    <!-- Tarjeta de total de pedidos -->
    <div class="col-sm-6 col-xxl-3 col-lg-6">
      <div class="b-b-primary border-5 border-0 card o-hidden">
        <div class="custome-1-bg b-r-4 card-body">
          <div class="media align-items-center static-top-widget">
            <div class="media-body p-0">
              <span class="m-0">Total de Pedidos</span>
              <h4 class="mb-0 counter">
                {{ totalOrders }}
              </h4>
            </div>
            <div class="align-self-center text-center">
              <vueFeather type="database" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tarjeta de total de monto de compra -->
    <div class="col-sm-6 col-xxl-3 col-lg-6">
      <div class="b-b-danger border-5 border-0 card o-hidden">
        <div class="custome-2-bg b-r-4 card-body">
          <div class="media static-top-widget">
            <div class="media-body p-0">
              <span class="m-0">Total de Monto de Compra</span>
              <h4 class="mb-0 counter">
                {{ totalAmount }}
              </h4>
            </div>
            <div class="align-self-center text-center">
              <vueFeather type="shopping-bag" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tarjeta de pedidos solicitados -->
    <div class="col-sm-6 col-xxl-3 col-lg-6">
      <div class="b-b-secondary border-5 border-0 card o-hidden">
        <div class="custome-3-bg b-r-4 card-body">
          <div class="media static-top-widget">
            <div class="media-body p-0">
              <span class="m-0">Total de Pedidos Solicitados</span>
              <h4 class="mb-0 counter">
                {{ totalRequestedOrders }}
              </h4>
            </div>
            <div class="align-self-center text-center">
              <vueFeather type="message-circle" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tarjeta de pedidos en proceso -->
    <div class="col-sm-6 col-xxl-3 col-lg-6">
      <div class="b-b-success border-5 border-0 card o-hidden">
        <div class="custome-4-bg b-r-4 card-body">
          <div class="media static-top-widget">
            <div class="media-body p-0">
              <span class="m-0">Total de Pedidos en Proceso</span>
              <h4 class="mb-0 counter">
                {{ totalProcessingOrders }}
              </h4>
            </div>
            <div class="align-self-center text-center">
              <vueFeather type="user-plus" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, get } from "firebase/database";
import { firebaseApp } from "@/firebase";
import { DatabaseIcon, ShoppingBagIcon, MessageCircleIcon, UserPlusIcon } from 'vue-feather-icons';

const db = getDatabase(firebaseApp);

export default {
  components: {
    DatabaseIcon,
    ShoppingBagIcon,
    MessageCircleIcon,
    UserPlusIcon,
  },
  data() {
    return {
      totalOrders: 0,
      totalAmount: 0.0,
      totalRequestedOrders: 0,
      totalProcessingOrders: 0,
    };
  },
  methods: {
    async fetchData() {
      try {
        const snapshot = await get(ref(db, "/projects/proj_tCJWQHSHNf7WoMu7r64pUJ/data/Pedidos"));
        if (snapshot.exists()) {
          const ordersData = Object.values(snapshot.val());

          console.log("Datos de pedidos completos:", ordersData); // Depuración completa

          // Obtener el rango de fechas del mes actual
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime(); // Timestamp de inicio del mes
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime(); // Timestamp de fin del mes

          console.log("Rango de fechas del mes (timestamps):", startOfMonth, endOfMonth);

          // Filtrar pedidos dentro del rango del mes actual
          const filteredOrders = ordersData.filter(order => {
            if (!order.TimeSolicitud) {
              console.warn("Pedido sin TimeSolicitud encontrado:", order); // Pedidos sin campo TimeSolicitud
              return false;
            }
            const orderTime = parseInt(order.TimeSolicitud); // Convertir TimeSolicitud a número
            return orderTime >= startOfMonth && orderTime <= endOfMonth;
          });

          console.log("Pedidos filtrados del mes actual:", filteredOrders);

          // Calcular métricas
          this.totalOrders = filteredOrders.length;
          this.totalAmount = filteredOrders
            .reduce((total, order) => total + (parseFloat(order.Total) || 0), 0)
            .toFixed(2);

          this.totalRequestedOrders = filteredOrders.filter(order => order.Status === "Solicitud").length;
          this.totalProcessingOrders = filteredOrders.filter(order => order.Status === "En proceso").length;
        } else {
          console.warn("No se encontraron datos en la ruta especificada.");
        }
      } catch (error) {
        console.error("Error al obtener datos de Firebase:", error);
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>


<style scoped>
/* Estilos personalizados */
.b-b-primary {
  border-bottom-color: #007bff;
}
.b-b-danger {
  border-bottom-color: #dc3545;
}
.b-b-secondary {
  border-bottom-color: #6c757d;
}
.b-b-success {
  border-bottom-color: #28a745;
}
.custome-1-bg {
  background-color: #e9ecef;
}
.custome-2-bg {
  background-color: #f8d7da;
}
.custome-3-bg {
  background-color: #e2e3e5;
}
.custome-4-bg {
  background-color: #d4edda;
}
</style>
