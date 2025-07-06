
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Settings, Target, TrendingUp, Plus, Filter, DollarSign, PieChart } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Transaction } from '@/types/finance';
import StatsCards from './finance/StatsCards';
import TransactionForm from './finance/TransactionForm';
import TransactionList from './finance/TransactionList';
import ChartsSection from './finance/ChartsSection';
import { toast } from 'sonner';

const FinanceModule = () => {
  const {
    transactions,
    categories,
    budgets,
    stats,
    setTransactions,
    setCategories,
    setBudgets,
  } = useFinanceData();

  const [showCharts, setShowCharts] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, transaction]);
    setShowTransactionForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      {/* Professional Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Finance Manager
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Tableau de bord financier professionnel
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 justify-center lg:justify-end">
              <Button
                onClick={() => setShowTransactionForm(!showTransactionForm)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle Transaction
              </Button>
              
              <Button
                onClick={() => setShowCharts(!showCharts)}
                variant="outline"
                className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/20 px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PieChart className="w-5 h-5 mr-2" />
                {showCharts ? 'Masquer Graphiques' : 'Afficher Graphiques'}
              </Button>
              
              <Button 
                variant="outline" 
                className="hidden xl:flex border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20 px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Target className="w-5 h-5 mr-2" />
                Gérer Budgets
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Mobile Transaction Form */}
        {showTransactionForm && (
          <div className="xl:hidden">
            <TransactionForm
              categories={categories}
              onAddTransaction={handleAddTransaction}
            />
          </div>
        )}

        {/* Charts Section */}
        {showCharts && (
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <ChartsSection transactions={transactions} categories={categories} />
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Professional Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-3 py-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
              <span className="sm:hidden">Vue</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="flex items-center gap-3 py-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">Trans.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-3 py-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Rapports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Desktop Transaction Form */}
              <div className="hidden xl:block xl:col-span-1">
                <TransactionForm
                  categories={categories}
                  onAddTransaction={handleAddTransaction}
                />
              </div>
              
              {/* Recent Transactions */}
              <div className="xl:col-span-3">
                <TransactionList
                  transactions={transactions.slice(0, 6)}
                  categories={categories}
                  onDeleteTransaction={handleDeleteTransaction}
                  showFilters={false}
                />
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Desktop Form */}
              <div className="hidden xl:block xl:col-span-1">
                <TransactionForm
                  categories={categories}
                  onAddTransaction={handleAddTransaction}
                />
              </div>
              
              {/* Full Transaction List */}
              <div className="xl:col-span-4">
                <TransactionList
                  transactions={transactions}
                  categories={categories}
                  onDeleteTransaction={handleDeleteTransaction}
                  showFilters={true}
                />
              </div>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="min-h-[400px] shadow-lg border-gray-200 dark:border-gray-700">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200">
                  Rapports et Analyses Avancées
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
                  Fonctionnalités en développement
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-gray-500">
                  <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <BarChart3 className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    Rapports Détaillés Bientôt Disponibles
                  </h3>
                  <p className="text-base max-w-2xl mx-auto leading-relaxed">
                    Cette section contiendra des analyses approfondies, des prévisions financières, 
                    et des rapports personnalisés pour optimiser votre gestion financière.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FinanceModule;
