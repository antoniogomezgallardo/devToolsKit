# Online DevToolsKit 🛠️

Portal de herramientas online para desarrolladores, testers y DevOps. Rápido, minimalista y sin registro necesario.

🌐 **En vivo**: https://onlinedevtoolskit.com ✅ **LIVE**
🚀 **Status**: MVP con SEO optimizado completamente implementado
📊 **Analytics**: Google Analytics 4 activo con Core Web Vitals monitoring

## 🎯 Objetivo

Crear un sitio web con 15-20 utilidades online para desarrolladores que funcionen completamente en el navegador (client-side) con enfoque en:
- ⚡ Velocidad y rendimiento
- 🎨 Diseño minimalista y moderno
- 💰 Monetización con Google AdSense
- 🔍 SEO optimizado
- 📱 Responsive design

## 🚀 Stack Tecnológico

- **Frontend**: Parcel + TypeScript + Tailwind CSS
- **Build System**: Parcel v2.12.0 (optimizado para Vercel)
- **Hosting**: Vercel con dominio personalizado
- **Analytics**: Google Analytics 4 ✅ **Configurado** (ID: G-G8CSCGH4HS)
- **SEO**: Schema.org structured data, meta tags optimizados, sitemap.xml
- **Performance**: Core Web Vitals monitoring (LCP, FID, CLS, FCP, TTFB)
- **Monetización**: Google AdSense (listo para solicitar)
- **PWA**: Manifest.json configurado, service worker (futuro)
- **Version**: 0.6.0

## 🎉 Novedades v0.6.0

### ✨ Nuevas Herramientas
- **🔤 Base64 Encoder/Decoder**: Codificación/decodificación completa con soporte para archivos
- **🎯 Locator Generator**: Generador de selectores para automatización de testing

### 🧪 Testing & Calidad  
- **E2E Testing completo**: Playwright con coverage para todas las herramientas
- **CI/CD mejorado**: GitHub Actions con branch protection en main
- **Cross-browser testing**: Chrome, Firefox, Safari (Desktop & Mobile)

### 🚀 Claude Code Power User (NEW!)
- **🤖 Subagents Especializados**: tool-builder y e2e-tester para workflows automatizados
- **📝 Custom Commands**: `/new-tool` y `/test-complete` para desarrollo eficiente
- **📋 Plan Mode**: Exploración segura de código para implementaciones complejas
- **🔧 Workflow Automation**: Desde crear herramientas hasta testing completo

### 📚 Documentación
- **Documentación técnica completa**: Arquitectura, patrones y best practices  
- **Claude Code Power User Guide**: Guía completa de 35 páginas para usuarios avanzados
- **EXPLICACION_COMPLETA.md actualizado**: Context completo del proyecto
- **Testing guidelines**: Estrategias y coverage requirements

### ⚡ Performance
- **Build optimizado**: Parcel v2.12.0 con mejoras de velocidad
- **SEO enhanced**: Meta tags específicos por herramienta
- **Analytics mejorado**: Tracking detallado por herramienta

## 🛠️ Herramientas Implementadas

### ✅ Herramientas Implementadas
- [x] **Validador JSON** ✅ Validación de sintaxis con formato automático y detección de errores
- [x] **JWT Decoder** ✅ Decodificación completa con validación de firma y expiración
- [x] **Base64 Encoder/Decoder** ✅ Codificación/decodificación bidireccional con soporte para archivos
- [x] **Locator Generator** ✅ Generador de selectores para automatización de tests

### 🔄 En Desarrollo (Alta Prioridad)
- [ ] **Generador de contraseñas** 🔄 Próximo
- [ ] **Generador de paleta de colores** 🔄 Próximo

## 🚀 Claude Code Power User Features

### 🎯 Desarrollo Supercharged
DevToolsKit implementa **Claude Code Power User Phase 1** para desarrollo ultra-eficiente:

#### 🤖 Subagents Especializados
- **tool-builder**: Experto en crear herramientas DevToolsKit siguiendo todos los patrones establecidos
- **e2e-tester**: Especialista en testing E2E completo con Playwright y cross-browser testing

