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

### Componentes Reutilizables (Estructura Actual)
```
src/components/
├── ui/              # Componentes base (Button, Input, TextArea)
├── layout/          # Layout components (Header, Footer)
└── common/          # Componentes compartidos (ToolCard)
```

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

### SEO & Analytics
- [ ] **Page title**: Título descriptivo y único
- [ ] **Meta description**: Descripción optimizada
- [ ] **Structured data**: Schema.org markup
- [ ] **Analytics events**: Tracking de uso

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