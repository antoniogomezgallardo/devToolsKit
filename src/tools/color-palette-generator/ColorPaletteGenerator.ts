import { 
  createColorFromHex, 
  createColorFromRgb, 
  createColorFromHsl,
  generateRandomColor,
  generatePalette,
  exportPalette,
  getContrastRatio,
  getContrastLevel,
  analyzeColor,
  simulateColorBlindness,
  isValidHex,
  isValidRgb,
  isValidHsl
} from './utils';
import { trackUserInteraction, trackToolUsage, ToolNames } from '../../utils/analytics';
import type { 
  Color, 
  ColorPalette, 
  ColorHarmony, 
  ExportFormat, 
  ColorBlindnessType,
  ColorInputMode,
  PaletteGenerationOptions 
} from './types';

export class ColorPaletteGenerator {
  private container: HTMLElement;
  private baseColor: Color;
  private currentPalette: ColorPalette | null = null;
  private currentHarmony: ColorHarmony = 'complementary';
  private colorBlindnessMode: ColorBlindnessType = 'normal';
  
  // UI Elements
  private colorPicker!: HTMLInputElement;
  private hexInput!: HTMLInputElement;
  private rgbInputs!: { r: HTMLInputElement; g: HTMLInputElement; b: HTMLInputElement };
  private hslInputs!: { h: HTMLInputElement; s: HTMLInputElement; l: HTMLInputElement };
  private harmonySelect!: HTMLSelectElement;
  private generateBtn!: HTMLButtonElement;
  private randomBtn!: HTMLButtonElement;
  private paletteContainer!: HTMLElement;
  private exportContainer!: HTMLElement;
  private accessibilityContainer!: HTMLElement;
  private colorBlindnessSelect!: HTMLSelectElement;
  private previewContainer!: HTMLElement;
  private statusDiv!: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.baseColor = createColorFromHex('#3b82f6')!; // Default blue
    this.render();
    this.bindEvents();
    this.generateInitialPalette();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Generador de Paleta de Colores</h1>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Crea paletas de colores armoniosas usando teoría del color. Genera esquemas complementarios, 
            triádicos, análogos y más con opciones de exportación profesional.
          </p>
        </div>

        <!-- Color Input Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Color Base</h2>
          
          <!-- Input Mode Toggle -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button class="input-mode-btn px-3 py-1 text-sm rounded transition-colors bg-primary-600 text-white" data-mode="picker">
              🎨 Picker
            </button>
            <button class="input-mode-btn px-3 py-1 text-sm rounded transition-colors bg-gray-200 text-gray-700" data-mode="hex">
              # HEX
            </button>
            <button class="input-mode-btn px-3 py-1 text-sm rounded transition-colors bg-gray-200 text-gray-700" data-mode="rgb">
              RGB
            </button>
            <button class="input-mode-btn px-3 py-1 text-sm rounded transition-colors bg-gray-200 text-gray-700" data-mode="hsl">
              HSL
            </button>
          </div>

          <!-- Color Input Controls -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <!-- Color Picker -->
              <div id="picker-input" class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">Selector de color</label>
                <div class="flex items-center space-x-3">
                  <input type="color" id="color-picker" value="#3b82f6" class="h-12 w-20 rounded border border-gray-300 cursor-pointer">
                  <div class="flex-1">
                    <div id="current-color-display" class="h-12 rounded border border-gray-300" style="background-color: #3b82f6;"></div>
                  </div>
                </div>
              </div>

              <!-- HEX Input -->
              <div id="hex-input" class="space-y-3 hidden">
                <label class="block text-sm font-medium text-gray-700">Código HEX</label>
                <input type="text" id="hex-field" placeholder="#3b82f6" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
              </div>

              <!-- RGB Input -->
              <div id="rgb-input" class="space-y-3 hidden">
                <label class="block text-sm font-medium text-gray-700">RGB</label>
                <div class="grid grid-cols-3 gap-2">
                  <div>
                    <label class="block text-xs text-gray-500">R (0-255)</label>
                    <input type="number" id="rgb-r" min="0" max="255" value="59" class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500">G (0-255)</label>
                    <input type="number" id="rgb-g" min="0" max="255" value="130" class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500">B (0-255)</label>
                    <input type="number" id="rgb-b" min="0" max="255" value="246" class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
                  </div>
                </div>
              </div>

