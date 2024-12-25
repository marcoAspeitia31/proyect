<template>
  <div class="welcome-container">
    <h1 class="welcome-title">Bienvenido</h1>

    <!-- Información de la sucursal seleccionada -->
    <div class="branch-info" @click="openModal">
      <h3 class="branch-name">Sucursal seleccionada</h3>
      <h3 class="branch-division">{{ selectedStore.division }}</h3>
      <h4 class="branch-value">{{ selectedStore.name }}</h4>
      <h4 class="branch-address">Dirección: {{ selectedStore.address }}</h4>
      <h4 class="branch-phone">Teléfono: {{ selectedStore.phone }}</h4>
    </div>

    <!-- Información del usuario -->
    <div class="user-info" @click="openCustomerModal">
      <h3 class="user-name">{{ selectedCustomer.name }}</h3>
      <h4 class="user-address">Dirección: {{ selectedCustomer.address }}</h4>
      <h4 class="user-phone">Teléfono: {{ selectedCustomer.phone }}</h4>
    </div>

    <!-- Acciones del usuario -->
    <div class="actions">
      <button class="new-order" @click="goToNewOrder">Nuevo pedido</button>
      <button class="continue-order" @click="continueOrder">
        Continuar Pedido
      </button>
    </div>

    <!-- Modal para selección de sucursal -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Selecciona una sucursal</h3>
        <ul class="store-list">
          <li
            v-for="store in stores"
            :key="store.id"
            class="store-item"
            @click="selectStore(store)"
          >
            <h3 class="store-division">{{ store.division }}</h3>
            <h3 class="store-name">{{ store.name }}</h3>
            <h4 class="store-address">Dirección:{{ store.address }}</h4>
            <h4 class="store-phone">Teléfono: {{ store.phone }}</h4>
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
        <h3>Selecciona un cliente</h3>
        <input
          type="text"
          v-model="phoneFilter"
          placeholder="Filtrar por teléfono"
        />
        <ul class="customer-list">
          <li
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="customer-item"
            @click="selectCustomer(customer)"
          >
            <h3 class="customer-name">{{ customer.name }}</h3>
            <h4 class="customer-address">Dirección: {{ customer.address }}</h4>
            <h4 class="customer-phone">Teléfono: {{ customer.phone }}</h4>
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
  name: "WelcomeComponent",
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
    this.fetchStores();
    this.fetchCustomers();
  },
  methods: {
    saveNewOrderToLocalStorage() {
      if (
        this.selectedStore.name !== "Seleccione una sucursal" &&
        this.selectedCustomer.name !== "Cliente no seleccionado"
      ) {
        const customerOpenCarts =
          JSON.parse(localStorage.getItem("customerOpenCarts")) || {};

        const customerId = this.selectedCustomer.id;
        console.log("ID del cliente seleccionado:", customerId);

        if (!customerId) {
          Swal.fire({
            title: "Error",
            text: "No se pudo encontrar el ID del cliente seleccionado.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }

        // Guardar datos en `customerOpenCarts` y asignar `customerUID`
        customerOpenCarts.customerUID = customerId;
        customerOpenCarts[customerId] = {
          store: {
            address: this.selectedStore.address,
            division: this.selectedStore.division,
            name: this.selectedStore.name,
            phone: this.selectedStore.phone,
          },
          customer: {
            address: this.selectedCustomer.address,
            name: this.selectedCustomer.name,
            phone: this.selectedCustomer.phone,
          },
        };

        console.log("Datos guardados en localStorage:", customerOpenCarts);
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
      this.selectedStore = store;
      this.closeModal();
    },

    selectCustomer(customer) {
      this.selectedCustomer = {
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
      };
      console.log("Cliente seleccionado:", this.selectedCustomer);
      this.closeCustomerModal();
    },

    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
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
            store.id = childSnapshot.key;
            this.stores.push(store);
          });
        },
        {
          onlyOnce: true,
        }
      );
    },
    openCustomerModal() {
      this.isCustomerModalOpen = true;
    },
    closeCustomerModal() {
      this.isCustomerModalOpen = false;
    },
    fetchCustomers() {
      const db = getDatabase();
      const dbRef = ref(db, "/projects/superkomprasBackoffice/customer");
      onValue(
        dbRef,
        (snapshot) => {
          this.customers = [];
          snapshot.forEach((childSnapshot) => {
            const customer = childSnapshot.val();
            customer.id = childSnapshot.key;
            this.customers.push(customer);
          });
          console.log("Clientes cargados:", this.customers);
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
      if (
        this.selectedStore.name === "Seleccione una sucursal" ||
        this.selectedCustomer.name === "Cliente no seleccionado"
      ) {
        this.validateSelection();
      } else {
        this.saveNewOrderToLocalStorage();
        this.$router.push({ name: "order_search" });
      }
    },
  },
};
</script>

<style scoped>
.welcome-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.welcome-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.branch-info {
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
}

.branch-selected {
  display: flex;
  align-items: center;
  gap: 10px;
}

.branch-icon {
  width: 40px;
  height: 40px;
}

.branch-name {
  font-weight: bold;
  color: #555;
}

.branch-value {
  color: #333;
}

.user-info {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.user-name {
  color: #e91e63;
  font-weight: bold;
  margin-bottom: 8px;
}

.user-address,
.user-phone {
  color: #555;
  margin: 5px 0;
}

.actions {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

.new-order {
  background-color: #e91e63;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
}

.continue-order {
  background-color: #3f51b5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
}

.new-order:hover {
  background-color: #d81b60;
}

.continue-order:hover {
  background-color: #303f9f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Fondo más oscuro para mejor contraste */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que la modal esté sobre otros elementos */
  transition: opacity 0.3s; /* Transición suave al mostrar */
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  transform: scale(0.9);
}

.modal-overlay.active .modal-content {
  transform: scale(1);
}

.store-list {
  list-style: none;
  padding: 0;
}

.store-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.store-name {
  font-weight: bold;
  color: #e91e63;
}

.store-address,
.store-phone {
  color: #555;
  margin: 5px 0;
}

.customer-list {
  list-style: none;
  padding: 0;
  text-align: left;
}

.customer-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.customer-name {
  font-weight: bold;
  color: #e91e63;
}

.customer-phone {
  color: #555;
  margin-top: 5px;
}
.select-button {
  background-color: #3f51b5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.9rem;
}

.select-button:hover {
  background-color: #303f9f;
}
</style>
