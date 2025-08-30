export interface TextAreaProps {
  placeholder?: string;
  value?: string;
  onInput?: (value: string) => void;
  rows?: number;
  className?: string;
  disabled?: boolean;
  readonly?: boolean;
}

export function TextArea({
  placeholder = '',
  value = '',
  onInput,
  rows = 4,
  className = '',
  disabled = false,
  readonly = false
}: TextAreaProps): HTMLTextAreaElement {
  const textarea = document.createElement('textarea');
  
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm resize-vertical';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  const readonlyClasses = readonly ? 'bg-gray-50' : '';
  
  textarea.className = `${baseClasses} ${disabledClasses} ${readonlyClasses} ${className}`;
  textarea.placeholder = placeholder;
  textarea.value = value;
  textarea.rows = rows;
  textarea.disabled = disabled;
  textarea.readOnly = readonly;
  
  if (onInput && !disabled && !readonly) {
    textarea.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement;
      onInput(target.value);
    });
  }
  
  return textarea;
}