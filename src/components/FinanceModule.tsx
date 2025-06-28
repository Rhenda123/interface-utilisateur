import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Search, ArrowUp, ArrowDown, Edit, Trash2, Download, Plus, TrendingUp, TrendingDown, Wallet, Euro, Calendar, Filter, MoreHorizontal } from "lucide-react";

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
  category: string;
  limit: number;
  spent: number;
}

const categories = {
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
const pieColors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#10b981', '#059669'];

export default function FinanceModule() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', icon: "🎓", name: "Bourse d'études", amount: 500, type: 'income', category: 'Bourse', date: '2024-01-15' },
    { id: '2', icon: "🛒", name: "Courses", amount: 50, type: 'expense', category: 'Alimentation', date: '2024-01-18' },
    { id: '3', icon: "🏠", name: "Loyer", amount: 400, type: 'expense', category: 'Logement', date: '2024-01-20' },
    { id: '4', icon: "🚗", name: "Transport", amount: 30, type: 'expense', category: 'Transport', date: '2024-01-22' },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Alimentation', limit: 200, spent: 50 },
    { category: 'Transport', limit: 100, spent: 30 },
    { category: 'Loisirs', limit: 150, spent: 0 },
  ]);

  const [currency, setCurrency] = useState('EUR');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
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

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // Calculate current month summary
  const currentMonthData = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth();
    
    const currentMonthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonthNum;
    });

    const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const net = income - expenses;

    return { income, expenses, net };
  }, [transactions, currentDate]);

  // Calculate monthly data for charts
  const monthlyData = useMemo(() => {
    const months: { [key: string]: { month: string; income: number; expenses: number; net: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      if (!months[monthKey]) {
        months[monthKey] = { month: monthKey, income: 0, expenses: 0, net: 0 };
      }
      
      if (transaction.type === 'income') {
        months[monthKey].income += transaction.amount;
      } else {
        months[monthKey].expenses += transaction.amount;
      }
      months[monthKey].net = months[monthKey].income - months[monthKey].expenses;
    });
    
    return Object.values(months).sort((a, b) => new Date(a.month + ' 01').getTime() - new Date(b.month + ' 01').getTime());
  }, [transactions]);

  // Expense breakdown for pie chart
  const expenseBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        
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
      const bValue = sortBy === 'date' ? new Date(b.date).getTime() : a.amount;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [transactions, searchTerm, filterType, filterCategory, dateFilter, sortBy, sortOrder]);

  const getCurrencySymbol = () => {
    const symbols: { [key: string]: string } = { EUR: '€', USD: '$', GBP: '£', CAD: 'C$' };
    return symbols[currency] || currency;
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

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Finances</h2>
          <p className="text-gray-600 dark:text-gray-400">{currentMonth}</p>
        </div>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(curr => (
              <SelectItem key={curr} value={curr}>{curr}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solde actuel</p>
                <p className={`text-2xl font-bold ${currentMonthData.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {getCurrencySymbol()}{currentMonthData.net}
                </p>
              </div>
              <div className={`p-3 rounded-full ${currentMonthData.net >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <Wallet className={`w-6 h-6 ${currentMonthData.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 dark:border-gray-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenus</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {getCurrencySymbol()}{currentMonthData.income}
                </p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-gray-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dépenses</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {getCurrencySymbol()}{currentMonthData.expenses}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-gray-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredTransactions.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Evolution Chart */}
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Évolution mensuelle</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '2px solid #fcd34d',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#incomeGradient)" 
                    name="Revenus" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#expenseGradient)" 
                    name="Dépenses" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown Pie Chart */}
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Répartition des dépenses</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Section */}
      {budgets.length > 0 && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Budget mensuel</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {budgets.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOverBudget = percentage > 100;
                return (
                  <div key={budget.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {categoryIcons[budget.category]} {budget.category}
                      </span>
                      <span className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
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

      {/* Transactions Section */}
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Transactions</CardTitle>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent>
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
                        {categories[formData.type].map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
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
        <CardContent className="p-6">
          {/* Advanced Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value: 'all' | 'income' | 'expense') => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="income">Revenus</SelectItem>
                <SelectItem value="expense">Dépenses</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {[...categories.income, ...categories.expense].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="thisMonth">Ce mois</SelectItem>
                <SelectItem value="lastMonth">Mois dernier</SelectItem>
                <SelectItem value="thisYear">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: 'date' | 'amount') => setSortBy(value)}>
              <SelectTrigger>
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
              className="flex items-center gap-2"
            >
              {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
            </Button>
          </div>

          {/* Timeline-style Transactions List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="group relative flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border border-yellow-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
              >
                {/* Timeline dot */}
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${transaction.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                
                {/* Transaction content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{transaction.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">{transaction.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-lg ${
                        transaction.type === 'income' 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{getCurrencySymbol()}{transaction.amount}
                      </span>
                      
                      {/* Floating action buttons */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Dialog open={editingTransaction?.id === transaction.id} onOpenChange={(open) => !open && setEditingTransaction(null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => startEdit(transaction)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
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
                                  {categories[formData.type].map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                  ))}
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
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
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
    </div>
  );
}
