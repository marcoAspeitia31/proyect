<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <!-- Table Start -->
        <div class="card-body">
          <vendor_list_table :vendors="content" />
        </div>
        <!-- Table End -->

        <!-- Pagination Start -->
        <pagination :allData="vendorsData" />
        <!-- Pagination End -->
      </div>
    </div>
  </div>
</template>

<script>
import Vendors from "@/data/vendors.json";
import vendor_list_table from "@/components/application/vendors/vendor_list/vendor_list_table.vue";
import pagination from "@/layouts/elements/pagination.vue";
import { mapState } from "vuex";
export default {
  components: { vendor_list_table, pagination },
  title: "SK-Registrar",
  data() {
    return {
      vendorsData: Vendors.data,
    };
  },
  computed: {
    ...mapState({
      content: (state) => state.functionalities.content,
    }),
  },
};
</script>

<style></style>
