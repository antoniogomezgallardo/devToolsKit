import { Tool } from '../../types';

export interface ToolCardProps {
  tool: Tool;
  onClick?: (tool: Tool) => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps): HTMLElement {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group';
  
  card.innerHTML = `
    <div class="p-6">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <span class="text-2xl">${tool.icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            ${tool.name}
          </h3>
          <p class="text-sm text-gray-600 mt-1 line-clamp-2">
            ${tool.description}
          </p>
          <div class="flex items-center mt-3 space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              ${tool.category}
            </span>
            ${tool.featured ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⭐ Popular</span>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
  
  if (onClick) {
    card.addEventListener('click', () => onClick(tool));
  }
  
  return card;
}