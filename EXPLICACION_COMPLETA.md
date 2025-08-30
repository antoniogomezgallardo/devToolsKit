# 📚 Guía Completa del Proyecto DevToolsKit

> **Para personas sin conocimientos técnicos previos**
> 
> Este documento explica todo lo que necesitas saber sobre el proyecto DevToolsKit: qué es, cómo funciona, qué tecnologías usa y por qué las elegimos.

---

## 📋 Tabla de Contenidos

1. [¿Qué es DevToolsKit?](#-qué-es-devtoolskit)
2. [¿Por qué existe este proyecto?](#-por-qué-existe-este-proyecto)
3. [¿Cómo funciona técnicamente?](#-cómo-funciona-técnicamente)
4. [Tecnologías que utilizamos](#-tecnologías-que-utilizamos)
5. [Metodologías de desarrollo](#-metodologías-de-desarrollo)
6. [Cómo se organiza el trabajo](#-cómo-se-organiza-el-trabajo)
7. [¿Cómo ganamos dinero?](#-cómo-ganamos-dinero)
8. [El futuro del proyecto](#-el-futuro-del-proyecto)

---

## 🎯 ¿Qué es DevToolsKit?

DevToolsKit es un **sitio web** que funciona como una "caja de herramientas digital" para programadores. 

### 🔧 ¿Qué tipo de herramientas?

Imagina que un programador es como un carpintero, pero en lugar de trabajar con madera, trabaja con **código** (las instrucciones que hacen que las aplicaciones y sitios web funcionen).

Así como un carpintero necesita martillos, destornilladores y sierras, un programador necesita herramientas para:

- **Validar datos**: Verificar que la información esté correcta
- **Convertir formatos**: Cambiar información de un tipo a otro (como convertir una lista de Excel a un formato que entienda una aplicación)
- **Generar códigos**: Crear contraseñas seguras, códigos QR, etc.
- **Analizar información**: Revisar y entender datos complejos

### 🌐 ¿Cómo funciona para el usuario?

1. **Entra al sitio web** (como entrar a Google)
2. **Elige la herramienta** que necesita
3. **Pega o escribe** la información que quiere procesar
4. **Obtiene el resultado** inmediatamente
5. **No necesita registrarse** ni instalar nada

**Ejemplo práctico**: Un programador tiene un código JSON (un formato de datos muy usado) que parece estar roto. Entra a nuestra herramienta "Validador JSON", pega el código, y en segundos sabe si está bien o mal, y dónde está el error.

---

## 💡 ¿Por qué existe este proyecto?

### 🚫 El Problema

Los programadores actualmente tienen que:
- **Buscar en Google** cada vez que necesitan una herramienta
- **Instalar programas** en sus computadoras
- **Usar sitios web lentos** y mal diseñados
- **Registrarse en múltiples sitios** diferentes
- **Lidiar con publicidad molesta** y diseños confusos

### ✅ Nuestra Solución

Creamos **un solo sitio** que:
- **Reúne todas las herramientas** en un lugar
- **Funciona súper rápido** (menos de 2 segundos para cargar)
- **No requiere registro** ni instalación
- **Tiene un diseño limpio** y fácil de usar
- **Funciona en cualquier dispositivo** (computadora, tablet, móvil)

### 🎯 Público Objetivo

- **Programadores principiantes**: Que están aprendiendo
- **Desarrolladores experimentados**: Que quieren eficiencia
- **Estudiantes de programación**: En universidades y bootcamps
- **Empresas de tecnología**: Cuyos equipos usan estas herramientas diariamente

---

## ⚙️ ¿Cómo funciona técnicamente?

### 🧠 Conceptos Básicos Primero

#### ¿Qué es un sitio web?
Un sitio web es como una revista digital que vive en internet. Pero a diferencia de una revista normal, puede ser **interactiva**: puedes hacer clic, escribir, y obtener respuestas.

#### ¿Qué es el código?
El código son las instrucciones escritas en un lenguaje especial que las computadoras entienden. Es como una receta de cocina, pero para computadoras.

### 🏗️ Arquitectura de Nuestro Proyecto

Nuestro sitio web se divide en tres partes principales:

#### 1. **Frontend** (La Parte Visible)
- **Qué es**: Todo lo que ves y tocas en el sitio web
- **Incluye**: Botones, formularios, colores, textos
- **Como una tienda**: Es el escaparate y el interior donde los clientes interactúan

#### 2. **Backend** (La Parte Invisible)
- **Qué es**: La lógica que procesa los datos
- **En nuestro caso**: Funciona directamente en el navegador del usuario
- **Como una tienda**: Son los procesos internos de cálculo y organización

#### 3. **Hosting** (Dónde Vive el Sitio)
- **Qué es**: Los servidores (computadoras especiales) donde guardamos el sitio
- **Como una tienda**: Es el edificio físico donde está ubicada la tienda

### 🔄 ¿Cómo Funciona el Flujo?

```
Usuario escribe en la herramienta
           ⬇️
La herramienta procesa inmediatamente
           ⬇️
Muestra el resultado al usuario
           ⬇️
Todo sucede en su navegador (súper rápido)
```

**Lo especial**: No enviamos datos a servidores externos. Todo se procesa en el navegador del usuario, lo que hace que sea:
- ✅ **Más rápido**
- ✅ **Más privado**
- ✅ **Más barato de mantener**

---

## 💻 Tecnologías que Utilizamos

### 🎨 **Frontend (La Cara Visible)**

#### **TypeScript** 
- **¿Qué es?**: Un lenguaje de programación que es como JavaScript pero más estricto
- **¿Por qué lo usamos?**: 
  - Nos ayuda a **detectar errores antes** de que lleguen a los usuarios
  - Hace el código **más fácil de mantener**
  - Es como tener un **corrector ortográfico para código**
- **Ejemplo**: En lugar de que un error aparezca cuando un usuario usa la herramienta, lo detectamos mientras programamos

#### **Tailwind CSS**
- **¿Qué es?**: Una herramienta para hacer que el sitio web se vea bonito
- **¿Por qué lo usamos?**: 
  - Nos permite **diseñar muy rápido**
  - Asegura que todo se vea **consistente**
  - Es como tener **bloques de construcción prediseñados** para interfaces
- **Ejemplo**: En lugar de escribir 50 líneas de código para hacer un botón azul, escribimos `class="bg-blue-500"`

### 🔧 **Build System (El Constructor)**

#### **Parcel**
- **¿Qué es?**: Una herramienta que toma nuestro código y lo "empaqueta" para que funcione en internet
- **¿Por qué lo elegimos?**: 
  - **Configuración cero**: Funciona sin necesidad de configuraciones complicadas
  - **Súper confiable**: No falla al crear la versión final
  - **Optimización automática**: Hace el sitio más rápido automáticamente
- **Analogía**: Es como tener un robot que toma todos los ingredientes de una receta y automáticamente prepara el plato final perfectamente

#### **¿Por qué NO usamos Vite?**
- **Problema que tuvimos**: Vite (la herramienta anterior) nos daba errores al subir el sitio a internet
- **Solución**: Cambiamos a Parcel y funcionó perfectamente
- **Lección**: A veces la herramienta más popular no es la mejor para tu proyecto específico

### 🌐 **Hosting (Dónde Vive)**

#### **Vercel**
- **¿Qué es?**: Una empresa que nos proporciona computadoras en internet para alojar nuestro sitio
- **¿Por qué lo elegimos?**:
  - **Deploy automático**: Cuando hacemos cambios, se actualizan automáticamente en internet
  - **CDN global**: Copies de nuestro sitio en todo el mundo para que cargue rápido
  - **SSL gratis**: Certificados de seguridad sin costo
  - **Analytics gratis**: Estadísticas de uso incluidas
- **Analogía**: Es como tener una cadena de tiendas que automáticamente replican tu tienda en las mejores ubicaciones del mundo

#### **Dominio Personalizado**
- **¿Qué tenemos?**: `onlinedevtoolskit.com`
- **¿Por qué es importante?**: 
  - **Profesionalismo**: Se ve más serio que una URL genérica
  - **SEO**: Google nos toma más en serio
  - **Marca**: Los usuarios nos recuerdan más fácil

### 📊 **Analytics y Monetización**

#### **Google Analytics 4**
- **¿Qué es?**: Un sistema para saber quién visita nuestro sitio y cómo lo usa
- **¿Para qué lo usamos?**:
  - **Entender a los usuarios**: Qué herramientas usan más
  - **Optimizar el sitio**: Qué páginas son más lentas
  - **Tomar decisiones**: Qué nuevas herramientas crear
- **Privacidad**: Seguimos todas las reglas de privacidad

#### **Google AdSense**
- **¿Qué es?**: Sistema de publicidad de Google
- **¿Cómo funciona?**: Google pone anuncios relevantes en nuestro sitio y nos paga
- **¿Por qué es bueno?**: 
  - **Anuncios de calidad**: Google filtra anuncios malos
  - **Relevantes**: Muestran anuncios relacionados con programación
  - **No intrusivos**: Diseñados para no molestar la experiencia

---

## 🔄 Metodologías de Desarrollo

### ¿Qué son las metodologías de desarrollo?

Las metodologías de desarrollo son **reglas y procesos** que seguimos para crear software de manera organizada y eficiente. Es como tener un **manual de procedimientos** en una empresa.

### 🌊 **GitFlow: Nuestro Sistema de Control de Versiones**

#### ¿Qué es el Control de Versiones?

Imagina que estás escribiendo un libro:
- **Versión 1**: El primer borrador
- **Versión 2**: Corriges errores
- **Versión 3**: Añades un nuevo capítulo
- **Versión 4**: Tu editor sugiere cambios

El control de versiones es un sistema que:
- **Guarda cada versión** de tu libro
- **Te permite volver atrás** si algo sale mal
- **Permite que varias personas** trabajen en el mismo libro sin pisarse
- **Combina cambios** de diferentes autores

#### ¿Qué es GitFlow?

GitFlow es un **método específico** de organizar las versiones de nuestro código. Es como tener **diferentes tipos de documentos** para diferentes propósitos:

##### 🌟 **main** (Rama Principal)
- **Qué es**: La versión "oficial" que ven los usuarios
- **Analogía**: Es como el libro publicado en la librería
- **Regla**: Solo se actualiza cuando tenemos una versión completamente terminada y probada
- **Ejemplo**: Cuando lanzamos la versión 1.0, 1.1, 1.2, etc.

##### 🔧 **develop** (Rama de Desarrollo)
- **Qué es**: Donde combinamos todas las nuevas características
- **Analogía**: Es como el manuscrito del editor donde se van juntando todos los capítulos
- **Uso**: Aquí probamos que todo funciona bien junto
- **Estado**: Siempre funcional, pero puede tener características experimentales

##### ⭐ **feature/** (Ramas de Características)
- **Qué es**: Una rama por cada nueva herramienta o característica
- **Analogía**: Es como escribir cada capítulo en un documento separado
- **Ejemplos**: 
  - `feature/jwt-decoder` - Para crear la herramienta JWT Decoder
  - `feature/password-generator` - Para el generador de contraseñas
- **Proceso**: Se crea desde `develop`, se desarrolla la característica, y se vuelve a mergear a `develop`

##### 🚀 **release/** (Ramas de Lanzamiento)
- **Qué es**: Preparación final antes de publicar una nueva versión
- **Analogía**: Es como la revisión final del editor antes de imprimir el libro
- **Proceso**: Se hacen últimos ajustes, se prueba todo, y se publica

##### 🚨 **hotfix/** (Correcciones Urgentes)
- **Qué es**: Para arreglar errores críticos en producción
- **Analogía**: Es como una errata urgente que hay que corregir en todos los libros ya impresos
- **Cuándo**: Solo cuando hay un bug que afecta a los usuarios y no puede esperar

#### 📊 **Flujo Visual de GitFlow**

```
main     ●────────●────────●────────●  (Solo releases estables)
        /        /        /        /
develop ●────●────●────●────●────●    (Integración continua)
       /    /         /    /
feature ●────●         ●────●          (Nuevas características)
      /              /
hotfix ●─────────────●                 (Correcciones críticas)
```

#### 🔄 **Ejemplo Práctico: Crear la herramienta JWT Decoder**

1. **Planificación**: Decidimos crear JWT Decoder
2. **Crear rama**: `git checkout -b feature/jwt-decoder` desde `develop`
3. **Desarrollar**: Programamos la herramienta en nuestra rama
4. **Probar**: Verificamos que funciona correctamente
5. **Mergear**: Combinamos con `develop`
6. **Release**: Cuando tengamos varias herramientas, creamos `release/v0.2.0`
7. **Publicar**: Mergeamos el release a `main` y los usuarios lo ven

#### ✅ **Ventajas de GitFlow**

- **Organización**: Siempre sabemos en qué estado está cada característica
- **Estabilidad**: La versión de producción siempre funciona
- **Colaboración**: Varias personas pueden trabajar sin conflictos
- **Reversibilidad**: Podemos deshacer cambios fácilmente
- **Trazabilidad**: Sabemos quién hizo qué y cuándo

### 📋 **Metodología de Gestión de Proyectos**

#### **TodoWrite System**
- **Qué es**: Sistema para hacer seguimiento de tareas
- **Cómo funciona**: 
  - Cada tarea tiene estados: `pending`, `in_progress`, `completed`
  - Solo una tarea puede estar `in_progress` a la vez
  - Se actualiza en tiempo real conforme avanzamos
- **Ventaja**: Transparencia total sobre el progreso del proyecto

#### **Documentación Proactiva**
- **Principio**: Documentar mientras se desarrolla, no después
- **Archivos clave**:
  - `README.md`: Información general del proyecto
  - `CONTRIBUTING.md`: Cómo contribuir al proyecto
  - `ROADMAP.md`: Plan de desarrollo futuro
  - `CONTEXT.md`: Contexto técnico y decisiones
- **Ventaja**: Cualquier persona puede entender y contribuir al proyecto

---

## 👥 Cómo se Organiza el Trabajo

### 🎯 **Filosofía de Desarrollo**

#### **Desarrollo Iterativo**
- **Qué significa**: Construir el proyecto en pequeños incrementos
- **Como construir una casa**: 
  - ❌ **No**: Construir toda la casa de una vez
  - ✅ **Sí**: Cimientos → Paredes → Techo → Acabados
- **En nuestro proyecto**: 
  1. **MVP** (5 herramientas básicas)
  2. **Optimización** (SEO, Analytics)
  3. **Expansión** (Más herramientas)
  4. **Escalamiento** (Características avanzadas)

#### **Desarrollo Client-Side**
- **Qué significa**: Todo funciona en el navegador del usuario
- **Ventajas**:
  - ⚡ **Más rápido**: No hay comunicación con servidores
  - 🔒 **Más privado**: Los datos no salen del navegador
  - 💰 **Más barato**: No necesitamos servidores potentes
  - 🌍 **Más escalable**: Puede manejar millones de usuarios
- **Desventajas**:
  - 🔧 **Limitaciones técnicas**: No todas las herramientas se pueden hacer así
  - 📱 **Dependiente del dispositivo**: El procesamiento depende del dispositivo del usuario

### 📅 **Fases del Proyecto**

#### **Fase 1: MVP (Producto Mínimo Viable)** ✅ COMPLETADA
**Duración**: 2 semanas
**Objetivo**: Tener un sitio funcionando con herramientas básicas

**Lo que se logró**:
- ✅ Sitio web funcionando: `onlinedevtoolskit.com`
- ✅ Infraestructura técnica completa
- ✅ Primera herramienta: JSON Validator
- ✅ Diseño responsivo (funciona en móviles)
- ✅ SEO básico implementado

#### **Fase 2: Optimización** 🔄 EN PROGRESO
**Duración**: 2 semanas
**Objetivo**: Optimizar para búsquedas en Google y comenzar monetización

**Plan**:
- [ ] 4 herramientas adicionales (JWT, Base64, Password Gen, Color Palette)
- [ ] Google Analytics implementado
- [ ] Google AdSense aprobado
- [ ] Optimización para búsquedas (SEO)

#### **Fase 3: Expansión** 📅 PLANIFICADA
**Duración**: 1 mes
**Objetivo**: 15+ herramientas y características avanzadas

**Plan**:
- [ ] 10 herramientas adicionales
- [ ] Modo oscuro
- [ ] Sistema de favoritos
- [ ] PWA (funciona offline)

#### **Fase 4: Escalamiento** 🔮 FUTURO
**Duración**: Ongoing
**Objetivo**: Monetización seria y características premium

**Plan**:
- [ ] Características premium
- [ ] API para desarrolladores
- [ ] Versión en inglés
- [ ] Aplicación móvil

### 📊 **Métricas de Éxito**

#### **Técnicas**
- **Performance**: Sitio carga en menos de 2 segundos
- **Disponibilidad**: 99.9% del tiempo funcionando
- **SEO**: Aparecer en los primeros 10 resultados de Google

#### **De Negocio**
- **3 meses**: 10,000+ usuarios mensuales
- **6 meses**: $2,000+ ingresos mensuales
- **1 año**: $10,000+ ingresos mensuales

#### **De Usuario**
- **Satisfacción**: >90% de usuarios encuentran lo que buscan
- **Retención**: >40% de usuarios regresan
- **Performance**: <2 segundos de carga promedio

---

## 💰 ¿Cómo Ganamos Dinero?

### 🎯 **Modelo de Negocio: Freemium**

#### **Servicios Gratuitos (80% de usuarios)**
- **Todas las herramientas básicas** son completamente gratuitas
- **Sin límites de uso** para uso personal
- **Sin registro requerido**
- **Con publicidad discreta** (Google AdSense)

#### **Servicios Premium (20% de usuarios)**
- **Sin publicidad**
- **Herramientas avanzadas** (APIs, integraciones)
- **Mayor límite de procesamiento**
- **Soporte prioritario**

### 💡 **Estrategias de Monetización**

#### **1. Google AdSense** (Ingresos Pasivos)
- **Cómo funciona**: Google pone anuncios relevantes en nuestro sitio
- **Ingresos estimados**: $0.50-$2.00 por cada 1000 visitas
- **Con 100,000 visitas mensuales**: $50-$200/mes
- **Con 1,000,000 visitas mensuales**: $500-$2000/mes

#### **2. Marketing de Afiliados**
- **Qué es**: Recomendamos herramientas y servicios que usan los programadores
- **Ejemplos**: Hosting, cursos de programación, herramientas premium
- **Comisión típica**: 5-30% por venta referida

#### **3. API Premium**
- **Qué es**: Permitir que otras empresas usen nuestras herramientas en sus aplicaciones
- **Precio**: $0.001-$0.01 por llamada a la API
- **Mercado**: Empresas que quieren integrar nuestras herramientas

#### **4. Características Premium**
- **Procesamientos en lote**: Procesar múltiples archivos a la vez
- **Historial de uso**: Guardar trabajos anteriores
- **Temas personalizados**: Customizar la apariencia
- **Precio sugerido**: $5-$15/mes

### 📈 **Proyección de Ingresos**

#### **Mes 3** (Objetivo: $500/mes)
- 50,000 visitas mensuales
- $100 de AdSense
- $400 de afiliados

#### **Mes 6** (Objetivo: $2,000/mes)
- 200,000 visitas mensuales
- $400 de AdSense
- $1,000 de afiliados
- $600 de API Premium

#### **Año 1** (Objetivo: $10,000/mes)
- 1,000,000 visitas mensuales
- $2,000 de AdSense
- $3,000 de afiliados
- $2,000 de API Premium
- $3,000 de subscripciones Premium

### 🎯 **¿Por qué este modelo funciona?**

#### **Demanda Constante**
- Los programadores **siempre necesitan** estas herramientas
- El mercado **crece constantemente** (más empresas necesitan software)
- Las herramientas son **esenciales**, no opcionales

#### **Baja Competencia Directa**
- La mayoría de sitios similares son **lentos y mal diseñados**
- **No hay un líder claro** en el mercado
- Oportunidad de ser **el primer sitio realmente bueno**

#### **Escalabilidad**
- Una vez creada una herramienta, **puede usarla millones de personas**
- **Costos marginales casi cero** (no cuesta más atender más usuarios)
- **Network effects**: Mientras más usuarios, más valioso se vuelve

---

## 🔮 El Futuro del Proyecto

### 🗺️ **Roadmap a 2 Años**

#### **Año 1: Dominancia Local**
- **Q1**: 25+ herramientas, 100K usuarios/mes
- **Q2**: Versión en inglés, 500K usuarios/mes
- **Q3**: API pública, partnerships con bootcamps
- **Q4**: Aplicación móvil, $10K/mes ingresos

#### **Año 2: Expansión Internacional**
- **Q1**: Marketplace de herramientas de terceros
- **Q2**: Características de colaboración (teams)
- **Q3**: Certificaciones y cursos
- **Q4**: IPO o adquisición

### 🚀 **Visión a Largo Plazo**

#### **Convertirse en el "GitHub de las herramientas"**
- **Qué significa**: El sitio de referencia donde todos los programadores van
- **Como GitHub**: Donde se guarda el código, nosotros: donde se usan herramientas
- **Network effects**: Mientras más programadores lo usen, más útil se vuelve

#### **Ecosistema Completo para Developers**
```
DevToolsKit Ecosystem
├── 🛠️ Herramientas Online (Actual)
├── 📚 Tutoriales y Documentación
├── 🤝 Comunidad y Foros
├── 💼 Job Board para Developers
├── 🎓 Cursos y Certificaciones
└── 🏢 Herramientas Enterprise
```

### 💡 **Oportunidades Futuras**

#### **1. Inteligencia Artificial**
- **Code Generation**: Generar código automáticamente
- **Bug Detection**: Encontrar errores automáticamente
- **Code Optimization**: Sugerir mejoras al código

#### **2. Realidad Virtual/Aumentada**
- **Debugging 3D**: Visualizar código en 3D
- **Collaborative Coding**: Programar en equipo en VR

#### **3. Blockchain/Web3**
- **Smart Contract Tools**: Herramientas para blockchain
- **NFT Generators**: Crear y validar NFTs
- **Crypto Utilities**: Herramientas para criptomonedas

### 🎯 **Factores Críticos de Éxito**

#### **1. Velocidad de Ejecución**
- **Por qué importa**: El mercado tech se mueve rápido
- **Nuestra ventaja**: GitFlow nos permite desarrollar rápido y seguro
- **Meta**: Lanzar 2-3 herramientas por mes

#### **2. Calidad del Producto**
- **Por qué importa**: Los programadores son usuarios exigentes
- **Nuestra ventaja**: Enfoque en UX y performance
- **Meta**: >95 score en Google Lighthouse

#### **3. SEO y Marketing**
- **Por qué importa**: Necesitamos que nos encuentren en Google
- **Nuestra estrategia**: Contenido de calidad + herramientas útiles
- **Meta**: Top 5 en búsquedas relevantes

#### **4. Monetización Balanceada**
- **Por qué importa**: Necesitamos ingresos sin arruinar la experiencia
- **Nuestra estrategia**: Freemium con valor real en premium
- **Meta**: 20% de usuarios convertidos a premium

---

## 🎓 Conclusión para No-Técnicos

### 📝 **Resumen Ejecutivo**

**DevToolsKit es un sitio web** que proporciona herramientas esenciales para programadores. Think of it as **"the Swiss Army knife for developers"**.

### 🔑 **Puntos Clave**

1. **Problema Real**: Los programadores pierden tiempo buscando herramientas en sitios lentos y mal diseñados
2. **Solución Clara**: Un sitio web rápido, limpio y completo con todas las herramientas en un lugar
3. **Tecnología Sólida**: Usamos las mejores herramientas modernas para garantizar velocidad y confiabilidad
4. **Metodología Probada**: GitFlow y desarrollo iterativo nos permiten crecer de manera organizada
5. **Modelo de Negocio Viable**: Freemium con múltiples fuentes de ingresos
6. **Mercado en Crecimiento**: La demanda de herramientas de programación crece constantemente

### 🎯 **¿Por qué va a funcionar?**

1. **Necesidad Real**: Los programadores **necesitan** estas herramientas diariamente
2. **Competencia Débil**: Los sitios existentes son lentos y mal diseñados
3. **Ejecución Superior**: Nuestro enfoque en velocidad y UX nos diferencia
4. **Escalabilidad**: Una vez construidas, las herramientas pueden servir a millones
5. **Network Effects**: Mientras más usuarios, más valioso se vuelve

### 🚀 **Próximos Pasos**

1. **Completar MVP**: Terminar las 5 herramientas básicas
2. **Optimizar SEO**: Aparecer en búsquedas de Google
3. **Implementar Monetización**: AdSense y afiliados
4. **Escalar**: Más herramientas y usuarios
5. **Expandir**: Nuevos mercados y características

### 💭 **Reflexión Final**

Este proyecto combina:
- **Demanda del mercado** (programadores necesitan estas herramientas)
- **Tecnología moderna** (sitio web súper rápido)
- **Metodología sólida** (desarrollo organizado y predecible)
- **Modelo de negocio probado** (freemium funciona)

El resultado es un proyecto con **alta probabilidad de éxito** y **potencial de escalamiento significativo**.

---

*Documento creado el 2025-08-30*  
*Para más información técnica, consultar CONTEXT.md y CONTRIBUTING.md*