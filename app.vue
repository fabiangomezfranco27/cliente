<template>
  <div class="flex h-screen bg-gray-50">
    <Sidebar v-if="showSidebar" :active-section="activeSection" />
    <main class="flex-1 overflow-y-auto">
      <NuxtPage @update:section="newSection => activeSection = newSection" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Sidebar from '~/components/Sidebar.vue';
import { onAuthStateChanged } from 'firebase/auth';
import { useNuxtApp } from '#app';
import { useRoute } from 'vue-router';

const { $auth } = useNuxtApp();
const route = useRoute();

const user = ref(null);
const activeSection = ref('Dashboard');

onMounted(() => {
  onAuthStateChanged($auth, (firebaseUser) => {
    user.value = firebaseUser;
  });
});

const showSidebar = computed(() => {
  return !!user.value && route.path !== '/register';
});
</script>
