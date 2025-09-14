/**
 * Hash Generator Types and Interfaces
 */

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'crc32';

export interface HashOptions {
  algorithm: HashAlgorithm;
  format: 'hex' | 'base64';
  uppercase: boolean;
  withSeparators: boolean;
}

export interface HashResult {
  success: boolean;
  hash?: string;
  algorithm?: HashAlgorithm;
  format?: string;
  inputSize?: number;
  processingTime?: number;
  error?: string;
}

export interface BatchHashInput {
  id: string;
  content: string;
  name?: string;
}

export interface BatchHashResult {
  success: boolean;
  results?: Array<{
    id: string;
    name?: string;
    hash: string;
    algorithm: HashAlgorithm;
    inputSize: number;
    processingTime: number;
  }>;
  totalProcessed?: number;
  totalTime?: number;
  error?: string;
}

export interface FileHashResult {
  success: boolean;
  fileName?: string;
  fileSize?: number;
  hash?: string;
  algorithm?: HashAlgorithm;
  processingTime?: number;
  error?: string;
}

export interface HashValidation {
  isValid: boolean;
  algorithm?: HashAlgorithm;
  format?: 'hex' | 'base64';
  length?: number;
  expectedLength?: number;
}

export interface HashComparison {
  hash1: string;
  hash2: string;
  algorithm: HashAlgorithm;
  match: boolean;
  similarity?: number;
}

export interface HashGenerationOptions extends HashOptions {
  enableRealtime: boolean;
  enableFileUpload: boolean;
  enableBatchProcessing: boolean;
  maxFileSize: number; // in bytes
  maxBatchSize: number;
}

export interface AlgorithmInfo {
  name: string;
  algorithm: HashAlgorithm;
  description: string;
  outputLength: number;
  securityLevel: 'low' | 'medium' | 'high';
  speed: 'fast' | 'medium' | 'slow';
  recommended: boolean;
  deprecated?: boolean;
}

export interface HashStats {
  algorithm: HashAlgorithm;
  totalHashes: number;
  totalDataProcessed: number; // in bytes
  averageProcessingTime: number; // in ms
  fastestTime: number;
  slowestTime: number;
}

export type HashFormat = 'hex' | 'base64';
export type SecurityLevel = 'low' | 'medium' | 'high';
export type ProcessingSpeed = 'fast' | 'medium' | 'slow';