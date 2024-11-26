<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <!-- Encabezado -->
                <div class="col-12">
                  <h2>Detalles del Pedido</h2>
                </div>

                <!-- Detalles del Producto -->
                <div class="col-12 overflow-hidden" v-if="orderTracking">
                  <product :product="orderTracking.product" />
                </div>

                <!-- Progreso del Pedido -->
                <div class="col-12" v-if="orderTracking">
                  <orderProgress
                    :progress="orderTimes['En Proceso']"
                    :selectedOrder="orderTracking"
                  />
                </div>

                <!-- Tabla de Etapas del Pedido -->
                <div class="col-12 overflow-visible" v-if="orderTracking">
                  <ordersTable :order-times="orderTimes" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, onValue } from "firebase/database";
import { app as firebaseApp } from '@/firebase';
import ordersTable from "@/components/application/orders/order_tracking/ordersTable.vue";
import product from "@/components/application/orders/order_tracking/product.vue";
import orderProgress from "@/components/application/orders/order_tracking/orderProgress.vue";

export default {
  components: { ordersTable, product, orderProgress },
  data() {
    return {
      selectedOrderId: "", // ID del pedido seleccionado
      orders: [], // Lista de pedidos cargados desde Firebase
      orderTracking: null, // Detalles del pedido actual
    };
  },
  mounted() {
    // Asignar el ID del pedido desde los parámetros de la ruta
    this.selectedOrderId = this.$route.params.orderUid;
    console.log("Order ID de la ruta:", this.selectedOrderId);

    // Cargar pedidos desde Firebase
    this.fetchOrders();

    // Observar cambios en los pedidos para cargar datos del pedido
    this.$watch(
      "orders",
      () => {
        this.loadOrderData();
      },
      { deep: true }
    );
  },
  computed: {
    orderTimes() {
      if (!this.orderTracking) return {};
      const times = {
        Pedido: this.orderTracking.TimePedido || "No disponible",
        Concluido: this.orderTracking.TimeConcluido || "No disponible",
        "En Proceso": this.orderTracking.TimeEnProceso || "No disponible",
        "En Ruta": this.orderTracking.TimeEnRuta || "No disponible",
        Solicitud: this.orderTracking.TimeSolicitud || "No disponible",
      };
      console.log("Historial de estados del pedido:", times); // Log del historial
      return times;
    },
  },
  methods: {
    // Cargar pedidos desde Firebase
    fetchOrders() {
      const db = getDatabase(firebaseApp);
      const ordersRef = ref(
        db,
        "/projects/proj_tCJWQHSHNf7WoMu7r64pUJ/data/Pedidos"
      );
      onValue(
        ordersRef,
        (snapshot) => {
          const orders = snapshot.val()
            ? Object.entries(snapshot.val()).map(([id, order]) => ({
                ...order,
                id,
              }))
            : [];
          this.orders = orders;
          console.log("Pedidos cargados:", this.orders);
        },
        (error) => {
          console.error("Error al cargar pedidos:", error);
        }
      );
    },
    // Filtrar y cargar los datos del pedido seleccionado
    loadOrderData() {
      console.log("IDs cargados:", this.orders.map((order) => order.id));
      console.log("ID seleccionado:", this.selectedOrderId);

      const order = this.orders.find(
        (order) => order.id.trim() === this.selectedOrderId.trim()
      );

      if (order) {
        this.orderTracking = {
          ...order,
          product: order.product || {}, // Manejar datos faltantes
        };
        console.log("Pedido encontrado:", this.orderTracking);
      } else {
        console.warn(
          "No se encontró el pedido con el ID:",
          this.selectedOrderId
        );
        this.orderTracking = null;
      }
    },
  },
  watch: {
    // Observar cambios en orderTracking y mostrar historial en consola
    orderTracking(newVal) {
      if (newVal) {
        console.log("Nuevo historial de estados cargado:", this.orderTimes);
      }
    },
  },
};
</script>


<style scoped>
.table-head {
  background-color: #f8f9fa;
  text-align: left;
}
.table td,
.table th {
  padding: 12px;
  vertical-align: middle;
}
</style>
