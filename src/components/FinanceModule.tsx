import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Search, ArrowUp, ArrowDown, Edit, Trash2, Download, Plus, TrendingUp, TrendingDown, Wallet, Euro, Calendar, Filter, Settings, ChevronLeft, ChevronRight, Eye, BarChart3 } from "lucide-react";
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
const pieColors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#10b981', '#059669', '#3b82f6', '#8b5cf6'];

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

  // Mobile navigation items
  const mobileNavItems = [
    { id: 'overview', label: 'Aperçu', icon: Eye },
    { id: 'charts', label: 'Graphiques', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: Wallet },
  ];

  return (
    <div className="space-y-3 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      {/* Mobile-First Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Finances</h2>
          </div>
        </div>

        {/* Aligned Header Controls - Month Selector, Currency, and Settings */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Month Navigation */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button
              onClick={() => navigateMonth('prev')}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 sm:h-9 sm:w-9 flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap truncate">
              {selectedMonthName}
            </p>
            <Button
              onClick={() => navigateMonth('next')}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 sm:h-9 sm:w-9 flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Currency and Settings Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-16 sm:w-20 h-8 sm:h-9">
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
              className="h-8 sm:h-9 px-2 sm:px-3"
            >
              <Settings className="w-4 h-4" />
              <span className="ml-1 hidden sm:inline">Gestion</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="sm:hidden">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-yellow-200 dark:border-gray-700">
            {mobileNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setMobileView(item.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  mobileView === item.id
                    ? "bg-gradient-to-r from-[#F6C103] to-[#E5AD03] text-gray-900 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="leading-none">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Management Section */}
      {showManagement && (
        <div className="space-y-4 sm:space-y-6">
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

      {/* Mobile Overview */}
      {(mobileView === 'overview' || window.innerWidth >= 640) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Solde actuel</p>
                  <p className={`text-lg sm:text-2xl font-bold truncate ${selectedMonthData.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {getCurrencySymbol()}{selectedMonthData.net}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${selectedMonthData.net >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  <Wallet className={`w-4 h-4 sm:w-6 sm:h-6 ${selectedMonthData.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-gray-700 shadow-lg">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Revenus</p>
                  <p className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    {getCurrencySymbol()}{selectedMonthData.income}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-gray-700 shadow-lg">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Dépenses</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 truncate">
                    {getCurrencySymbol()}{selectedMonthData.expenses}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                  <TrendingDown className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-gray-700 shadow-lg">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Transactions</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400 truncate">
                    {filteredTransactions.length}
                  </p>
                </div>
                <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Charts Section */}
      {(mobileView === 'charts' || window.innerWidth >= 640) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Monthly Evolution Chart */}
          <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Évolution mensuelle</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="h-48 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        border: '2px solid #fcd34d',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        fontSize: '12px'
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
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#incomeGradient)" 
                      name="income"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#expenseGradient)" 
                      name="expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown Donut Chart */}
          <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Répartition des dépenses</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="h-48 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={window.innerWidth < 640 ? 40 : 60}
                      outerRadius={window.innerWidth < 640 ? 80 : 120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${getCurrencySymbol()}${value}`, 'Montant']}
                      contentStyle={{ 
                        backgroundColor: 'var(--card)',
                        border: '2px solid #fcd34d',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                {expenseBreakdown.slice(0, 6).map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs sm:text-sm">
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: pieColors[index % pieColors.length] }}
                    />
                    <span className="truncate flex-1">{entry.name}</span>
                    <span className="font-medium">
                      {getCurrencySymbol()}{entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mobile Budget Section */}
      {(mobileView === 'budget' || window.innerWidth >= 640) && budgets.length > 0 && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Budget - {selectedMonthName}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOverBudget = percentage > 100;
                return (
                  <div key={budget.category} className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <span className="text-base">{categoryIcons[budget.category]}</span>
                        <span className="truncate">{budget.category}</span>
                      </span>
                      <span className={`text-xs sm:text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                        {getCurrencySymbol()}{budget.spent} / {getCurrencySymbol()}{budget.limit}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${isOverBudget ? 'bg-red-100' : 'bg-gray-200'}`}
                    />
                    {isOverBudget && (
                      <p className="text-xs text-red-600 font-medium">Budget dépassé de {getCurrencySymbol()}{budget.spent - budget.limit}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Transactions Section */}
      {(mobileView === 'transactions' || window.innerWidth >= 640) && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Transactions - {selectedMonthName}</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={exportToCSV} variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Export
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex-1 sm:flex-none text-xs sm:text-sm">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Nouvelle transaction</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({...formData, type: value, category: ''})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Revenu</SelectItem>
                          <SelectItem value="expense">Dépense</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Nom de la transaction"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      <Input
                        type="number"
                        placeholder="Montant"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.type === 'income' ? defaultCategories.income : defaultCategories.expense).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                      />
                      <Button onClick={handleAddTransaction} className="w-full">
                        Ajouter la transaction
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {/* Mobile-optimized Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 text-sm h-9"
                />
              </div>
              <Select value={filterType} onValueChange={(value: 'all' | 'income' | 'expense') => setFilterType(value)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="income">Revenus</SelectItem>
                  <SelectItem value="expense">Dépenses</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: 'date' | 'amount') => setSortBy(value)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Montant</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1 sm:gap-2 h-9 text-sm"
              >
                {sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}</span>
              </Button>
            </div>

            {/* Mobile-optimized Transactions List */}
            <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
              {filteredTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="group relative flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border border-yellow-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 touch-manipulation"
                >
                  {/* Timeline dot */}
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  
                  {/* Transaction content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <span className="text-base sm:text-xl flex-shrink-0">{transaction.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{transaction.name}</h4>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <span className="truncate">{transaction.category}</span>
                            <span>•</span>
                            <span className="flex-shrink-0">{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <span className={`font-bold text-sm sm:text-lg ${
                          transaction.type === 'income' 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{getCurrencySymbol()}{transaction.amount}
                        </span>
                        
                        {/* Mobile-friendly action buttons */}
                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <Dialog open={editingTransaction?.id === transaction.id} onOpenChange={(open) => !open && setEditingTransaction(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => startEdit(transaction)} className="h-8 w-8 p-0">
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-md mx-auto">
                              <DialogHeader>
                                <DialogTitle>Modifier la transaction</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({...formData, type: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="income">Revenu</SelectItem>
                                    <SelectItem value="expense">Dépense</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  placeholder="Nom"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                                <Input
                                  type="number"
                                  placeholder="Montant"
                                  value={formData.amount}
                                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                />
                                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {(formData.type === 'income' ? defaultCategories.income : defaultCategories.expense).map(cat => (
                                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                                />
                                <Button onClick={handleEditTransaction} className="w-full">
                                  Mettre à jour
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer la transaction</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action ne peut pas être annulée.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTransaction(transaction.id)}>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button for Mobile */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-[#F6C103] to-[#E5AD03] hover:from-[#E5AD03] hover:to-[#D4A103] text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
}
