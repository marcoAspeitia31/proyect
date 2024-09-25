<template>
  <div class="page-wrapper compact-wrapper dark-sidebar" id="pageWrapper">
    <header1 />
    <div class="page-body-wrapper">
      <sidebar1 />
      <div class="page-body">
        <div class="container-fluid">
          <titleHeader1
            v-if="breadcrumbs.type === 1"
            :breadcrumbs="breadcrumbs"
          />
          <titleHeader2
            v-if="breadcrumbs.type === 2"
            :breadcrumbs="breadcrumbs"
          />
          <titleHeader3
            v-if="breadcrumbs.type === 3"
            :breadcrumbs="breadcrumbs"
          />
          <slot></slot>
        </div>
        <footer1 />
      </div>
    </div>
    <div class="customizer-links" @click.prevent="toggleDirection">
      <button class="rtl-btn" :class="direction == 'rtl' ? 'rtl' : ''">
        {{ direction == "ltr" ? "RTL" : "LTR" }}
      </button>
    </div>
    <div
      class="bg-overlay active"
      v-if="overlay"
      @click.prevent="closeOverlay"
    ></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import sidebar1 from "@/layouts/common/sidebar/sidebar1.vue";
import header1 from "@/layouts/common/header/header1.vue";
import footer1 from "@/layouts/common/footer/footer1.vue";
import titleHeader1 from "@/layouts/common/titleHeaders/titleHeader1.vue";
import titleHeader2 from "@/layouts/common/titleHeaders/titleHeader2.vue";
import titleHeader3 from "@/layouts/common/titleHeaders/titleHeader3.vue";
export default {
  components: {
    sidebar1,
    header1,
    footer1,
    titleHeader1,
    titleHeader2,
    titleHeader3,
  },
  props: ["breadcrumbs"],
  data() {
    return {
      windowWidth: 0,
      direction: "ltr",
    };
  },
  methods: {
    closeOverlay() {
      this.$store.dispatch("clickEvents/closeOverlay");
    },
    toggleDirection() {
      this.direction === "ltr"
        ? (this.direction = "rtl")
        : (this.direction = "ltr");
    },
    handleWindowWidth() {
      this.windowWidth = screen.availWidth;
      if (this.windowWidth < 991) {
        this.$store.dispatch("clickEvents/closeOverlay");
      } else {
        this.$store.dispatch("clickEvents/showSidebar");
      }
    },
  },
  computed: {
    ...mapState({
      overlay: (state) => state.clickEvents.overlay,
    }),
  },
  watch: {
    direction: function () {
      if (this.direction == "ltr") {
        document.documentElement.dir = "ltr";
        document.body.classList.remove("rtl");
        document.body.classList.add("ltr");
      } else {
        document.documentElement.dir = "rtl";
        document.body.classList.remove("ltr");
        document.body.classList.add("rtl");
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleWindowWidth);
  },
};
</script>

<style></style>
