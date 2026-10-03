// 30 Balanced Forced-Choice Triads based on Thurstonian IRT (Brown & Maydeu-Olivares, 2011)
// Divided into Block 4A (Personality & Rationality) and Block 4B (Neurodivergent Phenotype)
import { TriadItem } from './types';

export const TRIADS_POOL: TriadItem[] = [
  // ==========================================
  // BLOCK 4A: PERSONALITY & RATIONALITY (15 Triads)
  // Dimensions: CB5T Plasticity, CB5T Stability, HEXACO H-H, CART AOT, Cognitive Miserliness Resistance
  // ==========================================
  {
    id: 'triad_4a_01',
    block: '4A',
    triadNumber: 1,
    statements: [
      { id: '4a_01_a', text: 'Me entusiasma explorar teorías complejas y conexiones conceptuales novedosas.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_01_b', text: 'Mantengo la compostura y mis rutinas organizadas aun bajo intensa presión.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_01_c', text: 'Trato a todas las personas con justicia, sin buscar privilegios personales no merecidos.', trait: 'hexaco_honesty_humility', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_02',
    block: '4A',
    triadNumber: 2,
    statements: [
      { id: '4a_02_a', text: 'Modifico mis convicciones con facilidad si los datos empíricos contradicen mi hipótesis.', trait: 'cart_aot', weight: 1 },
      { id: '4a_02_b', text: 'Detengo mi primera respuesta intuitiva para verificar lógicamente si el razonamiento es correcto.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_02_c', text: 'Siento un impulso natural hacia proyectos creativos imprevistos e ideas heterodoxas.', trait: 'cb5t_plasticity', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_03',
    block: '4A',
    triadNumber: 3,
    statements: [
      { id: '4a_03_a', text: 'Cumplo rigurosamente mis compromisos incluso cuando el entusiasmo inicial desaparece.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_03_b', text: 'Evito manipular situaciones o personas para obtener ventajas materiales a corto plazo.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_03_c', text: 'Escucho con genuino interés argumentos rigurosos que defienden posturas opuestas a la mía.', trait: 'cart_aot', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_04',
    block: '4A',
    triadNumber: 4,
    statements: [
      { id: '4a_04_a', text: 'No me conformo con explicaciones superficiales cuando analizo un problema complejo.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_04_b', text: 'Me apasiona iniciar caminos de aprendizaje desconocidos aunque sean inciertos.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_04_c', text: 'Regulo mis estados de ánimo para evitar que perturben mis metas a largo plazo.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_05',
    block: '4A',
    triadNumber: 5,
    statements: [
      { id: '4a_05_a', text: 'Prefiero la sinceridad transparente antes que halagar a otros por interés táctico.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_05_b', text: 'Someto mis propias conclusiones al mismo rigor crítico que aplico a los demás.', trait: 'cart_aot', weight: 1 },
      { id: '4a_05_c', text: 'Verifico conscientemente cálculos o supuestos antes de darlos por válidos.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_06',
    block: '4A',
    triadNumber: 6,
    statements: [
      { id: '4a_06_a', text: 'Me atraen los estímulos intelectuales provocadores y la experimentación abierta.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_06_b', text: 'Reconozco con honestidad mis limitaciones cognitivas y errores de cálculo.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_06_c', text: 'Sostengo planes a largo plazo con disciplina metódica frente a perturbaciones.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_07',
    block: '4A',
    triadNumber: 7,
    statements: [
      { id: '4a_07_a', text: 'Estoy dispuesto a admitir que estaba equivocado si me presentan evidencia contraria contundente.', trait: 'cart_aot', weight: 1 },
      { id: '4a_07_b', text: 'Evito tomar atajos heurísticos cuando la precisión del resultado es crítica.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_07_c', text: 'Me recupero con solidez y equilibrio frente a contratiempos inesperados.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_08',
    block: '4A',
    triadNumber: 8,
    statements: [
      { id: '4a_08_a', text: 'Me desconecto con facilidad de las convenciones para explorar nuevas posibilidades.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_08_b', text: 'Siento aversión hacia el fraude o el aprovechamiento ilegítimo de las reglas.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_08_c', text: 'Reviso mis supuestos implícitos para evitar caer en razonamientos perezosos.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_09',
    block: '4A',
    triadNumber: 9,
    statements: [
      { id: '4a_09_a', text: 'Busco activamente fuentes discrepantes que cuestionen mi visión actual del mundo.', trait: 'cart_aot', weight: 1 },
      { id: '4a_09_b', text: 'Mantengo el orden físico y temporal necesario para cumplir mis objetivos de trabajo.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_09_c', text: 'Encuentro fascinante conectar campos del conocimiento aparentemente inconexos.', trait: 'cb5t_plasticity', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_10',
    block: '4A',
    triadNumber: 10,
    statements: [
      { id: '4a_10_a', text: 'No presumo de mis logros ni busco situarme por encima de mis colaboradores.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_10_b', text: 'Freno conclusiones apresuradas y simulo mentalmente escenarios alternativos.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_10_c', text: 'Conservo la estabilidad anímica incluso ante ambigüedad e incertidumbre prolongada.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_11',
    block: '4A',
    triadNumber: 11,
    statements: [
      { id: '4a_11_a', text: 'Me apasiona profundizar en debates de ideas sin importar cuán radicales parezcan.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_11_b', text: 'Valoro la verdad analítica por encima de defender mi ego o mi pertenencia grupal.', trait: 'cart_aot', weight: 1 },
      { id: '4a_11_c', text: 'Trato los recursos comunes con el mismo respeto con el que cuido los míos propios.', trait: 'hexaco_honesty_humility', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_12',
    block: '4A',
    triadNumber: 12,
    statements: [
      { id: '4a_12_a', text: 'Invierto energía consciente en descomponer problemas difíciles paso a paso.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_12_b', text: 'Resisto la tentación de abandonar una tarea cuando se vuelve monótona pero necesaria.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_12_c', text: 'Tengo gran curiosidad estética e intelectual hacia nuevas formas de expresión.', trait: 'cb5t_plasticity', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_13',
    block: '4A',
    triadNumber: 13,
    statements: [
      { id: '4a_13_a', text: 'Considero que dudar constructivamente de las certezas recibidas es un deber ético.', trait: 'cart_aot', weight: 1 },
      { id: '4a_13_b', text: 'Rechazo cualquier ventaja obtenida a costa del engaño o la simulación.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_13_c', text: 'Modero mis impulsos inmediatos para proteger metas y acuerdos a largo plazo.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_14',
    block: '4A',
    triadNumber: 14,
    statements: [
      { id: '4a_14_a', text: 'Generar múltiples hipótesis alternativas me resulta más natural que aceptar la primera respuesta.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_14_b', text: 'Evito emitir juicios definitivos sobre un tema antes de examinar los datos de ambas partes.', trait: 'cart_aot', weight: 1 },
      { id: '4a_14_c', text: 'Detecto con rapidez inconsistencias lógicas en argumentos intuitivos seductores.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_15',
    block: '4A',
    triadNumber: 15,
    statements: [
      { id: '4a_15_a', text: 'Mis actos concuerdan con mis palabras independientemente de quién esté observando.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_15_b', text: 'Mantengo el foco en los resultados esenciales aún ante distracciones caóticas.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_15_c', text: 'Examino conscientemente el costo de mis decisiones antes de dar por buena una opción.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 }
    ]
  },

  // ==========================================
  // BLOCK 4B: NEURODIVERGENT PHENOTYPE (15 Triads)
  // Dimensions: Monotropism (MQ), Barkley BDEFS (Time, Activation, Inhibition), CAT-Q Camouflage, Dunn Sensory, Dabrowski OE
  // ==========================================
  {
    id: 'triad_4b_01',
    block: '4B',
    triadNumber: 16,
    statements: [
      { id: '4b_01_a', text: 'Cuando me sumerjo en un interés apasionante, el mundo exterior y el hambre desaparecen (foco túnel).', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_01_b', text: 'El tiempo futuro me parece abstracto o irreal hasta que la fecha límite está encima (miopía temporal).', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_01_c', text: 'Monitoreo conscientemente mi postura y mirada para proyectar una apariencia social adecuada (camuflaje).', trait: 'cat_q_camouflaging', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_02',
    block: '4B',
    triadNumber: 17,
    statements: [
      { id: '4b_02_a', text: 'Ruidos de fondo continuos o luces fluorescentes me agotan la energía mental con rapidez.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_02_b', text: 'Siento una urgencia irresistible de profundizar analíticamente en las preguntas fundamentales.', trait: 'dabrowski_intellectual', weight: 1 },
      { id: '4b_02_c', text: 'Iniciar una tarea necesaria pero carente de urgencia inmediata me produce una parálisis de arranque.', trait: 'bdefs_activation', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_03',
    block: '4B',
    triadNumber: 18,
    statements: [
      { id: '4b_03_a', text: 'Cambiar de tema o actividad bruscamente cuando estoy concentrado me genera una fricción dolorosa.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_03_b', text: 'Ensayo diálogos mentales previamente para saber qué responder con naturalidad en interacciones sociales.', trait: 'cat_q_camouflaging', weight: 1 },
      { id: '4b_03_c', text: 'Me cuesta apaciguar o modular la frustración y la rabia inmediata cuando un plan se ve truncado repentinamente.', trait: 'bdefs_emotional_regulation', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_04',
    block: '4B',
    triadNumber: 19,
    statements: [
      { id: '4b_04_a', text: 'Me cuesta estimar cuánto tiempo real tomará una tarea; casi siempre subestimo el tiempo.', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_04_b', text: 'Ciertos tejidos en la ropa, etiquetas o texturas me resultan insoportablemente molestos.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_04_c', text: 'Necesito moverme, tamborilear o cambiar de postura constantemente para concentrarme.', trait: 'dabrowski_psychomotor', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_05',
    block: '4B',
    triadNumber: 20,
    statements: [
      { id: '4b_05_a', text: 'Puedo pasar horas hiperfocalizado en un problema sin notar el paso del tiempo.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_05_b', text: 'Interrumpo o respondo impulsivamente antes de que la otra persona termine de hablar.', trait: 'bdefs_inhibition', weight: 1 },
      { id: '4b_05_c', text: 'Tengo una imaginación vívida con mundos conceptuales y metáforas visuales muy detalladas.', trait: 'dabrowski_imaginative', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_06',
    block: '4B',
    triadNumber: 21,
    statements: [
      { id: '4b_06_a', text: 'Las reuniones sociales prolongadas me causan un agotamiento profundo que exige días de aislamiento.', trait: 'cat_q_camouflaging', weight: 1 },
      { id: '4b_06_b', text: 'Me sobreestimulo en centros comerciales, aglomeraciones o ambientes acústicamente caóticos.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_06_c', text: 'Siento indignación existencial profunda ante la injusticia o la falta de rigor ético.', trait: 'dabrowski_emotional', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_07',
    block: '4B',
    triadNumber: 22,
    statements: [
      { id: '4b_07_a', text: 'Necesito un ritual de entrada o una presión extrema para romper la inercia e iniciar mi trabajo.', trait: 'bdefs_activation', weight: 1 },
      { id: '4b_07_b', text: 'Mi mente funciona en modo "todo o nada": absorción completa o imposibilidad de enfocar.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_07_c', text: 'Siento un hambre insaciable de aprender cómo funcionan los sistemas a nivel fundamental.', trait: 'dabrowski_intellectual', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_08',
    block: '4B',
    triadNumber: 23,
    statements: [
      { id: '4b_08_a', text: 'Olvido citas o compromisos a menos que los tenga visibles en mi campo visual directo.', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_08_b', text: 'Oculto conscientemente mis intereses inusuales para evitar ser juzgado como raro.', trait: 'cat_q_camouflaging', weight: 1 },
      { id: '4b_08_c', text: 'Tengo un excedente de energía física que a menudo se traduce en inquietud o verborrea rápida.', trait: 'dabrowski_psychomotor', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_09',
    block: '4B',
    triadNumber: 24,
    statements: [
      { id: '4b_09_a', text: 'Ambientes con olores fuertes o luces parpadeantes me provocan cefalea o niebla mental.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_09_b', text: 'Actúo por impulsos inmediatos de curiosidad posponiendo deberes administrativos críticos.', trait: 'bdefs_inhibition', weight: 1 },
      { id: '4b_09_c', text: 'Experimento un éxtasis sensorial y estético intenso ante la música, los colores o ciertas texturas armónicas.', trait: 'dabrowski_sensual', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_10',
    block: '4B',
    triadNumber: 25,
    statements: [
      { id: '4b_10_a', text: 'Me resulta casi imposible dividir la atención; o pongo el 100% o no puedo escuchar.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_10_b', text: 'Siento una parálisis abrumadora cuando tengo que decidir por dónde empezar entre varias opciones.', trait: 'bdefs_activation', weight: 1 },
      { id: '4b_10_c', text: 'Adopto gestos, frases o modismos de mis interlocutores para integrarme fluidamente.', trait: 'cat_q_camouflaging', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_11',
    block: '4B',
    triadNumber: 26,
    statements: [
      { id: '4b_11_a', text: 'El futuro me parece un concepto lejano; vivo fundamentalmente en el "ahora" o en el "no-ahora".', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_11_b', text: 'Un libro o teoría fascinante puede mantenerme despierto toda la noche sin sentir fatiga.', trait: 'dabrowski_intellectual', weight: 1 },
      { id: '4b_11_c', text: 'Ciertos sonidos repetitivos (masticar, tecleo estridente) me provocan una irritación visceral.', trait: 'dunn_sensory_sensitivity', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_12',
    block: '4B',
    triadNumber: 27,
    statements: [
      { id: '4b_12_a', text: 'Compro o inicio proyectos nuevos con emoción desbordante que abandono a la semana.', trait: 'bdefs_inhibition', weight: 1 },
      { id: '4b_12_b', text: 'Las emociones intensas nublan temporalmente mi capacidad de tomar distancia y autorregularme con serenidad.', trait: 'bdefs_emotional_regulation', weight: 1 },
      { id: '4b_12_c', text: 'Fuerzo deliberadamente el contacto visual aunque me resulte incómodo para parecer atento.', trait: 'cat_q_camouflaging', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_13',
    block: '4B',
    triadNumber: 28,
    statements: [
      { id: '4b_13_a', text: 'La inercia atencional me atrapa: cuando arranco no puedo parar, y cuando paro no puedo arrancar.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_13_b', text: 'Necesito escuchar música con ritmos intensos o tener ruido blanco para acallar el ruido mental.', trait: 'dabrowski_psychomotor', weight: 1 },
      { id: '4b_13_c', text: 'Procrastino tareas burocráticas sencillas durante semanas por agotamiento del inicio.', trait: 'bdefs_activation', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_14',
    block: '4B',
    triadNumber: 29,
    statements: [
      { id: '4b_14_a', text: 'A menudo me desconecto de mi entorno porque estoy inmerso en complejas simulaciones mentales.', trait: 'dabrowski_imaginative', weight: 1 },
      { id: '4b_14_b', text: 'Me siento incomprendido cuando las personas no comparten mi nivel de urgencia analítica.', trait: 'dabrowski_intellectual', weight: 1 },
      { id: '4b_14_c', text: 'El esfuerzo de parecer "normal" en el trabajo o la universidad me deja sin energía para mi vida personal.', trait: 'cat_q_camouflaging', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_15',
    block: '4B',
    triadNumber: 30,
    statements: [
      { id: '4b_15_a', text: 'Necesito espacios de oscuridad o silencio total para descompresionarme al final del día.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_15_b', text: 'Pierdo la noción del tiempo cuando un tema despierta mi curiosidad intrínseca.', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_15_c', text: 'Percibo los detalles estéticos, los aromas y las texturas con una conmoción sensorial placentera pero a veces abrumadora.', trait: 'dabrowski_sensual', weight: 1 }
    ]
  }
];
