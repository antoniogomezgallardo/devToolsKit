# 🧪 Testing Strategy - DevToolsKit

## 📋 Overview

DevToolsKit utiliza una estrategia de testing completa con **Unit Tests** + **E2E Tests** + **CI/CD automático** + **Branch Protection**.

## 🏗️ Architecture Analysis: Why No Integration Tests?

**❌ NO necesitamos Integration Tests porque:**

- **Client-side only**: Todo funciona en el navegador, sin APIs o servicios externos
- **Simple architecture**: Cada herramienta es auto-contenida
- **No complex integrations**: No hay bases de datos, backend services, o third-party APIs críticas
- **Unit tests cover business logic**: Las utils están completamente cubiertas
- **E2E tests cover user flows**: Los flujos de usuario completos están cubiertos

**✅ SÍ necesitamos:**
- **Unit Tests**: Para lógica de negocio en utils (JWT decoding, JSON validation, etc.)
- **E2E Tests**: Para flujos completos de usuario y interacciones DOM reales

## 🛠️ Testing Stack

### Unit Testing: **Vitest + Testing Library**
- **Framework**: Vitest (más rápido que Jest)
- **Environment**: jsdom para DOM simulation
- **Mocking**: Built-in vi mocks
- **Coverage**: >80% threshold para branches, functions, lines, statements

### E2E Testing: **Playwright**
- **Cross-browser**: Chrome, Firefox, Safari
- **Mobile testing**: Pixel 5, iPhone 12
- **Visual regression**: Screenshots automáticos en fallos
- **Parallel execution**: Tests paralelos para velocidad

### CI/CD: **GitHub Actions**
- **Automated testing**: En push a main/develop y PRs
- **Branch protection**: Tests obligatorios para mergear
- **Parallel jobs**: Unit tests y E2E tests en paralelo

## 📁 Test Structure

```
tests/
├── unit/                    # Unit tests (Vitest)
│   └── tools/
│       ├── json-validator.test.ts
│       └── jwt-decoder.test.ts
├── e2e/                     # E2E tests (Playwright)
│   ├── homepage.spec.ts
│   ├── json-validator.spec.ts
│   └── jwt-decoder.spec.ts
└── setup.ts                # Global test configuration
```

## 🚀 Commands

### Setup (Solo una vez)
```bash
npm run playwright:install   # Instalar navegadores Playwright
```

### Unit Tests
```bash
npm run test                 # Modo watch para desarrollo
npm run test:run             # Ejecutar una vez
npm run test:coverage        # Con reporte de coverage
npm run test:ui              # UI visual para tests
```

### E2E Tests
```bash
npm run test:e2e             # Ejecutar todos los tests E2E
npm run test:e2e:ui          # E2E con UI visual
npm run test:e2e:headed      # E2E con navegador visible
```

#### Ejecutar Tests E2E Específicos
```bash
# Un archivo específico
npx playwright test homepage.spec.ts
npx playwright test json-validator.spec.ts
npx playwright test jwt-decoder.spec.ts

# Con proyecto específico (solo Chromium)
npx playwright test homepage.spec.ts --project=chromium

# Test específico por nombre
npx playwright test --grep "should load successfully"
npx playwright test --grep "SEO meta tags"

# Con interfaz visual para selección
npx playwright test --ui
npx playwright test json-validator.spec.ts --ui

# Para debugging (navegador visible)
npx playwright test homepage.spec.ts --headed
npx playwright test --grep "JWT" --headed --debug

# Con timeout personalizado
npx playwright test homepage.spec.ts --timeout=10000
```

### All Tests
```bash
npm run test:run && npm run test:e2e  # Todos los tests (recomendado antes de commit)
```

## 🧪 Test Coverage

### Current Coverage
- **JWT Decoder**: 17 unit tests + 8 E2E scenarios
- **JSON Validator**: 18 unit tests + 7 E2E scenarios  
- **Homepage**: 5 E2E scenarios
- **Cross-browser**: Tests en 5 dispositivos/navegadores

### What We Test

