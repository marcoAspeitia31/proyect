<template>
  <div class="title-header title-header-1">
    <h5>{{ breadcrumbs.title }}</h5>
    <form class="d-inline-flex">
      <router-link
        :to="breadcrumbs.buttonPath"
        href="javascript:void(0)"
        class="align-items-center btn btn-theme"
      >
        <vueFeather type="plus-square" />
        Add New
      </router-link>
    </form>
  </div>
</template>

<script>
export default {
  props: ["breadcrumbs"],
};
</script>

<style></style>
