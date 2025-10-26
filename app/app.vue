<template>
  <div class="flex h-screen bg-background">
    <Sidebar :active-section="activeSection" @section-change="handleSectionChange" />
    <main class="flex-1 overflow-auto">
      <client-only>
        <component :is="activeComponentName" />
      </client-only>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeSection = ref('dashboard');

const componentNameMap = {
  dashboard: 'Dashboard',
  activities: 'Activities',
  evaluations: 'Evaluations',
  progress: 'Progress',
  styles: 'Styles',
  certificates: 'Certificates',
  profile: 'Profile',
};

const activeComponentName = computed(() => componentNameMap[activeSection.value] || 'Dashboard');

const handleSectionChange = (section) => {
  activeSection.value = section;
};
</script>

<style>
</style>
