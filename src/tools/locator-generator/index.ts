/**
 * Locator Generator Tool
 * Export all public interfaces
 */

export { LocatorGenerator } from './LocatorGenerator';
export type { 
  LocatorGeneratorConfig,
  GeneratedLocator,
  ElementInfo,
  LocatorType,
  TestFramework,
  LocatorGenerationOptions,
  ParsedHTML,
  LocatorValidation,
  FragilityLevel
} from './types';
export {
  parseHTML,
  generateLocators,
  validateLocator,
  getDefaultOptions
} from './utils';