/**
 * Types for Locator Generator Tool
 */

export interface ElementInfo {
  tag: string;
  id?: string;
  classes: string[];
  attributes: Record<string, string>;
  textContent?: string;
  position: {
    index: number;
    siblingCount: number;
  };
  parent?: ElementInfo;
  children: ElementInfo[];
}

export interface GeneratedLocator {
  type: LocatorType;
  locator: string;
  robustnessScore: number;
  priority: number;
  framework: TestFramework;
  codeSnippet: string;
  description: string;
  pros: string[];
  cons: string[];
}

export const LocatorType = {
  ID: 'id',
  DATA_TESTID: 'data-testid',
  DATA_TEST: 'data-test',
  ROLE: 'role',
  LABEL: 'label',
  PLACEHOLDER: 'placeholder',
  TEXT: 'text',
  CLASS: 'class',
  CSS: 'css',
  XPATH: 'xpath'
} as const;

export type LocatorType = typeof LocatorType[keyof typeof LocatorType];

export const TestFramework = {
  PLAYWRIGHT: 'playwright',
  SELENIUM_JAVA: 'selenium-java',
  SELENIUM_PYTHON: 'selenium-python',
  SELENIUM_CSHARP: 'selenium-csharp',
  CYPRESS: 'cypress',
  WEBDRIVER_IO: 'webdriverio',
  TESTCAFE: 'testcafe'
} as const;

export type TestFramework = typeof TestFramework[keyof typeof TestFramework];

export interface LocatorGenerationOptions {
  preferDataTestId: boolean;
  includeRoleLocators: boolean;
  includeXPath: boolean;
  maxClassLocators: number;
  allowFragileLocators: boolean;
  targetFrameworks: TestFramework[];
}

export interface ParsedHTML {
  elements: ElementInfo[];
  stats: {
    totalElements: number;
    elementsWithId: number;
    elementsWithTestId: number;
    elementsWithClasses: number;
  };
}

export interface LocatorValidation {
  isUnique: boolean;
  matchCount: number;
  isStable: boolean;
  fragility: FragilityLevel;
  recommendations: string[];
}

export const FragilityLevel = {
  VERY_STABLE: 'very-stable',
  STABLE: 'stable',
  MODERATE: 'moderate',
  FRAGILE: 'fragile',
  VERY_FRAGILE: 'very-fragile'
} as const;

export type FragilityLevel = typeof FragilityLevel[keyof typeof FragilityLevel];

export interface LocatorGeneratorConfig {
  maxSuggestions: number;
  prioritizeAccessibility: boolean;
  includeFrameworkExamples: boolean;
  showRobustnessScores: boolean;
  enableAdvancedOptions: boolean;
}