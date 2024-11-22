<template>
  <div class="summary">
    <div v-for="status in summaryStatuses" :key="status.name" class="card">
      <div :class="['card-header', getStatusColor(status.name)]">
        {{ status.name }}
      </div>
      <div class="card-content">
        <p class="count">{{ status.count }} Pedidos</p>
        <p class="total">
          Total: <strong>{{ status.total }}</strong> MXN
        </p>
      </div>
    </div>
  </div>

  <div class="table-container">
    <div class="filters">
      <div class="filter-item">
        <label for="tienda">Filtrar Por Tienda:</label>
        <select v-model="selectedTienda">
          <option value="">Todas las sucursales</option>
          <option v-for="tienda in tiendas" :key="tienda.id">
            {{ tienda.name }}
          </option>
        </select>
      </div>
      <div class="filter-item">
        <label for="estatus">Filtrar Por Estatus:</label>
        <select v-model="selectedStatus">
          <option value="">Todos los estatus</option>
          <option v-for="status in uniqueStatuses" :key="status">
            {{ status }}
          </option>
        </select>
      </div>

      <div class="filter-item">
        <label for="fecha">Filtrado Por Fecha:</label>
        <input type="date" v-model="selectedDate" />
      </div>
    </div>

    <button @click="exportToExcel">Exportar a Excel</button>

    <table class="orders-table">
      <thead>
        <tr>
          <th>Folio</th>
          <th>Sucursal</th>
          <th>Cliente</th>
          <th>Dirección Entrega</th>
          <th>Fecha y hora</th>
          <th>Total</th>
          <th>Estatus</th>
          <th>Acciones</th>
          <th>PDF</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.orderUid">
          <td>{{ order.folio }}</td>
          <td>{{ order.sucursal }}</td>
          <td>{{ order.cliente }}</td>
          <td>{{ order.direccion }}</td>
          <td>{{ order.fechaHora }}</td>
          <td>{{ order.total }}</td>
          <td :class="['status', assignStatusColor(order.estatus)]">
            {{ order.estatus }}
          </td> 
          <td class="actions-cell">
            <button class="detail-btn" @click="viewOrderDetail(order.orderUid)">
              Ver detalle
            </button>
          </td>
          <td class="action-cell"><button @click="downloadPDF" class="download-btn">
          Descargar PDF <i class="fas fa-download"></i>
        </button></td>
        </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button
            class="page-link"
            @click="setCurrentPage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            Atras
          </button>
        </li>
        <li
          class="page-item"
          :class="{ active: page === currentPage }"
          v-for="page in pages"
          :key="page"
        >
          <button class="page-link" @click="setCurrentPage(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === pageCount }">
          <button
            class="page-link"
            @click="setCurrentPage(currentPage + 1)"
            :disabled="currentPage >= pageCount"
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default {
  setup() {
    const router = useRouter();
    const orders = ref([]); // Lista de pedidos
    const tiendas = ref([]); // Lista de tiendas
    const summaryStatuses = ref([]); // Resumen de estatus
    const selectedTienda = ref(""); // Filtro de tienda
    const selectedStatus = ref(""); // Filtro de estatus
    const uniqueStatuses = ref([]); // Estatus únicos para el filtro
    const selectedDate = ref(""); // Filtro de fecha
    const currentPage = ref(1); // Página actual
    const perPage = 25; // Elementos por página

    // Función para establecer la página actual
    function setCurrentPage(page) {
      currentPage.value = page;
    }

    function exportToExcel() {
      const ws_data = paginatedOrders.value.map((order) => [
        order.folio,
        order.sucursal,
        order.Division, // División, asumiendo que es igual a la sucursal en este ejemplo
        order.cliente, // Asumiendo que cliente es un objeto con el nombre
        order.id, // Asumiendo que cliente es un objeto con el ID
        order.direccion,
        formatTimestamp(order.fechaHoraOriginal),
        formatTimestamp(order.TimeEnProceso),
        formatTimestamp(order.TimeEnRuta),
        formatTimestamp(order.TimeConcluido),
        order.Pago || "", // Ajusta según tu estructura de datos
        order.subtotal || "", // Ajusta según tu estructura de datos
        order.Envio || "", // Ajusta según tu estructura de datos
        order.Total || "",
        order.TarjetaClub || "", // Ajusta según tu estructura de datos
        order.recogerTienda || "", // Ajusta según tu estructura de datos
        order.estatus,
      ]);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([
        [
          "Folio",
          "Sucursal",
          "División",
          "Nombre del Cliente",
          "ID del Cliente",
          "Dirección",
          "Solicitud",
          "En Proceso",
          "En Ruta",
          "Concluido",
          "Pago",
          "Subtotal",
          "Envío",
          "Total",
          "Tarjeta Club",
          "Recoger en Tienda",
          "Estado",
        ],
        ...ws_data,
      ]);
      XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
      const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
      saveAs(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
        "Reporte_de_Pedidos.xlsx"
      );
    }

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    // Cálculo del número total de páginas
    const pageCount = computed(() =>
      Math.ceil(filteredOrders.value.length / perPage)
    );

    const filteredOrders = computed(() => {
      return orders.value.filter((order) => {
        return (
          (selectedTienda.value === "" ||
            order.sucursal === selectedTienda.value) &&
          (selectedStatus.value === "" ||
            order.estatus.toLowerCase() ===
              selectedStatus.value.toLowerCase()) &&
          (selectedDate.value === "" ||
            order.fechaHora.startsWith(selectedDate.value))
        );
      });
    });

    // Ordenar los pedidos para la paginación (sólo los pedidos de la página actual)
    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredOrders.value.slice(start, start + perPage);
    });

    function fetchOrders() {
      const db = getDatabase();
      const ordersRef = dbRef(
        db,
        "/projects/proj_tCJWQHSHNf7WoMu7r64pUJ/data/Pedidos"
      );
      onValue(ordersRef, (snapshot) => {
        const ordersData = snapshot.val();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // Obtener la fecha de hace 10 días

        orders.value = Object.keys(ordersData)
          .map((key) => {
            const order = ordersData[key];
            const orderDate = new Date(order.TimeSolicitud); // Convertir la fecha de solicitud a objeto Date
            return {
              orderUid: key,
              folio: order.Folio,
              sucursal: order.sucursal,
              Division: order.Division,
              cliente: order["Cliente name"],
              id: order["Cliente id"],
              direccion: order.Direccion,
              fechaHoraOriginal: order.TimeSolicitud,
              fechaHora: formatTimestamp(order.TimeSolicitud),
              total: order.Total,
              estatus: order.Status || "Sin estatus",
              TimeEnProceso: order.TimeEnProceso || "", // Asegúrate de que este campo está disponible en Firebase
              TimeEnRuta: order.TimeEnRuta || "",
              TimeConcluido: order.TimeConcluido || "",
              Pago: order.Pago || "",
              subtotal: order.Subtotal || "", // Asegúrate de que este campo está disponible en Firebase
              Envio: order.Envio || "", // Asegúrate de que este campo está disponible en Firebase
              TarjetaClub: order.TarjetaClub || "", // Asegúrate de que este campo está disponible en Firebase
              recogerTienda: order.recogerTienda || "", // Asegúrate de que este campo está disponible en Firebase
              // Filtramos los pedidos de los últimos 10 días
              isRecent: orderDate >= tenDaysAgo,
            };
          })
          .filter((order) => order.isRecent) // Solo dejamos los pedidos dentro del rango de 10 días
          .sort((a, b) => b.fechaHoraOriginal - a.fechaHoraOriginal); // Ordenar por fecha descendente

        // Filtramos tiendas únicas
        tiendas.value = [
          ...new Set(orders.value.map((order) => order.sucursal)),
        ].map((name) => ({ name }));

        // Filtramos los estatus únicos
        uniqueStatuses.value = [
          ...new Set(orders.value.map((order) => order.estatus)),
        ];

        updateSummary(); // Llamar a la actualización del resumen después de cargar los pedidos
      });
    }

    // Función para navegar a los detalles del pedido
    function viewOrderDetail(orderUid) {
      console.log("Order UID:", orderUid);
      if (!orderUid) {
        console.error("No se proporcionó un Order UID válido");
        return;
      }
      router.push({ name: "order_detail", params: { orderUid } });
    }

    // Formatear la fecha
    function formatTimestamp(timestamp) {
      if (!timestamp) {
        return "Fecha no válida";
      }
      const date = new Date(
        timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
      );
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    function getStatusColor(status) {
      // Normalizamos el estatus para que se maneje correctamente
      const cleanStatus = (status || "").trim().toLowerCase();
      console.log("Estatus procesado:", cleanStatus); // Verifica cómo se procesa el estatus

      const colors = {
        solicitud: "orange",
        "en proceso": "blue",
        "en ruta": "purple",
        concluido: "green",
        cancelado: "red",
      };

      return colors[cleanStatus] || "gray"; // Color predeterminado si no hay coincidencia
    }

    function updateSummary() {
      // Definir los estatus posibles
      const allStatuses = [
        "Solicitud",
        "En Proceso",
        "En Ruta",
        "Concluido",
        "Cancelado",
      ];

      const statusCounts = orders.value.reduce((acc, order) => {
        const normalizedStatus = order.estatus.trim().toLowerCase(); // Normalizamos el estatus
        console.log("Estatus procesado:", normalizedStatus); // Para verificar cómo se está procesando el estatus

        if (!acc[normalizedStatus])
          acc[normalizedStatus] = { count: 0, total: 0 };
        acc[normalizedStatus].count += 1; // Aumentamos el contador de pedidos para ese estatus
        acc[normalizedStatus].total += order.total; // Acumulamos el total de ese estatus
        return acc;
      }, {});

      // Aseguramos que todos los estatus tengan una tarjeta, incluso si no hay pedidos
      summaryStatuses.value = allStatuses.map((status) => ({
        name: status,
        count: statusCounts[status.toLowerCase()]?.count || 0, // Aseguramos que el nombre esté normalizado
        total: (statusCounts[status.toLowerCase()]?.total || 0).toFixed(2), // Total por estatus
        color: getStatusColor(status), // Color basado en el estatus
      }));

      // Depuración: Verifica que los totales y cuentas se estén sumando correctamente
      console.log("Resumen de estatus:", summaryStatuses.value);
    }

    // Cargar los pedidos al montar el componente
    onMounted(() => {
      fetchOrders();
    });

    return {
      currentPage,
      setCurrentPage,
      pageCount,
      paginatedOrders,
      selectedTienda,
      selectedStatus,
      selectedDate,
      tiendas,
      uniqueStatuses,
      summaryStatuses,
      viewOrderDetail,
      getStatusColor,
      exportToExcel,
    };
  },
  methods: {
    assignStatusColor(status) {
      const statusNormalized = status.trim().toLowerCase();
      switch (statusNormalized) {
        case "solicitud":
          return "solicitud";
        case "en proceso":
          return "enproceso";
        case "en ruta":
          return "enruta";
        case "concluido":
          return "concluido";
        case "cancelado":
          return "cancelado";
        default:
          return "gray"; // Retornar gris como color predeterminado si no hay coincidencia
      }
    },
  }
};
</script>

