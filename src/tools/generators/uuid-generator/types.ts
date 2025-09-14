/**
 * UUID Generator Tool - TypeScript Interfaces
 *
 * Comprehensive type definitions for UUID generation, validation, and formatting
 */

/**
 * Supported UUID versions
 */
export type UUIDVersion = 'v1' | 'v3' | 'v4' | 'v5' | 'nil';

/**
 * UUID output formats
 */
export type UUIDFormat = 'standard' | 'uppercase' | 'lowercase' | 'no-hyphens' | 'braces' | 'brackets';

/**
 * Namespace options for v3/v5 UUIDs
 */
export interface UUIDNamespace {
  name: string;
  uuid: string;
  description: string;
}

/**
 * Configuration for UUID generation
 */
export interface UUIDGenerationConfig {
  version: UUIDVersion;
  format: UUIDFormat;
  count: number;
  namespace?: string;
  name?: string;
  realTime?: boolean;
}

/**
 * Generated UUID result
 */
export interface GeneratedUUID {
  uuid: string;
  version: UUIDVersion;
  format: UUIDFormat;
  timestamp?: number;
  node?: string;
  clockSequence?: number;
  generatedAt: Date;
}

/**
 * Batch generation result
 */
export interface UUIDBatchResult {
  uuids: GeneratedUUID[];
  totalGenerated: number;
  generationTime: number;
  config: UUIDGenerationConfig;
}

/**
 * UUID validation result
 */
export interface UUIDValidationResult {
  isValid: boolean;
  version?: UUIDVersion;
  format: UUIDFormat;
  timestamp?: number;
  node?: string;
  clockSequence?: number;
  errors: string[];
  suggestions: string[];
}

/**
 * UUID analysis statistics
 */
export interface UUIDAnalysis {
  totalGenerated: number;
  versionCounts: Record<UUIDVersion, number>;
  formatCounts: Record<UUIDFormat, number>;
  averageGenerationTime: number;
  uniquenessCheck: boolean;
  collisionDetected: boolean;
}

/**
 * Export options for UUID data
 */
export interface UUIDExportOptions {
  format: 'csv' | 'json' | 'txt';
  includeMetadata: boolean;
  filename?: string;
}

/**
 * Predefined namespaces for v3/v5 UUIDs
 */
export const PREDEFINED_NAMESPACES: Record<string, UUIDNamespace> = {
  DNS: {
    name: 'DNS',
    uuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    description: 'Domain Name System namespace'
  },
  URL: {
    name: 'URL',
    uuid: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    description: 'URL namespace'
  },
  OID: {
    name: 'OID',
    uuid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    description: 'Object Identifier namespace'
  },
  X500: {
    name: 'X500',
    uuid: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
    description: 'X.500 Distinguished Name namespace'
  }
};

/**
 * UUID format patterns for validation
 */
export const UUID_PATTERNS = {
  STANDARD: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  NO_HYPHENS: /^[0-9a-f]{32}$/i,
  BRACES: /^\{[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\}$/i,
  BRACKETS: /^\[[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\]$/i,
  NIL: /^0{8}-0{4}-0{4}-0{4}-0{12}$/,
  ANY: /^(\{|\[)?[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}(\}|\])?$/i
};

/**
 * UUID generation statistics
 */
export interface UUIDStats {
  generatedCount: number;
  validatedCount: number;
  errorCount: number;
  averageTime: number;
  peakGenerationRate: number;
  memoryUsage?: number;
}

/**
 * Real-time generation options
 */
export interface RealTimeOptions {
  enabled: boolean;
  interval: number; // milliseconds
  maxCount: number;
  autoStop: boolean;
}