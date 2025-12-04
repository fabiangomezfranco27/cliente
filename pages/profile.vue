<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-2xl font-semibold">Mi Perfil</h2>
      <p class="text-gray-600 mt-1">Gestiona tu información personal y preferencias</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Columna Principal -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Información Personal -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Información Personal</h3>
          
          <div class="flex items-center gap-6 mb-6">
            <div class="relative">
              <div class="w-20 h-20 rounded-full overflow-hidden bg-blue-200 flex items-center justify-center">
                <img v-if="userInfo.avatar" :src="userInfo.avatar" :alt="userInfo.name" class="w-full h-full object-cover"/>
                <span v-else class="text-2xl font-bold text-[#1E88E5]">{{ userInfo.name.split(' ').map(n => n[0]).join('') }}</span>
              </div>
              <button class="absolute -bottom-1 -right-1 p-2 bg-[#1E88E5] text-white rounded-full hover:bg-[#1565C0] transition-colors">
                <Camera class="w-4 h-4" />
              </button>
            </div>
            <div>
              <h4 class="text-xl font-semibold">{{ userInfo.name }}</h4>
              <p class="text-gray-600">{{ userInfo.email }}</p>
              <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <Calendar class="w-4 h-4" />
                  <span>{{ userInfo.joinDate }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <GraduationCap class="w-4 h-4" />
                  <span>{{ userInfo.grade }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input id="name" v-model="userInfo.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input id="email" type="email" v-model="userInfo.email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="grade" class="block text-sm font-medium text-gray-700">Grado Escolar</label>
              <input id="grade" v-model="userInfo.grade" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label for="school" class="block text-sm font-medium text-gray-700">Institución Educativa</label>
              <input id="school" v-model="userInfo.school" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <button class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1E88E5] hover:bg-[#1565C0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Save class="w-4 h-4 mr-2" />
            Guardar Cambios
          </button>
        </div>
      </div>

      <!-- Barra Lateral -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Resumen de Actividad</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-[#43A047]/10 rounded-full flex items-center justify-center">
                  <GraduationCap class="w-4 h-4 text-[#43A047]" />
                </div>
                <span class="text-sm">Actividades Completadas</span>
              </div>
              <span class="px-2 py-0.5 text-xs font-semibold text-white bg-[#43A047] rounded-full">{{ userInfo.completedActivities }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-[#FDD835]/10 rounded-full flex items-center justify-center">
                  <Shield class="w-4 h-4 text-[#FDD835]" />
                </div>
                <span class="text-sm">Puntos Totales</span>
              </div>
              <span class="px-2 py-0.5 text-xs font-semibold text-gray-800 bg-[#FDD835] rounded-full">{{ userInfo.totalPoints }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div class="space-y-3">
            <button class="w-full inline-flex items-center justify-center px-4 py-2 border border-[#1E88E5] text-sm font-medium rounded-md text-[#1E88E5] bg-white hover:bg-[#1E88E5] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Eye class="w-4 h-4 mr-2" />
              Cambiar Contraseña
            </button>
            <button class="w-full inline-flex items-center justify-center px-4 py-2 border border-[#43A047] text-sm font-medium rounded-md text-[#43A047] bg-white hover:bg-[#43A047] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Bell class="w-4 h-4 mr-2" />
              Configurar Notificaciones
            </button>
            <button class="w-full inline-flex items-center justify-center px-4 py-2 border border-[#FDD835] text-sm font-medium rounded-md text-gray-800 bg-white hover:bg-[#FDD835] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              <Shield class="w-4 h-4 mr-2" />
              Centro de Ayuda
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  User, 
  Mail, 
  Shield, 
  Eye, 
  Bell, 
  Save,
  Camera,
  Calendar,
  MapPin,
  GraduationCap
} from 'lucide-vue-next';

const userInfo = ref({
  name: "Cambiar Nombre",
  email: "ejemplo@estudiante.edu",
  avatar: "https://images.unsplash.com/photo-1710438598615-f59b1c0c006b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmclMjBjb21wdXRlcnxlbnwxfHx8fDE3NTgxMzE3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  joinDate: "Septiembre 2025",
  grade: "Grado 9",
  school: "Instituto Ejemplo",
  completedActivities: 1,
  totalPoints: 35
});

</script>
