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
import Orders from "@/data/orders.json";
import { mapState } from "vuex";
import order_list_table from "@/components/application/orders/order_list/order_list_table.vue";
import pagination from "@/layouts/elements/pagination.vue";
export default {
  components: { order_list_table, pagination },
  title: "Voxo-Order List",
  data() {
    return {
      orders: Orders.data,
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
