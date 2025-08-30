# DevToolsKit 🛠️

Portal de herramientas online para desarrolladores, testers y DevOps. Rápido, minimalista y sin registro necesario.

## 🎯 Objetivo

Crear un sitio web con 15-20 utilidades online para desarrolladores que funcionen completamente en el navegador (client-side) con enfoque en:
- ⚡ Velocidad y rendimiento
- 🎨 Diseño minimalista y moderno
- 💰 Monetización con Google AdSense
- 🔍 SEO optimizado
- 📱 Responsive design

## 🚀 Stack Tecnológico

- **Frontend**: Vite + TypeScript + Tailwind CSS
- **Hosting**: Vercel (recomendado) / Hostinger
- **Analytics**: Google Analytics 4
- **Monetización**: Google AdSense
- **PWA**: Service Worker para funcionalidad offline

## 🛠️ Herramientas Implementadas

### Alta Prioridad (Implementadas)
- [ ] Validador JSON
- [ ] JWT Decoder
- [ ] Generador de contraseñas
- [ ] Base64 Encoder/Decoder
- [ ] Generador de paleta de colores

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
│   ├── components/        # Componentes reutilizables
│   ├── tools/            # Herramientas individuales
│   ├── utils/            # Utilidades y helpers
│   ├── styles/           # Estilos globales
│   └── types/            # Definiciones TypeScript
├── public/               # Archivos estáticos
├── docs/                 # Documentación
└── tests/                # Tests unitarios
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
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
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

### Fase 1: MVP (Semana 1-2)
- [x] Setup inicial del proyecto
- [ ] 5 herramientas core
- [ ] Diseño responsivo básico
- [ ] Deploy inicial

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

- Web: [Pendiente dominio]
- Email: [Pendiente configurar]
- GitHub: [Este repositorio]