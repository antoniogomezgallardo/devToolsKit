# Online DevToolsKit 🛠️

Portal de herramientas online para desarrolladores, testers y DevOps. Rápido, minimalista y sin registro necesario.

🌐 **En vivo**: https://onlinedevtoolskit.com ✅ **LIVE**
🚀 **Status**: MVP Deployado con éxito

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
- **Analytics**: Google Analytics 4 (pendiente configuración)
- **Monetización**: Google AdSense (pendiente configuración)
- **PWA**: Service Worker para funcionalidad offline (futuro)
- **Version**: 0.1.1

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
│   ├── utils/           # Utilidades y constantes
│   ├── styles/          # Estilos CSS adicionales
│   └── types/           # Definiciones TypeScript
├── public/              # Archivos estáticos (robots.txt, sitemap.xml)
├── dist/                # Build de producción
└── docs/                # Documentación (CONTRIBUTING.md, ROADMAP.md)
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

## 📊 Métricas de Rendimiento

- **Lighthouse Score**: >95
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

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
- [x] SEO básico configurado

### Fase 2: Optimización (Semana 3-4)
- [ ] SEO completo
- [ ] Google Analytics
- [ ] AdSense integración
- [ ] PWA implementación

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