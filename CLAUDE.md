# 🤖 Claude Configuration - DevToolsKit

## ⚠️ CRITICAL: GitFlow Workflow is MANDATORY

### 🌊 GitFlow Rules (From CONTEXT.md)
```
main ────────●────────●  (Solo releases estables)
            /        /
develop ────●────●────●  (Rama principal de trabajo)
           /    /
feature/  ●────●        (Todas las nuevas features)
```

**Reglas estrictas del proyecto**:
- ✅ **SIEMPRE** trabajar en `develop`
- ✅ **SIEMPRE** crear `feature/*` para nuevas herramientas
- ✅ **NUNCA** commitear directamente a `main`
- ✅ **SIEMPRE** usar `release/*` para crear versiones
- ✅ Solo `hotfix/*` puede romper esta regla en emergencias

### 📋 GitFlow Commands Reference:
```bash
# ANY new work (features, docs, fixes)
git checkout develop
git pull origin develop
git checkout -b feature/descriptive-name

# Finish feature (RECOMMENDED: Use PR)
git push origin feature/descriptive-name
# Then create PR: feature/descriptive-name → develop
# After PR merge: git branch -d feature/descriptive-name

# Alternative: Direct merge (solo para cambios menores)
git checkout develop
git merge feature/descriptive-name --no-ff
git branch -d feature/descriptive-name
git push origin develop

# Create release (version bump)
git checkout develop
git checkout -b release/v1.x.x
# Update package.json AND README.md versions
git add . && git commit -m "release: bump version to v1.x.x"
git checkout main
git merge release/v1.x.x --no-ff
git tag -a v1.x.x -m "Release v1.x.x: description"
git checkout develop
git merge release/v1.x.x
git branch -d release/v1.x.x
git push origin main --tags
git push origin develop
```

### 🚨 NEVER FORGET:
- ❌ NO direct work on main/develop
- ❌ NO commits without feature branches  
- ❌ NO releases without version bump
- ❌ NO pushes without updating both branches

## 📊 Project Status (From CONTEXT.md)

### 🎯 Current State:
- **Version**: 0.3.0 (in package.json and README.md)
- **Hosting**: Vercel + Domain `onlinedevtoolskit.com`
- **Stack**: Parcel + TypeScript + Tailwind CSS
- **Analytics**: GA4 ID G-G8CSCGH4HS ✅ ACTIVE

### ✅ Phase 1: MVP - COMPLETED
- Setup proyecto base con Parcel + TypeScript + Tailwind
- GitFlow workflow implementado  
- Deploy exitoso en Vercel con dominio personalizado
- JSON Validator funcionando
- Layout responsivo completo
- Documentación actualizada

### ✅ Phase 2: SEO Optimization - COMPLETED  
- Google Analytics 4 con ID G-G8CSCGH4HS ✅
- Schema.org structured data para SEO técnico ✅
- Meta tags dinámicos con OpenGraph ✅
- Core Web Vitals monitoring automático ✅
- Sitemap.xml optimizado con robots.txt ✅
- PWA manifest configurado ✅
- Performance insights automáticos ✅

### 🎯 Phase 3: Expansión - CURRENT
- [x] **JWT Decoder** ✅ Implementado completamente
- [x] **Testing Framework** ✅ Vitest + GitHub Actions CI/CD
- [ ] Google Search Console submission
- [ ] Google AdSense aplicación (foundation lista)
- [ ] Base64 Encoder/Decoder, Password Gen, Color Palette
- [ ] WCAG 2.1 AA accessibility audit

### 🛠️ Technical Context:
- **Migration**: Migrado de Vite a Parcel v2.12.0 (deploy sin errores)
- **Monetization**: Google AdSense desde día 1 (SEO foundation READY)
- **Languages**: Español (interfaz y contenido)
- **Client-side**: Todo funciona en el navegador

## 🛠️ Development Commands

### 🚀 Local Development:
```bash
# Ejecutar servidor local
npm run dev          # Servidor en http://localhost:1234

# Quick setup para nuevos desarrolladores  
git clone https://github.com/antoniogomezgallardo/devToolsKit.git
cd devToolsKit && npm install && npm run dev
```

### Build & Test:
```bash
npm run build        # Production build
npm run type-check   # TypeScript verification
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
```

### SEO Tools Available:
- `src/utils/analytics.ts` - GA4 tracking
- `src/utils/structuredData.ts` - Schema.org markup
- `src/utils/metaTags.ts` - Dynamic meta tags
- `src/utils/performance.ts` - Core Web Vitals
- `src/utils/sitemap.ts` - Sitemap generation

## 🔄 When Context Resets

### Always Remember:
1. **Check current branch**: `git branch`
2. **Follow GitFlow**: Create feature branches
3. **Current version**: Check package.json
4. **SEO is implemented**: All utilities in src/utils/
5. **Phase 2 completed**: Ready for Phase 3

### Quick Status Check:
```bash
git status
git branch -a
npm run build
```

## 📝 Commit Message Format

```
type(scope): description

feat(tools): add JWT decoder tool
fix(analytics): resolve tracking issue  
docs(readme): update SEO section
release: bump version to v0.4.0
```

---

## 🧠 Context Reset Recovery

### When Claude context resets, ALWAYS:
1. **Read this file first**: `CLAUDE.md` 
2. **Check CONTEXT.md**: Full project context
3. **Verify current branch**: `git branch` (should be on `develop` or `feature/*`)
4. **Check project status**: 
   - Version 0.3.0 ✅
   - Phase 2 SEO completed ✅  
   - Ready for Phase 3 tools
