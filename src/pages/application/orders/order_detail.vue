<template>
  <div>
    <!-- Información del Pedido -->
    <div v-if="selectedOrder">
      <h1 class="order-title">{{ selectedOrder.orderId }}</h1>
      <div class="info-card">
        <table class="info-table">
          <tbody>
            <tr>
              <td><strong>Tipo de envío</strong></td>
              <td><strong>Fecha y hora</strong></td>
              <td><strong>Sucursal</strong></td>
              <td><strong>Estatus</strong></td>
              <td><strong>Folio</strong></td>
            </tr>
            <tr>
              <td>Envío a domicilio</td>
              <td>{{ selectedOrder.fechaHora }}</td>
              <td>{{ selectedOrder.sucursal }}</td>
              <td>
                <span :class="`status ${selectedOrder.estatus?.toLowerCase()}`">
                  {{ selectedOrder.estatus || "Desconocido" }}
                </span>
              </td>
              <td>{{ selectedOrder.folio || "No disponible" }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Información del Cliente -->
      <div class="info-card">
        <h3>Información de Cliente</h3>
        <div class="client-info">
          <div class="field" v-for="field in clientFields" :key="field.label">
            <label>{{ field.label }}</label>
            <input :type="field.type" :value="field.value" disabled />
          </div>
          <div class="field">
            <label>Comentarios:</label>
            <textarea disabled>{{ selectedOrder.comentarios || "" }}</textarea>
          </div>
          <div class="field">
            <label>Fotografía:</label>
            <img
              :src="selectedOrder.fotografia"
              alt="Fotografía del Cliente"
              class="client-photo"
              v-if="selectedOrder.fotografia"
            />
          </div>
        </div>
      </div>
      <!-- Barra de Progreso Interactiva -->
      <div v-if="formattedProgress.length" class="progress-container">
        <div
          v-for="(step, index) in formattedProgress"
          :key="index"
          class="progress-step"
          :class="{
            active: step.status === 'complete',
            pending: step.status === 'pending',
          }"
        >
          <div class="step-indicator">
            <span>{{ index + 1 }}</span>
          </div>
          <div class="step-info">
            <h5>{{ step.heading }}</h5>
            <h6>{{ step.time }}</h6>
          </div>
        </div>
      </div>

      <div v-else>
        <p>Cargando progreso...</p>
      </div>

      <div v-if="formattedProgress.length" class="state-table-container">
        <h3>Detalles de los Estados</h3>
        <table class="state-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(step, index) in formattedProgress" :key="index">
              <td>{{ step.heading }}</td>
              <td>{{ step.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detalles de Artículos -->
      <div class="info-card">
        <h3>Artículos</h3>
        <table class="articles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedOrder.articles" :key="item.id">
              <td>{{ item.codigo }}</td>
              <td>
                <img
                  :src="item.imagen"
                  alt="Imagen de artículo"
                  class="product-image"
                />
              </td>
              <td>{{ item.nombre }}</td>
              <td>{{ item.cantidad }}{{ item.unidad }}</td>
              <td>${{ item.total }}</td>
              <td>{{ item.comentarios }}</td>
            </tr>
          </tbody>
        </table>
        <p>Total de {{ selectedOrder.articles.length }} artículos</p>
      </div>

      <!-- Detalle de Pago -->
      <div class="info-card">
        <h3>Detalle de Pago</h3>
        <div class="payment-details">
          <div class="payment-field">
            <span>Subtotal:</span>
            <span>${{ paymentDetails.subtotal }}</span>
          </div>
          <div class="payment-field">
            <span>Envío:</span>
            <span>${{ paymentDetails.envio }}</span>
          </div>
          <div class="payment-field total">
            <span>Total:</span>
            <span>${{ paymentDetails.total }}</span>
          </div>
        </div>
        <button @click="downloadPDF" class="download-btn">Descargar PDF</button>
      </div>
    </div>
    <div v-else>
      <p>Cargando detalles del pedido o pedido no encontrado...</p>
    </div>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
import { onMounted, ref } from "vue";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { useRoute, useRouter } from "vue-router";

export default {
  props: ["progress"],
  setup() {
    const route = useRoute();
    const selectedOrder = ref(null);
    const clientFields = ref([]);
    const paymentDetails = ref({});
    const router = useRouter();
    const formattedProgress = ref([]);

    const fetchOrderDetails = async () => {
      const orderUid = route.params.orderUid;
      if (!orderUid) return;

      const db = getDatabase();
      const orderRef = dbRef(
        db,
        `/projects/proj_tCJWQHSHNf7WoMu7r64pUJ/data/Pedidos/${orderUid}`
      );
      onValue(orderRef, (snapshot) => {
        const orderData = snapshot.val();
        if (orderData) {
          selectedOrder.value = {
            orderId: orderUid,
            folio: orderData.Folio || "No disponible",
            sucursal: orderData.sucursal || "No disponible",
            fechaHora: formatTimestamp(orderData["Time pedido"]),
            estatus: orderData.Status || "Desconocido",
            cliente: orderData["Cliente name"] || "No disponible",
            clienteId: orderData["Cliente id"] || "No disponible",
            telefono: orderData["Cliente telefono"] || "No disponible",
            direccion: orderData.Direccion || "No disponible",
            codigoTarjetaClub: orderData.TarjetaClub || "No disponible",
            TimeSolicitud: orderData.TimeSolicitud,
            TimeEnProceso: orderData.TimeEnProceso,
            TimeEnRuta: orderData.TimeEnRuta,
            TimeConcluido: orderData.TimeConcluido,
            TimeCancelado: orderData.TimeCancelado,
            subtotal: orderData.Subtotal || "", // Asegúrate de que este campo está disponible en Firebase
            envio: orderData.Envio || "", 
            total: orderData.Total,
            fotografia: orderData["Fotografia"] || "",
            articles: Object.keys(orderData.Productos || {}).map((key) => {
              const product = orderData.Productos[key];
              return {
                id: key,
                categoria: product.CATEGORIAAPP || "N/A",
                cantidad: product.Cantidad || "N/A",
                cantidadGramos: product.CantidadGRPZ || "N/A",
                codigo: product.Codigo || "N/A",
                imagen: product.Imagen || "",
                nombre: product.Nombre || "N/A",
                total: product.Total || 0,
                unidad: product.Unidad || "N/A",
                comentarios: product.Comentarios,
              };
            }),
            paymentDetails: {
              subtotal: orderData.Subtotal || 0,
              envio: orderData.Envio || 0,
              total: orderData.Total || 0,
              metodo: orderData.Pago || "No especificado",
              icono: orderData.IconoMetodoPago || "",
            },
          };
          clientFields.value = [
            {
              label: "Nombre",
              type: "text",
              value: selectedOrder.value.cliente,
            },
            {
              label: "Cliente ID",
              type: "text",
              value: selectedOrder.value.clienteId,
            },
            {
              label: "Teléfono",
              type: "text",
              value: selectedOrder.value.telefono,
            },
            {
              label: "Dirección",
              type: "text",
              value: selectedOrder.value.direccion,
            },
            {
              label: "Código Tarjeta Club",
              type: "text",
              value: selectedOrder.value.codigoTarjetaClub,
            },
          ];

          paymentDetails.value = selectedOrder.value.paymentDetails;
          formatProgress(orderData);
        }
      });
    };

    const goToOrderTracking = () => {
      if (selectedOrder.value && selectedOrder.value.orderId) {
        router.push({
          name: "order_tracking",
          params: { orderUid: selectedOrder.value.orderId },
        });
      } else {
        console.error(
          "No se puede redirigir porque no hay información del pedido."
        );
      }
    };

    const formatProgress = (orderData) => {
      formattedProgress.value = [
        {
          key: "TimeSolicitud",
          heading: "Solicitud",
          time: formatTimestamp(orderData.TimeSolicitud),
          status: orderData.TimeSolicitud ? "complete" : "pending",
        },
        {
          key: "TimeEnProceso",
          heading: "En Proceso",
          time: formatTimestamp(orderData.TimeEnProceso),
          status: orderData.TimeEnProceso ? "complete" : "pending",
        },
        {
          key: "TimeEnRuta",
          heading: "En Ruta",
          time: formatTimestamp(orderData.TimeEnRuta),
          status: orderData.TimeEnRuta ? "complete" : "pending",
        },
        {
          key: "TimeConcluido",
          heading: "Concluido",
          time: formatTimestamp(orderData.TimeConcluido),
          status: orderData.TimeConcluido ? "complete" : "pending",
        },
      ];

      // Agregar estado cancelado si existe
      if (orderData.TimeCancelado) {
        formattedProgress.value.push({
          key: "TimeCancelado",
          heading: "Cancelado",
          time: formatTimestamp(orderData.TimeCancelado),
          status: "complete",
        });
      }
    };

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return "";
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
    };

    const downloadPDF = () => {
      if (!selectedOrder.value || !selectedOrder.value.folio) {
        console.error(
          "No se puede descargar el PDF porque no hay datos de pedido."
        );
        return;
      }

      const pdf = new jsPDF();
      pdf.setFontSize(12);
      pdf.text(`Folio: ${selectedOrder.value.folio}`, 10, 10);
      pdf.text(`Cliente: ${selectedOrder.value.cliente}`, 10, 20);
      pdf.text(`Teléfono: ${selectedOrder.value.telefono}`, 10, 30);
      pdf.text(`Dirección: ${selectedOrder.value.direccion}`, 10, 40);

      // Encabezados de la tabla
      pdf.setFontSize(10);
      pdf.text("Código", 10, 60);
      pdf.text("Nombre", 50, 60);
      pdf.text("Cantidad", 130, 60);
      pdf.text("Precio", 170, 60);
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.line(10, 62, 200, 62);

      // Listado de artículos
      let y = 100;
      selectedOrder.value.articles.forEach((item) => {
        pdf.text(item.codigo, 10, y);
        pdf.text(item.nombre, 50, y, { maxWidth: 80 });
        pdf.text(item.cantidad, 130, y);
        pdf.text(`$${item.total}`, 170, y);
        y += 10;
      });

      y += 10;
      pdf.text(`Subtotal: $${selectedOrder.value.subtotal}`, 130, y);
      pdf.text(`Envío: $${selectedOrder.value.envio}`, 130, y + 10);
      pdf.text(`Total: $${selectedOrder.value.total}`, 130, y + 20);

      // Guardar el PDF con un nombre basado en el folio
      const fileName = `detalle_${selectedOrder.value.folio}.pdf`;
      pdf.save(fileName);
    };

    onMounted(fetchOrderDetails);

    return {
      selectedOrder,
      clientFields,
      paymentDetails,
      downloadPDF,
      goToOrderTracking,
      formattedProgress,
      getClass(status) {
        return {
          "progtrckr-todo": status.status === "pending",
          "progtrckr-done": status.status === "complete",
        };
      },
    };
  },
};
</script>

<style scoped>
@media (max-width: 600px) {
  .summary {
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 100%; /* Hace que cada tarjeta ocupe todo el ancho */
    margin-bottom: 1rem; /* Agrega espacio entre tarjetas */
  }

  .table-container {
    padding: 1rem;
    overflow-x: auto; /* Reduce el padding en contenedores más pequeños */
  }

  .filters {
    flex-wrap: wrap; /* Permite que los filtros se apilen verticalmente */
  }

  .filter-item {
    flex-basis: 100%; /* Hace que cada filtro ocupe el ancho completo */
    margin-bottom: 0.5rem;
  }

  .orders-table {
    font-size: 14px; /* Reduce la fuente para la tabla */
  }

  .detail-btn,
  .page-link {
    padding: 0.5rem 1rem; /* Reduce el tamaño de los botones */
    font-size: 14px;
  }

  .pagination-container {
    justify-content: center; /* Centra la paginación */
    flex-wrap: wrap; /* Permite envolver elementos de paginación */
  }
}

.progress-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  text-align: center;
}

