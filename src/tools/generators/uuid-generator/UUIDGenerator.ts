/**
 * UUID Generator Tool - Main Component
 *
 * Professional UUID generation tool with comprehensive features:
 * - Multiple UUID versions (v1, v3, v4, v5, NIL)
 * - Batch generation and export
 * - Real-time validation
 * - Format conversion
 * - Analytics integration
 */

import type {
  UUIDVersion,
  UUIDFormat,
  UUIDGenerationConfig,
  GeneratedUUID,
  UUIDValidationResult
} from './types';
import { PREDEFINED_NAMESPACES } from './types';
import { UUIDGenerator as UUIDCore } from './utils';
import { trackEvent, ToolNames } from '../../../utils/analytics';

export class UUIDGenerator {
  private container: HTMLElement;
  private generatedUUIDs: GeneratedUUID[] = [];
  private realTimeInterval: number | null = null;
  private config: UUIDGenerationConfig = {
    version: 'v4',
    format: 'standard',
    count: 1,
    realTime: false
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    this.render();
    this.attachEventListeners();
    this.trackPageView();
  }

  private trackPageView(): void {
    trackEvent('tool_page_view', {
      tool_name: ToolNames.UUID_GENERATOR,
      tool_version: '1.0.0'
    });
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🔑</span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Generador de UUID</h1>
                <p class="text-gray-600">Genera identificadores únicos universales con múltiples versiones y formatos</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button id="statsBtn" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                📊 Estadísticas
              </button>
              <button id="helpBtn" class="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors">
                ❓ Ayuda
              </button>
            </div>
          </div>

          <!-- Configuration Panel -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Versión UUID</label>
              <select id="versionSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="v4">v4 - Aleatorio</option>
                <option value="v1">v1 - Basado en tiempo</option>
                <option value="v3">v3 - Basado en namespace (MD5)</option>
                <option value="v5">v5 - Basado en namespace (SHA-1)</option>
                <option value="nil">NIL - UUID vacío</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Formato</label>
              <select id="formatSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="standard">Estándar (minúsculas)</option>
                <option value="uppercase">Mayúsculas</option>
                <option value="lowercase">Minúsculas</option>
                <option value="no-hyphens">Sin guiones</option>
                <option value="braces">Con llaves { }</option>
                <option value="brackets">Con corchetes [ ]</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
              <input type="number" id="countInput" value="1" min="1" max="1000"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Acciones</label>
              <div class="flex space-x-2">
                <button id="generateBtn" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  ⚡ Generar
                </button>
                <button id="realTimeBtn" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors" title="Generación en tiempo real">
                  ⏱️
                </button>
              </div>
            </div>
          </div>

          <!-- Namespace Configuration (for v3/v5) -->
          <div id="namespaceConfig" class="hidden mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Configuración de Namespace</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Namespace Predefinido</label>
                <select id="predefinedNamespace" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Seleccionar namespace...</option>
                  <option value="DNS">DNS - Sistema de Nombres de Dominio</option>
                  <option value="URL">URL - Identificador de Recurso Uniforme</option>
                  <option value="OID">OID - Identificador de Objeto</option>
                  <option value="X500">X500 - Nombre Distinguido X.500</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Namespace UUID</label>
                <input type="text" id="namespaceInput" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre/Dato</label>
                <input type="text" id="nameInput" placeholder="Ingresa el nombre o dato para generar el UUID"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Generated UUIDs Section -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">UUIDs Generados</h2>
              <div class="flex items-center space-x-2">
                <span id="uuidCount" class="text-sm text-gray-600">0 UUIDs</span>
                <button id="exportBtn" class="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm font-medium transition-colors">
                  📥 Exportar
                </button>
                <button id="clearBtn" class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-colors">
                  🗑️ Limpiar
                </button>
              </div>
            </div>

            <div id="uuidResults" class="space-y-3 max-h-96 overflow-y-auto">
              <div class="text-center text-gray-500 py-8">
                <div class="text-4xl mb-2">🔑</div>
                <p>Genera tu primer UUID para comenzar</p>
              </div>
            </div>

            <!-- Bulk Actions -->
            <div id="bulkActions" class="hidden mt-4 pt-4 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <input type="checkbox" id="selectAll" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                  <label for="selectAll" class="text-sm text-gray-700">Seleccionar todos</label>
                </div>
                <div class="flex items-center space-x-2">
                  <button id="copySelectedBtn" class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-colors">
                    📋 Copiar seleccionados
                  </button>
                  <button id="deleteSelectedBtn" class="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-colors">
                    🗑️ Eliminar seleccionados
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- UUID Validator Section -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Validador de UUID</h2>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">UUID a validar</label>
              <textarea id="validateInput" rows="3" placeholder="Pega aquí el UUID a validar..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"></textarea>
            </div>

            <button id="validateBtn" class="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors mb-4">
              🔍 Validar UUID
            </button>

            <div id="validationResults" class="hidden">
              <div class="p-4 rounded-lg border">
                <div id="validationStatus" class="flex items-center mb-3">
                  <span id="validationIcon" class="text-2xl mr-2"></span>
                  <span id="validationMessage" class="font-medium"></span>
                </div>

                <div id="validationDetails" class="space-y-2 text-sm">
                  <!-- Validation details will be populated here -->
                </div>
              </div>
            </div>

            <!-- Format Converter -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Convertidor de Formato</h3>
              <div class="space-y-3" id="formatConverter">
                <!-- Format conversion options will be populated here -->
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Modal -->
        <div id="statsModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Estadísticas de Generación</h3>
              <button id="closeStatsBtn" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div id="statsContent" class="space-y-3">
              <!-- Statistics content will be populated here -->
            </div>
          </div>
        </div>

        <!-- Export Modal -->
        <div id="exportModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Exportar UUIDs</h3>
              <button id="closeExportBtn" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Formato de exportación</label>
                <select id="exportFormat" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="txt">Texto plano (.txt)</option>
                  <option value="csv">CSV con metadatos (.csv)</option>
                  <option value="json">JSON completo (.json)</option>
                </select>
              </div>

              <div class="flex items-center">
                <input type="checkbox" id="includeMetadata" checked class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2">
                <label for="includeMetadata" class="text-sm text-gray-700">Incluir metadatos</label>
              </div>

              <div class="flex space-x-3">
                <button id="confirmExportBtn" class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                  📥 Descargar
                </button>
                <button id="cancelExportBtn" class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Help Modal -->
        <div id="helpModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Guía de UUID</h3>
              <button id="closeHelpBtn" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div class="space-y-4 text-sm">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">¿Qué es un UUID?</h4>
                <p class="text-gray-700">Un UUID (Universally Unique Identifier) es un identificador de 128 bits que garantiza la unicidad en sistemas distribuidos.</p>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Versiones de UUID</h4>
                <ul class="space-y-1 text-gray-700">
                  <li><strong>v1:</strong> Basado en timestamp y dirección MAC</li>
                  <li><strong>v3:</strong> Basado en namespace usando hash MD5</li>
                  <li><strong>v4:</strong> Generado aleatoriamente (más común)</li>
                  <li><strong>v5:</strong> Basado en namespace usando hash SHA-1</li>
                  <li><strong>NIL:</strong> UUID vacío (todos ceros)</li>
                </ul>
              </div>

              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Formatos disponibles</h4>
                <ul class="space-y-1 text-gray-700 font-mono text-xs">
                  <li>Estándar: 550e8400-e29b-41d4-a716-446655440000</li>
                  <li>Sin guiones: 550e8400e29b41d4a716446655440000</li>
                  <li>Con llaves: {550e8400-e29b-41d4-a716-446655440000}</li>
                  <li>Con corchetes: [550e8400-e29b-41d4-a716-446655440000]</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEventListeners(): void {
    // Configuration listeners
    const versionSelect = this.container.querySelector('#versionSelect') as HTMLSelectElement;
    const formatSelect = this.container.querySelector('#formatSelect') as HTMLSelectElement;
    const countInput = this.container.querySelector('#countInput') as HTMLInputElement;

    versionSelect?.addEventListener('change', () => this.handleVersionChange());
    formatSelect?.addEventListener('change', () => this.updateConfig());
    countInput?.addEventListener('input', () => this.updateConfig());

    // Namespace configuration
    const predefinedNamespace = this.container.querySelector('#predefinedNamespace') as HTMLSelectElement;
    predefinedNamespace?.addEventListener('change', () => this.handleNamespaceChange());

    // Action buttons
    const generateBtn = this.container.querySelector('#generateBtn') as HTMLButtonElement;
    const realTimeBtn = this.container.querySelector('#realTimeBtn') as HTMLButtonElement;
    const validateBtn = this.container.querySelector('#validateBtn') as HTMLButtonElement;

    generateBtn?.addEventListener('click', () => this.generateUUIDs());
    realTimeBtn?.addEventListener('click', () => this.toggleRealTime());
    validateBtn?.addEventListener('click', () => this.validateUUID());

    // UUID validation input
    const validateInput = this.container.querySelector('#validateInput') as HTMLTextAreaElement;
    validateInput?.addEventListener('input', () => this.handleValidationInput());

    // Bulk actions
    const selectAll = this.container.querySelector('#selectAll') as HTMLInputElement;
    const copySelectedBtn = this.container.querySelector('#copySelectedBtn') as HTMLButtonElement;
    const deleteSelectedBtn = this.container.querySelector('#deleteSelectedBtn') as HTMLButtonElement;
    const clearBtn = this.container.querySelector('#clearBtn') as HTMLButtonElement;

    selectAll?.addEventListener('change', () => this.toggleSelectAll());
    copySelectedBtn?.addEventListener('click', () => this.copySelected());
    deleteSelectedBtn?.addEventListener('click', () => this.deleteSelected());
    clearBtn?.addEventListener('click', () => this.clearResults());

    // Modal controls
    this.setupModalListeners();

    // Initial configuration
    this.updateConfig();
  }

  private setupModalListeners(): void {
    // Statistics modal
    const statsBtn = this.container.querySelector('#statsBtn') as HTMLButtonElement;
    const statsModal = this.container.querySelector('#statsModal') as HTMLElement;
    const closeStatsBtn = this.container.querySelector('#closeStatsBtn') as HTMLButtonElement;

    statsBtn?.addEventListener('click', () => this.showStats());
    closeStatsBtn?.addEventListener('click', () => this.hideModal(statsModal));

    // Export modal
    const exportBtn = this.container.querySelector('#exportBtn') as HTMLButtonElement;
    const exportModal = this.container.querySelector('#exportModal') as HTMLElement;
    const closeExportBtn = this.container.querySelector('#closeExportBtn') as HTMLButtonElement;
    const confirmExportBtn = this.container.querySelector('#confirmExportBtn') as HTMLButtonElement;
    const cancelExportBtn = this.container.querySelector('#cancelExportBtn') as HTMLButtonElement;

    exportBtn?.addEventListener('click', () => this.showExportModal());
    closeExportBtn?.addEventListener('click', () => this.hideModal(exportModal));
    confirmExportBtn?.addEventListener('click', () => this.confirmExport());
    cancelExportBtn?.addEventListener('click', () => this.hideModal(exportModal));

    // Help modal
    const helpBtn = this.container.querySelector('#helpBtn') as HTMLButtonElement;
    const helpModal = this.container.querySelector('#helpModal') as HTMLElement;
    const closeHelpBtn = this.container.querySelector('#closeHelpBtn') as HTMLButtonElement;

    helpBtn?.addEventListener('click', () => this.showModal(helpModal));
    closeHelpBtn?.addEventListener('click', () => this.hideModal(helpModal));

    // Close modals on backdrop click
    [statsModal, exportModal, helpModal].forEach(modal => {
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideModal(modal);
        }
      });
    });
  }

  private handleVersionChange(): void {
    const versionSelect = this.container.querySelector('#versionSelect') as HTMLSelectElement;
    const namespaceConfig = this.container.querySelector('#namespaceConfig') as HTMLElement;

    const version = versionSelect.value as UUIDVersion;
    const showNamespace = version === 'v3' || version === 'v5';

    if (showNamespace) {
      namespaceConfig.classList.remove('hidden');
    } else {
      namespaceConfig.classList.add('hidden');
    }

    this.updateConfig();

    // Track version change
    trackEvent('uuid_version_changed', {
      tool_name: ToolNames.UUID_GENERATOR,
      version: version,
      requires_namespace: showNamespace
    });
  }

  private handleNamespaceChange(): void {
    const predefinedNamespace = this.container.querySelector('#predefinedNamespace') as HTMLSelectElement;
    const namespaceInput = this.container.querySelector('#namespaceInput') as HTMLInputElement;

    const selected = predefinedNamespace.value;

    if (selected && selected !== 'custom' && PREDEFINED_NAMESPACES[selected]) {
      namespaceInput.value = PREDEFINED_NAMESPACES[selected].uuid;
      namespaceInput.disabled = true;
    } else {
      namespaceInput.disabled = false;
      if (selected === 'custom') {
        namespaceInput.value = '';
        namespaceInput.focus();
      }
    }

    this.updateConfig();
  }

  private updateConfig(): void {
    const versionSelect = this.container.querySelector('#versionSelect') as HTMLSelectElement;
    const formatSelect = this.container.querySelector('#formatSelect') as HTMLSelectElement;
    const countInput = this.container.querySelector('#countInput') as HTMLInputElement;
    const namespaceInput = this.container.querySelector('#namespaceInput') as HTMLInputElement;
    const nameInput = this.container.querySelector('#nameInput') as HTMLInputElement;

    this.config = {
      version: versionSelect.value as UUIDVersion,
      format: formatSelect.value as UUIDFormat,
      count: Math.min(parseInt(countInput.value) || 1, 1000),
      namespace: namespaceInput?.value || undefined,
      name: nameInput?.value || undefined,
      realTime: false
    };

    // Update count input to ensure it's within bounds
    countInput.value = this.config.count.toString();
  }

  private async generateUUIDs(): Promise<void> {
    try {
      const generateBtn = this.container.querySelector('#generateBtn') as HTMLButtonElement;

      // Validate namespace requirements
      if ((this.config.version === 'v3' || this.config.version === 'v5') &&
          (!this.config.namespace || !this.config.name)) {
        this.showError('Las versiones v3 y v5 requieren namespace y nombre');
        return;
      }

      // Show loading state
      generateBtn.disabled = true;
      generateBtn.textContent = '⏳ Generando...';

      const startTime = performance.now();

      if (this.config.count === 1) {
        const uuid = await UUIDCore.generateUUID(this.config);
        this.generatedUUIDs.push(uuid);

        trackEvent('uuid_generated', {
          tool_name: ToolNames.UUID_GENERATOR,
          version: this.config.version,
          format: this.config.format,
          generation_time: performance.now() - startTime
        });
      } else {
        const result = await UUIDCore.generateBatch(this.config);
        this.generatedUUIDs.push(...result.uuids);

        trackEvent('uuid_batch_generated', {
          tool_name: ToolNames.UUID_GENERATOR,
          version: this.config.version,
          format: this.config.format,
          count: result.totalGenerated,
          generation_time: result.generationTime
        });
      }

      this.updateUUIDDisplay();
      this.showSuccess(`${this.config.count} UUID(s) generado(s) exitosamente`);

    } catch (error) {
      console.error('Error generating UUIDs:', error);
      this.showError(error instanceof Error ? error.message : 'Error al generar UUID');

      trackEvent('uuid_generation_error', {
        tool_name: ToolNames.UUID_GENERATOR,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      const generateBtn = this.container.querySelector('#generateBtn') as HTMLButtonElement;
      generateBtn.disabled = false;
      generateBtn.textContent = '⚡ Generar';
    }
  }

  private toggleRealTime(): void {
    const realTimeBtn = this.container.querySelector('#realTimeBtn') as HTMLButtonElement;

    if (this.realTimeInterval) {
      // Stop real-time generation
      clearInterval(this.realTimeInterval);
      this.realTimeInterval = null;
      realTimeBtn.textContent = '⏱️';
      realTimeBtn.classList.remove('bg-red-100', 'text-red-700');
      realTimeBtn.classList.add('bg-gray-100');

      trackEvent('uuid_realtime_stopped', {
        tool_name: ToolNames.UUID_GENERATOR
      });
    } else {
      // Start real-time generation
      this.realTimeInterval = window.setInterval(() => {
        this.config.count = 1;
        this.generateUUIDs();
      }, 1000);

      realTimeBtn.textContent = '⏹️';
      realTimeBtn.classList.remove('bg-gray-100');
      realTimeBtn.classList.add('bg-red-100', 'text-red-700');

      trackEvent('uuid_realtime_started', {
        tool_name: ToolNames.UUID_GENERATOR
      });
    }
  }

  private async validateUUID(): Promise<void> {
    const validateInput = this.container.querySelector('#validateInput') as HTMLTextAreaElement;
    const uuid = validateInput.value.trim();

    if (!uuid) {
      this.showError('Ingresa un UUID para validar');
      return;
    }

    try {
      const result = UUIDCore.validateUUID(uuid);
      this.displayValidationResult(result);

      trackEvent('uuid_validated', {
        tool_name: ToolNames.UUID_GENERATOR,
        is_valid: result.isValid,
        version: result.version || 'unknown',
        format: result.format
      });

      if (result.isValid && result.version) {
        this.showFormatConverter(uuid);
      }

    } catch (error) {
      console.error('Error validating UUID:', error);
      this.showError('Error al validar UUID');
    }
  }

  private handleValidationInput(): void {
    const validateInput = this.container.querySelector('#validateInput') as HTMLTextAreaElement;
    const uuid = validateInput.value.trim();

    if (uuid && uuid.length >= 32) {
      // Real-time validation for complete UUIDs
      setTimeout(() => this.validateUUID(), 300);
    } else {
      // Hide validation results for incomplete input
      const validationResults = this.container.querySelector('#validationResults') as HTMLElement;
      validationResults.classList.add('hidden');
    }
  }

  private displayValidationResult(result: UUIDValidationResult): void {
    const validationResults = this.container.querySelector('#validationResults') as HTMLElement;
    const validationIcon = this.container.querySelector('#validationIcon') as HTMLElement;
    const validationMessage = this.container.querySelector('#validationMessage') as HTMLElement;
    const validationDetails = this.container.querySelector('#validationDetails') as HTMLElement;

    validationResults.classList.remove('hidden');

    if (result.isValid) {
      validationIcon.textContent = '✅';
      validationMessage.textContent = `UUID válido (${result.version?.toUpperCase()})`;
      validationMessage.className = 'font-medium text-green-700';
      validationResults.querySelector('.border')?.classList.add('border-green-200', 'bg-green-50');
    } else {
      validationIcon.textContent = '❌';
      validationMessage.textContent = 'UUID inválido';
      validationMessage.className = 'font-medium text-red-700';
      validationResults.querySelector('.border')?.classList.add('border-red-200', 'bg-red-50');
    }

    // Display details
    let detailsHTML = `
      <div><strong>Formato detectado:</strong> ${this.getFormatDescription(result.format)}</div>
    `;

    if (result.version) {
      detailsHTML += `<div><strong>Versión:</strong> ${result.version.toUpperCase()}</div>`;
    }

    if (result.timestamp) {
      const date = new Date(result.timestamp / 10000 + Date.UTC(1582, 9, 15));
      detailsHTML += `<div><strong>Timestamp:</strong> ${date.toLocaleString()}</div>`;
    }

    if (result.node) {
      detailsHTML += `<div><strong>Node ID:</strong> ${result.node}</div>`;
    }

    if (result.clockSequence) {
      detailsHTML += `<div><strong>Clock Sequence:</strong> ${result.clockSequence}</div>`;
    }

    if (result.errors.length > 0) {
      detailsHTML += `<div class="text-red-600"><strong>Errores:</strong> ${result.errors.join(', ')}</div>`;
    }

    if (result.suggestions.length > 0) {
      detailsHTML += `<div class="text-blue-600"><strong>Sugerencias:</strong> ${result.suggestions.join(', ')}</div>`;
    }

    validationDetails.innerHTML = detailsHTML;
  }

  private showFormatConverter(uuid: string): void {
    const formatConverter = this.container.querySelector('#formatConverter') as HTMLElement;
    const formats: { format: UUIDFormat; label: string }[] = [
      { format: 'standard', label: 'Estándar' },
      { format: 'uppercase', label: 'Mayúsculas' },
      { format: 'no-hyphens', label: 'Sin guiones' },
      { format: 'braces', label: 'Con llaves' },
      { format: 'brackets', label: 'Con corchetes' }
    ];

    const formatsHTML = formats.map(({ format, label }) => {
      const formatted = UUIDCore.formatUUID(uuid, format);
      return `
        <div class="flex items-center justify-between p-2 bg-gray-50 rounded border">
          <div>
            <div class="text-xs text-gray-600">${label}</div>
            <div class="font-mono text-sm">${formatted}</div>
          </div>
          <button onclick="navigator.clipboard.writeText('${formatted}')"
                  class="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs transition-colors">
            📋
          </button>
        </div>
      `;
    }).join('');

    formatConverter.innerHTML = formatsHTML;
  }

  private updateUUIDDisplay(): void {
    const uuidResults = this.container.querySelector('#uuidResults') as HTMLElement;
    const uuidCount = this.container.querySelector('#uuidCount') as HTMLElement;
    const bulkActions = this.container.querySelector('#bulkActions') as HTMLElement;

    uuidCount.textContent = `${this.generatedUUIDs.length} UUIDs`;

    if (this.generatedUUIDs.length === 0) {
      uuidResults.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <div class="text-4xl mb-2">🔑</div>
          <p>Genera tu primer UUID para comenzar</p>
        </div>
      `;
      bulkActions.classList.add('hidden');
      return;
    }

    bulkActions.classList.remove('hidden');

    const recentUUIDs = this.generatedUUIDs.slice(-20); // Show last 20
    const uuidsHTML = recentUUIDs.reverse().map((uuid) => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
        <div class="flex items-center space-x-3 flex-1">
          <input type="checkbox" class="uuid-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                 data-uuid="${uuid.uuid}">
          <div class="flex-1 min-w-0">
            <div class="font-mono text-sm text-gray-900 truncate">${uuid.uuid}</div>
            <div class="text-xs text-gray-500">
              ${uuid.version.toUpperCase()} • ${this.getFormatDescription(uuid.format)} • ${uuid.generatedAt.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="navigator.clipboard.writeText('${uuid.uuid}')"
                  class="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs transition-colors"
                  title="Copiar UUID">
            📋
          </button>
          <button onclick="this.closest('.flex').remove()"
                  class="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs transition-colors"
                  title="Eliminar">
            🗑️
          </button>
        </div>
      </div>
    `).join('');

    if (this.generatedUUIDs.length > 20) {
      uuidResults.innerHTML = `
        <div class="text-center text-blue-600 text-sm mb-3">
          Mostrando los últimos 20 de ${this.generatedUUIDs.length} UUIDs generados
        </div>
        ${uuidsHTML}
      `;
    } else {
      uuidResults.innerHTML = uuidsHTML;
    }
  }

  private toggleSelectAll(): void {
    const selectAll = this.container.querySelector('#selectAll') as HTMLInputElement;
    const checkboxes = this.container.querySelectorAll('.uuid-checkbox') as NodeListOf<HTMLInputElement>;

    checkboxes.forEach(checkbox => {
      checkbox.checked = selectAll.checked;
    });
  }

  private copySelected(): void {
    const selectedUUIDs = this.getSelectedUUIDs();

    if (selectedUUIDs.length === 0) {
      this.showError('Selecciona al menos un UUID para copiar');
      return;
    }

    const uuidText = selectedUUIDs.join('\n');
    navigator.clipboard.writeText(uuidText).then(() => {
      this.showSuccess(`${selectedUUIDs.length} UUID(s) copiado(s) al portapapeles`);

      trackEvent('uuid_bulk_copied', {
        tool_name: ToolNames.UUID_GENERATOR,
        count: selectedUUIDs.length
      });
    }).catch(() => {
      this.showError('Error al copiar al portapapeles');
    });
  }

  private deleteSelected(): void {
    const selectedUUIDs = this.getSelectedUUIDs();

    if (selectedUUIDs.length === 0) {
      this.showError('Selecciona al menos un UUID para eliminar');
      return;
    }

    this.generatedUUIDs = this.generatedUUIDs.filter(uuid => !selectedUUIDs.includes(uuid.uuid));
    this.updateUUIDDisplay();
    this.showSuccess(`${selectedUUIDs.length} UUID(s) eliminado(s)`);

    trackEvent('uuid_bulk_deleted', {
      tool_name: ToolNames.UUID_GENERATOR,
      count: selectedUUIDs.length
    });
  }

  private getSelectedUUIDs(): string[] {
    const checkboxes = this.container.querySelectorAll('.uuid-checkbox:checked') as NodeListOf<HTMLInputElement>;
    return Array.from(checkboxes).map(checkbox => checkbox.dataset.uuid!);
  }

  private clearResults(): void {
    this.generatedUUIDs = [];
    this.updateUUIDDisplay();
    this.showSuccess('Resultados limpiados');

    trackEvent('uuid_results_cleared', {
      tool_name: ToolNames.UUID_GENERATOR
    });
  }

  private showStats(): void {
    const statsModal = this.container.querySelector('#statsModal') as HTMLElement;
    const statsContent = this.container.querySelector('#statsContent') as HTMLElement;

    const stats = UUIDCore.getStats();
    const versionCounts = this.getVersionCounts();
    const formatCounts = this.getFormatCounts();

    statsContent.innerHTML = `
      <div class="bg-blue-50 p-3 rounded-lg">
        <div class="text-lg font-semibold text-blue-900">${stats.generatedCount}</div>
        <div class="text-sm text-blue-700">UUIDs generados en total</div>
      </div>

      <div class="bg-green-50 p-3 rounded-lg">
        <div class="text-lg font-semibold text-green-900">${stats.validatedCount}</div>
        <div class="text-sm text-green-700">UUIDs validados</div>
      </div>

      <div class="bg-purple-50 p-3 rounded-lg">
        <div class="text-lg font-semibold text-purple-900">${stats.averageTime.toFixed(2)}ms</div>
        <div class="text-sm text-purple-700">Tiempo promedio de generación</div>
      </div>

      <div class="bg-orange-50 p-3 rounded-lg">
        <div class="text-lg font-semibold text-orange-900">${Math.round(stats.peakGenerationRate)}</div>
        <div class="text-sm text-orange-700">UUIDs/segundo (pico)</div>
      </div>

      ${Object.keys(versionCounts).length > 0 ? `
        <div class="pt-3 border-t border-gray-200">
          <div class="text-sm font-medium text-gray-900 mb-2">Distribución por versión</div>
          ${Object.entries(versionCounts).map(([version, count]) => `
            <div class="flex justify-between text-sm">
              <span>${version.toUpperCase()}</span>
              <span>${count}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${Object.keys(formatCounts).length > 0 ? `
        <div class="pt-3 border-t border-gray-200">
          <div class="text-sm font-medium text-gray-900 mb-2">Distribución por formato</div>
          ${Object.entries(formatCounts).map(([format, count]) => `
            <div class="flex justify-between text-sm">
              <span>${this.getFormatDescription(format as UUIDFormat)}</span>
              <span>${count}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

    this.showModal(statsModal);

    trackEvent('uuid_stats_viewed', {
      tool_name: ToolNames.UUID_GENERATOR,
      total_generated: stats.generatedCount
    });
  }

  private getVersionCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.generatedUUIDs.forEach(uuid => {
      counts[uuid.version] = (counts[uuid.version] || 0) + 1;
    });
    return counts;
  }

  private getFormatCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.generatedUUIDs.forEach(uuid => {
      counts[uuid.format] = (counts[uuid.format] || 0) + 1;
    });
    return counts;
  }

  private showExportModal(): void {
    if (this.generatedUUIDs.length === 0) {
      this.showError('No hay UUIDs para exportar');
      return;
    }

    const exportModal = this.container.querySelector('#exportModal') as HTMLElement;
    this.showModal(exportModal);
  }

  private confirmExport(): void {
    const exportFormat = this.container.querySelector('#exportFormat') as HTMLSelectElement;
    const includeMetadata = this.container.querySelector('#includeMetadata') as HTMLInputElement;

    const format = exportFormat.value as 'csv' | 'json' | 'txt';
    const withMetadata = includeMetadata.checked;

    try {
      const content = UUIDCore.exportUUIDs(this.generatedUUIDs, format, withMetadata);
      const filename = `uuids_${new Date().toISOString().split('T')[0]}.${format}`;

      this.downloadFile(content, filename, this.getMimeType(format));

      const exportModal = this.container.querySelector('#exportModal') as HTMLElement;
      this.hideModal(exportModal);
      this.showSuccess(`UUIDs exportados como ${filename}`);

      trackEvent('uuid_exported', {
        tool_name: ToolNames.UUID_GENERATOR,
        format: format,
        count: this.generatedUUIDs.length,
        include_metadata: withMetadata
      });

    } catch (error) {
      console.error('Error exporting UUIDs:', error);
      this.showError('Error al exportar UUIDs');
    }
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private getMimeType(format: string): string {
    switch (format) {
      case 'csv': return 'text/csv';
      case 'json': return 'application/json';
      case 'txt': return 'text/plain';
      default: return 'text/plain';
    }
  }

  private getFormatDescription(format: UUIDFormat): string {
    switch (format) {
      case 'standard': return 'Estándar';
      case 'uppercase': return 'Mayúsculas';
      case 'lowercase': return 'Minúsculas';
      case 'no-hyphens': return 'Sin guiones';
      case 'braces': return 'Con llaves';
      case 'brackets': return 'Con corchetes';
      default: return format;
    }
  }

  private showModal(modal: HTMLElement): void {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  private hideModal(modal: HTMLElement): void {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  private showSuccess(message: string): void {
    this.showNotification(message, 'success');
  }

  private showError(message: string): void {
    this.showNotification(message, 'error');
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Cleanup
  destroy(): void {
    if (this.realTimeInterval) {
      clearInterval(this.realTimeInterval);
    }
  }
}