#### Unit Tests
- ✅ JWT decoding and validation logic
- ✅ JSON parsing and formatting logic  
- ✅ Error handling and edge cases
- ✅ Helper functions and utilities

#### E2E Tests
- ✅ Complete user flows (input → process → output)
- ✅ Navigation between tools
- ✅ Copy to clipboard functionality
- ✅ Form interactions and validation
- ✅ Mobile responsiveness
- ✅ Error states and feedback
- ✅ Example loading and clearing
- ✅ SEO meta tags and structure

## 🛡️ Branch Protection Policy

### ⚠️ MANDATORY: All Tests Must Pass Before Merge to Main

**Protected Branches:**
- `main`: **PROTECTED** - Only merge via PR + all tests ✅
- Requires: Unit tests + E2E tests + Build + Type check

**GitHub Actions Workflow:**
1. **Unit Tests Job**: Vitest tests + type checking
2. **E2E Tests Job**: Playwright tests (depends on unit tests)
3. **Build Job**: Production build verification (depends on both)

**If ANY test fails:**
- ❌ Merge is **BLOCKED**
- 🚫 PR cannot be merged
- 🔄 Must fix and re-run tests

## 📊 CI/CD Pipeline

### On Push/PR to main or develop:
```
1. 🧪 Unit Tests (Vitest)
   ├── TypeScript type check
   ├── Unit test execution  
   └── Coverage report

2. 🎭 E2E Tests (Playwright)
   ├── Install browsers
   ├── Start dev server
   ├── Run E2E tests
   └── Generate reports

3. 🏗️ Build Test
   ├── Production build
   └── Verify output
```

### Artifacts Generated:
- **Coverage Report**: Unit test coverage
- **Playwright Report**: E2E test results and screenshots
- **Build Assets**: Verified production build

## 🎯 Playwright E2E Testing Guide

### Ejecutar Tests Específicos

#### Por Archivo
```bash
# Ejecutar todos los tests de un archivo específico
npx playwright test homepage.spec.ts
npx playwright test json-validator.spec.ts  
npx playwright test jwt-decoder.spec.ts

# Solo en Chromium (más rápido para desarrollo)
npx playwright test homepage.spec.ts --project=chromium
```

#### Por Nombre de Test
```bash
# Buscar test por nombre parcial
npx playwright test --grep "should load successfully"
npx playwright test --grep "SEO meta tags"
npx playwright test --grep "JWT"

# Combinado con archivo específico
npx playwright test jwt-decoder.spec.ts --grep "decode valid JWT"
```

#### Modos de Ejecución

**🎨 Modo Visual (Recomendado para desarrollo):**
```bash
# UI interactiva para seleccionar y ejecutar tests
npx playwright test --ui

# UI para archivo específico
npx playwright test json-validator.spec.ts --ui
```

**🐛 Modo Debug:**
```bash
# Navegador visible para ver qué pasa
npx playwright test homepage.spec.ts --headed

# Debug paso a paso (pausa automáticamente)
npx playwright test --grep "navigation" --debug

# Con timeout personalizado (útil para debugging)
npx playwright test homepage.spec.ts --timeout=30000
```

**⚡ Modo Rápido:**
```bash
# Solo Chromium (configurado por defecto)
npx playwright test homepage.spec.ts

# Con timeout más corto
npx playwright test json-validator.spec.ts --timeout=5000
```

### Reportes y Debugging

#### Ver Reportes
```bash
# Ver último reporte HTML
npx playwright show-report

# Generar reporte después de ejecutar tests
npx playwright test --reporter=html
```

#### Screenshots y Videos
```bash
# Los screenshots automáticos se guardan en:
# test-results/[test-name]/test-failed-[n].png

# Los videos se guardan en:
# test-results/[test-name]/video.webm
```

### Ejemplos Prácticos

#### Desarrollo de Nueva Feature
```bash
# 1. Ejecutar test específico mientras desarrollas
npx playwright test --grep "should validate JSON" --headed

# 2. Ver en UI para iterar rápido
npx playwright test json-validator.spec.ts --ui

# 3. Test final antes de commit
npx playwright test json-validator.spec.ts
```

