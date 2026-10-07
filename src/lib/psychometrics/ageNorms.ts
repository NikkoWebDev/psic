// Normative Developmental Age-Adjustment Module (Wechsler WISC-V / WAIS-IV curves)
import { AgeBracket, AgeNormOffsets } from './types';

/**
 * Standard developmental norm offsets derived from WISC-V and WAIS-IV standardization samples.
 * These offsets ensure that pediatric examinees (8-15) and older adults (46+) are not penalized
 * against peak-adult (16-45) working memory span, crystallized vocabulary, or visuomotor processing speed.
 */
export const AGE_NORM_OFFSETS: Record<AgeBracket, AgeNormOffsets> = {
  '8-11': {
    offsetGwm: 1.40, // Working memory span development adjustment (~+1.40 SD)
    offsetGc: 1.20,  // Crystallized verbal knowledge adjustment (~+1.20 SD)
    offsetGs: 0.80   // Visuomotor execution speed adjustment (~+0.80 SD)
  },
  '12-15': {
    offsetGwm: 0.50, // Adolescent cognitive maturation adjustment
    offsetGc: 0.50,
    offsetGs: 0.30
  },
  '16-25': {
    offsetGwm: 0.0,
    offsetGc: 0.0,
    offsetGs: 0.0
  },
  '26-45': {
    offsetGwm: 0.0,
    offsetGc: 0.0,
    offsetGs: 0.0
  },
  '46-65': {
    offsetGwm: 0.0,
    offsetGc: 0.0,
    offsetGs: 0.40   // Motor slowing compensation
  },
  '65+': {
    offsetGwm: 0.0,
    offsetGc: 0.0,
    offsetGs: 0.60   // Sensory-motor slowing compensation
  }
};

/**
 * Retrieves the specific normative developmental offsets for an age bracket.
 */
export function getAgeNormOffsets(bracket?: AgeBracket): AgeNormOffsets {
  if (!bracket || !AGE_NORM_OFFSETS[bracket]) {
    return AGE_NORM_OFFSETS['26-45']; // Default adult baseline
  }
  return AGE_NORM_OFFSETS[bracket];
}
