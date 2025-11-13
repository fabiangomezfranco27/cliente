<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">Iniciar Sesión</h2>
        <p class="text-gray-600">Accede a tu panel de aprendizaje.</p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input v-model="email" type="email" id="email" placeholder="tu@email.com" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input v-model="password" type="password" id="password" placeholder="••••••••" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        
        <div v-if="authError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {{ authError }}
        </div>

        <div class="flex items-center justify-between text-sm">
          <a href="#" @click.prevent="handleForgotPassword" class="font-medium text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</a>
        </div>
        
        <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-bold text-white bg-gradient-to-r from-[#1E88E5] to-[#43A047] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Entrar</button>
        
      </form>
      
      <div class="text-center mt-6 text-sm">
        <p class="text-gray-600">
          ¿No tienes una cuenta? 
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">Regístrate aquí</NuxtLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNuxtApp } from '#app';

const { $auth } = useNuxtApp();

const email = ref('');
const password = ref('');
const authError = ref(null);

// This will only run on the client side
onMounted(() => {
  onAuthStateChanged($auth, (firebaseUser) => {
    if (firebaseUser) {
      // If user is already logged in, redirect to home.
      navigateTo('/');
    }
  });
});

const handleLogin = async () => {
  authError.value = null;
  try {
    await signInWithEmailAndPassword($auth, email.value, password.value);
    // The onAuthStateChanged listener will handle the redirect.
  } catch (error) {
    console.error("Login Error:", error);
    authError.value = "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.";
  }
};

const handleForgotPassword = () => {
  console.log('Redirect to password recovery');
  alert('La funcionalidad de "Recuperar contraseña" aún no está implementada.');
};
</script>