5. **Remember GitFlow**: NEVER work directly on main/develop

### 🎯 Key Files to Reference:
- `CONTEXT.md` - Complete project context  
- `CONTRIBUTING.md` - Development guidelines
- `ROADMAP.md` - Project phases and status
- `README.md` - Current version and features
- `EXPLICACION_COMPLETA.md` - Stakeholder documentation

### 🔧 SEO Infrastructure Already Built:
- `src/utils/analytics.ts` - GA4 tracking functions
- `src/utils/structuredData.ts` - Schema.org markup  
- `src/utils/metaTags.ts` - Dynamic meta management
- `src/utils/performance.ts` - Core Web Vitals monitoring
- `src/utils/sitemap.ts` - Sitemap generation utilities

## 📊 Google Analytics - Nueva Herramienta Checklist

### ⚠️ IMPORTANTE: Cada nueva herramienta requiere actualizar GA4

**Para cada nueva herramienta, actualizar `src/utils/analytics.ts`:**

1. **Añadir en `ToolNames` (línea ~41-47)**:
   ```typescript
   NUEVA_HERRAMIENTA: 'nueva_herramienta'
   ```

2. **Añadir eventos específicos en `AnalyticsEvents` si necesarios**:
   ```typescript
   NUEVA_TOOL_SPECIFIC_EVENT: 'nueva_tool_specific_event',
   NUEVA_TOOL_SUCCESS: 'nueva_tool_success',
   NUEVA_TOOL_ERROR: 'nueva_tool_error'
   ```

3. **Crear función de tracking específica como `trackJSONValidator`**:
   ```typescript
   export const trackNuevaHerramienta = {
     action: (params: any) => {
       trackEvent(AnalyticsEvents.NUEVA_TOOL_SPECIFIC_EVENT, {
         tool_name: ToolNames.NUEVA_HERRAMIENTA,
         ...params
       });
     }
   }
   ```

4. **Implementar tracking en la herramienta**:
   ```typescript
   import { trackNuevaHerramienta, trackToolUsage } from '@/utils/analytics';
   
   // Al usar la herramienta
   trackToolUsage('nueva_herramienta', 'start');
   trackNuevaHerramienta.action({ /* params */ });
   ```

**🔄 El sistema base (`trackToolUsage`, `trackPageView`) ya funciona para cualquier herramienta sin cambios.**

## 🧪 Testing Strategy - IMPLEMENTADO ✅

### **Framework: Vitest + Testing Library**
- **Unit Tests**: `tests/unit/` - Utils y funciones puras
- **Integration Tests**: `tests/integration/` - Componentes completos
- **E2E Tests**: `tests/e2e/` - Flujos de usuario completos

### **CI/CD: GitHub Actions** ✅
- **Continuous Integration**: Tests automáticos en push/PR
- **Type Checking**: TypeScript verification automática
- **Build Verification**: Asegurar que el build funciona
- **Coverage Reports**: Reporte de cobertura automático

### **Commands Available**:
```bash
npm run test         # Tests en modo watch
npm run test:run     # Tests una vez 
npm run test:coverage # Tests con coverage
npm run test:ui      # UI visual para tests
```

### **Coverage Targets**:
- **Branches**: >80%
- **Functions**: >80%
- **Lines**: >80%
- **Statements**: >80%

### **¿Cuándo ejecutar tests?**
- **Antes de commit**: `npm run test:run && npm run test:e2e`
- **Al desarrollar**: `npm run test` (watch mode)
- **CI/CD**: Automático en GitHub Actions
- **Setup inicial**: `npm run playwright:install` (solo una vez)

## 🛡️ Branch Protection Policy - IMPLEMENTADO ✅

### **⚠️ CRITICAL: Tests son OBLIGATORIOS antes de mergear a main**

**GitHub Actions CI/CD configurado para:**
- **Unit Tests** (Vitest): Lógica de utilidades ✅
- **E2E Tests** (Playwright): Flujo completo usuario ✅  
- **Type Check**: Verificación TypeScript ✅
- **Build Test**: Compilación exitosa ✅

**Branch Protection Rules:**
- `main`: **PROTEGIDA** - Solo merge con PR + todos los tests ✅
- `develop`: Abierta para desarrollo, pero con CI/CD
- `feature/*`: CI/CD automático en push

**Workflow Enforced:**
1. Desarrollar en `feature/*` branch
2. Push branch y crear **Pull Request** → develop
3. CI/CD se ejecuta automáticamente en PR
4. **SI todos los tests pasan** → PR merge permitido ✅
5. **SI algún test falla** → PR merge BLOQUEADO ❌

**🔄 BEST PRACTICE: Usar Pull Requests para:**
- **Code review** antes de merge
- **CI/CD validation** automática  
- **Discusión** de cambios
- **Historial** claro de decisiones

**Tests E2E incluyen:**
- Homepage navigation y responsiveness
- JSON Validator: validación, errores, ejemplos, copy
- JWT Decoder: decodificación, expiración, Bearer tokens, seguridad
- Cross-browser testing (Chrome, Firefox, Safari, Mobile)

---

**🎯 CRITICAL: This project follows GitFlow religiously. Phase 2 (SEO Optimization) is COMPLETE. Ready for Phase 3 (Tool Expansion). Version 0.3.0 deployed to production.**