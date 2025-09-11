import { TextArea } from '../../components/ui/TextArea';
import { validateAndFormatJSON, getJSONInfo } from './utils';
import { trackJSONValidator, trackUserInteraction, ToolNames } from '../../utils/analytics';

export class JSONValidator {
  private container: HTMLElement;
  private inputTextArea!: HTMLTextAreaElement;
  private outputTextArea!: HTMLTextAreaElement;
  private validateBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
  private copyBtn!: HTMLButtonElement;
  private statusDiv!: HTMLElement;
  private infoDiv!: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.bindEvents();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Validador JSON</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Valida, formatea y analiza código JSON con detección de errores en tiempo real. 
            Pega tu JSON y obtén un formato limpio al instante.
          </p>
        </div>

        <!-- Tool Interface -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <!-- Input Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">JSON de entrada</h2>
              <div class="flex space-x-2">
                <button id="clear-btn" class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors">
                  Limpiar
                </button>
              </div>
            </div>
            <div id="input-container"></div>
            <div class="flex space-x-3">
              <button id="validate-btn" class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium">
                Validar y Formatear
              </button>
            </div>
          </div>

          <!-- Output Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">JSON formateado</h2>
              <button id="copy-btn" class="px-3 py-1 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Copiar
              </button>
            </div>
            <div id="output-container"></div>
          </div>
        </div>

        <!-- Status and Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="status-container" class="p-4 rounded-lg border"></div>
          <div id="info-container" class="p-4 rounded-lg border bg-gray-50"></div>
        </div>

        <!-- Examples -->
        <div class="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ejemplos de uso</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="object">
              <h4 class="font-medium text-gray-900">Objeto simple</h4>
              <p class="text-sm text-gray-600">Ejemplo básico de objeto JSON</p>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="array">
              <h4 class="font-medium text-gray-900">Array de objetos</h4>
              <p class="text-sm text-gray-600">Lista de elementos JSON</p>
            </button>
          </div>
        </div>
      </div>
    `;

    // Create UI components
    const inputContainer = this.container.querySelector('#input-container') as HTMLElement;
    const outputContainer = this.container.querySelector('#output-container') as HTMLElement;
    
    this.inputTextArea = TextArea({
      placeholder: 'Pega aquí tu código JSON...',
      rows: 12,
      className: 'font-mono text-sm'
    });
    
    this.outputTextArea = TextArea({
      placeholder: 'El JSON formateado aparecerá aquí...',
      rows: 12,
      readonly: true,
      className: 'font-mono text-sm bg-gray-50'
    });

    inputContainer.appendChild(this.inputTextArea);
    outputContainer.appendChild(this.outputTextArea);

    // Get button references
    this.validateBtn = this.container.querySelector('#validate-btn') as HTMLButtonElement;
    this.clearBtn = this.container.querySelector('#clear-btn') as HTMLButtonElement;
    this.copyBtn = this.container.querySelector('#copy-btn') as HTMLButtonElement;
    this.statusDiv = this.container.querySelector('#status-container') as HTMLElement;
    this.infoDiv = this.container.querySelector('#info-container') as HTMLElement;

    // Initialize status
    this.updateStatus('Introduce JSON para validar', 'neutral');
    this.updateInfo(null);
  }

  private bindEvents(): void {
    // Real-time validation
    this.inputTextArea.addEventListener('input', () => {
      const value = this.inputTextArea.value.trim();
      if (value) {
        this.validateJSON();
      } else {
        this.clearOutput();
      }
    });

    // Validate button
    this.validateBtn.addEventListener('click', () => this.validateJSON());

    // Clear button
    this.clearBtn.addEventListener('click', () => this.clearAll());

    // Copy button
    this.copyBtn.addEventListener('click', () => this.copyOutput());

    // Example buttons
    const exampleButtons = this.container.querySelectorAll('.example-btn');
    exampleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const example = (e.currentTarget as HTMLElement).dataset.example;
        this.loadExample(example!);
      });
    });
  }

  private validateJSON(): void {
    const input = this.inputTextArea.value;
    const result = validateAndFormatJSON(input);

    // Track validation attempt
    trackJSONValidator.validate(input.length);

    if (result.isValid && result.formatted) {
      this.outputTextArea.value = result.formatted;
      this.updateStatus('✅ JSON válido y formateado', 'success');
      this.copyBtn.disabled = false;
      
      const info = getJSONInfo(input);
      this.updateInfo(info);
      
      // Track successful validation
      trackJSONValidator.success(input.length, result.formatted.length);
    } else {
      this.outputTextArea.value = '';
      this.copyBtn.disabled = true;
      
      let errorMsg = `❌ ${result.error}`;
      if (result.errorLine && result.errorColumn) {
        errorMsg += ` (Línea ${result.errorLine}, Columna ${result.errorColumn})`;
      }
      
      this.updateStatus(errorMsg, 'error');
      this.updateInfo(null);
      
      // Track validation error
      trackJSONValidator.error(input.length, result.error || 'unknown_error');
    }
  }

  private clearAll(): void {
    this.inputTextArea.value = '';
    this.clearOutput();
    
    // Track clear action
    trackUserInteraction.clearInput(ToolNames.JSON_VALIDATOR);
  }

  private clearOutput(): void {
    this.outputTextArea.value = '';
    this.copyBtn.disabled = true;
    this.updateStatus('Introduce JSON para validar', 'neutral');
    this.updateInfo(null);
  }

  private async copyOutput(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.outputTextArea.value);
      const originalText = this.copyBtn.textContent;
      this.copyBtn.textContent = '¡Copiado!';
      this.copyBtn.classList.add('bg-green-100', 'text-green-700');
      
      // Track copy action
      trackUserInteraction.copyResult(ToolNames.JSON_VALIDATOR);
      
      setTimeout(() => {
        this.copyBtn.textContent = originalText;
        this.copyBtn.classList.remove('bg-green-100', 'text-green-700');
      }, 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
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

  private updateInfo(info: { [key: string]: any } | null): void {
    if (!info) {
      this.infoDiv.innerHTML = `
        <h3 class="font-medium text-gray-900 mb-2">Información del JSON</h3>
        <p class="text-sm text-gray-500">Valida un JSON para ver estadísticas</p>
      `;
      return;
    }

    const infoEntries = Object.entries(info).map(([key, value]) => 
      `<div class="flex justify-between"><span class="text-gray-600">${key}:</span><span class="font-medium">${value}</span></div>`
    ).join('');

    this.infoDiv.innerHTML = `
      <h3 class="font-medium text-gray-900 mb-3">Información del JSON</h3>
      <div class="space-y-2 text-sm">${infoEntries}</div>
    `;
  }

  private loadExample(type: string): void {
    const examples = {
      object: JSON.stringify({
        "name": "Juan Pérez",
        "age": 30,
        "email": "juan@example.com",
        "active": true,
        "address": {
          "street": "Calle Mayor 123",
          "city": "Madrid",
          "zipCode": "28001"
        }
      }),
      array: JSON.stringify([
        {"id": 1, "name": "Producto A", "price": 29.99},
        {"id": 2, "name": "Producto B", "price": 45.50},
        {"id": 3, "name": "Producto C", "price": 12.75}
      ])
    };

    this.inputTextArea.value = examples[type as keyof typeof examples] || '';
    this.validateJSON();
  }
}