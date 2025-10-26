import { defineNuxtPlugin } from 'nuxt/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(nuxtApp => {
  const firebaseConfig = {
    apiKey: "AIzaSyBZUtPB2ZgWSpEftjjr82LRyFLMcz5I8Z4",
    authDomain: "eduseguridad-16706.firebaseapp.com",
    projectId: "eduseguridad-16706",
    storageBucket: "eduseguridad-16706.appspot.com",
    messagingSenderId: "880302787587",
    appId: "1:880302787587:web:3792cc1d65fe8225b21236",
    measurementId: "G-YKFEPJN8SS"
  };

  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);

  // Inicializar Firebase Auth y hacerlo disponible en el contexto de la app de Nuxt
  const auth = getAuth(app);

  // Hacemos 'auth' disponible en toda la app a través de `useNuxtApp().$auth`
  nuxtApp.provide('auth', auth);
});
