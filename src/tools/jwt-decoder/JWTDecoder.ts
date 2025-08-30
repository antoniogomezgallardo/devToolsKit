import { TextArea } from '../../components/ui/TextArea';
import { decodeJWT, getJWTInfo, validateJWTStructure } from './utils';
import { trackJWTDecoder, trackUserInteraction, ToolNames } from '../../utils/analytics';

export class JWTDecoder {
  private container: HTMLElement;
  private inputTextArea!: HTMLTextAreaElement;
  private headerTextArea!: HTMLTextAreaElement;
  private payloadTextArea!: HTMLTextAreaElement;
  private decodeBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
  private copyHeaderBtn!: HTMLButtonElement;
  private copyPayloadBtn!: HTMLButtonElement;
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
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Decodificador JWT</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Decodifica y analiza tokens JWT (JSON Web Tokens) sin verificar la firma. 
            Visualiza header, payload y información de expiración al instante.
          </p>
        </div>

        <!-- Security Warning -->
        <div class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-amber-800">⚠️ Aviso de Seguridad</h3>
              <p class="text-sm text-amber-700 mt-1">
                Esta herramienta solo decodifica el contenido del JWT. <strong>No verifica la firma ni la autenticidad</strong> del token. 
                No uses tokens sensibles en herramientas online.
              </p>
            </div>
          </div>
        </div>

        <!-- Tool Interface -->
        <div class="space-y-6 mb-8">
          
          <!-- Input Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Token JWT</h2>
              <div class="flex space-x-2">
                <button id="clear-btn" class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors">
                  Limpiar
                </button>
              </div>
            </div>
            <div id="input-container"></div>
            <div class="flex space-x-3">
              <button id="decode-btn" class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium">
                Decodificar JWT
              </button>
            </div>
          </div>

          <!-- Output Sections -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Header Section -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Header</h2>
                <button id="copy-header-btn" class="px-3 py-1 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Copiar
                </button>
              </div>
              <div id="header-container"></div>
            </div>

            <!-- Payload Section -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Payload</h2>
                <button id="copy-payload-btn" class="px-3 py-1 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Copiar
                </button>
              </div>
              <div id="payload-container"></div>
            </div>
          </div>
        </div>

        <!-- Status and Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="status-container" class="p-4 rounded-lg border"></div>
          <div id="info-container" class="p-4 rounded-lg border bg-gray-50"></div>
        </div>

