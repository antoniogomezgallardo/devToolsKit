import { 
  generatePassword, 
  generateBatchPasswords,
  getDefaultOptions,
  isSecureRandomSupported,
  getPasswordStats
} from './utils';
import { trackPasswordGenerator, trackUserInteraction, ToolNames } from '../../utils/analytics';
import type { PasswordOptions, PasswordGenerationResult, BatchGenerationResult } from './types';

export class PasswordGenerator {
  private container: HTMLElement;
  private options: PasswordOptions = getDefaultOptions();
  private currentPassword: string = '';
  
  // UI Elements
  private lengthSlider!: HTMLInputElement;
  private lengthDisplay!: HTMLElement;
  private uppercaseCheckbox!: HTMLInputElement;
  private lowercaseCheckbox!: HTMLInputElement;
  private numbersCheckbox!: HTMLInputElement;
  private symbolsCheckbox!: HTMLInputElement;
  private excludeSimilarCheckbox!: HTMLInputElement;
  private excludeAmbiguousCheckbox!: HTMLInputElement;
  private passwordOutput!: HTMLTextAreaElement;
  private generateBtn!: HTMLButtonElement;
  private copyBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
  private batchCountInput!: HTMLInputElement;
  private generateBatchBtn!: HTMLButtonElement;
  private batchOutput!: HTMLTextAreaElement;
  private strengthIndicator!: HTMLElement;
  private strengthLabel!: HTMLElement;
  private strengthFeedback!: HTMLElement;
  private statsContainer!: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    this.render();
    this.bindEvents();
    this.checkBrowserSupport();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">🔒 Generador de Contraseñas</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Genera contraseñas seguras y personalizables con indicadores de fortaleza en tiempo real. 
            Todas las contraseñas se generan localmente para máxima seguridad.
          </p>
        </div>

        <!-- Main Interface -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Configuration Panel -->
          <div class="space-y-6">
            
            <!-- Password Length -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Longitud de Contraseña</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Caracteres:</span>
                  <span id="length-display" class="text-2xl font-bold text-primary-600">16</span>
                </div>
                <input 
                  type="range" 
                  id="length-slider" 
                  min="8" 
                  max="128" 
                  value="16"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                >
                <div class="flex justify-between text-xs text-gray-500">
                  <span>8</span>
                  <span>128</span>
                </div>
              </div>
            </div>

            <!-- Character Sets -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Tipos de Caracteres</h3>
              <div class="space-y-3">
                <label class="flex items-center space-x-3">
                  <input type="checkbox" id="uppercase-checkbox" checked 
                         class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                  <span class="text-gray-700">Mayúsculas (A-Z)</span>
                </label>
                
                <label class="flex items-center space-x-3">
                  <input type="checkbox" id="lowercase-checkbox" checked 
                         class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                  <span class="text-gray-700">Minúsculas (a-z)</span>
                </label>
                
                <label class="flex items-center space-x-3">
                  <input type="checkbox" id="numbers-checkbox" checked 
                         class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                  <span class="text-gray-700">Números (0-9)</span>
                </label>
                
