<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <currency_rate_table :currencies="content" />
        </div>

        <pagination :allData="currencyRate" />
      </div>
    </div>
  </div>
</template>

<script>
import CurrencyRate from "@/data/currencyRate.json";
import { mapState } from "vuex";
import currency_rate_table from "@/components/application/localization/currency_rate/currency_rate_table.vue";
import pagination from "@/layouts/elements/pagination.vue";
export default {
  components: { currency_rate_table, pagination },
  title: "Voxo-Currency Rate",
  data() {
    return {
      currencyRate: CurrencyRate.data,
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
