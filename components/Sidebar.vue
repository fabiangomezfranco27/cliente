<template>
  <!-- Sidebar con fondo degradado y texto blanco -->
  <aside class="w-64 flex flex-col text-white bg-gradient-to-r from-[#1E88E5] to-[#43A047]">
    <!-- Logo o Título de la Plataforma -->
    <div class="h-20 flex items-center justify-center border-b border-white/20">
      <h1 class="text-2xl font-bold">Plataforma</h1>
    </div>

    <!-- Navegación Principal -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <a
        v-for="item in navigation"
        :key="item.id"
        href="#"
        @click.prevent="onSectionChange(item.id)"
        :class="[
          'flex items-center px-4 py-2.5 rounded-lg transition-colors',
          activeSection === item.id
            ? 'bg-white/20 font-semibold'
            : 'hover:bg-white/10',
        ]"
      >
        {{ item.name }}
      </a>
    </nav>

    <!-- Perfil del Usuario o Footer del Sidebar -->
    <div class="px-4 py-4 border-t border-white/20">
      <a href="#" class="flex items-center px-4 py-2.5 rounded-lg hover:bg-white/10">
        Perfil
      </a>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  activeSection: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['section-change']);

const navigation = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'activities', name: 'Actividades' },
  { id: 'evaluations', name: 'Evaluaciones' },
  { id: 'progress', name: 'Mi Progreso' },
  { id: 'styles', name: 'Estilos Aprendizaje' },
  { id: 'certificates', name: 'Certificados' },
];

const onSectionChange = (sectionId) => {
  emit('section-change', sectionId);
};
</script>
