
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Settings, Target, TrendingUp, Plus, Filter } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile-Optimized Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-yellow-200 dark:border-gray-700 px-3 py-2 sm:px-6 sm:py-3 lg:px-8">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Finance Manager
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 hidden sm:block">
              Gérez vos finances personnelles avec simplicité
            </p>
          </div>
          
          {/* Compact Mobile Action Buttons */}
          <div className="flex gap-1.5 sm:gap-2 justify-center sm:justify-end">
            <Button
              onClick={() => setShowTransactionForm(!showTransactionForm)}
              className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 h-8 sm:h-9"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-2" />
              <span className="hidden xs:inline">Nouveau</span>
              <span className="xs:hidden">+</span>
            </Button>
            
            <Button
              onClick={() => setShowCharts(!showCharts)}
              variant="outline"
              className="flex-1 sm:flex-none border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 h-8 sm:h-9"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-2" />
              <span className="hidden sm:inline">{showCharts ? 'Masquer' : 'Graphiques'}</span>
              <span className="sm:hidden">📊</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="hidden lg:flex border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-sm h-9"
            >
              <Target className="w-4 h-4 mr-2" />
              Budgets
            </Button>
          </div>
        </div>
      </div>

      <div className="px-3 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Stats Cards - Ultra Compact for Mobile */}
        <StatsCards stats={stats} />

        {/* Mobile Transaction Form Modal */}
        {showTransactionForm && (
          <div className="lg:hidden">
            <TransactionForm
              categories={categories}
              onAddTransaction={handleAddTransaction}
            />
          </div>
        )}

        {/* Charts Section - Responsive */}
        {showCharts && (
          <div className="animate-fade-in">
            <ChartsSection transactions={transactions} categories={categories} />
          </div>
        )}

        {/* Main Content with Responsive Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Ultra-Compact Mobile Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 h-auto p-0.5 sm:p-1 bg-white dark:bg-gray-800 shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 py-1.5 sm:py-2 lg:py-3 text-[10px] xs:text-xs sm:text-sm"
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:hidden lg:inline">Vue d'ensemble</span>
              <span className="xs:hidden sm:inline lg:hidden">Vue</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 py-1.5 sm:py-2 lg:py-3 text-[10px] xs:text-xs sm:text-sm"
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Transactions</span>
              <span className="xs:hidden">Trans.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 py-1.5 sm:py-2 lg:py-3 text-[10px] xs:text-xs sm:text-sm"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Rapports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Mobile-First Layout */}
          <TabsContent value="overview" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {/* Desktop Transaction Form */}
              <div className="hidden lg:block lg:col-span-1">
                <TransactionForm
                  categories={categories}
                  onAddTransaction={handleAddTransaction}
                />
              </div>
              
              {/* Transaction List - Responsive */}
              <div className="lg:col-span-3">
                <TransactionList
                  transactions={transactions.slice(0, 8)}
                  categories={categories}
                  onDeleteTransaction={handleDeleteTransaction}
                  showFilters={false}
                />
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab - Full List */}
          <TabsContent value="transactions" className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {/* Desktop Form */}
              <div className="hidden lg:block lg:col-span-1">
                <TransactionForm
                  categories={categories}
                  onAddTransaction={handleAddTransaction}
                />
              </div>
              
              {/* Full Transaction List */}
              <div className="lg:col-span-4">
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
            <Card className="min-h-[300px] sm:min-h-[400px]">
              <CardHeader>
                <CardTitle className="text-center sm:text-left text-lg sm:text-xl">Rapports et Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12 lg:py-16 text-gray-500">
                  <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">Rapports à venir</h3>
                  <p className="text-xs sm:text-sm lg:text-base max-w-md mx-auto">
                    Les fonctionnalités de rapports détaillés seront disponibles prochainement.
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
