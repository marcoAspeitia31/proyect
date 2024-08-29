<template>
<!-- Ejemplo Mensaje -->
<div  v-if="itsMine" class="flex justify-end">
    <div class="bg-green-200 text-black p-2 rounded-lg max-w-xs">{{ message }}
    </div>
  </div>

  <!-- Ejemplo Recibir Mensajes -->
  <div v-else class="flex">
    <div class="bg-green-300 text-black p-2 rounded-lg max-w-xs">
        <span class="capitalize">{{ message }}</span>
        <img v-if="image" :src="image" alt="YesNoImage" class="w-52 h-52 object-cover rounded-md" image="https://yesno.wtf/assets/no/6-4bf0a784c173f70a0cab96efd9ff80c9.gif">
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
    message: string;
    itsMine: boolean;
    image?: string;
}

defineProps<Props>();
</script>