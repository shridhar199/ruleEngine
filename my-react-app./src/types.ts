export interface Cell {
  value: string;
}

export type SpreadsheetRow = Cell[];

export interface SpreadsheetData {
  title: string;
  rows: SpreadsheetRow[];
}

export interface ActionParameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  attributes?: ActionParameterAttribute[];
}
export interface ActionParameterAttribute {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  attributes?: ActionParameterAttribute[];
}

