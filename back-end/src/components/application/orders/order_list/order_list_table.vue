<template>
  <div>
    <div class="table-responsive table-desi">
      <table class="table table-striped all-package">
        <thead>
          <tr>
            <th>Order Image</th>
            <th>Order Code</th>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Delivery Status</th>
            <th>Amount</th>
            <th>Option</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(order, index) in orders" :key="index">
            <td>
              <span>
                <img :src="getImageUrl(order.image)" alt="users" />
              </span>
            </td>

            <td>{{  order.orderId  }}</td>

            <td>{{  order.date  }}</td>

            <td>{{  order.paymentMethod  }}</td>

            <td class="order-success" v-if="order.deliveryStatus === 'Success'">
              <span>{{  order.deliveryStatus  }}</span>
            </td>
            <td class="order-cancle" v-else-if="order.deliveryStatus === 'Cancel'">
              <span>{{  order.deliveryStatus  }}</span>
            </td>
            <td class="order-pending" v-else-if="order.deliveryStatus === 'Pending'">
              <span>{{  order.deliveryStatus  }}</span>
            </td>

            <td>${{  order.amount  }}</td>
            <td>
              <ul>
                <li>
                  <router-link to="/order_detail" href="javascript:void(0)">
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
                    <span class="lnr lnr-trash"></span>
                  </a>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: ["orders", "currentPage"],
  methods: {
    getImageUrl(path) {
      return require("@/assets/images/" + path);
    },
  },
};
</script>

<style>
</style>