#### 📝 Custom Commands  
- **`/new-tool [nombre]`**: Workflow automatizado para crear herramientas completas con testing
- **`/test-complete`**: Ejecutar suite completa (TypeScript + Unit + E2E + Build + Coverage)

#### 📋 Plan Mode
- **Exploración segura**: Analizar código y planificar implementaciones sin modificaciones
- **Arquitectura planning**: Diseñar features complejas antes de implementar

### 🔧 Quick Start Power User

```bash
# Crear nueva herramienta con workflow completo
/new-tool Password Generator

# Ejecutar tests completos del proyecto  
/test-complete

# Usar subagent especializado
/agents tool-builder
> "Create a Color Palette Generator with export functionality"
```

### 📚 Documentación Completa
- **[Power User Guide](docs/CLAUDE_CODE_POWER_USER_GUIDE.md)**: Guía completa de 35 páginas
- **Phase 1 Implemented**: Foundation con subagents y commands esenciales
- **Phase 2 Planning**: SEO optimizer y documentation writer agents

## 🚀 Funcionalidades Destacadas

### 📋 JSON Validator
- **Validación en tiempo real** con resaltado de sintaxis
- **Formato automático** con indentación configurable 
- **Detección de errores** con línea y columna exacta
- **Ejemplos precargados** para testing rápido
- **Copy to clipboard** con un solo clic

### 🔐 JWT Decoder  
- **Decodificación completa** de header, payload y signature
- **Validación de expiración** con tiempo restante visual
- **Soporte Bearer tokens** con parsing automático
- **Verificación de formato** y estructura JWT
- **Información de algoritmo** y tipo de token

### 🔤 Base64 Encoder/Decoder
- **Codificación bidireccional** texto ↔ Base64
- **Soporte para archivos** (drag & drop)
- **URL-safe encoding** para aplicaciones web
- **Detección automática** de formato de entrada
- **Casos edge cubiertos** (caracteres especiales, Unicode)

### 🎯 Locator Generator
- **Múltiples tipos de selectores**: CSS, XPath, ID, Class
- **Generación inteligente** basada en estructura DOM
- **Optimización automática** de selectores
- **Validación en tiempo real** de selectores generados
- **Ideal para automatización** de tests (Selenium, Playwright, Cypress)

### Media Prioridad (Planeadas)
- [ ] Conversor JSON ↔ CSV ↔ YAML ↔ XML
- [ ] Simulador de códigos HTTP
- [ ] cURL Builder
- [ ] Hash Generator (MD5, SHA1, SHA256)
- [ ] QR Code Generator
- [ ] URL Shortener
- [ ] RegEx Tester
- [ ] Timestamp Converter
- [ ] Lorem Ipsum Generator
- [ ] CSS Beautifier/Minifier

## 🏗️ Estructura del Proyecto

```
devToolsKit/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── common/       # Componentes comunes (ToolCard)
│   │   ├── layout/       # Layout (Header, Footer)
│   │   └── ui/           # UI básicos (Button, Input, TextArea)
│   ├── tools/           # Herramientas individuales
│   │   ├── json-validator/      # JSON Validator implementado
│   │   ├── jwt-decoder/         # JWT Decoder implementado
│   │   ├── base64-encoder-decoder/ # Base64 Encoder/Decoder implementado
│   │   └── locator-generator/   # Locator Generator implementado
│   ├── utils/           # Utilidades y SEO
│   │   ├── analytics.ts    # Google Analytics 4 & tracking
│   │   ├── structuredData.ts  # Schema.org markup
│   │   ├── metaTags.ts     # Meta tags dinámicos
│   │   ├── sitemap.ts      # Sitemap generation
│   │   ├── performance.ts  # Core Web Vitals
│   │   └── constants.ts    # Configuración general
│   ├── config/          # Configuración analytics
│   ├── styles/          # Estilos CSS adicionales
│   └── types/           # Definiciones TypeScript
├── tests/               # Testing framework
│   ├── unit/           # Tests unitarios
│   ├── integration/    # Tests de integración
│   └── e2e/           # Tests end-to-end
├── .github/workflows/   # CI/CD con GitHub Actions
├── public/              # Archivos estáticos optimizados para SEO
│   ├── robots.txt       # Directivas para crawlers
│   ├── sitemap.xml      # Mapa del sitio optimizado
│   └── manifest.json    # PWA manifest
├── dist/                # Build de producción
└── docs/                # Documentación completa
```

