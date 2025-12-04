<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Tu Panel de Progreso</h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Visualiza tus logros, avance por módulo y actividad reciente en la plataforma.
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="stat in statsCards" 
          :key="stat.title"
          class="bg-white p-6 rounded-xl shadow-sm border flex items-start gap-5 transition-all hover:shadow-lg hover:-translate-y-1"
        >
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="stat.bgColor"
          >
            <component :is="stat.icon" :size="24" :class="stat.color" />
          </div>
          <div>
            <p class="text-sm text-gray-500 font-medium">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Module Progress -->
      <div class="bg-white p-6 rounded-xl shadow-sm border">
        <h3 class="text-xl font-bold text-gray-800 mb-6">Progreso por Módulo de Competencia</h3>
        <div class="space-y-5">
          <div v-for="(mod, index) in moduleProgress" :key="index">
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold text-gray-700">{{ mod.name }}</span>
              <span class="text-sm font-medium" :style="{ color: mod.color }">{{ mod.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="h-2.5 rounded-full transition-all duration-500"
                :style="{ width: mod.progress + '%', backgroundColor: mod.color }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Activity & Achievements -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Achievements -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
          <h3 class="text-xl font-bold text-gray-800 mb-5">Últimos Logros Obtenidos</h3>
          <div class="space-y-4">
            <div 
              v-for="(achievement, index) in achievements" 
              :key="index"
              class="flex items-center gap-4 p-4 rounded-lg border-2"
              :class="achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'"
            >
              <div 
                class="p-3 rounded-full"
                :class="achievement.earned ? achievement.iconBgColor : 'bg-gray-200'"
              >
                <component :is="achievement.icon" class="w-6 h-6" :class="achievement.earned ? achievement.iconColor : 'text-gray-400'" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold" :class="achievement.earned ? 'text-gray-900' : 'text-gray-500'">
                  {{ achievement.title }}
                </h4>
                <p class="text-sm" :class="achievement.earned ? 'text-gray-600' : 'text-gray-400'">
                  {{ achievement.description }}
                </p>
              </div>
              <CheckCircle v-if="achievement.earned" class="w-6 h-6 text-green-500 flex-shrink-0" />
            </div>
          </div>
        </div>

        <!-- Weekly Activity -->
        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <h3 class="text-xl font-bold text-gray-800 mb-5">Actividad Semanal</h3>
          <div class="flex items-end justify-around gap-3 h-40 pt-4 border-t">
            <div v-for="(day, index) in weeklyActivity" :key="index" class="flex flex-col items-center flex-1 gap-2">
              <div 
                class="w-full rounded-lg transition-all hover:opacity-80"
                :style="{ 
                  height: `${Math.max(day.activities * 20, 5)}%`, 
                  backgroundColor: day.activities > 0 ? '#0077B6' : '#E0E0E0'
                }"
              ></div>
              <span class="text-xs font-medium text-gray-500">{{ day.day }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  LayoutGrid, 
  Target, 
  BarChart3, 
  Star, 
  CheckCircle, 
  Trophy, 
  BookOpen 
} from 'lucide-vue-next';

// Datos para las tarjetas de estadísticas principales
const statsCards = ref([
  {
    title: 'Módulos Completados',
    value: '0/3',
    icon: LayoutGrid,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Actividades Finalizadas',
    value: '0/3',
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Puntuación Promedio',
    value: '0%',
    icon: BarChart3,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    title: 'Puntos Totales',
    value: '0',
    icon: Star,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
]);

// Datos para la sección de progreso por módulo
const moduleProgress = ref([
  {
    name: 'Conocimiento y responsabilidad digital',
    progress: 0,
    color: '#0077B6'
  },
  {
    name: 'Prácticas seguras en línea',
    progress: 0,
    color: '#00B4D8'
  },
  {
    name: 'Ética y respeto digital',
    progress: 0,
    color: '#48BFE3'
  }
]);

// Datos para la sección de logros
const achievements = ref([
  {
    title: 'Primer Módulo Completado',
    description: 'Finaliza el módulo de Responsabilidad Digital',
    earned: false,
    icon: BookOpen,
    iconColor: 'text-blue-600',
    iconBgColor: 'bg-blue-100'
  },
  {
    title: 'Evaluación Perfecta',
    description: 'Consigue una puntuación de 100% en cualquier evaluación',
    earned: false,
    icon: Trophy,
    iconColor: 'text-yellow-600',
    iconBgColor: 'bg-yellow-100'
  },
  {
    title: 'Actividad Maestra',
    description: 'Completa todas las actividades interactivas',
    earned: false,
    icon: Target,
    iconColor: 'text-green-600',
    iconBgColor: 'bg-green-100'
  }
]);

// Datos para la actividad semanal
const weeklyActivity = ref([
  { day: 'Lun', activities: 0 },
  { day: 'Mar', activities: 0 },
  { day: 'Mié', activities: 0 },
  { day: 'Jue', activities: 0 },
  { day: 'Vie', activities: 0 },
  { day: 'Sáb', activities: 0 },
  { day: 'Dom', activities: 0 }
]);

</script>
