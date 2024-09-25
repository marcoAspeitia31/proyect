<template>
  <div class="pagination-box">
    <nav class="ms-auto me-auto" aria-label="...">
      <ul class="pagination pagination-primary">
        <li class="page-item" :class="[{ disabled: currentPage == 1 }]">
          <a
            class="page-link"
            href="javascript:void(0)"
            @click.prevent="
              changePage(currentPage - 1 > 0 ? currentPage - 1 : changePage)
            "
            >Previous</a
          >
        </li>

        <li
          class="page-item"
          :class="[{ active: currentPage == page }]"
          v-for="(page, index) in pages"
          :key="index"
        >
          <a
            class="page-link"
            href="javascript:void(0)"
            @click.prevent="changePage(page)"
            >{{ page }}</a
          >
        </li>
        <li
          class="page-item"
          :class="[{ disabled: currentPage == totalPages }]"
        >
          <a
            class="page-link"
            href="javascript:void(0)"
            @click.prevent="
              changePage(
                currentPage + 1 <= totalPages ? currentPage + 1 : changePage
              )
            "
            >Next</a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  props: ["allData"],
  data() {
    return {
      totalPages: 10,
      currentPage: 1,
      contentToShow: 10,
      pages: [],
    };
  },
  methods: {
    changePage(toPage) {
      let toSend = {
        toPage: toPage,
        totalPages: this.totalPages,
        currentPage: this.currentPage,
        allData: this.allData,
      };
      toPage <= this.totalPages && toPage > 0 && (this.currentPage = toPage);
      this.$store
        .dispatch("functionalities/changePage", toSend)
        .then((response) => {
          this.pages = [...response];
          this.currentPage = toPage;
        });
    },
  },
  mounted() {
    this.totalPages = Math.ceil(this.allData.length / this.contentToShow);
    let toSend = {
      toPage: 1,
      totalPages: this.totalPages,
      currentPage: 1,
      allData: this.allData,
    };
    this.$store
      .dispatch("functionalities/changePage", toSend)
      .then((response) => (this.pages = [...response]));
  },
};
</script>

<style></style>
