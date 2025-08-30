# Guía de Contribución - DevToolsKit

## 🤝 Cómo Contribuir

¡Gracias por tu interés en contribuir a DevToolsKit! Este proyecto busca ser el mejor portal de herramientas para desarrolladores en español.

## 🚀 Inicio Rápido

### 1. Fork y Clone
```bash
git clone https://github.com/[tu-usuario]/devToolsKit.git
cd devToolsKit
npm install
```

### 2. Crear rama de feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nueva-herramienta
```

## 🌊 GitFlow Workflow

### Estructura de Ramas
```
main ─────────────●─────────●─────────●  (Production releases)
                 /         /         /
develop ────●────●────●────●────●────●    (Integration branch)
           /         /         /
feature/  ●─────────●         /          (New features)
release/        ●─────────────●          (Release preparation)  
hotfix/              ●───●               (Critical production fixes)
```

### 🎯 Tipos de Rama

#### `main` - Producción
- **Propósito**: Solo releases estables
- **Protegida**: Requiere PR review
- **Deploy**: Automático a producción
- **Merge desde**: `release/*` y `hotfix/*`

#### `develop` - Desarrollo Principal  
- **Propósito**: Integración continua de features
- **Estado**: Siempre funcional pero puede ser inestable
- **Merge desde**: `feature/*`
- **Merge hacia**: `release/*`

#### `feature/*` - Nuevas Funcionalidades
- **Nomenclatura**: `feature/jwt-decoder`, `feature/base64-tool`
- **Origen**: Se crean desde `develop`
- **Destino**: Se mergean a `develop`
- **Duración**: Corta (1-3 días máximo)

#### `release/*` - Preparación de Release
- **Nomenclatura**: `release/v0.2.0`
- **Propósito**: Estabilización y testing final
- **Origen**: Se crean desde `develop`
- **Destino**: Se mergean a `main` y `develop`

#### `hotfix/*` - Correcciones Críticas
- **Nomenclatura**: `hotfix/fix-json-parser`
- **Propósito**: Bugs críticos en producción
- **Origen**: Se crean desde `main`
- **Destino**: Se mergean a `main` y `develop`

### 🚀 Workflows Prácticos

#### Desarrollar Nueva Feature
```bash
# 1. Asegurarse de estar en develop actualizado
git checkout develop
git pull origin develop

# 2. Crear rama de feature
git checkout -b feature/jwt-decoder

# 3. Desarrollar la feature
# ... hacer cambios, commits, etc.

# 4. Finalizar feature
git checkout develop
git pull origin develop  # Por si hay cambios nuevos
git merge feature/jwt-decoder
git push origin develop
git branch -d feature/jwt-decoder  # Limpiar rama local
```

#### Crear Release
```bash
# 1. Desde develop, crear rama de release
git checkout develop
git pull origin develop
git checkout -b release/v0.2.0

# 2. Hacer ajustes finales (version bump, changelog, etc.)
# 3. Merge a main
git checkout main
git pull origin main
git merge release/v0.2.0
git tag v0.2.0
git push origin main --tags

# 4. Merge de vuelta a develop
git checkout develop
git merge release/v0.2.0
git push origin develop
git branch -d release/v0.2.0
```

#### Hotfix Crítico
```bash
# 1. Desde main, crear hotfix
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. Hacer fix mínimo
# ... commit del fix

# 3. Merge a main
git checkout main
git merge hotfix/critical-bug
git tag v0.1.2  # Bump patch version
git push origin main --tags

# 4. Merge a develop también
git checkout develop
git merge hotfix/critical-bug
git push origin develop
git branch -d hotfix/critical-bug
```

### 3. Desarrollo
```bash
npm run dev  # Servidor de desarrollo con Parcel
```

### 4. Testing y Verificación
```bash
npm run type-check  # Verificación TypeScript
npm run build       # Verificar que el build funciona
# Nota: Tests unitarios y linting pendientes de implementar
```

## 📁 Estructura de Archivos

### Añadir Nueva Herramienta
```
src/tools/mi-herramienta/
├── MiHerramienta.ts  # Componente principal
├── utils.ts          # Lógica de la herramienta (opcional)
└── types.ts          # Tipos TypeScript (opcional)

# Ejemplo actual:
src/tools/json-validator/
├── JSONValidator.ts  # Componente principal
└── utils.ts          # Funciones de validación
```

### Estructura Completa del Proyecto
```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Input, TextArea)
│   ├── layout/          # Layout components (Header, Footer)
│   └── common/          # Componentes compartidos (ToolCard)
├── tools/               # Herramientas individuales
│   └── json-validator/  # Ejemplo implementado
├── utils/               # Utilidades SEO y funcionales
│   ├── analytics.ts     # Google Analytics 4 & tracking
│   ├── structuredData.ts # Schema.org markup
│   ├── metaTags.ts      # Meta tags dinámicos
│   ├── sitemap.ts       # Sitemap generation
│   ├── performance.ts   # Core Web Vitals
│   └── constants.ts     # Configuración general
├── config/              # Configuración analytics y SEO
└── types/               # Definiciones TypeScript
```

## 🔍 Utilidades SEO Implementadas

### Google Analytics 4
```typescript
// En tu herramienta, usar para tracking
import { trackToolUsage, trackEvent } from '../../utils/analytics';

// Ejemplo de uso en tu herramienta
trackToolUsage('mi-herramienta', 'start', { input_length: input.length });
trackToolUsage('mi-herramienta', 'success', { output_length: result.length });
trackEvent('custom_event', { tool_name: 'mi-herramienta', action: 'convert' });
```

### Meta Tags Dinámicos
```typescript
// Añadir configuración en src/utils/metaTags.ts
export const PAGE_META_CONFIG = {
  "/tools/mi-herramienta": {
    title: "Mi Herramienta Online - DevToolsKit",
    description: "Descripción SEO optimizada de mi herramienta",
    keywords: "mi herramienta, convertir, online",
    canonical: "https://onlinedevtoolskit.com/tools/mi-herramienta"
  }
};
```

### Schema.org Structured Data
```typescript
// Añadir en src/utils/structuredData.ts
export const getMiHerramientaSchema = (): SoftwareApplication => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Mi Herramienta Online",
  description: "Descripción de la herramienta para schema.org",
  url: "https://onlinedevtoolskit.com/tools/mi-herramienta",
  // ... resto de propiedades
});
```

### Core Web Vitals (Automático)
- Los Core Web Vitals se rastrean automáticamente
- Performance insights se generan automáticamente  
- No requiere configuración adicional por herramienta

## 🛠️ Estándares de Código

### TypeScript
```typescript
// ✅ Bien
interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
}

// ❌ Mal
const config = {
  id: "json-validator",
  name: "JSON Validator"  // Falta tipo
};
```

### Naming Conventions
```typescript
// Componentes: PascalCase
export const JsonValidator: React.FC = () => {};

// Funciones: camelCase
const validateJson = (input: string): boolean => {};

// Constantes: SNAKE_CASE
const MAX_FILE_SIZE = 1024 * 1024;

// Archivos: kebab-case
json-validator.ts
my-component.tsx
```

### CSS/Tailwind
```html
<!-- ✅ Bien: Clases ordenadas -->
<div class="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">

<!-- ❌ Mal: Clases desordenadas -->
<div class="bg-white p-4 flex shadow-md rounded-lg justify-center items-center">
```

## 📋 Checklist para Nueva Herramienta

### Funcionalidad
- [ ] **Input validation**: Valida entradas del usuario
- [ ] **Error handling**: Manejo graceful de errores
- [ ] **Edge cases**: Considera casos límite
- [ ] **Performance**: Optimizada para archivos grandes
- [ ] **Mobile friendly**: Funciona en dispositivos móviles

### UI/UX
- [ ] **Responsive design**: Se adapta a todas las pantallas
- [ ] **Loading states**: Indicadores de carga
- [ ] **Success/Error feedback**: Feedback visual claro
- [ ] **Copy to clipboard**: Funcionalidad de copiar resultado
- [ ] **Clear/Reset**: Opción de limpiar inputs

### SEO & Analytics ✅ **Sistema Implementado**
- [ ] **Page title**: Usar `updateMetaTags()` para títulos dinámicos
- [ ] **Meta description**: Configurar en `PAGE_META_CONFIG` de metaTags.ts
- [ ] **Structured data**: Añadir schema en structuredData.ts
- [ ] **Analytics events**: Usar `trackEvent()` y `trackToolUsage()`
- [ ] **Performance tracking**: Se añade automáticamente con Core Web Vitals

### Testing
- [ ] **Unit tests**: Cobertura >80%
- [ ] **Integration tests**: Flujo completo funciona
- [ ] **Accessibility tests**: WCAG 2.1 AA
- [ ] **Performance tests**: Core Web Vitals

## 📝 Proceso de Pull Request

### 1. Antes de enviar
```bash
# Ejecutar todos los checks disponibles
npm run type-check    # Verificar tipos TypeScript
npm run build         # Verificar que el build funciona
# Nota: Linting y tests pendientes de configurar
```

### 2. Commit Messages
```bash
# Formato: tipo(scope): descripción
feat(tools): add JWT decoder tool
fix(json-validator): handle empty input
docs(readme): update installation guide
style(ui): improve button hover states
```

### 3. PR Description Template
```markdown
## 🎯 Qué hace este PR

Breve descripción de los cambios...

## ✅ Checklist

- [ ] Tests pasando
- [ ] Linting correcto
- [ ] Responsive design
- [ ] SEO optimizado
- [ ] Analytics implementado

## 📸 Screenshots (si aplica)

[Antes] vs [Después]

## 🧪 Cómo probar

1. Ir a `/tool/nueva-herramienta`
2. Probar con input válido
3. Probar con input inválido
```

## 🐛 Reportar Bugs

### Template de Issue
```markdown
**Describe el bug**
Descripción clara del problema...

**Pasos para reproducir**
1. Ir a '...'
2. Hacer click en '....'
3. Ver error

**Comportamiento esperado**
Lo que debería pasar...

**Screenshots**
Si aplica, añadir screenshots

**Entorno**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Device: [e.g. Desktop, Mobile]
```

## 💡 Sugerir Nuevas Herramientas

### Criterios de Evaluación
1. **Demanda**: ¿Los desarrolladores lo necesitan?
2. **Unicidad**: ¿Ya existe algo similar?
3. **Complejidad**: ¿Se puede implementar client-side?
4. **SEO Potential**: ¿La gente lo busca en Google?
5. **Monetización**: ¿Puede generar tráfico/revenue?

### Template para Propuesta
```markdown
**Nombre de la herramienta**
[Nombre descriptivo]

**Descripción**
Qué hace la herramienta...

**Casos de uso**
- Desarrollador Frontend necesita...
- DevOps quiere...

**Palabras clave SEO**
- "herramienta X online"
- "convertir Y a Z"

**Complejidad estimada**
[Baja/Media/Alta]

**Prioridad sugerida**
[Alta/Media/Baja] y por qué
```

## 🏆 Reconocimientos

### Contributors Hall of Fame
- Mantenemos un wall of fame de contributors
- Credits en cada herramienta implementada
- Posible revenue sharing para contributors principales

### Niveles de Contribución
- **🥉 Bronze**: 1-3 PRs merged
- **🥈 Silver**: 4-9 PRs merged  
- **🥇 Gold**: 10+ PRs merged
- **💎 Diamond**: Core maintainer

## 📞 Contacto y Soporte

### Channels
- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales
- **Email**: [Por definir]

### Response Times
- **Bugs críticos**: <24h
- **Feature requests**: <72h
- **General questions**: <1 semana

---

¡Esperamos tus contribuciones para hacer de DevToolsKit la mejor herramienta para desarrolladores! 🚀