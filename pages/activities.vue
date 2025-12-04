<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div v-if="selectedActivity" class="space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span 
            class="font-semibold text-[10px] py-1 px-3 rounded-full border"
            :style="{ borderColor: selectedActivity.color, color: selectedActivity.color }"
          >
            Competencia {{ selectedActivity.competencyId }}
          </span>
          <h2 class="text-2xl font-bold mt-2" :style="{ color: selectedActivity.color }">{{ selectedActivity.title }}</h2>
          <p class="text-gray-600 text-sm mt-1 max-w-xl">{{ selectedActivity.description }}</p>
        </div>
        <button
          @click="selectedActivity = null"
          class="w-full sm:w-auto flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-colors font-semibold"
          :style="{ 
            borderColor: selectedActivity.color, 
            color: selectedActivity.color, 
            backgroundColor: `${selectedActivity.color}10` 
          }"
        >
          ← Volver a actividades
        </button>
      </div>

      <component 
        :is="selectedActivity.component" 
        :color="selectedActivity.color"
        @complete="handleActivityComplete(selectedActivity.id)"
      />
    </div>

    <div v-else class="space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Módulo de Actividades – Aprende practicando</h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Aplica tus conocimientos mediante actividades interactivas diseñadas para cada competencia
        </p>
      </div>

      <div class="max-w-4xl mx-auto rounded-lg p-6 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white shadow-lg">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Award class="w-7 h-7" />
              <div>
                <p class="font-bold text-lg">Tu progreso general</p>
                <p class="text-sm text-blue-100">{{ completedActivitiesCount }} de {{ activities.length }} actividades completadas</p>
              </div>
            </div>
            <Trophy v-if="progressPercentage === 100" class="w-12 h-12 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <div class="flex justify-between items-center mb-1 text-sm font-medium">
              <span>Progreso</span>
              <span>{{ Math.round(progressPercentage) }}%</span>
            </div>
            <div class="w-full bg-white/30 rounded-full h-3">
              <div class="bg-white h-3 rounded-full transition-all duration-500" :style="{ width: progressPercentage + '%' }"></div>
            </div>
          </div>
          <p v-if="progressPercentage === 100" class="text-sm text-center text-blue-100 pt-2">
            ¡Excelente trabajo! Has completado todas las actividades del módulo 🎉
          </p>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        <div
          v-for="activity in activities"
          :key="activity.id"
          @click="selectAndStartActivity(activity)"
          class="cursor-pointer transition-all duration-300 rounded-lg bg-white shadow-md border-2"
          :class="{
            'border-green-500 bg-green-50/50': activity.status === 'completed',
            'border-blue-500': activity.status === 'in-progress',
            'hover:shadow-xl hover:scale-105 border-transparent': activity.status === 'not-started'
          }"
          :style="{ borderTopWidth: '4px', borderTopColor: activity.color }"
        >
          <div class="p-5 flex flex-col h-full">
            <div class="flex items-start justify-between mb-3">
              <div 
                class="p-3 rounded-lg"
                :style="{ backgroundColor: `${activity.color}15` }"
              >
                <component :is="activity.icon" class="w-6 h-6" :style="{ color: activity.color }"/>
              </div>
              <span 
                v-if="statusConfig[activity.status]"
                class="flex items-center gap-2 px-2 py-1 text-xs rounded-full font-semibold"
                :class="statusConfig[activity.status].badgeClass"
              >
                <component :is="statusConfig[activity.status].icon" class="w-3 h-3" />
                {{ statusConfig[activity.status].text }}
              </span>
            </div>
            <span 
              class="font-semibold text-[10px] py-1 px-2 rounded-full border w-fit mb-2"
              :style="{ borderColor: activity.color, color: activity.color }"
            >
              Competencia {{ activity.competencyId }}
            </span>
            <h3 class="text-lg font-bold text-gray-800">{{ activity.title }}</h3>
            <p class="text-sm text-gray-600 flex-grow mt-1">{{ activity.description }}</p>
            <button
              class="w-full mt-4 py-2.5 rounded-lg transition-colors text-white font-semibold"
              :style="{ backgroundColor: activity.color }"
            >
              {{ statusConfig[activity.status] ? statusConfig[activity.status].buttonText : 'Iniciar' }} →
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto rounded-lg p-6 bg-white border-2" :style="{ borderColor: '#00B4D8' }">
        <div class="flex items-start gap-4">
          <Shield class="w-6 h-6 flex-shrink-0 mt-0.5" style="color: #0077B6" />
          <div class="text-sm text-gray-700">
            <h3 class="font-bold text-base text-gray-800 mb-2">
              Instrucciones
            </h3>
            <p class="mb-3">
              Cada actividad está diseñada para reforzar una competencia específica del módulo de contenidos.
            </p>
            <ul class="space-y-1.5 ml-4 text-gray-600">
              <li v-for="instruction in instructions" :key="instruction" class="flex items-start gap-2.5">
                <span class="text-[#0077B6] mt-1.5 flex-shrink-0">◆</span>
                <span>{{ instruction }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue';
import { Shield, Lock, Users, Award, Trophy, Circle, CircleDashed, CheckCircle2 } from 'lucide-vue-next';

const PhishingDetector = shallowRef(null);
const PasswordGenerator = shallowRef(null);
const CyberbullyingCase = shallowRef(null);

import('../components/activities/PhishingDetector.vue').then(comp => PhishingDetector.value = comp.default);
import('../components/activities/PasswordGenerator.vue').then(comp => PasswordGenerator.value = comp.default);
import('../components/activities/CyberbullyingCase.vue').then(comp => CyberbullyingCase.value = comp.default);

const activities = ref([
  {
    id: 1,
    competencyId: 1,
    title: 'Detector de Phishing Interactivo',
    description: 'Analiza correos electrónicos y aprende a identificar intentos de phishing',
    color: '#0077B6',
    icon: Shield,
    component: PhishingDetector,
    status: 'not-started' 
  },
  {
    id: 2,
    competencyId: 2,
    title: 'Generador de Contraseñas Seguras',
    description: 'Crea y evalúa contraseñas en tiempo real con análisis de seguridad',
    color: '#00B4D8',
    icon: Lock,
    component: PasswordGenerator,
    status: 'not-started'
  },
  {
    id: 3,
    competencyId: 3,
    title: 'Caso Ético: Conflicto Digital',
    description: 'Toma decisiones en un caso de ciberacoso y aprende sobre ciudadanía digital',
    color: '#48BFE3',
    icon: Users,
    component: CyberbullyingCase,
    status: 'not-started'
  }
]);

const statusConfig = {
  'completed': { icon: CheckCircle2, text: 'Completada', badgeClass: 'bg-green-100 text-green-700', buttonText: 'Revisar actividad' },
  'in-progress': { icon: CircleDashed, text: 'En progreso', badgeClass: 'bg-blue-100 text-blue-700', buttonText: 'Continuar actividad' },
  'not-started': { icon: Circle, text: 'No iniciada', badgeClass: 'bg-gray-100 text-gray-700', buttonText: 'Iniciar actividad' }
};

const instructions = [
  "Lee las instrucciones cuidadosamente antes de comenzar",
  "Toma tu tiempo para analizar cada situación",
  "Recibirás retroalimentación inmediata sobre tus respuestas",
  "Puedes repetir las actividades cuantas veces quieras"
];

const selectedActivity = ref(null);

const selectAndStartActivity = (activity) => {
  if (activity.status === 'not-started') {
    activity.status = 'in-progress';
  }
  selectedActivity.value = activity;
};

const handleActivityComplete = (activityId) => {
  const activity = activities.value.find(a => a.id === activityId);
  if (activity) {
    activity.status = 'completed';
  }
};

const completedActivitiesCount = computed(() => {
  return activities.value.filter(a => a.status === 'completed').length;
});

const progressPercentage = computed(() => {
  if (activities.value.length === 0) return 0;
  return (completedActivitiesCount.value / activities.value.length) * 100;
});
</script>
