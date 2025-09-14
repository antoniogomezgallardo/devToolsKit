import {
  generateHash,
  generateHashFromFile,
  generateBatchHashes,
  compareHashes,
  formatHash,
  getAvailableAlgorithms,
  isAlgorithmSupported,
  getRecommendedAlgorithm,
  getDefaultOptions
} from './utils';
import { trackUserInteraction, trackHashGenerator, ToolNames } from '../../../utils/analytics';
import type {
  HashOptions,
  BatchHashInput,
  HashAlgorithm
} from './types';

export class HashGenerator {
  private container: HTMLElement;
  private options: HashOptions = getDefaultOptions();
  private currentHashes: Map<HashAlgorithm, string> = new Map();
  private batchResults: Array<{ name: string; hash: string; algorithm: HashAlgorithm }> = [];

  // UI Elements
  private textInput!: HTMLTextAreaElement;
  private algorithmSelect!: HTMLSelectElement;
  private formatSelect!: HTMLSelectElement;
  private uppercaseCheckbox!: HTMLInputElement;
  private separatorsCheckbox!: HTMLInputElement;
  private realtimeCheckbox!: HTMLInputElement;
  private hashOutput!: HTMLTextAreaElement;
  private generateBtn!: HTMLButtonElement;
  private copyBtn!: HTMLButtonElement;
  private clearBtn!: HTMLButtonElement;
  private fileInput!: HTMLInputElement;
  private fileHashOutput!: HTMLTextAreaElement;
  private batchTextarea!: HTMLTextAreaElement;
  private generateBatchBtn!: HTMLButtonElement;
  private batchOutput!: HTMLTextAreaElement;
  private exportBatchBtn!: HTMLButtonElement;
  private hash1Input!: HTMLInputElement;
  private hash2Input!: HTMLInputElement;
  private compareBtn!: HTMLButtonElement;
  private comparisonResult!: HTMLElement;
  private algorithmInfo!: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    this.render();
    this.bindEvents();
    this.updateAlgorithmInfo();
    this.checkBrowserSupport();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">🔐 Generador de Hash</h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Genera hashes seguros con múltiples algoritmos (MD5, SHA-1, SHA-256, SHA-512, CRC-32).
            Soporta texto, archivos y procesamiento por lotes.
          </p>
        </div>

        <!-- Algorithm Selection & Options -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Configuración</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label for="algorithm-select" class="block text-sm font-medium text-gray-700 mb-2">
                Algoritmo
              </label>
              <select
                id="algorithm-select"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <!-- Options will be populated by JavaScript -->
              </select>
            </div>

            <div>
              <label for="format-select" class="block text-sm font-medium text-gray-700 mb-2">
                Formato
              </label>
              <select
                id="format-select"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="hex">Hexadecimal</option>
                <option value="base64">Base64</option>
              </select>
            </div>

            <div class="flex flex-col gap-2">
              <label class="block text-sm font-medium text-gray-700">Opciones</label>
              <label class="flex items-center">
                <input type="checkbox" id="uppercase-checkbox" class="mr-2">
                <span class="text-sm">Mayúsculas</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" id="separators-checkbox" class="mr-2">
                <span class="text-sm">Separadores</span>
              </label>
            </div>

            <div class="flex flex-col gap-2">
              <label class="block text-sm font-medium text-gray-700">Tiempo Real</label>
              <label class="flex items-center">
                <input type="checkbox" id="realtime-checkbox" class="mr-2" checked>
                <span class="text-sm">Hash automático</span>
              </label>
            </div>
          </div>

          <!-- Algorithm Information -->
          <div id="algorithm-info" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
            <!-- Algorithm info will be populated here -->
          </div>
        </div>

        <!-- Text Hash Generator -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Generador de Hash de Texto</h2>

          <div class="space-y-4">
            <div>
              <label for="text-input" class="block text-sm font-medium text-gray-700 mb-2">
                Texto a hash
              </label>
              <textarea
                id="text-input"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Introduce el texto que quieres hashear..."
              ></textarea>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                id="generate-btn"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Generar Hash
              </button>
              <button
                id="copy-btn"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                disabled
              >
                Copiar
              </button>
              <button
                id="clear-btn"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Limpiar
              </button>
            </div>

