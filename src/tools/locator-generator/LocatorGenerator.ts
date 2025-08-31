/**
 * Locator Generator Tool
 * Generates CSS selectors, XPath, and framework-specific locators from HTML
 */

import { trackEvent, trackToolUsage } from '../../utils/analytics';
import { 
  parseHTML, 
  generateLocators, 
  validateLocator, 
  getDefaultOptions 
} from './utils';
import type {
  GeneratedLocator,
  LocatorGenerationOptions,
  ElementInfo,
  ParsedHTML
} from './types';
import { TestFramework } from './types';

export interface LocatorGeneratorConfig {
  containerId: string;
  title?: string;
  placeholder?: string;
}

export class LocatorGenerator {
  private container: HTMLElement;
  private config: LocatorGeneratorConfig;
  private currentHTML: string = '';
  private parsedHTML: ParsedHTML | null = null;
  private selectedElement: ElementInfo | null = null;
  private options: LocatorGenerationOptions = getDefaultOptions();

  constructor(container: HTMLElement, config: LocatorGeneratorConfig) {
    this.container = container;
    this.config = {
      title: 'Generador de Locators',
      placeholder: 'Pega aquí tu código HTML...',
      ...config
    };

    this.init();
  }

  private init(): void {
    this.render();
    this.setupEventListeners();
    this.setupAnalytics();
  }

