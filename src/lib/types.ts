export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

export interface SavingGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Healthcare'
  | 'Education'
  | 'Other';

export interface ExpenseInsight {
  category: ExpenseCategory;
  total: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
} 