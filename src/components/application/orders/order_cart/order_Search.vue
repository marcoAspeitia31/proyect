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
      <div class="cart-icon" @click="openCart">
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
        <div class="product-image-container">
          <img
            :src="product.URLS512 || 'https://via.placeholder.com/150'"
            alt="Imagen del producto"
            class="product-image"
            @click="openModal(product)"
          />
          <img
            v-if="isOffer101(product)"
            src="https://firebasestorage.googleapis.com/v0/b/apphive-inc.appspot.com/o/usersmedia%2Fp6M835K2zkUCMUop3demkm?alt=media&token=be39dd3e-4f83-4502-9b44-5824832ad22f"
            class="offer-tag"
            alt="Etiqueta de Oferta"
          />
          <img
            v-if="isOffer103(product)"
            src="https://firebasestorage.googleapis.com/v0/b/apphive-inc.appspot.com/o/usersmedia%2F8nrXKvJUCVdUDFcMTC7Ddr?alt=media&token=d96ab3c7-0788-43cd-ab14-80bd9a0638fb"
            class="bonificacion-tag"
            alt="Etiqueta de Bonificación"
          />
        </div>
        <div class="product-details">
          <h3 class="product-title">{{ product.DESCRIPCION }}</h3>
          <p class="product-description">{{ product.CATEGORIAAPP }}</p>
          <p
            class="product-price"
            :class="{ 'original-price': hasOffer(product) }"
          >
            ${{ product[`PRECIO_${this.divisionSuffix}`] }}
          </p>
          <template v-if="hasOffer(product)">
            <p class="product-price offer-price" v-if="isOffer101(product)">
              ${{ product[`PRECIOOFERTA_${this.divisionSuffix}`] }}
            </p>
            <p
              class="product-price bonificacion-price"
              v-if="isOffer103(product)"
            >
              {{ getBonification(product) }} de bonificación a tarjeta club
            </p>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="no-products">
      <p v-if="query.trim()">No se encontraron productos.</p>
      <p v-else>Introduce un término de búsqueda para ver productos.</p>
    </div>
    <!-- Controles de paginación -->
    <div class="pagination-controls" v-if="totalPages > 1">
      <button
        class="pagination-btn"
        @click="prevPage"
        :disabled="currentPage <= 1"
      >
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        class="pagination-btn"
        @click="nextPage"
        :disabled="currentPage >= totalPages"
      >
        Siguiente
      </button>
    </div>
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">X</button>
        <img
          :src="selectedProduct.URLS512 || 'https://via.placeholder.com/150'"
          alt="Producto"
          class="modal-image"
        />
        <div class="modal-details">
          <h3>{{ selectedProduct.DESCRIPCION }}</h3>
          <p class="category">{{ selectedProduct.CATEGORIAAPP }}</p>
          <p>
            Precio Normal: ${{
              selectedProduct[`PRECIO_${this.divisionSuffix}`]
            }}
          </p>
          <p v-if="isOffer101(selectedProduct)">
            Precio de Oferta: ${{
              selectedProduct[`PRECIOOFERTA_${this.divisionSuffix}`]
            }}
          </p>
          <p v-if="isOffer103(selectedProduct)">
            Bonificación: ${{
              (
                selectedProduct[`PRECIO_${this.divisionSuffix}`] -
                selectedProduct[`PRECIOOFERTA_${this.divisionSuffix}`]
              ).toFixed(2)
            }}
            a tarjeta club
          </p>
          <div class="unit-toggle-container">
            <div class="quantity-and-units">
              <div class="quantity-selector">
                <button @click="decrementQty" class="quantity-btn">-</button>
                <span class="quantity-display">{{ quantity }}</span>
                <button @click="incrementQty" class="quantity-btn">+</button>
              </div>
              <div class="unit-buttons">
                <button
                  :class="{ active: selectedUnit === 'KG' }"
                  @click="selectUnit('KG')"
                  v-if="
                    selectedProduct.UNIDAD === 'KG' ||
                    selectedProduct.UNIDAD === 'ST/KG'
                  "
                >
                  PESO
                </button>
                <button
                  :class="{ active: selectedUnit === 'ST' }"
                  @click="selectUnit('ST')"
                >
                  PIEZA
                </button>
              </div>
            </div>
          </div>
        </div>
        <textarea placeholder="Agrega comentarios"></textarea>
        <button class="add-to-cart-btn" @click="addToCart">
          Agregar al Carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { apiBuscarProducto } from "@/boot/axios";
