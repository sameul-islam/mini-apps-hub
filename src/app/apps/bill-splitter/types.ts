export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  participantId: string;
  description: string;
  amount: number;
}

export interface Settings {
  tip: number;
  tax: number;
  currency: string;
}
