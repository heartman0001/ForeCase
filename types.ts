
export interface Receivable {
  id: string;
  customerName: string;
  amount: number;
  dueDate: string;
  creditTerms: number;
  hasVat: boolean;
  responsiblePerson: string;
  installments: number;
}

export interface ForecastDataPoint {
  month: string;
  forecasted: number;
  actual?: number;
}

export interface User {
  email: string;
  name: string;
}
