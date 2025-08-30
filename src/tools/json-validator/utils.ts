export interface ValidationResult {
  isValid: boolean;
  formatted?: string;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
}

export function validateAndFormatJSON(input: string): ValidationResult {
  if (!input.trim()) {
    return {
      isValid: false,
      error: 'El campo está vacío. Introduce código JSON para validar.'
    };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    
    return {
      isValid: true,
      formatted
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error de sintaxis JSON';
    
    // Extract line and column from error message if available
    const lineMatch = errorMsg.match(/line (\d+)/i);
    const columnMatch = errorMsg.match(/column (\d+)/i);
    const positionMatch = errorMsg.match(/position (\d+)/i);
    
    let errorLine: number | undefined;
    let errorColumn: number | undefined;
    
    if (lineMatch) {
      errorLine = parseInt(lineMatch[1]);
    }
    
    if (columnMatch) {
      errorColumn = parseInt(columnMatch[1]);
    } else if (positionMatch) {
      // Convert position to line/column
      const position = parseInt(positionMatch[1]);
      const lines = input.substring(0, position).split('\n');
      errorLine = lines.length;
      errorColumn = lines[lines.length - 1].length + 1;
    }
    
    return {
      isValid: false,
      error: errorMsg,
      errorLine,
      errorColumn
    };
  }
}

export function getJSONInfo(jsonString: string): { [key: string]: any } | null {
  try {
    const parsed = JSON.parse(jsonString);
    const info: { [key: string]: any } = {};
    
    // Basic info
    info['Tipo'] = Array.isArray(parsed) ? 'Array' : typeof parsed;
    info['Tamaño (bytes)'] = new Blob([jsonString]).size;
    info['Líneas'] = jsonString.split('\n').length;
    
    if (Array.isArray(parsed)) {
      info['Elementos'] = parsed.length;
    } else if (typeof parsed === 'object' && parsed !== null) {
      info['Propiedades'] = Object.keys(parsed).length;
      info['Profundidad'] = getMaxDepth(parsed);
    }
    
    return info;
  } catch {
    return null;
  }
}

function getMaxDepth(obj: any, depth = 1): number {
  if (typeof obj !== 'object' || obj === null) {
    return depth;
  }
  
  let maxDepth = depth;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentDepth = getMaxDepth(obj[key], depth + 1);
      maxDepth = Math.max(maxDepth, currentDepth);
    }
  }
  
  return maxDepth;
}