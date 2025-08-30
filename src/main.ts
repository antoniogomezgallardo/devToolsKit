import './style.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToolCard } from './components/common/ToolCard';
import { JSONValidator } from './tools/json-validator/JSONValidator';
import { TOOLS, SITE_CONFIG } from './utils/constants';

class App {
  private app: HTMLElement;
  private currentRoute: string;

  constructor() {
    this.app = document.querySelector('#app')!;
    this.currentRoute = window.location.pathname;
    this.init();
    this.handleRouting();
  }

  private init(): void {
    this.app.appendChild(Header());
    
    const main = document.createElement('main');
    main.className = 'flex-1';
    main.id = 'main-content';
    this.app.appendChild(main);
    
    this.app.appendChild(Footer());
    
    this.renderCurrentPage();
  }

  private renderCurrentPage(): void {
    const mainContent = document.querySelector('#main-content') as HTMLElement;
    
    switch (this.currentRoute) {
      case '/':
        this.renderHomePage(mainContent);
        break;
      case '/tools/json-validator':
        this.renderJSONValidator(mainContent);
        break;
      default:
        this.renderHomePage(mainContent);
        break;
    }
  }

  private renderHomePage(container: HTMLElement): void {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 py-12">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🛠️ ${SITE_CONFIG.name}
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ${SITE_CONFIG.description}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#tools" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors">
              Ver Herramientas
            </a>
            <a href="https://github.com/antoniogomezgallardo/devToolsKit" target="_blank" class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              GitHub
            </a>
          </div>
        </div>

        <!-- Featured Tools -->
        <section id="tools" class="mb-12">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Herramientas Destacadas</h2>
            <p class="text-lg text-gray-600">Las herramientas más útiles para desarrolladores, testers y DevOps</p>
          </div>
          
          <div id="tools-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Tools will be rendered here -->
          </div>
        </section>

        <!-- Features -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="text-center">
            <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Ultra Rápido</h3>
            <p class="text-gray-600">Todas las herramientas funcionan completamente en tu navegador. Sin esperas, sin servidores.</p>
          </div>
          
          <div class="text-center">
            <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🔒</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">100% Privado</h3>
            <p class="text-gray-600">Tus datos nunca abandonan tu dispositivo. Funciona offline y sin registro.</p>
          </div>
          
          <div class="text-center">
            <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🎯</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Especializado</h3>
            <p class="text-gray-600">Diseñado específicamente para desarrolladores con las mejores prácticas.</p>
          </div>
        </section>
      </div>
    `;

    this.renderToolsGrid();
  }

  private renderToolsGrid(): void {
    const toolsGrid = document.querySelector('#tools-grid') as HTMLElement;
    if (!toolsGrid) return;

    const featuredTools = TOOLS.filter(tool => tool.featured);
    
    featuredTools.forEach(tool => {
      const toolCard = ToolCard({
        tool,
        onClick: (selectedTool) => {
          this.navigate(selectedTool.path);
        }
      });
      toolsGrid.appendChild(toolCard);
    });
  }

  private renderJSONValidator(container: HTMLElement): void {
    container.innerHTML = '';
    new JSONValidator(container);
    
    // Update page title
    document.title = 'Validador JSON - DevToolsKit';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.content = 'Validador JSON online - Valida, formatea y analiza código JSON con detección de errores. Gratis, rápido y sin registro.';
    }
  }

  private navigate(path: string): void {
    window.history.pushState({}, '', path);
    this.currentRoute = path;
    this.renderCurrentPage();
  }

  private handleRouting(): void {
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname;
      this.renderCurrentPage();
    });

    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/"]') as HTMLAnchorElement;
      
      if (link && !link.hasAttribute('target')) {
        e.preventDefault();
        this.navigate(link.pathname);
      }
    });
  }
}

// Initialize app
new App();
