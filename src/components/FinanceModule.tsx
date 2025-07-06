import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, Trash2, Edit, PiggyBank, TrendingUp, TrendingDown, DollarSign, BarChart3, Settings, Target, Wallet, CreditCard, Calendar, Filter, Download, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import BudgetManager from "./finance/BudgetManager";
import CategoryManager from "./finance/CategoryManager";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  spent?: number;
  alertThreshold: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#9cafff', '#1ca691', '#d9ff9c', '#ff9c9c', '#9cffff'];

const FinanceModule = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem("skoolife_transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("skoolife_categories");
    return savedCategories ? JSON.parse(savedCategories) : [
      { id: 'default', name: 'General', color: '#0088FE' }
    ];
  });
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const savedBudgets = localStorage.getItem("skoolife_budgets");
    return savedBudgets ? JSON.parse(savedBudgets) : [];
  });
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    amount: 0,
    type: 'expense',
    category: 'default'
  });
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [showCharts, setShowCharts] = useState(false);
  const [selectedTab, setSelectedTab] = useState("transactions");
  const [showBudgetManager, setShowBudgetManager] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showHiddenTransactions, setShowHiddenTransactions] = useState(true);

  useEffect(() => {
    localStorage.setItem("skoolife_transactions", JSON.stringify(transactions));
    const transactionUpdateEvent = new CustomEvent('transactionUpdate', { detail: transactions });
    window.dispatchEvent(transactionUpdateEvent);
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("skoolife_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("skoolife_budgets", JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    const newTransactionWithId: Transaction = { ...newTransaction, id: Date.now().toString() };
    setTransactions([...transactions, newTransactionWithId]);
    setNewTransaction({
      date: new Date().toISOString().slice(0, 10),
      description: '',
      amount: 0,
      type: 'expense',
      category: 'default'
    });
    toast.success("Transaction ajoutée avec succès!");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    toast.success("Transaction supprimée!");
  };

  const startEditing = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id);
    setNewTransaction({ ...transaction });
  };

  const cancelEditing = () => {
    setEditingTransactionId(null);
    setNewTransaction({
      date: new Date().toISOString().slice(0, 10),
      description: '',
      amount: 0,
      type: 'expense',
      category: 'default'
    });
  };

  const updateTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setTransactions(transactions.map(transaction =>
      transaction.id === editingTransactionId ? { ...newTransaction, id: editingTransactionId } : transaction
    ));
    setEditingTransactionId(null);
    setNewTransaction({
      date: new Date().toISOString().slice(0, 10),
      description: '',
      amount: 0,
      type: 'expense',
      category: 'default'
    });
    toast.success("Transaction modifiée!");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const totalBalance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
  }, 0);

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const categoryData = categories.map(category => {
    const categoryTotal = transactions
      .filter(transaction => transaction.category === category.id && transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return { name: category.name, value: categoryTotal, color: category.color };
  });

  const filteredTransactions = transactions.filter(transaction => {
    if (filterCategory && transaction.category !== filterCategory) {
      return false;
    }
    if (filterType && transaction.type !== filterType) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setFilterCategory(null);
    setFilterType(null);
  };

  const downloadTransactionsCSV = () => {
    const csvRows = [];
    const headers = Object.keys(transactions[0]);
    csvRows.push(headers.join(','));

    for (const row of transactions) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transactions.csv');
    a.click();
  };

  const categoryNames = categories.map(cat => cat.name);
  const customCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    type: 'expense' as const,
    icon: '📦',
    color: cat.color
  }));

  // Calculate spent amounts for budgets based on transactions
  const budgetsWithSpent = budgets.map(budget => {
    const spent = transactions
      .filter(transaction => 
        transaction.type === 'expense' && 
        transaction.category === budget.category
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    return {
      ...budget,
      spent
    };
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header with Stats Cards */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#F6C103] to-[#E5AC00] bg-clip-text text-transparent">
            Gestion Financière
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Suivez vos revenus, dépenses et budgets
          </p>
        </div>
        
        {/* Action Buttons - Hide "Graphiques" on mobile only */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setShowCharts(!showCharts)}
            variant="outline"
            className="hidden sm:flex items-center gap-2 border-[#F6C103] text-[#F6C103] hover:bg-[#F6C103] hover:text-white flex-1 sm:flex-none"
          >
            <BarChart3 className="w-4 h-4" />
            {showCharts ? 'Masquer' : 'Graphiques'}
          </Button>
          
          <Dialog open={showBudgetManager} onOpenChange={setShowBudgetManager}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 flex-1 sm:flex-none">
                <Target className="w-4 h-4" />
                Budgets
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Gestion des Budgets</DialogTitle>
              </DialogHeader>
              <BudgetManager 
                budgets={budgetsWithSpent}
                onAddBudget={(budget) => setBudgets([...budgets, { ...budget, id: Date.now().toString() }])}
                onUpdateBudget={(id, updatedBudget) => setBudgets(budgets.map(b => b.id === id ? { ...b, ...updatedBudget } : b))}
                onDeleteBudget={(id) => setBudgets(budgets.filter(b => b.id !== id))}
                categories={categoryNames}
                getCurrencySymbol={() => '€'}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showCategoryManager} onOpenChange={setShowCategoryManager}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex-1 sm:flex-none">
                <Settings className="w-4 h-4" />
                Catégories
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Gestion des Catégories</DialogTitle>
              </DialogHeader>
              <CategoryManager 
                categories={customCategories}
                onAddCategory={(category) => {
                  const newCategory = {
                    id: Date.now().toString(),
                    name: category.name,
                    color: category.color
                  };
                  setCategories([...categories, newCategory]);
                }}
                onUpdateCategory={(id, updatedCategory) => {
                  setCategories(categories.map(c => c.id === id ? { ...c, name: updatedCategory.name || c.name, color: updatedCategory.color || c.color } : c));
                }}
                onDeleteCategory={(id) => setCategories(categories.filter(c => c.id !== id))}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Monthly Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" />Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">€{income.toFixed(2)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total des revenus ce mois</p>
          </CardContent>
        </Card>

        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-500" />Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">€{expenses.toFixed(2)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total des dépenses ce mois</p>
          </CardContent>
        </Card>

        <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><PiggyBank className="w-5 h-5 text-blue-500" />Solde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">€{totalBalance.toFixed(2)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Solde actuel</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {showCharts && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Répartition des dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {
                      categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))
                    }
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Revenus vs Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[{ name: 'Revenus', value: income }, { name: 'Dépenses', value: expenses }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Ajouter une Transaction</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} />
              <Input type="text" name="description" placeholder="Description" value={newTransaction.description} onChange={handleInputChange} />
              <Input type="number" name="amount" placeholder="Montant" value={newTransaction.amount} onChange={handleInputChange} />
              <Select value={newTransaction.type} onValueChange={(value) => handleInputChange({ target: { name: 'type', value } } as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Revenu</SelectItem>
                  <SelectItem value="expense">Dépense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newTransaction.category} onValueChange={(value) => handleInputChange({ target: { name: 'category', value } } as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editingTransactionId ? (
                <div className="flex gap-2">
                  <Button onClick={updateTransaction} className="bg-blue-500 text-white hover:bg-blue-700">Modifier</Button>
                  <Button onClick={cancelEditing} variant="ghost">Annuler</Button>
                </div>
              ) : (
                <Button onClick={addTransaction} className="bg-green-500 text-white hover:bg-green-700">Ajouter</Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Liste des Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-4 flex flex-wrap gap-2">
                <Select value={filterCategory || ""} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Filtrer par Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les Catégories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterType || ""} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Filtrer par Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les Types</SelectItem>
                    <SelectItem value="income">Revenu</SelectItem>
                    <SelectItem value="expense">Dépense</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={clearFilters} variant="ghost">
                  Effacer les Filtres
                </Button>

                <Button onClick={downloadTransactionsCSV} variant="secondary" className="ml-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger CSV
                </Button>

                <Button onClick={() => setShowHiddenTransactions(!showHiddenTransactions)} variant="outline">
                  {showHiddenTransactions ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Afficher
                    </>
                  )}
                </Button>
              </div>

              {/* Transaction List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs leading-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs leading-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs leading-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs leading-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs leading-4 font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Catégorie</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTransactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">€{transaction.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{categories.find(cat => cat.id === transaction.category)?.name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm leading-5">
                          <Button onClick={() => startEditing(transaction)} variant="ghost" className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button onClick={() => deleteTransaction(transaction.id)} variant="ghost" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Aperçu Analytique</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fonctionnalités d'analyse à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card className="border-[#F6C103] dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Rapports Financiers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fonctionnalités de génération de rapports à venir...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceModule;
