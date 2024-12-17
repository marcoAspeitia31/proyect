<template>
  <div class="search-panel">
    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input
        type="text"
        v-model="query"
        @keyup.enter="resetAndSearch"
        placeholder="Buscar productos..."
        class="search-input"
      />
      <button @click="resetAndSearch" class="search-button">🔍</button>

      <!-- Ícono del carrito -->
      <div class="cart-icon">
        🛒
        <span class="cart-counter">{{ cartItemCount }}</span>
      </div>
    </div>

    <!-- Información de resultados y paginación -->
    <div class="pagination-info" v-if="filteredProducts.length">
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <span>{{ filteredProducts.length }} de {{ totalHits }} Resultados</span>
    </div>

    <!-- Lista de productos -->
    <div class="products-grid" v-if="filteredProducts.length">
      <div
        v-for="product in filteredProducts"
        :key="product.CODIGO"
        class="product-card"
      >
        <img
          :src="product.URLS512 || 'https://via.placeholder.com/150'"
          alt="Imagen del producto"
          class="product-image"
          @click="openModal(product)"
        />
        <div class="product-details">
          <h3 class="product-title">{{ product.DESCRIPCION }}</h3>
          <p class="product-description">{{ product.CATEGORIAAPP }}</p>
          <p class="product-price">${{ getDynamicPrice(product) }}</p>
          <button class="add-to-cart-btn" @click="addToCart(product)">
            Agregar
          </button>
        </div>
      </div>
    </div>

    <div v-else class="no-products">
      <p v-if="query.trim()">No se encontraron productos.</p>
      <p v-else>Introduce un término de búsqueda para ver productos.</p>
    </div>

    <!-- Controles de paginación -->
    <div class="pagination-controls" v-if="filteredProducts.length">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        Anterior
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage >= totalPages"
        class="pagination-btn"
      >
        Siguiente →
      </button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">X</button>
        <!-- Ícono del carrito en modal -->
        <div class="cart-icon-modal">
          🛒
          <span class="cart-counter">{{ cartItemCount }}</span>
        </div>
        <img
          :src="selectedProduct.URLS512 || 'https://via.placeholder.com/150'"
          alt="Producto"
          class="modal-image"
        />
        <div class="modal-details">
          <h3>{{ selectedProduct.DESCRIPCION }}</h3>
          <p class="category">{{ selectedProduct.CATEGORIAAPP }}</p>
          <div class="counter">
            <button @click="decrementQty">-</button>
            <span>{{ quantity }}</span>
            <button @click="incrementQty">+</button>
          </div>
          <textarea placeholder="Agrega comentarios"></textarea>
          <button class="add-to-cart-btn" @click="addToCart(selectedProduct)">
            ${{ getDynamicPrice(selectedProduct) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiBuscarProducto } from "@/boot/axios";

export default {
  data() {
    return {
      query: "",
      filteredProducts: [],
      currentPage: 1,
      totalPages: 1,
      hitsPerPage: 20,
      totalHits: 0,
      divisionSuffix: "",
      showModal: false,
      selectedProduct: null,
      quantity: 1,
      cartItems: [],
    };
  },
  created() {
    this.getDivisionSuffix();
  },
  computed: {
    cartItemCount() {
      return this.cartItems.length;
    },
  },
  methods: {
    getDivisionSuffix() {
      const customerOperCarts =
        JSON.parse(localStorage.getItem("customerOperCarts")) || {};
      const store = customerOperCarts.selectedStore;

      if (store && store.division) {
        this.divisionSuffix = store.division;
      } else {
        this.divisionSuffix = "";
      }
    },
    async searchProducts() {
      const customerOperCarts =
        JSON.parse(localStorage.getItem("customerOperCarts")) || {};
      const sucursal = customerOperCarts.selectedStore
        ? customerOperCarts.selectedStore.division
        : "Sucursal no definida";

      if (this.query.trim()) {
        try {
          const response = await apiBuscarProducto({
            method: "POST",
            url: "/buscar-producto",
            data: {
              page: this.currentPage,
              hitsPerPage: this.hitsPerPage,
              sucursal,
              textoBusqueda: this.query,
            },
          });

          if (response.data?.data?.hits) {
            this.filteredProducts = response.data.data.hits;
            this.totalPages = response.data.data.nbPages || 1;
            this.totalHits = response.data.data.nbHits || 0;
          } else {
            this.filteredProducts = [];
            this.totalPages = 1;
            this.totalHits = 0;
          }
        } catch (error) {
          console.error("Error al buscar productos:", error);
          this.filteredProducts = [];
        }
      } else {
        this.filteredProducts = [];
      }
    },
    getDynamicPrice(product) {
      const priceKey = `PRECIO_${this.divisionSuffix}`;
      return product[priceKey] || "N/A";
    },
    resetAndSearch() {
      this.currentPage = 1;
      this.searchProducts();
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.searchProducts();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.searchProducts();
      }
    },
    addToCart(product) {
      this.cartItems.push(product);
      console.log("Producto añadido al carrito:", product);
    },
    openModal(product) {
      this.selectedProduct = product;
      this.quantity = 1;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    incrementQty() {
      this.quantity++;
    },
    decrementQty() {
      if (this.quantity > 1) this.quantity--;
    },
  },
};
</script>

<style>
/* Panel de búsqueda */
.search-panel {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f4f4f4;
  font-family: Arial, sans-serif;
}

/* Barra de búsqueda */
.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.search-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 5px 0 0 5px;
}

.search-button {
  padding: 10px 15px;
  background-color: #2e46d3;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.search-button:hover {
  background-color: #3552d4;
}

/* Ícono del carrito */
.cart-icon,
.cart-icon-modal {
  position: relative;
  font-size: 24px;
  margin-left: 15px;
  color: #ff4081;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-counter {
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: #ff4081;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}

/* Información de paginación */
.pagination-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

/* Controles de paginación */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.pagination-btn {
  background-color: #ff4081;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Grilla de productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.product-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 120px;
  object-fit: contain;
}

.product-details {
  margin-top: 10px;
}

.product-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.product-description {
  font-size: 12px;
  color: #777;
  margin-bottom: 5px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #ff4081;
  margin-bottom: 10px;
}

.add-to-cart-btn {
  background-color: #ff4081;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
}

.add-to-cart-btn:hover {
  background-color: #e73571;
}

/* Modal */
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
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  position: relative;
  text-align: center;
  font-family: Arial, sans-serif;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4081;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

/* Ícono de carrito en la modal */
.cart-icon-modal {
  margin: 10px auto;
  font-size: 24px;
}

/* Imagen del Producto */
.modal-image {
  width: 100%;
  max-height: 150px;
  object-fit: contain;
  margin-bottom: 10px;
}

.modal-details h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.modal-details .category {
  font-size: 14px;
  color: #888;
  margin-bottom: 15px;
}

/* Contador de cantidad */
.counter {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 10px 0;
}

.counter button {
  background-color: #e0e0e0;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.counter span {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* Área de comentarios */
textarea {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  resize: none;
}

/* Botón Agregar */
.add-to-cart-btn {
  background-color: #ff4081;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px auto 0;
}

.add-to-cart-btn:hover {
  background-color: #e73571;
}

.add-to-cart-btn::before {
  content: "🛒";
  margin-right: 8px;
}

/* Sin productos */
.no-products {
  text-align: center;
  color: #777;
  font-size: 16px;
  margin-top: 20px;
}
</style>
