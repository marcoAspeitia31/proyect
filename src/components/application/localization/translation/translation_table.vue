<template>
  <div class="table-responsive table-desi">
    <table class="user-table trans-table table table-striped">
      <thead>
        <tr>
          <th>User Key</th>
          <th>Russian</th>
          <th>Arabic</th>
          <th>English</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(word, index) in words" :key="index">
          <td>{{  word.userKey  }}</td>

          <td>{{  word.russian  }}</td>

          <td>{{  word.arabic  }}</td>

          <td>{{  word.english  }}</td>

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
  props: ["words"],
};
</script>

<style>
</style>