import { useRouter } from "vue-router"; // Importa useRouter

export default {
  setup() {
    const router = useRouter(); // Utiliza useRouter para controlar la navegación
    return { router };
  },
  data() {
    return {
      query: "",
      filteredProducts: [],
      currentPage: 1,
      totalPages: 1,
      hitsPerPage: 25,
      totalHits: 0,
      divisionSuffix: "", // Aquí se inicializa divisionSuffix
      showModal: false,
      selectedProduct: null,
      quantity: 1,
      selectedUnit: "ST",
      cartItems: JSON.parse(localStorage.getItem("carts")) || [],
    };
  },
  watch: {
    selectedStore(newStore, oldStore) {
      if (newStore && newStore !== oldStore) {
        this.divisionSuffix = newStore.division; // Asignación de divisionSuffix al cambiar de sucursal
        this.resetAndSearch(); // Reinicia la búsqueda con la nueva sucursal
      }
    },
  },
  created() {
    // Intenta obtener la división desde localStorage
    const customerOpenCarts =
      JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
    const activeCustomerUID = customerOpenCarts.customerUID; // El cliente activo

    if (
      activeCustomerUID &&
      customerOpenCarts[activeCustomerUID]?.store?.division
    ) {
      // Asigna la división desde el localStorage
      this.divisionSuffix = customerOpenCarts[activeCustomerUID].store.division;
    } else {
      console.warn(
        "No se pudo encontrar la división en customerOpenCarts. Usando valor predeterminado."
      );
      this.divisionSuffix = ""; // Valor predeterminado
    }

    // Continua con la lógica del componente
    this.searchProducts();
    this.updateCartCount();
  },

  computed: {
    cartItemCount() {
      const customerOperCarts =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
      const customerId = customerOperCarts.customerUID;

      if (!customerId) {
        return 0;
      }

      const carts = JSON.parse(localStorage.getItem("carts")) || {};
      if (carts[customerId] && carts[customerId].products) {
        return Object.keys(carts[customerId].products).length;
      }
      return 0;
    },
  },
  methods: {
    openCart() {
      const customerOperCarts =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
      const customerId = customerOperCarts.customerUID;

      if (customerId) {
        this.router
          .push({ name: "cart", params: { customerUID: customerId } })
          .catch((err) => {
            console.error("Routing error:", err);
          });
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo encontrar el ID del cliente.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
    hasOffer(product) {
      const tipoOfertaKey = `TIPOOFERTA_${this.divisionSuffix}`;
      return product[tipoOfertaKey] === 101 || product[tipoOfertaKey] === 103;
    },
    isOffer101(product) {
      const tipoOfertaKey = `TIPOOFERTA_${this.divisionSuffix}`;
      return (
        product[tipoOfertaKey] === 101 &&
        product[`PRECIOOFERTA_${this.divisionSuffix}`]
      );
    },
    isOffer103(product) {
      const tipoOfertaKey = `TIPOOFERTA_${this.divisionSuffix}`;
      return (
        product[tipoOfertaKey] === 103 &&
        product[`PRECIOOFERTA_${this.divisionSuffix}`]
      );
    },
    getBonification(product) {
      if (this.isOffer103(product)) {
        const precio = Number(product[`PRECIO_${this.divisionSuffix}`]);
        const precioOferta = Number(
          product[`PRECIOOFERTA_${this.divisionSuffix}`]
        );
        return (precio - precioOferta).toFixed(2);
      }
      return "0.00";
    },
    async searchProducts() {
      if (!this.divisionSuffix) {
        console.error("Sucursal no definida. No se puede buscar productos.");
        return;
      }

      if (this.query.trim()) {
        try {
          const payload = {
            page: this.currentPage - 1,
            hitsPerPage: this.hitsPerPage,
            sucursal: this.divisionSuffix,
            textoBusqueda: this.query,
          };

          const response = await apiBuscarProducto.post(
            "/buscar-producto",
            payload
          );

          if (response.data?.data?.hits) {
            this.filteredProducts = response.data.data.hits.map((product) => ({
              ...product,
              UNIDAD: product.UNIDAD || "ST",
            }));
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
    updateCartCount() {
      const customerOperCarts =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
      const customerId = customerOperCarts.customerUID;

      if (!customerId) {
        // En lugar de modificar cartItemCount, regresa 0 o realiza una operación en otro lugar
        console.log(
          "No se encontró customerUID. No se puede actualizar el conteo."
        );
        return;
      }

      const carts = JSON.parse(localStorage.getItem("carts")) || {};
      if (carts[customerId] && carts[customerId].products) {
        // Los datos de cartItemCount se actualizarán automáticamente
        return Object.keys(carts[customerId].products).length;
      }
      return 0;
    },
    addToCart() {
      if (!this.selectedProduct) {
        Swal.fire({
          title: "Error",
          text: "No se ha seleccionado un producto para agregar al carrito.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      const customerOperCarts =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
      const customerId = customerOperCarts.customerUID;

      if (!customerId) {
        Swal.fire({
          title: "Error",
          text: "No se pudo encontrar el ID del cliente.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      let productPrice = this.selectedProduct[`PRECIO_${this.divisionSuffix}`];
      if (this.isOffer101(this.selectedProduct)) {
        productPrice =
          this.selectedProduct[`PRECIOOFERTA_${this.divisionSuffix}`];
      } else if (this.isOffer103(this.selectedProduct)) {
        productPrice =
          this.selectedProduct[`PRECIOOFERTA_${this.divisionSuffix}`];
      }

      const cartItem = {
        name: this.selectedProduct.DESCRIPCION,
        picture:
          this.selectedProduct.URLS512 || "https://via.placeholder.com/150",
        price: productPrice * this.quantity,
        quantity: this.quantity,
        unit: this.selectedUnit,
      };

      let carts = JSON.parse(localStorage.getItem("carts")) || {};
      if (!carts[customerId]) {
        carts[customerId] = { products: {} };
      }

      const productCode = this.selectedProduct.CODIGO;
      if (carts[customerId].products[productCode]) {
        const existingProduct = carts[customerId].products[productCode];
        existingProduct.quantity += this.quantity;
        existingProduct.price += productPrice * this.quantity;
      } else {
        carts[customerId].products[productCode] = cartItem;
      }

      localStorage.setItem("carts", JSON.stringify(carts));
      this.updateCartCount();

      Swal.fire({
        title: "Producto agregado",
        text: "El producto se agregó al carrito correctamente.",
        icon: "success",
        confirmButtonText: "OK",
      });

      this.closeModal();
    },
    openModal(product) {
      this.selectedProduct = product;
      this.quantity = product.UNIDAD.includes("KG") ? 50 : 1;
      this.selectedUnit = product.UNIDAD.includes("KG") ? "KG" : "ST";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedProduct = null;
    },
    selectUnit(unit) {
      this.selectedUnit = unit;
      this.quantity = unit === "KG" ? 50 : 1;
    },
    incrementQty() {
      if (this.selectedUnit === "KG") {
        this.quantity += 50;
      } else if (this.selectedUnit === "ST") {
        this.quantity += 1;
      }
    },
    decrementQty() {
      if (this.selectedUnit === "KG" && this.quantity > 50) {
        this.quantity -= 50;
      } else if (this.selectedUnit === "ST" && this.quantity > 1) {
        this.quantity -= 1;
      }
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
  grid-template-columns: repeat(4, 1fr);
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
.offer-price {
  color: red; /* Color para el precio de oferta */
}

.original-price {
  text-decoration: line-through; /* Tachado para el precio original */
}

.product-image-container {
  position: relative;
  display: inline-block;
}

.product-image {
  display: block;
  width: 100%; /* Ajusta según necesites */
}

.offer-tag {
  position: absolute;
  top: 0; /* Ajusta la posición según necesites */
  right: 0; /* Ajusta la posición según necesites */
  width: 50%; /* Tamaño de la etiqueta de oferta */
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

.unit-toggle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.quantity-and-units {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  background-color: #e0e0e0;
}

.quantity-display {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.unit-buttons {
  display: flex;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
}

.unit-buttons button {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #6574cd;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.unit-buttons button.active {
  background-color: #3b4cca;
}

.unit-buttons button:not(.active) {
  background-color: #a2b2ec;
}

.unit-buttons button:hover {
  background-color: #8092d8;
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

.product-image-container {
  position: relative;
}

.bonificacion-tag {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
}

.product-price {
  font-size: 1rem;
}

.original-price {
  text-decoration: line-through;
  color: grey;
}
</style>
