<div align="center">

# NEUROSYNAPSE (Psicobot)

### Adaptive Cognitive & Behavioral Psychometric Engine

**Motor psicométrico interactivo de evaluación cognitiva adaptativa diseñado con enfoque en neurodivergencia (AACC, TDAH y Doble Excepcionalidad).**

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.x-black?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Vitest](https://img.shields.io/badge/Vitest-5.x-FCC72B?style=flat-square&logo=vitest&logoColor=black)](https://vitest.dev)

</div>

---

## 🧠 Descripción

**NEUROSYNAPSE** es una plataforma clínica e interactiva orientada a la evaluación psicométrica rigurosa de funciones cognitivas. A diferencia de las pruebas estandarizadas rígidas, implementa mecanismos de **evaluación adaptativa, control de fatiga cognitiva en tiempo real y arquitectura de descompresión sensorial**, permitiendo obtener mediciones de alta precisión sin sesgos inducidos por sobrecarga atencional.

---

## ⚡ Batería Psicométrica Integrada

1. **Operation Span Task (`OSpan`)**: Evaluación computarizada de la capacidad de memoria de trabajo (Working Memory Capacity - WMC) mediante alternancia de operaciones aritméticas y retención serial de estímulos.
2. **Symbol Match Task**: Medición de latencia de discriminación visual y velocidad de procesamiento cognitivo (Processing Speed Index - PSI).
3. **Verbal Matrix & Reasoning Task**: Evaluación de razonamiento fluido, analogías relacionales y comprensión conceptual.
4. **Adaptive Energy & Fatigue Checkpoint**: Algoritmo de monitoreo continuo de fatiga cognitiva con pausas reguladas dinámicamente según la latencia de respuesta del usuario.
5. **Decompression & Sensory Interface**: Módulo de regulación sensorial diseñado para perfiles con TDAH y Altas Capacidades (AACC).

---

## 🛠 Stack Técnico

- **Frontend Core**: React 19 (Hooks concurrentes, Transitions).
- **Tipado & Lógica**: TypeScript estricto con modelos tipados para matrices y percentiles psicométricos.
- **Estilos & Animaciones**: Tailwind CSS v4, Framer Motion para transiciones cinéticas de baja distracción.
- **Persistencia Local**: `idb-keyval` (IndexedDB) para persistencia sin conexión y auditoría de eventos de prueba sin dependencia de servidores externos.
- **Audio & Haptics**: Módulo Web Audio API para feedback sonoro de baja frecuencia.
- **Testing**: Vitest para validación unitaria de algoritmos de cálculo de percentiles y matrices de dispersión.

---

## 📐 Arquitectura del Sistema

```
src/
├── components/
│   ├── OSpanTask.tsx             # Medición de memoria de trabajo activa
│   ├── SymbolMatchTask.tsx       # Latencia y velocidad de procesamiento
│   ├── VerbalTask.tsx            # Razonamiento conceptual y analogías
│   ├── EnergyCheckpoint.tsx      # Detector adaptativo de fatiga
│   ├── DecompressionScreen.tsx   # Regulación sensorial guiada
│   ├── AccessibilityBar.tsx      # Control de contraste, fuentes y estímulos
│   └── Dashboard.tsx             # Reporte clínico multidimensional (Percentiles, Z-Scores)
├── lib/
│   ├── psychometrics/            # Modelos matemáticos (WISC/WAIS proxies, normalización)
│   ├── audio/                    # Síntesis sonora sutil y feedback auditivo
│   └── state/                    # Máquina de estados finitos del protocolo de evaluación
```

---

## 🚀 Instalación y Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/NikkoWebDev/psic.git
cd psic

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar suite de pruebas unitarias
npm run test

# Compilar para producción
npm run build
```

---

## 🔒 Privacidad y Almacenamiento Local

El motor procesa y normaliza los puntajes completamente en el dispositivo del cliente mediante **IndexedDB**, garantizando que ninguna información psicométrica sensible viaje a servidores de terceros sin consentimiento explícito.
