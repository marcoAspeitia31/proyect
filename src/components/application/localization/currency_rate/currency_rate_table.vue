<template>
  <div>
    <div class="table-responsive table-desi">
      <table
        id="example"
        class="user-table trans-table rate-table table table-striped"
      >
        <thead>
          <tr>
            <th>Currency Title</th>
            <th>USD</th>
            <th>Code</th>
            <th>Exchange Rate</th>
            <th>Options</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(currency, index) in currencies" :key="index">
            <td>{{ currency.currencyTitle }}</td>
            <td>{{ currency.usd }}</td>
            <td>{{ currency.code }}</td>
            <td>{{ currency.exchangeRate }}</td>
            <td>
              <ul>
                <li>
                  <router-link to="/order_detail" href="javascript:void(0)">
                    <span class="lnr lnr-eye"></span>
                  </router-link>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <span class="lnr lnr-pencil"></span>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0)">
                    <span class="lnr lnr-trash"></span>
                  </a>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currencies"],
};
</script>

<style></style>
