<template>
  <div class="row">
        <div class="card-body">
          <usersTable :users="content" />
        </div>
        <pagination :allData="users" />
      </div>
</template>

<script>
import { mapState } from "vuex";
import Users from "@/data/users.json";
import usersTable from "@/components/general/users/allUsers/usersTable.vue";
import pagination from "@/layouts/elements/pagination.vue";
export default {
  components: { usersTable, pagination },
  title: "Sk-Usuarios",
  data() {
    return {
      users: Users.data,
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
