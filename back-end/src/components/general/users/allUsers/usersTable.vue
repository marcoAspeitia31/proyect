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
                  v-model="allSelected"
                />
              </span>
              ID
            </th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Contraseña</th>
            <th>Rol</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id">
            <td>
              <div class="form-check user-checkbox">
                <input
                  class="checkbox_animated check-it"
                  v-model="selectedUsers"
                  type="checkbox"
                  :value="index"
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
                  <router-link to="/order_detail">
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
      selectedUsers: []
    };
  },
  computed: {
    allSelected: {
      get() {
        return this.selectedUsers.length === this.users.length;
      },
      set(value) {
        this.selectedUsers = value ? this.users.map((_, index) => index) : [];
      }
    }
  },
  methods: {
    getImageUrl(path) {
      return require(`@/assets/images/${path}`);
    }
  }
};
</script>
