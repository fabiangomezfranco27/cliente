<template>
  <!-- Fondo oscuro, texto blanco y padding general -->
  <div class="bg-gray-900 text-white min-h-screen p-8">
    <!-- Título más grande, con negrita y margen inferior -->
    <h1 class="text-4xl font-bold mb-6">Lista de Usuarios</h1>

    <!-- Estilos para el estado de carga -->
    <div v-if="pending" class="text-blue-400">
      Cargando...
    </div>

    <!-- Estilos para el estado de error -->
    <div v-else-if="error" class="text-red-500 bg-red-900 p-4 rounded-lg">
      <p class="font-bold">Error al cargar los usuarios:</p>
      <p>{{ error.message }}</p>
    </div>

    <!-- Contenedor de la lista con estilos -->
    <ul v-else class="list-disc pl-5 space-y-2">
      <!-- Estilos para cada elemento de la lista -->
      <li v-for="usuario in usuarios" :key="usuario._id" class="bg-gray-800 p-4 rounded-md shadow-md">
        <span class="font-semibold">{{ usuario.first_name }} {{ usuario.last_name }}</span>
        <span class="text-gray-400"> ({{ usuario.email }})</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { data: usuarios, pending, error } = await useFetch('/api/usuarios')
</script>

<style>
/*
  Ahora puedes usar Tailwind globalmente.
  El módulo de Nuxt se encarga de todo.
  ¡No es necesario escribir CSS aquí para empezar!
*/
body {
  /* Podemos añadir estilos globales aquí si es necesario, 
     por ejemplo, para la fuente de toda la página */
  font-family: 'Inter', sans-serif; /* Un ejemplo de fuente moderna */
}
</style>
