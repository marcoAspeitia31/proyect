<template>
  <div>
    <h2>Lista de Usuarios</h2>
    <users-table :users="users" />
  </div>
</template>

<script>
import { db } from '@/firebase'; // Importa la configuración de Firebase
import { ref, onValue } from 'firebase/database';
import usersTable from '@/components/general/users/allUsers/usersTable.vue'; // Asegúrate de que la ruta sea correcta

export default {
  components: {
    usersTable // Registra el componente de la tabla
  },
  data() {
    return {
      users: [] // Inicializa un array vacío para los usuarios
    };
  },
  mounted() {
    this.fetchUsers(); // Llama a la función para obtener usuarios cuando el componente se monta
  },
  methods: {
    fetchUsers() {
      const usersRef = ref(db, 'users'); // Referencia a la ruta de usuarios en la base de datos
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val(); // Obtiene los datos de la base de datos
        this.users = []; // Reinicia el array de usuarios

        if (data) {
          for (let id in data) {
            this.users.push({ ...data[id] }); // Combina solo los datos del usuario, sin el ID
          }
        }
      }, (error) => {
        console.error("Error al obtener los datos de Firebase:", error);
      });
    }
  }
};
</script>

<style>
</style>