              <!-- HSL Input -->
              <div id="hsl-input" class="space-y-3 hidden">
                <label class="block text-sm font-medium text-gray-700">HSL</label>
                <div class="grid grid-cols-3 gap-2">
                  <div>
                    <label class="block text-xs text-gray-500">H (0-359)</label>
                    <input type="number" id="hsl-h" min="0" max="359" value="217" class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500">S (0-100)</label>
                    <input type="number" id="hsl-s" min="0" max="100" value="91" class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500">L (0-100)</label>
                    <input type="number" id="hsl-l" min="0" max="100" value="60" class="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
                  </div>
                </div>
              </div>
            </div>

            <!-- Color Analysis -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700">Análisis del color</h3>
              <div id="color-analysis" class="p-4 bg-gray-50 rounded-lg text-sm">
                <div class="space-y-2 text-gray-600">
                  <div class="flex justify-between"><span>HEX:</span><span id="analysis-hex">#3b82f6</span></div>
                  <div class="flex justify-between"><span>RGB:</span><span id="analysis-rgb">59, 130, 246</span></div>
                  <div class="flex justify-between"><span>HSL:</span><span id="analysis-hsl">217°, 91%, 60%</span></div>
                  <div class="flex justify-between"><span>Temperatura:</span><span id="analysis-temp">Frío</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Harmony Selection -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Esquema de Armonía</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de armonía</label>
              <select id="harmony-select" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option value="complementary">Complementario (2 colores)</option>
                <option value="triadic">Triádico (3 colores)</option>
                <option value="analogous">Análogo (5 colores)</option>
                <option value="monochromatic">Monocromático (5 colores)</option>
                <option value="split-complementary">Complementario dividido (3 colores)</option>
                <option value="tetradic">Tetrádico (4 colores)</option>
                <option value="square">Cuadrado (4 colores)</option>
              </select>
            </div>
            
            <div class="flex items-end space-x-3">
              <button id="generate-btn" data-testid="generate-palette-btn" class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium">
                🎨 Generar Paleta
              </button>
              <button id="random-btn" data-testid="random-color-btn" class="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors font-medium">
                🎲 Aleatorio
              </button>
            </div>
          </div>
        </div>

        <!-- Color Palette Display -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Paleta de Colores</h2>
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Simulación:</label>
              <select id="colorblindness-select" class="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
                <option value="normal">Visión normal</option>
                <option value="protanopia">Protanopia (rojo-ciego)</option>
                <option value="deuteranopia">Deuteranopia (verde-ciego)</option>
                <option value="tritanopia">Tritanopia (azul-ciego)</option>
              </select>
            </div>
          </div>
          
          <div id="palette-container" class="space-y-4">
            <!-- Palette colors will be rendered here -->
          </div>
        </div>

        <!-- UI Preview -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Vista Previa en UI</h2>
          <div id="preview-container">
            <!-- UI preview will be rendered here -->
          </div>
        </div>

        <!-- Accessibility Check -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Verificación de Accesibilidad</h2>
          <div id="accessibility-container">
            <!-- Accessibility info will be rendered here -->
          </div>
        </div>

        <!-- Export Options -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Exportar Paleta</h2>
          <div id="export-container">
            <!-- Export options will be rendered here -->
          </div>
        </div>

        <!-- Status -->
        <div id="status-container" class="p-4 rounded-lg border"></div>

        <!-- Examples -->
        <div class="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ejemplos de Paletas</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="example-palette-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="sunset">
              <h4 class="font-medium text-gray-900">Atardecer</h4>
              <p class="text-sm text-gray-600">Paleta cálida inspirada en el atardecer</p>
              <div class="flex mt-2 space-x-1">
                <div class="w-4 h-4 rounded" style="background: #ff6b35;"></div>
                <div class="w-4 h-4 rounded" style="background: #f7931e;"></div>
                <div class="w-4 h-4 rounded" style="background: #ffd23f;"></div>
                <div class="w-4 h-4 rounded" style="background: #ff3c3c;"></div>
              </div>
            </button>
            
