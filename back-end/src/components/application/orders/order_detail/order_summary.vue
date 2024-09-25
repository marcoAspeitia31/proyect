<template>
  <div class="order-success">
    <div class="row g-4">
      <h4>summery</h4>
      <ul class="order-details">
        <li>Order ID: {{  order.orderId  }}</li>
        <li>Order Date: {{  order.orderDate  }}</li>
        <li>Order Total: ${{  order.orderTotal  }}</li>
      </ul>

      <h4>shipping address</h4>
      <ul class="order-details">
        <li>{{  order.addressTop  }}</li>
        <li>{{  order.addressMiddle  }}</li>
        <li>{{  order.addressBottom  }}</li>
      </ul>

      <div class="payment-mode">
        <h4>payment method</h4>
        <p>{{  order.paymentMethod  }}</p>
      </div>

      <div class="delivery-sec">
        <h3>
          expected date of delivery:
          <span>{{  order.expectedDateOfDelivery  }}</span>
        </h3>
        <router-link to="/order_tracking" href="javascript:void(0)">track order</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["order"],
};
</script>

<style>
</style>
