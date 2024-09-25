<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12 overflow-hidden">
                  <div class="order-left-image">
                    <div class="tracking-product-image">
                      <img
                        src="@/assets/images/profile/1.jpg"
                        class="img-fluid w-100 blur-up lazyload"
                        alt=""
                      />
                    </div>

                    <product :product="orderTracking.product" />
                  </div>
                </div>

                <orderProgress :progress="orderTracking.progress" />

                <div class="col-12 overflow-visible">
                  <ordersTable :orders="orderTracking.orders" />
                </div>
              </div>
            </div>
            <div class="card-footer text-end border-0 pt-0">
              <button class="btn btn-primary me-3">Submit</button>
              <button class="btn btn-outline-primary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderTracking from "@/data/orderTracking.json";
import ordersTable from "@/components/application/orders/order_tracking/ordersTable.vue";
import product from "@/components/application/orders/order_tracking/product.vue";
import orderProgress from "@/components/application/orders/order_tracking/orderProgress.vue";
import { mapState } from "vuex";
export default {
  title: "Voxo-Order Tracking",
  components: { ordersTable, product, orderProgress },
  data() {
    return {
      orderTracking: OrderTracking.data,
    };
  },
};
</script>

<style></style>