## 🚦 Desarrollo Local

### Prerequisitos
- **Node.js** >= 20.19.0
- **npm** >= 10.x
- **Git** (para clonar el repositorio)

### 🚀 Instalación y Ejecución (Paso a Paso)

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/antoniogomezgallardo/devToolsKit.git
   cd devToolsKit
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   
4. **Abrir en el navegador:**
   - 🌐 **URL local**: http://localhost:1234
   - El servidor se recarga automáticamente al hacer cambios
   - Todas las herramientas funcionan localmente

### 🛠️ Comandos de Desarrollo

#### **Desarrollo:**
```bash
npm run dev          # 🚀 Servidor local en http://localhost:1234
```

#### **Build y Deploy:**
```bash
npm run build        # 📦 Build optimizado para producción
npm run vercel-build # ☁️ Build específico para Vercel
npm run preview      # 👀 Preview del build local
```

#### **Testing:**
```bash
# Unit Tests (Vitest)
npm run test         # 🧪 Ejecutar tests en modo watch
npm run test:run     # ✅ Ejecutar tests una vez
npm run test:coverage # 📊 Tests con reporte de coverage
npm run test:ui      # 🎨 UI visual para tests

# E2E Tests (Playwright)
npm run playwright:install  # 🎭 Instalar navegadores de Playwright
npm run test:e2e            # 🌐 Ejecutar tests E2E
npm run test:e2e:ui         # 🎨 E2E tests con UI
npm run test:e2e:headed     # 👀 E2E tests con navegador visible
```

### 🎭 E2E Testing Coverage
Comprehensive end-to-end testing para todas las herramientas implementadas:

**🏠 Homepage & Navigation:**
- Responsive design y navegación entre herramientas
- Verificación de enlaces y rutas
- SEO meta tags y structured data

**🔧 Herramientas Testadas:**
- **JSON Validator**: Validación, formato automático, detección de errores, copy to clipboard
- **JWT Decoder**: Decodificación, verificación de expiración, Bearer tokens, validación de seguridad  
- **Base64 Encoder/Decoder**: Encode/decode, archivos, URL-safe encoding, casos edge, copy functionality
- **Locator Generator**: Generación de selectores, múltiples tipos (CSS, XPath), copy to clipboard

**🌐 Cross-Browser Testing:**
- Chrome, Firefox, Safari (Desktop & Mobile)
- Responsive breakpoints (320px - 1920px)
- Touch interactions y keyboard navigation

#### **Verificación:**
```bash
npm run type-check   # 🔍 Verificar tipos TypeScript
```

### 🌟 Desarrollo Rápido

**Para empezar a desarrollar inmediatamente:**
```bash
git clone https://github.com/antoniogomezgallardo/devToolsKit.git
cd devToolsKit
npm install && npm run dev
# ¡Listo! Abre http://localhost:1234 en tu navegador
```

### 🔧 Solución de Problemas

**Si el servidor no inicia:**
- Verifica que Node.js >= 20.19.0: `node --version`
- Limpia node_modules: `rm -rf node_modules && npm install`
- Verifica que el puerto 1234 esté libre

**Si los tests fallan:**
- Ejecuta `npm run type-check` primero
- Verifica que todas las dependencias estén instaladas

## 📊 SEO y Performance

### Optimizaciones SEO Implementadas ✅
- **Google Analytics 4**: Tracking completo de eventos y Core Web Vitals
- **Schema.org Structured Data**: Organization, WebSite, SoftwareApplication
- **Meta Tags Dinámicos**: OpenGraph, Twitter Cards, canonical URLs
- **Sitemap.xml**: Estructura optimizada con changefreq y priorities
- **Robots.txt**: Directivas optimizadas para crawlers
- **PWA Manifest**: App icons y shortcuts configurados

