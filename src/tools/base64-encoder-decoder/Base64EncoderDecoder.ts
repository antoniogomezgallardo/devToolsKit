import { TextArea } from '../../components/ui/TextArea';
import { encodeBase64, decodeBase64, getBase64Stats, readFileAsBase64, formatBase64 } from './utils';
import { trackUserInteraction, trackBase64EncoderDecoder, ToolNames } from '../../utils/analytics';
import type { EncodingType } from './types';

export class Base64EncoderDecoder {
  private container: HTMLElement;
  private inputTextArea!: HTMLTextAreaElement;
  private outputTextArea!: HTMLTextAreaElement;
  private encodeBtn!: HTMLButtonElement;
  private decodeBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
  private copyBtn!: HTMLButtonElement;
  private fileInput!: HTMLInputElement;
  private formatBtn!: HTMLButtonElement;
  private statusDiv!: HTMLElement;
  private infoDiv!: HTMLElement;
  private currentMode: EncodingType = 'encode';

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
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Base64 Encoder/Decoder</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Codifica y decodifica texto o archivos en Base64. Perfecto para codificar datos binarios, 
            imágenes o texto para transmisión segura.
          </p>
        </div>

        <!-- Mode Toggle -->
        <div class="flex justify-center mb-6">
          <div class="bg-gray-100 rounded-lg p-1 flex">
            <button id="encode-mode" data-testid="encode-mode-btn" class="px-4 py-2 rounded-md font-medium text-sm transition-colors bg-primary-600 text-white">
              Codificar
            </button>
            <button id="decode-mode" data-testid="decode-mode-btn" class="px-4 py-2 rounded-md font-medium text-sm transition-colors text-gray-600 hover:text-gray-900">
              Decodificar
            </button>
          </div>
        </div>

        <!-- Tool Interface -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <!-- Input Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900" id="input-title">Texto a codificar</h2>
              <div class="flex space-x-2">
                <input type="file" id="file-input" class="hidden" accept="*/*">
                <button id="file-btn" data-testid="file-btn" class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors">
                  📁 Archivo
                </button>
                <button id="clear-btn" data-testid="clear-btn" class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors">
                  Limpiar
                </button>
              </div>
            </div>
            <div id="input-container"></div>
            <div class="flex space-x-3">
              <button id="encode-btn" data-testid="encode-action-btn" class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium">
                🔒 Codificar
              </button>
              <button id="decode-btn" data-testid="decode-action-btn" class="flex-1 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg transition-colors font-medium hidden">
                🔓 Decodificar
              </button>
            </div>
          </div>

