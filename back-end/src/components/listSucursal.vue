<template>
    <div v-if="isLoading">
      Cargando sucursales...
    </div>
    <div v-else class="branches-list">
      <table>
        <thead>
          <tr>
            <th>Sucursal</th>
            <th>División</th>
            <th>Dirección</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredBranches.length === 0">
            <td colspan="5">No hay sucursales disponibles.</td>
          </tr>
          <tr v-for="(branch, index) in filteredBranches" :key="branch.id || index">
            <td>{{ branch.name }}</td>
            <td>{{ branch.division }}</td>
            <td>{{ branch.address }}</td>
            <td>{{ branch.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { ref, onValue } from 'firebase/database';
  import { db } from '@/firebase';
  
  export default {
    name: 'ListStores',
    data() {
      return {
        branches: [],
        isLoading: true
      };
    },
    computed: {
      filteredBranches() {
        return this.branches.filter(branch =>
          branch.status === 'activo' &&
          branch.name && 
          branch.division && 
          branch.address && 
          branch.phone
        );
      },
    },
    created() {
      const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
      onValue(branchesRef, (snapshot) => {
        const branches = [];
        snapshot.forEach((childSnapshot) => {
          const branch = childSnapshot.val();
          branch.id = childSnapshot.key;
          branches.push(branch);
        });
        this.branches = branches;
        this.isLoading = false; // Indicador de que la carga ha finalizado
      });
    },
  };
  </script>
  
  <style scoped>
  /* Añade tus estilos aquí */
  </style>
  