            <div>
              <label for="hash-output" class="block text-sm font-medium text-gray-700 mb-2">
                Hash generado
              </label>
              <textarea
                id="hash-output"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                readonly
              ></textarea>
            </div>
          </div>
        </div>

        <!-- File Hash Generator -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Generador de Hash de Archivos</h2>

          <div class="space-y-4">
            <div>
              <label for="file-input" class="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar archivo (máx. 10MB)
              </label>
              <input
                type="file"
                id="file-input"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
            </div>

            <div>
              <label for="file-hash-output" class="block text-sm font-medium text-gray-700 mb-2">
                Hash del archivo
              </label>
              <textarea
                id="file-hash-output"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                readonly
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Batch Processing -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Procesamiento por Lotes</h2>

          <div class="space-y-4">
            <div>
              <label for="batch-textarea" class="block text-sm font-medium text-gray-700 mb-2">
                Textos a hashear (uno por línea, máximo 100)
              </label>
              <textarea
                id="batch-textarea"
                rows="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Línea 1 de texto&#10;Línea 2 de texto&#10;Línea 3 de texto..."
              ></textarea>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                id="generate-batch-btn"
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Generar Lote
              </button>
              <button
                id="export-batch-btn"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                disabled
              >
                Exportar CSV
              </button>
            </div>

            <div>
              <label for="batch-output" class="block text-sm font-medium text-gray-700 mb-2">
                Resultados del lote
              </label>
              <textarea
                id="batch-output"
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                readonly
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Hash Comparison -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Comparación de Hashes</h2>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="hash1-input" class="block text-sm font-medium text-gray-700 mb-2">
                  Hash 1
                </label>
                <input
                  type="text"
                  id="hash1-input"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  placeholder="Introduce el primer hash..."
                >
              </div>

              <div>
                <label for="hash2-input" class="block text-sm font-medium text-gray-700 mb-2">
                  Hash 2
                </label>
                <input
                  type="text"
                  id="hash2-input"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  placeholder="Introduce el segundo hash..."
                >
              </div>
            </div>

            <button
              id="compare-btn"
              class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Comparar Hashes
            </button>

