<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <order_list_table :orders="content" />
        </div>

        <!-- Pagination Box Start -->
        <pagination :allData="orders" />
        <!-- Pagination Box End -->
      </div>
    </div>
  </div>
</template>

<script>
import ordersData from '@/data/Pedidos.json';
import { mapState } from "vuex";
import order_list_table from "@/components/application/orders/order_list/order_list_table.vue";
import pagination from "@/layouts/elements/pagination.vue";

export default {
  components: { order_list_table, pagination },
  title: "SK-Pedidos",
  data() {
    return {
      orders: ordersData, 
    };
  },
  computed: {
    ...mapState({
      content: (state) => state.functionalities.content,
    }),
  },
};
</script>

<style></style>
