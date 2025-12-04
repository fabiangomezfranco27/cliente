<template>
  <div class="p-6 space-y-6">
    <!-- Vista de Selección de Competencia -->
    <div v-if="!selectedCompetency" class="space-y-6">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-[#0077B6] mb-2">Módulo de Evaluación – Seguridad Digital</h2>
        <p class="text-lg text-gray-600">
          Pon a prueba tus conocimientos con evaluaciones específicas para cada competencia
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div 
          v-for="comp in evaluationData" 
          :key="comp.id"
          class="border-t-4 rounded-lg bg-white overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          :style="{ borderTopColor: comp.color }"
          @click="handleCompetencySelect(comp.id)"
        >
          <div class="p-6 flex flex-col h-full">
            <div 
              class="p-4 rounded-xl mb-4 mx-auto w-fit"
              :style="{ backgroundColor: `${comp.color}15` }"
            >
              <component 
                :is="comp.icon" 
                class="w-12 h-12" 
                :style="{ color: comp.color }" 
              />
            </div>
            <div class="text-center flex-grow">
              <span 
                class="inline-block px-3 py-1 text-sm rounded-full mb-2 border"
                :style="{ borderColor: comp.color, color: comp.color }"
              >
                Competencia {{ comp.id }}
              </span>
              <h3 class="text-xl font-semibold mb-2">{{ comp.title }}</h3>
              <p class="text-gray-500 text-sm mb-4">{{ comp.description }}</p>
            </div>
            <div class="mt-4 text-center">
              <div 
                class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
                :class="statusConfig[comp.status].badgeClass"
              >
                <component :is="statusConfig[comp.status].icon" class="w-4 h-4" />
                <span>{{ statusConfig[comp.status].text }}</span>
              </div>
              <p v-if="comp.status === 'completed' && comp.score" class="text-xs mt-2 text-gray-500">
                Calificación: <strong :style="{ color: comp.color }">{{ comp.score.grade.toFixed(1) }} / 5.0</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-lg p-6">
        <div class="flex items-start gap-4">
          <Award class="w-8 h-8 flex-shrink-0 mt-1" />
          <div>
            <h3 class="text-xl font-semibold mb-2">Instrucciones</h3>
            <ul class="text-sm text-blue-100 space-y-2">
              <li>• Selecciona una competencia para comenzar la evaluación.</li>
              <li>• Cada evaluación contiene 10 preguntas de opción múltiple.</li>
              <li>• Responde todas las preguntas antes de enviar.</li>
              <li>• Recibirás retroalimentación inmediata sobre tus respuestas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista de Evaluación/Resultados -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <button
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          @click="handleBackToEvaluations"
        >
          ← Volver a Evaluaciones
        </button>
        <button
          v-if="showResults"
          class="px-4 py-2 text-white rounded-lg hover:opacity-90 transition"
          :style="{ backgroundColor: competency.color }"
          @click="handleReset"
        >
          Reintentar Evaluación
        </button>
      </div>

      <!-- Resumen de Resultados -->
      <div v-if="showResults && score" class="p-6 bg-white rounded-lg border-t-4" :style="{ borderTopColor: competency.color }">
        <div class="text-center space-y-4">
          <div class="p-4 rounded-xl w-fit mx-auto" :style="{ backgroundColor: `${competency.color}15` }">
            <Award class="w-16 h-16" :style="{ color: competency.color }" />
          </div>
          <div>
            <h3 class="text-3xl font-bold mb-2" :style="{ color: getScoreMessage(score.percentage).color }">
              {{ getScoreMessage(score.percentage).text }}
            </h3>
            <p class="text-gray-600">
              Has respondido correctamente {{ score.correct }} de {{ score.total }} preguntas
            </p>
            <div class="mt-4">
              <div class="inline-block px-6 py-3 rounded-lg border-2" :style="{ borderColor: competency.color, backgroundColor: `${competency.color}10` }">
                <p class="text-sm text-gray-600 mb-1">Calificación Final</p>
                <p class="text-4xl font-bold" :style="{ color: competency.color }">
                  {{ score.grade.toFixed(1) }} <span class="text-2xl">/ 5.0</span>
                </p>
              </div>
            </div>
          </div>
          <div class="max-w-md mx-auto space-y-2">
             <div class="w-full bg-gray-200 rounded-full h-3">
                <div class="h-3 rounded-full" :style="{ width: score.percentage + '%', backgroundColor: competency.color }"></div>
              </div>
            <p class="font-semibold" :style="{ color: competency.color }">
              {{ score.percentage.toFixed(0) }}% de acierto
            </p>
          </div>
        </div>
      </div>

      <!-- Cuestionario -->
      <div class="p-6 bg-white rounded-lg border-t-4" :style="{ borderTopColor: competency.color }">
        <div class="flex items-start gap-4 mb-8">
          <div class="p-4 rounded-xl flex-shrink-0" :style="{ backgroundColor: `${competency.color}15` }">
            <component :is="competency.icon" class="w-8 h-8" :style="{ color: competency.color }" />
          </div>
          <div class="flex-1">
             <span class="inline-block px-3 py-1 text-sm rounded-full mb-2 border" :style="{ borderColor: competency.color, color: competency.color }">
                Competencia {{ competency.id }}
              </span>
            <h3 class="text-2xl font-bold mb-1">{{ competency.title }}</h3>
            <p class="text-gray-500">{{ showResults ? 'Revisa tus respuestas' : 'Responde las siguientes 10 preguntas' }}</p>
          </div>
        </div>

        <div class="space-y-8">
          <div v-for="(question, index) in competency.questions" :key="question.id" class="space-y-4">
            <div class="flex items-start gap-3">
              <span class="mt-1 px-2 py-0.5 text-sm font-semibold rounded-md border" :style="{ borderColor: competency.color, color: competency.color }">
                {{ index + 1 }}
              </span>
              <div class="flex-1">
                <p class="mb-4 font-medium text-gray-800">{{ question.question }}</p>
                
                <div class="space-y-3">
                  <label 
                    v-for="(option, optionIndex) in question.options" 
                    :key="optionIndex"
                    class="flex items-center space-x-3 p-3 rounded-lg border transition-all"
                    :class="getOptionClass(question, optionIndex)"
                  >
                    <input 
                      type="radio"
                      :name="`q${question.id}`"
                      :value="optionIndex"
                      :disabled="showResults"
                      @change="handleAnswerChange(question.id, optionIndex)"
                      class="form-radio h-5 w-5"
                      :style="{ color: competency.color }"
                    />
                    <span class="flex-1 cursor-pointer">
                      <div class="flex items-center justify-between">
                        <span>{{ option }}</span>
                        <template v-if="showResults && answers[question.id] === optionIndex">
                          <CheckCircle2 v-if="answers[question.id] === question.correctAnswer" class="w-5 h-5 text-green-600" />
                          <XCircle v-else class="w-5 h-5 text-red-600" />
                        </template>
                         <CheckCircle2 v-if="showResults && answers[question.id] !== optionIndex && optionIndex === question.correctAnswer" class="w-5 h-5 text-green-600" />
                      </div>
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <hr v-if="index < competency.questions.length - 1" />
          </div>

          <div v-if="!showResults" class="flex justify-center pt-4">
            <button
              @click="handleSubmit"
              :disabled="!allAnswered"
              class="px-8 py-4 text-lg font-bold rounded-lg text-white transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              :style="{ backgroundColor: allAnswered ? competency.color : undefined }"
            >
              {{ allAnswered ? 'Enviar Evaluación' : `Responde todas las preguntas (${Object.keys(answers).length}/${competency.questions.length})` }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Shield, Lock, Users, CheckCircle2, XCircle, Award, Circle, CircleDashed } from 'lucide-vue-next';

const evaluationData = ref([
  {
    id: 1,
    title: 'Responsabilidad digital',
    color: '#0077B6',
    icon: Shield,
    description: 'Evalúa tu comprensión sobre riesgos digitales y protección en línea',
    questions: [
      { id: 1, question: 'Un correo que aparenta ser del banco pide actualizar datos mediante un enlace. ¿Qué tipo de riesgo es?', options: ['Malware', 'Phishing', 'Suplantación biométrica', 'Spam'], correctAnswer: 1 },
      { id: 2, question: 'Si alguien usa tu número de cédula para abrir cuentas sin permiso, se presenta:', options: ['Robo de identidad', 'Hackeo de red', 'Ataque de denegación', 'Ciberacoso'], correctAnswer: 0 },
      { id: 3, question: '¿Cuál es un dato altamente sensible ante robo de identidad?', options: ['Nombre de usuario', 'Fecha de nacimiento', 'Número de cédula', 'Color de ojos'], correctAnswer: 2 },
      { id: 4, question: 'Descargas un archivo extraño y tu equipo empieza a fallar. El riesgo más probable es:', options: ['Phishing', 'Malware', 'Estafa telefónica', 'Spam comercial'], correctAnswer: 1 },
      { id: 5, question: '¿Qué acción reduce más el riesgo de phishing?', options: ['Abrir correos de desconocidos', 'Dar clic en enlaces acortados', 'Verificar remitentes y URLs', 'Usar la misma contraseña en todo'], correctAnswer: 2 },
      { id: 6, question: 'Publicar fotos de tu documento en redes puede generar:', options: ['Más seguidores', 'Robo de identidad', 'Publicidad segmentada', 'Bloqueo de cuenta'], correctAnswer: 1 },
      { id: 7, question: 'Si un atacante accede a tus redes con tu contraseña, se vulnera:', options: ['Ética digital', 'Privacidad y seguridad digital', 'Acceso universal', 'Alfabetización mediática'], correctAnswer: 1 },
      { id: 8, question: '¿Qué medida protege mejor tus credenciales?', options: ['Contraseñas cortas', 'Guardarlas en notas del celular', 'Autenticación en dos factores', 'Usar solo Wi-Fi público'], correctAnswer: 2 },
      { id: 9, question: 'Robo de información financiera en línea genera:', options: ['Likes no autorizados', 'Fraudes y compras no aprobadas', 'Lentitud en el dispositivo', 'Comentarios ofensivos'], correctAnswer: 1 },
      { id: 10, question: 'Te llega una encuesta que pide dirección, documento y datos bancarios. Debes:', options: ['Responder rápido', 'Compartir lo mínimo', 'Ignorar y no enviar información', 'Enviarla a amigos'], correctAnswer: 2 }
    ],
    status: 'not-started',
    score: null
  },
  {
    id: 2,
    title: 'Prácticas seguras en línea',
    color: '#00B4D8',
    icon: Lock,
    description: 'Evalúa tus conocimientos sobre técnicas de protección y navegación segura',
    questions: [
      { id: 1, question: 'Una contraseña segura debe:', options: ['Ser igual para todas las cuentas', 'Usar tu nombre y fecha de nacimiento', 'Tener longitud y mezcla de caracteres', 'Ser corta para recordarla'], correctAnswer: 2 },
      { id: 2, question: 'Principal ventaja del 2FA:', options: ['Permite navegar más rápido', 'Aumenta la seguridad con un segundo paso', 'Elimina la necesidad de contraseñas', 'Hace privadas todas las redes sociales'], correctAnswer: 1 },
      { id: 3, question: '¿Qué práctica reduce más la intrusión a una cuenta?', options: ['Conectarse a cualquier Wi-Fi', 'Usar contraseñas débiles', 'Activar 2FA', 'Compartir la contraseña'], correctAnswer: 2 },
      { id: 4, question: 'Guardar contraseñas en notas sin protección es inseguro porque:', options: ['Se borran fácilmente', 'Ocupan espacio', 'Puede acceder cualquier persona', 'No funcionan con 2FA'], correctAnswer: 2 },
      { id: 5, question: 'En redes Wi-Fi públicas se recomienda:', options: ['Hacer compras en línea', 'Usar banca digital', 'Evitar enviar datos sensibles', 'Apagar el celular'], correctAnswer: 2 },
      { id: 6, question: '¿Qué es esencial para proteger datos personales?', options: ['Navegar sin cerrar sesiones', 'Leer correos sospechosos', 'Revisar permisos y privacidad', 'Guardar pantallazos de todo'], correctAnswer: 2 },
      { id: 7, question: '¿Cuál es una mala práctica?', options: ['Cambiar contraseñas regularmente', 'Descargar archivos de sitios no confiables', 'Activar alertas de seguridad', 'Usar gestores de contraseñas'], correctAnswer: 1 },
      { id: 8, question: '¿Qué herramienta es adecuada para gestionar contraseñas?', options: ['Bloc de notas', 'Gestor de contraseñas', 'Mensajes de WhatsApp', 'Hoja en físico'], correctAnswer: 1 },
      { id: 9, question: '¿Por qué actualizar sistemas?', options: ['Para ahorrar espacio', 'Para mejorar apariencia', 'Para corregir fallos de seguridad', 'Para eliminar aplicaciones'], correctAnswer: 2 },
      { id: 10, question: 'Un sitio web pide información excesiva. Debes:', options: ['Dar todos los datos', 'Seguir sin cuestionar', 'Detener el proceso y verificar', 'Usar cualquier contraseña'], correctAnswer: 2 }
    ],
    status: 'not-started',
    score: null
  },
  {
    id: 3,
    title: 'Ética y respeto digital',
    color: '#90E0EF',
    icon: Users,
    description: 'Evalúa tu comprensión sobre ciudadanía digital responsable',
    questions: [
      { id: 1, question: 'Comportamiento de ciudadanía digital responsable:', options: ['Compartir rumores', 'Publicar datos ajenos', 'Respetar privacidad y derechos', 'Usar perfiles falsos'], correctAnswer: 2 },
      { id: 2, question: 'Insultar en redes afecta el principio de:', options: ['Respeto digital', 'Acceso libre', 'Seguridad informática', 'Alfabetización mediática'], correctAnswer: 0 },
      { id: 3, question: 'Compartir fotos sin permiso vulnera:', options: ['Entretenimiento digital', 'Gestión de archivos', 'Privacidad y derechos de terceros', 'Diseño digital'], correctAnswer: 2 },
      { id: 4, question: 'Acción que muestra respeto digital:', options: ['Burlarse de errores ajenos', 'Usar lenguaje adecuado', 'Difundir información falsa', 'Publicar conversaciones privadas'], correctAnswer: 1 },
      { id: 5, question: 'Manipular información para causar daño se relaciona con:', options: ['Phishing', 'Ciberética negativa', 'Evaluación digital', 'Alfabetización mediática'], correctAnswer: 1 },
      { id: 6, question: 'Verificar antes de compartir es importante porque:', options: ['Genera más vistas', 'Previene desinformación', 'Aumenta seguidores', 'Obliga a cerrar redes'], correctAnswer: 1 },
      { id: 7, question: 'Práctica ética ante una vulnerabilidad en un sitio:', options: ['Aprovecharla', 'Vender el acceso', 'Reportarla responsablemente', 'Publicarla en redes'], correctAnswer: 2 },
      { id: 8, question: 'El bullying digital afecta principalmente:', options: ['La velocidad de internet', 'El bienestar emocional', 'La batería del dispositivo', 'La publicidad dirigida'], correctAnswer: 1 },
      { id: 9, question: 'Promueve convivencia digital:', options: ['Provocar discusiones', 'Respetar opiniones ajenas', 'Compartir información privada', 'Imitar perfiles'], correctAnswer: 1 },
      { id: 10, question: 'Descargar contenido protegido sin permiso es poco ético porque:', options: ['Es difícil', 'Afecta derechos de autor', 'No deja comentarios', 'Cierra la sesión'], correctAnswer: 1 }
    ],
    status: 'not-started',
    score: null
  }
]);

const statusConfig = {
  'completed': { icon: CheckCircle2, text: 'Completada', badgeClass: 'bg-green-100 text-green-700' },
  'in-progress': { icon: CircleDashed, text: 'En progreso', badgeClass: 'bg-blue-100 text-blue-700' },
  'not-started': { icon: Circle, text: 'No iniciada', badgeClass: 'bg-gray-100 text-gray-700' }
};

const selectedCompetency = ref(null);
const answers = ref({});
const showResults = ref(false);
const score = ref(null);

const competency = computed(() => {
  if (!selectedCompetency.value) return null;
  return evaluationData.value.find(c => c.id === selectedCompetency.value);
});

const allAnswered = computed(() => {
  if (!competency.value) return false;
  return competency.value.questions.length === Object.keys(answers.value).length;
});

const handleCompetencySelect = (competencyId) => {
  const comp = evaluationData.value.find(c => c.id === competencyId);
  if (comp.status === 'not-started') {
    comp.status = 'in-progress';
  }
  selectedCompetency.value = competencyId;
  if (comp.status !== 'completed') {
    handleReset();
  } else {
    score.value = comp.score;
    showResults.value = true;
  }
};

const handleBackToEvaluations = () => {
  selectedCompetency.value = null;
  showResults.value = false;
};

const handleAnswerChange = (questionId, answerIndex) => {
  answers.value[questionId] = answerIndex;
};

const handleSubmit = () => {
  score.value = calculateScore();
  const comp = competency.value;
  if (comp) {
    comp.status = 'completed';
    comp.score = score.value;
  }
  showResults.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleReset = () => {
  answers.value = {};
  showResults.value = false;
  score.value = null;
  const comp = competency.value;
  if (comp) {
    comp.status = 'in-progress'; 
  }
};

const calculateScore = () => {
  if (!competency.value) return { correct: 0, total: 0, percentage: 0, grade: 0 };

  const correct = competency.value.questions.reduce((count, question) => {
    return answers.value[question.id] === question.correctAnswer ? count + 1 : count;
  }, 0);

  const total = competency.value.questions.length;
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  const grade = correct * 0.5;

  return { correct, total, percentage, grade };
};

const getScoreMessage = (percentage) => {
  if (percentage >= 90) return { text: '¡Excelente!', color: '#10b981' };
  if (percentage >= 70) return { text: '¡Muy bien!', color: '#0077B6' };
  if (percentage >= 50) return { text: 'Buen intento', color: '#f59e0b' };
  return { text: 'Necesitas repasar', color: '#ef4444' };
};

const getOptionClass = (question, optionIndex) => {
  if (!showResults.value) {
    return 'border-gray-300';
  }
  
  const userAnswer = answers.value[question.id];
  const isCorrect = optionIndex === question.correctAnswer;
  const isSelected = userAnswer === optionIndex;

  if (isCorrect) {
    return 'bg-green-100 border-green-500 border-2';
  }
  if (isSelected && !isCorrect) {
    return 'bg-red-100 border-red-500 border-2';
  }
  
  return 'border-gray-300';
};
</script>

<style>
/* Estilos para que los radio buttons tomen el color de la competencia */
.form-radio:checked {
  background-color: currentColor;
  border-color: currentColor;
}
.form-radio:focus {
  --tw-ring-color: currentColor;
}
</style>
