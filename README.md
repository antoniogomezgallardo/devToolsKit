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
- **Version**: 0.3.0

## 🛠️ Herramientas Implementadas

### Alta Prioridad
- [x] **Validador JSON** ✅ Implementado y funcionando
- [ ] **JWT Decoder** 🔄 Próximo
- [ ] **Base64 Encoder/Decoder** 🔄 Próximo 
- [ ] **Generador de contraseñas** 🔄 Próximo
- [ ] **Generador de paleta de colores** 🔄 Próximo

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
│   │   └── json-validator/  # JSON Validator implementado
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
├── public/              # Archivos estáticos optimizados para SEO
│   ├── robots.txt       # Directivas para crawlers
│   ├── sitemap.xml      # Mapa del sitio optimizado
│   └── manifest.json    # PWA manifest
├── dist/                # Build de producción
└── docs/                # Documentación completa
```

## 🚦 Desarrollo

### Prerequisitos
- Node.js >= 20.19.0
- npm >= 10.x

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev          # Servidor local con Parcel
```

### Build
```bash
npm run build        # Build optimizado para producción
npm run vercel-build # Build específico para Vercel
npm run preview      # Preview del build
```

### Verificación
```bash
npm run type-check   # Verificar tipos TypeScript
```

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

### Métricas Objetivo
- **Lighthouse Score**: >95
- **Performance Insights**: Automático con recomendaciones
- **GA4 Events**: 15+ eventos personalizados configurados

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

### Fase 3: Expansión (Mes 2)
- [ ] 10 herramientas adicionales
- [ ] A/B testing
- [ ] Optimización conversión
- [ ] Marketing content

## 🤝 Contribución

Ver [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 Licencia

MIT License - Ver [LICENSE](./LICENSE)

## 📞 Contacto

- **Web**: https://onlinedevtoolskit.com
- **GitHub**: https://github.com/antoniogomezgallardo/devToolsKit
- **Status**: MVP Live y funcionando