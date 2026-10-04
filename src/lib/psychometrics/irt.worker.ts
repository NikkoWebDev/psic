// Dedicated Web Worker for off-main-thread IRT Gauss-Hermite numerical quadrature & Fisher Information optimization
import {
  estimateAbilityEAP,
  selectNextItemFisher,
  calculateDrasgowLz,
  checkADHDImpulsiveAnomaly,
  thetaToWechslerIQ,
  thetaSEMToIQSEM,
  calculateConfidenceInterval95,
  thetaToPercentile,
  MIN_CAT_ITEMS,
  SEM_STOPPING_THRESHOLD,
  MAX_CAT_ITEMS
} from './irt3pl';
import { MatrixItem, MatrixResponseRecord } from './types';

export interface WorkerProcessStepInput {
  responses: MatrixResponseRecord[];
  availableItems: MatrixItem[];
  currentTheta: number;
  lastResponse?: {
    itemId: string;
    b: number;
    isCorrect: boolean;
    latencyMs: number;
  };
}

export interface WorkerProcessStepOutput {
  thetaEAP: number;
  posteriorVariance: number;
  semTheta: number;
  iqScore: number;
  semIQ: number;
  ci95: [number, number];
  percentile: number;
  drasgowLz: number;
  isImpulsiveAnomaly: boolean;
  isTerminated: boolean;
  terminationReason?: 'SEM_CONVERGENCE' | 'MAX_ITEMS_REACHED' | 'POOL_EXHAUSTED';
  nextItem: MatrixItem | null;
}

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'PROCESS_STEP') {
    const { responses, availableItems, currentTheta, lastResponse } = payload as WorkerProcessStepInput;

    let isImpulsiveAnomaly = false;
    if (lastResponse) {
      isImpulsiveAnomaly = checkADHDImpulsiveAnomaly(
        currentTheta,
        lastResponse.b,
        lastResponse.isCorrect,
        lastResponse.latencyMs
      );
    }

    // Mark the last response if it was an impulsive anomaly
    if (isImpulsiveAnomaly && responses.length > 0) {
      responses[responses.length - 1].isImpulsiveAnomaly = true;
    }

    // Run 61-node Gauss-Hermite numerical quadrature EAP estimation
    const estimation = estimateAbilityEAP(responses);
    const iq = thetaToWechslerIQ(estimation.thetaEAP);
    const semIQ = thetaSEMToIQSEM(estimation.semTheta);
    const ci95 = calculateConfidenceInterval95(iq, semIQ);
    const percentile = thetaToPercentile(estimation.thetaEAP);
    const drasgowLz = calculateDrasgowLz(estimation.thetaEAP, responses);

    // Stopping rules: Dynamic convergence after MIN_CAT_ITEMS
    let isTerminated = false;
    let terminationReason: 'SEM_CONVERGENCE' | 'MAX_ITEMS_REACHED' | 'POOL_EXHAUSTED' | undefined;

    if (responses.length >= MIN_CAT_ITEMS && estimation.semTheta <= SEM_STOPPING_THRESHOLD) {
      isTerminated = true;
      terminationReason = 'SEM_CONVERGENCE';
    } else if (responses.length >= MAX_CAT_ITEMS) {
      isTerminated = true;
      terminationReason = 'MAX_ITEMS_REACHED';
    } else if (availableItems.length === 0) {
      isTerminated = true;
      terminationReason = 'POOL_EXHAUSTED';
    }

    // Fisher Information item selection if not terminated
    const nextItem = isTerminated ? null : selectNextItemFisher(estimation.thetaEAP, availableItems);

    const output: WorkerProcessStepOutput = {
      thetaEAP: estimation.thetaEAP,
      posteriorVariance: estimation.posteriorVariance,
      semTheta: estimation.semTheta,
      iqScore: iq,
      semIQ,
      ci95,
      percentile,
      drasgowLz,
      isImpulsiveAnomaly,
      isTerminated,
      terminationReason,
      nextItem
    };

    self.postMessage({ type: 'PROCESS_STEP_RESULT', result: output });
  }
};
