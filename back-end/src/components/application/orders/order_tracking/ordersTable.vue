<template>
  <div class="tracker-table">
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr class="table-head">
            <th scope="col">Estado</th>
            <th scope="col">Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(time, status) in orderTimes" :key="status">
            <td>{{ formatStatus(status) }}</td>
            <td>{{ formatTime(time) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["order"],
  computed: {
    orderTimes() {
      // Asegúrate de que el objeto order existe
      if (!this.order) return {};
      return {
        "Pedido": this.order.TimePedido,
        "Concluido": this.order.TimeConcluido,
        "En Proceso": this.order.TimeEnProceso,
        "En Ruta": this.order.TimeEnRuta,
        "Solicitud": this.order.TimeSolicitud
      };
    }
  },
  methods: {
    formatStatus(key) {
      return key || "Desconocido";
    },
    formatTime(timestamp) {
      if (!timestamp) return "No disponible";
      const date = new Date(timestamp * 1000); // Asegúrate de que el timestamp está en milisegundos
      return date.toLocaleString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
  }
};
</script>

<style></style>
