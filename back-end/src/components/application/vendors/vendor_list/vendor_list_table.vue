<template>
  <div class="table-responsive table-desi">
    <table class="user-table vendor-table table table-striped">
      <thead>
        <tr>
          <th>Vendor</th>
          <th>Products</th>
          <th>Store Name</th>
          <th>Create Date</th>
          <th>Wallet Balance</th>
          <th>Revenue</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vendor, index) in vendors" :key="index">
          <td>
            <span>
              <img :src="getImageUrl(vendor.image)" alt="users" />
            </span>
            <a href="javascript:void(0)">
              <span class="d-block">{{  vendor.name  }}</span>
            </a>
          </td>

          <td>{{  vendor.products  }}</td>

          <td>{{  vendor.storeName  }}</td>

          <td class="font-primary">{{  vendor.createDate  }}</td>

          <td>${{  vendor.walletBalance  }}</td>

          <td>${{  vendor.revenue  }}</td>

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
</template>

<script>
export default {
  props: ["vendors"],
  methods: {
    getImageUrl(path) {
      return require("@/assets/images/" + path);
    },
  },
};
</script>

<style>
</style>
