
<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="space-y-6">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2">Módulos</h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Explora cada competencia y sus temas para construir una base sólida de conocimiento en seguridad digital
        </p>
      </div>

      <div class="space-y-8 max-w-4xl mx-auto">
        <div 
          v-for="competency in competencies" 
          :key="competency.id" 
          class="bg-white rounded-lg shadow-sm border-t-4 border-transparent"
          :style="{ borderTopColor: competency.color }"
        >
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div 
                class="p-3 rounded-lg flex-shrink-0"
                :style="{ backgroundColor: `${competency.color}20` }"
              >
                <component 
                  :is="competency.icon" 
                  class="w-8 h-8" 
                  :style="{ color: competency.color }"
                />
              </div>
              <div class="flex-1">
                <span 
                  class="font-semibold text-[7px] py-1 px-3 rounded-full border"
                  :style="{ borderColor: competency.color, color: competency.color }"
                >
                  Competencia {{ competency.id }}
                </span>
                <h2 class="text-2xl font-bold mt-2 mb-1 text-gray-800">{{ competency.title }}</h2>
                <p class="text-gray-600">{{ competency.description }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div v-for="(topic, topicIndex) in competency.topics" :key="topicIndex">
              <div>
                <button 
                  @click="toggleTopic(competency.id, topicIndex)"
                  class="w-full flex justify-between items-center p-5 text-left font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  <div class="flex items-center gap-3">
                    <component 
                      :is="topic.icon" 
                      class="w-5 h-5 flex-shrink-0" 
                      :style="{ color: competency.color }"
                    />
                    <span>{{ topic.title }}</span>
                  </div>
                  <ChevronDown 
                    class="w-5 h-5 transition-transform duration-300"
                    :class="{ 'transform -rotate-180': isTopicOpen(competency.id, topicIndex) }"
                  />
                </button>
                <div 
                  v-if="isTopicOpen(competency.id, topicIndex)"
                  class="bg-white px-5 pb-6"
                >
                  <div class="space-y-6 pt-4 pl-8 border-l">
                    <p 
                      class="p-4 rounded-lg text-sm italic border-l-4"
                      :style="{ 
                        backgroundColor: `${competency.color}10`,
                        borderLeftColor: competency.color
                      }"
                    >
                      {{ topic.content }}
                    </p>
                    
                    <div v-for="(subtopic, subIndex) in topic.subtopics" :key="subIndex" class="space-y-3">
                      <h4 
                        class="flex items-center gap-2 font-semibold"
                        :style="{ color: competency.color }"
                      >
                        <span 
                          class="w-2 h-2 rounded-full"
                          :style="{ backgroundColor: competency.color }"
                        />
                        {{ subtopic.name }}
                      </h4>
                      <ul class="space-y-2 ml-4">
                        <li 
                          v-for="(point, pointIndex) in subtopic.points" 
                          :key="pointIndex"
                          class="flex items-start gap-3 text-sm text-gray-700"
                        >
                          <span 
                            class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gray-400"
                          />
                          <span class="flex-1">{{ point }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-4xl mx-auto rounded-lg p-6 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white">
        <div class="flex items-start gap-4">
          <Shield class="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 class="font-bold text-lg mb-1">¿Listo para practicar lo aprendido?</h3>
            <p class="text-sm text-blue-100">
              Cambia a la sección de <strong>Actividades</strong> para poner en práctica estos conocimientos mediante 
              ejercicios interactivos diseñados para cada competencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Lock, Shield, Users, AlertTriangle, Bug, UserX, Key, Smartphone, 
  Database, Heart, Flag, FileWarning, ChevronDown 
} from 'lucide-vue-next';

const openTopics = ref({});

const toggleTopic = (competencyId, topicIndex) => {
  const key = `${competencyId}-${topicIndex}`;
  openTopics.value[key] = !openTopics.value[key];
};

const isTopicOpen = (competencyId, topicIndex) => {
  const key = `${competencyId}-${topicIndex}`;
  return !!openTopics.value[key];
};

