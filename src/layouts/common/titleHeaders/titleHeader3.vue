<template>
  <div class="title-header title-header-block package-card">
    <div>
      <h5>{{ breadcrumbs.title }}</h5>
    </div>
    <div class="card-order-section">
      <ul>
        <li v-for="(li, index) in breadcrumbs.lis" :key="index">{{ li }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["breadcrumbs"],
};
</script>

<style></style>