### Core Web Vitals Monitoring
- **LCP (Largest Contentful Paint)**: <2.5s target
- **FID (First Input Delay)**: <100ms target  
- **CLS (Cumulative Layout Shift)**: <0.1 target
- **FCP (First Contentful Paint)**: <1.8s target
- **TTFB (Time to First Byte)**: <800ms target

### 📊 Métricas Actuales (v0.6.0)
- **✅ Lighthouse Score**: 95-98 (Desktop) | 90-95 (Mobile)  
- **✅ Core Web Vitals**: Todos en rango verde (LCP <2.5s, FID <100ms, CLS <0.1)
- **✅ GA4 Events**: 20+ eventos configurados con tracking por herramienta
- **✅ SEO Score**: 95-100 en todas las páginas principales
- **✅ Best Practices**: 100/100 en Lighthouse
- **✅ Accessibility**: 95-100 WCAG compliance

### 📈 Performance Achievements
- **Build Time**: <30s (optimizado con Parcel)
- **Bundle Size**: <500KB (gzipped) para toda la aplicación
- **First Load**: <1.5s en conexión 3G
- **E2E Test Suite**: 45+ tests ejecutándose en <3min

## 🔄 GitFlow

- `main`: Rama principal (producción)
- `develop`: Rama de desarrollo
- `feature/*`: Nuevas funcionalidades
- `release/*`: Preparación de releases
- `hotfix/*`: Correcciones urgentes

## 📈 Roadmap

### Fase 1: MVP ✅ **COMPLETADO**
- [x] Setup inicial del proyecto
- [x] **Deploy exitoso** con Parcel + Vercel
- [x] **Dominio personalizado** configurado
- [x] **JSON Validator** funcionando
- [x] Diseño responsivo implementado
- [x] GitFlow workflow implementado

### Fase 2: SEO Optimization ✅ **COMPLETADO**
- [x] **Google Analytics 4** con tracking completo
- [x] **Schema.org structured data** markup
- [x] **Meta tags dinámicos** y OpenGraph
- [x] **Sitemap.xml optimizado** y robots.txt
- [x] **Core Web Vitals monitoring** automático
- [x] **PWA manifest** configurado
- [ ] AdSense integración (listo para solicitar)

### Fase 3: Expansión (En Progreso)
- [x] **Testing Framework Completo** ✅ Unit + E2E + CI/CD + Branch Protection
- [x] **Base64 Encoder/Decoder** ✅ Implementado con testing E2E completo
- [x] **Locator Generator** ✅ Implementado para testing automation
- [x] **Comprehensive Documentation** ✅ Technical and architectural docs
- [ ] Generador de contraseñas  
- [ ] Generador de paleta de colores
- [ ] 4+ herramientas adicionales
- [ ] A/B testing
- [ ] Optimización conversión

## 🛡️ Política de Testing y Branches

### ⚠️ **OBLIGATORIO: Tests deben pasar antes de mergear a main**

**Branches protegidas:**
- `main`: Solo merge con PR + todos los tests ✅
- Requiere: Unit tests + E2E tests + Build + Type check

**Workflow de contribución:**
1. Crear rama desde `develop`
2. Desarrollar feature + tests
3. Push rama y **crear Pull Request** → develop
4. CI/CD se ejecuta automáticamente en PR
5. Code review (opcional pero recomendado)
6. Solo si todos los tests pasan → PR merge permitido ✅

**Tests requeridos:**
- 🧪 **Unit tests** (Vitest): Lógica de utilidades
- 🎭 **E2E tests** (Playwright): Flujo completo de usuario
- 🔍 **Type check**: Verificación TypeScript
- 🏗️ **Build test**: Verificar que compila correctamente

## 🤝 Contribución

Ver [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 Licencia

MIT License - Ver [LICENSE](./LICENSE)

## 📞 Contacto

- **Web**: https://onlinedevtoolskit.com
- **GitHub**: https://github.com/antoniogomezgallardo/devToolsKit
- **Status**: MVP Live y funcionando