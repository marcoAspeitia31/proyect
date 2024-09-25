<template>
  <div class="order-image-contain">
    <h4>{{ product.name }}</h4>
    <div class="tracker-number">
      <p>
        Order Number : <span>{{ product.orderId }}</span>
      </p>
      <p>Brand : <span>Van Heusen</span></p>
      <p>
        Order Placed : <span>{{ product.orderPlaced }}</span>
      </p>
    </div>
    <h5>
      {{ product.message }}
    </h5>
  </div>
</template>

<script>
export default {
  props: ["product"],
};
</script>

<style></style>
