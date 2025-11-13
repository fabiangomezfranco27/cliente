<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar 
      v-if="showSidebar" 
      :active-section="activeSection" 
      @section-change="handleSectionChange" 
    />
    <main class="flex-1 overflow-y-auto">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Sidebar from '~/components/Sidebar.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { useNuxtApp, navigateTo } from '#app';
import { useRoute } from 'vue-router';

const { $auth } = useNuxtApp();
const route = useRoute();

const user = ref(null);
const activeSection = ref('dashboard');

onMounted(() => {
  onAuthStateChanged($auth, (firebaseUser) => {
    user.value = firebaseUser;
    if (firebaseUser) {
      updateActiveSectionByRoute();
    }
  });
});

const handleSectionChange = (sectionId) => {
  if (sectionId === 'dashboard') {
    navigateTo('/');
  } else {
    navigateTo(`/${sectionId}`);
  }
};

const updateActiveSectionByRoute = () => {
  const path = route.path;
  if (path === '/') {
    activeSection.value = 'dashboard';
  } else {
    const sectionFromPath = path.substring(1);
    activeSection.value = sectionFromPath;
  }
};

watch(() => route.path, () => {
  updateActiveSectionByRoute();
});

const showSidebar = computed(() => {
  return !!user.value && route.path !== '/login' && route.path !== '/register';
});
</script>
