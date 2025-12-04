<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Crear una Cuenta</h1>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            id="nombre"
            v-model="nombre"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5]"
            placeholder="Tu Nombre"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5]"
            placeholder="tu@email.com"
          />
        </div>
        <div class="mb-2">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5]"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-[#1E88E5] to-[#43A047] text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
        >
          Registrarse
        </button>
      </form>
       <div class="text-center mt-6">
        <p class="text-sm text-gray-600">
          ¿Ya tienes una cuenta?
          <NuxtLink to="/login" class="font-medium text-[#1E88E5] hover:underline">Iniciar Sesión</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNuxtApp } from '#app';

const { $auth } = useNuxtApp();

const nombre = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  if (!nombre.value) {
    alert('Por favor, introduce tu nombre.');
    return;
  }

  try {
    // 1. Crear el usuario
    const userCredential = await createUserWithEmailAndPassword($auth, email.value, password.value);
    const user = userCredential.user;
    
    // 2. Guardar el nombre en el perfil de Firebase (en el backend)
    await updateProfile(user, { displayName: nombre.value });

    // 3. Forzar la recarga del objeto de usuario en el cliente para obtener los datos actualizados
    await user.reload();

    // 4. Guardar datos adicionales en tu propia API (opcional)
    await fetch('http://localhost:3000/usuarios', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        uid: user.uid, 
        nombre: nombre.value, // Ahora user.displayName también estaría disponible
        rol: 'estudiante'
      }),
    });

    // 5. Redirigir a la página de inicio. Ahora sí tendrá el nombre correcto.
    await navigateTo('/');

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      alert('El correo electrónico ya está en uso. Por favor, intenta con otro.');
    } else if (error.code === 'auth/weak-password') {
      alert('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
    } else {
      alert(`Error en el registro: ${error.message}`);
    }
  }
};
</script>
