<template>
  <ol class="progtrckr" v-if="progress">
    <li :class="getClass(status)" v-for="(status, index) in progress" :key="index">
      <h5>{{ status.heading }}</h5>
      <h6>{{ status.time }}</h6>
    </li>
  </ol>
  <div v-else>
    <p>Loading progress data...</p>
  </div>
</template>

<script>
export default {
  props: ["progress"],
  methods: {
    getClass(status) {
      return {
        'progtrckr-todo': status.status === 'pending',
        'progtrckr-done': status.status === 'complete'
      };
    }
  }
};
</script>

<style></style>
