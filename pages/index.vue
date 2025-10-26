<template>
  <div class="p-6 space-y-6">
    <!-- Login Module - Solo se muestra si no está logueado -->
    <div v-if="!isLoggedIn" class="max-w-md mx-auto">
      <div class="p-8 border rounded-lg shadow-sm bg-white">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold">Iniciar Sesión o Registrarse</h2>
          <p class="text-gray-600">Accede a tu panel de aprendizaje.</p>
        </div>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input v-model="email" type="email" id="email" placeholder="tu@email.com" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input v-model="password" type="password" id="password" placeholder="********" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          
          <!-- Auth Error Message -->
          <div v-if="authError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {{ authError }}
          </div>

          <div class="flex items-center justify-between text-sm">
            <a href="#" @click.prevent="handleForgotPassword" class="font-medium text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</a>
          </div>
          <div class="flex gap-4">
            <!-- Botón de Entrar con degradado -->
            <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#1E88E5] to-[#43A047] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Entrar</button>
            <!-- Botón de Registrarse con degradado -->
            <button @click.prevent="handleRegister" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#1E88E5] to-[#43A047] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Registrarse</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Welcome Section - Solo se muestra si está logueado -->
    <div v-if="isLoggedIn" class="relative">
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

    <!-- Quick Access Cards - Solo se muestra si está logueado -->
    <div v-if="isLoggedIn">
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

    <!-- Achievements Section - Solo se muestra si está logueado -->
    <div v-if="isLoggedIn">
      <h3 class="text-xl font-semibold mb-4">Insignias y Logros</h3>
      <div class="p-6 border rounded-lg bg-white">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div v-for="(badge, index) in badges" :key="index" :class="['flex flex-col items-center p-4 rounded-xl border-2 transition-all', badge.earned ? 'border-[#43A047] bg-green-50' : 'border-gray-200 bg-gray-50']">
            <div :class="['p-3 rounded-full mb-2', badge.earned ? 'bg-white shadow-md' : 'bg-gray-200']">
              <component :is="badge.icon" :class="['w-6 h-6', badge.color]" />
            </div>
            <span :class="['text-sm font-medium text-center', badge.earned ? 'text-gray-900' : 'text-gray-500']">{{ badge.name }}</span>
            <CheckCircle v-if="badge.earned" class="w-4 h-4 text-[#43A047] mt-1" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity - Solo se muestra si está logueado -->
    <div v-if="isLoggedIn">
      <h3 class="text-xl font-semibold mb-4">Actividad Reciente</h3>
      <div class="p-6 border rounded-lg bg-white">
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
            <CheckCircle class="w-5 h-5 text-[#43A047]" />
            <div>
              <p class="font-medium">Completaste "Contraseñas Seguras"</p>
              <p class="text-sm text-gray-600">Hace 2 horas</p>
            </div>
          </div>
          <div class="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <Star class="w-5 h-5 text-[#1E88E5]" />
            <div>
              <p class="font-medium">Nueva insignia desbloqueada</p>
              <p class="text-sm text-gray-600">Hace 3 horas</p>
            </div>
          </div>
          <div class="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
            <BookOpen class="w-5 h-5 text-[#FDD835]" />
            <div>
              <p class="font-medium">Iniciaste "Navegación Segura"</p>
              <p class="text-sm text-gray-600">Ayer</p>
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
  Star,
  Trophy,
  Zap,
  CheckCircle,
  Lock
} from 'lucide-vue-next';

// Firebase imports
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const { $auth } = useNuxtApp(); // Get the auth instance from the plugin

// State Management
const user = ref(null); // This will hold the Firebase user object
const email = ref('');
const password = ref('');
const authError = ref(null); // To display authentication errors

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => !!user.value);
// Computed property for the student's name
const studentName = computed(() => user.value?.email?.split('@')[0] || user.value?.displayName || 'Usuario');

// Lifecycle Hook: Listen for auth state changes ONLY on the client-side
onMounted(() => {
  onAuthStateChanged($auth, (firebaseUser) => {
    if (firebaseUser) {
      // User is signed in.
      user.value = firebaseUser;
      authError.value = null; // Clear any previous errors
    } else {
      // User is signed out.
      user.value = null;
    }
  });
});

const handleLogin = async () => {
  authError.value = null; // Reset error before trying
  try {
    await signInWithEmailAndPassword($auth, email.value, password.value);
    // onAuthStateChanged will handle setting the user state
  } catch (error) {
    console.error("Login Error:", error);
    authError.value = "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo."; // Set a user-friendly error message
  }
};

const handleRegister = async () => {
  authError.value = null;
  try {
    await createUserWithEmailAndPassword($auth, email.value, password.value);
    // onAuthStateChanged will handle setting the user state
  } catch (error) {
    console.error("Registration Error:", error);
    if (error.code === 'auth/email-already-in-use') {
        authError.value = "Este correo electrónico ya está en uso.";
    } else {
        authError.value = "Error al registrar. La contraseña debe tener al menos 6 caracteres.";
    }
  }
};

const handleLogout = async () => {
  try {
    await signOut($auth);
    // onAuthStateChanged will handle clearing the user state
    email.value = '';
    password.value = '';
  } catch (error) {
      console.error("Logout Error:", error);
      authError.value = "Error al cerrar sesión.";
  }
};

const handleForgotPassword = () => {
  // We can implement this later with sendPasswordResetEmail
  console.log('Redirect to password recovery');
  alert('La funcionalidad de "Recuperar contraseña" aún no está implementada.');
};


// Static data for the dashboard UI (can be moved or fetched later)
const overallProgress = 68;
const quickAccess = [
  { title: "Actividades", description: "Aprende sobre seguridad digital", icon: BookOpen, color: "bg-[#43A047]", pending: 3 },
  { title: "Evaluaciones", description: "Pon a prueba tus conocimientos", icon: ClipboardCheck, color: "bg-[#1E88E5]", pending: 1 },
  { title: "Foros", description: "Comparte con otros estudiantes", icon: MessageSquare, color: "bg-[#FDD835]", pending: 5 },
  { title: "Mi Progreso", description: "Revisa tu avance", icon: TrendingUp, color: "bg-purple-500", pending: 0 }
];
const badges = [
  { name: "Primera Lección", icon: Star, earned: true, color: "text-yellow-500" },
  { name: "Contraseñas Seguras", icon: Trophy, earned: true, color: "text-[#43A047]" },
  { name: "Navegación Segura", icon: Zap, earned: true, color: "text-[#1E88E5]" },
  { name: "Experto en Privacidad", icon: CheckCircle, earned: false, color: "text-gray-400" },
  { name: "Guardián Digital", icon: Lock, earned: false, color: "text-gray-400" }
];
</script>
