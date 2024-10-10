<template>
  <div class="card">
    <div class="card-body">
      <h4 class="form-title">Crea una Sucursal</h4>
      <form @submit.prevent="createNewBranch" class="branch-form">
        <div class="form-group">
          <label>Nombre de la Sucursal:</label>
          <input v-model="newBranch.name" type="text" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Division:</label>
          <input v-model="newBranch.division" type="text" required class="form-control" />
        </div>
        <div class="form-group">
          <label>Direccion:</label>
          <input v-model="newBranch.address" type="text" required class="form-control" />
        </div>
        <div class="form-group latitude-longitude">
          <div class="latitude">
            <label>Latitud:</label>
            <input v-model="newBranch.latitude" type="text" required class="form-control" />
          </div>
          <div class="longitude">
            <label>Longitud:</label>
            <input v-model="newBranch.longitude" type="text" required class="form-control" />
          </div>
        </div>
        <div class="form-group">
          <label>Telefono:</label>
          <input v-model="newBranch.phone" type="text" required class="form-control" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Crear Sucursal</button>
          <button type="button" @click="cancelCreate" class="btn btn-primary">Cancelar</button>
        </div>
      </form>

      <!-- Branches List Component -->
      <list-stores :branches="branches" @edit-branch="editBranch" @delete-branch="handleDeleteBranch" />
    </div>
  </div>
</template>

<script>
import { ref, push, update, remove, onValue } from 'firebase/database';
import { db } from '@/firebase';

export default {
  name: 'BranchForm',
  data() {
    return {
      branches: [],
      newBranch: {
        id: '',
        name: '',
        division: '',
        address: '',
        latitude: '',
        longitude: '',
        phone: ''
      },
      isEditing: false,
      editingIndex: null
    };
  },
  created() {
    this.fetchBranches();
  },
  methods: {
    fetchBranches() {
      const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
      onValue(branchesRef, (snapshot) => {
        const data = snapshot.val();
        const branches = [];
        if (data) {
          for (let id in data) {
            branches.push({ ...data[id], id });
          }
        }
        this.branches = branches;
      }, (error) => {
        console.error("Error fetching branches:", error);
      });
    },
    createNewBranch() {
      if (this.isEditing) {
        // Update existing branch in Firebase
        const branchRef = ref(db, `/projects/superkomprasBackoffice/stores/${this.newBranch.id}`);
        update(branchRef, this.newBranch)
          .then(() => {
            this.isEditing = false;
            this.editingIndex = null;
            this.resetForm();
          })
          .catch((error) => {
            console.error("Error updating branch:", error);
          });
      } else {
        // Create new branch in Firebase
        const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
        push(branchesRef, this.newBranch)
          .then((snapshot) => {
            this.newBranch.id = snapshot.key;
            this.branches.push({ ...this.newBranch });
            this.resetForm();
          })
          .catch((error) => {
            console.error("Error creating branch:", error);
          });
      }
    },
    editBranch(branch) {
      this.isEditing = true;
      this.newBranch = { ...branch };
    },
    handleDeleteBranch(branchId) {
      this.branches = this.branches.filter(branch => branch.id !== branchId);
    },
    cancelCreate() {
      this.resetForm();
    },
    resetForm() {
      this.newBranch = { id: '', name: '', division: '', address: '', latitude: '', longitude: '', phone: '' };
      this.isEditing = false;
      this.editingIndex = null;
    }
  }
};
</script>

<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
}

.card-body {
  padding: 20px;
}

.form-title {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.branch-form, .branches-list {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.latitude-longitude {
  display: flex;
  gap: 20px;
}

.latitude, .longitude {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 0.875em;
}

.btn-warning {
  background-color: #ffc107;
  color: white;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}
</style>