            <button class="example-palette-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="ocean">
              <h4 class="font-medium text-gray-900">Océano</h4>
              <p class="text-sm text-gray-600">Paleta fresca inspirada en el mar</p>
              <div class="flex mt-2 space-x-1">
                <div class="w-4 h-4 rounded" style="background: #0077be;"></div>
                <div class="w-4 h-4 rounded" style="background: #00a8cc;"></div>
                <div class="w-4 h-4 rounded" style="background: #40e0d0;"></div>
                <div class="w-4 h-4 rounded" style="background: #48cae4;"></div>
              </div>
            </button>
            
            <button class="example-palette-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="forest">
              <h4 class="font-medium text-gray-900">Bosque</h4>
              <p class="text-sm text-gray-600">Paleta natural inspirada en la naturaleza</p>
              <div class="flex mt-2 space-x-1">
                <div class="w-4 h-4 rounded" style="background: #2d5016;"></div>
                <div class="w-4 h-4 rounded" style="background: #3d7022;"></div>
                <div class="w-4 h-4 rounded" style="background: #4a7c59;"></div>
                <div class="w-4 h-4 rounded" style="background: #7fb069;"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;

    // Get element references
    this.colorPicker = this.container.querySelector('#color-picker') as HTMLInputElement;
    this.hexInput = this.container.querySelector('#hex-field') as HTMLInputElement;
    this.rgbInputs = {
      r: this.container.querySelector('#rgb-r') as HTMLInputElement,
      g: this.container.querySelector('#rgb-g') as HTMLInputElement,
      b: this.container.querySelector('#rgb-b') as HTMLInputElement
    };
    this.hslInputs = {
      h: this.container.querySelector('#hsl-h') as HTMLInputElement,
      s: this.container.querySelector('#hsl-s') as HTMLInputElement,
      l: this.container.querySelector('#hsl-l') as HTMLInputElement
    };
    this.harmonySelect = this.container.querySelector('#harmony-select') as HTMLSelectElement;
    this.generateBtn = this.container.querySelector('#generate-btn') as HTMLButtonElement;
    this.randomBtn = this.container.querySelector('#random-btn') as HTMLButtonElement;
    this.paletteContainer = this.container.querySelector('#palette-container') as HTMLElement;
    this.exportContainer = this.container.querySelector('#export-container') as HTMLElement;
    this.accessibilityContainer = this.container.querySelector('#accessibility-container') as HTMLElement;
    this.colorBlindnessSelect = this.container.querySelector('#colorblindness-select') as HTMLSelectElement;
    this.previewContainer = this.container.querySelector('#preview-container') as HTMLElement;
    this.statusDiv = this.container.querySelector('#status-container') as HTMLElement;

