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
</template>

<script>
import { ref, computed } from "vue";
import { getDatabase, ref as dbRef, onValue, remove } from "firebase/database";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; 

export default {
  setup() {
    const db = getDatabase();
    const clients = ref([]); // Lista de clientes
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

        // Elimina el cliente de la lista local para evitar inconsistencias
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
  display: inline-block;
  background-color: #f44336;
  color: white;
}
.edit-button:hover {
  background-color: #f44336;
}
.edit-button {
  background-color: #4caf50;
  border: none;
  padding: 6px 12px;
  text-decoration: none;
  display: inline-block;
  margin: 4px;
  cursor: pointer;
  border-radius: 4px;
}

.edit-button:hover {
  background-color: #45a049; /* Cambio de color al pasar el mouse */
}
</style>
