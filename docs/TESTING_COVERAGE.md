# 🧪 Testing & Coverage Requirements

## 📋 Overview

DevToolsKit enforces strict testing and coverage requirements to ensure code quality and prevent regressions. This document outlines the testing standards and automated enforcement mechanisms.

## 🎯 Coverage Thresholds

### **Minimum Coverage Requirements:**
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

These thresholds are enforced automatically in:
- ✅ **Pre-commit hooks** (blocks commits that don't meet standards)
- ✅ **CI/CD pipeline** (blocks PR merges that don't meet standards)
- ✅ **Local development** (immediate feedback during development)

## 🚦 Automated Enforcement

### **1. Pre-commit Hooks**
Every commit is automatically checked for:
- TypeScript type safety
- Test coverage thresholds
- Test file existence for new tools

```bash
# Automatically runs before each commit
🔍 Running TypeScript type check...
🧪 Running unit tests with coverage check...
📊 Checking test coverage requirements...
✅ All pre-commit checks passed!
```

### **2. CI/CD Pipeline**
The GitHub Actions CI pipeline enforces:
- Unit test passage (230+ tests)
- E2E test passage (55+ tests)
- Coverage threshold compliance
- Build verification

### **3. Local Development Commands**
```bash
# Run tests with coverage enforcement
npm run test:coverage:check

# Run tests in watch mode for development
npm run test

# Generate detailed coverage report
npm run test:coverage
```

## 📁 Test Structure

### **Required Test Files for New Tools:**
```
src/tools/category/tool-name/
├── ToolName.ts           # Main implementation
├── utils.ts              # Utility functions
├── types.ts              # Type definitions
└── index.ts              # Export module

tests/unit/tools/
├── tool-name.test.ts     # ✅ REQUIRED: Unit tests

tests/e2e/
├── tool-name.spec.ts     # ✅ REQUIRED: E2E tests
```

### **Test Coverage Requirements by File Type:**
- **Utils files**: 90%+ coverage (business logic)
- **Component files**: 80%+ coverage (UI interactions)
- **Type files**: 100% coverage (type definitions)

## 🔧 Writing Effective Tests

### **Unit Tests (utils.ts)**
```typescript
// ✅ Good: Comprehensive test coverage
describe('generateHash', () => {
  it('should handle empty input', async () => {
    const result = await generateHash('');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Input cannot be empty');
  });

  it('should generate SHA-256 hash successfully', async () => {
    const result = await generateHash('test', { algorithm: 'sha256' });
    expect(result.success).toBe(true);
    expect(result.hash).toMatch(/^[a-f0-9]{64}$/);
  });

  // Test edge cases, error conditions, all algorithms, etc.
});
```

### **E2E Tests (Component.spec.ts)**
```typescript
// ✅ Good: User workflow testing
test.describe('Hash Generator Tool', () => {
  test('should generate hash for text input', async ({ page }) => {
    await page.goto('/');
    await page.click('text=🔐 Generador de Hash');

    await page.fill('#text-input', 'Hello World');
    await page.click('#generate-btn');

    await expect(page.locator('#hash-output')).not.toHaveValue('');
  });
});
```

## 📊 Coverage Reporting

### **Current Coverage Status:**
- **Hash Generator Utils**: 91.53% ✅
- **Password Generator Utils**: 95.62% ✅
- **Color Palette Utils**: 88.21% ✅
- **Base64 Utils**: 65.28% ⚠️ (needs improvement)
- **Overall Project**: 36.15% (includes untested UI components)

### **Coverage Report Access:**
```bash
# Generate HTML coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/index.html
```

## ⚡ Performance Standards

### **Test Execution Time:**
- **Unit Tests**: <30 seconds (230 tests)
- **E2E Tests**: <2 minutes (55+ tests)
- **Coverage Generation**: <10 seconds

### **Memory Usage:**
- Maximum test memory usage: 1GB
- Coverage report generation: <500MB

## 🚨 Failure Scenarios

### **Coverage Below Threshold:**
```bash
❌ Coverage threshold not met:
- Branches: 75% (minimum: 80%)
- Functions: 85% (minimum: 80%) ✅
- Lines: 78% (minimum: 80%)
- Statements: 79% (minimum: 80%)

💡 Add tests to increase coverage before committing
```

### **Missing Test Files:**
```bash
❌ Error: No test file found for src/tools/encoders/new-tool/NewTool.ts
💡 Please create tests in tests/unit/tools/ for new tools
💡 Expected pattern: tests/unit/tools/new-tool.test.ts
```

## 🔄 Continuous Improvement

### **Monthly Coverage Reviews:**
- Analyze coverage trends
- Identify untested code paths
- Update coverage thresholds as project matures
- Review test execution performance

### **Tool Integration:**
- **Codecov**: External coverage tracking
- **Vitest**: Test runner with built-in coverage
- **Playwright**: E2E testing framework
- **Husky**: Git hooks for pre-commit checks

## 📈 Best Practices

### **1. Test-Driven Development (TDD)**
```bash
# Recommended workflow:
1. Write failing test
2. Implement minimal code to pass
3. Refactor while maintaining green tests
4. Verify coverage meets thresholds
```

### **2. Coverage Quality > Quantity**
- Focus on testing business logic and edge cases
- Don't write tests just to hit coverage numbers
- Mock external dependencies appropriately
- Test error conditions and boundary cases

### **3. Maintenance**
- Update tests when refactoring code
- Remove obsolete tests for removed features
- Keep test code clean and readable
- Document complex test scenarios

## 🛠️ Troubleshooting

### **Common Issues:**

1. **"Coverage threshold not met"**
   - Run `npm run test:coverage` to see detailed report
   - Add tests for uncovered branches/functions
   - Consider if uncovered code is necessary

2. **"Test files missing for new tools"**
   - Create corresponding test files in tests/unit/tools/
   - Follow existing test patterns
   - Include both unit and E2E tests

3. **"Tests failing in CI but passing locally"**
   - Check Node.js version consistency
   - Verify dependencies are locked (package-lock.json)
   - Review CI environment differences

---

**🎯 Goal: Maintain 90%+ coverage for utils, 80%+ overall, with comprehensive E2E testing for all user workflows.**