          <!-- Output Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900" id="output-title">Base64 codificado</h2>
              <div class="flex space-x-2">
                <button id="format-btn" data-testid="format-btn" class="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  📝 Formatear
                </button>
                <button id="copy-btn" data-testid="copy-btn" class="px-3 py-1 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Copiar
                </button>
              </div>
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="simple">
              <h4 class="font-medium text-gray-900">Texto simple</h4>
              <p class="text-sm text-gray-600">Ejemplo básico de codificación</p>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="url">
              <h4 class="font-medium text-gray-900">URL completa</h4>
              <p class="text-sm text-gray-600">Codificación de URL con parámetros</p>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="json">
              <h4 class="font-medium text-gray-900">JSON complejo</h4>
              <p class="text-sm text-gray-600">Objeto JSON con caracteres especiales</p>
            </button>
          </div>
        </div>
      </div>
    `;

    // Create UI components
    const inputContainer = this.container.querySelector('#input-container') as HTMLElement;
    const outputContainer = this.container.querySelector('#output-container') as HTMLElement;
    
    this.inputTextArea = TextArea({
      placeholder: 'Escribe o pega aquí el texto a codificar...',
      rows: 12,
      className: 'font-mono text-sm'
    });
    
    this.outputTextArea = TextArea({
      placeholder: 'El resultado aparecerá aquí...',
      rows: 12,
      readonly: true,
      className: 'font-mono text-sm bg-gray-50'
    });

    inputContainer.appendChild(this.inputTextArea);
    outputContainer.appendChild(this.outputTextArea);

    // Get button references
    this.encodeBtn = this.container.querySelector('#encode-btn') as HTMLButtonElement;
    this.decodeBtn = this.container.querySelector('#decode-btn') as HTMLButtonElement;
    this.clearBtn = this.container.querySelector('#clear-btn') as HTMLButtonElement;
    this.copyBtn = this.container.querySelector('#copy-btn') as HTMLButtonElement;
    this.fileInput = this.container.querySelector('#file-input') as HTMLInputElement;
    this.formatBtn = this.container.querySelector('#format-btn') as HTMLButtonElement;
    this.statusDiv = this.container.querySelector('#status-container') as HTMLElement;
    this.infoDiv = this.container.querySelector('#info-container') as HTMLElement;

    // Initialize status
    this.updateStatus('Introduce texto para codificar', 'neutral');
    this.updateInfo(null);
  }

  private bindEvents(): void {
    // Mode toggle buttons
    const encodeModeBtn = this.container.querySelector('#encode-mode') as HTMLButtonElement;
    const decodeModeBtn = this.container.querySelector('#decode-mode') as HTMLButtonElement;
    const fileBtnElement = this.container.querySelector('#file-btn') as HTMLButtonElement;

    encodeModeBtn.addEventListener('click', () => this.switchMode('encode'));
    decodeModeBtn.addEventListener('click', () => this.switchMode('decode'));

    // Real-time processing
    this.inputTextArea.addEventListener('input', () => {
      const value = this.inputTextArea.value.trim();
      if (value) {
        this.processInput();
      } else {
        this.clearOutput();
      }
    });

    // Action buttons
    this.encodeBtn.addEventListener('click', () => this.encode());
    this.decodeBtn.addEventListener('click', () => this.decode());
    this.clearBtn.addEventListener('click', () => this.clearAll());
    this.copyBtn.addEventListener('click', () => this.copyOutput());
    this.formatBtn.addEventListener('click', () => this.formatOutput());

    // File input
    fileBtnElement.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', () => this.handleFileInput());

    // Example buttons
    const exampleButtons = this.container.querySelectorAll('.example-btn');
    exampleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const example = (e.currentTarget as HTMLElement).dataset.example;
        this.loadExample(example!);
      });
    });
  }

  private switchMode(mode: EncodingType): void {
    this.currentMode = mode;
    
    const encodeModeBtn = this.container.querySelector('#encode-mode') as HTMLButtonElement;
    const decodeModeBtn = this.container.querySelector('#decode-mode') as HTMLButtonElement;
    const inputTitle = this.container.querySelector('#input-title') as HTMLElement;
    const outputTitle = this.container.querySelector('#output-title') as HTMLElement;
    const fileBtn = this.container.querySelector('#file-btn') as HTMLButtonElement;

    if (mode === 'encode') {
      encodeModeBtn.className = 'px-4 py-2 rounded-md font-medium text-sm transition-colors bg-primary-600 text-white';
      decodeModeBtn.className = 'px-4 py-2 rounded-md font-medium text-sm transition-colors text-gray-600 hover:text-gray-900';
      
      inputTitle.textContent = 'Texto a codificar';
      outputTitle.textContent = 'Base64 codificado';
      this.inputTextArea.placeholder = 'Escribe o pega aquí el texto a codificar...';
      
      this.encodeBtn.classList.remove('hidden');
      this.decodeBtn.classList.add('hidden');
      fileBtn.classList.remove('hidden');
      
    } else {
      decodeModeBtn.className = 'px-4 py-2 rounded-md font-medium text-sm transition-colors bg-primary-600 text-white';
      encodeModeBtn.className = 'px-4 py-2 rounded-md font-medium text-sm transition-colors text-gray-600 hover:text-gray-900';
      
      inputTitle.textContent = 'Base64 a decodificar';
      outputTitle.textContent = 'Texto decodificado';
      this.inputTextArea.placeholder = 'Pega aquí el código Base64 a decodificar...';
      
      this.decodeBtn.classList.remove('hidden');
      this.encodeBtn.classList.add('hidden');
      fileBtn.classList.add('hidden');
    }

    this.clearAll();
  }

  private processInput(): void {
    if (this.currentMode === 'encode') {
      this.encode();
    } else {
      this.decode();
    }
  }

  private encode(): void {
    const input = this.inputTextArea.value;
    const result = encodeBase64(input);

    // Track encoding attempt
    trackBase64EncoderDecoder.encode(input.length, result.result.length);

    if (result.success) {
      this.outputTextArea.value = result.result;
      this.updateStatus('✅ Texto codificado exitosamente', 'success');
      this.copyBtn.disabled = false;
      this.formatBtn.disabled = false;
      
      const stats = getBase64Stats(input, result.result, true);
      this.updateInfo(stats);

      // Track successful encoding
      trackBase64EncoderDecoder.success('encode', input.length, result.result.length);
    } else {
      this.outputTextArea.value = '';
      this.copyBtn.disabled = true;
      this.formatBtn.disabled = true;
      this.updateStatus(`❌ ${result.error}`, 'error');
      this.updateInfo(null);

      // Track encoding error
      trackBase64EncoderDecoder.error('encode', input.length, result.error || 'unknown_error');
    }
  }

  private decode(): void {
    const input = this.inputTextArea.value;
    const result = decodeBase64(input);

    // Track decoding attempt
    trackBase64EncoderDecoder.decode(input.length, result.result.length);

    if (result.success) {
      this.outputTextArea.value = result.result;
      this.updateStatus('✅ Base64 decodificado exitosamente', 'success');
      this.copyBtn.disabled = false;
      this.formatBtn.disabled = true;
      
      const stats = getBase64Stats(result.result, input, false);
      this.updateInfo(stats);

      // Track successful decoding
      trackBase64EncoderDecoder.success('decode', input.length, result.result.length);
    } else {
      this.outputTextArea.value = '';
      this.copyBtn.disabled = true;
      this.formatBtn.disabled = true;
      this.updateStatus(`❌ ${result.error}`, 'error');
      this.updateInfo(null);

      // Track decoding error
      trackBase64EncoderDecoder.error('decode', input.length, result.error || 'unknown_error');
    }
  }

  private async handleFileInput(): Promise<void> {
    const file = this.fileInput.files?.[0];
    if (!file) return;

    this.updateStatus('📁 Procesando archivo...', 'neutral');
    
    // Track file upload
    trackBase64EncoderDecoder.fileUpload(file.size, file.type);
    
    try {
      const result = await readFileAsBase64(file);
      
      if (result.success) {
        this.inputTextArea.value = `data:${file.type};base64,${result.result}`;
        this.encode();
        this.updateStatus(`✅ Archivo "${file.name}" cargado y codificado`, 'success');
      } else {
        this.updateStatus(`❌ ${result.error}`, 'error');
      }
    } catch (error) {
      this.updateStatus('❌ Error al procesar el archivo', 'error');
    }
  }

  private formatOutput(): void {
    if (this.currentMode === 'encode' && this.outputTextArea.value) {
      const formatted = formatBase64(this.outputTextArea.value);
      this.outputTextArea.value = formatted;
      this.updateStatus('✅ Base64 formateado con saltos de línea', 'success');
      
      // Track format action
      trackBase64EncoderDecoder.formatOutput(formatted.length);
    }
  }

  private clearAll(): void {
    this.inputTextArea.value = '';
    this.clearOutput();
    trackUserInteraction.clearInput(ToolNames.BASE64_ENCODER);
  }

  private clearOutput(): void {
    this.outputTextArea.value = '';
    this.copyBtn.disabled = true;
    this.formatBtn.disabled = true;
    this.updateStatus(
      this.currentMode === 'encode' 
        ? 'Introduce texto para codificar' 
        : 'Introduce Base64 para decodificar', 
      'neutral'
    );
    this.updateInfo(null);
  }

  private async copyOutput(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.outputTextArea.value);
      const originalText = this.copyBtn.textContent;
      this.copyBtn.textContent = '¡Copiado!';
      this.copyBtn.classList.add('bg-green-100', 'text-green-700');
      
      trackUserInteraction.copyResult(ToolNames.BASE64_ENCODER);
      
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
        <h3 class="font-medium text-gray-900 mb-2">Estadísticas</h3>
        <p class="text-sm text-gray-500">
          ${this.currentMode === 'encode' ? 'Codifica' : 'Decodifica'} texto para ver estadísticas
        </p>
      `;
      return;
    }

    const infoEntries = Object.entries(info).map(([key, value]) => 
      `<div class="flex justify-between"><span class="text-gray-600">${key}:</span><span class="font-medium">${value}</span></div>`
    ).join('');

    this.infoDiv.innerHTML = `
      <h3 class="font-medium text-gray-900 mb-3">Estadísticas</h3>
      <div class="space-y-2 text-sm">${infoEntries}</div>
    `;
  }

  private loadExample(type: string): void {
    const examples = {
      simple: 'Hola mundo! 👋 Este es un ejemplo simple de texto para codificar en Base64.',
      url: 'https://api.ejemplo.com/datos?param1=valor1&param2=valor con espacios&token=abc123',
      json: JSON.stringify({
        "usuario": "juan@example.com",
        "contraseña": "mi_contraseña_segura",
        "configuración": {
          "idioma": "español",
          "tema": "oscuro",
          "notificaciones": true
        },
        "metadatos": {
          "creado": "2024-01-15T10:30:00Z",
          "última_conexión": "2024-01-20T15:45:30Z"
        }
      }, null, 2)
    };

    this.switchMode('encode');
    this.inputTextArea.value = examples[type as keyof typeof examples] || '';
    this.encode();
  }
}