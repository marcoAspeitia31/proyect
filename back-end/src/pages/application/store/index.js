

import { createStore } from 'vuex';
import { rolesPermissions } from '@/utils/permissions.js';
import { auth, db } from '@/firebase'; // Asegúrate de tener configurado Firebase
import { ref, onValue, push, update, remove } from 'firebase/database';

export default createStore({
  state: {
    currentUser: {
      name: '',
      email: '',
      rol: '',
      permissions: []
    },
    sucursales: [] // Estado para almacenar la lista de sucursales
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
      state.currentUser.permissions = rolesPermissions[user.rol] || [];
    },
    clearCurrentUser(state) {
      state.currentUser = {
        name: '',
        email: '',
        rol: '',
        permissions: []
      };
    },
    setSucursales(state, sucursales) {
      state.sucursales = sucursales;
    },
    addSucursal(state, sucursal) {
      state.sucursales.push(sucursal);
    },
    updateSucursal(state, updatedSucursal) {
      const index = state.sucursales.findIndex(s => s.id === updatedSucursal.id);
      if (index !== -1) {
        state.sucursales.splice(index, 1, updatedSucursal);
      }
    },
    removeSucursal(state, sucursalId) {
      state.sucursales = state.sucursales.filter(s => s.id !== sucursalId);
    }
  },
  actions: {
    fetchCurrentUser({ commit }) {
      // Usando Firebase Authentication para obtener el usuario actual
      auth.onAuthStateChanged((user) => {
        if (user) {
          // Obtener datos adicionales del usuario desde Firebase Database
          const userRef = ref(db, `/projects/superkomprasBackoffice/users/${user.uid}`);
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              commit('setCurrentUser', {
                name: data.name,
                email: data.email,
                rol: data.rol
              });
            }
          }, (error) => {
            console.error("Error al obtener los datos del usuario:", error);
          });
        } else {
          commit('clearCurrentUser');
        }
      });
    },
    fetchSucursales({ commit }) {
      const sucursalesRef = ref(db, '/projects/superkomprasBackoffice/sucursales');
      onValue(sucursalesRef, (snapshot) => {
        const data = snapshot.val();
        const sucursales = [];
        if (data) {
          for (let id in data) {
            sucursales.push({ ...data[id], id });
          }
        }
        commit('setSucursales', sucursales);
      }, (error) => {
        console.error("Error al obtener las sucursales:", error);
      });
    },
    createSucursal({ commit }, sucursalData) {
      const sucursalesRef = ref(db, '/projects/superkomprasBackoffice/sucursales');
      push(sucursalesRef, sucursalData)
        .then((snapshot) => {
          commit('addSucursal', { ...sucursalData, id: snapshot.key });
          alert('Sucursal creada correctamente');
        })
        .catch((error) => {
          console.error("Error al crear la sucursal:", error);
          alert('Hubo un error al crear la sucursal.');
        });
    },
    updateSucursal({ commit }, sucursal) {
      const sucursalRef = ref(db, `/projects/superkomprasBackoffice/sucursales/${sucursal.id}`);
      update(sucursalRef, sucursal)
        .then(() => {
          commit('updateSucursal', sucursal);
          alert('Sucursal actualizada correctamente');
        })
        .catch((error) => {
          console.error("Error al actualizar la sucursal:", error);
          alert('Hubo un error al actualizar la sucursal.');
        });
    },
    deleteSucursal({ commit }, sucursalId) {
      const sucursalRef = ref(db, `/projects/superkomprasBackoffice/sucursales/${sucursalId}`);
      remove(sucursalRef)
        .then(() => {
          commit('removeSucursal', sucursalId);
          alert('Sucursal eliminada correctamente');
        })
        .catch((error) => {
          console.error("Error al eliminar la sucursal:", error);
          alert('Hubo un error al eliminar la sucursal.');
        });
    }
  },
  getters: {
    getSucursalById: (state) => (id) => {
      return state.sucursales.find(s => s.id === id);
    }
  }
});