            <div id="comparison-result" class="hidden">
              <!-- Comparison result will be shown here -->
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div id="stats-container" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Estadísticas de Procesamiento</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Stats will be populated here -->
          </div>
        </div>
      </div>
    `;

    this.initializeElements();
  }

  private initializeElements(): void {
    // Get UI elements
    this.textInput = this.container.querySelector('#text-input') as HTMLTextAreaElement;
    this.algorithmSelect = this.container.querySelector('#algorithm-select') as HTMLSelectElement;
    this.formatSelect = this.container.querySelector('#format-select') as HTMLSelectElement;
    this.uppercaseCheckbox = this.container.querySelector('#uppercase-checkbox') as HTMLInputElement;
    this.separatorsCheckbox = this.container.querySelector('#separators-checkbox') as HTMLInputElement;
    this.realtimeCheckbox = this.container.querySelector('#realtime-checkbox') as HTMLInputElement;
    this.hashOutput = this.container.querySelector('#hash-output') as HTMLTextAreaElement;
    this.generateBtn = this.container.querySelector('#generate-btn') as HTMLButtonElement;
    this.copyBtn = this.container.querySelector('#copy-btn') as HTMLButtonElement;
    this.clearBtn = this.container.querySelector('#clear-btn') as HTMLButtonElement;
    this.fileInput = this.container.querySelector('#file-input') as HTMLInputElement;
    this.fileHashOutput = this.container.querySelector('#file-hash-output') as HTMLTextAreaElement;
    this.batchTextarea = this.container.querySelector('#batch-textarea') as HTMLTextAreaElement;
    this.generateBatchBtn = this.container.querySelector('#generate-batch-btn') as HTMLButtonElement;
    this.batchOutput = this.container.querySelector('#batch-output') as HTMLTextAreaElement;
    this.exportBatchBtn = this.container.querySelector('#export-batch-btn') as HTMLButtonElement;
    this.hash1Input = this.container.querySelector('#hash1-input') as HTMLInputElement;
    this.hash2Input = this.container.querySelector('#hash2-input') as HTMLInputElement;
    this.compareBtn = this.container.querySelector('#compare-btn') as HTMLButtonElement;
    this.comparisonResult = this.container.querySelector('#comparison-result') as HTMLElement;
    this.algorithmInfo = this.container.querySelector('#algorithm-info') as HTMLElement;

    // Populate algorithm select
    this.populateAlgorithmSelect();

    // Set initial values
    this.formatSelect.value = this.options.format;
    this.uppercaseCheckbox.checked = this.options.uppercase;
    this.separatorsCheckbox.checked = this.options.withSeparators;
  }

  private populateAlgorithmSelect(): void {
    const algorithms = getAvailableAlgorithms();

    algorithms.forEach(algo => {
      const option = document.createElement('option');
      option.value = algo.algorithm;
      option.textContent = `${algo.name} ${algo.deprecated ? '(Deprecated)' : ''}`;

      if (!isAlgorithmSupported(algo.algorithm)) {
        option.disabled = true;
        option.textContent += ' (Not Supported)';
      }

      if (algo.recommended && isAlgorithmSupported(algo.algorithm)) {
        option.textContent += ' (Recommended)';
      }

      this.algorithmSelect.appendChild(option);
    });

    // Set recommended algorithm as default
    this.algorithmSelect.value = getRecommendedAlgorithm();
    this.options.algorithm = getRecommendedAlgorithm();
  }

  private bindEvents(): void {
    // Algorithm change
    this.algorithmSelect.addEventListener('change', () => {
      this.options.algorithm = this.algorithmSelect.value as HashAlgorithm;
      this.updateAlgorithmInfo();
      if (this.realtimeCheckbox.checked && this.textInput.value) {
        this.generateTextHash();
      }
    });

    // Format change
    this.formatSelect.addEventListener('change', () => {
      this.options.format = this.formatSelect.value as 'hex' | 'base64';
      if (this.hashOutput.value) {
        this.updateHashOutputFormat();
      }
    });

    // Option changes
    this.uppercaseCheckbox.addEventListener('change', () => {
      this.options.uppercase = this.uppercaseCheckbox.checked;
      if (this.hashOutput.value) {
        this.updateHashOutputFormat();
      }
    });

    this.separatorsCheckbox.addEventListener('change', () => {
      this.options.withSeparators = this.separatorsCheckbox.checked;
      if (this.hashOutput.value) {
        this.updateHashOutputFormat();
      }
    });

    // Text input
    this.textInput.addEventListener('input', () => {
      if (this.realtimeCheckbox.checked) {
        this.generateTextHash();
      }
    });

    // Buttons
    this.generateBtn.addEventListener('click', () => this.generateTextHash());
    this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    this.clearBtn.addEventListener('click', () => this.clearAll());

    // File input
    this.fileInput.addEventListener('change', () => this.generateFileHash());

    // Batch processing
    this.generateBatchBtn.addEventListener('click', () => this.generateBatchHashes());
    this.exportBatchBtn.addEventListener('click', () => this.exportBatchResults());

    // Hash comparison
    this.compareBtn.addEventListener('click', () => this.compareHashes());
  }

  private updateAlgorithmInfo(): void {
    const algorithms = getAvailableAlgorithms();
    const currentAlgo = algorithms.find(a => a.algorithm === this.options.algorithm);

    if (!currentAlgo) return;

    const securityColor = {
      'low': 'text-red-600',
      'medium': 'text-yellow-600',
      'high': 'text-green-600'
    }[currentAlgo.securityLevel];

    const speedColor = {
      'fast': 'text-green-600',
      'medium': 'text-yellow-600',
      'slow': 'text-red-600'
    }[currentAlgo.speed];

    this.algorithmInfo.innerHTML = `
      <div class="flex items-start space-x-4">
        <div class="flex-1">
          <h3 class="font-semibold text-blue-800">${currentAlgo.name}</h3>
          <p class="text-sm text-gray-700 mt-1">${currentAlgo.description}</p>
        </div>
        <div class="text-right">
          <div class="text-sm">
            <span class="font-medium">Seguridad:</span>
            <span class="${securityColor}">${currentAlgo.securityLevel.toUpperCase()}</span>
          </div>
          <div class="text-sm">
            <span class="font-medium">Velocidad:</span>
            <span class="${speedColor}">${currentAlgo.speed.toUpperCase()}</span>
          </div>
          <div class="text-sm">
            <span class="font-medium">Longitud:</span> ${currentAlgo.outputLength} chars
          </div>
        </div>
      </div>
      ${currentAlgo.deprecated ? `
        <div class="mt-2 text-sm text-red-600 font-medium">
          ⚠️ Este algoritmo está deprecado y no se recomienda para uso en seguridad.
        </div>
      ` : ''}
    `;
  }

  private async generateTextHash(): Promise<void> {
    const text = this.textInput.value.trim();

    if (!text) {
      this.hashOutput.value = '';
      this.copyBtn.disabled = true;
      return;
    }

    try {
      const result = await generateHash(text, this.options);

      if (result.success && result.hash) {
        this.hashOutput.value = formatHash(
          result.hash,
          this.options.withSeparators,
          this.options.uppercase
        );
        this.copyBtn.disabled = false;
        this.currentHashes.set(this.options.algorithm, result.hash);

        // Track successful generation
        trackHashGenerator.generate(
          this.options.algorithm,
          this.options.format,
          text.length,
          result.processingTime
        );
      } else {
        this.showError(`Error: ${result.error}`);
      }
    } catch (error) {
      this.showError(`Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private async generateFileHash(): Promise<void> {
    const file = this.fileInput.files?.[0];

    if (!file) {
      this.fileHashOutput.value = '';
      return;
    }

    this.fileHashOutput.value = 'Procesando archivo...';

    try {
      const result = await generateHashFromFile(file, this.options);

      if (result.success && result.hash) {
        const formattedHash = formatHash(
          result.hash,
          this.options.withSeparators,
          this.options.uppercase
        );

        this.fileHashOutput.value = `Archivo: ${result.fileName}
Tamaño: ${this.formatFileSize(result.fileSize!)}
Algoritmo: ${this.options.algorithm.toUpperCase()}
Hash: ${formattedHash}
Tiempo: ${result.processingTime?.toFixed(2)}ms`;

        // Track successful file hash
        trackHashGenerator.fileHash(
          this.options.algorithm,
          result.fileSize!,
          result.processingTime
        );
      } else {
        this.fileHashOutput.value = `Error: ${result.error}`;
      }
    } catch (error) {
      this.fileHashOutput.value = `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  }

  private async generateBatchHashes(): Promise<void> {
    const batchText = this.batchTextarea.value.trim();

    if (!batchText) {
      this.showError('Por favor introduce textos para procesar en lote');
      return;
    }

    const lines = batchText.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      this.showError('No se encontraron líneas válidas para procesar');
      return;
    }

    const batchInputs: BatchHashInput[] = lines.map((line, index) => ({
      id: `line-${index + 1}`,
      content: line.trim(),
      name: `Línea ${index + 1}`
    }));

    this.batchOutput.value = 'Procesando lote...';

    try {
      const result = await generateBatchHashes(batchInputs, this.options);

      if (result.success && result.results) {
        let output = `Procesados: ${result.totalProcessed} elementos\n`;
        output += `Tiempo total: ${result.totalTime?.toFixed(2)}ms\n`;
        output += `Algoritmo: ${this.options.algorithm.toUpperCase()}\n\n`;

        this.batchResults = [];

        result.results.forEach((item, index) => {
          const formattedHash = formatHash(
            item.hash,
            this.options.withSeparators,
            this.options.uppercase
          );

          output += `${index + 1}. ${item.name}\n`;
          output += `   Hash: ${formattedHash}\n`;
          output += `   Tiempo: ${item.processingTime.toFixed(2)}ms\n\n`;

          this.batchResults.push({
            name: item.name || `Item ${index + 1}`,
            hash: formattedHash,
            algorithm: this.options.algorithm
          });
        });

        this.batchOutput.value = output;
        this.exportBatchBtn.disabled = false;

        // Track batch processing
        trackHashGenerator.batchHash(
          this.options.algorithm,
          result.totalProcessed!,
          result.totalTime
        );
      } else {
        this.batchOutput.value = `Error: ${result.error}`;
      }
    } catch (error) {
      this.batchOutput.value = `Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    }
  }

