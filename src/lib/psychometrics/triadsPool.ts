// 30 Balanced Forced-Choice Triads based on Thurstonian IRT (Brown & Maydeu-Olivares, 2011)
// Divided into Block 4A (Personality & Rationality) and Block 4B (Neurodivergent Phenotype)
// Streamlined with active, concise syntax to minimize working-memory fatigue in neurodivergent examinees
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
      { id: '4a_01_a', text: 'Me fascina explorar teorías abstractas e ideas nuevas.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_01_b', text: 'Mantengo la calma y mis rutinas organizadas bajo presión.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_01_c', text: 'Trato a todos con justicia, sin buscar privilegios indebidos.', trait: 'hexaco_honesty_humility', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_02',
    block: '4A',
    triadNumber: 2,
    statements: [
      { id: '4a_02_a', text: 'Cambio de opinión si la evidencia contradice mi postura.', trait: 'cart_aot', weight: 1 },
      { id: '4a_02_b', text: 'Freno mi primera intuición para verificar la lógica.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_02_c', text: 'Siento un impulso natural hacia proyectos creativos imprevistos.', trait: 'cb5t_plasticity', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_03',
    block: '4A',
    triadNumber: 3,
    statements: [
      { id: '4a_03_a', text: 'Cumplo mis compromisos aun cuando el entusiasmo inicial desaparece.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_03_b', text: 'Rechazo manipular a otros para obtener ventajas personales.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_03_c', text: 'Escucho con atención argumentos que refutan mi postura.', trait: 'cart_aot', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_04',
    block: '4A',
    triadNumber: 4,
    statements: [
      { id: '4a_04_a', text: 'No me conformo con explicaciones superficiales en problemas difíciles.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_04_b', text: 'Me apasiona aprender sobre temas desconocidos e inciertos.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_04_c', text: 'Regulo mis estados de ánimo para proteger mis metas a largo plazo.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_05',
    block: '4A',
    triadNumber: 5,
    statements: [
      { id: '4a_05_a', text: 'Prefiero la sinceridad directa antes que adular por interés.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_05_b', text: 'Aplico el mismo rigor crítico a mis ideas que a las ajenas.', trait: 'cart_aot', weight: 1 },
      { id: '4a_05_c', text: 'Verifico cálculos y datos antes de darlos por válidos.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_06',
    block: '4A',
    triadNumber: 6,
    statements: [
      { id: '4a_06_a', text: 'Me atraen los estímulos intelectuales y la experimentación libre.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_06_b', text: 'Reconozco mis errores y límites cognitivos sin excusas.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_06_c', text: 'Sostengo planes a largo plazo con disciplina ante imprevistos.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_07',
    block: '4A',
    triadNumber: 7,
    statements: [
      { id: '4a_07_a', text: 'Admito con tranquilidad cuando estaba equivocado ante pruebas sólidas.', trait: 'cart_aot', weight: 1 },
      { id: '4a_07_b', text: 'Evito atajos mentales cuando la exactitud del resultado importa.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_07_c', text: 'Me recupero con solidez emocional de contratiempos inesperados.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_08',
    block: '4A',
    triadNumber: 8,
    statements: [
      { id: '4a_08_a', text: 'Cuestiono convenciones para explorar nuevas posibilidades.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_08_b', text: 'Rechazo el fraude o tomar ventajas ilegítimas de las reglas.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_08_c', text: 'Reviso mis sesgos implícitos para evitar juicios perezosos.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_09',
    block: '4A',
    triadNumber: 9,
    statements: [
      { id: '4a_09_a', text: 'Busco activamente fuentes que desafíen mi visión del mundo.', trait: 'cart_aot', weight: 1 },
      { id: '4a_09_b', text: 'Mantengo el orden físico y de agenda para cumplir mis metas.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_09_c', text: 'Me apasiona conectar áreas del conocimiento aparentemente dispares.', trait: 'cb5t_plasticity', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_10',
    block: '4A',
    triadNumber: 10,
    statements: [
      { id: '4a_10_a', text: 'No presumo de mis logros ni busco sentirme superior.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_10_b', text: 'Freno conclusiones rápidas y simulo alternativas antes de decidir.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_10_c', text: 'Conservo la calma ante periodos de incertidumbre o ambigüedad.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_11',
    block: '4A',
    triadNumber: 11,
    statements: [
      { id: '4a_11_a', text: 'Disfruto debatir ideas sin importar cuán disruptivas sean.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_11_b', text: 'Priorizo la verdad lógica antes que proteger mi ego.', trait: 'cart_aot', weight: 1 },
      { id: '4a_11_c', text: 'Cuido los recursos colectivos con el mismo celo que los propios.', trait: 'hexaco_honesty_humility', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_12',
    block: '4A',
    triadNumber: 12,
    statements: [
      { id: '4a_12_a', text: 'Dedico esfuerzo consciente a desglosar problemas difíciles paso a paso.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 },
      { id: '4a_12_b', text: 'Persisto en tareas monótonas pero indispensables sin abandonar.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_12_c', text: 'Tengo gran sensibilidad estética y curiosidad por nuevas ideas.', trait: 'cb5t_plasticity', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_13',
    block: '4A',
    triadNumber: 13,
    statements: [
      { id: '4a_13_a', text: 'Dudar constructivamente de las certezas establecidas es fundamental.', trait: 'cart_aot', weight: 1 },
      { id: '4a_13_b', text: 'Rechazo cualquier beneficio conseguido mediante engaño o apariencias.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_13_c', text: 'Modero mis impulsos inmediatos para salvaguardar planes mayores.', trait: 'cb5t_stability', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_14',
    block: '4A',
    triadNumber: 14,
    statements: [
      { id: '4a_14_a', text: 'Prefiero generar múltiples hipótesis antes que dar por buena la primera.', trait: 'cb5t_plasticity', weight: 1 },
      { id: '4a_14_b', text: 'Analizo ambas posturas con calma antes de juzgar un problema.', trait: 'cart_aot', weight: 1 },
      { id: '4a_14_c', text: 'Detecto rápido fallos lógicos en argumentos intuitivos pero falsos.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 }
    ]
  },
  {
    id: 'triad_4a_15',
    block: '4A',
    triadNumber: 15,
    statements: [
      { id: '4a_15_a', text: 'Mis acciones son coherentes con lo que digo, me observen o no.', trait: 'hexaco_honesty_humility', weight: 1 },
      { id: '4a_15_b', text: 'Mantengo el foco en lo esencial aun en entornos caóticos.', trait: 'cb5t_stability', weight: 1 },
      { id: '4a_15_c', text: 'Calculo el coste de mis decisiones antes de elegir.', trait: 'cart_cognitive_miserliness_resistance', weight: 1 }
    ]
  },

  // ==========================================
  // BLOCK 4B: NEURODIVERGENT PHENOTYPE (15 Triads)
  // Dimensions: Monotropism (MQ), Barkley BDEFS (Time, Activation, Inhibition, Emotion), CAT-Q Camouflage, Dunn Sensory, Dabrowski OE
  // ==========================================
  {
    id: 'triad_4b_01',
    block: '4B',
    triadNumber: 16,
    statements: [
      { id: '4b_01_a', text: 'En hiperfoco, el mundo exterior y el hambre desaparecen.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_01_b', text: 'El futuro parece irreal hasta que la fecha límite está encima.', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_01_c', text: 'Monitoreo postura y mirada para aparentar normalidad social.', trait: 'cat_q_camouflaging', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_02',
    block: '4B',
    triadNumber: 17,
    statements: [
      { id: '4b_02_a', text: 'Luces fluorescentes o ruido de fondo agotan mi energía mental.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_02_b', text: 'Siento urgencia de profundizar en preguntas fundamentales.', trait: 'dabrowski_intellectual', weight: 1 },
      { id: '4b_02_c', text: 'Iniciar tareas sin urgencia inmediata me produce parálisis de arranque.', trait: 'bdefs_activation', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_03',
    block: '4B',
    triadNumber: 18,
    statements: [
      { id: '4b_03_a', text: 'Interrumpir mi concentración me causa una fricción dolorosa.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_03_b', text: 'Ensayo diálogos mentales antes de interactuar socialmente.', trait: 'cat_q_camouflaging', weight: 1 },
      { id: '4b_03_c', text: 'Me cuesta apaciguar la frustración cuando un plan se altera.', trait: 'bdefs_emotional_regulation', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_04',
    block: '4B',
    triadNumber: 19,
    statements: [
      { id: '4b_04_a', text: 'Casi siempre subestimo cuánto tiempo real me tomará una tarea.', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_04_b', text: 'Ciertas etiquetas o telas en la ropa me resultan insoportables.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_04_c', text: 'Necesito moverme, tamborilear o cambiar de postura para pensar.', trait: 'dabrowski_psychomotor', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_05',
    block: '4B',
    triadNumber: 20,
    statements: [
      { id: '4b_05_a', text: 'Paso horas absorbido en un problema sin notar el paso del tiempo.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_05_b', text: 'Interrumpo o respondo antes de que el otro termine de hablar.', trait: 'bdefs_inhibition', weight: 1 },
      { id: '4b_05_c', text: 'Tengo un mundo imaginario interno vívido y con metáforas detalladas.', trait: 'dabrowski_imaginative', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_06',
    block: '4B',
    triadNumber: 21,
    statements: [
      { id: '4b_06_a', text: 'Las reuniones sociales largas me dejan agotado y requiero aislamiento.', trait: 'cat_q_camouflaging', weight: 1 },
      { id: '4b_06_b', text: 'Me sobreestimulo en centros comerciales o lugares ruidosos.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_06_c', text: 'Siento indignación profunda ante injusticias o falta de ética.', trait: 'dabrowski_emotional', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_07',
    block: '4B',
    triadNumber: 22,
    statements: [
      { id: '4b_07_a', text: 'Necesito presión extrema para romper la inercia e iniciar mi trabajo.', trait: 'bdefs_activation', weight: 1 },
      { id: '4b_07_b', text: 'Mi mente opera en "todo o nada": absorción total o desconexión.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_07_c', text: 'Tengo un deseo constante de entender cómo funcionan los sistemas.', trait: 'dabrowski_intellectual', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_08',
    block: '4B',
    triadNumber: 23,
    statements: [
      { id: '4b_08_a', text: 'Olvido citas si no las tengo visibles en mi campo directo.', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_08_b', text: 'Oculto mis intereses inusuales para evitar ser juzgado raro.', trait: 'cat_q_camouflaging', weight: 1 },
      { id: '4b_08_c', text: 'Tengo un excedente de energía física que se traduce en inquietud o habla rápida.', trait: 'dabrowski_psychomotor', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_09',
    block: '4B',
    triadNumber: 24,
    statements: [
      { id: '4b_09_a', text: 'Olores fuertes o luces parpadeantes me provocan niebla mental.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_09_b', text: 'Sigo impulsos de curiosidad posponiendo deberes importantes.', trait: 'bdefs_inhibition', weight: 1 },
      { id: '4b_09_c', text: 'Siento emoción sensorial intensa ante la música, colores o texturas.', trait: 'dabrowski_sensual', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_10',
    block: '4B',
    triadNumber: 25,
    statements: [
      { id: '4b_10_a', text: 'Me cuesta dividir la atención: o pongo el 100% o no escucho.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_10_b', text: 'Siento parálisis cuando tengo que decidir por dónde empezar.', trait: 'bdefs_activation', weight: 1 },
      { id: '4b_10_c', text: 'Copio gestos y modismos de mis compañeros para encajar mejor.', trait: 'cat_q_camouflaging', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_11',
    block: '4B',
    triadNumber: 26,
    statements: [
      { id: '4b_11_a', text: 'Vivo principalmente en el "ahora" o en el "todavía no".', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_11_b', text: 'Un tema fascinante puede mantenerme despierto toda la noche.', trait: 'dabrowski_intellectual', weight: 1 },
      { id: '4b_11_c', text: 'Sonidos repetitivos (masticar, tecleo fuerte) me irritan visceralmente.', trait: 'dunn_sensory_sensitivity', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_12',
    block: '4B',
    triadNumber: 27,
    statements: [
      { id: '4b_12_a', text: 'Compro o inicio hobbies nuevos con entusiasmo que abandono pronto.', trait: 'bdefs_inhibition', weight: 1 },
      { id: '4b_12_b', text: 'Las emociones intensas me dificultan autorregularme con serenidad.', trait: 'bdefs_emotional_regulation', weight: 1 },
      { id: '4b_12_c', text: 'Fuerzo el contacto visual aunque sea incómodo para parecer atento.', trait: 'cat_q_camouflaging', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_13',
    block: '4B',
    triadNumber: 28,
    statements: [
      { id: '4b_13_a', text: 'Inercia atencional: cuando arranco no paro, cuando paro me cuesta arrancar.', trait: 'monotropism_mq', weight: 1 },
      { id: '4b_13_b', text: 'Necesito música rítmica o ruido blanco para calmar el ruido mental.', trait: 'dabrowski_psychomotor', weight: 1 },
      { id: '4b_13_c', text: 'Postergo trámites burocráticos sencillos durante semanas.', trait: 'bdefs_activation', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_14',
    block: '4B',
    triadNumber: 29,
    statements: [
      { id: '4b_14_a', text: 'Me desconecto de mi entorno al sumergirme en simulaciones mentales.', trait: 'dabrowski_imaginative', weight: 1 },
      { id: '4b_14_b', text: 'Me frustra cuando otros no comparten mi nivel de urgencia analítica.', trait: 'dabrowski_intellectual', weight: 1 },
      { id: '4b_14_c', text: 'El esfuerzo de parecer "normal" en el trabajo agota mi energía personal.', trait: 'cat_q_camouflaging', weight: 1 }
    ]
  },
  {
    id: 'triad_4b_15',
    block: '4B',
    triadNumber: 30,
    statements: [
      { id: '4b_15_a', text: 'Necesito silencio total o penumbra para descompresionarme al anochecer.', trait: 'dunn_sensory_sensitivity', weight: 1 },
      { id: '4b_15_b', text: 'Pierdo la noción del tiempo cuando un tema despierta mi curiosidad.', trait: 'bdefs_time_myopia', weight: 1 },
      { id: '4b_15_c', text: 'Percibo detalles estéticos y texturas con una conmoción sensorial placentera.', trait: 'dabrowski_sensual', weight: 1 }
    ]
  }
];
