<template>
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-header">
            <h3>Lista de Usuarios</h3>
          </div>
          <div class="card-body">
            <!-- Tabla de usuarios -->
            <usersTable :users="paginatedUsers" />
          </div>
          <!-- Paginación -->
          <div class="card-footer">
            <pagination :allData="users" @page-changed="onPageChange" />
          </div>
        </div>
    </div>
    </div>
</template>

<script>
import usersTable from "@/components/general/users/allUsers/listUser.vue";
import pagination from "@/layouts/elements/pagination.vue";
import Users from "@/data/users.json";
export default {
    components: { usersTable, pagination },
    title: "SK-Usurios",
    data() {
    return {
        users: Users.data, 
        currentPage: 1, 
        itemsPerPage: 10, 
    };
    },
    computed: {
    paginatedUsers() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.users.slice(start, end);
    },
    },
    methods: {

    onPageChange(newPage) {
        this.currentPage = newPage;
    },
    },
};
</script>

<style>
</style>
