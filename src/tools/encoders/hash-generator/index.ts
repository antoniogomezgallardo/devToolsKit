/**
 * Hash Generator Tool - Module Exports
 */

export { HashGenerator } from './HashGenerator';
export {
  generateHash,
  generateHashFromFile,
  generateBatchHashes,
  validateHash,
  compareHashes,
  formatHash,
  getAvailableAlgorithms,
  isAlgorithmSupported,
  getRecommendedAlgorithm,
  getDefaultOptions,
  calculateHashStats,
  ALGORITHM_INFO
} from './utils';
export type {
  HashAlgorithm,
  HashOptions,
  HashResult,
  BatchHashInput,
  BatchHashResult,
  FileHashResult,
  HashValidation,
  HashComparison,
  HashGenerationOptions,
  AlgorithmInfo,
  HashStats,
  HashFormat,
  SecurityLevel,
  ProcessingSpeed
} from './types';