<style scoped>
@media (max-width: 600px) {
  .orders-table th:nth-child(4),
  .orders-table td:nth-child(4) {
    display: none;
  }
}

/* Estilos generales para el resumen y las tarjetas */
.summary {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.card {
  width: 200px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.card-header {
  font-size: 14px;
  font-weight: 600;
  padding: 6px 12px;
  line-height: 1;
  border-radius: 8px;
  color: #ffffff;
  margin: 0 auto 8px auto;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  color: #333333;
}

.count {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.total {
  font-size: 0.85rem;
  color: #666666;
}

.total strong {
  font-size: 1rem;
  font-weight: bold;
}

.card-header.orange {
  background-color: #ff8a3d;
}

.card-header.blue {
  background-color: #007bff;
}

.card-header.purple {
  background-color: #6f42c1;
}

.card-header.green {
  background-color: #28a745;
}

.card-header.red {
  background-color: #dc3545;
}

/* Estilos para el contenedor de la tabla y los filtros */
.table-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.filter-item label {
  font-size: 0.85rem;
  color: #666666;
  margin-bottom: 0.3rem;
}

.filter-item select,
.filter-item input {
  width: 100%;
  padding: 1%; /* Aumenta la altura */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center; /* Centra el texto */
}

/* Estilos para la tabla de órdenes */
.orders-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 1 10px;
  font-size: 16px;
}

.orders-table th {
  text-align: left;
  font-weight: bold;
  color: #555555;
  padding: 12px;
}

.orders-table td {
  padding: 12px;
  background-color: #f9f9f9;
  font-weight: 500;
}

.status.solicitud {
  background-color: #ff8a3d;
}

.status.enruta {
  background-color: #6f42c1;
}

.status.concluido {
  background-color: #28a745;
}

.status.cancelado {
  background-color: #dc3545;
}

.status.enproceso {
  background-color: #007bff;
}

.status.gray {
  background-color: gray; /* Color predeterminado */
}

.detail-btn {
  background-color: #1c3faa;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem; /* Aumenta la altura */
  border-radius: 5px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  height: 60px; /* Aumenta la altura */
  min-width: 100px; /* Asegura el tamaño mínimo */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estilos para la paginación */
.pagination-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

button {
  padding: 5px 10px;
  border: 1px solid #007bff;
  background-color: #ffffff;
  color: #007bff;
  border-radius: 5px;
  cursor: pointer;
}

button.active {
  background-color: #007bff;
  color: #ffffff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
