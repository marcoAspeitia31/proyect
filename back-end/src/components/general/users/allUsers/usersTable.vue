<template>
  <div>
    <div class="table-responsive table-desi">
      <table class="user-table table table-striped">
        <thead>
          <tr>
            <th>
              <span class="form-check user-checkbox">
                <input
                  class="checkbox_animated"
                  type="checkbox"
                  v-model="checkAll"
                  value="checkAll"
                  id="checkall"
                />
              </span>
              User
            </th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Country</th>
            <th>Last Login</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>
              <div class="form-check user-checkbox">
                <input
                  class="checkbox_animated check-it"
                  v-model="checkBoxes"
                  type="checkbox"
                  :value="index"
                  id="flexCheckDefault"
                />
              </div>
              <span>
                <img :src="getImageUrl(user.image)" alt="users" />
              </span>
            </td>
            <td>
              <a href="javascript:void(0)">
                <span class="d-block">{{ user.name }}</span>
                <span>{{ user.place }}</span>
              </a>
            </td>
            <td>{{ user.phone }}</td>
            <td>{{ user.email }}</td>
            <td class="font-primary">{{ user.country }}</td>
            <td>{{ user.lastLogin }}</td>
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
  props: ["users"],
  data() {
    return {
      checkAll: "",
      checkBoxes: [],
    };
  },
  watch: {
    checkAll: function () {
      if (this.checkAll) {
        for (var i = 0; i < this.users.length; i++) this.checkBoxes.push(i);
      } else this.checkBoxes = [];
    },
  },
  methods: {
    getImageUrl(path) {
      return require("@/assets/images/" + path);
    },
  },
};
</script>

<style></style>
