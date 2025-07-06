
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { FinanceStats } from '@/types/finance';

interface StatsCardsProps {
  stats: FinanceStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {/* Revenue Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3">
          <CardTitle className="text-sm lg:text-base font-semibold text-emerald-700 dark:text-emerald-300">
            Revenus
          </CardTitle>
          <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl lg:text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">
            €{stats.totalIncome.toLocaleString()}
          </div>
          <p className="text-xs lg:text-sm text-emerald-600 dark:text-emerald-400">
            Total des entrées
          </p>
        </CardContent>
      </Card>

      {/* Expenses Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-red-100 dark:from-red-900/20 dark:via-rose-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3">
          <CardTitle className="text-sm lg:text-base font-semibold text-red-700 dark:text-red-300">
            Dépenses
          </CardTitle>
          <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <TrendingDown className="h-4 w-4 lg:h-5 lg:w-5 text-red-600 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl lg:text-3xl font-bold text-red-900 dark:text-red-100 mb-1">
            €{stats.totalExpenses.toLocaleString()}
          </div>
          <p className="text-xs lg:text-sm text-red-600 dark:text-red-400">
            Total des sorties
          </p>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 dark:from-blue-900/20 dark:via-sky-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3">
          <CardTitle className="text-sm lg:text-base font-semibold text-blue-700 dark:text-blue-300">
            Solde
          </CardTitle>
          <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <Wallet className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`text-2xl lg:text-3xl font-bold mb-1 ${
            stats.balance >= 0 
              ? 'text-blue-900 dark:text-blue-100' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            €{stats.balance.toLocaleString()}
          </div>
          <p className="text-xs lg:text-sm text-blue-600 dark:text-blue-400">
            Différence
          </p>
        </CardContent>
      </Card>

      {/* Savings Rate Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3">
          <CardTitle className="text-sm lg:text-base font-semibold text-purple-700 dark:text-purple-300">
            Épargne
          </CardTitle>
          <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <PiggyBank className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl lg:text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
            {stats.savingsRate.toFixed(1)}%
          </div>
          <p className="text-xs lg:text-sm text-purple-600 dark:text-purple-400">
            Taux d'épargne
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
