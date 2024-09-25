<template>
  <UCard>
    <template #header> Iniciando Sesion... </template>

    Espere un momento en lo que inicia sesion...
  </UCard>
</template>

<script setup>
useRedirectIfAuthenticated();
</script>