        <!-- Examples -->
        <div class="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ejemplos de JWT</h3>
          <div class="grid grid-cols-1 gap-4">
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors" data-example="standard">
              <h4 class="font-medium text-gray-900">JWT Estándar</h4>
              <p class="text-sm text-gray-600">Token JWT con claims básicos (exp, iat, sub)</p>
            </button>
          </div>
        </div>
      </div>
    `;

    // Create UI components
    const inputContainer = this.container.querySelector('#input-container') as HTMLElement;
    const headerContainer = this.container.querySelector('#header-container') as HTMLElement;
    const payloadContainer = this.container.querySelector('#payload-container') as HTMLElement;
    
    this.inputTextArea = TextArea({
      placeholder: 'Pega aquí tu token JWT...\nEjemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      rows: 4,
      className: 'font-mono text-sm'
    });
    
    this.headerTextArea = TextArea({
      placeholder: 'Header del JWT aparecerá aquí...',
      rows: 8,
      readonly: true,
      className: 'font-mono text-sm bg-gray-50'
    });

    this.payloadTextArea = TextArea({
      placeholder: 'Payload del JWT aparecerá aquí...',
      rows: 8,
      readonly: true,
      className: 'font-mono text-sm bg-gray-50'
    });

    inputContainer.appendChild(this.inputTextArea);
    headerContainer.appendChild(this.headerTextArea);
    payloadContainer.appendChild(this.payloadTextArea);

    // Get button references
    this.decodeBtn = this.container.querySelector('#decode-btn') as HTMLButtonElement;
    this.clearBtn = this.container.querySelector('#clear-btn') as HTMLButtonElement;
    this.copyHeaderBtn = this.container.querySelector('#copy-header-btn') as HTMLButtonElement;
    this.copyPayloadBtn = this.container.querySelector('#copy-payload-btn') as HTMLButtonElement;
    this.statusDiv = this.container.querySelector('#status-container') as HTMLElement;
    this.infoDiv = this.container.querySelector('#info-container') as HTMLElement;

    // Initialize status
    this.updateStatus('Introduce un token JWT para decodificar', 'neutral');
    this.updateInfo(null);
  }

  private bindEvents(): void {
    // Real-time validation and decoding
    this.inputTextArea.addEventListener('input', () => {
      const value = this.inputTextArea.value.trim();
      if (value) {
        this.decodeJWT();
      } else {
        this.clearOutput();
      }
    });

    // Decode button
    this.decodeBtn.addEventListener('click', () => this.decodeJWT());

    // Clear button
    this.clearBtn.addEventListener('click', () => this.clearAll());

    // Copy buttons
    this.copyHeaderBtn.addEventListener('click', () => this.copyContent('header'));
    this.copyPayloadBtn.addEventListener('click', () => this.copyContent('payload'));

    // Example buttons
    const exampleButtons = this.container.querySelectorAll('.example-btn');
    exampleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const example = (e.currentTarget as HTMLElement).dataset.example;
        this.loadExample(example!);
      });
    });
  }

  private decodeJWT(): void {
    const input = this.inputTextArea.value.trim();
    
    // First validate structure
    const structureValidation = validateJWTStructure(input);
    if (!structureValidation.isValid) {
      this.clearOutput();
      this.updateStatus(`❌ ${structureValidation.error}`, 'error');
      this.updateInfo(null);
      
      // Track structure error
      trackJWTDecoder.error(input.length, 'invalid_structure');
      return;
    }

    const result = decodeJWT(input);

    // Track decode attempt
    trackJWTDecoder.decode(input.length, input.split('.').length === 3);

    if (result.isValid && result.decoded && result.formatted) {
      this.headerTextArea.value = result.formatted.header;
      this.payloadTextArea.value = result.formatted.payload;
      
      const statusMessage = result.decoded.isExpired 
        ? '⚠️ JWT decodificado correctamente (Token expirado)'
        : '✅ JWT decodificado correctamente';
      
      const statusType = result.decoded.isExpired ? 'warning' : 'success';
      this.updateStatus(statusMessage, statusType);
      
      this.copyHeaderBtn.disabled = false;
      this.copyPayloadBtn.disabled = false;
      
      const info = getJWTInfo(result.decoded);
      this.updateInfo(info);
      
      // Track successful decode
      trackJWTDecoder.success(
        input.length, 
        result.decoded.header.alg || 'unknown',
        result.decoded.isExpired || false
      );
    } else {
      this.clearOutput();
      this.updateStatus(`❌ ${result.error}`, 'error');
      this.updateInfo(null);
      
      // Track decode error
      trackJWTDecoder.error(input.length, result.error || 'unknown_error');
    }
  }

  private clearAll(): void {
    this.inputTextArea.value = '';
    this.clearOutput();
    
    // Track clear action
    trackUserInteraction.clearInput(ToolNames.JWT_DECODER);
  }

  private clearOutput(): void {
    this.headerTextArea.value = '';
    this.payloadTextArea.value = '';
    this.copyHeaderBtn.disabled = true;
    this.copyPayloadBtn.disabled = true;
    this.updateStatus('Introduce un token JWT para decodificar', 'neutral');
    this.updateInfo(null);
  }

  private async copyContent(type: 'header' | 'payload'): Promise<void> {
    try {
      const textArea = type === 'header' ? this.headerTextArea : this.payloadTextArea;
      const button = type === 'header' ? this.copyHeaderBtn : this.copyPayloadBtn;
      
      await navigator.clipboard.writeText(textArea.value);
      const originalText = button.textContent;
      button.textContent = '¡Copiado!';
      button.classList.add('bg-green-100', 'text-green-700');
      
      // Track copy action
      trackUserInteraction.copyResult(ToolNames.JWT_DECODER);
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-100', 'text-green-700');
      }, 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  }

  private updateStatus(message: string, type: 'success' | 'error' | 'neutral' | 'warning'): void {
    const colorClasses = {
      success: 'border-green-200 bg-green-50 text-green-800',
      error: 'border-red-200 bg-red-50 text-red-800',
      warning: 'border-amber-200 bg-amber-50 text-amber-800',
      neutral: 'border-gray-200 bg-gray-50 text-gray-600'
    };

    this.statusDiv.className = `p-4 rounded-lg border ${colorClasses[type]}`;
    this.statusDiv.textContent = message;
  }

  private updateInfo(info: { [key: string]: any } | null): void {
    if (!info) {
      this.infoDiv.innerHTML = `
        <h3 class="font-medium text-gray-900 mb-2">Información del JWT</h3>
        <p class="text-sm text-gray-500">Decodifica un JWT para ver detalles</p>
      `;
      return;
    }

    const infoEntries = Object.entries(info).map(([key, value]) => 
      `<div class="flex justify-between"><span class="text-gray-600">${key}:</span><span class="font-medium">${value}</span></div>`
    ).join('');

    this.infoDiv.innerHTML = `
      <h3 class="font-medium text-gray-900 mb-3">Información del JWT</h3>
      <div class="space-y-2 text-sm">${infoEntries}</div>
    `;
  }

  private loadExample(type: string): void {
    const examples = {
      standard: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MDA0MzkyMjIsImlzcyI6ImRldnRvb2xza2l0LmNvbSIsImF1ZCI6ImRldmVsb3BlcnMifQ.DzIQfLEYz0P8tnkj8tDDY5qj2ZeOy8xWU-3n5kZfYH4'
    };

    this.inputTextArea.value = examples[type as keyof typeof examples] || '';
    this.decodeJWT();
  }
}