<template>
  <div class="open-carts">
    <h1 class="title">Carritos Abiertos</h1>
    <input
      type="text"
      v-model="searchPhone"
      placeholder="Filtrar por teléfono"
      class="search-input"
    />
    <div v-if="filteredCarts.length > 0" class="cart-grid">
      <div v-for="cart in filteredCarts" :key="cart.customerUID" class="cart">
        <div class="cart-info">
          <h3 class="customer-name">{{ cart.customer.name }}</h3>
          <p class="customer-phone">{{ cart.customer.phone }}</p>
          <p class="customer-address">{{ cart.customer.address }}</p>
        </div>
        <div class="cart-actions">
          <span v-if="cart.isLatest" class="latest-star">★</span>
          <button class="continue-btn" @click="continueOrder(cart.customerUID)">
            Continuar Pedido
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-results">
      <p>No se encontraron carritos abiertos para este filtro.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "OpenCarts",
  data() {
    return {
      carts: [], 
      searchPhone: "", 
    };
  },
  computed: {
    filteredCarts() {
      // Filtrar carritos por teléfono
      return this.carts.filter(
        (cart) =>
          cart.customer &&
          cart.customer.phone &&
          cart.customer.phone.includes(this.searchPhone)
      );
    },
  },
  methods: {
    loadCarts() {
      // Cargar carritos desde localStorage
      const cartsData =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
      const cartsArray = Object.entries(cartsData).map(([key, value]) => ({
        ...value,
        customerUID: key,
      }));

      // Identificar el último carrito abierto desde localStorage
      const latestCartUID = cartsData.customerUID;

      this.carts = cartsArray.map((cart) => ({
        ...cart,
        isLatest: cart.customerUID === latestCartUID,
      }));
    },
    continueOrder(customerUID) {
      if (!customerUID) {
        console.error("No se encontró el customerUID.");
        return;
      }

      // Actualizar el customerUID en localStorage
      const cartsData =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
      cartsData.customerUID = customerUID; // Actualizar el último customerUID
      localStorage.setItem("customerOpenCarts", JSON.stringify(cartsData));

      // Redirigir a la vista de detalle del pedido
      this.$router.push({
        name: "order_search",
        params: { customerUID },
      });
    },
  },
  mounted() {
    this.loadCarts(); // Cargar carritos al montar el componente
  },
};
</script>

<style scoped>
.open-carts {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-radius: 12px;
}

.title {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

.search-input {
  margin-bottom: 1.5rem;
  padding: 0.7rem;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.cart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cart-info {
  margin-bottom: 1rem;
}

.customer-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #d81b60;
}

.customer-phone,
.customer-address {
  font-size: 0.9rem;
  color: #666;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.continue-btn {
  background-color: #3b4cca;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.continue-btn:hover {
  background-color: #8092d8;
}

.latest-star {
  font-size: 1.2rem;
  color: #3b4cca;
}

.no-results {
  text-align: center;
  color: #999;
  font-size: 1rem;
}
</style>
