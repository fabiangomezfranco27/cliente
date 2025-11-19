<template>
  <div class="space-y-6">
    <!-- Instructions -->
    <div class="p-4 rounded-lg bg-blue-50 border border-blue-200">
      <div class="flex items-start gap-3">
        <Info class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-blue-800">Instrucciones</h3>
          <p class="text-sm text-blue-700">Genera contraseñas seguras o prueba la tuya. El sistema analizará la fortaleza en tiempo real y te dará retroalimentación para mejorarla.</p>
        </div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Password Generator -->
      <div class="border-2 rounded-lg" :style="{ borderColor: color }">
        <div class="p-5"><h3 class="font-bold text-lg">Generador Automático</h3></div>
        <div class="p-5 border-t space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Longitud: {{ passwordLength }} caracteres</label>
            <input type="range" :value="passwordLength" @input="passwordLength = parseInt($event.target.value)" min="8" max="32" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div class="space-y-3 pt-2">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" v-model="includeUppercase" class="form-checkbox h-4 w-4"/>
              <span class="text-sm">Mayúsculas (A-Z)</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" v-model="includeLowercase" class="form-checkbox h-4 w-4"/>
              <span class="text-sm">Minúsculas (a-z)</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" v-model="includeNumbers" class="form-checkbox h-4 w-4"/>
              <span class="text-sm">Números (0-9)</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" v-model="includeSymbols" class="form-checkbox h-4 w-4"/>
              <span class="text-sm">Símbolos (!@#$%)</span>
            </label>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Contraseña generada</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <input :type="showPassword ? 'text' : 'password'" :value="generatedPassword" readonly class="w-full pr-10 border-gray-300 rounded-lg bg-gray-50" />
                <button @click="showPassword = !showPassword" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
                </button>
              </div>
              <button @click="copyToClipboard(generatedPassword)" title="Copiar" class="px-3 py-2 border rounded-lg hover:bg-gray-100">
                <Copy class="w-4 h-4" />
              </button>
            </div>
          </div>

          <button @click="generatePassword" class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-semibold" :style="{ backgroundColor: color }">
            <RefreshCw class="w-4 h-4" />
            Generar nueva contraseña
          </button>
        </div>
      </div>

      <!-- Custom Password Tester -->
      <div class="border-2 rounded-lg" :style="{ borderColor: color }">
        <div class="p-5"><h3 class="font-bold text-lg">Prueba tu propia contraseña</h3></div>
        <div class="p-5 border-t space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Ingresa tu contraseña</label>
            <div class="relative">
              <input :type="showPassword ? 'text' : 'password'" v-model="customPassword" placeholder="Escribe una contraseña..." class="w-full pr-10 border-gray-300 rounded-lg"/>
              <button @click="showPassword = !showPassword" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg space-y-2 text-xs text-gray-700">
            <h4 class="font-semibold text-sm text-gray-800">Consejos para contraseñas fuertes:</h4>
            <ul class="list-disc list-inside space-y-1">
              <li>Usa al menos 12-16 caracteres</li>
              <li>Combina mayúsculas, minúsculas, números y símbolos</li>
              <li>Evita palabras comunes o información personal</li>
              <li>Usa frases largas con palabras aleatorias</li>
            </ul>
          </div>

          <button v-if="customPassword" @click="copyToClipboard(customPassword)" class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold hover:bg-gray-100">
            <Copy class="w-4 h-4" />
            Copiar mi contraseña
          </button>
        </div>
      </div>
    </div>

    <!-- Strength Analysis -->
    <div class="border-2 rounded-lg" :style="{ borderColor: strength.color }">
      <div class="p-5"><h3 class="font-bold text-lg flex items-center gap-2">
        <component :is="StrengthIcon" class="w-5 h-5" :style="{ color: strength.color }" />
        Análisis de seguridad
      </h3></div>
      <div class="p-5 border-t space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Fortaleza:</span>
            <span class="font-bold" :style="{ color: strength.color }">{{ strength.label }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="h-3 rounded-full transition-all duration-300" :style="{ width: strength.score + '%', backgroundColor: strength.color }"></div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div><p class="text-xs text-gray-600">Longitud</p><p class="font-semibold">{{ currentPassword.length }} caracteres</p></div>
          <div><p class="text-xs text-gray-600">Puntuación</p><p class="font-semibold">{{ strength.score }}/100</p></div>
          <div class="col-span-2"><p class="text-xs text-gray-600">Tiempo estimado para descifrar</p><p class="font-semibold" :style="{ color: strength.color }">{{ strength.timeToCrack }}</p></div>
        </div>

        <div v-if="strength.feedback.length > 0">
          <p class="text-sm font-semibold mb-2">Recomendaciones:</p>
          <ul class="space-y-1">
            <li v-for="(item, index) in strength.feedback" :key="index" class="flex items-start gap-2 text-sm">
              <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" :style="{ backgroundColor: strength.color }"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div v-if="strength.score >= 60" class="p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
           <CheckCircle2 class="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
           <p class="text-sm text-green-800">¡Excelente! Has creado una contraseña {{ strength.label.toLowerCase() }}. Recuerda usar un gestor de contraseñas y activar la autenticación de dos factores (2FA).</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Info, Copy, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Eye, EyeOff } from 'lucide-vue-next';

const props = defineProps({ isCompleted: Boolean, color: String });
const emit = defineEmits(['complete']);

const customPassword = ref('');
const generatedPassword = ref('');
const passwordLength = ref(16);
const includeUppercase = ref(true);
const includeLowercase = ref(true);
const includeNumbers = ref(true);
const includeSymbols = ref(true);
const showPassword = ref(false);
const hasTestedPassword = ref(false);

const analyzePassword = (password) => {
  if (!password) {
    return { score: 0, label: 'Sin contraseña', color: '#9ca3af', feedback: ['Ingresa o genera una contraseña para analizarla'], timeToCrack: 'N/A' };
  }
  let score = 0;
  const feedback = [];
  if (password.length >= 16) score += 30;
  else if (password.length >= 12) { score += 20; feedback.push('Considera usar al menos 16 caracteres'); }
  else if (password.length >= 8) { score += 10; feedback.push('Usa al menos 12-16 caracteres'); }
  else feedback.push('¡Peligrosamente corta! Mínimo 8 caracteres');

  const hasLower = /[a-z]/.test(password), hasUpper = /[A-Z]/.test(password), hasNumber = /[0-9]/.test(password), hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  score += varietyCount * 15;
  if (!hasLower) feedback.push('Añade letras minúsculas');
  if (!hasUpper) feedback.push('Añade letras mayúsculas');
  if (!hasNumber) feedback.push('Añade números');
  if (!hasSymbol) feedback.push('Añade símbolos especiales (@, #, $)');

  if (/(.)\1{2,}/.test(password)) { score -= 20; feedback.push('Evita secuencias (123, abc) y repeticiones'); }
  if (['password', 'admin', '123456', 'qwerty'].some(word => password.toLowerCase().includes(word))) { score -= 15; feedback.push('No uses palabras comunes'); }

  score = Math.max(0, Math.min(100, score));

  let timeToCrack = 'Horas o menos';
  if (score >= 80) timeToCrack = 'Siglos o más';
  else if (score >= 60) timeToCrack = 'Años';
  else if (score >= 40) timeToCrack = 'Meses';
  else if (score >= 20) timeToCrack = 'Días';
  
  let label = 'Muy débil', colorValue = '#ef4444';
  if (score >= 80) { label = 'Muy fuerte', colorValue = '#22c55e'; if (feedback.length === 0) feedback.push('¡Excelente contraseña! Muy difícil de descifrar.'); }
  else if (score >= 60) { label = 'Fuerte', colorValue = '#84cc16'; }
  else if (score >= 40) { label = 'Moderada', colorValue = '#eab308'; }
  else if (score >= 20) { label = 'Débil', colorValue = '#f97316'; }

  return { score, label, color: colorValue, feedback, timeToCrack };
};

const generatePassword = () => {
  const length = passwordLength.value;
  let charset = '';
  if (includeLowercase.value) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase.value) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers.value) charset += '0123456789';
  if (includeSymbols.value) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (charset === '') return;

  let pass = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) pass += charset[array[i] % charset.length];
  generatedPassword.value = pass;
  customPassword.value = '';
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  // Opcional: podrías usar una librería de notificaciones si la instalas
};

onMounted(generatePassword);

const currentPassword = computed(() => customPassword.value || generatedPassword.value);
const strength = computed(() => analyzePassword(currentPassword.value));

const handleTestComplete = () => {
  if (!hasTestedPassword.value && strength.value.score >= 60) {
    hasTestedPassword.value = true;
    emit('complete');
  }
};

watch([customPassword, strength], () => {
  if (customPassword.value && strength.value.score >= 60) {
    handleTestComplete();
  }
});

const StrengthIcon = computed(() => strength.value.score >= 80 ? CheckCircle2 : strength.value.score >= 40 ? AlertTriangle : XCircle);

</script>
