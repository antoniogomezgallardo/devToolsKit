import { SITE_CONFIG } from '../../utils/constants';

export function Footer(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'bg-gray-50 border-t border-gray-200 mt-auto';
  
  const currentYear = new Date().getFullYear();
  
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Brand Section -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <span class="text-xl">🛠️</span>
            <span class="font-bold text-gray-900">${SITE_CONFIG.name}</span>
          </div>
          <p class="text-sm text-gray-600">
            ${SITE_CONFIG.description}
          </p>
        </div>
        
        <!-- Tools Section -->
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-900">Herramientas Populares</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="/tools/json-validator" class="text-gray-600 hover:text-primary-600">Validador JSON</a></li>
            <li><a href="/tools/jwt-decoder" class="text-gray-600 hover:text-primary-600">JWT Decoder</a></li>
            <li><a href="/tools/base64" class="text-gray-600 hover:text-primary-600">Base64 Encoder</a></li>
            <li><a href="/tools/password-generator" class="text-gray-600 hover:text-primary-600">Generador de Contraseñas</a></li>
          </ul>
        </div>
        
        <!-- Links Section -->
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-900">Enlaces</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="/privacy" class="text-gray-600 hover:text-primary-600">Política de Privacidad</a></li>
            <li><a href="/terms" class="text-gray-600 hover:text-primary-600">Términos de Uso</a></li>
            <li><a href="https://github.com/antoniogomezgallardo/devToolsKit" target="_blank" class="text-gray-600 hover:text-primary-600">GitHub</a></li>
            <li><a href="/contact" class="text-gray-600 hover:text-primary-600">Contacto</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="border-t border-gray-200 mt-8 pt-6 text-center">
        <p class="text-sm text-gray-500">
          © ${currentYear} ${SITE_CONFIG.name}. Todos los derechos reservados.
        </p>
        <p class="text-xs text-gray-400 mt-2">
          Hecho con ❤️ para la comunidad de desarrolladores
        </p>
      </div>
    </div>
  `;
  
  return footer;
}