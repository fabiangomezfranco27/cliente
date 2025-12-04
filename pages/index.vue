<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Bienvenido de nuevo,</h1>
          <p v-if="user" class="text-lg text-gray-600">{{ user.displayName || user.email }}</p>
        </div>
        <button @click="logout" class="mt-4 sm:mt-0 flex items-center space-x-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors">
          <LogOut :size="18" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <!-- Quick Access Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="item in quickAccess" 
          :key="item.title"
          @click="handleCardClick(item.path)"
          :class="[item.color, 'p-6 rounded-xl text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer group']"
        >
          <div class="flex justify-between items-start">
            <div class="bg-white/30 p-3 rounded-lg">
              <component :is="item.icon" :size="28" class="transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span v-if="item.pending > 0" class="bg-white text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-sm">{{ item.pending }}</span>
          </div>
          <div class="mt-4">
            <h3 class="text-xl font-bold">{{ item.title }}</h3>
            <p class="text-sm opacity-90 mt-1">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNuxtApp } from '#app';
import { BookOpen, ClipboardCheck, LayoutGrid, TrendingUp, LogOut } from 'lucide-vue-next';

const { $auth } = useNuxtApp();
const user = ref(null);

// onMounted asegura que el código se ejecute solo en el cliente
onMounted(() => {
  onAuthStateChanged($auth, (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser;
    } else {
      user.value = null;
      // Redirige al login solo si no hay usuario
      navigateTo('/login');
    }
  });
});

const logout = async () => {
  try {
    await signOut($auth);
    // El listener onAuthStateChanged se encargará de la redirección
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

const handleCardClick = (path) => {
  navigateTo(path);
};

const quickAccess = [
  { title: "Módulos", path: "/modules", description: "Explora el contenido del curso", icon: BookOpen, color: "bg-[#0077B6]", pending: 0 },
  { title: "Actividades", path: "/activities", description: "Aprende de forma interactiva", icon: ClipboardCheck, color: "bg-[#00B4D8]", pending: 3 },
  { title: "Evaluaciones", path: "/evaluations", description: "Pon a prueba tus conocimientos", icon: LayoutGrid, color: "bg-[#48BFE3]", pending: 1 },
  { title: "Mi Progreso", path: "/progress", description: "Revisa tu avance y logros", icon: TrendingUp, color: "bg-[#90E0EF]", pending: 0 },
];
</script>
