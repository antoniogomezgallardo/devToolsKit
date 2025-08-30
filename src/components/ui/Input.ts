export interface InputProps {
  placeholder?: string;
  value?: string;
  onInput?: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password';
  className?: string;
  disabled?: boolean;
}

export function Input({
  placeholder = '',
  value = '',
  onInput,
  type = 'text',
  className = '',
  disabled = false
}: InputProps): HTMLInputElement {
  const input = document.createElement('input');
  
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  input.className = `${baseClasses} ${disabledClasses} ${className}`;
  input.type = type;
  input.placeholder = placeholder;
  input.value = value;
  input.disabled = disabled;
  
  if (onInput && !disabled) {
    input.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      onInput(target.value);
    });
  }
  
  return input;
}