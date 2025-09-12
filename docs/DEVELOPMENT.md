# 💻 Development Guide

**Complete guide to developing with DevToolsKit - workflows, patterns, and best practices.**

---

## 📋 Table of Contents

1. [Development Environment](#-development-environment)
2. [GitFlow Workflow](#-gitflow-workflow)  
3. [Code Standards](#-code-standards)
4. [Testing Strategy](#-testing-strategy)
5. [Tool Development](#-tool-development)
6. [Performance & SEO](#-performance--seo)
7. [Claude Code Integration](#-claude-code-integration)
8. [Deployment Process](#-deployment-process)

---

## 🛠️ Development Environment

### **Tech Stack**
- **Build System**: Parcel v2.12.0 (zero-config bundling)
- **Frontend**: TypeScript + Tailwind CSS + Vanilla JS
- **Testing**: Vitest (unit) + Playwright (E2E)
- **CI/CD**: GitHub Actions with branch protection
- **Hosting**: Vercel with custom domain
- **Analytics**: Google Analytics 4 with Core Web Vitals

### **Development Commands**
```bash
# Development
npm run dev              # Start dev server (http://localhost:1234)
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Unit tests (watch mode)
npm run test:run         # Unit tests (single run)
npm run test:e2e         # E2E tests
npm run test:coverage    # Coverage report
npm run type-check       # TypeScript validation

# Quality Assurance
npm run test-complete    # Run complete test suite
```

### **IDE Setup**
```json
// .vscode/settings.json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript"
  },
  "claude.code.autoSuggestAgents": true,
  "claude.code.defaultMode": "plan"
}
```

---

## 🌊 GitFlow Workflow

DevToolsKit follows **strict GitFlow methodology**:

### **Branch Structure**
```
main ──────●──────●     # Production releases only
          /      /
develop ──●──●──●──●     # Main development branch
         /  /
feature/●─●            # All new development
```

### **Branch Rules** ⚠️ **MANDATORY**
- ✅ **ALWAYS** start from `develop`  
- ✅ **ALWAYS** create `feature/*` branches for ANY changes
- ❌ **NEVER** commit directly to `main` or `develop`
- ✅ **ALWAYS** use PR workflow for `main` merges

### **Daily Workflow**
```bash
# 1. Start new work
git checkout develop
git pull origin develop
git checkout -b feature/descriptive-name

# 2. Develop and test
npm run dev                    # Development
npm run test                   # Testing
git add . && git commit -m "feat: description"

# 3. Push and create PR
git push origin feature/descriptive-name
# Create PR: feature/descriptive-name → develop

# 4. After PR merge, cleanup
git checkout develop
git pull origin develop
git branch -d feature/descriptive-name
```

### **Release Workflow**
```bash
# 1. Create release branch
git checkout develop
git checkout -b release/v0.7.0

# 2. Update version numbers
npm version 0.7.0 --no-git-tag-version
# Update README.md, CLAUDE.md versions

# 3. Test and finalize
npm run test-complete
git commit -m "release: bump version to v0.7.0"

# 4. Merge to main
git checkout main
git merge release/v0.7.0 --no-ff
git tag -a v0.7.0 -m "Release v0.7.0"

# 5. Merge back to develop
git checkout develop
git merge release/v0.7.0
git push origin main --tags
git push origin develop
```

**See [GitFlow Reference](workflows/GITFLOW_REFERENCE.md) for complete details.**

---

## 📏 Code Standards

### **TypeScript Guidelines**
```typescript
// Always use strict types
interface ToolConfig {
  name: string;
  description: string;
  category: 'validation' | 'conversion' | 'generation';
}

// Use descriptive names
const validateJSONInput = (input: string): ValidationResult => {
  // Implementation
};

// Export/import patterns
export { validateJSONInput };
export type { ToolConfig };
```

### **File Organization**
```
src/tools/my-tool/
├── index.ts           # Public API exports
├── MyTool.ts          # Main component class
├── utils.ts           # Tool-specific utilities  
├── types.ts           # TypeScript interfaces
└── examples.ts        # Sample data for testing
```

### **CSS/Tailwind Standards**
```typescript
// Use consistent utility patterns
const containerClasses = [
  'max-w-4xl',
  'mx-auto', 
  'p-6',
  'bg-white',
  'dark:bg-gray-800',
  'rounded-lg',
  'shadow-md'
].join(' ');

// Responsive design first
const buttonClasses = [
  'px-4 py-2',                    // Base padding
  'sm:px-6 sm:py-3',             // Small screens+
  'bg-blue-600 hover:bg-blue-700', // Colors
  'text-white font-semibold',     // Typography
  'rounded-md transition-colors', // Effects
  'disabled:opacity-50'           // States
].join(' ');
```

### **Component Patterns**
```typescript
// Tool component structure
export class MyTool {
  private container: HTMLElement;
  private config: ToolConfig;

  constructor(container: HTMLElement, config: ToolConfig) {
    this.container = container;
    this.config = config;
    this.init();
  }

  private init(): void {
    this.render();
    this.attachEventListeners();
    this.trackPageView();
  }

  private render(): void {
    // Render implementation
  }

  private attachEventListeners(): void {
    // Event handling
  }

  private trackPageView(): void {
    trackPageView(`/tools/${this.config.name}`);
  }
}
```

---

## 🧪 Testing Strategy

### **Testing Philosophy**
- **Unit Tests**: Business logic and utilities (>80% coverage)
- **E2E Tests**: Complete user workflows
- **Integration Tests**: Component interactions
- **Performance Tests**: Core Web Vitals validation

### **Unit Testing (Vitest)**
```typescript
// tests/unit/tools/my-tool.test.ts
import { describe, it, expect } from 'vitest';
import { validateInput, formatOutput } from '@/tools/my-tool/utils';

describe('MyTool Utils', () => {
  describe('validateInput', () => {
    it('should validate correct input format', () => {
      const result = validateInput('valid-input');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid input format', () => {
      const result = validateInput('invalid-input');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid format');
    });
  });

  describe('formatOutput', () => {
    it('should format output correctly', () => {
      const result = formatOutput({ data: 'test' });
      expect(result).toMatchSnapshot();
    });
  });
});
```

### **E2E Testing (Playwright)**
```typescript
// tests/e2e/my-tool.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My Tool', () => {
  test('should complete full user workflow', async ({ page }) => {
    // Navigate to tool
    await page.goto('/');
    await page.click('[data-testid="my-tool-card"]');
    
    // Verify page loaded
    await expect(page).toHaveTitle(/My Tool/);
    await expect(page.locator('h1')).toContainText('My Tool');
    
    // Test main functionality
    await page.fill('[data-testid="input-textarea"]', 'test input');
    await page.click('[data-testid="process-button"]');
    
    // Verify output
    await expect(page.locator('[data-testid="output-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="output-textarea"]')).toHaveValue('expected output');
    
    // Test copy functionality
    await page.click('[data-testid="copy-button"]');
    // Verify copy success message
  });

  test('should handle error cases gracefully', async ({ page }) => {
    // Test error scenarios
  });

  test('should work on mobile', async ({ page }) => {
    // Mobile-specific testing
  });
});
```

### **Test Organization**
```bash
tests/
├── unit/                    # Unit tests
│   └── tools/              # Tool-specific unit tests
├── e2e/                    # End-to-end tests
│   ├── homepage.spec.ts    # Homepage functionality
│   └── tools/              # Tool-specific E2E tests
└── fixtures/               # Test data and utilities
```

**See [Testing Strategy Guide](guides/TESTING_STRATEGY.md) for complete testing approach.**

---

## 🛠️ Tool Development

### **Tool Creation Process**

#### **Method 1: Claude Code Power User (Recommended)**
```bash
# Complete tool creation with automation
/new-tool Password Generator

# This automatically:
# 1. Creates complete file structure
# 2. Implements TypeScript classes
# 3. Adds Tailwind UI components
# 4. Creates unit and E2E tests
# 5. Updates analytics tracking
# 6. Updates routing and navigation
```

#### **Method 2: Manual Creation**
```bash
# 1. Create tool directory
mkdir src/tools/password-generator
cd src/tools/password-generator

# 2. Create base files
touch index.ts PasswordGenerator.ts utils.ts types.ts examples.ts

# 3. Implement following patterns from existing tools
# 4. Add tests in tests/unit/tools/ and tests/e2e/
# 5. Update src/utils/constants.ts with new tool
# 6. Update main.ts routing
```

### **Tool Implementation Pattern**
```typescript
// src/tools/password-generator/index.ts
export { PasswordGenerator } from './PasswordGenerator';
export type * from './types';

// src/tools/password-generator/types.ts  
export interface PasswordConfig {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

export interface PasswordResult {
  password: string;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  entropy: number;
}

// src/tools/password-generator/PasswordGenerator.ts
import { trackToolUsage, trackPasswordGenerator } from '@/utils/analytics';

export class PasswordGenerator {
  private container: HTMLElement;
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    this.render();
    this.attachEventListeners();
    trackToolUsage('password_generator', 'start');
  }

  private render(): void {
    // Implement UI rendering
  }

  private generatePassword(config: PasswordConfig): PasswordResult {
    // Implementation
    trackPasswordGenerator.generation({
      length: config.length,
      complexity: this.calculateComplexity(config)
    });
  }
}
```

### **Required Integrations**
Every tool must include:

1. **Analytics Tracking**
```typescript
// Track tool usage
trackToolUsage('tool_name', 'start');
trackToolUsage('tool_name', 'complete');

// Track tool-specific events  
trackToolName.action({ type: 'process_input' });
```

2. **SEO Optimization**
```typescript
// Update meta tags
updateMetaTags({
  title: 'Tool Name - DevToolsKit',
  description: 'Tool description for SEO'
});

// Add structured data
addToolStructuredData('Tool Name', 'Tool description');
```

3. **Error Handling**
```typescript
try {
  // Tool logic
} catch (error) {
  trackToolName.error(error.message);
  showErrorMessage('User-friendly error message');
}
```

**See [Creating New Tools Guide](guides/CREATING_NEW_TOOLS.md) for step-by-step instructions.**

---

## ⚡ Performance & SEO

### **Performance Requirements**
- **Lighthouse Score**: >95 (all categories)
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Bundle Size**: <500KB total (gzipped)
- **First Load**: <1.5s on 3G connection

### **Performance Best Practices**
```typescript
// Lazy loading for heavy components
const loadTool = async (toolName: string) => {
  const { Tool } = await import(`./tools/${toolName}`);
  return new Tool(container);
};

// Efficient event handling
const debounce = (fn: Function, delay: number) => {
  let timeoutId: number;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
};

// Memory management
class ToolManager {
  private tools = new Map<string, Tool>();
  
  cleanupTool(toolName: string): void {
    const tool = this.tools.get(toolName);
    tool?.destroy();
    this.tools.delete(toolName);
  }
}
```

### **SEO Implementation**
```typescript
// Dynamic meta tags for each tool
const updateToolMeta = (toolName: string, description: string) => {
  updateMetaTags({
    title: `${toolName} - DevToolsKit`,
    description: `${description}. Free online tool, no registration required.`,
    canonical: `https://onlinedevtoolskit.com/tools/${toolName}`,
    ogImage: `/images/tools/${toolName}-preview.png`
  });
};

// Structured data for tools
const addToolStructuredData = (name: string, description: string) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${name} - DevToolsKit`,
    description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
  
  addStructuredData(structuredData);
};
```

**See [Performance Optimization Guide](guides/PERFORMANCE_OPTIMIZATION.md) and [SEO Guide](guides/SEO_OPTIMIZATION.md).**

---

## 🤖 Claude Code Integration

DevToolsKit leverages Claude Code Power User features for supercharged development:

### **Available Agents**
```bash
# Specialized agents for different tasks
/agents tool-builder      # Tool creation and implementation
/agents e2e-tester        # E2E testing specialist  
/agents seo-optimizer     # Performance and SEO expert
/agents docs-writer       # Documentation specialist
```

### **Custom Commands**
```bash
# Development workflow commands
/new-tool [name]          # Create complete new tool
/test-complete            # Run full test suite
/release-prep [version]   # Prepare release
/update-analytics [tool]  # Add GA4 tracking
```

### **Advanced Workflows**
```bash
# Complete feature development pipeline
/new-tool URL Shortener
/agents seo-optimizer "optimize for search engines"
/test-complete
/agents docs-writer "create documentation"

# Performance optimization workflow
/agents seo-optimizer "audit Core Web Vitals"
/agents tool-builder "implement optimization recommendations"
/agents e2e-tester "add performance tests"
```

### **Configuration**
```json
// .claude/settings.json
{
  "permission-mode": "plan",
  "power-user-features": {
    "agents": {
      "enabled": true,
      "default-agents": ["tool-builder", "e2e-tester", "seo-optimizer", "docs-writer"],
      "auto-suggest": true
    },
    "commands": {
      "enabled": true,
      "project-commands": ["new-tool", "test-complete", "release-prep", "update-analytics"]
    }
  }
}
```

**See [Power User Guide](CLAUDE_CODE_POWER_USER_GUIDE.md) for complete Claude Code features.**

---

## 🚀 Deployment Process

### **Environments**
- **Development**: Local (http://localhost:1234)
- **Staging**: Vercel preview deployments  
- **Production**: https://onlinedevtoolskit.com

### **Automatic Deployment**
```bash
# Production deployment (automatic)
git push origin main       # Triggers Vercel production deploy

# Preview deployment (automatic)
git push origin feature/*  # Triggers Vercel preview deploy
```

### **Manual Deployment**
```bash
# Using Vercel CLI
vercel --prod              # Deploy to production
vercel                     # Deploy to preview
```

### **Pre-deployment Checklist**
```bash
# Quality assurance
npm run test-complete      # All tests must pass
npm run build              # Production build must succeed

# Performance validation
# - Lighthouse score >95
# - Bundle size analysis
# - Core Web Vitals check

# SEO validation
# - Meta tags updated
# - Structured data correct
# - Sitemap updated
```

**See [Deployment Guide](workflows/DEPLOYMENT_GUIDE.md) for complete deployment procedures.**

---

## 🔧 Development Tools

### **Debugging**
```bash
# TypeScript debugging
npm run type-check

# Test debugging
npm run test -- --reporter=verbose
npm run test:e2e -- --debug

# Build analysis
npm run build
npx bundlesize
```

### **Performance Monitoring**
```typescript
// Client-side performance tracking
const trackPerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    trackEvent('performance', {
      page_load_time: navigation.loadEventEnd - navigation.loadEventStart,
      dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
    });
  }
};
```

### **Analytics Validation**
```bash
# GA4 Debug Mode (in browser console)
gtag('config', 'G-G8CSCGH4HS', { debug_mode: true });

# Test analytics events
gtag('event', 'test_event', { tool_name: 'test' });
```

---

## 📊 Quality Metrics

### **Code Quality**
- **TypeScript**: Strict mode enabled
- **Test Coverage**: >80% for all tools
- **E2E Coverage**: 100% user workflows
- **Performance**: Lighthouse >95

### **Development Metrics**
- **Build Time**: <30 seconds
- **Test Suite**: <3 minutes total
- **Hot Reload**: <1 second
- **Bundle Analysis**: Automated size monitoring

### **Monitoring**
- **Core Web Vitals**: Real user monitoring via GA4
- **Error Tracking**: JavaScript errors captured
- **Performance**: Lighthouse CI on every deploy
- **Usage Analytics**: Tool-specific usage patterns

---

## 🚨 Common Issues & Solutions

### **Development Issues**
```bash
# Port conflicts
lsof -ti:1234 | xargs kill -9
npm run dev -- --port 3000

# Node version issues  
nvm use 20.19.0

# Cache issues
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Testing Issues**
```bash
# Playwright browser issues
npm run playwright:install

# Test timeouts
npm run test:e2e -- --timeout=60000

# Flaky tests
npm run test:e2e -- --repeat-each=3
```

### **Build Issues**
```bash
# TypeScript errors
npm run type-check

# Missing dependencies
npm install --save-dev @types/missing-type

# Bundle size issues
npx webpack-bundle-analyzer dist/
```

**See [Troubleshooting Guide](workflows/TROUBLESHOOTING.md) for comprehensive issue resolution.**

---

## 📞 Getting Help

### **Documentation**
- **[Architecture](ARCHITECTURE.md)** - Technical architecture details
- **[API Documentation](api/)** - Tool APIs and interfaces  
- **[Guides](guides/)** - Step-by-step implementation guides

### **Community**
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Architecture and design discussions
- **Claude Code Community** - Power user tips and tricks

### **Direct Support**
- **Setup Issues** - Check [Getting Started](GETTING_STARTED.md)
- **Development Questions** - Use GitHub Discussions
- **Bug Reports** - Use GitHub Issues with templates

---

**Ready to build amazing developer tools? Start with your [first tool creation](guides/CREATING_NEW_TOOLS.md)! 🚀**

---

*Last updated: Version 0.6.0 - Phase 3 Enhanced Development Guide*