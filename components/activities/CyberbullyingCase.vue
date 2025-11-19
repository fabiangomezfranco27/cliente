<template>
  <div class="space-y-6">
    <!-- Pantalla de Introducción -->
    <div v-if="showIntro" class="space-y-6">
      <div class="border-2 rounded-lg" :style="{ borderColor: color }">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <Users class="w-6 h-6" :style="{ color }" />
            <h2 class="text-xl font-bold">{{ caseStudy.title }}</h2>
          </div>
          <div class="p-4 mb-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex items-center gap-2 font-semibold">
              <Info class="h-4 w-4" />
              <span>Tipo de actividad: Caso interactivo con decisiones múltiples</span>
            </div>
          </div>
          <div class="prose prose-sm max-w-none mb-4">
            <p class="whitespace-pre-line">{{ caseStudy.introduction }}</p>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <h4 class="flex items-center gap-2 mb-2 font-semibold text-yellow-800">
              <Heart class="w-4 h-4 text-yellow-600" />
              <span>Objetivos de aprendizaje</span>
            </h4>
            <ul class="text-sm space-y-1 ml-6 list-disc">
              <li>Identificar comportamientos de ciberacoso</li>
              <li>Comprender el impacto emocional en las víctimas</li>
              <li>Practicar respuestas éticas como testigo</li>
              <li>Desarrollar empatía y ciudadanía digital responsable</li>
              <li>Aprender estrategias de apoyo y reporte</li>
            </ul>
          </div>
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p><strong>Instrucciones:</strong> Enfrentarás 4 situaciones donde deberás tomar decisiones. Cada decisión tiene consecuencias. Recibirás retroalimentación después de cada decisión.</p>
          </div>
        </div>
        <div class="p-6 border-t">
          <button @click="showIntro = false" class="w-full py-2.5 rounded-lg text-white font-semibold transition-transform hover:scale-[1.02]" :style="{ backgroundColor: color }">
            Comenzar el caso →
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido Principal del Caso -->
    <div v-else class="space-y-6">
      <!-- Progreso -->
      <div class="flex items-center justify-between text-sm">
        <div>
          <p class="text-gray-600">Progreso del caso</p>
          <p class="font-semibold" :style="{ color }">Decisión {{ currentDecisionIndex + 1 }} de {{ caseStudy.decisions.length }}</p>
        </div>
        <div v-if="decisions.length > 0" class="text-right">
          <p class="text-gray-600">Decisiones éticas</p>
          <p class="font-semibold" :style="{ color }">{{ ethicalDecisions }} / {{ decisions.length }}</p>
        </div>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-green-500 h-2 rounded-full transition-all duration-300" :style="{ width: progressPercentage + '%' }"></div>
      </div>

      <!-- Decisión Actual -->
      <div class="border-2 rounded-lg" :style="{ borderColor: color }">
        <div class="p-6">
          <span class="font-semibold text-xs py-1 px-3 rounded-full border" :style="{ borderColor: color, color }">Situación {{ currentDecision.id }}</span>
          <h3 class="text-lg font-bold mt-2">{{ currentDecision.scenario }}</h3>
        </div>
        <div class="p-6 border-t space-y-4">
          <div class="p-4 rounded-lg border-l-4 italic text-sm" :style="{ backgroundColor: `${color}10`, borderLeftColor: color }">
            <MessageSquare class="w-4 h-4 inline mr-2" :style="{ color }" />
            {{ currentDecision.context }}
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p><strong>{{ currentDecision.question }}</strong></p>
          </div>

          <!-- Opciones (sin feedback) -->
          <div v-if="!showFeedback" class="space-y-3">
            <label v-for="option in currentDecision.options" :key="option.id" class="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" :class="{'ring-2 ring-blue-500 bg-blue-50': selectedOption === option.id}">
              <input type="radio" :name="'decision-' + currentDecision.id" :value="option.id" v-model="selectedOption" class="mt-1 form-radio text-blue-600 focus:ring-blue-500">
              <span class="flex-1">{{ option.text }}</span>
            </label>
          </div>

          <button v-if="!showFeedback && selectedOption" @click="handleSubmitDecision" class="w-full py-2.5 rounded-lg text-white font-semibold" :style="{ backgroundColor: color }">
            Confirmar decisión
          </button>

          <!-- Feedback -->
          <div v-if="showFeedback && selectedOptionData" class="space-y-4">
            <div class="p-4 rounded-lg border flex gap-3" :class="feedbackAlertClass">
              <component :is="ImpactIcon" class="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p class="font-bold mb-1">{{ feedbackTitle }}</p>
                <p class="text-sm">{{ selectedOptionData.explanation }}</p>
              </div>
            </div>

            <div class="border rounded-lg">
              <div class="p-4"><h4 class="font-semibold">Consecuencias de tu decisión</h4></div>
              <div class="p-4 border-t"><p class="text-sm">{{ selectedOptionData.consequences }}</p></div>
            </div>

            <div class="p-4 bg-blue-50/60 rounded-lg space-y-3">
              <h4 class="font-semibold text-sm">Otras opciones que tenías:</h4>
              <div v-for="opt in otherOptions" :key="opt.id" class="text-sm flex items-start gap-2">
                <component :is="opt.isEthical ? CheckCircle2 : XCircle" class="w-4 h-4 mt-0.5 flex-shrink-0" :class="opt.isEthical ? 'text-green-600' : 'text-red-600'" />
                <div>
                  <p class="mb-1">{{ opt.text }}</p>
                  <p class="text-xs text-gray-600">{{ opt.explanation }}</p>
                </div>
              </div>
            </div>

            <button @click="handleNext" class="w-full py-2.5 rounded-lg text-white font-semibold" :style="{ backgroundColor: color }">
              {{ isLastDecision ? 'Ver resultados finales →' : 'Siguiente situación →' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Resultados Finales -->
      <div v-if="isLastDecision && showFeedback" class="border-2 border-green-500 bg-green-50 rounded-lg">
        <div class="p-6">
          <h3 class="flex items-center gap-2 text-xl font-bold">
            <Award class="w-6 h-6 text-green-600" />
            ¡Caso completado!
          </h3>
        </div>
        <div class="p-6 border-t space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-white rounded-lg border">
              <p class="text-2xl font-bold mb-1" :style="{ color }">{{ ethicalDecisions }}/{{ decisions.length }}</p>
              <p class="text-sm text-gray-600">Decisiones éticas</p>
            </div>
            <div class="text-center p-4 bg-white rounded-lg border">
              <p class="text-2xl font-bold mb-1" :style="{ color }">{{ positiveImpacts }}/{{ decisions.length }}</p>
              <p class="text-sm text-gray-600">Impactos positivos</p>
            </div>
          </div>
          <div class="p-4 bg-white rounded-lg border">
            <h4 class="font-semibold mb-2">Evaluación de tu desempeño:</h4>
            <div v-if="ethicalPercentage >= 75" class="space-y-2">
              <p class="flex items-center gap-2 font-semibold"><CheckCircle2 class="w-5 h-5 text-green-600" />Excelente ciudadanía digital</p>
              <p class="text-sm">Demostraste gran empatía y comprensión de las responsabilidades como testigo de ciberacoso.</p>
            </div>
            <div v-else-if="ethicalPercentage >= 50" class="space-y-2">
              <p class="flex items-center gap-2 font-semibold"><AlertTriangle class="w-5 h-5 text-yellow-600" />Buen progreso con áreas de mejora</p>
              <p class="text-sm">Mostraste comportamientos éticos, pero hay oportunidades para ser un mejor aliado.</p>
            </div>
            <div v-else class="space-y-2">
              <p class="flex items-center gap-2 font-semibold"><XCircle class="w-5 h-5 text-red-600" />Necesitas más formación en ética digital</p>
              <p class="text-sm">Es importante repasar los contenidos sobre ciberacoso y ciudadanía digital.</p>
            </div>
          </div>
          <div class="p-4 bg-white rounded-lg border">
            <h4 class="font-semibold mb-2">Lecciones clave:</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start gap-2"><Heart class="w-4 h-4 mt-0.5 flex-shrink-0" :style="{ color }" /><span>El silencio ante el acoso es complicidad. Hablar es valentía.</span></li>
              <li class="flex items-start gap-2"><Heart class="w-4 h-4 mt-0.5 flex-shrink-0" :style="{ color }" /><span>Apoyar a la víctima directamente puede marcar una diferencia enorme.</span></li>
              <li class="flex items-start gap-2"><Heart class="w-4 h-4 mt-0.5 flex-shrink-0" :style="{ color }" /><span>Buscar ayuda de adultos es apropiado y necesario en casos serios.</span></li>
            </ul>
          </div>
          <button @click="handleNext" class="w-full py-2 rounded-lg border font-semibold transition-colors hover:bg-gray-100">
            Reiniciar caso para explorar otras opciones
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Info, MessageSquare, Users, Heart, AlertTriangle, CheckCircle2, XCircle, Award } from 'lucide-vue-next';

const props = defineProps({
  isCompleted: Boolean,
  color: String
});

const emit = defineEmits(['complete']);

const caseStudy = {
  title: "Conflicto en el Grupo de Clase",
  introduction: `Eres estudiante de grado 9° y miembro activo del grupo de WhatsApp de tu clase. 

Situación: Tu compañera María publicó una foto bailando en una fiesta familiar el fin de semana. El lunes, varios compañeros comenzaron a hacer comentarios burlones sobre su forma de bailar. Uno de ellos, Carlos, tomó capturas de pantalla de la foto y creó un meme que está compartiendo en otros grupos. María se ve muy afectada y ha faltado a clases dos días seguidos.

Como testigo de esta situación, tus decisiones pueden marcar una diferencia significativa.`,
  decisions: [
    {
      id: 1,
      scenario: "El meme se está viralizando",
      context: "Carlos acaba de compartir el meme en el grupo principal de la clase y varios compañeros están reaccionando con emojis de risa. Algunos están compartiendo el meme en sus estados de WhatsApp.",
      question: "¿Qué haces inmediatamente?",
      options: [
        { id: "a", text: "Reírme también y reaccionar con emojis para no quedar fuera del grupo", isEthical: false, impact: 'negative', explanation: "Esta acción normaliza el acoso y contribuye al daño emocional de María. Ser espectador pasivo o participar, aunque sea levemente, valida el comportamiento del acosador.", consequences: "María se siente más aislada. El acoso se intensifica porque nadie lo detiene. Puedes ser considerado cómplice del ciberacoso." },
        { id: "b", text: "Ignorar el mensaje y no hacer nada porque 'no es mi problema'", isEthical: false, impact: 'negative', explanation: "El silencio ante el acoso es complicidad. Como miembro de la comunidad, tienes responsabilidad de actuar cuando ves injusticia.", consequences: "El acoso continúa sin oposición. María puede interpretar el silencio como aprobación. Se pierde la oportunidad de detener el acoso tempranamente." },
        { id: "c", text: "Escribir en el grupo que eso no está bien y pedirles que paren", isEthical: true, impact: 'positive', explanation: "Hablar públicamente contra el acoso muestra valentía y establece límites claros. Puede inspirar a otros a hacer lo mismo.", consequences: "Demuestras liderazgo moral. Otros pueden unirse a tu postura. El acosador enfrenta consecuencias sociales. María ve que tiene apoyo." },
        { id: "d", text: "Contactar a María en privado para apoyarla y luego reportar la situación a un profesor", isEthical: true, impact: 'positive', explanation: "Esta es la respuesta más completa: ofreces apoyo directo a la víctima y buscas ayuda de una autoridad. Reconoces que requiere intervención adulta.", consequences: "María recibe apoyo emocional inmediato. Un adulto responsable puede intervenir apropiadamente. Se inicia un proceso formal." }
      ]
    },
    {
      id: 2,
      scenario: "Conversación con tus amigos",
      context: "Durante el recreo, tus amigos dicen que 'María debería tomar las cosas con humor'.",
      question: "¿Cómo respondes a esta conversación?",
      options: [
        { id: "a", text: "Estar de acuerdo en que María es muy sensible", isEthical: false, impact: 'negative', explanation: "Culpar a la víctima es injusto. El problema no es la sensibilidad de María, sino el acoso que está sufriendo.", consequences: "Se perpetúa la cultura de culpar a la víctima. Se normaliza el acoso." },
        { id: "b", text: "Explicar que el ciberacoso tiene consecuencias reales y que María está sufriendo", isEthical: true, impact: 'positive', explanation: "Educas a tus amigos sobre el impacto real del ciberacoso, poniendo el foco en el daño causado.", consequences: "Tus amigos pueden reconsiderar su perspectiva. Se inicia una conversación educativa." },
        { id: "c", text: "Cambiar de tema porque me incomoda la conversación", isEthical: false, impact: 'neutral', explanation: "Evitar el tema pierde la oportunidad de educar a tus amigos y defender lo correcto.", consequences: "Tus amigos mantienen sus creencias problemáticas. El silencio puede interpretarse como acuerdo." },
        { id: "d", text: "Proponer hablar con María para disculparse como grupo", isEthical: true, impact: 'positive', explanation: "No solo educas, sino que propones acción reparadora concreta. Transformas la conversación en un plan para hacer lo correcto.", consequences: "Se crea un movimiento positivo de apoyo. María puede recibir disculpas genuinas." }
      ]
    },
    {
      id: 3,
      scenario: "Carlos te confronta",
      context: "Carlos se acerca y dice: 'Escuché que hablaste con el profesor. ¿Por qué te metes? Era solo una broma.'",
      question: "¿Cómo manejas esta confrontación?",
      options: [
        { id: "a", text: "Disculparme con Carlos y prometerle que no volveré a reportarlo", isEthical: false, impact: 'negative', explanation: "Ceder ante la presión del acosador envía el mensaje de que el acoso es aceptable.", consequences: "Carlos aprende que puede intimidar para evitar consecuencias. María queda desprotegida." },
        { id: "b", text: "Explicarle calmadamente que sus acciones lastimaron a María", isEthical: true, impact: 'positive', explanation: "Mantienes la calma y te enfocas en el impacto de sus acciones, dándole la oportunidad de entender el daño.", consequences: "Carlos puede reflexionar sobre sus acciones. Modelas resolución de conflictos madura." },
        { id: "c", text: "Gritarle y acusarlo públicamente de acosador", isEthical: false, impact: 'neutral', explanation: "La confrontación agresiva puede escalar el conflicto innecesariamente.", consequences: "La situación se vuelve más tensa. Se pierde la oportunidad de un diálogo educativo." },
        { id: "d", text: "Mantener tu postura y sugerir que hable con el profesor para resolver esto", isEthical: true, impact: 'positive', explanation: "No solo defiendes tu decisión, sino que ofreces un camino constructivo hacia adelante.", consequences: "Demuestras madurez emocional. Carlos puede tomar responsabilidad con apoyo." }
      ]
    },
    {
      id: 4,
      scenario: "María regresa a clases",
      context: "Después de una semana, María regresa. Se ve triste y evita contacto visual. En el almuerzo, está sentada sola.",
      question: "¿Qué haces para ayudar a reconstruir un ambiente positivo?",
      options: [
        { id: "a", text: "Sentarme con María y ofrecerle mi apoyo", isEthical: true, impact: 'positive', explanation: "El apoyo directo y visible a la víctima es fundamental. Le muestras que no está sola.", consequences: "María se siente menos aislada. Se envía un mensaje claro de apoyo a la clase." },
        { id: "b", text: "Seguir con mi vida normal y esperar que todo se calme con el tiempo", isEthical: false, impact: 'neutral', explanation: "La recuperación requiere esfuerzo activo. El tiempo solo no cura el daño del acoso.", consequences: "María continúa sintiéndose aislada. Se pierde la oportunidad de crear una cultura de respeto." },
        { id: "c", text: "Organizar una reunión de clase para establecer reglas de respeto en el grupo de WhatsApp", isEthical: true, impact: 'positive', explanation: "Tomas liderazgo proactivo para prevenir futuros incidentes y convertir una situación negativa en crecimiento colectivo.", consequences: "La clase establece normas claras de convivencia digital, previniendo futuros casos." },
        { id: "d", text: "Proponer un proyecto sobre ciudadanía digital, con María como líder", isEthical: true, impact: 'positive', explanation: "Transformas la narrativa: María pasa de víctima a líder. Se crea aprendizaje significativo para todos.", consequences: "María recupera empoderamiento y confianza. La clase aprende profundamente sobre el tema." }
      ]
    }
  ]
};

const currentDecisionIndex = ref(0);
const selectedOption = ref(null);
const showFeedback = ref(false);
const decisions = ref([]);
const showIntro = ref(true);

const currentDecision = computed(() => caseStudy.decisions[currentDecisionIndex.value]);
const isLastDecision = computed(() => currentDecisionIndex.value === caseStudy.decisions.length - 1);

const handleSubmitDecision = () => {
  if (!selectedOption.value) return;
  const option = currentDecision.value.options.find(o => o.id === selectedOption.value);
  if (!option) return;

  decisions.value.push({
    decisionId: currentDecision.value.id,
    optionId: selectedOption.value,
    isEthical: option.isEthical,
    impact: option.impact
  });

  showFeedback.value = true;

  if (isLastDecision.value && !props.isCompleted) {
    emit('complete');
  }
};

const handleNext = () => {
  if (!isLastDecision.value) {
    currentDecisionIndex.value++;
    selectedOption.value = null;
    showFeedback.value = false;
  } else {
    // Reset
    currentDecisionIndex.value = 0;
    selectedOption.value = null;
    showFeedback.value = false;
    decisions.value = [];
    showIntro.value = true;
  }
};

const selectedOptionData = computed(() => {
  return selectedOption.value ? currentDecision.value.options.find(o => o.id === selectedOption.value) : null;
});

const otherOptions = computed(() => {
  return selectedOption.value ? currentDecision.value.options.filter(o => o.id !== selectedOption.value) : [];
});

const ethicalDecisions = computed(() => decisions.value.filter(d => d.isEthical).length);
const positiveImpacts = computed(() => decisions.value.filter(d => d.impact === 'positive').length);
const ethicalPercentage = computed(() => {
  return decisions.value.length > 0 ? (ethicalDecisions.value / decisions.value.length) * 100 : 0;
});
const progressPercentage = computed(() => {
  // The progress bar is full only when the feedback for the last question is shown
  const completedSteps = currentDecisionIndex.value + (showFeedback.value ? 1 : 0);
  return (completedSteps / caseStudy.decisions.length) * 100;
});

const ImpactIcon = computed(() => {
  if (!selectedOptionData.value) return Info;
  switch (selectedOptionData.value.impact) {
    case 'positive': return CheckCircle2;
    case 'negative': return XCircle;
    default: return AlertTriangle;
  }
});

const feedbackTitle = computed(() => {
  if (!selectedOptionData.value) return '';
  const ethicalText = selectedOptionData.value.isEthical ? '✓ Decisión ética' : '✗ Decisión cuestionable';
  const impactText = `Impacto ${selectedOptionData.value.impact}`;
  return `${ethicalText} - ${impactText}`;
});

const feedbackAlertClass = computed(() => {
  if (!selectedOptionData.value) return '';
  switch (selectedOptionData.value.impact) {
    case 'positive': return 'border-green-500 bg-green-50 text-green-800';
    case 'negative': return 'border-red-500 bg-red-50 text-red-800';
    default: return 'border-yellow-500 bg-yellow-50 text-yellow-800';
  }
});
</script>
