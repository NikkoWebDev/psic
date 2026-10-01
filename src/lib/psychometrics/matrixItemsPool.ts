// Comprehensive Stratified Item Bank for Matrix Reasoning (Gf)
// 46 items across 4 difficulty strata based on ICAR taxonomy and 3PL parameters
import { MatrixItem } from './types';

// Helper to create clean SVG shapes with centered coordinate system (100x100 viewBox)
export const matrixSvgLib = {
  empty: `<rect x="5" y="5" width="90" height="90" rx="8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.3"/>`,
  missingTile: `<rect x="8" y="8" width="84" height="84" rx="8" fill="rgba(99,102,241,0.08)" stroke="#6366f1" stroke-width="2" stroke-dasharray="4,4"/><text x="50" y="58" font-size="28" font-weight="bold" fill="#6366f1" text-anchor="middle">?</text>`,
  
  // Dots and counts
  dots: (count: number, fill = '#6366f1') => {
    if (count === 1) return `<circle cx="50" cy="50" r="10" fill="${fill}"/>`;
    if (count === 2) return `<circle cx="35" cy="50" r="8" fill="${fill}"/><circle cx="65" cy="50" r="8" fill="${fill}"/>`;
    if (count === 3) return `<circle cx="26" cy="50" r="7" fill="${fill}"/><circle cx="50" cy="50" r="7" fill="${fill}"/><circle cx="74" cy="50" r="7" fill="${fill}"/>`;
    if (count === 4) return `<circle cx="34" cy="34" r="7" fill="${fill}"/><circle cx="66" cy="34" r="7" fill="${fill}"/><circle cx="34" cy="66" r="7" fill="${fill}"/><circle cx="66" cy="66" r="7" fill="${fill}"/>`;
    if (count === 5) return `<circle cx="32" cy="32" r="6" fill="${fill}"/><circle cx="68" cy="32" r="6" fill="${fill}"/><circle cx="50" cy="50" r="6" fill="${fill}"/><circle cx="32" cy="68" r="6" fill="${fill}"/><circle cx="68" cy="68" r="6" fill="${fill}"/>`;
    return `<circle cx="50" cy="50" r="8" fill="${fill}"/>`;
  },

  // Geometric shapes
  circle: (r: number, fill = 'none', stroke = '#38bdf8', strokeWidth = 3) => 
    `<circle cx="50" cy="50" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`,

  square: (size: number, fill = 'none', stroke = '#a855f7', strokeWidth = 3, rotation = 0) =>
    `<rect x="${50 - size/2}" y="${50 - size/2}" width="${size}" height="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="rotate(${rotation} 50 50)"/>`,

  triangle: (size: number, fill = 'none', stroke = '#34d399', strokeWidth = 3, rotation = 0) => {
    const h = size * 0.866;
    const p1 = `50,${50 - (2/3)*h}`;
    const p2 = `${50 - size/2},${50 + (1/3)*h}`;
    const p3 = `${50 + size/2},${50 + (1/3)*h}`;
    return `<polygon points="${p1} ${p2} ${p3}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" transform="rotate(${rotation} 50 50)"/>`;
  },

  diamond: (size: number, fill = 'none', stroke = '#f59e0b', strokeWidth = 3) =>
    `<polygon points="50,${50 - size/2} ${50 + size/2},50 50,${50 + size/2} ${50 - size/2},50" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`,

  cross: (size: number, stroke = '#ef4444', strokeWidth = 4, rotation = 0) =>
    `<g transform="rotate(${rotation} 50 50)"><line x1="${50 - size/2}" y1="50" x2="${50 + size/2}" y2="50" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/><line x1="50" y1="${50 - size/2}" x2="50" y2="${50 + size/2}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/></g>`,

  // Rotational pointer / dial
  dial: (angle: number, stroke = '#60a5fa', length = 34) => {
    const rad = (angle - 90) * (Math.PI / 180);
    const x2 = 50 + length * Math.cos(rad);
    const y2 = 50 + length * Math.sin(rad);
    return `<circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><circle cx="50" cy="50" r="4" fill="${stroke}"/><line x1="50" y1="50" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="4.5" fill="${stroke}"/>`;
  },

  // Boolean segment grid (cross lines)
  segments: (horiz: boolean, vert: boolean, diag1: boolean, diag2: boolean, stroke = '#818cf8') => {
    let out = '';
    if (horiz) out += `<line x1="20" y1="50" x2="80" y2="50" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`;
    if (vert) out += `<line x1="50" y1="20" x2="50" y2="80" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`;
    if (diag1) out += `<line x1="26" y1="26" x2="74" y2="74" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`;
    if (diag2) out += `<line x1="74" y1="26" x2="26" y2="74" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`;
    return out || `<circle cx="50" cy="50" r="3" fill="${stroke}" opacity="0.3"/>`;
  },

  // 3D Isometric Cube
  cube3d: (rot = 0, fillTop = '#6366f1', fillLeft = '#4338ca', fillRight = '#312e81') => {
    return `<g transform="rotate(${rot} 50 50) scale(0.85 0.85) translate(8, 8)">
      <polygon points="50,22 76,36 50,50 24,36" fill="${fillTop}" stroke="#cbd5e1" stroke-width="1.5"/>
      <polygon points="24,36 50,50 50,78 24,64" fill="${fillLeft}" stroke="#cbd5e1" stroke-width="1.5"/>
      <polygon points="50,50 76,36 76,64 50,78" fill="${fillRight}" stroke="#cbd5e1" stroke-width="1.5"/>
    </g>`;
  }
};

