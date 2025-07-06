
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Settings, Target, TrendingUp } from 'lucide-react';
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

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions([...transactions, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Finance Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gérez vos finances personnelles avec simplicité
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCharts(!showCharts)}
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showCharts ? 'Masquer graphiques' : 'Voir graphiques'}
          </Button>
          
          <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
            <Target className="w-4 h-4 mr-2" />
            Budgets
          </Button>
          
          <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      {showCharts && (
        <div className="animate-fade-in">
          <ChartsSection transactions={transactions} categories={categories} />
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1">
              <TransactionForm
                categories={categories}
                onAddTransaction={handleAddTransaction}
              />
            </div>
            <div className="xl:col-span-2">
              <TransactionList
                transactions={transactions.slice(0, 5)}
                categories={categories}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-1">
              <TransactionForm
                categories={categories}
                onAddTransaction={handleAddTransaction}
              />
            </div>
            <div className="xl:col-span-3">
              <TransactionList
                transactions={transactions}
                categories={categories}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Rapports et Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Rapports à venir</h3>
                <p>Les fonctionnalités de rapports détaillés seront disponibles prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceModule;
