import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // Añadimos el módulo de Tailwind CSS
  modules: ['@nuxtjs/tailwindcss'],

  devServer: {
    port: 3001
  },

  runtimeConfig: {}
})