.progress-step .step-indicator {
  width: 30px;
  height: 30px;
  background: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
}

.progress-step.active .step-indicator {
  background: #4caf50;
}

.progress-step.pending .step-indicator {
  background: #ccc;
}

.progress-step h5 {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.progress-step h6 {
  font-size: 12px;
  color: #777;
}

.progress-container::before,
.progress-container::after {
  content: "";
  width: 50px;
  height: 1px;
  background-color: #d3d3d3;
  position: absolute;
  top: 50%;
  z-index: 1;
}

/* Tabla de Estados */
.state-table-container {
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.state-table {
  width: 100%;
  border-collapse: collapse;
}

.state-table th,
.state-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.state-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.state-table tr:hover {
  background-color: #f9f9f9;
}
.client-selector {
  margin-bottom: 1.5rem;
}
.client-selector label {
  font-weight: bold;
  margin-right: 0.5rem;
}
.client-selector select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.order-details {
  padding: 1.5rem;
  background-color: #f8f9fa;
}
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
.info-table,
.articles-table {
  width: 100%;
  font-size: 16px;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.info-table td,
.articles-table th,
.articles-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #ddd;
}
.client-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.field label {
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.field input,
.field textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f9fa;
}
.client-photo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}
.articles-table img.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
.payment-details {
  display: flex;
  flex-direction: column; /* Coloca los elementos en una sola columna */
  gap: 1rem; /* Añade espacio entre cada fila de detalles */
  font-size: 16px;
  margin-bottom: 1.5rem;
}

.payment-left,
.payment-right {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Añade más espacio entre cada campo */
}

.payment-field,
.payment-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.payment-field.total {
  font-size: 18px;
  font-weight: bold;
  color: #111111; /* Color más oscuro para el total */
}
.payment-method {
  display: flex;
  align-items: center;
  gap: 8px; /* Espacio entre el texto y el icono */
}

.payment-field span:first-child {
  font-weight: bold; /* Negrita para el título */
}

.payment-method span:first-child {
  font-weight: bold;
  margin-right: 8px;
}

.payment-icon {
  width: 24px;
  height: 24px;
  margin-left: 8px;
}

.download-btn {
  background-color: #8b0000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem; /* Aumenta el tamaño del botón */
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem; /* Espacio extra entre el botón y el contenido de arriba */
}
</style>
