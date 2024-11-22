<template>
  <div>
    <div class="selector-container">
      <label for="folio-selector">Selecciona un pedido por folio:</label>
      <select id="folio-selector" v-model="selectedFolio" @change="fetchOrderTracking">
        <option v-for="order in ordersList" :key="order.folio" :value="order.folio">
          {{ order.folio }}
        </option>
      </select>
    </div>

    <div v-if="selectedOrder">
      <h1 class="order-title">{{ selectedOrder.orderId }}</h1>
      <div class="info-card">
        <table class="info-table">
          <tbody>
            <tr>
              <td><strong>Fecha y hora</strong></td>
              <td><strong>Estado de envío</strong></td>
              <td><strong>Sucursal</strong></td>
              <td><strong>Estatus</strong></td>
            </tr>
            <tr>
              <td>{{ selectedOrder.fechaHora }}</td>
              <td>{{ selectedOrder.estadoEnvio }}</td>
              <td>{{ selectedOrder.sucursal }}</td>
              <td>
                <span :class="`status ${selectedOrder.estatus?.toLowerCase()}`">
                  {{ selectedOrder.estatus || "Desconocido" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="info-card">
        <h3>Historial de Estados</h3>
        <table class="articles-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="estado in historialEstados" :key="estado.time">
              <td>{{ formatDate(estado.time) }}</td>
              <td>{{ formatTime(estado.time) }}</td>
              <td>{{ estado.nombre }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";

export default {
  setup() {
    const selectedFolio = ref("");
    const selectedOrder = ref(null);
    const historialEstados = ref([]);
    const ordersList = ref([]);

    const fetchOrdersList = () => {
      const db = getDatabase();
      const ordersRef = dbRef(db, `/projects/proj_tCJWQHSHNf7WoMu7r64pUJ/data/Pedidos`);
      onValue(ordersRef, (snapshot) => {
        const ordersData = snapshot.val();
        if (ordersData) {
          ordersList.value = Object.keys(ordersData).map((key) => ({
            folio: key,
            sucursal: ordersData[key].sucursal || "Desconocida",
          }));
        }
      });
    };

    const fetchOrderTracking = async () => {
      if (!selectedFolio.value) return;

      const db = getDatabase();
      const orderRef = dbRef(
        db,
        `/projects/proj_tCJWQHSHNf7WoMu7r64pUJ/data/Pedidos/${selectedFolio.value}`
      );
      onValue(orderRef, (snapshot) => {
        const orderData = snapshot.val();
        if (orderData) {
          selectedOrder.value = {
            orderId: selectedFolio.value,
            sucursal: orderData.sucursal || "No disponible",
            fechaHora: formatTimestamp(orderData["Time pedido"]),
            estatus: orderData.Status || "Desconocido",
            estadoEnvio: orderData.EstadoEnvio || "No especificado",
          };

          // Crear historial de estados
          historialEstados.value = [
            { nombre: "Solicitud", time: orderData.TimeSolicitud || null },
            { nombre: "En Proceso", time: orderData.TimeEnProceso || null },
            { nombre: "En Ruta", time: orderData.TimeEnRuta || null },
            { nombre: "Concluido", time: orderData.TimeConcluido || null },
          ].filter((estado) => estado.time); // Filtrar estados sin timestamp
        }
      });
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return "Fecha no válida";
      const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return "Fecha no válida";
      const date = new Date(timestamp);
      return date.toLocaleDateString("es-ES");
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return "Hora no válida";
      const date = new Date(timestamp);
      return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    onMounted(() => {
      fetchOrdersList();
    });

    return {
      selectedFolio,
      selectedOrder,
      historialEstados,
      ordersList,
      fetchOrderTracking,
      formatDate,
      formatTime,
    };
  },
};
</script>


<style scoped>
/* Reutilización del estilo anterior */
.order-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
}
.info-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}
.articles-table {
  width: 100%;
  font-size: 16px;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.articles-table th,
.articles-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #ddd;
}
.status {
  padding: 0.5rem;
  border-radius: 4px;
  text-transform: capitalize;
}
</style>