                <label class="flex items-center space-x-3">
                  <input type="checkbox" id="symbols-checkbox" checked 
                         class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                  <span class="text-gray-700">Símbolos (!@#$%^&*)</span>
                </label>
              </div>
            </div>

            <!-- Advanced Options -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Opciones Avanzadas</h3>
              <div class="space-y-3">
                <label class="flex items-center space-x-3">
                  <input type="checkbox" id="exclude-similar-checkbox" 
                         class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                  <span class="text-gray-700">Excluir caracteres similares (il1Lo0O)</span>
                </label>
                
                <label class="flex items-center space-x-3">
                  <input type="checkbox" id="exclude-ambiguous-checkbox" 
                         class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                  <span class="text-gray-700">Excluir caracteres ambiguos ({}[]()\/)</span>
                </label>
              </div>
            </div>

            <!-- Batch Generation -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Generación por Lotes</h3>
              <div class="flex items-center space-x-4">
                <input 
                  type="number" 
                  id="batch-count" 
                  min="2" 
                  max="20" 
                  value="5"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                <span class="text-gray-600">contraseñas</span>
                <button 
                  id="generate-batch-btn"
                  class="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors font-medium"
                >
                  Generar Lote
                </button>
              </div>
            </div>

          </div>

          <!-- Results Panel -->
          <div class="space-y-6">
            
            <!-- Single Password -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Contraseña Generada</h3>
                <div class="flex space-x-2">
                  <button 
                    id="generate-btn"
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                  >
                    🔄 Generar
                  </button>
                  <button 
                    id="copy-btn"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>
              
              <textarea 
                id="password-output"
                readonly
                class="w-full h-24 p-3 border border-gray-300 rounded-lg font-mono text-lg bg-gray-50 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Haz clic en 'Generar' para crear una contraseña..."
              ></textarea>
            </div>

            <!-- Password Strength -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Fortaleza de la Contraseña</h3>
              
              <!-- Strength Indicator -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-600">Fortaleza:</span>
                  <span id="strength-label" class="font-medium text-gray-500">Sin evaluar</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    id="strength-indicator" 
                    class="h-3 rounded-full transition-all duration-300 bg-gray-300"
                    style="width: 0%"
                  ></div>
                </div>
              </div>

              <!-- Strength Feedback -->
              <div id="strength-feedback" class="text-sm text-gray-600">
                Genera una contraseña para ver su fortaleza
              </div>
            </div>

            <!-- Password Statistics -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div id="stats-container" class="text-sm text-gray-600">
                Las estadísticas aparecerán aquí después de generar una contraseña
              </div>
            </div>

            <!-- Batch Results -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Lote de Contraseñas</h3>
                <button 
                  id="clear-batch-btn"
                  class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                >
                  Limpiar
                </button>
              </div>
              
              <textarea 
                id="batch-output"
                readonly
                class="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="El lote de contraseñas aparecerá aquí..."
              ></textarea>
            </div>

          </div>
        </div>

        <!-- Security Notice -->
        <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start space-x-3">
            <span class="text-blue-600 text-xl">🛡️</span>
            <div>
              <h4 class="font-semibold text-blue-900 mb-2">Seguridad y Privacidad</h4>
              <p class="text-blue-800 text-sm mb-2">
                Todas las contraseñas se generan completamente en tu navegador usando la API Web Crypto.
                Ninguna contraseña es enviada a servidores externos.
              </p>
              <ul class="text-blue-700 text-sm space-y-1">
                <li>• Generación criptográficamente segura</li>
                <li>• Procesamiento 100% local</li>
                <li>• Sin almacenamiento en servidor</li>
                <li>• Compatible con gestores de contraseñas</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Examples -->
        <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ejemplos de Configuración</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="standard">
              <h4 class="font-medium text-gray-900">🔐 Estándar</h4>
              <p class="text-sm text-gray-600">16 caracteres, todos los tipos</p>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="strong">
              <h4 class="font-medium text-gray-900">💪 Ultra Segura</h4>
              <p class="text-sm text-gray-600">32 caracteres, máxima fortaleza</p>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="simple">
              <h4 class="font-medium text-gray-900">📝 Simple</h4>
              <p class="text-sm text-gray-600">12 caracteres, sin símbolos</p>
            </button>
          </div>
        </div>
      </div>
    `;

    this.initializeElements();
    this.updateOptionsFromUI();
  }

  private initializeElements(): void {
    // Configuration elements
    this.lengthSlider = this.container.querySelector('#length-slider') as HTMLInputElement;
    this.lengthDisplay = this.container.querySelector('#length-display') as HTMLElement;
    this.uppercaseCheckbox = this.container.querySelector('#uppercase-checkbox') as HTMLInputElement;
    this.lowercaseCheckbox = this.container.querySelector('#lowercase-checkbox') as HTMLInputElement;
    this.numbersCheckbox = this.container.querySelector('#numbers-checkbox') as HTMLInputElement;
    this.symbolsCheckbox = this.container.querySelector('#symbols-checkbox') as HTMLInputElement;
    this.excludeSimilarCheckbox = this.container.querySelector('#exclude-similar-checkbox') as HTMLInputElement;
    this.excludeAmbiguousCheckbox = this.container.querySelector('#exclude-ambiguous-checkbox') as HTMLInputElement;
    
    // Action elements
    this.generateBtn = this.container.querySelector('#generate-btn') as HTMLButtonElement;
    this.copyBtn = this.container.querySelector('#copy-btn') as HTMLButtonElement;
    this.clearBtn = this.container.querySelector('#clear-batch-btn') as HTMLButtonElement;
    this.batchCountInput = this.container.querySelector('#batch-count') as HTMLInputElement;
    this.generateBatchBtn = this.container.querySelector('#generate-batch-btn') as HTMLButtonElement;
    
    // Output elements
    this.passwordOutput = this.container.querySelector('#password-output') as HTMLTextAreaElement;
    this.batchOutput = this.container.querySelector('#batch-output') as HTMLTextAreaElement;
    
    // Display elements
    this.strengthIndicator = this.container.querySelector('#strength-indicator') as HTMLElement;
    this.strengthLabel = this.container.querySelector('#strength-label') as HTMLElement;
    this.strengthFeedback = this.container.querySelector('#strength-feedback') as HTMLElement;
    this.statsContainer = this.container.querySelector('#stats-container') as HTMLElement;
  }

  private bindEvents(): void {
    // Length slider
    this.lengthSlider.addEventListener('input', () => {
      const length = parseInt(this.lengthSlider.value);
      this.lengthDisplay.textContent = length.toString();
      this.options.length = length;
      this.generatePasswordIfAutoUpdate();
    });

    // Character type checkboxes
    const checkboxes = [
      { element: this.uppercaseCheckbox, property: 'includeUppercase' as keyof PasswordOptions },
      { element: this.lowercaseCheckbox, property: 'includeLowercase' as keyof PasswordOptions },
      { element: this.numbersCheckbox, property: 'includeNumbers' as keyof PasswordOptions },
      { element: this.symbolsCheckbox, property: 'includeSymbols' as keyof PasswordOptions },
      { element: this.excludeSimilarCheckbox, property: 'excludeSimilar' as keyof PasswordOptions },
      { element: this.excludeAmbiguousCheckbox, property: 'excludeAmbiguous' as keyof PasswordOptions }
    ];

    checkboxes.forEach(({ element, property }) => {
      element.addEventListener('change', () => {
        (this.options as any)[property] = element.checked;
        this.generatePasswordIfAutoUpdate();
      });
    });

    // Generate buttons
    this.generateBtn.addEventListener('click', () => this.generateSinglePassword());
    this.generateBatchBtn.addEventListener('click', () => this.generatePasswordBatch());

    // Copy and clear buttons
    this.copyBtn.addEventListener('click', () => this.copyPassword());
    this.clearBtn.addEventListener('click', () => this.clearBatch());

    // Example buttons
    this.container.querySelectorAll('.example-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const example = (e.currentTarget as HTMLElement).dataset.example;
        this.loadExample(example!);
      });
    });
  }

  private checkBrowserSupport(): void {
    if (!isSecureRandomSupported()) {
      const notice = document.createElement('div');
      notice.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-6';
      notice.innerHTML = `
        <div class="flex items-center space-x-2">
          <span class="text-red-600">⚠️</span>
          <span class="text-red-800 font-medium">Advertencia de Seguridad</span>
        </div>
        <p class="text-red-700 text-sm mt-1">
          Tu navegador no soporta generación criptográficamente segura. 
          Las contraseñas generadas pueden ser menos seguras.
        </p>
      `;
      this.container.insertBefore(notice, this.container.firstChild);
    }
  }

  private updateOptionsFromUI(): void {
    this.options = {
      length: parseInt(this.lengthSlider.value),
      includeUppercase: this.uppercaseCheckbox.checked,
      includeLowercase: this.lowercaseCheckbox.checked,
      includeNumbers: this.numbersCheckbox.checked,
      includeSymbols: this.symbolsCheckbox.checked,
      excludeSimilar: this.excludeSimilarCheckbox.checked,
      excludeAmbiguous: this.excludeAmbiguousCheckbox.checked
    };
  }

  private generatePasswordIfAutoUpdate(): void {
    // Auto-generate if there's already a password (real-time updates)
    if (this.currentPassword) {
      this.generateSinglePassword();
    }
  }

  private generateSinglePassword(): void {
    this.updateOptionsFromUI();
    
    const result: PasswordGenerationResult = generatePassword(this.options);
    
    // Track generation attempt
    trackPasswordGenerator.generate(this.options.length, this.options);

    if (result.success && result.password) {
      this.currentPassword = result.password;
      this.passwordOutput.value = result.password;
      this.copyBtn.disabled = false;
      
      // Update strength display
      if (result.strength) {
        this.updateStrengthDisplay(result.strength);
      }
      
      // Update stats
      if (result.entropy) {
        const stats = getPasswordStats(result.password, this.options);
        this.updateStatsDisplay(stats);
      }
      
      // Track successful generation
      trackPasswordGenerator.success(this.options.length, result.strength?.score || 0, result.entropy || 0);
    } else {
      this.currentPassword = '';
      this.passwordOutput.value = '';
      this.copyBtn.disabled = true;
      this.showError(result.error || 'Error desconocido al generar contraseña');
      
      // Track generation error
      trackPasswordGenerator.error(this.options.length, result.error || 'unknown_error');
    }
  }

  private generatePasswordBatch(): void {
    this.updateOptionsFromUI();
    const count = parseInt(this.batchCountInput.value);
    
    const result: BatchGenerationResult = generateBatchPasswords({
      ...this.options,
      count
    });

    // Track batch generation
    trackPasswordGenerator.generateBatch(count, this.options);

    if (result.success && result.passwords) {
      this.batchOutput.value = result.passwords.join('\n');
      
      // Track successful batch generation
      trackPasswordGenerator.batchSuccess(count, result.passwords.length);
    } else {
      this.batchOutput.value = '';
      this.showError(result.error || 'Error al generar lote de contraseñas');
      
      // Track batch error
      trackPasswordGenerator.batchError(count, result.error || 'unknown_error');
    }
  }

  private updateStrengthDisplay(strength: any): void {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const widths = ['0%', '20%', '40%', '60%', '80%', '100%'];
    
    this.strengthIndicator.className = `h-3 rounded-full transition-all duration-300 ${colors[strength.score]}`;
    this.strengthIndicator.style.width = widths[strength.score];
    this.strengthLabel.textContent = strength.label;
    this.strengthFeedback.innerHTML = strength.feedback.map((f: string) => `• ${f}`).join('<br>');
  }

  private updateStatsDisplay(stats: Record<string, any>): void {
    const entries = Object.entries(stats).map(([key, value]) => 
      `<div class="flex justify-between"><span class="text-gray-600">${key}:</span><span class="font-medium">${value}</span></div>`
    ).join('');

    this.statsContainer.innerHTML = `<div class="space-y-2">${entries}</div>`;
  }

  private async copyPassword(): Promise<void> {
    if (!this.currentPassword) return;

    try {
      await navigator.clipboard.writeText(this.currentPassword);
      
      const originalText = this.copyBtn.textContent;
      this.copyBtn.textContent = '✅ ¡Copiado!';
      this.copyBtn.classList.add('bg-green-700');
      
      // Track copy action
      trackUserInteraction.copyResult(ToolNames.PASSWORD_GENERATOR);
      
      setTimeout(() => {
        this.copyBtn.textContent = originalText;
        this.copyBtn.classList.remove('bg-green-700');
      }, 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      this.showError('Error al copiar al portapapeles');
    }
  }

  private clearBatch(): void {
    this.batchOutput.value = '';
    
    // Track clear action
    trackUserInteraction.clearInput(ToolNames.PASSWORD_GENERATOR);
  }

  private loadExample(type: string): void {
    const examples = {
      standard: {
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false
      },
      strong: {
        length: 32,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: true,
        excludeAmbiguous: true
      },
      simple: {
        length: 12,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        excludeSimilar: false,
        excludeAmbiguous: false
      }
    };

    const example = examples[type as keyof typeof examples];
    if (example) {
      this.options = example;
      this.updateUIFromOptions();
      this.generateSinglePassword();
    }
  }

  private updateUIFromOptions(): void {
    this.lengthSlider.value = this.options.length.toString();
    this.lengthDisplay.textContent = this.options.length.toString();
    this.uppercaseCheckbox.checked = this.options.includeUppercase;
    this.lowercaseCheckbox.checked = this.options.includeLowercase;
    this.numbersCheckbox.checked = this.options.includeNumbers;
    this.symbolsCheckbox.checked = this.options.includeSymbols;
    this.excludeSimilarCheckbox.checked = this.options.excludeSimilar;
    this.excludeAmbiguousCheckbox.checked = this.options.excludeAmbiguous;
  }

  private showError(message: string): void {
    // Simple error display - could be enhanced with toast notifications
    console.error('Password Generator Error:', message);
    
    // Update strength display to show error
    this.strengthLabel.textContent = 'Error';
    this.strengthFeedback.textContent = message;
    this.strengthIndicator.className = 'h-3 rounded-full transition-all duration-300 bg-red-500';
    this.strengthIndicator.style.width = '100%';
  }
}