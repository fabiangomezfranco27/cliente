<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar :active-section="activeSection" />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <!-- NuxtPage renderizará pages/index.vue por defecto -->
      <NuxtPage @update:section="newSection => activeSection = newSection" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '~/components/Sidebar.vue';

// La sección activa por defecto será 'Dashboard'
const activeSection = ref('Dashboard');
</script>
