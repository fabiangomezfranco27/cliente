<template>
  <div class="space-y-6">
    <!-- Instructions -->
    <div class="p-4 rounded-lg bg-blue-50 border border-blue-200">
      <div class="flex items-start gap-3">
        <Info class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-blue-800">Instrucciones</h3>
          <p class="text-sm text-blue-700">Analiza cada correo y decide si es legítimo o phishing. Presta atención al remitente, contenido, tono y las solicitudes que hace.</p>
        </div>
      </div>
    </div>

    <!-- Score -->
    <div class="flex items-center justify-between text-sm">
      <div>
        <p class="text-gray-600">Progreso</p>
        <p class="font-semibold" :style="{ color }">Email {{ currentEmailIndex + 1 }} de {{ emails.length }}</p>
      </div>
      <div class="text-right">
        <p class="text-gray-600">Puntuación</p>
        <p class="font-semibold" :style="{ color }">{{ score.correct }} / {{ score.total }} correctas ({{ scorePercentage.toFixed(0) }}%)</p>
      </div>
    </div>

    <!-- Email Display -->
    <div class="border-2 rounded-lg" :style="{ borderColor: color }">
      <div class="p-4 bg-gray-50/70 border-b">
        <div class="flex items-start gap-3">
          <Mail class="w-6 h-6 mt-1 flex-shrink-0" :style="{ color }" />
          <div class="flex-1">
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1 mr-4">
                <p class="text-xs text-gray-500">De:</p>
                <p class="text-sm font-medium break-all">{{ currentEmail.from }}</p>
              </div>
              <span v-if="userAnswer !== null" class="px-2 py-0.5 text-xs font-semibold text-white rounded-full" :class="isCorrectAnswer ? 'bg-green-500' : 'bg-red-500'">
                {{ isCorrectAnswer ? '✓ Correcto' : '✗ Incorrecto' }}
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-500">Asunto:</p>
              <h3 class="text-base font-bold">{{ currentEmail.subject }}</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="p-5">
        <div class="bg-white border rounded-lg p-4 mb-4 whitespace-pre-wrap text-sm leading-relaxed">
          {{ currentEmail.body }}
        </div>

        <!-- Analysis Tools -->
        <button v-if="!showExplanation" @click="showIndicators = !showIndicators" class="w-full flex items-center justify-center gap-2 mb-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-100">
          <AlertTriangle class="w-4 h-4" />
          {{ showIndicators ? 'Ocultar pistas' : 'Mostrar pistas de análisis' }}
        </button>

        <div v-if="showIndicators && !showExplanation" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <p class="font-bold mb-2">Elementos a analizar:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>¿La dirección de email es legítima?</li>
            <li>¿El mensaje crea urgencia o pánico?</li>
            <li>¿Solicita información personal o financiera?</li>
            <li>¿Hay errores de ortografía o gramática?</li>
          </ul>
        </div>

        <!-- Answer buttons -->
        <div v-if="userAnswer === null" class="grid grid-cols-2 gap-4">
          <button @click="handleAnswer(false)" class="flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
            <CheckCircle2 class="w-5 h-5" />
            Legítimo
          </button>
          <button @click="handleAnswer(true)" class="flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
            <XCircle class="w-5 h-5" />
            Phishing
          </button>
        </div>

        <!-- Explanation -->
        <div v-if="showExplanation" class="space-y-4">
          <div class="p-4 rounded-lg border" :class="isCorrectAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'">
            <p class="font-bold mb-1">{{ isCorrectAnswer ? '¡Correcto!' : 'Incorrecto.' }} Este correo es <span class="uppercase">{{ currentEmail.isPhishing ? 'phishing' : 'legítimo' }}</span>.</p>
            <p class="text-sm">{{ currentEmail.explanation }}</p>
          </div>

          <div class="border rounded-lg">
            <div class="p-4"><h4 class="font-semibold text-base">Indicadores clave:</h4></div>
            <div class="p-4 border-t">
              <ul class="space-y-2">
                <li v-for="indicator in currentEmail.indicators" :key="indicator" class="flex items-start gap-2 text-sm">
                  <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" :style="{ backgroundColor: currentEmail.isPhishing ? '#ef4444' : '#22c55e' }"></span>
                  <span>{{ indicator }}</span>
                </li>
              </ul>
            </div>
          </div>

          <button @click="handleNext" class="w-full py-2.5 rounded-lg text-white font-semibold" :style="{ backgroundColor: color }">
            {{ isLastEmail ? 'Ver resultados y reiniciar' : 'Siguiente email →' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Final Results -->
    <div v-if="isLastEmail && showExplanation" class="p-6 text-center border-2 border-green-500 bg-green-50 rounded-lg">
      <h3 class="text-xl font-bold mb-2">¡Actividad completada!</h3>
      <p class="text-2xl font-bold mb-2" :style="{ color }">{{ score.correct }} / {{ score.total }} correctas ({{ scorePercentage.toFixed(0) }}%)</p>
      <p class="text-sm text-gray-700">{{ finalMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Mail, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-vue-next';

const props = defineProps({ isCompleted: Boolean, color: String });
const emit = defineEmits(['complete']);

const emails = [
  { id: 1, from: "seguridad@paypa1-secure.com", subject: "URGENTE: Verifica tu cuenta ahora", body: `Estimado usuario,\n\nHemos detectado actividad sospechosa en su cuenta de PayPal. Su cuenta será suspendida en 24 horas si no verifica su identidad.\n\nHaga clic aquí para verificar: http://paypa1-verify.secure-update.com/login\n\nAtentamente,\nDepartamento de Seguridad`, isPhishing: true, indicators: ["Dirección sospechosa: 'paypa1' (con un 1)", "Crea urgencia y amenaza", "URL falsa que no es de paypal.com"], explanation: "Clásico phishing que imita a una empresa. Usa un dominio similar y urgencia para que actúes sin pensar." },
  { id: 2, from: "noreply@bankofamerica.com", subject: "Estado de cuenta de octubre", body: `Hola,\n\nTu estado de cuenta de octubre ya está disponible. Puedes revisarlo ingresando a tu cuenta en www.bankofamerica.com.\n\nRecuerda que nunca te pediremos tu contraseña por correo.\n\nBank of America`, isPhishing: false, indicators: ["Dominio legítimo: @bankofamerica.com", "No solicita información personal", "No incluye enlaces de login directo, indica ir al sitio oficial"], explanation: "Correo legítimo. No pide información, usa el dominio oficial y recuerda buenas prácticas de seguridad." },
  { id: 3, from: "premio@loteria-nacional.winner.xyz", subject: "¡FELICIDADES! Ganaste $50,000 USD", body: `¡¡¡FELICIDADES!!!\n\nUsted a sido seleccionado como GANADOR de $50,000. Para reclamar su premio debe enviar copia de su identificación y pagar una tarifa de $500.\n\nResponda URGENTE.`, isPhishing: true, indicators: ["Dominio sospechoso: '.winner.xyz'", "Errores ortográficos ('a sido')", "Promesa de dinero fácil", "Pide un pago por adelantado para recibir un 'premio'"], explanation: "Estafa de 'lotería'. Nunca ganas sorteos en los que no participaste y nunca debes pagar para recibir un premio." },
  { id: 4, from: "notificaciones@spotify.com", subject: "Tu suscripción Premium vence pronto", body: `Hola,\n\nTu suscripción a Spotify Premium vencerá pronto. Para continuar sin interrupciones, inicia sesión en spotify.com y actualiza tu método de pago en la sección de tu cuenta.\n\nEl equipo de Spotify`, isPhishing: false, indicators: ["Dominio legítimo: @spotify.com", "No presiona con urgencia extrema", "Indica cómo realizar la acción de forma segura en el sitio oficial"], explanation: "Correo legítimo. Informa de un vencimiento pero no presiona ni incluye enlaces sospechosos, guiando al sitio oficial." },
  { id: 5, from: "soporte@micr0soft-security.online", subject: "Alerta de Seguridad: Virus detectado", body: `ALERTA DE SEGURIDAD DE MICROSOFT\n\nSe ha detectado un virus CRÍTICO en su PC. DESCARGUE INMEDIATAMENTE nuestro antivirus oficial para eliminarlo: [Descargar limpiador de virus]`, isPhishing: true, indicators: ["Dominio falso: 'micr0soft' (con un 0) y '.online'", "Microsoft no envía alertas de virus por email", "Crea pánico y pide descargar un software (probablemente malware)"], explanation: "Scam de 'soporte técnico falso'. Microsoft nunca te enviará un antivirus por email. El enlace probablemente instalaría malware." }
];

const currentEmailIndex = ref(0);
const userAnswer = ref(null);
const showExplanation = ref(false);
const score = ref({ correct: 0, total: 0 });
const showIndicators = ref(false);

const currentEmail = computed(() => emails[currentEmailIndex.value]);
const isLastEmail = computed(() => currentEmailIndex.value === emails.length - 1);

const handleAnswer = (answer) => {
  userAnswer.value = answer;
  showExplanation.value = true;
  const isCorrect = answer === currentEmail.value.isPhishing;
  score.value.total++;
  if (isCorrect) {
    score.value.correct++;
  }
  if (isLastEmail.value && !props.isCompleted) {
    emit('complete');
  }
};

const handleNext = () => {
  if (!isLastEmail.value) {
    currentEmailIndex.value++;
  } else {
    currentEmailIndex.value = 0;
    score.value = { correct: 0, total: 0 };
  }
  userAnswer.value = null;
  showExplanation.value = false;
  showIndicators.value = false;
};

const isCorrectAnswer = computed(() => userAnswer.value === currentEmail.value.isPhishing);
const scorePercentage = computed(() => score.value.total > 0 ? (score.value.correct / score.value.total) * 100 : 0);

const finalMessage = computed(() => {
  if (scorePercentage.value >= 80) return '¡Excelente! Tienes muy buen ojo para detectar phishing.';
  if (scorePercentage.value >= 60) return 'Buen trabajo. Con más práctica mejorarás aún más.';
  return 'Sigue practicando. Revisa el módulo de contenidos para reforzar conceptos.';
});
</script>
