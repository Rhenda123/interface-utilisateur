
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, Category } from '@/types/finance';

interface ChartsSectionProps {
  transactions: Transaction[];
  categories: Category[];
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ transactions, categories }) => {
  // Prepare data for expense pie chart
  const expenseData = categories.map(category => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.category === category.id)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: category.name,
      value: total,
      color: category.color,
      icon: category.icon,
    };
  }).filter(item => item.value > 0);

  // Prepare data for income vs expenses
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeExpenseData = [
    { name: 'Revenus', value: totalIncome, fill: '#10b981' },
    { name: 'Dépenses', value: totalExpenses, fill: '#ef4444' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 border rounded-lg shadow-lg text-xs sm:text-sm">
          <p className="font-medium">{label || payload[0].payload.name}</p>
          <p>
            <span style={{ color: payload[0].color }}>●</span>
            {` €${payload[0].value.toFixed(2)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({ name, percent }: any) => {
    // Only show label on larger screens
    if (window.innerWidth < 640) {
      return `${(percent * 100).toFixed(0)}%`;
    }
    return `${name} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      {/* Expense Distribution Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">
            <span className="hidden sm:inline">Répartition des dépenses</span>
            <span className="sm:hidden">Dépenses</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={window.innerWidth < 640 ? 80 : 100}
                  dataKey="value"
                  label={CustomPieLabel}
                  labelLine={false}
                  fontSize={window.innerWidth < 640 ? 10 : 12}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-sm sm:text-base">Aucune dépense à afficher</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Income vs Expenses Chart */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">
            <span className="hidden sm:inline">Revenus vs Dépenses</span>
            <span className="sm:hidden">Revenus / Dépenses</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={incomeExpenseData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                fontSize={window.innerWidth < 640 ? 10 : 12}
                tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
              />
              <YAxis 
                fontSize={window.innerWidth < 640 ? 10 : 12}
                tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                maxBarSize={window.innerWidth < 640 ? 60 : 80}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
