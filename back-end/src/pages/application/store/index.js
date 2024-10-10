import { createStore } from 'vuex';
import { rolesPermissions } from '@/utils/permissions.js';
import { auth, db } from '@/firebase'; // Ensure Firebase is properly configured
import { ref, onValue, push, update, remove } from 'firebase/database';
import Swal from 'sweetalert2';

export default createStore({
  state: {
    currentUser: {
      name: '',
      email: '',
      role: '',
      permissions: []
    },
    branches: [] // State to store the list of branches
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
      state.currentUser.permissions = rolesPermissions[user.role] || [];
    },
    clearCurrentUser(state) {
      state.currentUser = {
        name: '',
        email: '',
        role: '',
        permissions: []
      };
    },
    setBranches(state, branches) {
      state.branches = branches;
    },
    addBranch(state, branch) {
      state.branches.push(branch);
    },
    updateBranch(state, updatedBranch) {
      const index = state.branches.findIndex(b => b.id === updatedBranch.id);
      if (index !== -1) {
        state.branches.splice(index, 1, updatedBranch);
      }
    },
    removeBranch(state, branchId) {
      state.branches = state.branches.filter(b => b.id !== branchId);
    }
  },
  actions: {
    fetchCurrentUser({ commit }) {
      // Using Firebase Authentication to get the current user
      auth.onAuthStateChanged((user) => {
        if (user) {
          // Fetch additional user data from Firebase Database
          const userRef = ref(db, `/projects/superkomprasBackoffice/users/${user.uid}`);
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              commit('setCurrentUser', {
                name: data.name,
                email: data.email,
                role: data.role
              });
            }
          }, (error) => {
            console.error("Error fetching user data:", error);
          });
        } else {
          commit('clearCurrentUser');
        }
      });
    },
    fetchBranches({ commit }) {
      const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
      onValue(branchesRef, (snapshot) => {
        const data = snapshot.val();
        const branches = [];
        if (data) {
          for (let id in data) {
            branches.push({ ...data[id], id });
          }
        }
        commit('setBranches', branches);
      }, (error) => {
        console.error("Error fetching branches:", error);
      });
    },
    createBranch({ commit }, branchData) {
      const branchesRef = ref(db, '/projects/superkomprasBackoffice/stores');
      push(branchesRef, branchData)
        .then((snapshot) => {
          commit('addBranch', { ...branchData, id: snapshot.key });
          Swal.fire('Success', 'Branch created successfully', 'success');
        })
        .catch((error) => {
          console.error("Error creating branch:", error);
          Swal.fire('Error', 'There was an error creating the branch', 'error');
        });
    },
    updateBranch({ commit }, branch) {
      const branchRef = ref(db, `/projects/superkomprasBackoffice/stores/${branch.id}`);
      update(branchRef, branch)
        .then(() => {
          commit('updateBranch', branch);
          Swal.fire('Success', 'Branch updated successfully', 'success');
        })
        .catch((error) => {
          console.error("Error updating branch:", error);
          Swal.fire('Error', 'There was an error updating the branch', 'error');
        });
    },
    deleteBranch({ commit }, branchId) {
      const branchRef = ref(db, `/projects/superkomprasBackoffice/stores/${branchId}`);
      remove(branchRef)
        .then(() => {
          commit('removeBranch', branchId);
          Swal.fire('Success', 'Branch deleted successfully', 'success');
        })
        .catch((error) => {
          console.error("Error deleting branch:", error);
          Swal.fire('Error', 'There was an error deleting the branch', 'error');
        });
    }
  },
  getters: {
    getBranchById: (state) => (id) => {
      return state.branches.find(b => b.id === id);
    }
  }
});