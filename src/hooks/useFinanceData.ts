
import { useState, useEffect } from 'react';
import { Transaction, Category, Budget, FinanceStats } from '@/types/finance';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentation', color: '#10b981', icon: '🍕' },
  { id: '2', name: 'Transport', color: '#3b82f6', icon: '🚗' },
  { id: '3', name: 'Logement', color: '#f59e0b', icon: '🏠' },
  { id: '4', name: 'Loisirs', color: '#ef4444', icon: '🎬' },
  { id: '5', name: 'Santé', color: '#8b5cf6', icon: '💊' },
  { id: '6', name: 'Salaire', color: '#059669', icon: '💰' },
];

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('finance_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('finance_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('finance_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Calculate statistics
  const stats: FinanceStats = {
    totalIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    balance: 0,
    savingsRate: 0,
  };

  stats.balance = stats.totalIncome - stats.totalExpenses;
  stats.savingsRate = stats.totalIncome > 0 ? (stats.balance / stats.totalIncome) * 100 : 0;

  // Calculate budgets with spent amounts
  const budgetsWithSpent = budgets.map(budget => ({
    ...budget,
    spent: transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  return {
    transactions,
    categories,
    budgets: budgetsWithSpent,
    stats,
    setTransactions,
    setCategories,
    setBudgets,
  };
};
