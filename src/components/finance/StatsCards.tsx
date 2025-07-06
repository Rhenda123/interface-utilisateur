
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { FinanceStats } from '@/types/finance';

interface StatsCardsProps {
  stats: FinanceStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {/* Revenue Card */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
            Revenus
          </CardTitle>
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-lg sm:text-2xl font-bold text-green-800 dark:text-green-200">
            €{stats.totalIncome.toFixed(0)}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            <span className="hidden sm:inline">Total des entrées</span>
            <span className="sm:hidden">Entrées</span>
          </p>
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">
            Dépenses
          </CardTitle>
          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-lg sm:text-2xl font-bold text-red-800 dark:text-red-200">
            €{stats.totalExpenses.toFixed(0)}
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            <span className="hidden sm:inline">Total des sorties</span>
            <span className="sm:hidden">Sorties</span>
          </p>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
            Solde
          </CardTitle>
          <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className={`text-lg sm:text-2xl font-bold ${stats.balance >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-red-600'}`}>
            €{stats.balance.toFixed(0)}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            <span className="hidden sm:inline">Différence</span>
            <span className="sm:hidden">Solde</span>
          </p>
        </CardContent>
      </Card>

      {/* Savings Rate Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">
            <span className="hidden sm:inline">Taux d'épargne</span>
            <span className="sm:hidden">Épargne</span>
          </CardTitle>
          <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-lg sm:text-2xl font-bold text-purple-800 dark:text-purple-200">
            {stats.savingsRate.toFixed(0)}%
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            <span className="hidden sm:inline">Pourcentage épargné</span>
            <span className="sm:hidden">%</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
