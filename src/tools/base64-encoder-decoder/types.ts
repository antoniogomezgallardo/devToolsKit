export interface Base64Result {
  result: string;
  success: boolean;
  error?: string;
}

export interface Base64Stats {
  'Texto original': number;
  'Texto codificado': number;
  'Ratio': string;
  'Tipo': string;
}

export type EncodingType = 'encode' | 'decode';
export type InputFormat = 'text' | 'file';