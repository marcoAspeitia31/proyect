<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <!-- Translation Table Start -->
        <div class="card-body">
          <translation_table :words="content" />
        </div>
        <!-- Translation Table End -->
        <!-- Pagination Start -->
        <pagination :allData="translationData" />
        <!-- Pagination End -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import translation_table from "@/components/application/localization/translation/translation_table.vue";
import pagination from "@/layouts/elements/pagination.vue";
export default {
  components: { translation_table, pagination },
  title: "Voxo-Translation",
  computed: {
    ...mapState({
      orders: (state) => state.orders.data,
      translationData: (state) => state.translation.data,
      content: (state) => state.functionalities.content,
    }),
  },
};
</script>

<style></style>
