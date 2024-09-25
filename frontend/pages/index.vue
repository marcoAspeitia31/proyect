<template>
  <div>
    <Fashion />
  </div>
</template>

<script>
import Fashion from "./home/fashion_demo/index.vue";
export default {
  components: {
    Fashion,
  },
  head() {
    return {
      title: "Fashion Store",
      link: [{ rel: "icon", type: "image/x-icon", href: "2.png" }],
    };
  },
};
</script>