# Create New DevToolsKit Tool 🛠️

Create a complete new developer tool following DevToolsKit patterns and best practices.

**Tool Name**: $ARGUMENTS

## 🎯 Mission
Use the specialized **Tool-Builder agent** to create a production-ready developer tool that seamlessly integrates with the DevToolsKit ecosystem.

## 🚀 Execution Plan

### Step 1: Activate Tool-Builder Agent
First, I'll activate the specialized Tool-Builder agent that knows all DevToolsKit patterns:

```
/agents tool-builder
```

### Step 2: Comprehensive Implementation
The Tool-Builder agent will handle:

1. **📁 Project Structure Analysis**:
   - Analyze existing tools for patterns
   - Understand current architecture and conventions
   - Review similar tool implementations

2. **🏗️ Complete Tool Creation**:
   - Create folder structure: `src/tools/$ARGUMENTS/`
   - Implement TypeScript classes following project patterns
   - Build responsive Tailwind UI matching existing design
   - Add proper TypeScript types and interfaces

3. **🧪 Complete Testing Implementation**:
   - **Unit Tests**: Create `tests/unit/tools/$ARGUMENTS.test.ts`
     - Test core utility functions and business logic
     - Test TypeScript interfaces and type safety
     - Test error handling and edge cases
     - Test data validation and transformation logic
   - **E2E Tests**: Create `tests/e2e/$ARGUMENTS.spec.ts`
     - Test complete user workflows
     - Test UI interactions and responsive behavior
     - Test copy functionality and accessibility
     - Test cross-browser compatibility

4. **📊 Analytics & SEO Integration**:
   - Add tool to `ToolNames` enum in `src/utils/analytics.ts`
   - Create tool-specific tracking functions
   - Update meta tags in `src/utils/metaTags.ts`
   - Ensure proper SEO optimization

5. **🔄 Main App Integration**:
   - Add tool to `TOOLS` array in `src/utils/constants.ts`
   - Add routing case in `src/main.ts`
   - Update import statements and navigation
   - Ensure proper tool card display on homepage

6. **📋 Quality Assurance**:
   - Follow GitFlow methodology (feature branch)
   - Run both unit and E2E test suites
   - Maintain 95+ Lighthouse score
   - Ensure cross-browser compatibility
   - Verify accessibility compliance

## ✅ Success Criteria

After completion, the new tool will have:
- ✅ Complete TypeScript implementation with strict typing
- ✅ Responsive UI matching DevToolsKit design system
- ✅ **Unit test coverage** for all utility functions and core logic
- ✅ **E2E test coverage** for complete user workflows
- ✅ GA4 analytics tracking integration
- ✅ SEO optimization with proper meta tags
- ✅ Homepage navigation integration
- ✅ Error handling for all edge cases
- ✅ Copy-to-clipboard functionality (where applicable)
- ✅ Performance optimization (95+ Lighthouse score)
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)

## 🧪 Testing Strategy
**Two-Layer Testing Approach**:

### Unit Tests (Vitest)
- Test pure functions and utilities in isolation
- Test data validation and transformation logic
- Test error handling and edge cases
- Fast execution for rapid development feedback

### E2E Tests (Playwright)
- Test complete user workflows end-to-end
- Test UI interactions and responsive design
- Test real browser behavior and compatibility
- Comprehensive integration testing

## 🎯 Example Tools to Reference
The Tool-Builder agent will study these existing patterns:
- **JSON Validator**: Text validation and formatting patterns
- **JWT Decoder**: Token parsing and security validation patterns
- **Base64 Encoder/Decoder**: Bidirectional conversion patterns
- **Locator Generator**: DOM selector generation patterns

## 🔄 GitFlow Compliance
The implementation will follow strict GitFlow methodology:
1. Create feature branch: `feature/tool-$ARGUMENTS`
2. Implement complete functionality with unit tests
3. Add comprehensive E2E test coverage
4. Run full test suite: `npm run test:run && npm run test:e2e`
5. Merge to develop following project standards

---

**Ready to build: $ARGUMENTS**

Let's create a world-class developer tool with bulletproof testing that exemplifies DevToolsKit's quality standards! 🚀