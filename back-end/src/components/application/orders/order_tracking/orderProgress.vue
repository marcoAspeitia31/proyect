<template>
  <ol class="progtrckr">
    <li
      :class="[
        { 'progtrckr-todo': status.status === 'pending' },
        { 'progtrckr-done': status.status === 'complete' },
      ]"
      v-for="(status, index) in progress"
      :key="index"
    >
      <h5>{{ status.heading }}</h5>
      <h6>{{ status.time }}</h6>
    </li>
  </ol>
</template>

<script>
export default {
  props: ["progress"],
};
</script>

<style></style>