  private setupAnalytics(): void {
    trackEvent('tool_loaded', {
      tool_name: 'locator-generator',
      timestamp: new Date().toISOString()
    });
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">${this.config.title}</h1>
          <p class="text-gray-600">
            🎯 Genera locators robustos para Playwright, Selenium, Cypress y más frameworks de testing
          </p>
        </div>

        <!-- Options Panel -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">⚙️ Opciones de Generación</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label class="flex items-center space-x-2">
              <input type="checkbox" id="preferDataTestId" checked class="rounded border-gray-300">
              <span class="text-sm">Priorizar data-testid</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" id="includeRoleLocators" checked class="rounded border-gray-300">
              <span class="text-sm">Incluir locators de rol</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" id="includeXPath" class="rounded border-gray-300">
              <span class="text-sm">Incluir XPath</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="checkbox" id="allowFragileLocators" class="rounded border-gray-300">
              <span class="text-sm">Mostrar locators frágiles</span>
            </label>
            <div class="flex items-center space-x-2">
              <label class="text-sm">Framework:</label>
              <select id="targetFramework" class="rounded border-gray-300 text-sm">
                <option value="playwright">Playwright</option>
                <option value="cypress">Cypress</option>
                <option value="selenium-java">Selenium (Java)</option>
                <option value="selenium-python">Selenium (Python)</option>
                <option value="selenium-csharp">Selenium (C#)</option>
                <option value="webdriverio">WebDriverIO</option>
                <option value="testcafe">TestCafe</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Input Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">📝 Código HTML</h3>
            <div class="flex space-x-2">
              <button 
                id="analyzeBtn" 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                disabled
              >
                🔍 Analizar HTML
              </button>
              <button id="clearBtn" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                🗑️ Limpiar
              </button>
            </div>
          </div>
          
          <textarea 
            id="htmlInput"
            placeholder="${this.config.placeholder}"
            class="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
          
          <!-- Status -->
          <div id="statusContainer" class="mt-4">
            <div id="status" class="text-gray-500">
              Introduce HTML para generar locators
            </div>
          </div>
        </div>

        <!-- HTML Analysis Section -->
        <div id="analysisSection" class="hidden bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Análisis del HTML</h3>
          <div id="analysisContent"></div>
        </div>

        <!-- Element Selector Section -->
        <div id="elementSelectorSection" class="hidden bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">🎯 Elementos Detectados</h3>
          <div id="elementsList"></div>
        </div>

        <!-- Generated Locators Section -->
        <div id="locatorsSection" class="hidden bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">⚡ Locators Generados</h3>
          <div id="locatorsContainer"></div>
        </div>

        <!-- Tips Section -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-3">💡 Consejos para Locators Robustos</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex items-start space-x-2">
                <span class="text-green-600">✅</span>
                <span>Usa <code class="bg-blue-100 px-1 rounded">data-testid</code> para máxima estabilidad</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-green-600">✅</span>
                <span>Prefiere locators semánticos (roles, labels)</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-green-600">✅</span>
                <span>Combina atributos para mayor especificidad</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-start space-x-2">
                <span class="text-red-600">❌</span>
                <span>Evita XPath complejos y anidados</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-red-600">❌</span>
                <span>No uses clases CSS de utilidades (Tailwind, Bootstrap)</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-yellow-600">⚠️</span>
                <span>Cuidado con texto que puede cambiar por localización</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Examples Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">📋 Ejemplos de HTML</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors" data-example="form">
              <div class="font-medium text-blue-700">📋 Formulario</div>
              <div class="text-sm text-gray-600">Login form con inputs</div>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors" data-example="navigation">
              <div class="font-medium text-blue-700">🧭 Navegación</div>
              <div class="text-sm text-gray-600">Menu con enlaces</div>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors" data-example="table">
              <div class="font-medium text-blue-700">📊 Tabla</div>
              <div class="text-sm text-gray-600">Data table con acciones</div>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors" data-example="modal">
              <div class="font-medium text-blue-700">🔲 Modal</div>
              <div class="text-sm text-gray-600">Dialog con botones</div>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors" data-example="cards">
              <div class="font-medium text-blue-700">🎴 Cards</div>
              <div class="text-sm text-gray-600">Product cards</div>
            </button>
            <button class="example-btn text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors" data-example="complex">
              <div class="font-medium text-blue-700">⚙️ Complejo</div>
              <div class="text-sm text-gray-600">App con múltiples elementos</div>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    const htmlInput = this.container.querySelector('#htmlInput') as HTMLTextAreaElement;
    const analyzeBtn = this.container.querySelector('#analyzeBtn') as HTMLButtonElement;
    const clearBtn = this.container.querySelector('#clearBtn') as HTMLButtonElement;

    // Input validation and analyze button state
    htmlInput.addEventListener('input', () => {
      const hasContent = htmlInput.value.trim().length > 0;
      analyzeBtn.disabled = !hasContent;
      
      if (!hasContent) {
        this.resetDisplay();
      }
    });

    // Analyze button
    analyzeBtn.addEventListener('click', () => {
      this.analyzeHTML(htmlInput.value.trim());
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
      this.clearAll();
    });

    // Options event listeners
    this.setupOptionsListeners();

    // Example buttons
    this.setupExampleButtons();
  }

  private setupOptionsListeners(): void {
    const preferDataTestId = this.container.querySelector('#preferDataTestId') as HTMLInputElement;
    const includeRoleLocators = this.container.querySelector('#includeRoleLocators') as HTMLInputElement;
    const includeXPath = this.container.querySelector('#includeXPath') as HTMLInputElement;
    const allowFragileLocators = this.container.querySelector('#allowFragileLocators') as HTMLInputElement;
    const targetFramework = this.container.querySelector('#targetFramework') as HTMLSelectElement;

    [preferDataTestId, includeRoleLocators, includeXPath, allowFragileLocators].forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateOptions();
        if (this.parsedHTML) {
          this.regenerateLocators();
        }
      });
    });

    targetFramework.addEventListener('change', () => {
      this.updateOptions();
      if (this.parsedHTML) {
        this.regenerateLocators();
      }
    });
  }

  private updateOptions(): void {
    const preferDataTestId = (this.container.querySelector('#preferDataTestId') as HTMLInputElement).checked;
    const includeRoleLocators = (this.container.querySelector('#includeRoleLocators') as HTMLInputElement).checked;
    const includeXPath = (this.container.querySelector('#includeXPath') as HTMLInputElement).checked;
    const allowFragileLocators = (this.container.querySelector('#allowFragileLocators') as HTMLInputElement).checked;
    const targetFramework = (this.container.querySelector('#targetFramework') as HTMLSelectElement).value as TestFramework;

    this.options = {
      preferDataTestId,
      includeRoleLocators,
      includeXPath,
      allowFragileLocators,
      maxClassLocators: 3,
      targetFrameworks: [targetFramework]
    };
  }

  private setupExampleButtons(): void {
    const exampleButtons = this.container.querySelectorAll('.example-btn');
    exampleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const example = (e.currentTarget as HTMLElement).getAttribute('data-example');
        if (example) {
          this.loadExample(example);
        }
      });
    });
  }

  private loadExample(exampleType: string): void {
    const examples: Record<string, string> = {
      form: `<form class="login-form" data-testid="login-form">
  <div class="form-group">
    <label for="username">Username:</label>
    <input id="username" name="username" type="text" data-testid="username-input" placeholder="Enter your username" required>
  </div>
  <div class="form-group">
    <label for="password">Password:</label>
    <input id="password" name="password" type="password" data-testid="password-input" placeholder="Enter your password" required>
  </div>
  <div class="form-actions">
    <button type="submit" class="btn btn-primary" data-testid="login-button">Log In</button>
    <button type="button" class="btn btn-secondary">Forgot Password?</button>
  </div>
</form>`,

      navigation: `<nav class="main-navigation" role="navigation" data-testid="main-nav">
  <div class="nav-brand">
    <a href="/" class="logo" data-testid="logo-link">MyApp</a>
  </div>
  <ul class="nav-menu" role="menubar">
    <li role="none"><a href="/home" role="menuitem" data-testid="home-link">Home</a></li>
    <li role="none"><a href="/products" role="menuitem" data-testid="products-link">Products</a></li>
    <li role="none"><a href="/about" role="menuitem" data-testid="about-link">About</a></li>
    <li role="none"><a href="/contact" role="menuitem" data-testid="contact-link">Contact</a></li>
  </ul>
  <div class="nav-actions">
    <button class="btn btn-outline" data-testid="search-button">Search</button>
    <button class="btn btn-primary" data-testid="login-button">Login</button>
  </div>
</nav>`,

      table: `<table class="data-table" data-testid="users-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr data-testid="user-row-1">
      <td>1</td>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td><span class="status active">Active</span></td>
      <td>
        <button class="btn btn-sm" data-testid="edit-user-1">Edit</button>
        <button class="btn btn-sm btn-danger" data-testid="delete-user-1">Delete</button>
      </td>
    </tr>
    <tr data-testid="user-row-2">
      <td>2</td>
      <td>Jane Smith</td>
      <td>jane@example.com</td>
      <td><span class="status inactive">Inactive</span></td>
      <td>
        <button class="btn btn-sm" data-testid="edit-user-2">Edit</button>
        <button class="btn btn-sm btn-danger" data-testid="delete-user-2">Delete</button>
      </td>
    </tr>
  </tbody>
</table>`,

      modal: `<div class="modal-overlay" data-testid="confirmation-modal">
  <div class="modal-container" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description">
    <div class="modal-header">
      <h2 id="modal-title">Confirm Action</h2>
      <button class="modal-close" data-testid="modal-close" aria-label="Close modal">×</button>
    </div>
    <div class="modal-body">
      <p id="modal-description">Are you sure you want to delete this item? This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-testid="cancel-button">Cancel</button>
      <button class="btn btn-danger" data-testid="confirm-delete-button">Delete</button>
    </div>
  </div>
</div>`,

      cards: `<div class="products-grid" data-testid="products-grid">
  <div class="product-card" data-testid="product-card-1" data-product-id="123">
    <img src="/product1.jpg" alt="Product 1" class="product-image">
    <div class="product-info">
      <h3 class="product-title">Awesome Product</h3>
      <p class="product-price">$29.99</p>
      <p class="product-description">This is an amazing product with great features.</p>
      <div class="product-actions">
        <button class="btn btn-primary" data-testid="add-to-cart-123">Add to Cart</button>
        <button class="btn btn-outline" data-testid="view-details-123">View Details</button>
      </div>
    </div>
  </div>
  <div class="product-card" data-testid="product-card-2" data-product-id="456">
    <img src="/product2.jpg" alt="Product 2" class="product-image">
    <div class="product-info">
      <h3 class="product-title">Another Great Product</h3>
      <p class="product-price">$49.99</p>
      <p class="product-description">Even better features and quality.</p>
      <div class="product-actions">
        <button class="btn btn-primary" data-testid="add-to-cart-456">Add to Cart</button>
        <button class="btn btn-outline" data-testid="view-details-456">View Details</button>
      </div>
    </div>
  </div>
</div>`,

      complex: `<div class="app-container" data-testid="main-app">
  <header class="app-header" data-testid="app-header">
    <nav class="header-nav">
      <div class="nav-brand">
        <img src="/logo.png" alt="Company Logo" class="logo">
        <h1>TestApp</h1>
      </div>
      <div class="nav-menu">
        <button class="nav-toggle" data-testid="nav-toggle" aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-links" data-testid="nav-links">
          <li><a href="/dashboard" data-testid="dashboard-link">Dashboard</a></li>
          <li><a href="/reports" data-testid="reports-link">Reports</a></li>
          <li><a href="/settings" data-testid="settings-link">Settings</a></li>
        </ul>
      </div>
      <div class="user-menu" data-testid="user-menu">
        <button class="user-avatar" data-testid="user-avatar">
          <img src="/avatar.jpg" alt="User Avatar">
        </button>
        <div class="dropdown-menu" data-testid="user-dropdown">
          <a href="/profile" data-testid="profile-link">Profile</a>
          <a href="/logout" data-testid="logout-link">Logout</a>
        </div>
      </div>
    </nav>
  </header>
  
  <main class="app-main" data-testid="main-content">
    <aside class="sidebar" data-testid="sidebar">
      <div class="search-box">
        <input type="search" placeholder="Search..." data-testid="search-input">
        <button class="search-btn" data-testid="search-button">🔍</button>
      </div>
      <ul class="sidebar-menu" data-testid="sidebar-menu">
        <li><a href="/inbox" data-testid="inbox-link" class="active">Inbox <span class="badge">3</span></a></li>
        <li><a href="/sent" data-testid="sent-link">Sent</a></li>
        <li><a href="/drafts" data-testid="drafts-link">Drafts</a></li>
        <li><a href="/archive" data-testid="archive-link">Archive</a></li>
      </ul>
    </aside>
    
    <section class="content-area" data-testid="content-area">
      <div class="content-header">
        <h2>Dashboard</h2>
        <div class="actions">
          <button class="btn btn-primary" data-testid="new-item-button">New Item</button>
          <button class="btn btn-secondary" data-testid="refresh-button">Refresh</button>
        </div>
      </div>
      
      <div class="content-body">
        <div class="stats-cards" data-testid="stats-cards">
          <div class="stat-card" data-testid="users-stat">
            <h3>Total Users</h3>
            <p class="stat-number">1,234</p>
          </div>
          <div class="stat-card" data-testid="revenue-stat">
            <h3>Revenue</h3>
            <p class="stat-number">$45,678</p>
          </div>
          <div class="stat-card" data-testid="orders-stat">
            <h3>Orders</h3>
            <p class="stat-number">987</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>`
    };

    const htmlInput = this.container.querySelector('#htmlInput') as HTMLTextAreaElement;
    if (examples[exampleType]) {
      htmlInput.value = examples[exampleType];
      const analyzeBtn = this.container.querySelector('#analyzeBtn') as HTMLButtonElement;
      analyzeBtn.disabled = false;
      
      // Auto-analyze the example
      setTimeout(() => {
        this.analyzeHTML(examples[exampleType]);
      }, 100);
    }

    trackEvent('example_loaded', {
      tool_name: 'locator-generator',
      example_type: exampleType
    });
  }

  private analyzeHTML(html: string): void {
    try {
      this.currentHTML = html;
      this.parsedHTML = parseHTML(html);
      
      this.displayAnalysis(this.parsedHTML);
      this.displayElements(this.parsedHTML.elements);
      
      this.updateStatus('✅ HTML analizado correctamente', 'success');

      trackToolUsage('locator-generator', 'success', {
        total_elements: this.parsedHTML.stats.totalElements,
        elements_with_testid: this.parsedHTML.stats.elementsWithTestId
      });

    } catch (error) {
      this.updateStatus(`❌ Error al analizar HTML: ${(error as Error).message}`, 'error');
      this.resetDisplay();
    }
  }

  private displayAnalysis(parsed: ParsedHTML): void {
    const analysisSection = this.container.querySelector('#analysisSection') as HTMLElement;
    const analysisContent = this.container.querySelector('#analysisContent') as HTMLElement;
    
    const testIdPercentage = parsed.stats.totalElements > 0 
      ? Math.round((parsed.stats.elementsWithTestId / parsed.stats.totalElements) * 100)
      : 0;

    analysisContent.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="stat-item p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">${parsed.stats.totalElements}</div>
          <div class="text-sm text-gray-600">Total Elements</div>
        </div>
        <div class="stat-item p-4 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">${parsed.stats.elementsWithTestId}</div>
          <div class="text-sm text-gray-600">With Test IDs</div>
        </div>
        <div class="stat-item p-4 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">${parsed.stats.elementsWithId}</div>
          <div class="text-sm text-gray-600">With IDs</div>
        </div>
        <div class="stat-item p-4 bg-yellow-50 rounded-lg">
          <div class="text-2xl font-bold text-yellow-600">${testIdPercentage}%</div>
          <div class="text-sm text-gray-600">Test Coverage</div>
        </div>
      </div>
      
      <div class="mt-4 p-4 rounded-lg ${testIdPercentage >= 70 ? 'bg-green-50 border-green-200' : testIdPercentage >= 40 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border">
        <div class="flex items-center space-x-2">
          <span class="text-lg">
            ${testIdPercentage >= 70 ? '🟢' : testIdPercentage >= 40 ? '🟡' : '🔴'}
          </span>
          <span class="font-medium">
            ${testIdPercentage >= 70 
              ? 'Excelente cobertura de testing' 
              : testIdPercentage >= 40 
                ? 'Cobertura moderada - considera agregar más data-testid'
                : 'Baja cobertura - muchos elementos necesitan data-testid'
            }
          </span>
        </div>
      </div>
    `;

    analysisSection.classList.remove('hidden');
  }

  private displayElements(elements: ElementInfo[]): void {
    const elementSelectorSection = this.container.querySelector('#elementSelectorSection') as HTMLElement;
    const elementsList = this.container.querySelector('#elementsList') as HTMLElement;

    const flattenElements = (elems: ElementInfo[]): ElementInfo[] => {
      const result: ElementInfo[] = [];
      elems.forEach(elem => {
        result.push(elem);
        result.push(...flattenElements(elem.children));
      });
      return result;
    };

    const allElements = flattenElements(elements);
    const interactiveElements = allElements.filter(elem => 
      ['button', 'input', 'select', 'textarea', 'a'].includes(elem.tag) ||
      elem.attributes.role ||
      elem.id ||
      elem.attributes['data-testid']
    );

    elementsList.innerHTML = `
      <div class="space-y-2 max-h-64 overflow-y-auto">
        ${interactiveElements.map((elem, index) => `
          <div class="element-item p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
               data-element-index="${index}">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 bg-gray-100 text-xs rounded">${elem.tag}</span>
                ${elem.id ? `<span class="px-2 py-1 bg-blue-100 text-xs rounded">#${elem.id}</span>` : ''}
                ${elem.attributes['data-testid'] ? `<span class="px-2 py-1 bg-green-100 text-xs rounded">data-testid="${elem.attributes['data-testid']}"</span>` : ''}
                ${elem.classes.length > 0 ? `<span class="px-2 py-1 bg-purple-100 text-xs rounded">.${elem.classes[0]}${elem.classes.length > 1 ? `+${elem.classes.length - 1}` : ''}</span>` : ''}
              </div>
              <button class="generate-locators-btn px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      data-element-index="${index}">
                Generate
              </button>
            </div>
            ${elem.textContent ? `<div class="mt-1 text-sm text-gray-600">"${elem.textContent.substring(0, 50)}${elem.textContent.length > 50 ? '...' : ''}"</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;

    // Add click listeners for generate buttons
    elementsList.querySelectorAll('.generate-locators-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const elementIndex = parseInt((e.target as HTMLElement).getAttribute('data-element-index') || '0');
        this.generateLocatorsForElement(interactiveElements[elementIndex]);
      });
    });

    elementSelectorSection.classList.remove('hidden');
  }

  private generateLocatorsForElement(element: ElementInfo): void {
    this.selectedElement = element;
    const locators = generateLocators(element, this.options);
    this.displayLocators(locators);
    
    // Scroll to locators section
    const locatorsSection = this.container.querySelector('#locatorsSection');
    if (locatorsSection) {
      locatorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    trackEvent('locators_generated', {
      tool_name: 'locator-generator',
      element_tag: element.tag,
      locators_count: locators.length,
      has_testid: !!element.attributes['data-testid']
    });
  }

  private displayLocators(locators: GeneratedLocator[]): void {
    const locatorsSection = this.container.querySelector('#locatorsSection') as HTMLElement;
    const locatorsContainer = this.container.querySelector('#locatorsContainer') as HTMLElement;

    if (locators.length === 0) {
      locatorsContainer.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">🤷‍♂️</div>
          <p>No se pudieron generar locators para este elemento</p>
        </div>
      `;
      locatorsSection.classList.remove('hidden');
      return;
    }

    locatorsContainer.innerHTML = `
      <div class="space-y-4">
        ${locators.map((locator, index) => this.renderLocatorCard(locator, index)).join('')}
      </div>
    `;

    this.setupLocatorCardListeners();
    locatorsSection.classList.remove('hidden');
  }

  private renderLocatorCard(locator: GeneratedLocator, index: number): string {
    const robustnessColor = locator.robustnessScore >= 8 ? 'green' : 
                           locator.robustnessScore >= 6 ? 'yellow' : 
                           locator.robustnessScore >= 4 ? 'orange' : 'red';

    const validation = validateLocator(locator, this.currentHTML);

    return `
      <div class="locator-card bg-white border border-gray-200 rounded-lg p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 bg-${robustnessColor}-100 text-${robustnessColor}-800 text-sm font-medium rounded-full">
              ${locator.type.toUpperCase()}
            </span>
            <div class="text-sm text-gray-600">
              Robustez: 
              <span class="font-medium text-${robustnessColor}-600">${locator.robustnessScore}/10</span>
            </div>
            ${validation.isUnique ? 
              '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">✅ Único</span>' :
              `<span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">❌ ${validation.matchCount} matches</span>`
            }
          </div>
          <div class="flex space-x-2">
            <button class="copy-locator-btn px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    data-copy-target="locator-${index}">
              📋 Copiar Locator
            </button>
            <button class="copy-code-btn px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    data-copy-target="code-${index}">
              💻 Copiar Código
            </button>
          </div>
        </div>

        <div class="mb-3">
          <div class="text-sm text-gray-600 mb-1">Locator:</div>
          <code id="locator-${index}" class="block p-3 bg-gray-50 rounded text-sm font-mono break-all">${locator.locator}</code>
        </div>

        <div class="mb-3">
          <div class="text-sm text-gray-600 mb-1">${locator.framework.toUpperCase()} Code:</div>
          <code id="code-${index}" class="block p-3 bg-gray-900 text-green-400 rounded text-sm font-mono break-all">${locator.codeSnippet}</code>
        </div>

        <div class="text-sm text-gray-700 mb-3">${locator.description}</div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm font-medium text-green-700 mb-1">✅ Ventajas:</div>
            <ul class="text-sm text-gray-600 space-y-1">
              ${locator.pros.map(pro => `<li>• ${pro}</li>`).join('')}
            </ul>
          </div>
          <div>
            <div class="text-sm font-medium text-red-700 mb-1">❌ Desventajas:</div>
            <ul class="text-sm text-gray-600 space-y-1">
              ${locator.cons.map(con => `<li>• ${con}</li>`).join('')}
            </ul>
          </div>
        </div>

        ${validation.recommendations.length > 0 ? `
          <div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div class="text-sm font-medium text-yellow-800 mb-1">💡 Recomendaciones:</div>
            <ul class="text-sm text-yellow-700 space-y-1">
              ${validation.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }

  private setupLocatorCardListeners(): void {
    // Copy locator buttons
    this.container.querySelectorAll('.copy-locator-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).getAttribute('data-copy-target');
        if (target) {
          const element = this.container.querySelector(`#${target}`);
          if (element) {
            this.copyToClipboard(element.textContent || '', 'Locator copiado');
          }
        }
      });
    });

    // Copy code buttons
    this.container.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).getAttribute('data-copy-target');
        if (target) {
          const element = this.container.querySelector(`#${target}`);
          if (element) {
            this.copyToClipboard(element.textContent || '', 'Código copiado');
          }
        }
      });
    });
  }

  private regenerateLocators(): void {
    if (this.selectedElement) {
      const locators = generateLocators(this.selectedElement, this.options);
      this.displayLocators(locators);
    }
  }

  private copyToClipboard(text: string, successMessage: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showCopyFeedback(successMessage);
      
      trackEvent('copy_action', {
        tool_name: 'locator-generator',
        content_type: 'locator',
        success: true
      });
    }).catch(() => {
      this.showCopyFeedback('Error al copiar', true);
      
      trackEvent('copy_action', {
        tool_name: 'locator-generator',
        content_type: 'locator',
        success: false
      });
    });
  }

  private showCopyFeedback(message: string, isError = false): void {
    const feedback = document.createElement('div');
    feedback.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white font-medium z-50 transition-opacity ${
      isError ? 'bg-red-600' : 'bg-green-600'
    }`;
    feedback.textContent = message;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(feedback);
      }, 300);
    }, 2000);
  }

  private updateStatus(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const status = this.container.querySelector('#status') as HTMLElement;
    const colors = {
      success: 'text-green-600',
      error: 'text-red-600',
      info: 'text-gray-500'
    };

    status.textContent = message;
    status.className = colors[type];
  }

  private resetDisplay(): void {
    const sections = ['#analysisSection', '#elementSelectorSection', '#locatorsSection'];
    sections.forEach(selector => {
      const section = this.container.querySelector(selector) as HTMLElement;
      if (section) {
        section.classList.add('hidden');
      }
    });
    
    this.parsedHTML = null;
    this.selectedElement = null;
  }

  private clearAll(): void {
    const htmlInput = this.container.querySelector('#htmlInput') as HTMLTextAreaElement;
    const analyzeBtn = this.container.querySelector('#analyzeBtn') as HTMLButtonElement;

    htmlInput.value = '';
    analyzeBtn.disabled = true;
    
    this.resetDisplay();
    this.updateStatus('Introduce HTML para generar locators');
    this.currentHTML = '';

    trackEvent('clear_action', {
      tool_name: 'locator-generator'
    });
  }
}