<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <div class="bg-inner cart-section order-details-table">
            <div class="row g-4">
              <div class="col-xl-8">
                <order_detail_table :items="orderedItems" />
              </div>

              <div class="col-xl-4">
                <order_summary :order="orderedItems.orderDetails" />
              </div>
            </div>
          </div>
          <!-- section end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderDetail from "@/data/orderDetail.json";
import order_detail_table from "@/components/application/orders/order_detail/order_detail_table.vue";
import order_summary from "@/components/application/orders/order_detail/order_summary.vue";
export default {
  components: { order_detail_table, order_summary },
  title: "Voxo-Order Details",
  data() {
    return {
      orderedItems: OrderDetail.data,
    };
  },
};
</script>

<style></style>
