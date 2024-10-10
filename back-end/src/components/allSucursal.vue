<template>
  <div class="branches-list">
    <table>
      <thead>
        <tr>
          <th>Sucursal</th>
          <th>Division</th>
          <th>Direccion</th>
          <th>Latitud</th>
          <th>Longitud</th>
          <th>Telefono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!branches || branches.length === 0">
          <td colspan="7">No branches available.</td>
        </tr>
        <tr v-else v-for="(branch, index) in branches" :key="branch.id">
          <td>{{ branch.name }}</td>
          <td>{{ branch.division }}</td>
          <td>{{ branch.address }}</td>
          <td>{{ branch.latitude }}</td>
          <td>{{ branch.longitude }}</td>
          <td>{{ branch.phone }}</td>
          <td>
            <button @click="editBranch(branch)" class="btn btn-sm btn-edit">Edit</button>
            <button @click="confirmDelete(branch.id)" class="btn btn-sm btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para editar sucursales -->
    <div v-if="selectedBranch" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h2>Edit Branch</h2>
        <form @submit.prevent="saveBranch">
          <div class="form-group">
            <label for="branchName">Branch Name</label>
            <input v-model="selectedBranch.name" type="text" id="branchName" required>
          </div>
          <div class="form-group">
            <label for="branchDivision">Division</label>
            <input v-model="selectedBranch.division" type="text" id="branchDivision" required>
          </div>
          <div class="form-group">
            <label for="branchAddress">Address</label>
            <input v-model="selectedBranch.address" type="text" id="branchAddress" required>
          </div>
          <div class="form-group">
            <label for="branchLatitude">Latitude</label>
            <input v-model="selectedBranch.latitude" type="text" id="branchLatitude" required>
          </div>
          <div class="form-group">
            <label for="branchLongitude">Longitude</label>
            <input v-model="selectedBranch.longitude" type="text" id="branchLongitude" required>
          </div>
          <div class="form-group">
            <label for="branchPhone">Phone</label>
            <input v-model="selectedBranch.phone" type="text" id="branchPhone" required>
          </div>
          <button type="submit" class="btn btn-save">Save Changes</button>
          <button type="button" class="btn btn-cancel" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '@/firebase';
import Swal from 'sweetalert2';

export default {
  name: 'ListStores',
  data() {
    return {
      branches: null,
      selectedBranch: null // Sucursal seleccionada para editar
    };
  },
  created() {
    const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
    onValue(branchesRef, (snapshot) => {
      if (snapshot.exists()) {
        this.branches = Object.values(snapshot.val());
      } else {
        this.branches = [];
      }
    });
  },
  methods: {
    editBranch(branch) {
      // Copiar la sucursal seleccionada para editarla en la modal
      this.selectedBranch = { ...branch };
    },
    closeModal() {
      this.selectedBranch = null; // Cerrar la modal
    },
    saveBranch() {
      // Guardar los cambios en Firebase
      const branchRef = ref(db, `/projects/superkomprasBackoffice/stores/${this.selectedBranch.id}`);
      update(branchRef, this.selectedBranch)
        .then(() => {
          Swal.fire('Success', 'Branch updated successfully', 'success');
          this.closeModal(); // Cerrar la modal después de guardar
        })
        .catch((error) => {
          Swal.fire('Error', 'There was an issue updating the branch', 'error');
          console.error('Error updating branch:', error);
        });
    },
    confirmDelete(branchId) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteBranch(branchId);
        }
      });
    },
    deleteBranch(branchId) {
      const branchRef = ref(db, `/projects/superkomprasBackoffice/stores/${branchId}`);
      remove(branchRef)
        .then(() => {
          Swal.fire('Deleted!', 'The branch has been deleted.', 'success');
        })
        .catch((error) => {
          Swal.fire('Error!', 'There was a problem deleting the branch.', 'error');
          console.error("Error deleting branch:", error);
        });
    }
  }
};
</script>

<style scoped>
.branches-list {
  margin-bottom: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px;
  border: 1px solid #ccc;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

td {
  background-color: #fafafa;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 0.875em;
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
}

.btn-edit {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  border: none;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.btn-save {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
