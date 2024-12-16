<template>
  <div v-if="product">
    <h2>Pedido-{{ product.folio || "Número no disponible" }}</h2>
    <div class="order-details">
      <!-- Información General del Pedido -->
      <div class="info-row">
        <p><strong>Tipo de envío:</strong> {{ product.tipoEnvio || "No especificado" }}</p>
        <p><strong>Fecha y hora:</strong> {{ formattedDate }}</p>
        <p><strong>Sucursal:</strong> {{ product.sucursal || "No especificada" }}</p>
        <p><strong>Estatus:</strong> {{ product.estatus || "Desconocido" }}</p>
        <p><strong>Folio:</strong> {{ product.folio || "No disponible" }}</p>
      </div>

      <!-- Información del Cliente -->
      <div class="info-row">
        <h3>Información de Cliente</h3>
        <p><strong>Nombre:</strong> {{ product["Cliente name"] || "No disponible" }}</p>
        <p><strong>Cliente ID:</strong> {{ product["Cliente id"] || "No disponible" }}</p>
        <p><strong>Teléfono:</strong> {{ product.telefono || "No disponible" }}</p>
        <p><strong>Dirección:</strong> {{ product.direccion || "No disponible" }}</p>
        <p><strong>Código Tarjeta Club:</strong> {{ product.codigoTarjetaClub || "No disponible" }}</p>
        <p><strong>Comentarios:</strong> {{ product.comentarios || "No hay comentarios" }}</p>
      </div>

      <!-- Fotografía del Cliente -->
      <div class="info-row" v-if="product.fotografia">
        <h3>Fotografía:</h3>
        <img :src="product.fotografia" alt="Fotografía del Cliente" class="client-photo" />
      </div>
    </div>
  </div>
  <div v-else>
    <p>Cargando información del pedido...</p>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  computed: {
    // Formatea la fecha y hora para mostrarla en un formato amigable
    formattedDate() {
      if (!this.product || !this.product.fechaHora) {
        return "Fecha no especificada";
      }
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      };
      const date = new Date(this.product.fechaHora);
      return date.toLocaleDateString("es-MX", options);
    },
  },
  methods: {
    // Espacio reservado para eventos futuros, como clicks o ediciones
  },
};
</script>

<style scoped>
.order-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.info-row {
  margin-bottom: 20px;
  background-color: #f3f3f3;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.client-photo {
  max-width: 200px;
  border-radius: 8px;
}
</style>
