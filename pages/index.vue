<template>
  <div v-if="isLoggedIn" class="p-6 space-y-6">
    <div class="relative">
      <div class="p-6 bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white overflow-hidden rounded-lg">
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-semibold mb-2">¡Hola, {{ studentName }}! 👋</h2>
              <p class="text-blue-100">Bienvenido/a de vuelta. Continuemos aprendiendo sobre seguridad digital.</p>
            </div>
            <button @click="handleLogout" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-colors">Cerrar Sesión</button>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Progreso General</span>
                <span class="text-sm font-semibold">{{ overallProgress }}%</span>
              </div>
              <div class="w-full bg-white/20 rounded-full h-3">
                <div class="bg-white h-3 rounded-full" :style="{ width: overallProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-semibold mb-4">Accesos Rápidos</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(item, index) in quickAccess" :key="index" class="p-4 border-2 rounded-lg hover:shadow-lg transition-shadow cursor-pointer hover:border-[#1E88E5]/30 bg-white">
          <div class="flex items-start gap-3">
            <div :class="[item.color, 'p-3 rounded-xl text-white']">
              <component :is="item.icon" class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-semibold">{{ item.title }}</h4>
                <div v-if="item.pending > 0" class="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                  {{ item.pending }}
                </div>
              </div>
              <p class="text-sm text-gray-600">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
} from 'lucide-vue-next';
import {
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const { $auth } = useNuxtApp();

const user = ref(null);
const isLoggedIn = computed(() => !!user.value);
const studentName = computed(() => user.value?.email?.split('@')[0] || user.value?.displayName || 'Usuario');

onMounted(() => {
  onAuthStateChanged($auth, (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser;
    } else {
      user.value = null;
      navigateTo('/login'); // Redirect to login if not authenticated
    }
  });
});

const handleLogout = async () => {
  try {
    await signOut($auth);
    // The onAuthStateChanged listener will handle the redirect to /login
  } catch (error) {
      console.error("Logout Error:", error);
  }
};

const overallProgress = 68;
const quickAccess = [
  { title: "Actividades", description: "Aprende sobre seguridad digital", icon: BookOpen, color: "bg-[#43A047]", pending: 3 },
  { title: "Evaluaciones", description: "Pon a prueba tus conocimientos", icon: ClipboardCheck, color: "bg-[#1E88E5]", pending: 1 },
  { title: "Foros", description: "Comparte con otros estudiantes", icon: MessageSquare, color: "bg-[#FDD835]", pending: 5 },
  { title: "Mi Progreso", description: "Revisa tu avance", icon: TrendingUp, color: "bg-purple-500", pending: 0 }
];

</script>
