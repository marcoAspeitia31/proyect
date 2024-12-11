<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <div class="table-responsive table-desi table-product">
            <table class="table table-1d all-package">
              <thead>
                <tr>
                  <th>Imagen del Producto</th>
                  <th>Nombre del Producto</th>
                  <th>Categoría</th>
                  <th>Cantidad Actual</th>
                  <th>Precio</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td>
                    <img :src="product.image" class="img-fluid" :alt="product.name" />
                  </td>
                  <td>
                    <a href="javascript:void(0)">{{ product.name }}</a>
                  </td>
                  <td>
                    <a href="javascript:void(0)">{{ product.category }}</a>
                  </td>
                  <td>{{ product.quantity }}</td>
                  <td class="td-price">${{ product.price }}</td>
                  <td class="td-check">
                    <span :class="{'lnr lnr-checkmark-circle': product.published, 'lnr lnr-cross-circle': !product.published}"></span>
                  </td>
                  <td>
                    <ul>
                      <li>
                        <router-link to="/order_detail">
                          <span class="lnr lnr-eye"></span>
                        </router-link>
                      </li>
                      <li>
                        <a href="javascript:void(0)">
                          <span class="lnr lnr-pencil"></span>
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)">
                          <i class="far fa-trash-alt theme-color"></i>
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="pagination-box">
          <nav class="ms-auto me-auto" aria-label="...">
            <ul class="pagination pagination-primary">
              <li class="page-item" :class="{'disabled': currentPage === 1}">
                <a class="page-link" href="javascript:void(0)" @click="changePage(currentPage - 1)">Anterior</a>
              </li>
              <li v-for="page in totalPages" :class="{'active': currentPage === page}" class="page-item">
                <a class="page-link" href="javascript:void(0)" @click="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{'disabled': currentPage === totalPages}">
                <a class="page-link" href="javascript:void(0)" @click="changePage(currentPage + 1)">Siguiente</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  title: "SK-Productos",
};
</script>

<style></style>