  private async compareHashes(): Promise<void> {
    const hash1 = this.hash1Input.value.trim();
    const hash2 = this.hash2Input.value.trim();

    if (!hash1 || !hash2) {
      this.showError('Por favor introduce ambos hashes para comparar');
      return;
    }

    try {
      const comparison = compareHashes(hash1, hash2, this.options.algorithm);

      this.comparisonResult.className = 'mt-4 p-4 rounded-md';
      this.comparisonResult.classList.add(
        comparison.match ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
      );

      this.comparisonResult.innerHTML = `
        <div class="flex items-center mb-3">
          <span class="text-lg ${comparison.match ? 'text-green-600' : 'text-red-600'}">
            ${comparison.match ? '✅ Los hashes coinciden' : '❌ Los hashes NO coinciden'}
          </span>
        </div>
        <div class="text-sm space-y-2">
          <div><strong>Hash 1:</strong> <code class="font-mono">${comparison.hash1}</code></div>
          <div><strong>Hash 2:</strong> <code class="font-mono">${comparison.hash2}</code></div>
          <div><strong>Algoritmo:</strong> ${comparison.algorithm.toUpperCase()}</div>
          <div><strong>Similitud:</strong> ${(comparison.similarity! * 100).toFixed(1)}%</div>
        </div>
      `;

      this.comparisonResult.classList.remove('hidden');

      // Track hash comparison
      trackHashGenerator.compare(
        this.options.algorithm,
        comparison.match,
        comparison.similarity
      );
    } catch (error) {
      this.showError(`Error en la comparación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private updateHashOutputFormat(): void {
    if (!this.hashOutput.value) return;

    // Re-format the current hash with new options
    const currentHash = this.currentHashes.get(this.options.algorithm);
    if (currentHash) {
      this.hashOutput.value = formatHash(
        currentHash,
        this.options.withSeparators,
        this.options.uppercase
      );
    }
  }

  private async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.hashOutput.value);

      // Visual feedback
      const originalText = this.copyBtn.textContent;
      this.copyBtn.textContent = '✓ Copiado';
      this.copyBtn.classList.add('bg-green-600');

      setTimeout(() => {
        this.copyBtn.textContent = originalText;
        this.copyBtn.classList.remove('bg-green-600');
      }, 2000);

      // Track copy action
      trackUserInteraction.copyResult(ToolNames.HASH_GENERATOR);
    } catch (error) {
      this.showError('Error al copiar al portapapeles');
    }
  }

  private exportBatchResults(): void {
    if (this.batchResults.length === 0) return;

    try {
      const csvContent = [
        ['Nombre', 'Hash', 'Algoritmo'].join(','),
        ...this.batchResults.map(result =>
          [result.name, result.hash, result.algorithm.toUpperCase()].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `hash-batch-${this.options.algorithm}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      URL.revokeObjectURL(url);

      // Track export
      trackHashGenerator.export('csv', this.batchResults.length);
    } catch (error) {
      this.showError('Error al exportar resultados');
    }
  }

  private clearAll(): void {
    this.textInput.value = '';
    this.hashOutput.value = '';
    this.fileHashOutput.value = '';
    this.batchTextarea.value = '';
    this.batchOutput.value = '';
    this.hash1Input.value = '';
    this.hash2Input.value = '';
    this.comparisonResult.classList.add('hidden');

    this.copyBtn.disabled = true;
    this.exportBatchBtn.disabled = true;

    this.currentHashes.clear();
    this.batchResults = [];

    if (this.fileInput) {
      this.fileInput.value = '';
    }

    // Track clear action
    trackUserInteraction.clearInput(ToolNames.HASH_GENERATOR);
  }

  private checkBrowserSupport(): void {
    const supportedAlgorithms = getAvailableAlgorithms()
      .filter(algo => isAlgorithmSupported(algo.algorithm));

    if (supportedAlgorithms.length === 0) {
      this.showError('Tu navegador no soporta las APIs necesarias para la generación de hashes');
      return;
    }

    // Show warning for unsupported algorithms
    const unsupportedAlgorithms = getAvailableAlgorithms()
      .filter(algo => !isAlgorithmSupported(algo.algorithm));

    if (unsupportedAlgorithms.length > 0) {
      console.warn('Algoritmos no soportados:', unsupportedAlgorithms.map(a => a.name));
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private showError(message: string): void {
    // Create temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md z-50';
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}