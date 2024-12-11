<template>
  <div class="client-directory">
    <!-- Tabla de clientes -->
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in filteredClients" :key="client.id">
          <td>{{ client.name }}</td>
          <td>{{ client.address }}</td>
          <td>{{ client.phone }}</td>
          <td>
            <!-- Botón de editar que utiliza Vue Router para redirigir -->
            <button @click="editClient(client.id)">Editar</button>
            <button class="delete-button" @click="deleteClient(client.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>



<script>
import { ref, computed } from "vue";
import { getDatabase, ref as dbRef, onValue, remove } from "firebase/database";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const db = getDatabase();
    const clients = ref([]);
    const searchQuery = ref("");
    const router = useRouter();

    const clientsRef = dbRef(db, "/projects/superkomprasBackoffice/customer");

    const fetchClients = () => {
      onValue(clientsRef, (snapshot) => {
        const data = snapshot.val();
        clients.value = data
          ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
          : [];
      });
    };

    const filteredClients = computed(() => {
      return clients.value.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const editClient = (id) => {
      // Redirige a la ruta de creación/edición con un parámetro de consulta
      router.push(`/orders/create-client?id=${id}`);
    };

    const deleteClient = async (id) => {
      const clientRef = dbRef(db, `/projects/superkomprasBackoffice/customer/${id}`);
      await remove(clientRef);
    };

    fetchClients();

    return {
      clients,
      searchQuery,
      filteredClients,
      deleteClient,
      editClient,
    };
  },
};
</script>



<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}
.delete-button {
  padding: 6px 12px;
  margin: 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f44336;
  color: white;
}
</style>
