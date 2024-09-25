<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-sm-12">
          <addUser />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addUser from "@/components/general/users/add_new_user/addUser.vue";
export default {
  components: { addUser },
};
</script>

