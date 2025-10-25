export interface BudgetItem {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
}

export interface SavingsGoal {
  amount: number;
}