    // Initialize status
    this.updateStatus('Paleta lista. Experimenta con diferentes armonías de color.', 'success');
  }

  private bindEvents(): void {
    // Input mode switching
    const inputModeButtons = this.container.querySelectorAll('.input-mode-btn');
    inputModeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = (e.target as HTMLElement).dataset.mode as ColorInputMode;
        this.switchInputMode(mode);
      });
    });

    // Color inputs
    this.colorPicker.addEventListener('input', () => this.handleColorPickerChange());
    this.hexInput.addEventListener('input', () => this.handleHexInputChange());
    
    Object.values(this.rgbInputs).forEach(input => {
      input.addEventListener('input', () => this.handleRgbInputChange());
    });
    
    Object.values(this.hslInputs).forEach(input => {
      input.addEventListener('input', () => this.handleHslInputChange());
    });

    // Harmony selection
    this.harmonySelect.addEventListener('change', () => {
      this.currentHarmony = this.harmonySelect.value as ColorHarmony;
      this.generatePalette();
    });

    // Action buttons
    this.generateBtn.addEventListener('click', () => this.generatePalette());
    this.randomBtn.addEventListener('click', () => this.generateRandomPalette());

    // Color blindness simulation
    this.colorBlindnessSelect.addEventListener('change', () => {
      this.colorBlindnessMode = this.colorBlindnessSelect.value as ColorBlindnessType;
      this.renderPalette();
    });

    // Example palettes
    const exampleButtons = this.container.querySelectorAll('.example-palette-btn');
    exampleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const example = (e.currentTarget as HTMLElement).dataset.example;
        this.loadExamplePalette(example!);
      });
    });
  }

  private switchInputMode(mode: ColorInputMode): void {

    // Update button states
    const buttons = this.container.querySelectorAll('.input-mode-btn');
    buttons.forEach(btn => {
      if ((btn as HTMLElement).dataset.mode === mode) {
        btn.className = 'input-mode-btn px-3 py-1 text-sm rounded transition-colors bg-primary-600 text-white';
      } else {
        btn.className = 'input-mode-btn px-3 py-1 text-sm rounded transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300';
      }
    });

    // Show/hide input sections
    const sections = ['picker-input', 'hex-input', 'rgb-input', 'hsl-input'];
    sections.forEach(section => {
      const element = this.container.querySelector(`#${section}`) as HTMLElement;
      element.classList.toggle('hidden', !section.startsWith(mode));
    });
  }

  private handleColorPickerChange(): void {
    const color = createColorFromHex(this.colorPicker.value);
    if (color) {
      this.updateBaseColor(color);
    }
  }

  private handleHexInputChange(): void {
    const hex = this.hexInput.value;
    if (isValidHex(hex)) {
      const color = createColorFromHex(hex);
      if (color) {
        this.updateBaseColor(color);
      }
    }
  }

  private handleRgbInputChange(): void {
    const r = parseInt(this.rgbInputs.r.value);
    const g = parseInt(this.rgbInputs.g.value);
    const b = parseInt(this.rgbInputs.b.value);

    if (isValidRgb(r, g, b)) {
      const color = createColorFromRgb(r, g, b);
      this.updateBaseColor(color);
    }
  }

  private handleHslInputChange(): void {
    const h = parseInt(this.hslInputs.h.value);
    const s = parseInt(this.hslInputs.s.value);
    const l = parseInt(this.hslInputs.l.value);

    if (isValidHsl(h, s, l)) {
      const color = createColorFromHsl(h, s, l);
      this.updateBaseColor(color);
    }
  }

  private updateBaseColor(color: Color): void {
    this.baseColor = color;
    
    // Update all input fields
    this.colorPicker.value = color.hex;
    this.hexInput.value = color.hex;
    this.rgbInputs.r.value = color.rgb.r.toString();
    this.rgbInputs.g.value = color.rgb.g.toString();
    this.rgbInputs.b.value = color.rgb.b.toString();
    this.hslInputs.h.value = color.hsl.h.toString();
    this.hslInputs.s.value = color.hsl.s.toString();
    this.hslInputs.l.value = color.hsl.l.toString();

    // Update color display
    const colorDisplay = this.container.querySelector('#current-color-display') as HTMLElement;
    colorDisplay.style.backgroundColor = color.hex;

    // Update analysis
    this.updateColorAnalysis(color);

    // Regenerate palette
    this.generatePalette();
  }

  private updateColorAnalysis(color: Color): void {
    const analysis = analyzeColor(color);
    
    (this.container.querySelector('#analysis-hex') as HTMLElement).textContent = color.hex;
    (this.container.querySelector('#analysis-rgb') as HTMLElement).textContent = `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;
    (this.container.querySelector('#analysis-hsl') as HTMLElement).textContent = `${color.hsl.h}°, ${color.hsl.s}%, ${color.hsl.l}%`;
    (this.container.querySelector('#analysis-temp') as HTMLElement).textContent = analysis.temperature.description === 'warm' ? 'Cálido' : 
      analysis.temperature.description === 'cool' ? 'Frío' : 'Neutro';
  }

  private generatePalette(): void {
    const options: PaletteGenerationOptions = {
      harmony: this.currentHarmony,
      count: 8,
      baseColor: this.baseColor,
      variation: 20,
      includeShades: false,
      includeTints: false
    };

    const result = generatePalette(options);
    if (result.success) {
      this.currentPalette = result.palette;
      this.renderPalette();
      this.renderUIPreview();
      this.renderAccessibilityCheck();
      this.renderExportOptions();
      this.updateStatus('Paleta generada exitosamente', 'success');
      
      // Track palette generation
      trackToolUsage(ToolNames.COLOR_PALETTE, 'success', {
        harmony: this.currentHarmony,
        colors_count: result.palette.colors.length
      });
    } else {
      this.updateStatus(`Error: ${result.error}`, 'error');
      trackToolUsage(ToolNames.COLOR_PALETTE, 'error', {
        error: result.error
      });
    }
  }

  private generateInitialPalette(): void {
    trackToolUsage(ToolNames.COLOR_PALETTE, 'start');
    this.generatePalette();
  }

  private generateRandomPalette(): void {
    const randomColor = generateRandomColor();
    this.updateBaseColor(randomColor);
    trackUserInteraction.clearInput(ToolNames.COLOR_PALETTE);
  }

  private renderPalette(): void {
    if (!this.currentPalette) return;

    let html = '<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">';
    
    this.currentPalette.colors.forEach((color, index) => {
      const displayColor = simulateColorBlindness(color, this.colorBlindnessMode);
      
      html += `
        <div class="group relative">
          <div class="aspect-square rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
               style="background-color: ${displayColor.hex};" 
               data-color-index="${index}">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity pointer-events-none"></div>
          </div>
          <div class="mt-2 text-center">
            <div class="text-sm font-medium text-gray-900">${displayColor.hex.toUpperCase()}</div>
            <div class="text-xs text-gray-500">RGB(${displayColor.rgb.r}, ${displayColor.rgb.g}, ${displayColor.rgb.b})</div>
            <button class="copy-color-btn mt-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors" 
                    data-color="${displayColor.hex}">
              Copiar
            </button>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.paletteContainer.innerHTML = html;

    // Add copy functionality
    const copyButtons = this.paletteContainer.querySelectorAll('.copy-color-btn');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const color = (e.target as HTMLElement).dataset.color!;
        await this.copyToClipboard(color);
      });
    });
  }

  private renderUIPreview(): void {
    if (!this.currentPalette) return;

    const colors = this.currentPalette.colors.slice(0, 5);
    const primary = colors[0];
    const secondary = colors[1] || primary;
    const accent = colors[2] || primary;
    const background = colors[3] || createColorFromHex('#f8f9fa')!;
    const text = colors[4] || createColorFromHex('#1f2937')!;

    this.previewContainer.innerHTML = `
      <div class="space-y-6">
        <!-- Card Preview -->
        <div class="p-6 rounded-lg shadow-sm border" style="background-color: ${background.hex}; border-color: ${primary.hex};">
          <h3 class="text-lg font-semibold mb-2" style="color: ${text.hex};">Ejemplo de Tarjeta</h3>
          <p class="text-sm mb-4" style="color: ${text.hex}; opacity: 0.8;">
            Esta es una vista previa de cómo se vería tu paleta en elementos de UI reales.
          </p>
          <div class="flex space-x-3">
            <button class="px-4 py-2 rounded font-medium text-white transition-colors" 
                    style="background-color: ${primary.hex};">
              Botón Primario
            </button>
            <button class="px-4 py-2 rounded font-medium border transition-colors"
                    style="color: ${secondary.hex}; border-color: ${secondary.hex};">
              Botón Secundario
            </button>
          </div>
        </div>

        <!-- Navigation Preview -->
        <div class="flex items-center justify-between p-4 rounded-lg shadow-sm" style="background-color: ${primary.hex};">
          <div class="text-white font-medium">Logo</div>
          <nav class="flex space-x-6">
            <a href="#" class="text-white hover:opacity-80">Inicio</a>
            <a href="#" class="text-white hover:opacity-80">Productos</a>
            <a href="#" class="text-white hover:opacity-80">Contacto</a>
          </nav>
          <button class="px-3 py-1 rounded text-sm font-medium" style="background-color: ${accent.hex}; color: white;">
            CTA
          </button>
        </div>
      </div>
    `;
  }

  private renderAccessibilityCheck(): void {
    if (!this.currentPalette) return;

    const white = createColorFromHex('#ffffff')!;
    const black = createColorFromHex('#000000')!;

    let html = '<div class="space-y-4">';
    
    this.currentPalette.colors.forEach((color) => {
      const onWhite = getContrastLevel(getContrastRatio(color, white));
      const onBlack = getContrastLevel(getContrastRatio(color, black));
      
      html += `
        <div class="p-4 border rounded-lg">
          <div class="flex items-center mb-3">
            <div class="w-6 h-6 rounded mr-3" style="background-color: ${color.hex};"></div>
            <span class="font-medium">${color.hex.toUpperCase()}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="p-3 bg-white rounded border">
              <div class="font-medium mb-1">Sobre fondo blanco</div>
              <div class="text-gray-600">Contraste: ${onWhite.ratio}:1</div>
              <div class="${onWhite.isAccessible ? 'text-green-600' : 'text-red-600'}">${onWhite.rating}</div>
            </div>
            <div class="p-3 bg-gray-900 text-white rounded">
              <div class="font-medium mb-1">Sobre fondo negro</div>
              <div class="text-gray-300">Contraste: ${onBlack.ratio}:1</div>
              <div class="${onBlack.isAccessible ? 'text-green-300' : 'text-red-300'}">${onBlack.rating}</div>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    this.accessibilityContainer.innerHTML = html;
  }

  private renderExportOptions(): void {
    if (!this.currentPalette) return;

    this.exportContainer.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button class="export-btn px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors" data-format="css-variables">
          CSS Variables
        </button>
        <button class="export-btn px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors" data-format="scss">
          SCSS
        </button>
        <button class="export-btn px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors" data-format="json">
          JSON
        </button>
        <button class="export-btn px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors" data-format="tailwind">
          Tailwind
        </button>
        <button class="export-btn px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors" data-format="svg">
          SVG
        </button>
        <button class="copy-palette-btn px-3 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors">
          Copiar Todo
        </button>
      </div>
    `;

    // Add export functionality
    const exportButtons = this.exportContainer.querySelectorAll('.export-btn');
    exportButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const format = (e.target as HTMLElement).dataset.format as ExportFormat;
        this.exportPalette(format);
      });
    });

    const copyPaletteBtn = this.exportContainer.querySelector('.copy-palette-btn');
    copyPaletteBtn?.addEventListener('click', () => this.copyFullPalette());
  }

  private async exportPalette(format: ExportFormat): Promise<void> {
    if (!this.currentPalette) return;

    const result = exportPalette(this.currentPalette, {
      format,
      includeNames: false,
      includeMetadata: true,
      prefix: 'primary'
    });

    if (result.success) {
      // Create and trigger download
      const blob = new Blob([result.content], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.updateStatus(`Paleta exportada como ${format.toUpperCase()}`, 'success');
      trackUserInteraction.copyResult(ToolNames.COLOR_PALETTE);
    } else {
      this.updateStatus(`Error exportando: ${result.error}`, 'error');
    }
  }

  private async copyFullPalette(): Promise<void> {
    if (!this.currentPalette) return;

    const colors = this.currentPalette.colors.map(color => color.hex).join(', ');
    await this.copyToClipboard(colors);
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.updateStatus(`Copiado: ${text}`, 'success');
      trackUserInteraction.copyResult(ToolNames.COLOR_PALETTE);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      this.updateStatus('Error al copiar al portapapeles', 'error');
    }
  }

  private loadExamplePalette(type: string): void {
    const examples = {
      sunset: '#ff6b35',
      ocean: '#0077be',
      forest: '#2d5016'
    };

    const baseHex = examples[type as keyof typeof examples];
    if (baseHex) {
      const color = createColorFromHex(baseHex);
      if (color) {
        this.updateBaseColor(color);
        this.currentHarmony = 'analogous';
        this.harmonySelect.value = 'analogous';
        this.generatePalette();
      }
    }
  }

  private updateStatus(message: string, type: 'success' | 'error' | 'neutral'): void {
    const colorClasses = {
      success: 'border-green-200 bg-green-50 text-green-800',
      error: 'border-red-200 bg-red-50 text-red-800',
      neutral: 'border-gray-200 bg-gray-50 text-gray-600'
    };

    this.statusDiv.className = `p-4 rounded-lg border ${colorClasses[type]}`;
    this.statusDiv.textContent = message;
  }
}