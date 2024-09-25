<template>
  <nav class="font-mono">
    <ul class="flex flex-col md:flex-row md:space-x-4">
      <li>
        <NuxtLink to="/" class="link">Inicio</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about" class="link">Sobre Mi</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/projects" class="link">Proyectos</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/blog" class="link">Blog</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.link {
  @apply p-1 hover:bg-gray-200 dark:hover:bg-gray-800 text-2xl md:text-base
}
</style>