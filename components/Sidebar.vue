<template>
  <aside class="w-64 flex flex-col text-white bg-gradient-to-r from-[#43A047] to-[#1E88E5]">
    <div 
      class="h-20 flex items-center justify-center border-b border-white/20 px-6 cursor-pointer hover:bg-white/10 transition-colors"
      @click="onSectionChange('dashboard')"
    >
      <div class="flex items-center gap-3">
        <img src="/cyber-security1.png" alt="EduSeguridad Logo" class="h-10 w-10">
        <div>
          <h1 class="text-xl font-bold leading-tight">EduSeguridad</h1>
          <p class="text-sm leading-tight">Educativa</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2">
      <a
        v-for="item in navigation"
        :key="item.id"
        href="#"
        @click.prevent="onSectionChange(item.id)"
        :class="[
          'flex items-center px-4 py-2.5 rounded-lg transition-colors',
          activeSection === item.id
            ? 'bg-white text-[#1E88E5] font-semibold'
            : 'hover:bg-white/10',
        ]"
      >
        {{ item.name }}
      </a>
    </nav>

    <div class="px-6 py-4 border-t border-white/20 text-center text-xs text-white/70">
      <p>Versión 1.0</p>
      <p>© 2025 Educación Digital</p>
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
  { id: 'dashboard', name: 'Inicio' },
  { id: 'modules', name: 'Módulos' },
  { id: 'activities', name: 'Actividades' },
  { id: 'evaluations', name: 'Evaluaciones' },
  { id: 'progress', name: 'Mi Progreso' },
  { id: 'certificates', name: 'Certificados' },
  { id: 'profile', name: 'Perfil' },
];

const onSectionChange = (sectionId) => {
  emit('section-change', sectionId);
};
</script>
