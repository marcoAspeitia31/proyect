<template>
  <div class="tracker-table">
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr class="table-head">
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Discription</th>
            <th scope="col">Location</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(order, index) in orders" :key="index">
            <td>
              <h6>{{ order.date }}</h6>
            </td>
            <td>
              <h6>{{ order.time }}</h6>
            </td>
            <td>
              <p class="fw-bold">{{ order.description }}</p>
            </td>
            <td>
              <h6>{{ order.location }}</h6>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["orders"],
};
</script>

<style></style>
