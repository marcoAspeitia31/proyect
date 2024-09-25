<template>
  <div class="table-responsive table-details">
    <table class="table cart-table table-borderless">
      <thead>
        <tr>
          <th colspan="2">Items</th>
          <th class="text-end" colspan="2">
            <a href="javascript:void(0)" class="theme-color">Edit Items</a>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          class="table-order"
          v-for="(item, index) in items.tableBody"
          :key="index"
        >
          <td>
            <a href="javascript:void(0)">
              <img
                :src="getImageUrl(item.image)"
                class="img-fluid blur-up lazyload"
                alt=""
              />
            </a>
          </td>
          <td>
            <p>{{ item.title }}</p>
            <h5>{{ item.product }}</h5>
          </td>
          <td>
            <p>{{ item.qtyTitle }}</p>
            <h5>{{ item.quantity }}</h5>
          </td>
          <td>
            <p>{{ item.priceTitle }}</p>
            <h5>${{ item.price }}</h5>
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr class="table-order">
          <td colspan="3">
            <h5>Subtotal :</h5>
          </td>
          <td>
            <h4>${{ items.tableFooter.subTotal }}</h4>
          </td>
        </tr>

        <tr class="table-order">
          <td colspan="3">
            <h5>Shipping :</h5>
          </td>
          <td>
            <h4>${{ items.tableFooter.shipping }}</h4>
          </td>
        </tr>

        <tr class="table-order">
          <td colspan="3">
            <h5>Tax(GST) :</h5>
          </td>
          <td>
            <h4>${{ items.tableFooter.tax }}</h4>
          </td>
        </tr>

        <tr class="table-order">
          <td colspan="3">
            <h4 class="theme-color fw-bold">Total Price :</h4>
          </td>
          <td>
            <h4 class="theme-color fw-bold">
              ${{ items.tableFooter.totalPrice }}
            </h4>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  props: ["items"],
  methods: {
    getImageUrl(path) {
      return require("@/assets/images/" + path);
    },
  },
};
</script>

<style></style>
