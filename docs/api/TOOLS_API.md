# 🛠️ Tools API Documentation

**Complete API reference for DevToolsKit tool interfaces, types, and contracts.**

---

## 📋 Table of Contents

1. [Base Tool Interface](#-base-tool-interface)
2. [JSON Validator API](#-json-validator-api)
3. [JWT Decoder API](#-jwt-decoder-api)
4. [Base64 Encoder/Decoder API](#-base64-encoderdecoder-api)
5. [Locator Generator API](#-locator-generator-api)
6. [Tool Creation Guidelines](#-tool-creation-guidelines)
7. [Common Patterns](#-common-patterns)

---

## 🏗️ Base Tool Interface

### **Core Tool Contract**
Every tool in DevToolsKit must implement the base `Tool` interface:

```typescript
interface Tool {
  // Core properties
  readonly name: string;
  readonly description: string;
  readonly category: ToolCategory;
  readonly version: string;
  
  // Lifecycle methods
  init(): void;
  render(): void;
  destroy(): void;
  
  // State management
  getState(): ToolState;
  setState(state: Partial<ToolState>): void;
  
  // Analytics integration
  trackUsage(action: string, metadata?: Record<string, any>): void;
}

// Tool categorization
type ToolCategory = 
  | 'validation'    // JSON Validator, XML Validator
  | 'conversion'    // Base64, Hash Generator  
  | 'generation'    // Password Generator, QR Code
  | 'analysis'      // JWT Decoder, Locator Generator
  | 'formatting'    // JSON Formatter, CSS Beautifier
  | 'testing';      // Locator Generator, Mock Data

// Base tool state
interface ToolState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastUpdated: Date;
  inputValue: string;
  outputValue: string;
}

// Tool configuration
interface ToolConfig {
  container: HTMLElement;
  analytics: AnalyticsConfig;
  theme: 'light' | 'dark' | 'auto';
  responsive: boolean;
}
```

### **Base Tool Implementation**
```typescript
abstract class BaseTool implements Tool {
  protected container: HTMLElement;
  protected config: ToolConfig;
  protected state: ToolState;
  
  constructor(container: HTMLElement, config: Partial<ToolConfig> = {}) {
    this.container = container;
    this.config = { ...defaultConfig, ...config };
    this.state = this.getInitialState();
  }

  // Abstract methods (must be implemented by concrete tools)
  abstract get name(): string;
  abstract get description(): string;
  abstract get category(): ToolCategory;
  abstract processInput(input: string): Promise<string | ToolResult>;

  // Common implementation
  init(): void {
    this.render();
    this.attachEventListeners();
    this.trackUsage('init');
  }

  render(): void {
    this.container.innerHTML = this.getTemplate();
    this.applyStyles();
  }

  destroy(): void {
    this.removeEventListeners();
    this.container.innerHTML = '';
    this.trackUsage('destroy');
  }

  protected abstract getTemplate(): string;
  protected abstract attachEventListeners(): void;
  protected abstract removeEventListeners(): void;
}
```

---

## 📋 JSON Validator API

### **Interface Definition**
```typescript
interface JSONValidatorResult {
  isValid: boolean;
  parsed?: any;
  formatted?: string;
  error?: JSONError;
  metadata: JSONMetadata;
}

interface JSONError {
  message: string;
  line?: number;
  column?: number;
  position?: number;
  type: 'syntax' | 'structure' | 'value';
}

interface JSONMetadata {
  size: number;
  depth: number;
  keys: number;
  arrays: number;
  objects: number;
  primitives: number;
  processingTime: number;
}

interface JSONValidatorConfig {
  maxSize: number;          // Default: 1MB
  maxDepth: number;         // Default: 100  
  strictMode: boolean;      // Default: false
  allowComments: boolean;   // Default: false
  indentation: number;      // Default: 2
}
```

### **Usage Example**
```typescript
import { JSONValidator } from '@/tools/json-validator';

// Initialize validator
const container = document.getElementById('json-validator');
const validator = new JSONValidator(container, {
  maxSize: 500000,
  strictMode: true,
  indentation: 4
});

// Process JSON input
const result = await validator.processInput(jsonString);

if (result.isValid) {
  console.log('Valid JSON:', result.parsed);
  console.log('Formatted:', result.formatted);
  console.log('Metadata:', result.metadata);
} else {
  console.error('JSON Error:', result.error);
}

// Manual validation (utility function)
import { validateJSON, formatJSON } from '@/tools/json-validator/utils';

const validationResult = validateJSON(jsonString);
const formattedJSON = formatJSON(parsedObject, { indentation: 2 });
```

### **Event System**
```typescript
// JSON Validator events
validator.on('validate', (result: JSONValidatorResult) => {
  // Handle validation result
});

validator.on('format', (formatted: string) => {
  // Handle formatted output
});

validator.on('error', (error: JSONError) => {
  // Handle validation errors
});

// Example usage with analytics
validator.on('validate', (result) => {
  trackEvent('json_validation', {
    is_valid: result.isValid,
    json_size: result.metadata.size,
    processing_time: result.metadata.processingTime
  });
});
```

---

## 🔐 JWT Decoder API

### **Interface Definition**
```typescript
interface JWTDecodeResult {
  isValid: boolean;
  header?: JWTHeader;
  payload?: JWTPayload;
  signature?: string;
  error?: JWTError;
  metadata: JWTMetadata;
}

interface JWTHeader {
  alg: string;           // Algorithm
  typ: string;           // Token type
  kid?: string;          // Key ID
  [key: string]: any;    // Additional header claims
}

interface JWTPayload {
  // Standard claims (RFC 7519)
  iss?: string;          // Issuer
  sub?: string;          // Subject  
  aud?: string | string[]; // Audience
  exp?: number;          // Expiration time
  nbf?: number;          // Not before
  iat?: number;          // Issued at
  jti?: string;          // JWT ID
  
  // Custom claims
  [key: string]: any;
}

interface JWTError {
  type: 'format' | 'decode' | 'expired' | 'invalid';
  message: string;
  details?: string;
}

interface JWTMetadata {
  isExpired: boolean;
  expiresIn?: number;     // Seconds until expiration
  algorithm: string;
  tokenLength: number;
  partsCount: number;
  processingTime: number;
}

interface JWTDecoderConfig {
  validateExpiration: boolean;  // Default: true
  allowUnsigned: boolean;       // Default: false
  clockTolerance: number;       // Default: 60 seconds
  requireStandardClaims: boolean; // Default: false
}
```

### **Usage Example**
```typescript
import { JWTDecoder } from '@/tools/jwt-decoder';

// Initialize decoder
const container = document.getElementById('jwt-decoder');
const decoder = new JWTDecoder(container, {
  validateExpiration: true,
  clockTolerance: 60
});

// Decode JWT token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const result = await decoder.processInput(token);

if (result.isValid) {
  console.log('Header:', result.header);
  console.log('Payload:', result.payload);
  console.log('Is Expired:', result.metadata.isExpired);
  console.log('Expires In:', result.metadata.expiresIn);
} else {
  console.error('JWT Error:', result.error);
}

// Utility functions
import { decodeJWT, validateJWTExpiration } from '@/tools/jwt-decoder/utils';

const decoded = decodeJWT(token);
const isExpired = validateJWTExpiration(decoded.payload);
```

### **Security Considerations**
```typescript
// JWT security validation
interface JWTSecurityCheck {
  hasExpiration: boolean;
  isExpired: boolean;
  hasWeakAlgorithm: boolean;
  hasSecurityWarnings: string[];
}

const performSecurityCheck = (result: JWTDecodeResult): JWTSecurityCheck => {
  const warnings: string[] = [];
  
  // Check for expiration claim
  const hasExpiration = !!result.payload?.exp;
  if (!hasExpiration) {
    warnings.push('Token has no expiration claim (exp)');
  }
  
  // Check algorithm strength
  const weakAlgorithms = ['none', 'HS256']; // Consider context
  const hasWeakAlgorithm = weakAlgorithms.includes(result.header?.alg || '');
  if (hasWeakAlgorithm) {
    warnings.push(`Potentially weak algorithm: ${result.header?.alg}`);
  }
  
  // Check token age
  if (result.payload?.iat) {
    const tokenAge = Date.now() / 1000 - result.payload.iat;
    if (tokenAge > 86400) { // 24 hours
      warnings.push('Token is more than 24 hours old');
    }
  }
  
  return {
    hasExpiration,
    isExpired: result.metadata.isExpired,
    hasWeakAlgorithm,
    hasSecurityWarnings: warnings
  };
};
```

---

## 🔤 Base64 Encoder/Decoder API

### **Interface Definition**
```typescript
interface Base64Result {
  success: boolean;
  output: string;
  inputType: 'text' | 'file' | 'url';
  outputType: 'base64' | 'decoded';
  encoding: BufferEncoding;
  error?: Base64Error;
  metadata: Base64Metadata;
}

interface Base64Error {
  type: 'invalid_input' | 'invalid_base64' | 'encoding_error' | 'file_error';
  message: string;
  details?: string;
}

interface Base64Metadata {
  inputSize: number;
  outputSize: number;
  compressionRatio: number;
  isUrlSafe: boolean;
  hasPadding: boolean;
  processingTime: number;
  mimeType?: string;
}

interface Base64Config {
  urlSafe: boolean;         // Default: false
  removePadding: boolean;   // Default: false  
  maxFileSize: number;      // Default: 10MB
  allowedMimeTypes: string[]; // Default: all
  encoding: BufferEncoding; // Default: 'utf8'
}

type Base64Mode = 'encode' | 'decode';
```

### **Usage Example**
```typescript
import { Base64EncoderDecoder } from '@/tools/base64-encoder-decoder';

// Initialize encoder/decoder
const container = document.getElementById('base64-tool');
const base64Tool = new Base64EncoderDecoder(container, {
  urlSafe: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'text/plain']
});

// Encode text
const encodeResult = await base64Tool.encode('Hello, World!');
if (encodeResult.success) {
  console.log('Encoded:', encodeResult.output);
  console.log('Size increase:', encodeResult.metadata.compressionRatio);
}

// Decode Base64
const decodeResult = await base64Tool.decode('SGVsbG8sIFdvcmxkIQ==');
if (decodeResult.success) {
  console.log('Decoded:', decodeResult.output);
}

// File encoding
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
const file = fileInput.files?.[0];
if (file) {
  const fileResult = await base64Tool.encodeFile(file);
  if (fileResult.success) {
    console.log('File encoded:', fileResult.output.substring(0, 100) + '...');
    console.log('MIME Type:', fileResult.metadata.mimeType);
  }
}

// Utility functions
import { 
  encodeBase64, 
  decodeBase64, 
  isValidBase64, 
  getBase64MimeType 
} from '@/tools/base64-encoder-decoder/utils';

const encoded = encodeBase64('Hello, World!', { urlSafe: true });
const decoded = decodeBase64(encoded);
const isValid = isValidBase64(encoded);
const mimeType = getBase64MimeType('data:image/png;base64,iVBORw0KGgoA...');
```

### **File Processing**
```typescript
// Advanced file handling
interface FileProcessingResult extends Base64Result {
  fileInfo: {
    name: string;
    size: number;
    type: string;
    lastModified: Date;
  };
  dataUrl?: string;
  chunks?: string[];
}

class Base64FileProcessor {
  static async processFile(
    file: File, 
    options: {
      chunkSize?: number;
      generateDataUrl?: boolean;
      validateMimeType?: boolean;
    } = {}
  ): Promise<FileProcessingResult> {
    const { chunkSize = 1024 * 1024, generateDataUrl = false } = options;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const dataUrl = generateDataUrl ? event.target?.result as string : undefined;
        
        resolve({
          success: true,
          output: base64,
          inputType: 'file',
          outputType: 'base64',
          encoding: 'base64',
          metadata: {
            inputSize: file.size,
            outputSize: base64.length,
            compressionRatio: base64.length / file.size,
            isUrlSafe: false,
            hasPadding: base64.endsWith('=') || base64.endsWith('=='),
            processingTime: Date.now(),
            mimeType: file.type
          },
          fileInfo: {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified)
          },
          dataUrl
        });
      };
      
      reader.onerror = () => {
        reject({
          success: false,
          output: '',
          error: {
            type: 'file_error',
            message: 'Failed to read file',
            details: reader.error?.message
          }
        });
      };
      
      reader.readAsDataURL(file);
    });
  }
}
```

---

## 🎯 Locator Generator API

### **Interface Definition**
```typescript
interface LocatorResult {
  success: boolean;
  locators: GeneratedLocator[];
  statistics: DOMStatistics;
  recommendations: string[];
  error?: LocatorError;
}

interface GeneratedLocator {
  type: LocatorType;
  value: string;
  robustness: 'high' | 'medium' | 'low';
  specificity: number;
  isUnique: boolean;
  framework: TestFramework;
  code: string;
}

type LocatorType = 
  | 'id'
  | 'className'
  | 'tagName'
  | 'cssSelector'
  | 'xpath'
  | 'textContent'
  | 'attribute'
  | 'dataTestId';

type TestFramework = 
  | 'selenium'
  | 'playwright'
  | 'cypress'
  | 'webdriverio'
  | 'puppeteer';

interface DOMStatistics {
  totalElements: number;
  elementsWithId: number;
  elementsWithClass: number;
  elementsWithTestId: number;
  maxDepth: number;
  duplicateIds: string[];
  processingTime: number;
}

interface LocatorConfig {
  frameworks: TestFramework[];
  preferTestIds: boolean;
  generateXPath: boolean;
  maxResults: number;
  includeCodeExamples: boolean;
}
```

### **Usage Example**
```typescript
import { LocatorGenerator } from '@/tools/locator-generator';

// Initialize locator generator
const container = document.getElementById('locator-generator');
const generator = new LocatorGenerator(container, {
  frameworks: ['selenium', 'playwright', 'cypress'],
  preferTestIds: true,
  generateXPath: true,
  maxResults: 10
});

// Generate locators from HTML
const htmlContent = `
  <div class="form-container">
    <input id="username" type="text" placeholder="Enter username" />
    <button data-testid="login-btn" type="submit">Login</button>
  </div>
`;

const result = await generator.processInput(htmlContent);

if (result.success) {
  console.log('Generated locators:', result.locators);
  console.log('DOM statistics:', result.statistics);
  console.log('Recommendations:', result.recommendations);
  
  // Access specific locators
  const highRobustnessLocators = result.locators.filter(
    loc => loc.robustness === 'high'
  );
  
  // Get framework-specific code
  const playwrightLocators = result.locators.filter(
    loc => loc.framework === 'playwright'
  );
}

// Utility functions
import { 
  generateLocatorsForElement,
  validateLocatorUniqueness,
  calculateRobustnessScore,
  generateFrameworkCode
} from '@/tools/locator-generator/utils';

// Generate locators for specific element
const element = document.querySelector('#username');
const locators = generateLocatorsForElement(element, {
  includeXPath: true,
  preferDataAttributes: true
});

// Validate locator uniqueness
const isUnique = validateLocatorUniqueness('.login-form input[type="text"]', document);

// Generate framework-specific code
const playwrightCode = generateFrameworkCode(
  'css=.login-form input[type="text"]',
  'playwright',
  'click'
);
```

### **Framework Code Generation**
```typescript
// Framework-specific code generation
interface CodeTemplate {
  framework: TestFramework;
  action: string;
  template: string;
  imports: string[];
}

const codeTemplates: CodeTemplate[] = [
  {
    framework: 'playwright',
    action: 'click',
    template: `await page.locator('{{locator}}').click();`,
    imports: ['import { test, expect } from "@playwright/test";']
  },
  {
    framework: 'selenium',
    action: 'click',
    template: `driver.findElement(By.cssSelector("{{locator}}")).click();`,
    imports: ['from selenium.webdriver.common.by import By']
  },
  {
    framework: 'cypress',
    action: 'click',
    template: `cy.get('{{locator}}').click();`,
    imports: []
  }
];

class FrameworkCodeGenerator {
  static generate(
    locator: string,
    framework: TestFramework,
    action: string = 'click'
  ): string {
    const template = codeTemplates.find(
      t => t.framework === framework && t.action === action
    );
    
    if (!template) {
      throw new Error(`No template found for ${framework} ${action}`);
    }
    
    return template.template.replace('{{locator}}', locator);
  }

  static generateFullTest(
    locators: GeneratedLocator[],
    framework: TestFramework,
    testName: string
  ): string {
    const imports = this.getImports(framework);
    const testBody = this.generateTestBody(locators, framework);
    
    return `${imports.join('\n')}\n\n${testBody}`;
  }
}
```

---

## 🏗️ Tool Creation Guidelines

### **Creating a New Tool**

1. **Implement the Base Interface**
```typescript
export class MyCustomTool extends BaseTool {
  get name(): string { return 'My Custom Tool'; }
  get description(): string { return 'Description of what the tool does'; }
  get category(): ToolCategory { return 'conversion'; }
  get version(): string { return '1.0.0'; }

  async processInput(input: string): Promise<MyToolResult> {
    // Implementation
  }

  protected getTemplate(): string {
    // Return HTML template
  }

  protected attachEventListeners(): void {
    // Add event listeners
  }

  protected removeEventListeners(): void {
    // Clean up event listeners
  }
}
```

2. **Define Tool-Specific Types**
```typescript
interface MyToolResult {
  success: boolean;
  output: string;
  metadata: MyToolMetadata;
  error?: MyToolError;
}

interface MyToolMetadata {
  processingTime: number;
  inputSize: number;
  outputSize: number;
  // Tool-specific metadata
}

interface MyToolError {
  type: string;
  message: string;
  details?: string;
}
```

3. **Add Analytics Integration**
```typescript
// In your tool class
trackUsage(action: string, metadata?: Record<string, any>): void {
  trackEvent('tool_usage', {
    tool_name: this.name.toLowerCase().replace(/\s+/g, '_'),
    action_type: action,
    ...metadata
  });
}

// Usage examples
this.trackUsage('process_input', { input_size: input.length });
this.trackUsage('copy_output', { output_type: 'formatted' });
```

4. **Implement Error Handling**
```typescript
protected handleError(error: Error, context: string): MyToolError {
  const toolError: MyToolError = {
    type: this.categorizeError(error),
    message: error.message,
    details: error.stack
  };
  
  // Track error
  this.trackUsage('error', {
    error_type: toolError.type,
    context: context
  });
  
  // Display user-friendly error
  this.showErrorMessage(this.getUserFriendlyMessage(toolError));
  
  return toolError;
}
```

### **Testing Your Tool**

1. **Unit Tests**
```typescript
import { describe, it, expect } from 'vitest';
import { MyCustomTool } from '@/tools/my-custom-tool';

describe('MyCustomTool', () => {
  let tool: MyCustomTool;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    tool = new MyCustomTool(container);
  });

  it('should process valid input correctly', async () => {
    const result = await tool.processInput('valid input');
    expect(result.success).toBe(true);
    expect(result.output).toBeDefined();
  });

  it('should handle invalid input gracefully', async () => {
    const result = await tool.processInput('invalid input');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

2. **E2E Tests**
```typescript
import { test, expect } from '@playwright/test';

test.describe('My Custom Tool', () => {
  test('should complete user workflow', async ({ page }) => {
    await page.goto('/tools/my-custom-tool');
    
    // Test main functionality
    await page.fill('[data-testid="input"]', 'test input');
    await page.click('[data-testid="process"]');
    
    // Verify output
    await expect(page.locator('[data-testid="output"]')).toBeVisible();
    await expect(page.locator('[data-testid="copy-btn"]')).toBeEnabled();
  });
});
```

---

## 🔄 Common Patterns

### **Async Processing with Loading States**
```typescript
abstract class AsyncTool extends BaseTool {
  protected async processWithLoading<T>(
    processor: () => Promise<T>
  ): Promise<T> {
    this.setLoading(true);
    
    try {
      const result = await processor();
      this.setLoading(false);
      return result;
    } catch (error) {
      this.setLoading(false);
      throw error;
    }
  }

  protected setLoading(isLoading: boolean): void {
    this.setState({ isLoading });
    
    const loadingElement = this.container.querySelector('.loading');
    const processButton = this.container.querySelector('.process-btn') as HTMLButtonElement;
    
    if (loadingElement) {
      loadingElement.classList.toggle('hidden', !isLoading);
    }
    
    if (processButton) {
      processButton.disabled = isLoading;
      processButton.textContent = isLoading ? 'Processing...' : 'Process';
    }
  }
}
```

### **Input Validation**
```typescript
interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

class InputValidator<T> {
  private rules: ValidationRule<T>[] = [];

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): { isValid: boolean; errors: string[] } {
    const errors = this.rules
      .filter(rule => !rule.validate(value))
      .map(rule => rule.message);
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Usage
const jsonValidator = new InputValidator<string>()
  .addRule({
    validate: (value) => value.trim().length > 0,
    message: 'Input cannot be empty'
  })
  .addRule({
    validate: (value) => value.length <= 1000000,
    message: 'Input too large (max 1MB)'
  })
  .addRule({
    validate: (value) => {
      try { JSON.parse(value); return true; } 
      catch { return false; }
    },
    message: 'Invalid JSON format'
  });
```

### **Copy to Clipboard Functionality**
```typescript
class ClipboardManager {
  static async copy(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  static showCopySuccess(element: HTMLElement): void {
    const originalText = element.textContent;
    element.textContent = 'Copied!';
    element.classList.add('success');
    
    setTimeout(() => {
      element.textContent = originalText;
      element.classList.remove('success');
    }, 2000);
  }
}
```

---

**Ready to build your own tools? Check out the [Tool Creation Guide](../guides/CREATING_NEW_TOOLS.md) for step-by-step instructions.**

---

*Last updated: Version 0.6.0 - Complete Tools API Reference*