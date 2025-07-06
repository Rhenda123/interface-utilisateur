import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Search, ArrowUp, ArrowDown, Edit, Trash2, Download, Plus, TrendingUp, TrendingDown, Wallet, Euro, Calendar, Filter, Settings, ChevronLeft, ChevronRight, Eye, BarChart3, Sparkles } from "lucide-react";
import BudgetManager from "@/components/finance/BudgetManager";
import CategoryManager from "@/components/finance/CategoryManager";

interface Transaction {
  id: string;
  icon: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  alertThreshold: number;
}

interface CustomCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

const defaultCategories = {
  income: ['Bourse', 'Travail', 'Famille', 'Autre revenu'],
  expense: ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Éducation', 'Autre dépense']
};

const categoryIcons: { [key: string]: string } = {
  'Bourse': '🎓',
  'Travail': '💼',
  'Famille': '👨‍👩‍👧‍👦',
  'Autre revenu': '💰',
  'Alimentation': '🍔',
  'Transport': '🚗',
  'Logement': '🏠',
  'Loisirs': '🎮',
  'Éducation': '📚',
  'Autre dépense': '💸'
};

const currencies = ['EUR', 'USD', 'GBP', 'CAD'];
const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'];

export default function FinanceModule() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("skoolife_transactions");
    return saved ? JSON.parse(saved) : [
      { id: '1', icon: "🎓", name: "Bourse d'études", amount: 500, type: 'income', category: 'Bourse', date: '2024-01-15' },
      { id: '2', icon: "🛒", name: "Courses", amount: 50, type: 'expense', category: 'Alimentation', date: '2024-01-18' },
      { id: '3', icon: "🏠", name: "Loyer", amount: 400, type: 'expense', category: 'Logement', date: '2024-01-20' },
      { id: '4', icon: "🚗", name: "Transport", amount: 30, type: 'expense', category: 'Transport', date: '2024-01-22' },
    ];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem("skoolife_budgets");
    return saved ? JSON.parse(saved) : [
      { id: '1', category: 'Alimentation', limit: 200, spent: 0, period: 'monthly', alertThreshold: 80 },
      { id: '2', category: 'Transport', limit: 100, spent: 0, period: 'monthly', alertThreshold: 80 },
      { id: '3', category: 'Loisirs', limit: 150, spent: 0, period: 'monthly', alertThreshold: 80 },
    ];
  });

  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem("skoolife_custom_categories");
    return saved ? JSON.parse(saved) : [];
  });

  const [currency, setCurrency] = useState('EUR');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showManagement, setShowManagement] = useState(false);
  const [mobileView, setMobileView] = useState<'overview' | 'charts' | 'transactions' | 'budget'>('overview');
  const [showBankDialog, setShowBankDialog] = useState(false);
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    icon: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const currentDate = new Date();
  const selectedDate = new Date(selectedMonth + '-01');
  const selectedMonthName = selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  
  const isCurrentMonth = selectedMonth === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const allCategories = useMemo(() => {
    const defaultCats = [...defaultCategories.income, ...defaultCategories.expense];
    const customCats = customCategories.map(cat => cat.name);
    return [...defaultCats, ...customCats];
  }, [customCategories]);

  useEffect(() => {
    const selectedYear = selectedDate.getFullYear();
    const selectedMonthNum = selectedDate.getMonth();
    
    const updatedBudgets = budgets.map(budget => {
      const relevantTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        const isExpense = t.type === 'expense';
        const isCategory = t.category === budget.category;
        
        let isInPeriod = false;
        switch (budget.period) {
          case 'monthly':
            isInPeriod = tDate.getFullYear() === selectedYear && tDate.getMonth() === selectedMonthNum;
            break;
          case 'quarterly':
            const quarter = Math.floor(selectedMonthNum / 3);
            const tQuarter = Math.floor(tDate.getMonth() / 3);
            isInPeriod = tDate.getFullYear() === selectedYear && tQuarter === quarter;
            break;
          case 'yearly':
            isInPeriod = tDate.getFullYear() === selectedYear;
            break;
        }
        
        return isExpense && isCategory && isInPeriod;
      });
      
      const spent = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });
    
    setBudgets(updatedBudgets);
  }, [transactions, selectedDate]);

  useEffect(() => {
    localStorage.setItem("skoolife_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("skoolife_budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("skoolife_custom_categories", JSON.stringify(customCategories));
  }, [customCategories]);

  const selectedMonthData = useMemo(() => {
    const selectedYear = selectedDate.getFullYear();
    const selectedMonthNum = selectedDate.getMonth();
    
    const selectedMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === selectedYear && tDate.getMonth() === selectedMonthNum;
    });

    const income = selectedMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = selectedMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const net = income - expenses;

    return { income, expenses, net };
  }, [transactions, selectedDate]);

  const monthlyData = useMemo(() => {
    const months: { [key: string]: { month: string; income: number; expenses: number; net: number } } = {};
    
    for (let i = -2; i <= 3; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + i, 1);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      months[monthKey] = { month: monthKey, income: 0, expenses: 0, net: 0 };
    }
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      if (months[monthKey]) {
        if (transaction.type === 'income') {
          months[monthKey].income += transaction.amount;
        } else {
          months[monthKey].expenses += transaction.amount;
        }
        months[monthKey].net = months[monthKey].income - months[monthKey].expenses;
      }
    });
    
    return Object.values(months);
  }, [transactions, selectedDate]);

  const expenseBreakdown = useMemo(() => {
    const selectedYear = selectedDate.getFullYear();
    const selectedMonthNum = selectedDate.getMonth();
    
    const breakdown: { [key: string]: number } = {};
    transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' && 
               tDate.getFullYear() === selectedYear && 
               tDate.getMonth() === selectedMonthNum;
      })
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      });
    
    return Object.entries(breakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, selectedDate]);

  const monthFilteredTransactions = useMemo(() => {
    const selectedYear = selectedDate.getFullYear();
    const selectedMonthNum = selectedDate.getMonth();
    
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === selectedYear && tDate.getMonth() === selectedMonthNum;
    });
  }, [transactions, selectedDate]);

  const filteredTransactions = useMemo(() => {
    let filtered = monthFilteredTransactions.filter(transaction => {
      const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = selectedDate;
        
        switch (dateFilter) {
          case 'thisMonth':
            matchesDate = transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
            break;
          case 'lastMonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            matchesDate = transactionDate.getMonth() === lastMonth.getMonth() && transactionDate.getFullYear() === lastMonth.getFullYear();
            break;
          case 'thisYear':
            matchesDate = transactionDate.getFullYear() === now.getFullYear();
            break;
        }
      }
      
      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });

    filtered.sort((a, b) => {
      const aValue = sortBy === 'date' ? new Date(a.date).getTime() : a.amount;
      const bValue = sortBy === 'date' ? new Date(b.date).getTime() : b.amount;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [monthFilteredTransactions, searchTerm, filterType, filterCategory, dateFilter, sortBy, sortOrder, selectedDate]);

  const getCurrencySymbol = () => {
    const symbols: { [key: string]: string } = { EUR: '€', USD: '$', GBP: '£', CAD: 'C$' };
    return symbols[currency] || currency;
  };

  const handleAddBudget = (budgetData: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Date.now().toString(),
      spent: 0
    };
    setBudgets([...budgets, newBudget]);
  };

  const handleUpdateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const handleAddCategory = (categoryData: Omit<CustomCategory, 'id'>) => {
    const newCategory: CustomCategory = {
      ...categoryData,
      id: Date.now().toString()
    };
    setCustomCategories([...customCategories, newCategory]);
  };

  const handleUpdateCategory = (id: string, updates: Partial<CustomCategory>) => {
    setCustomCategories(customCategories.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCategory = (id: string) => {
    setCustomCategories(customCategories.filter(c => c.id !== id));
  };

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      icon: formData.icon || categoryIcons[formData.category] || (formData.type === 'income' ? '💰' : '💸'),
      date: formData.date
    };

    setTransactions([...transactions, newTransaction]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditTransaction = () => {
    if (!editingTransaction) return;
    
    const updatedTransaction: Transaction = {
      ...editingTransaction,
      name: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      icon: formData.icon,
      date: formData.date
    };

    setTransactions(transactions.map(t => t.id === editingTransaction.id ? updatedTransaction : t));
    resetForm();
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      type: 'expense',
      category: '',
      icon: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const startEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      name: transaction.name,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      icon: transaction.icon,
      date: transaction.date
    });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Nom', 'Catégorie', 'Type', 'Montant'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => 
        [t.date, t.name, t.category, t.type, t.amount].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentSelectedDate = new Date(selectedMonth + '-01');
    const newDate = new Date(currentSelectedDate.getFullYear(), currentSelectedDate.getMonth() + (direction === 'next' ? 1 : -1), 1);
    setSelectedMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`);
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  };

  // Mobile navigation items - hide charts on mobile
  const mobileNavItems = [
    { id: 'overview', label: 'Aperçu', icon: Eye },
    { id: 'transactions', label: 'Transactions', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800">
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Enhanced Header with Glass Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Finances
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Gérez vos finances intelligemment
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Month Navigation */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-1">
                  <Button
                    onClick={() => navigateMonth('prev')}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="px-3 py-1">
                    <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 capitalize">
                      {selectedMonthName}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigateMonth('next')}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-16 sm:w-20 h-8 sm:h-9 bg-white/50 border-gray-200 dark:border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => setShowManagement(!showManagement)}
                    variant="outline"
                    size="sm"
                    className="bg-white/50 border-gray-200 dark:border-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="ml-1 hidden sm:inline">Gestion</span>
                  </Button>
                </div>
              </div>

              {/* Enhanced Mobile Navigation */}
              <div className="sm:hidden">
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  {mobileNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setMobileView(item.id as any)}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                        mobileView === item.id
                          ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-lg transform scale-105"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Section */}
        {showManagement && (
          <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-top-2 duration-300">
            <BudgetManager
              budgets={budgets}
              onAddBudget={handleAddBudget}
              onUpdateBudget={handleUpdateBudget}
              onDeleteBudget={handleDeleteBudget}
              categories={allCategories}
              getCurrencySymbol={getCurrencySymbol}
            />
            <CategoryManager
              categories={customCategories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
        )}

        {/* Enhanced Stats Cards */}
        {(mobileView === 'overview' || window.innerWidth >= 640) && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in-50 duration-500">
            {/* Balance Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-blue-100 truncate">Solde actuel</p>
                    <p className={`text-lg sm:text-2xl font-bold text-white truncate flex items-center gap-1`}>
                      {getCurrencySymbol()}{selectedMonthData.net}
                      {selectedMonthData.net >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-300" />
                      )}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Wallet className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Income Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-emerald-100 truncate">Revenus</p>
                    <p className="text-lg sm:text-2xl font-bold text-white truncate">
                      +{getCurrencySymbol()}{selectedMonthData.income}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expenses Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-orange-100 truncate">Dépenses</p>
                    <p className="text-lg sm:text-2xl font-bold text-white truncate">
                      -{getCurrencySymbol()}{selectedMonthData.expenses}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingDown className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Card */}
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-purple-100 truncate">Transactions</p>
                    <p className="text-lg sm:text-2xl font-bold text-white truncate">
                      {filteredTransactions.length}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section - Hidden on Mobile */}
        <div className="hidden sm:block animate-in fade-in-50 duration-700">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Enhanced Monthly Evolution Chart */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  Évolution mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                        formatter={(value: number, name: string) => [
                          `${getCurrencySymbol()}${value}`,
                          name === 'income' ? 'Revenus' : name === 'expenses' ? 'Dépenses' : name
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="income" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#incomeGradient)" 
                        name="income"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#f97316" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#expenseGradient)" 
                        name="expenses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Expense Breakdown */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  Répartition des dépenses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={pieColors[index % pieColors.length]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${getCurrencySymbol()}${value}`, 'Montant']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {expenseBreakdown.slice(0, 6).map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      />
                      <span className="truncate flex-1 font-medium">{entry.name}</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {getCurrencySymbol()}{entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Budget Section */}
        {(mobileView === 'budget' || window.innerWidth >= 640) && budgets.length > 0 && (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg animate-in fade-in-50 duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                Budget - {selectedMonthName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {budgets.map((budget) => {
                  const percentage = (budget.spent / budget.limit) * 100;
                  const isOverBudget = percentage > 100;
                  const isNearLimit = percentage > 80 && !isOverBudget;
                  
                  return (
                    <div key={budget.category} className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <span className="text-lg">{categoryIcons[budget.category]}</span>
                          <span className="truncate">{budget.category}</span>
                        </span>
                        <span className={`text-sm font-bold ${
                          isOverBudget ? 'text-red-600' : 
                          isNearLimit ? 'text-orange-600' : 
                          'text-gray-600'
                        }`}>
                          {getCurrencySymbol()}{budget.spent} / {getCurrencySymbol()}{budget.limit}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className={`h-3 ${
                            isOverBudget ? 'bg-red-100 dark:bg-red-900/30' : 
                            isNearLimit ? 'bg-orange-100 dark:bg-orange-900/30' : 
                            'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                        {isOverBudget && (
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      {isOverBudget && (
                        <p className="text-xs text-red-600 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
                          Dépassé de {getCurrencySymbol()}{budget.spent - budget.limit}
                        </p>
                      )}
                      {isNearLimit && !isOverBudget && (
                        <p className="text-xs text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">
                          Attention: {percentage.toFixed(0)}% utilisé
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Transactions Section */}
        {(mobileView === 'transactions' || window.innerWidth >= 640) && (
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg animate-in fade-in-50 duration-600">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  Transactions - {selectedMonthName}
                </CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={exportToCSV} variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm hover:shadow-md transition-all duration-200">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex-1 sm:flex-none text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Ajouter
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          Nouvelle transaction
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({...formData, type: value, category: ''})}>
                          <SelectTrigger className="bg-white/50 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">💰 Revenu</SelectItem>
                            <SelectItem value="expense">💸 Dépense</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Nom de la transaction"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-white/50 border-gray-200 dark:border-gray-700"
                        />
                        <Input
                          type="number"
                          placeholder="Montant"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          className="bg-white/50 border-gray-200 dark:border-gray-700"
                        />
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger className="bg-white/50 border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {(formData.type === 'income' ? defaultCategories.income : defaultCategories.expense).map(cat => (
                              <SelectItem key={cat} value={cat}>
                                {categoryIcons[cat]} {cat}
                              </SelectItem>
                            ))}
                            {customCategories
                              .filter(cat => cat.type === formData.type)
                              .map(cat => (
                                <SelectItem key={cat.id} value={cat.name}>
                                  {cat.icon} {cat.name}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="bg-white/50 border-gray-200 dark:border-gray-700"
                        />
                        <Button onClick={handleAddTransaction} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                          Ajouter la transaction
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Enhanced Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200 dark:border-gray-700 hover:bg-white transition-colors duration-200"
                  />
                </div>
                <Select value={filterType} onValueChange={(value: 'all' | 'income' | 'expense') => setFilterType(value)}>
                  <SelectTrigger className="bg-white/50 border-gray-200 dark:border-gray-700 hover:bg-white transition-colors duration-200">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="income">💰 Revenus</SelectItem>
                    <SelectItem value="expense">💸 Dépenses</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-white/50 border-gray-200 dark:border-gray-700 hover:bg-white transition-colors duration-200">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {allCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {categoryIcons[cat]} {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: 'date' | 'amount') => setSortBy(value)}>
                  <SelectTrigger className="bg-white/50 border-gray-200 dark:border-gray-700 hover:bg-white transition-colors duration-200">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">📅 Date</SelectItem>
                    <SelectItem value="amount">💰 Montant</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-2 bg-white/50 border-gray-200 dark:border-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}</span>
                </Button>
              </div>

              {/* Enhanced Transactions List */}
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {filteredTransactions.map((transaction, index) => (
                  <div 
                    key={transaction.id} 
                    className="group relative flex items-center gap-4 p-4 bg-gradient-to-r from-white via-gray-50/50 to-white dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 rounded-xl border border-gray-200/60 dark:border-gray-600/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  >
                    {/* Enhanced Timeline */}
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-3 h-3 rounded-full shadow-lg ${
                        transaction.type === 'income' ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 
                        'bg-gradient-to-r from-orange-400 to-red-500'
                      }`} />
                      {index < filteredTransactions.length - 1 && (
                        <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600" />
                      )}
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="text-2xl transform group-hover:scale-110 transition-transform duration-200">
                            {transaction.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {transaction.name}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="truncate font-medium">{transaction.category}</span>
                              <span>•</span>
                              <span className="flex-shrink-0">
                                {new Date(transaction.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`font-bold text-lg ${
                            transaction.type === 'income' 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{getCurrencySymbol()}{transaction.amount}
                          </span>
                          
                          {/* Enhanced Action Buttons */}
                          <div className="flex gap-1 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                            <Dialog open={editingTransaction?.id === transaction.id} onOpenChange={(open) => !open && setEditingTransaction(null)}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => startEdit(transaction)} className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Modifier la transaction
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({...formData, type: value})}>
                                    <SelectTrigger className="bg-white/50 border-gray-200 dark:border-gray-700">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="income">💰 Revenu</SelectItem>
                                      <SelectItem value="expense">💸 Dépense</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    placeholder="Nom"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="bg-white/50 border-gray-200 dark:border-gray-700"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Montant"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    className="bg-white/50 border-gray-200 dark:border-gray-700"
                                  />
                                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                                    <SelectTrigger className="bg-white/50 border-gray-200 dark:border-gray-700">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(formData.type === 'income' ? defaultCategories.income : defaultCategories.expense).map(cat => (
                                        <SelectItem key={cat} value={cat}>
                                          {categoryIcons[cat]} {cat}
                                        </SelectItem>
                                      ))}
                                      {customCategories
                                        .filter(cat => cat.type === formData.type)
                                        .map(cat => (
                                          <SelectItem key={cat.id} value={cat.name}>
                                            {cat.icon} {cat.name}
                                          </SelectItem>
                                        ))
                                      }
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="bg-white/50 border-gray-200 dark:border-gray-700"
                                  />
                                  <Button onClick={handleEditTransaction} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                                    Mettre à jour
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-0 shadow-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Supprimer la transaction
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                    Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action ne peut pas être annulée.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="hover:bg-gray-100 transition-colors duration-200">
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune transaction trouvée</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Ajoutez votre première transaction pour commencer
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