const competencies = ref([
    {
    id: 1,
    title: 'Conocimiento y responsabilidad digital',
    color: '#0077B6',
    icon: Shield,
    description: 'Comprende los riesgos digitales y desarrolla estrategias para protegerte en línea',
    topics: [
      {
        title: 'Riesgos cibernéticos',
        icon: AlertTriangle,
        content: `Los riesgos cibernéticos son amenazas que pueden comprometer tu seguridad, privacidad y bienestar en el entorno digital.`,
        subtopics: [
          {
            name: 'Tipos de riesgos',
            points: [
              'Riesgos técnicos: malware, virus, ransomware que dañan dispositivos',
              'Riesgos de privacidad: robo de datos personales, seguimiento no autorizado',
              'Riesgos sociales: ciberacoso, grooming, suplantación de identidad',
              'Riesgos financieros: fraudes bancarios, estafas de comercio electrónico'
            ]
          },
          {
            name: 'Señales de alerta',
            points: [
              'Dispositivo funcionando lento o con comportamiento extraño',
              'Mensajes o publicaciones que no realizaste',
              'Solicitudes inusuales de información personal',
              'Ventanas emergentes excesivas o redirecciones inesperadas'
            ]
          },
          {
            name: 'Prevención',
            points: [
              'Mantén actualizado tu sistema operativo y aplicaciones',
              'Usa software antivirus y antimalware confiable',
              'Realiza copias de seguridad regulares de información importante',
              'Educa a tu familia sobre seguridad digital'
            ]
          }
        ]
      },
      {
        title: 'Phishing',
        icon: Flag,
        content: `El phishing es una técnica de engaño donde atacantes se hacen pasar por entidades legítimas para robar información confidencial.`,
        subtopics: [
          {
            name: '¿Cómo funciona?',
            points: [
              'Envío de emails o mensajes que parecen de fuentes confiables (bancos, empresas)',
              'Incluyen enlaces a sitios web falsos que imitan páginas reales',
              'Solicitan información personal: contraseñas, números de tarjeta, datos bancarios',
              'Crean urgencia: "Tu cuenta será bloqueada", "Verifica ahora"'
            ]
          },
          {
            name: 'Tipos de phishing',
            points: [
              'Email phishing: correos masivos a miles de usuarios',
              'Spear phishing: ataques dirigidos a personas específicas',
              'Smishing: phishing vía SMS',
              'Vishing: phishing por llamadas telefónicas',
              'Pharming: redirección a sitios falsos mediante virus'
            ]
          },
          {
            name: 'Cómo identificarlo',
            points: [
              'Revisa el remitente: direcciones de email extrañas o con errores',
              'Desconfía de urgencias y amenazas',
              'Verifica los enlaces antes de hacer clic (pasa el cursor sin hacer clic)',
              'Busca errores ortográficos y gramaticales',
              'Nunca compartas información sensible por email'
            ]
          }
        ]
      },
      {
        title: 'Malware',
        icon: Bug,
        content: `El malware (software malicioso) es cualquier programa diseñado para dañar, infiltrarse o tomar control de sistemas sin autorización.`,
        subtopics: [
          {
            name: 'Tipos principales',
            points: [
              'Virus: se adjunta a archivos y se replica al ejecutarlos',
              'Troyanos: se disfrazan de software legítimo',
              'Ransomware: cifra archivos y exige rescate económico',
              'Spyware: espía tu actividad y roba información',
              'Adware: muestra publicidad no deseada constantemente'
            ]
          },
          {
            name: 'Formas de infección',
            points: [
              'Descargas de archivos de fuentes no confiables',
              'Hacer clic en enlaces maliciosos',
              'Abrir archivos adjuntos de emails sospechosos',
              'Instalar software pirata o crackeado',
              'Usar dispositivos USB infectados'
            ]
          },
          {
            name: 'Protección',
            points: [
              'Instala antivirus actualizado y escanea regularmente',
              'Solo descarga software de fuentes oficiales',
              'Lee permisos antes de instalar aplicaciones',
              'Mantén el sistema operativo actualizado',
              'Usa extensiones de navegador para bloquear anuncios maliciosos'
            ]
          }
        ]
      },
      {
        title: 'Robo de identidad',
        icon: UserX,
        content: `El robo de identidad ocurre cuando alguien usa tu información personal sin permiso para cometer fraudes o delitos.`,
        subtopics: [
          {
            name: 'Información en riesgo',
            points: [
              'Datos personales: nombre completo, fecha de nacimiento, dirección',
              'Documentos de identidad: números de cédula, pasaporte, licencia',
              'Información financiera: tarjetas de crédito, cuentas bancarias',
              'Credenciales digitales: contraseñas, correos electrónicos',
              'Datos biométricos: huellas dactilares, reconocimiento facial'
            ]
          },
          {
            name: 'Consecuencias',
            points: [
              'Fraudes financieros y compras no autorizadas',
              'Daño a tu historial crediticio',
              'Creación de cuentas falsas en tu nombre',
              'Problemas legales si el ladrón comete delitos',
              'Daño emocional y estrés prolongado'
            ]
          },
          {
            name: 'Prevención efectiva',
            points: [
              'No compartas información personal en redes sociales públicas',
              'Configura privacidad estricta en todas tus cuentas',
              'Destruye documentos con información sensible antes de desecharlos',
              'Monitorea tus cuentas bancarias y reportes de crédito',
              'Usa autenticación de dos factores en todas tus cuentas',
              'Ten cuidado con encuestas o formularios que piden demasiada información'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Prácticas seguras en línea',
    color: '#00B4D8',
    icon: Lock,
    description: 'Aprende técnicas concretas para proteger tu información y navegar de forma segura',
    topics: [
      {
        title: 'Contraseñas seguras',
        icon: Key,
        content: `Las contraseñas son la primera línea de defensa de tus cuentas. Una contraseña fuerte puede marcar la diferencia entre seguridad y vulnerabilidad.`,
        subtopics: [
          {
            name: 'Características de una contraseña fuerte',
            points: [
              'Longitud mínima de 12 caracteres (idealmente 16 o más)',
              'Combinación de letras mayúsculas y minúsculas',
              'Incluye números y símbolos especiales (@, #, $, %, etc.)',
              'No usa palabras del diccionario ni información personal',
              'Es única para cada cuenta (nunca reutilices contraseñas)'
            ]
          },
          {
            name: 'Errores comunes a evitar',
            points: [
              'Usar "123456", "password" o variaciones obvias',
              'Incluir tu nombre, fecha de nacimiento o nombres de familiares',
              'Usar la misma contraseña para múltiples sitios',
              'Escribir contraseñas en papel o archivos no protegidos',
              'Compartir contraseñas con otras personas',
              'Usar solo palabras con sustituciones simples (p@ssw0rd)'
            ]
          },
          {
            name: 'Métodos de creación',
            points: [
              'Passphrases: frases largas con palabras aleatorias (Ej: "Café-Montaña-Libro-87-Azul!")',
              'Generadores de contraseñas aleatorias',
              'Método de primera letra: toma la primera letra de cada palabra de una frase memorable',
              'Gestores de contraseñas: aplicaciones que generan y guardan contraseñas seguras'
            ]
          },
          {
            name: 'Gestión de contraseñas',
            points: [
              'Usa un gestor de contraseñas confiable (LastPass, 1Password, Bitwarden)',
              'Crea una contraseña maestra muy fuerte para el gestor',
              'Actualiza contraseñas cada 3-6 meses',
              'Cambia inmediatamente si sospechas que fue comprometida',
              'Habilita notificaciones de inicio de sesión en tus cuentas'
            ]
          }
        ]
      },
      {
        title: 'Autenticación en dos pasos (2FA)',
        icon: Smartphone,
        content: `La autenticación de dos factores añade una capa extra de seguridad requiriendo dos formas de verificación para acceder a tus cuentas.`,
        subtopics: [
          {
            name: '¿Qué es 2FA?',
            points: [
              'Combina algo que SABES (contraseña) con algo que TIENES (teléfono, token)',
              'Incluso si roban tu contraseña, no pueden acceder sin el segundo factor',
              'Reduce el riesgo de acceso no autorizado en más del 99%',
              'Cada inicio de sesión requiere confirmación adicional'
            ]
          },
          {
            name: 'Tipos de autenticación',
            points: [
              'SMS/Mensaje de texto: código enviado a tu teléfono',
              'Aplicaciones autenticadoras: Google Authenticator, Microsoft Authenticator',
              'Tokens físicos: dispositivos USB de seguridad (YubiKey)',
              'Biometría: huella dactilar, reconocimiento facial',
              'Códigos de respaldo: para usar si pierdes acceso al método principal'
            ]
          },
          {
            name: 'Mejores prácticas',
            points: [
              'Activa 2FA en todas las cuentas que lo ofrezcan (especialmente email y bancos)',
              'Prefiere apps autenticadoras sobre SMS (más seguras)',
              'Guarda códigos de respaldo en lugar seguro',
              'No compartas códigos 2FA con nadie',
              'Revisa dispositivos autorizados regularmente',
              'Ten un método de recuperación alternativo configurado'
            ]
          },
          {
            name: 'Cuentas prioritarias para 2FA',
            points: [
              'Email principal (es la puerta a todas tus otras cuentas)',
              'Banca en línea y aplicaciones financieras',
              'Redes sociales principales',
              'Servicios en la nube (Google Drive, iCloud, Dropbox)',
              'Plataformas de trabajo o estudio'
            ]
          }
        ]
      },
      {
        title: 'Protección de datos personales',
        icon: Database,
        content: `Tus datos personales son valiosos. Protegerlos significa controlar qué información compartes y con quién.`,
        subtopics: [
          {
            name: 'Tipos de datos personales',
            points: [
              'Datos de identificación: nombre, dirección, teléfono, email',
              'Datos sensibles: salud, religión, orientación política/sexual',
              'Datos financieros: cuentas bancarias, ingresos, historial crediticio',
              'Datos biométricos: huellas, rostro, iris, voz',
              'Datos de comportamiento: ubicación, historial de navegación, compras'
            ]
          },
          {
            name: 'Riesgos de compartir datos',
            points: [
              'Marketing dirigido y manipulación de consumo',
              'Discriminación basada en perfiles digitales',
              'Robo de identidad y fraudes',
              'Vigilancia y pérdida de privacidad',
              'Uso de datos sin tu consentimiento informado'
            ]
          },
          {
            name: 'Configuración de privacidad',
            points: [
              'Revisa configuración de privacidad en redes sociales mensualmente',
              'Limita quién puede ver tus publicaciones y perfil',
              'Desactiva la geolocalización en fotos y publicaciones',
              'Revisa qué aplicaciones tienen acceso a tus datos',
              'Lee políticas de privacidad de servicios que uses',
              'Elimina cuentas antiguas que ya no uses'
            ]
          },
          {
            name: 'Navegación segura',
            points: [
              'Usa navegación privada/incógnito para búsquedas sensibles',
              'Instala bloqueadores de rastreadores y cookies',
              'Verifica que sitios usen HTTPS (candado en la barra de dirección)',
              'No uses WiFi público para transacciones bancarias',
              'Considera usar VPN para mayor privacidad',
              'Limpia caché y cookies regularmente'
            ]
          },
          {
            name: 'Tus derechos digitales',
            points: [
              'Derecho a saber qué datos tienen sobre ti',
              'Derecho a solicitar corrección de datos incorrectos',
              'Derecho a eliminar tus datos (derecho al olvido)',
              'Derecho a portabilidad de datos',
              'Derecho a oponerte al procesamiento de tus datos',
              'Derecho a no ser sujeto de decisiones automatizadas'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Ética y respeto digital',
    color: '#48BFE3',
    icon: Users,
    description: 'Desarrolla valores para ser un ciudadano digital responsable y respetuoso',
    topics: [
      {
        title: 'Ciudadanía digital',
        icon: Heart,
        content: `Ser un ciudadano digital responsable significa usar la tecnología de manera ética, segura y respetuosa con los demás.`,
        subtopics: [
          {
            name: 'Pilares de la ciudadanía digital',
            points: [
              'Respeto: trata a otros en línea como te gustaría ser tratado',
              'Responsabilidad: piensa antes de publicar, considera consecuencias',
              'Empatía: comprende que detrás de cada pantalla hay una persona real',
              'Integridad: sé honesto y auténtico en tus interacciones digitales',
              'Participación positiva: contribuye constructivamente a comunidades'
            ]
          },
          {
            name: 'Comportamientos de un buen ciudadano digital',
            points: [
              'Verifica información antes de compartirla (combate desinformación)',
              'Respeta derechos de autor y propiedad intelectual',
              'Da crédito cuando uses trabajo de otros',
              'Reporta contenido inapropiado o ilegal',
              'Apoya a quienes son víctimas de acoso',
              'Usa lenguaje respetuoso incluso en desacuerdos'
            ]
          },
          {
            name: 'Huella digital',
            points: [
              'Todo lo que publicas deja rastro permanente',
              'Tu huella digital puede afectar oportunidades futuras (empleo, educación)',
              'Construye una presencia digital positiva y profesional',
              'Piensa: "¿Me sentiría cómodo si mi familia/profesor viera esto?"',
              'Busca tu nombre periódicamente para ver qué aparece sobre ti'
            ]
          },
          {
            name: 'Equilibrio digital',
            points: [
              'Establece límites de tiempo en pantalla',
              'Practica desintoxicación digital regularmente',
              'Mantén relaciones cara a cara, no solo virtuales',
              'Reconoce señales de adicción digital',
              'Usa tecnología con propósito, no por hábito'
            ]
          }
        ]
      },
      {
        title: 'Ciberacoso',
        icon: AlertTriangle,
        content: `El ciberacoso es el uso de tecnología para acosar, amenazar, avergonzar o intimidar a otra persona de forma repetida.`,
        subtopics: [
          {
            name: 'Formas de ciberacoso',
            points: [
              'Acoso directo: mensajes ofensivos, amenazas, insultos repetidos',
              'Exclusión: dejar a alguien fuera de grupos o conversaciones intencionalmente',
              'Denigración: difundir rumores falsos o información vergonzosa',
              'Suplantación: hacerse pasar por otra persona para dañar su reputación',
              'Doxing: publicar información privada sin consentimiento',
              'Cyberstalking: seguimiento y vigilancia obsesiva en línea'
            ]
          },
          {
            name: 'Impacto del ciberacoso',
            points: [
              'Daño emocional severo: ansiedad, depresión, baja autoestima',
              'Aislamiento social y problemas de confianza',
              'Rendimiento académico afectado',
              'Problemas de sueño y salud física',
              'En casos extremos: autolesión o pensamientos suicidas',
              'Efectos a largo plazo en salud mental'
            ]
          },
          {
            name: 'Si eres víctima',
            points: [
              'No respondas ni tomes represalias (puede empeorar la situación)',
              'Guarda evidencia: capturas de pantalla con fechas',
              'Bloquea al acosador en todas las plataformas',
              'Reporta el comportamiento a la plataforma',
              'Habla con un adulto de confianza (padres, profesores, consejero)',
              'Considera reportar a autoridades si hay amenazas serias',
              'Busca apoyo profesional si lo necesitas'
            ]
          },
          {
            name: 'Si eres testigo',
            points: [
              'No seas espectador pasivo: tu silencio valida el acoso',
              'Apoya a la víctima en privado',
              'Reporta el comportamiento a adultos o plataformas',
              'No compartas o amplíes contenido de acoso',
              'Habla contra el acoso de forma segura',
              'Sé un "upstander" (defensor) no un bystander (observador)'
            ]
          }
        ]
      },
      {
        title: 'Uso ético de la información',
        icon: FileWarning,
        content: `Usar información de manera ética significa respetar la propiedad intelectual, verificar fuentes y compartir responsablemente.`,
        subtopics: [
          {
            name: 'Propiedad intelectual',
            points: [
              'Derechos de autor: protegen obras creativas (textos, música, imágenes)',
              'Plagio: presentar trabajo ajeno como propio es fraude académico',
              'Fair use: uso limitado para educación, crítica o parodia',
              'Creative Commons: licencias que permiten uso con condiciones claras',
              'Siempre cita tus fuentes correctamente',
              'Pide permiso antes de usar contenido de otros'
            ]
          },
          {
            name: 'Verificación de información',
            points: [
              'Verifica con múltiples fuentes confiables',
              'Revisa la fecha de publicación (¿es actual o desactualizada?)',
              'Investiga al autor: ¿es experto en el tema?',
              'Identifica sesgos: ¿el contenido es objetivo o tiene agenda?',
              'Cuidado con titulares sensacionalistas ("clickbait")',
              'Usa sitios de fact-checking para noticias dudosas'
            ]
          },
          {
            name: 'Desinformación y "fake news"',
            points: [
              'Desinformación: información falsa compartida sin intención de engañar',
              'Información errónea: información falsa compartida intencionalmente',
              'Deepfakes: videos/audios manipulados con IA que parecen reales',
              'No compartas información que no has verificado',
              'Corrige información falsa cuando la veas',
              'Educa a otros sobre verificación de hechos'
            ]
          },
          {
            name: 'Compartir responsablemente',
            points: [
              'Piensa antes de compartir: ¿Es verdadero? ¿Es útil? ¿Es necesario?',
              'No difundas rumores o información no confirmada',
              'Respeta la privacidad de otros en fotos y publicaciones',
              'Considera el impacto de lo que compartes',
              'No uses información para manipular o engañar',
              'Asume responsabilidad por lo que publicas'
            ]
          }
        ]
      },
      {
        title: 'Respeto en redes sociales',
        icon: Users,
        content: `Las redes sociales son espacios públicos digitales que requieren el mismo respeto y consideración que interacciones cara a cara.`,
        subtopics: [
          {
            name: 'Netiqueta (etiqueta en internet)',
            points: [
              'Usa lenguaje apropiado y respetuoso',
              'No escribas TODO EN MAYÚSCULAS (se considera gritar)',
              'Lee completamente antes de comentar',
              'Mantén conversaciones on-topic (relevantes al tema)',
              'Admite errores y discúlpate cuando sea necesario',
              'Respeta diferentes opiniones y perspectivas'
            ]
          },
          {
            name: 'Manejo de conflictos',
            points: [
              'Desescala tensiones, no las alimentes',
              'Toma un respiro antes de responder cuando estés molesto',
              'Enfócate en el argumento, no en atacar a la persona',
              'Acepta estar de acuerdo en desacuerdo',
              'Usa mensajes privados para discusiones sensibles',
              'Saber cuándo alejarse de una conversación improductiva'
            ]
          },
          {
            name: 'Privacidad de otros',
            points: [
              'Pide permiso antes de etiquetar a alguien en fotos',
              'No compartas información personal de otros',
              'Respeta cuando alguien pide que borres su foto/información',
              'No hagas capturas de conversaciones privadas para compartir',
              'Considera los sentimientos antes de publicar sobre otros',
              'No expongas secretos o información confidencial'
            ]
          },
          {
            name: 'Comunidades positivas',
            points: [
              'Contribuye con contenido valioso y constructivo',
              'Celebra logros de otros genuinamente',
              'Ofrece apoyo en momentos difíciles',
              'Usa tu voz para causas positivas',
              'Crea espacios inclusivos donde todos se sientan bienvenidos',
              'Modela el comportamiento que quieres ver en otros'
            ]
          }
        ]
      }
    ]
  }
]);
</script>
