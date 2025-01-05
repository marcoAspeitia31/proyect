<template>
  <div class="client-directory">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Buscar cliente..."
      class="search-input"
    />
    <div class="table-container">
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
              <button @click="editClient(client.id)" class="edit-button">
                Editar
              </button>
              <button class="delete-button" @click="deleteClient(client.id)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { getDatabase, ref as dbRef, onValue, remove } from "firebase/database";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

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
      router.push(`/orders/edit-client?id=${id}`);
    };

    const deleteClient = async (id) => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar!",
      });

      if (result.isConfirmed) {
        const clientRef = dbRef(
          db,
          `/projects/superkomprasBackoffice/customer/${id}`
        );
        await remove(clientRef);
        Swal.fire("Eliminado!", "El cliente ha sido eliminado.", "success");

        clients.value = clients.value.filter((client) => client.id !== id);
      }
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

<style scoped>
.client-directory {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

button {
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.edit-button {
  background-color: #4caf50;
  color: white;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.delete-button:hover {
  background-color: #d32f2f;
}
</style>
