import { SITE_CONFIG } from '../../utils/constants';

export function Header(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'bg-white shadow-sm border-b border-gray-200';
  
  header.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center">
          <a href="/" class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-primary-600">🛠️</span>
            <h1 class="text-xl font-bold text-gray-900">${SITE_CONFIG.name}</h1>
          </a>
        </div>
        
        <nav class="hidden md:flex space-x-6">
          <a href="/" class="text-gray-700 hover:text-primary-600 transition-colors">Inicio</a>
          <a href="/tools" class="text-gray-700 hover:text-primary-600 transition-colors">Herramientas</a>
          <a href="/about" class="text-gray-700 hover:text-primary-600 transition-colors">Acerca de</a>
        </nav>
        
        <button id="mobile-menu-btn" class="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div id="mobile-menu" class="md:hidden hidden pb-4">
        <div class="flex flex-col space-y-2">
          <a href="/" class="text-gray-700 hover:text-primary-600 transition-colors py-2">Inicio</a>
          <a href="/tools" class="text-gray-700 hover:text-primary-600 transition-colors py-2">Herramientas</a>
          <a href="/about" class="text-gray-700 hover:text-primary-600 transition-colors py-2">Acerca de</a>
        </div>
      </div>
    </div>
  `;
  
  // Mobile menu toggle
  const mobileMenuBtn = header.querySelector('#mobile-menu-btn');
  const mobileMenu = header.querySelector('#mobile-menu');
  
  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });
  
  return header;
}