// Generator of 46 items
export const MATRIX_ITEMS_POOL: MatrixItem[] = [
  // ==========================================
  // LEVEL 1: ENTRY & CALIBRATION (b in [-2.5, -0.8]) - 8 items
  // ==========================================
  {
    id: 'mat_01',
    code: 'GF-CAL-01',
    tier: 1,
    ruleType: 'progression',
    a: 1.15,
    b: -2.3,
    c: 0.125,
    ruleDescription: 'Incremento lineal del conteo de elementos en la fila (1, 2, 3)',
    cells: [
      matrixSvgLib.dots(1), matrixSvgLib.dots(2), matrixSvgLib.dots(3),
      matrixSvgLib.dots(1), matrixSvgLib.dots(2), matrixSvgLib.dots(3),
      matrixSvgLib.dots(1), matrixSvgLib.dots(2)
    ],
    options: [
      matrixSvgLib.dots(2),
      matrixSvgLib.dots(4),
      matrixSvgLib.dots(3), // Correct (index 2)
      matrixSvgLib.dots(1),
      matrixSvgLib.dots(5),
      matrixSvgLib.circle(20),
      matrixSvgLib.square(30),
      matrixSvgLib.cross(30)
    ],
    correctOptionIndex: 2,
    twinItemId: 'mat_01_twin'
  },
  {
    id: 'mat_01_twin',
    code: 'GF-CAL-01T',
    tier: 1,
    ruleType: 'progression',
    a: 1.10,
    b: -2.2,
    c: 0.125,
    ruleDescription: 'Verificación gemela: incremento lineal de tamaño de círculo',
    cells: [
      matrixSvgLib.circle(10), matrixSvgLib.circle(20), matrixSvgLib.circle(30),
      matrixSvgLib.circle(10), matrixSvgLib.circle(20), matrixSvgLib.circle(30),
      matrixSvgLib.circle(10), matrixSvgLib.circle(20)
    ],
    options: [
      matrixSvgLib.circle(25),
      matrixSvgLib.circle(30), // Correct (index 1)
      matrixSvgLib.circle(10),
      matrixSvgLib.square(30),
      matrixSvgLib.dots(3),
      matrixSvgLib.circle(40),
      matrixSvgLib.diamond(25),
      matrixSvgLib.triangle(20)
    ],
    correctOptionIndex: 1
  },
  {
    id: 'mat_02',
    code: 'GF-CAL-02',
    tier: 1,
    ruleType: 'rotation',
    a: 1.25,
    b: -1.9,
    c: 0.125,
    ruleDescription: 'Rotación horaria simple de puntero en cuadrantes de 90°',
    cells: [
      matrixSvgLib.dial(0), matrixSvgLib.dial(90), matrixSvgLib.dial(180),
      matrixSvgLib.dial(90), matrixSvgLib.dial(180), matrixSvgLib.dial(270),
      matrixSvgLib.dial(180), matrixSvgLib.dial(270)
    ],
    options: [
      matrixSvgLib.dial(90),
      matrixSvgLib.dial(180),
      matrixSvgLib.dial(270),
      matrixSvgLib.dial(0), // Correct (index 3: 360/0°)
      matrixSvgLib.dial(45),
      matrixSvgLib.dial(135),
      matrixSvgLib.cross(30),
      matrixSvgLib.circle(20)
    ],
    correctOptionIndex: 3
  },
  {
    id: 'mat_03',
    code: 'GF-CAL-03',
    tier: 1,
    ruleType: 'topological',
    a: 1.30,
    b: -1.6,
    c: 0.125,
    ruleDescription: 'Invarianza de forma geométrica por fila (Círculos, Cuadrados, Triángulos)',
    cells: [
      matrixSvgLib.circle(14), matrixSvgLib.circle(22), matrixSvgLib.circle(32),
      matrixSvgLib.square(18), matrixSvgLib.square(28), matrixSvgLib.square(40),
      matrixSvgLib.triangle(20), matrixSvgLib.triangle(30)
    ],
    options: [
      matrixSvgLib.square(35),
      matrixSvgLib.circle(35),
      matrixSvgLib.triangle(20),
      matrixSvgLib.triangle(42), // Correct (index 3)
      matrixSvgLib.diamond(30),
      matrixSvgLib.dots(4),
      matrixSvgLib.cross(25),
      matrixSvgLib.dial(45)
    ],
    correctOptionIndex: 3
  },
  {
    id: 'mat_04',
    code: 'GF-CAL-04',
    tier: 1,
    ruleType: 'progression',
    a: 1.20,
    b: -1.3,
    c: 0.125,
    ruleDescription: 'Expansión concéntrica de capas (1 capa, 2 capas, 3 capas)',
    cells: [
      matrixSvgLib.circle(12), `${matrixSvgLib.circle(12)}${matrixSvgLib.circle(22)}`, `${matrixSvgLib.circle(12)}${matrixSvgLib.circle(22)}${matrixSvgLib.circle(32)}`,
      matrixSvgLib.square(14), `${matrixSvgLib.square(14)}${matrixSvgLib.square(26)}`, `${matrixSvgLib.square(14)}${matrixSvgLib.square(26)}${matrixSvgLib.square(38)}`,
      matrixSvgLib.diamond(14), `${matrixSvgLib.diamond(14)}${matrixSvgLib.diamond(26)}`
    ],
    options: [
      matrixSvgLib.diamond(38),
      `${matrixSvgLib.diamond(14)}${matrixSvgLib.diamond(26)}${matrixSvgLib.diamond(38)}`, // Correct (index 1)
      `${matrixSvgLib.square(14)}${matrixSvgLib.square(26)}${matrixSvgLib.square(38)}`,
      matrixSvgLib.circle(30),
      matrixSvgLib.dots(3),
      matrixSvgLib.diamond(14),
      matrixSvgLib.triangle(30),
      matrixSvgLib.cross(25)
    ],
    correctOptionIndex: 1
  },
  {
    id: 'mat_05',
    code: 'GF-CAL-05',
    tier: 1,
    ruleType: 'rotation',
    a: 1.35,
    b: -1.1,
    c: 0.125,
    ruleDescription: 'Rotación diagonal de aspas de 45°',
    cells: [
      matrixSvgLib.cross(36, '#60a5fa', 4, 0), matrixSvgLib.cross(36, '#60a5fa', 4, 45), matrixSvgLib.cross(36, '#60a5fa', 4, 90),
      matrixSvgLib.cross(36, '#60a5fa', 4, 45), matrixSvgLib.cross(36, '#60a5fa', 4, 90), matrixSvgLib.cross(36, '#60a5fa', 4, 135),
      matrixSvgLib.cross(36, '#60a5fa', 4, 90), matrixSvgLib.cross(36, '#60a5fa', 4, 135)
    ],
    options: [
      matrixSvgLib.cross(36, '#60a5fa', 4, 90),
      matrixSvgLib.cross(36, '#60a5fa', 4, 45),
      matrixSvgLib.cross(36, '#60a5fa', 4, 0),
      matrixSvgLib.cross(36, '#60a5fa', 4, 180), // Correct (index 3)
      matrixSvgLib.circle(25),
      matrixSvgLib.square(25),
      matrixSvgLib.dots(2),
      matrixSvgLib.dial(0)
    ],
    correctOptionIndex: 3
  },
  {
    id: 'mat_06',
    code: 'GF-CAL-06',
    tier: 1,
    ruleType: 'topological',
    a: 1.40,
    b: -0.9,
    c: 0.125,
    ruleDescription: 'Permutación cíclica de rellenos (Sólido, Rayado/Vacío, Punteado)',
    cells: [
      matrixSvgLib.circle(26, '#38bdf8'), matrixSvgLib.circle(26, 'none', '#38bdf8'), matrixSvgLib.dots(1, '#38bdf8'),
      matrixSvgLib.circle(26, 'none', '#38bdf8'), matrixSvgLib.dots(1, '#38bdf8'), matrixSvgLib.circle(26, '#38bdf8'),
      matrixSvgLib.dots(1, '#38bdf8'), matrixSvgLib.circle(26, '#38bdf8')
    ],
    options: [
      matrixSvgLib.circle(26, '#38bdf8'),
      matrixSvgLib.square(26),
      matrixSvgLib.circle(26, 'none', '#38bdf8'), // Correct (index 2)
      matrixSvgLib.dots(3),
      matrixSvgLib.triangle(24),
      matrixSvgLib.cross(24),
      matrixSvgLib.diamond(20),
      matrixSvgLib.dial(90)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_07',
    code: 'GF-CAL-07',
    tier: 1,
    ruleType: 'progression',
    a: 1.25,
    b: -0.8,
    c: 0.125,
    ruleDescription: 'Desplazamiento horizontal de punto cardinal (Izquierda, Centro, Derecha)',
    cells: [
      `<circle cx="26" cy="50" r="10" fill="#6366f1"/>`, `<circle cx="50" cy="50" r="10" fill="#6366f1"/>`, `<circle cx="74" cy="50" r="10" fill="#6366f1"/>`,
      `<circle cx="26" cy="50" r="10" fill="#6366f1"/>`, `<circle cx="50" cy="50" r="10" fill="#6366f1"/>`, `<circle cx="74" cy="50" r="10" fill="#6366f1"/>`,
      `<circle cx="26" cy="50" r="10" fill="#6366f1"/>`, `<circle cx="50" cy="50" r="10" fill="#6366f1"/>`
    ],
    options: [
      `<circle cx="26" cy="50" r="10" fill="#6366f1"/>`,
      `<circle cx="50" cy="50" r="10" fill="#6366f1"/>`,
      `<circle cx="74" cy="50" r="10" fill="#6366f1"/>`, // Correct (index 2)
      `<circle cx="50" cy="26" r="10" fill="#6366f1"/>`,
      `<circle cx="50" cy="74" r="10" fill="#6366f1"/>`,
      matrixSvgLib.square(25),
      matrixSvgLib.dots(3),
      matrixSvgLib.circle(20)
    ],
    correctOptionIndex: 2
  },

  // ==========================================
  // LEVEL 2: MEDIUM DIFFICULTY (b in [-0.7, +0.7]) - 14 items
  // ==========================================
  {
    id: 'mat_08',
    code: 'GF-MED-01',
    tier: 2,
    ruleType: 'boolean',
    a: 1.45,
    b: -0.6,
    c: 0.125,
    ruleDescription: 'Superposición aditiva simple (OR): Línea horizontal + vertical = Cruz',
    cells: [
      matrixSvgLib.segments(true, false, false, false), matrixSvgLib.segments(false, true, false, false), matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.segments(false, true, false, false), matrixSvgLib.segments(false, false, true, false), matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(true, false, false, false), matrixSvgLib.segments(false, false, false, true)
    ],
    options: [
      matrixSvgLib.segments(true, false, false, true), // Correct (index 0)
      matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, false, false, false),
      matrixSvgLib.circle(20),
      matrixSvgLib.square(24),
      matrixSvgLib.cross(24)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_09',
    code: 'GF-MED-02',
    tier: 2,
    ruleType: 'rotation',
    a: 1.50,
    b: -0.4,
    c: 0.125,
    ruleDescription: 'Rotación combinada: Triángulo exterior horario y punto interior antihorario',
    cells: [
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 0)}<circle cx="50" cy="30" r="5" fill="#34d399"/>`,
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 120)}<circle cx="67" cy="60" r="5" fill="#34d399"/>`,
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 240)}<circle cx="33" cy="60" r="5" fill="#34d399"/>`,
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 120)}<circle cx="67" cy="60" r="5" fill="#34d399"/>`,
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 240)}<circle cx="33" cy="60" r="5" fill="#34d399"/>`,
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 0)}<circle cx="50" cy="30" r="5" fill="#34d399"/>`,
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 240)}<circle cx="33" cy="60" r="5" fill="#34d399"/>`,
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 0)}<circle cx="50" cy="30" r="5" fill="#34d399"/>`
    ],
    options: [
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 0)}<circle cx="50" cy="30" r="5" fill="#34d399"/>`,
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 120)}<circle cx="67" cy="60" r="5" fill="#34d399"/>`, // Correct (index 1)
      `${matrixSvgLib.triangle(36, 'none', '#34d399', 3, 240)}<circle cx="33" cy="60" r="5" fill="#34d399"/>`,
      matrixSvgLib.triangle(36, 'none', '#34d399', 3, 60),
      matrixSvgLib.square(30),
      matrixSvgLib.circle(25),
      matrixSvgLib.diamond(25),
      matrixSvgLib.dots(3)
    ],
    correctOptionIndex: 1
  },
  {
    id: 'mat_10',
    code: 'GF-MED-03',
    tier: 2,
    ruleType: 'topological',
    a: 1.55,
    b: -0.2,
    c: 0.125,
    ruleDescription: 'Anidación concéntrica de 3 formas distintas (Círculo, Cuadrado, Triángulo)',
    cells: [
      `${matrixSvgLib.circle(36)}${matrixSvgLib.square(24)}${matrixSvgLib.triangle(14)}`,
      `${matrixSvgLib.square(36)}${matrixSvgLib.triangle(24)}${matrixSvgLib.circle(14)}`,
      `${matrixSvgLib.triangle(36)}${matrixSvgLib.circle(24)}${matrixSvgLib.square(14)}`,
      `${matrixSvgLib.square(36)}${matrixSvgLib.triangle(24)}${matrixSvgLib.circle(14)}`,
      `${matrixSvgLib.triangle(36)}${matrixSvgLib.circle(24)}${matrixSvgLib.square(14)}`,
      `${matrixSvgLib.circle(36)}${matrixSvgLib.square(24)}${matrixSvgLib.triangle(14)}`,
      `${matrixSvgLib.triangle(36)}${matrixSvgLib.circle(24)}${matrixSvgLib.square(14)}`,
      `${matrixSvgLib.circle(36)}${matrixSvgLib.square(24)}${matrixSvgLib.triangle(14)}`
    ],
    options: [
      `${matrixSvgLib.circle(36)}${matrixSvgLib.square(24)}${matrixSvgLib.triangle(14)}`,
      `${matrixSvgLib.triangle(36)}${matrixSvgLib.circle(24)}${matrixSvgLib.square(14)}`,
      `${matrixSvgLib.square(36)}${matrixSvgLib.triangle(24)}${matrixSvgLib.circle(14)}`, // Correct (index 2)
      `${matrixSvgLib.square(36)}${matrixSvgLib.circle(24)}${matrixSvgLib.triangle(14)}`,
      matrixSvgLib.circle(36),
      matrixSvgLib.triangle(36),
      matrixSvgLib.square(36),
      matrixSvgLib.cross(30)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_11',
    code: 'GF-MED-04',
    tier: 2,
    ruleType: 'progression',
    a: 1.60,
    b: 0.0,
    c: 0.125,
    ruleDescription: 'Suma de vértices poligonales: Triángulo (3) + Cuadrado (4) = Heptágono/7 puntos',
    cells: [
      matrixSvgLib.dots(3), matrixSvgLib.dots(4), matrixSvgLib.dots(7),
      matrixSvgLib.dots(2), matrixSvgLib.dots(3), matrixSvgLib.dots(5),
      matrixSvgLib.dots(1), matrixSvgLib.dots(5)
    ],
    options: [
      matrixSvgLib.dots(4),
      matrixSvgLib.dots(5),
      matrixSvgLib.dots(6), // Correct (index 2: 1 + 5 = 6)
      matrixSvgLib.dots(7),
      matrixSvgLib.dots(8),
      matrixSvgLib.circle(25),
      matrixSvgLib.triangle(25),
      matrixSvgLib.square(25)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_12',
    code: 'GF-MED-05',
    tier: 2,
    ruleType: 'rotation',
    a: 1.62,
    b: 0.15,
    c: 0.125,
    ruleDescription: 'Reloj de manecillas con salto angular de 45° por columna y 90° por fila',
    cells: [
      matrixSvgLib.dial(0), matrixSvgLib.dial(45), matrixSvgLib.dial(90),
      matrixSvgLib.dial(90), matrixSvgLib.dial(135), matrixSvgLib.dial(180),
      matrixSvgLib.dial(180), matrixSvgLib.dial(225)
    ],
    options: [
      matrixSvgLib.dial(180),
      matrixSvgLib.dial(225),
      matrixSvgLib.dial(270), // Correct (index 2)
      matrixSvgLib.dial(315),
      matrixSvgLib.dial(0),
      matrixSvgLib.cross(30),
      matrixSvgLib.square(25),
      matrixSvgLib.circle(25)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_13',
    code: 'GF-MED-06',
    tier: 2,
    ruleType: 'boolean',
    a: 1.65,
    b: 0.3,
    c: 0.125,
    ruleDescription: 'Operación AND: solo sobreviven los segmentos presentes en ambas figuras previas',
    cells: [
      matrixSvgLib.segments(true, true, true, false), matrixSvgLib.segments(true, false, true, true), matrixSvgLib.segments(true, false, true, false),
      matrixSvgLib.segments(false, true, true, true), matrixSvgLib.segments(true, true, true, false), matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(true, true, false, true), matrixSvgLib.segments(true, false, true, true)
    ],
    options: [
      matrixSvgLib.segments(true, false, false, true), // Correct (index 0)
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, true, false, false),
      matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.circle(20),
      matrixSvgLib.square(20),
      matrixSvgLib.cross(20)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_14',
    code: 'GF-MED-07',
    tier: 2,
    ruleType: 'topological',
    a: 1.68,
    b: 0.45,
    c: 0.125,
    ruleDescription: 'Desplazamiento orbital horario de satélite alrededor de centro',
    cells: [
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="50" cy="22" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="78" cy="50" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="50" cy="78" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="78" cy="50" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="50" cy="78" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="22" cy="50" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="50" cy="78" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="22" cy="50" r="6" fill="#38bdf8"/>`
    ],
    options: [
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="50" cy="78" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="22" cy="50" r="6" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="50" cy="22" r="6" fill="#38bdf8"/>`, // Correct (index 2)
      `<circle cx="50" cy="50" r="14" fill="#a855f7"/><circle cx="78" cy="50" r="6" fill="#38bdf8"/>`,
      matrixSvgLib.circle(20),
      matrixSvgLib.square(24),
      matrixSvgLib.dots(2),
      matrixSvgLib.cross(20)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_15',
    code: 'GF-MED-08',
    tier: 2,
    ruleType: 'progression',
    a: 1.70,
    b: 0.55,
    c: 0.125,
    ruleDescription: 'Multiplicación modular en cuadrícula 2x2 interna',
    cells: [
      matrixSvgLib.dots(1), matrixSvgLib.dots(2), matrixSvgLib.dots(2),
      matrixSvgLib.dots(2), matrixSvgLib.dots(2), matrixSvgLib.dots(4),
      matrixSvgLib.dots(3), matrixSvgLib.dots(2)
    ],
    options: [
      matrixSvgLib.dots(4),
      matrixSvgLib.dots(5),
      matrixSvgLib.dots(6), // Correct (index 2: 3 * 2 = 6)
      matrixSvgLib.dots(7),
      matrixSvgLib.dots(8),
      matrixSvgLib.square(30),
      matrixSvgLib.triangle(30),
      matrixSvgLib.dial(45)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_16',
    code: 'GF-MED-09',
    tier: 2,
    ruleType: 'rotation',
    a: 1.72,
    b: 0.60,
    c: 0.125,
    ruleDescription: 'Reflexión especular en espejo diagonal',
    cells: [
      `<polygon points="30,30 70,30 30,70" fill="#38bdf8"/>`, `<polygon points="70,30 70,70 30,70" fill="#38bdf8"/>`, `<polygon points="30,30 70,70 30,70" fill="#38bdf8"/>`,
      `<polygon points="70,30 70,70 30,70" fill="#38bdf8"/>`, `<polygon points="30,30 70,70 30,70" fill="#38bdf8"/>`, `<polygon points="30,30 70,30 70,70" fill="#38bdf8"/>`,
      `<polygon points="30,30 70,70 30,70" fill="#38bdf8"/>`, `<polygon points="30,30 70,30 70,70" fill="#38bdf8"/>`
    ],
    options: [
      `<polygon points="30,30 70,30 30,70" fill="#38bdf8"/>`, // Correct (index 0)
      `<polygon points="70,30 70,70 30,70" fill="#38bdf8"/>`,
      `<polygon points="30,30 70,70 30,70" fill="#38bdf8"/>`,
      matrixSvgLib.square(30),
      matrixSvgLib.triangle(30),
      matrixSvgLib.circle(25),
      matrixSvgLib.diamond(25),
      matrixSvgLib.dots(3)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_17',
    code: 'GF-MED-10',
    tier: 2,
    ruleType: 'boolean',
    a: 1.75,
    b: 0.65,
    c: 0.125,
    ruleDescription: 'Sustracción de elementos: Figura A menos elementos coincidentes en B',
    cells: [
      matrixSvgLib.dots(4), matrixSvgLib.dots(1), matrixSvgLib.dots(3),
      matrixSvgLib.dots(5), matrixSvgLib.dots(2), matrixSvgLib.dots(3),
      matrixSvgLib.dots(6), matrixSvgLib.dots(4)
    ],
    options: [
      matrixSvgLib.dots(1),
      matrixSvgLib.dots(2), // Correct (index 1: 6 - 4 = 2)
      matrixSvgLib.dots(3),
      matrixSvgLib.dots(4),
      matrixSvgLib.circle(20),
      matrixSvgLib.square(24),
      matrixSvgLib.cross(20),
      matrixSvgLib.diamond(20)
    ],
    correctOptionIndex: 1
  },
  {
    id: 'mat_18',
    code: 'GF-MED-11',
    tier: 2,
    ruleType: 'topological',
    a: 1.78,
    b: 0.68,
    c: 0.125,
    ruleDescription: 'Inversión de polaridad cromática / contraste en figura y fondo',
    cells: [
      `<rect x="25" y="25" width="50" height="50" fill="#6366f1"/><circle cx="50" cy="50" r="14" fill="#090d16"/>`,
      `<rect x="25" y="25" width="50" height="50" fill="#090d16" stroke="#6366f1" stroke-width="2"/><circle cx="50" cy="50" r="14" fill="#6366f1"/>`,
      `<rect x="25" y="25" width="50" height="50" fill="#6366f1"/><circle cx="50" cy="50" r="14" fill="#090d16"/>`,
      `<circle cx="50" cy="50" r="26" fill="#38bdf8"/><rect x="38" y="38" width="24" height="24" fill="#090d16"/>`,
      `<circle cx="50" cy="50" r="26" fill="#090d16" stroke="#38bdf8" stroke-width="2"/><rect x="38" y="38" width="24" height="24" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="26" fill="#38bdf8"/><rect x="38" y="38" width="24" height="24" fill="#090d16"/>`,
      `<polygon points="50,22 76,70 24,70" fill="#f59e0b"/><circle cx="50" cy="52" r="10" fill="#090d16"/>`,
      `<polygon points="50,22 76,70 24,70" fill="#090d16" stroke="#f59e0b" stroke-width="2"/><circle cx="50" cy="52" r="10" fill="#f59e0b"/>`
    ],
    options: [
      `<polygon points="50,22 76,70 24,70" fill="#f59e0b"/><circle cx="50" cy="52" r="10" fill="#090d16"/>`, // Correct (index 0)
      `<polygon points="50,22 76,70 24,70" fill="#090d16" stroke="#f59e0b" stroke-width="2"/><circle cx="50" cy="52" r="10" fill="#f59e0b"/>`,
      matrixSvgLib.circle(26),
      matrixSvgLib.square(30),
      matrixSvgLib.diamond(26),
      matrixSvgLib.dots(3),
      matrixSvgLib.cross(24),
      matrixSvgLib.dial(90)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_19',
    code: 'GF-MED-12',
    tier: 2,
    ruleType: 'progression',
    a: 1.80,
    b: 0.70,
    c: 0.125,
    ruleDescription: 'Desplazamiento helicoidal en espiral',
    cells: [
      `<circle cx="30" cy="30" r="7" fill="#ec4899"/>`, `<circle cx="70" cy="30" r="7" fill="#ec4899"/>`, `<circle cx="70" cy="70" r="7" fill="#ec4899"/>`,
      `<circle cx="70" cy="30" r="7" fill="#ec4899"/>`, `<circle cx="70" cy="70" r="7" fill="#ec4899"/>`, `<circle cx="30" cy="70" r="7" fill="#ec4899"/>`,
      `<circle cx="70" cy="70" r="7" fill="#ec4899"/>`, `<circle cx="30" cy="70" r="7" fill="#ec4899"/>`
    ],
    options: [
      `<circle cx="70" cy="70" r="7" fill="#ec4899"/>`,
      `<circle cx="30" cy="70" r="7" fill="#ec4899"/>`,
      `<circle cx="30" cy="30" r="7" fill="#ec4899"/>`, // Correct (index 2: loops back to top-left)
      `<circle cx="50" cy="50" r="7" fill="#ec4899"/>`,
      matrixSvgLib.square(24),
      matrixSvgLib.dots(4),
      matrixSvgLib.circle(20),
      matrixSvgLib.cross(20)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_20',
    code: 'GF-MED-13',
    tier: 2,
    ruleType: 'rotation',
    a: 1.82,
    b: 0.72,
    c: 0.125,
    ruleDescription: 'Rotación ortogonal de cuadrícula dividida',
    cells: [
      matrixSvgLib.dial(45), matrixSvgLib.dial(135), matrixSvgLib.dial(225),
      matrixSvgLib.dial(135), matrixSvgLib.dial(225), matrixSvgLib.dial(315),
      matrixSvgLib.dial(225), matrixSvgLib.dial(315)
    ],
    options: [
      matrixSvgLib.dial(315),
      matrixSvgLib.dial(0),
      matrixSvgLib.dial(45), // Correct (index 2: 315 + 90 = 405 -> 45)
      matrixSvgLib.dial(90),
      matrixSvgLib.dial(135),
      matrixSvgLib.square(25),
      matrixSvgLib.circle(25),
      matrixSvgLib.cross(25)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_21',
    code: 'GF-MED-14',
    tier: 2,
    ruleType: 'boolean',
    a: 1.85,
    b: 0.75,
    c: 0.125,
    ruleDescription: 'Fusión de diagonales y líneas centrales',
    cells: [
      matrixSvgLib.segments(true, false, true, false), matrixSvgLib.segments(false, true, false, true), matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, false, true, true), matrixSvgLib.segments(true, true, false, false), matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(true, false, false, true), matrixSvgLib.segments(false, true, true, false)
    ],
    options: [
      matrixSvgLib.segments(true, true, true, true), // Correct (index 0)
      matrixSvgLib.segments(false, false, false, false),
      matrixSvgLib.segments(true, false, true, false),
      matrixSvgLib.segments(false, true, false, true),
      matrixSvgLib.circle(25),
      matrixSvgLib.square(25),
      matrixSvgLib.dots(3),
      matrixSvgLib.cross(25)
    ],
    correctOptionIndex: 0
  },

  // ==========================================
  // LEVEL 3: HIGH / SUPERIOR (b in [+0.8, +1.8]) - 14 items
  // ==========================================
  {
    id: 'mat_22',
    code: 'GF-HIGH-01',
    tier: 3,
    ruleType: 'boolean',
    a: 1.90,
    b: 0.85,
    c: 0.125,
    ruleDescription: 'Operación XOR básica: líneas compartidas se cancelan, líneas únicas sobreviven',
    cells: [
      matrixSvgLib.segments(true, true, false, false), matrixSvgLib.segments(true, false, true, false), matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(false, true, true, false), matrixSvgLib.segments(false, true, false, true), matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, false, false, true), matrixSvgLib.segments(true, true, false, false)
    ],
    options: [
      matrixSvgLib.segments(false, true, false, true), // Correct (index 0: XOR horiz cancels, vert survives, diag2 survives)
      matrixSvgLib.segments(true, true, false, true),
      matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, false, false, false),
      matrixSvgLib.circle(25),
      matrixSvgLib.square(25),
      matrixSvgLib.dots(4)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_23',
    code: 'GF-HIGH-02',
    tier: 3,
    ruleType: 'rotation',
    a: 1.95,
    b: 0.95,
    c: 0.125,
    ruleDescription: 'Rotación tridimensional de cubo en perspectiva isométrica (Eje Y)',
    cells: [
      matrixSvgLib.cube3d(0), matrixSvgLib.cube3d(45), matrixSvgLib.cube3d(90),
      matrixSvgLib.cube3d(45), matrixSvgLib.cube3d(90), matrixSvgLib.cube3d(135),
      matrixSvgLib.cube3d(90), matrixSvgLib.cube3d(135)
    ],
    options: [
      matrixSvgLib.cube3d(90),
      matrixSvgLib.cube3d(135),
      matrixSvgLib.cube3d(180), // Correct (index 2)
      matrixSvgLib.cube3d(225),
      matrixSvgLib.cube3d(0),
      matrixSvgLib.square(30),
      matrixSvgLib.circle(30),
      matrixSvgLib.cross(30)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_24',
    code: 'GF-HIGH-03',
    tier: 3,
    ruleType: 'topological',
    a: 2.00,
    b: 1.05,
    c: 0.125,
    ruleDescription: 'Coordinación simultánea de 3 atributos: Forma x Tamaño x Relleno',
    cells: [
      `${matrixSvgLib.circle(16, '#6366f1')}`, `${matrixSvgLib.square(26, 'none', '#6366f1')}`, `${matrixSvgLib.triangle(38, 'none', '#6366f1', 2)}`,
      `${matrixSvgLib.square(16, 'none', '#6366f1')}`, `${matrixSvgLib.triangle(26, 'none', '#6366f1', 2)}`, `${matrixSvgLib.circle(38, '#6366f1')}`,
      `${matrixSvgLib.triangle(16, 'none', '#6366f1', 2)}`, `${matrixSvgLib.circle(26, '#6366f1')}`
    ],
    options: [
      `${matrixSvgLib.square(16, 'none', '#6366f1')}`,
      `${matrixSvgLib.square(26, 'none', '#6366f1')}`,
      `${matrixSvgLib.square(38, 'none', '#6366f1')}`, // Correct (index 2)
      `${matrixSvgLib.circle(38, '#6366f1')}`,
      matrixSvgLib.triangle(38),
      matrixSvgLib.diamond(30),
      matrixSvgLib.cross(30),
      matrixSvgLib.dots(3)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_25',
    code: 'GF-HIGH-04',
    tier: 3,
    ruleType: 'progression',
    a: 2.05,
    b: 1.15,
    c: 0.125,
    ruleDescription: 'Progresión matricial de Fibonacci modular en aristas internas',
    cells: [
      matrixSvgLib.dots(1), matrixSvgLib.dots(1), matrixSvgLib.dots(2),
      matrixSvgLib.dots(1), matrixSvgLib.dots(2), matrixSvgLib.dots(3),
      matrixSvgLib.dots(2), matrixSvgLib.dots(3)
    ],
    options: [
      matrixSvgLib.dots(3),
      matrixSvgLib.dots(4),
      matrixSvgLib.dots(5), // Correct (index 2: 2 + 3 = 5)
      matrixSvgLib.dots(6),
      matrixSvgLib.dots(7),
      matrixSvgLib.circle(30),
      matrixSvgLib.square(30),
      matrixSvgLib.triangle(30)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_26',
    code: 'GF-HIGH-05',
    tier: 3,
    ruleType: 'boolean',
    a: 2.10,
    b: 1.25,
    c: 0.125,
    ruleDescription: 'Operación XOR en 4 cuadrantes con inversión simultánea',
    cells: [
      matrixSvgLib.segments(true, true, true, false), matrixSvgLib.segments(true, true, false, true), matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, false, true, true), matrixSvgLib.segments(false, true, true, true), matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.segments(false, true, true, true), matrixSvgLib.segments(true, true, false, true)
    ],
    options: [
      matrixSvgLib.segments(true, false, true, false), // Correct (index 0: XOR between row 3 col 1 and 2)
      matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, true, false, true),
      matrixSvgLib.segments(false, false, false, false),
      matrixSvgLib.circle(25),
      matrixSvgLib.square(25),
      matrixSvgLib.dots(4)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_27',
    code: 'GF-HIGH-06',
    tier: 3,
    ruleType: 'rotation',
    a: 2.12,
    b: 1.35,
    c: 0.125,
    ruleDescription: 'Rotación asimétrica bi-rotacional con aceleración de paso (+45°, +90°, +135°)',
    cells: [
      matrixSvgLib.dial(0), matrixSvgLib.dial(45), matrixSvgLib.dial(135),
      matrixSvgLib.dial(45), matrixSvgLib.dial(90), matrixSvgLib.dial(180),
      matrixSvgLib.dial(90), matrixSvgLib.dial(135)
    ],
    options: [
      matrixSvgLib.dial(180),
      matrixSvgLib.dial(225), // Correct (index 1: 135 + 90 = 225)
      matrixSvgLib.dial(270),
      matrixSvgLib.dial(315),
      matrixSvgLib.dial(0),
      matrixSvgLib.cross(30),
      matrixSvgLib.square(25),
      matrixSvgLib.circle(25)
    ],
    correctOptionIndex: 1
  },
  {
    id: 'mat_28',
    code: 'GF-HIGH-07',
    tier: 3,
    ruleType: 'topological',
    a: 2.15,
    b: 1.45,
    c: 0.125,
    ruleDescription: 'Permutación topológica de grafos dirigidos (nodos interconectados)',
    cells: [
      `<line x1="30" y1="30" x2="70" y2="70" stroke="#818cf8" stroke-width="2"/><circle cx="30" cy="30" r="6" fill="#818cf8"/><circle cx="70" cy="70" r="6" fill="#818cf8"/>`,
      `<line x1="70" y1="30" x2="30" y2="70" stroke="#818cf8" stroke-width="2"/><circle cx="70" cy="30" r="6" fill="#818cf8"/><circle cx="30" cy="70" r="6" fill="#818cf8"/>`,
      `<line x1="30" y1="30" x2="70" y2="70" stroke="#818cf8" stroke-width="2"/><line x1="70" y1="30" x2="30" y2="70" stroke="#818cf8" stroke-width="2"/><circle cx="30" cy="30" r="6" fill="#818cf8"/><circle cx="70" cy="70" r="6" fill="#818cf8"/><circle cx="70" cy="30" r="6" fill="#818cf8"/><circle cx="30" cy="70" r="6" fill="#818cf8"/>`,
      `<line x1="30" y1="50" x2="70" y2="50" stroke="#818cf8" stroke-width="2"/><circle cx="30" cy="50" r="6" fill="#818cf8"/><circle cx="70" cy="50" r="6" fill="#818cf8"/>`,
      `<line x1="50" y1="30" x2="50" y2="70" stroke="#818cf8" stroke-width="2"/><circle cx="50" cy="30" r="6" fill="#818cf8"/><circle cx="50" cy="70" r="6" fill="#818cf8"/>`,
      `<line x1="30" y1="50" x2="70" y2="50" stroke="#818cf8" stroke-width="2"/><line x1="50" y1="30" x2="50" y2="70" stroke="#818cf8" stroke-width="2"/><circle cx="30" cy="50" r="6" fill="#818cf8"/><circle cx="70" cy="50" r="6" fill="#818cf8"/><circle cx="50" cy="30" r="6" fill="#818cf8"/><circle cx="50" cy="70" r="6" fill="#818cf8"/>`,
      `<circle cx="50" cy="50" r="24" fill="none" stroke="#818cf8" stroke-width="2"/><circle cx="50" cy="26" r="6" fill="#818cf8"/>`,
      `<circle cx="50" cy="50" r="24" fill="none" stroke="#818cf8" stroke-width="2"/><circle cx="74" cy="50" r="6" fill="#818cf8"/>`
    ],
    options: [
      `<circle cx="50" cy="50" r="24" fill="none" stroke="#818cf8" stroke-width="2"/><circle cx="50" cy="26" r="6" fill="#818cf8"/><circle cx="74" cy="50" r="6" fill="#818cf8"/>`, // Correct (index 0: union of both nodes on circle)
      `<circle cx="50" cy="50" r="24" fill="none" stroke="#818cf8" stroke-width="2"/><circle cx="50" cy="74" r="6" fill="#818cf8"/>`,
      `<circle cx="50" cy="50" r="24" fill="none" stroke="#818cf8" stroke-width="2"/>`,
      matrixSvgLib.circle(24),
      matrixSvgLib.square(24),
      matrixSvgLib.dots(4),
      matrixSvgLib.cross(24),
      matrixSvgLib.diamond(24)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_29',
    code: 'GF-HIGH-08',
    tier: 3,
    ruleType: 'progression',
    a: 2.18,
    b: 1.55,
    c: 0.125,
    ruleDescription: 'Desplazamiento matricial de piezas de ajedrez en salto de caballo en L',
    cells: [
      `<circle cx="26" cy="26" r="8" fill="#f59e0b"/>`, `<circle cx="74" cy="50" r="8" fill="#f59e0b"/>`, `<circle cx="26" cy="74" r="8" fill="#f59e0b"/>`,
      `<circle cx="74" cy="50" r="8" fill="#f59e0b"/>`, `<circle cx="26" cy="74" r="8" fill="#f59e0b"/>`, `<circle cx="50" cy="26" r="8" fill="#f59e0b"/>`,
      `<circle cx="26" cy="74" r="8" fill="#f59e0b"/>`, `<circle cx="50" cy="26" r="8" fill="#f59e0b"/>`
    ],
    options: [
      `<circle cx="26" cy="26" r="8" fill="#f59e0b"/>`,
      `<circle cx="74" cy="74" r="8" fill="#f59e0b"/>`, // Correct (index 1: Knight leap to bottom-right)
      `<circle cx="50" cy="50" r="8" fill="#f59e0b"/>`,
      `<circle cx="74" cy="26" r="8" fill="#f59e0b"/>`,
      matrixSvgLib.square(25),
      matrixSvgLib.triangle(25),
      matrixSvgLib.dots(3),
      matrixSvgLib.cross(25)
    ],
    correctOptionIndex: 1
  },
  {
    id: 'mat_30',
    code: 'GF-HIGH-09',
    tier: 3,
    ruleType: 'boolean',
    a: 2.20,
    b: 1.60,
    c: 0.125,
    ruleDescription: 'Intersección triple y eliminación de centro coincidente',
    cells: [
      matrixSvgLib.segments(true, true, false, true), matrixSvgLib.segments(false, true, true, true), matrixSvgLib.segments(true, false, true, false),
      matrixSvgLib.segments(true, false, true, true), matrixSvgLib.segments(true, true, true, false), matrixSvgLib.segments(false, true, false, true),
      matrixSvgLib.segments(false, true, true, false), matrixSvgLib.segments(true, true, false, true)
    ],
    options: [
      matrixSvgLib.segments(true, false, true, true), // Correct (index 0)
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, false, false, false),
      matrixSvgLib.segments(false, true, false, true),
      matrixSvgLib.circle(20),
      matrixSvgLib.square(20),
      matrixSvgLib.dots(3),
      matrixSvgLib.cross(20)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_31',
    code: 'GF-HIGH-10',
    tier: 3,
    ruleType: 'rotation',
    a: 2.22,
    b: 1.65,
    c: 0.125,
    ruleDescription: 'Rotación con desfase antihorario y cambio de grosor de trazo',
    cells: [
      matrixSvgLib.dial(90, '#38bdf8', 26), matrixSvgLib.dial(45, '#38bdf8', 30), matrixSvgLib.dial(0, '#38bdf8', 34),
      matrixSvgLib.dial(180, '#38bdf8', 26), matrixSvgLib.dial(135, '#38bdf8', 30), matrixSvgLib.dial(90, '#38bdf8', 34),
      matrixSvgLib.dial(270, '#38bdf8', 26), matrixSvgLib.dial(225, '#38bdf8', 30)
    ],
    options: [
      matrixSvgLib.dial(135, '#38bdf8', 34),
      matrixSvgLib.dial(180, '#38bdf8', 34), // Correct (index 1: 225 - 45 = 180, length 34)
      matrixSvgLib.dial(225, '#38bdf8', 34),
      matrixSvgLib.dial(270, '#38bdf8', 34),
      matrixSvgLib.circle(26),
      matrixSvgLib.square(26),
      matrixSvgLib.dots(3),
      matrixSvgLib.cross(26)
    ],
    correctOptionIndex: 1
  },
  {
    id: 'mat_32',
    code: 'GF-HIGH-11',
    tier: 3,
    ruleType: 'topological',
    a: 2.24,
    b: 1.70,
    c: 0.125,
    ruleDescription: 'Transformación homológica continua de círculo a polígono de N lados',
    cells: [
      matrixSvgLib.circle(30), matrixSvgLib.triangle(36), matrixSvgLib.square(32),
      matrixSvgLib.triangle(36), matrixSvgLib.square(32), matrixSvgLib.diamond(36),
      matrixSvgLib.square(32), matrixSvgLib.diamond(36)
    ],
    options: [
      matrixSvgLib.circle(30),
      matrixSvgLib.square(32),
      matrixSvgLib.triangle(36),
      `<polygon points="50,18 78,38 68,76 32,76 22,38" fill="none" stroke="#f59e0b" stroke-width="3"/>`, // Correct (index 3: Pentagon 5 sides)
      matrixSvgLib.dots(5),
      matrixSvgLib.cross(30),
      matrixSvgLib.dial(90),
      matrixSvgLib.dial(180)
    ],
    correctOptionIndex: 3
  },
  {
    id: 'mat_33',
    code: 'GF-HIGH-12',
    tier: 3,
    ruleType: 'progression',
    a: 2.25,
    b: 1.75,
    c: 0.125,
    ruleDescription: 'Expansión volumétrica en 3 dimensiones con sombreado degradado',
    cells: [
      matrixSvgLib.cube3d(0, '#6366f1'), matrixSvgLib.cube3d(0, '#38bdf8'), matrixSvgLib.cube3d(0, '#34d399'),
      matrixSvgLib.cube3d(45, '#38bdf8'), matrixSvgLib.cube3d(45, '#34d399'), matrixSvgLib.cube3d(45, '#f59e0b'),
      matrixSvgLib.cube3d(90, '#34d399'), matrixSvgLib.cube3d(90, '#f59e0b')
    ],
    options: [
      matrixSvgLib.cube3d(90, '#ef4444'), // Correct (index 0: Next chromatic step)
      matrixSvgLib.cube3d(90, '#6366f1'),
      matrixSvgLib.cube3d(45, '#38bdf8'),
      matrixSvgLib.cube3d(0, '#34d399'),
      matrixSvgLib.square(30),
      matrixSvgLib.circle(30),
      matrixSvgLib.triangle(30),
      matrixSvgLib.dots(4)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_34',
    code: 'GF-HIGH-13',
    tier: 3,
    ruleType: 'boolean',
    a: 2.28,
    b: 1.80,
    c: 0.125,
    ruleDescription: 'Doble filtro booleano: AND horizontal seguido de XOR vertical',
    cells: [
      matrixSvgLib.segments(true, true, true, false), matrixSvgLib.segments(true, false, true, true), matrixSvgLib.segments(true, false, true, false),
      matrixSvgLib.segments(false, true, true, true), matrixSvgLib.segments(true, true, true, false), matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(true, true, false, true), matrixSvgLib.segments(true, false, true, true)
    ],
    options: [
      matrixSvgLib.segments(true, false, false, true), // Correct (index 0)
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.circle(25),
      matrixSvgLib.square(25),
      matrixSvgLib.dots(3),
      matrixSvgLib.cross(25)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_35',
    code: 'GF-HIGH-14',
    tier: 3,
    ruleType: 'rotation',
    a: 2.30,
    b: 1.85,
    c: 0.125,
    ruleDescription: 'Rotación ortogonal desacoplada: Anillo exterior 45° horario, Núcleo 90° antihorario',
    cells: [
      `${matrixSvgLib.dial(0)}${matrixSvgLib.cross(20, '#f59e0b', 3, 0)}`,
      `${matrixSvgLib.dial(45)}${matrixSvgLib.cross(20, '#f59e0b', 3, 270)}`,
      `${matrixSvgLib.dial(90)}${matrixSvgLib.cross(20, '#f59e0b', 3, 180)}`,
      `${matrixSvgLib.dial(90)}${matrixSvgLib.cross(20, '#f59e0b', 3, 180)}`,
      `${matrixSvgLib.dial(135)}${matrixSvgLib.cross(20, '#f59e0b', 3, 90)}`,
      `${matrixSvgLib.dial(180)}${matrixSvgLib.cross(20, '#f59e0b', 3, 0)}`,
      `${matrixSvgLib.dial(180)}${matrixSvgLib.cross(20, '#f59e0b', 3, 0)}`,
      `${matrixSvgLib.dial(225)}${matrixSvgLib.cross(20, '#f59e0b', 3, 270)}`
    ],
    options: [
      `${matrixSvgLib.dial(270)}${matrixSvgLib.cross(20, '#f59e0b', 3, 180)}`, // Correct (index 0)
      `${matrixSvgLib.dial(270)}${matrixSvgLib.cross(20, '#f59e0b', 3, 90)}`,
      `${matrixSvgLib.dial(225)}${matrixSvgLib.cross(20, '#f59e0b', 3, 0)}`,
      `${matrixSvgLib.dial(315)}${matrixSvgLib.cross(20, '#f59e0b', 3, 180)}`,
      matrixSvgLib.circle(25),
      matrixSvgLib.square(25),
      matrixSvgLib.dots(4),
      matrixSvgLib.cross(25)
    ],
    correctOptionIndex: 0
  },

  // ==========================================
  // LEVEL 4: GIFTED / AACC CEILING (b in [+1.9, +2.8]) - 10 items
  // ==========================================
  {
    id: 'mat_36',
    code: 'GF-CEIL-01',
    tier: 4,
    ruleType: 'boolean',
    a: 2.32,
    b: 1.95,
    c: 0.125,
    ruleDescription: 'Operación XOR estricta multidireccional en 4 líneas concurrentes',
    cells: [
      matrixSvgLib.segments(true, true, true, false),
      matrixSvgLib.segments(false, true, true, true),
      matrixSvgLib.segments(true, false, false, true), // XOR 1
      matrixSvgLib.segments(true, false, true, true),
      matrixSvgLib.segments(true, true, false, true),
      matrixSvgLib.segments(false, true, true, false), // XOR 2
      matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.segments(false, true, true, false)
    ],
    options: [
      matrixSvgLib.segments(true, false, true, false), // Correct (index 0)
      matrixSvgLib.segments(false, true, true, true),
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, false, false, false),
      matrixSvgLib.segments(true, true, false, true),
      matrixSvgLib.circle(28),
      matrixSvgLib.square(28),
      matrixSvgLib.cube3d(45)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_37',
    code: 'GF-CEIL-02',
    tier: 4,
    ruleType: 'rotation',
    a: 2.35,
    b: 2.05,
    c: 0.125,
    ruleDescription: 'Rotación hiperdimensional de Teseracto / Cubo 3D con inversión de fases',
    cells: [
      matrixSvgLib.cube3d(0, '#818cf8', '#4f46e5', '#312e81'),
      matrixSvgLib.cube3d(60, '#38bdf8', '#0284c7', '#0369a1'),
      matrixSvgLib.cube3d(120, '#34d399', '#059669', '#047857'),
      matrixSvgLib.cube3d(60, '#38bdf8', '#0284c7', '#0369a1'),
      matrixSvgLib.cube3d(120, '#34d399', '#059669', '#047857'),
      matrixSvgLib.cube3d(180, '#f59e0b', '#d97706', '#b45309'),
      matrixSvgLib.cube3d(120, '#34d399', '#059669', '#047857'),
      matrixSvgLib.cube3d(180, '#f59e0b', '#d97706', '#b45309')
    ],
    options: [
      matrixSvgLib.cube3d(180, '#f59e0b', '#d97706', '#b45309'),
      matrixSvgLib.cube3d(240, '#ec4899', '#db2777', '#be185d'), // Correct (index 1: 180 + 60 = 240)
      matrixSvgLib.cube3d(300, '#818cf8', '#4f46e5', '#312e81'),
      matrixSvgLib.cube3d(0, '#818cf8', '#4f46e5', '#312e81'),
      matrixSvgLib.square(35),
      matrixSvgLib.circle(35),
      matrixSvgLib.diamond(35),
      matrixSvgLib.cross(30)
    ],
    correctOptionIndex: 1
  },
  {
    id: 'mat_38',
    code: 'GF-CEIL-03',
    tier: 4,
    ruleType: 'boolean',
    a: 2.38,
    b: 2.15,
    c: 0.125,
    ruleDescription: 'Composición lógica bi-condicional XNOR: segmentos coinciden o desaparecen',
    cells: [
      matrixSvgLib.segments(true, false, false, true),
      matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.segments(false, true, false, true),
      matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(true, true, true, false),
      matrixSvgLib.segments(true, false, false, false),
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, true, true, false)
    ],
    options: [
      matrixSvgLib.segments(true, false, false, true), // Correct (index 0)
      matrixSvgLib.segments(false, false, false, false),
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, true, false, true),
      matrixSvgLib.circle(28),
      matrixSvgLib.square(28),
      matrixSvgLib.dots(4),
      matrixSvgLib.cross(28)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_39',
    code: 'GF-CEIL-04',
    tier: 4,
    ruleType: 'topological',
    a: 2.40,
    b: 2.25,
    c: 0.125,
    ruleDescription: 'Topología diferencial: permutación cíclica de 4 capas anidadas concéntricamente',
    cells: [
      `${matrixSvgLib.circle(42)}${matrixSvgLib.square(30)}${matrixSvgLib.diamond(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.square(42)}${matrixSvgLib.diamond(30)}${matrixSvgLib.circle(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.diamond(42)}${matrixSvgLib.circle(30)}${matrixSvgLib.square(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.square(42)}${matrixSvgLib.diamond(30)}${matrixSvgLib.circle(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.diamond(42)}${matrixSvgLib.circle(30)}${matrixSvgLib.square(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.circle(42)}${matrixSvgLib.square(30)}${matrixSvgLib.diamond(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.diamond(42)}${matrixSvgLib.circle(30)}${matrixSvgLib.square(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.circle(42)}${matrixSvgLib.square(30)}${matrixSvgLib.diamond(20)}${matrixSvgLib.dots(1)}`
    ],
    options: [
      `${matrixSvgLib.circle(42)}${matrixSvgLib.square(30)}${matrixSvgLib.diamond(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.diamond(42)}${matrixSvgLib.circle(30)}${matrixSvgLib.square(20)}${matrixSvgLib.dots(1)}`,
      `${matrixSvgLib.square(42)}${matrixSvgLib.diamond(30)}${matrixSvgLib.circle(20)}${matrixSvgLib.dots(1)}`, // Correct (index 2)
      `${matrixSvgLib.square(42)}${matrixSvgLib.circle(30)}${matrixSvgLib.diamond(20)}${matrixSvgLib.dots(1)}`,
      matrixSvgLib.circle(42),
      matrixSvgLib.square(42),
      matrixSvgLib.diamond(42),
      matrixSvgLib.cross(30)
    ],
    correctOptionIndex: 2
  },
  {
    id: 'mat_40',
    code: 'GF-CEIL-05',
    tier: 4,
    ruleType: 'progression',
    a: 2.42,
    b: 2.35,
    c: 0.125,
    ruleDescription: 'Doble matriz de congruencia geométrica: progresión horizontal x vertical simultánea',
    cells: [
      `<circle cx="25" cy="25" r="7" fill="#6366f1"/><circle cx="75" cy="75" r="7" fill="#38bdf8"/>`,
      `<circle cx="50" cy="25" r="7" fill="#6366f1"/><circle cx="50" cy="75" r="7" fill="#38bdf8"/>`,
      `<circle cx="75" cy="25" r="7" fill="#6366f1"/><circle cx="25" cy="75" r="7" fill="#38bdf8"/>`,
      `<circle cx="25" cy="50" r="7" fill="#6366f1"/><circle cx="75" cy="50" r="7" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="7" fill="#6366f1"/><circle cx="50" cy="50" r="7" fill="#38bdf8"/>`,
      `<circle cx="75" cy="50" r="7" fill="#6366f1"/><circle cx="25" cy="50" r="7" fill="#38bdf8"/>`,
      `<circle cx="25" cy="75" r="7" fill="#6366f1"/><circle cx="75" cy="25" r="7" fill="#38bdf8"/>`,
      `<circle cx="50" cy="75" r="7" fill="#6366f1"/><circle cx="50" cy="25" r="7" fill="#38bdf8"/>`
    ],
    options: [
      `<circle cx="75" cy="75" r="7" fill="#6366f1"/><circle cx="25" cy="25" r="7" fill="#38bdf8"/>`, // Correct (index 0)
      `<circle cx="25" cy="25" r="7" fill="#6366f1"/><circle cx="75" cy="75" r="7" fill="#38bdf8"/>`,
      `<circle cx="50" cy="50" r="7" fill="#6366f1"/>`,
      `<circle cx="75" cy="25" r="7" fill="#6366f1"/>`,
      matrixSvgLib.square(30),
      matrixSvgLib.triangle(30),
      matrixSvgLib.dots(4),
      matrixSvgLib.cross(30)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_41',
    code: 'GF-CEIL-06',
    tier: 4,
    ruleType: 'boolean',
    a: 2.44,
    b: 2.45,
    c: 0.125,
    ruleDescription: 'Álgebra de Boole sobre matriz de 8 segmentos radiantes (Intersección compleja)',
    cells: [
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(true, false, true, false),
      matrixSvgLib.segments(false, true, false, true), // Complemento
      matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.segments(true, false, true, false),
      matrixSvgLib.segments(true, true, false, true),
      matrixSvgLib.segments(false, true, true, true)
    ],
    options: [
      matrixSvgLib.segments(true, false, true, false), // Correct (index 0)
      matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, false, false, false),
      matrixSvgLib.circle(28),
      matrixSvgLib.square(28),
      matrixSvgLib.diamond(28),
      matrixSvgLib.dots(4)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_42',
    code: 'GF-CEIL-07',
    tier: 4,
    ruleType: 'rotation',
    a: 2.45,
    b: 2.55,
    c: 0.125,
    ruleDescription: 'Rotación helicoidal 3D acoplada a escala fractal (Efecto túnel)',
    cells: [
      matrixSvgLib.dial(0, '#818cf8', 36), matrixSvgLib.dial(45, '#38bdf8', 28), matrixSvgLib.dial(90, '#34d399', 20),
      matrixSvgLib.dial(45, '#38bdf8', 28), matrixSvgLib.dial(90, '#34d399', 20), matrixSvgLib.dial(135, '#f59e0b', 12),
      matrixSvgLib.dial(90, '#34d399', 20), matrixSvgLib.dial(135, '#f59e0b', 12)
    ],
    options: [
      matrixSvgLib.dial(180, '#ef4444', 6), // Correct (index 0: 180 deg, length 6)
      matrixSvgLib.dial(135, '#f59e0b', 12),
      matrixSvgLib.dial(90, '#34d399', 20),
      matrixSvgLib.dial(225, '#ec4899', 6),
      matrixSvgLib.circle(20),
      matrixSvgLib.square(20),
      matrixSvgLib.cross(20),
      matrixSvgLib.dots(2)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_43',
    code: 'GF-CEIL-08',
    tier: 4,
    ruleType: 'topological',
    a: 2.46,
    b: 2.65,
    c: 0.125,
    ruleDescription: 'Teoría de nudos y traslación topológica no lineal',
    cells: [
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(0 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(60 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(120 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(60 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(120 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(180 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(120 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(180 50 50)"/>`
    ],
    options: [
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(240 50 50)"/>`, // Correct (index 0)
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(0 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(60 50 50)"/>`,
      `<ellipse cx="50" cy="50" rx="36" ry="16" fill="none" stroke="#6366f1" stroke-width="2.5" transform="rotate(120 50 50)"/>`,
      matrixSvgLib.circle(36),
      matrixSvgLib.square(36),
      matrixSvgLib.cross(30),
      matrixSvgLib.dots(4)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_44',
    code: 'GF-CEIL-09',
    tier: 4,
    ruleType: 'boolean',
    a: 2.48,
    b: 2.75,
    c: 0.125,
    ruleDescription: 'Composición de matriz 3x3 de micropíxeles con regla de autómata celular (Conway)',
    cells: [
      matrixSvgLib.segments(true, true, true, false),
      matrixSvgLib.segments(true, false, false, true),
      matrixSvgLib.segments(false, true, true, true), // Cellular transition
      matrixSvgLib.segments(false, true, true, true),
      matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.segments(true, false, true, true),
      matrixSvgLib.segments(true, true, true, false),
      matrixSvgLib.segments(false, true, true, true)
    ],
    options: [
      matrixSvgLib.segments(true, false, false, true), // Correct (index 0)
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.segments(false, false, false, false),
      matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.circle(28),
      matrixSvgLib.square(28),
      matrixSvgLib.diamond(28),
      matrixSvgLib.cross(28)
    ],
    correctOptionIndex: 0
  },
  {
    id: 'mat_45',
    code: 'GF-CEIL-10',
    tier: 4,
    ruleType: 'boolean',
    a: 2.50,
    b: 2.80,
    c: 0.125,
    ruleDescription: 'Techo Absoluto de Razonamiento Matricial: Superposición Booleana XOR + Rotación 90° simultánea',
    cells: [
      matrixSvgLib.segments(true, true, false, true),
      matrixSvgLib.segments(false, true, true, true),
      matrixSvgLib.segments(true, false, true, false), // XOR + 90
      matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(true, false, true, true),
      matrixSvgLib.segments(true, true, false, false),
      matrixSvgLib.segments(true, false, true, true),
      matrixSvgLib.segments(false, true, false, true)
    ],
    options: [
      matrixSvgLib.segments(true, true, true, false), // Correct (index 0)
      matrixSvgLib.segments(false, false, true, true),
      matrixSvgLib.segments(true, false, false, true),
      matrixSvgLib.segments(false, true, true, false),
      matrixSvgLib.segments(true, true, true, true),
      matrixSvgLib.circle(30),
      matrixSvgLib.cube3d(90),
      matrixSvgLib.cross(30)
    ],
    correctOptionIndex: 0
  }
];
