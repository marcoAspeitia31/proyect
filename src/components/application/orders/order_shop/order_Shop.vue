<template>
  <div class="welcome-container">
    <h1 class="welcome-title">Bienvenido</h1>

    <!-- Información de la sucursal seleccionada -->
    <div class="branch-info" @click="openModal">
      <h3 class="branch-title">Sucursal Seleccionada</h3>
      <div class="branch-details">
        <p><strong>División:</strong> {{ selectedStore.division }}</p>
        <p><strong>Nombre:</strong> {{ selectedStore.name }}</p>
        <p><strong>Dirección:</strong> {{ selectedStore.address }}</p>
        <p><strong>Teléfono:</strong> {{ selectedStore.phone }}</p>
      </div>
    </div>

    <!-- Información del usuario -->
    <div class="user-info" @click="openCustomerModal">
      <h3 class="user-title">Cliente Seleccionado</h3>
      <div class="user-details">
        <p><strong>Nombre:</strong> {{ selectedCustomer.name }}</p>
        <p><strong>Dirección:</strong> {{ selectedCustomer.address }}</p>
        <p><strong>Teléfono:</strong> {{ selectedCustomer.phone }}</p>
      </div>
    </div>

    <!-- Acciones del usuario -->
    <div class="actions">
      <button class="action-button new-order" @click="goToNewOrder">
        Nuevo Pedido
      </button>
      <button class="action-button continue-order" @click="continueOrder">
        Continuar Pedido
      </button>
    </div>

    <!-- Modal para selección de sucursal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3 class="modal-title">Selecciona una Sucursal</h3>
        <ul class="store-list">
          <li
            v-for="store in stores"
            :key="store.id"
            class="store-item"
            @click="selectStore(store)"
          >
            <p><strong>División:</strong> {{ store.division }}</p>
            <p><strong>Nombre:</strong> {{ store.name }}</p>
            <p><strong>Dirección:</strong> {{ store.address }}</p>
            <p><strong>Teléfono:</strong> {{ store.phone }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal para selección de cliente -->
    <div
      v-if="isCustomerModalOpen"
      class="modal-overlay"
      @click.self="closeCustomerModal"
    >
      <div class="modal-content">
        <h3 class="modal-title">Selecciona un Cliente</h3>
        <input
          type="text"
          v-model="phoneFilter"
          class="filter-input"
          placeholder="Filtrar por teléfono"
        />
        <ul class="customer-list">
          <li
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="customer-item"
            @click="selectCustomer(customer)"
          >
            <p><strong>Nombre:</strong> {{ customer.name }}</p>
            <p><strong>Dirección:</strong> {{ customer.address }}</p>
            <p><strong>Teléfono:</strong> {{ customer.phone }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, onValue } from "firebase/database";
import Swal from "sweetalert2";

export default {
  title: "SK-Pedidos",
  data() {
    return {
      isModalOpen: false,
      stores: [],
      selectedStore: {
        name: "Seleccione una sucursal",
        address: "",
        division: "",
        phone: "",
      },
      isCustomerModalOpen: false,
      customers: [],
      selectedCustomer: {
        name: "Cliente no seleccionado",
        address: "",
        phone: "",
      },
      phoneFilter: "",
    };
  },
  computed: {
    filteredCustomers() {
      return this.customers.filter((customer) => {
        const phoneString = String(customer.phone);
        return phoneString.includes(this.phoneFilter);
      });
    },
  },
  mounted() {
    this.initializeUserData();
    this.fetchCustomers();
  },
  methods: {
    initializeUserData() {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      if (userInfo && userInfo.rol === "Sucursal" && userInfo.defaultStore) {
        this.fetchStoreForBranchUser(userInfo.defaultStore);
      } else {
        this.fetchStores();
      }
    },

    fetchStoreForBranchUser(divisionId) {
      const db = getDatabase();
      const dbRef = ref(db, `/projects/superkomprasBackoffice/stores`);
      onValue(
        dbRef,
        (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const store = childSnapshot.val();
            if (store.division === divisionId && store.status === "activo") {
              this.selectedStore = { ...store, id: childSnapshot.key };
              //console.log("Sucursal seleccionada automáticamente:",this.selectedStore);
            }
          });
        },
        {
          onlyOnce: true,
        }
      );
    },

    saveNewOrderToLocalStorage() {
      if (
        this.selectedStore.name !== "Seleccione una sucursal" &&
        this.selectedCustomer.name !== "Cliente no seleccionado"
      ) {
        const customerOpenCarts =
          JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
        const customerId = this.selectedCustomer.id;

        if (!customerId) {
          Swal.fire({
            title: "Error",
            text: "No se pudo encontrar el ID del cliente seleccionado.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }

        customerOpenCarts[customerId] = {
          store: this.selectedStore,
          customer: this.selectedCustomer,
        };

        localStorage.setItem(
          "customerOpenCarts",
          JSON.stringify(customerOpenCarts)
        );
        Swal.fire({
          title: "Pedido iniciado",
          text: "Se ha creado un nuevo pedido para este cliente y sucursal.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Faltan datos",
          text: "Por favor, seleccione tanto una sucursal como un cliente antes de continuar.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    },

    selectStore(store) {
      this.selectedStore = {
        id: store.id,
        name: store.name,
        address: store.address,
        phone: store.phone,
        division: store.division,
        latitude: store.latitude,
        longitude: store.longitude,
      };
      //console.log("Sucursal seleccionada:", this.selectedStore);
      this.closeModal();
    },
    selectCustomer(customer) {
      this.selectedCustomer = {
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        additionalPhone: customer.additionalPhone,
        clubCard: customer.clubCard,
        latitude: customer.latitude,
        longitude: customer.longitude,
        references: customer.references,
      };
      //console.log("Cliente seleccionado:", this.selectedCustomer);
      this.closeCustomerModal();
    },

    openModal() {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      if (userInfo && userInfo.rol === "Sucursal") {
        return;
      }
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },

    openCustomerModal() {
      this.isCustomerModalOpen = true;
    },

    closeCustomerModal() {
      this.isCustomerModalOpen = false;
    },

    fetchStores() {
      const db = getDatabase();
      const dbRef = ref(db, "/projects/superkomprasBackoffice/stores");
      onValue(
        dbRef,
        (snapshot) => {
          this.stores = [];
          snapshot.forEach((childSnapshot) => {
            const store = childSnapshot.val();
            if (store.status === "activo") {
              store.id = childSnapshot.key;
              this.stores.push(store);
            }
          });
        },
        {
          onlyOnce: true,
        }
      );
    },

    fetchCustomers() {
      const db = getDatabase();
      const dbRef = ref(db, "/projects/superkomprasBackoffice/clienteSAD");
      onValue(
        dbRef,
        (snapshot) => {
          this.customers = [];
          snapshot.forEach((childSnapshot) => {
            const customer = childSnapshot.val();
            customer.id = childSnapshot.key;
            this.customers.push(customer);
          });
        },
        {
          onlyOnce: true,
        }
      );
    },

    validateSelection() {
      if (
        this.selectedStore.name === "Seleccione una sucursal" ||
        this.selectedCustomer.name === "Cliente no seleccionado"
      ) {
        let message = "";
        if (this.selectedStore.name === "Seleccione una sucursal") {
          message += "Por favor, seleccione una sucursal. ";
        }
        if (this.selectedCustomer.name === "Cliente no seleccionado") {
          message += "Por favor, seleccione un cliente.";
        }
        Swal.fire({
          title: "Información faltante",
          text: message,
          icon: "warning",
          confirmButtonText: "Ok",
        });
      } else {
        this.saveNewOrderToLocalStorage();
      }
    },
    goToNewOrder() {
      const userInfo = JSON.parse(localStorage.getItem("user"));
      //console.log("Información del usuario:", userInfo);
      if (userInfo.rol === "Sistemas" || userInfo.rol === "Administrador") {
        this.proceedToCreateOrder();
        return;
      }
      if (
        this.selectedStore.name === "Seleccione una sucursal" ||
        this.selectedCustomer.name === "Cliente no seleccionado"
      ) {
        this.validateSelection();
        return;
      }
      if (userInfo.rol === "Sucursal") {
        const storeIdAsString = String(this.selectedStore.division);
        const defaultStoreAsString = String(userInfo.defaultStore);
        if (storeIdAsString !== defaultStoreAsString) {
          Swal.fire({
            title: "Acceso denegado",
            text: "No puedes crear pedidos para esta sucursal.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
        this.proceedToCreateOrder();
        return;
      }
    },
    proceedToCreateOrder() {
      this.saveNewOrderToLocalStorage();
      const customerOpenCarts =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
      const customerUID = this.selectedCustomer.id;
      if (!customerOpenCarts[customerUID]) {
        Swal.fire({
          title: "Error",
          text: "No se pudo iniciar un nuevo pedido. Faltan datos importantes.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      this.$router.push({
        name: "order_search",
        params: { customerUID: customerUID },
      });
    },

    continueOrder() {
      const customerOpenCarts =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};

      if (!customerOpenCarts.customerUID) {
        Swal.fire({
          title: "Error",
          text: "No hay un pedido previo que continuar.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      this.$router.push({ name: "order_continue" });
    },
  },
};
</script>

<style scoped>
.welcome-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fdfdfd;
  margin-bottom: 50px; /* Separación con el footer */
}

.welcome-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
  color: #444;
}

.branch-info,
.user-info {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.branch-info:hover,
.user-info:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.branch-title,
.user-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.branch-details p,
.user-details p {
  margin: 5px 0;
  font-size: 1rem;
  color: #555;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.action-button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.new-order {
  background-color: #d81b60;
  color: white;
}

.continue-order {
  background-color: #3b4cca;
  color: white;
}

.new-order:hover {
  background-color: #f32a74;
}

.continue-order:hover {
  background-color: #4457e7;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.store-list,
.customer-list {
  list-style: none;
  padding: 0;
}

.store-item,
.customer-item {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.2s;
}

.store-item:hover,
.customer-item:hover {
  background-color: #f0f0f0;
}

.filter-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}
</style>
