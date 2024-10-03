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
            </th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>
              <div class="form-check user-checkbox">
                <input
                  class="checkbox_animated check-it"
                  v-model="selectedUsers"
                  type="checkbox"
                  :value="index"
                />
              </div>
            </td>
            <td>
              <a href="javascript:void(0)">
                <span class="d-block">{{ user.name }}</span>
              </a>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td class="font-primary">{{ user.status }}</td>
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
  }
};
</script>

<style>
.table-responsive {
  margin-top: 20px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 10px;
  text-align: left;
}

.user-checkbox {
  display: flex;
  align-items: center;
}
</style>
