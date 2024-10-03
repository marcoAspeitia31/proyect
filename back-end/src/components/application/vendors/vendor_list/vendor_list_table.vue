<template>
  <div class="table-responsive table-desi">
    <table class="user-table vendor-table table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Password</th>
          <th>Confirm Password</th>
          <th>Status</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <!-- Se muestra el password enmascarado -->
          <td>******</td>
          <!-- Input para confirmar el password -->
          <td>
            <input 
              type="password" 
              v-model="user.confirmPassword" 
              placeholder="Confirm Password"
            />
          </td>
          <td>{{ user.status }}</td>
          <td>
            <ul>
              <li>
                <router-link to="/user_detail" href="javascript:void(0)">
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
  props: ["users"],
};
</script>

<style>
</style>
