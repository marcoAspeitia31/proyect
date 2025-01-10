<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header bg-danger text-white d-flex align-items-center">
        <button class="btn btn-light btn-sm me-3" @click="volver">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h5 class="mb-0">Tu Carrito</h5>
      </div>
      <div class="card-body">
        <!-- Stepper -->
        <div
          class="stepper d-flex justify-content-between align-items-center mb-4"
        >
          <div :class="['step', { active: paso === 1 }]">1</div>
          <div :class="['step', { active: paso === 2 }]">2</div>
          <div :class="['step', { active: paso === 3 }]">3</div>
        </div>

        <!-- Contenido basado en el paso -->
        <div v-if="paso === 1">
          <!-- Paso 1: Resumen del carrito -->
          <div
            v-if="carrito.products.length"
            v-for="(product, key) in carrito.products"
            :key="key"
            class="card mb-3"
          >
            <div class="card-body d-flex align-items-center">
              <img
                :src="product.picture"
                alt="Producto"
                class="img-thumbnail"
                style="
                  width: 80px;
                  height: 80px;
                  object-fit: cover;
                  margin-right: 15px;
                "
              />
              <div class="flex-grow-1">
                <h6 class="mb-1">{{ product.name }}</h6>
                <p class="text-muted mb-1">
                  Cantidad: {{ mostrarCantidad(product) }}
                </p>
                <p class="text-danger mb-1">
                  Precio: {{ formatoPrecio(product.price) }}
                </p>
              </div>
              <button
                class="btn btn-danger btn-sm"
                @click="eliminarProducto(key)"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          <div v-else>
            <p>No hay productos en el carrito.</p>
          </div>
          <button class="btn btn-link text-danger mb-3" @click="vaciarCarrito">
            Vaciar carrito
          </button>

          <!-- Información del cliente -->
          <div class="card p-3 mb-3">
            <p class="mb-1"><strong>Nombre:</strong> {{ cliente.name }}</p>
            <p class="mb-1">
              <strong>Dirección:</strong> {{ cliente.address }}
            </p>
            <p class="mb-1"><strong>Teléfono:</strong> {{ cliente.phone }}</p>
          </div>

          <div class="text-end">
            <p class="subtotal">
              <strong>Subtotal:</strong> {{ formatoPrecio(subtotal) }}
            </p>
            <p class="subtotal">
              <strong>Envío:</strong> {{ formatoPrecio(envio) }}
            </p>
            <p class="subtotal">
              <strong>Total:</strong> {{ formatoPrecio(total) }}
            </p>
          </div>
        </div>

        <div v-else-if="paso === 2">
          <!-- Paso 2: Métodos de pago -->
          <h6><strong>Entrega</strong></h6>
          <p>{{ cliente.name }}</p>
          <p>{{ cliente.address }}</p>
          <p>{{ cliente.phone }}</p>

          <h6><strong>Método de Pago</strong></h6>
          <div
            class="card mb-3 payment-card"
            :class="{ active: metodoPago.efectivo }"
          >
            <div class="card-body d-flex align-items-center">
              <i class="fas fa-money-bill-alt me-3 text-primary"></i>
              <div class="flex-grow-1">
                <h6>Efectivo</h6>
                <p class="text-muted mb-0">Pagará con billete</p>
              </div>
              <input
                type="checkbox"
                v-model="metodoPago.efectivo"
                class="form-check-input"
                @change="validarMetodoPago('efectivo')"
              />
            </div>
          </div>

          <!-- Recuadro para billete -->
          <div v-if="metodoPago.efectivo" class="card p-3 mb-3">
            <h6><strong>¿Con qué billete pagará?</strong></h6>
            <select v-model="billeteSeleccionado" class="form-select">
              <option value="100">$100</option>
              <option value="200">$200</option>
              <option value="500">$500</option>
              <option value="1000">$1000</option>
              <option value="otro">Otro</option>
            </select>
            <div v-if="billeteSeleccionado === 'otro'" class="mt-3">
              <label for="billeteOtro"
                ><strong>Ingrese la cantidad:</strong></label
              >
              <input
                id="billeteOtro"
                v-model="billeteOtro"
                type="number"
                min="1"
                placeholder="Cantidad"
                class="form-control"
              />
            </div>
          </div>

          <div
            class="card mb-3 payment-card"
            :class="{ active: metodoPago.terminal }"
          >
            <div class="card-body d-flex align-items-center">
              <i class="fas fa-credit-card me-3 text-primary"></i>
              <div class="flex-grow-1">
                <h6>Terminal</h6>
                <p class="text-muted mb-0">Pagará con tarjeta</p>
              </div>
              <input
                type="checkbox"
                v-model="metodoPago.terminal"
                class="form-check-input"
                @change="validarMetodoPago('terminal')"
              />
            </div>
          </div>

          <h6><strong>Comentarios</strong></h6>
          <textarea
            v-model="comentarios"
            class="form-control"
            placeholder="Comentarios"
          ></textarea>
          <div class="text-end mt-3">
            <p class="subtotal">
              <strong>Subtotal:</strong> {{ formatoPrecio(subtotal) }}
            </p>
            <p class="subtotal">
              <strong>Envío:</strong> {{ formatoPrecio(envio) }}
            </p>
            <p class="subtotal">
              <strong>Total:</strong> {{ formatoPrecio(total) }}
            </p>
          </div>
        </div>
      </div>

      <div class="card-footer text-end">
        <button v-if="paso === 1" class="btn btn-danger" @click="avanzarPaso">
          Continuar compra <i class="fas fa-arrow-right"></i>
        </button>
        <button
          v-else-if="paso === 2"
          class="btn btn-danger"
          @click="finalizarCompra"
        >
          Finalizar Compra <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  data() {
    return {
      paso: 1,
      customerUID: null,
      carrito: {
        products: [],
      },
      cliente: {
        name: "",
        address: "",
        phone: "",
      },
      envio: 0, // Valor de envío fijo
      subtotal: 0,
      total: 0,
      metodoPago: {
        efectivo: false,
        terminal: false,
      },
      billeteSeleccionado: null,
      billeteOtro: null,
      comentarios: "",
    };
  },
  mounted() {
    this.obtenerCustomerUID();
    this.cargarDatos();
  },
  methods: {
    formatoPrecio(precio) {
      return precio.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    mostrarCantidad(product) {
      if (product.unit === "KG") {
        if (product.quantity >= 1000) {
          const cantidadEnKg = product.quantity / 1000;
          return `${cantidadEnKg.toFixed(1)} KG`; // Muestra en kilogramos si es 1000 gramos o más
        }
        return `${product.quantity} g`; // Muestra en gramos si es menos de 1000
      }
      return product.quantity; // Muestra la cantidad sin unidad si no es en KG
    },
    obtenerCustomerUID() {
      const customerOpenCarts =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};
      this.customerUID = customerOpenCarts.customerUID || null;

      if (!this.customerUID) {
        alert("No se encontró un UID seleccionado.");
      }
    },
    cargarDatos() {
      if (!this.customerUID) return;

      const carts = JSON.parse(localStorage.getItem("carts")) || {};
      const customerOpenCarts =
        JSON.parse(localStorage.getItem("customerOpenCarts")) || {};

      if (customerOpenCarts[this.customerUID] && carts[this.customerUID]) {
        const selectedCustomer =
          customerOpenCarts[this.customerUID].customer || {};
        const selectedCart = carts[this.customerUID]?.products || {};

        this.carrito.products = Object.values(selectedCart);
        this.cliente.name = selectedCustomer.name || "Sin nombre";
        this.cliente.address = selectedCustomer.address || "Sin dirección";
        this.cliente.phone = selectedCustomer.phone || "Sin teléfono";

        this.calcularSubtotal();
      }
    },
    calcularSubtotal() {
      this.subtotal = this.carrito.products.reduce((total, product) => {
        return total + parseFloat(product.price);
      }, 0);
      this.total = this.subtotal + this.envio; // Calcula el total añadiendo el envío
    },
    validarMetodoPago(metodo) {
      if (
        metodo === "efectivo" &&
        this.metodoPago.efectivo &&
        this.metodoPago.terminal
      ) {
        this.metodoPago.efectivo = false;
        Swal.fire({
          icon: "error",
          title: "Selección inválida",
          text: "Solo puedes seleccionar un método de pago.",
        });
      } else if (
        metodo === "terminal" &&
        this.metodoPago.efectivo &&
        this.metodoPago.terminal
      ) {
        this.metodoPago.terminal = false;
        Swal.fire({
          icon: "error",
          title: "Selección inválida",
          text: "Solo puedes seleccionar un método de pago.",
        });
      }
    },
    avanzarPaso() {
      this.paso++;
    },
    volver() {
      if (this.paso === 1) {
        this.$router.push({
          name: "order_search",
          query: { customerUID: this.customerUID },
        });
      } else {
        this.paso--;
      }
    },
    vaciarCarrito() {
      this.carrito.products = [];
      this.actualizarLocalStorage();
      this.subtotal = 0;
      this.total = this.envio;
    },
    eliminarProducto(index) {
      this.carrito.products.splice(index, 1);
      this.actualizarLocalStorage();
      this.calcularSubtotal();
    },
    actualizarLocalStorage() {
      const carts = JSON.parse(localStorage.getItem("carts")) || {};
      carts[this.customerUID].products = this.carrito.products.reduce(
        (acc, product, i) => {
          acc[i] = product;
          return acc;
        },
        {}
      );
      localStorage.setItem("carts", JSON.stringify(carts));
    },
    finalizarCompra() {
      const billete =
        this.billeteSeleccionado === "otro"
          ? this.billeteOtro
          : this.billeteSeleccionado;
      alert(
        "Compra finalizada con los siguientes detalles:\n" +
          `Método de Pago: ${this.metodoPago.efectivo ? "Efectivo" : ""} ${
            this.metodoPago.terminal ? "Terminal" : ""
          }\n` +
          `Billete Seleccionado: ${billete || "N/A"}\n` +
          `Comentarios: ${this.comentarios}`
      );
    },
  },
};
</script>

<style>
.stepper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.step {
  width: 30px;
  height: 30px;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
}
.step.active {
  background: #3b4cca;
}
.img-thumbnail {
  border-radius: 5px;
}
.payment-card {
  border: 1px solid #e0e0e0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.payment-card.active {
  border: 2px solid #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}
.subtotal {
  font-size: 1rem;
  font-weight: bold;
}
</style>