#### Debugging de Test Fallido
```bash
# 1. Ejecutar con navegador visible
npx playwright test --grep "failing-test-name" --headed

# 2. Debug paso a paso
npx playwright test --grep "failing-test-name" --debug

# 3. Ver reporte con screenshots
npx playwright show-report
```

#### Testing Cross-Browser (si habilitado)
```bash
# Todos los navegadores
npx playwright test homepage.spec.ts

# Solo Firefox
npx playwright test homepage.spec.ts --project=firefox

# Solo móvil
npx playwright test homepage.spec.ts --project="Mobile Chrome"
```

### Configuración Actual

El proyecto está configurado para ejecutar solo en **Chromium** por defecto para mayor velocidad:

```typescript
// playwright.config.ts
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  // Firefox, Safari y móviles comentados para velocidad
],
```

### Tips de Performance

**✅ Más Rápido:**
```bash
npx playwright test homepage.spec.ts  # Solo Chromium
```

**🐌 Más Lento:**
```bash
npx playwright test homepage.spec.ts --project=firefox --project=webkit
```

**🎯 Para CI/CD:**
```bash
npm run test:e2e  # Configuración optimizada para CI
```

## 🔧 Test Development Guidelines

### Writing Unit Tests
```typescript
// tests/unit/tools/example.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/tools/example/utils';

describe('Example Utils', () => {
  it('should handle valid input', () => {
    const result = myFunction('valid input');
    expect(result.isValid).toBe(true);
  });
});
```

### Writing E2E Tests
```typescript
// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test('should complete user flow', async ({ page }) => {
  await page.goto('/tools/example');
  await page.getByPlaceholder('Input...').fill('test data');
  await expect(page.getByText('Success')).toBeVisible();
});
```

## ✅ Best Practices

### Unit Tests
- ✅ Test business logic, not implementation details
- ✅ Use descriptive test names
- ✅ Test edge cases and error conditions
- ✅ Mock external dependencies (clipboard, analytics)
- ✅ Keep tests fast and isolated

### E2E Tests  
- ✅ Test complete user journeys
- ✅ Use semantic selectors (roles, labels)
- ✅ Test across different browsers and devices
- ✅ Include negative test cases
- ✅ Verify visual feedback and error states

### CI/CD
- ✅ Tests must be reliable (no flaky tests)
- ✅ Fast execution (parallel when possible)
- ✅ Clear error reporting
- ✅ Fail fast on critical errors

## 🚀 Adding Tests for New Tools

When implementing a new tool, always add:

### 1. Unit Tests
```bash
# Create test file
touch tests/unit/tools/new-tool.test.ts

# Test the utilities
- Input validation
- Core functionality  
- Error handling
- Edge cases
```

### 2. E2E Tests
```bash
# Create E2E test file
touch tests/e2e/new-tool.spec.ts

# Test user flows
- Happy path (input → output)
- Error scenarios
- Copy functionality
- Clear functionality
- Example loading
```

### 3. Update Documentation
- Add tool to this TESTING.md
- Update coverage stats
- Document any specific test considerations

## 📈 Continuous Improvement

### Coverage Goals
- **Unit Tests**: >80% for all metrics
- **E2E Tests**: 100% of user-facing functionality
- **Critical Paths**: 100% coverage for core tool functionality

### Performance Targets
- **Unit Tests**: <10 seconds total execution
- **E2E Tests**: <2 minutes total execution  
- **CI/CD Pipeline**: <5 minutes from push to completion

### Quality Metrics
- **Zero Flaky Tests**: Tests must be reliable
- **Fast Feedback**: Quick failure detection
- **Clear Reporting**: Easy to understand failures

---

## 🎯 Summary

DevToolsKit mantiene alta calidad de código mediante:
- **Comprehensive testing**: Unit + E2E coverage
- **Enforced quality gates**: Branch protection + CI/CD
- **Multi-browser support**: Cross-platform compatibility  
- **Fast feedback loops**: Quick test execution
- **Clear documentation**: Easy for contributors to understand

**Result**: Robust, reliable tools that work consistently for all users across all platforms.