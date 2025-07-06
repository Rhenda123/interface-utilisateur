
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Filter, X, MoreHorizontal } from 'lucide-react';
import { Transaction, Category } from '@/types/finance';
import { toast } from 'sonner';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
  showFilters?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onDeleteTransaction,
  showFilters = true,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType !== 'all' && transaction.type !== filterType) return false;
    if (filterCategory !== 'all' && transaction.category !== filterCategory) return false;
    return true;
  });

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || { name: 'Unknown', icon: '❓', color: '#gray' };
  };

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
    toast.success('Transaction supprimée');
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterCategory('all');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2 sm:pb-3 lg:pb-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg lg:text-xl">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
            <span className="hidden sm:inline">Transactions ({filteredTransactions.length})</span>
            <span className="sm:hidden">({filteredTransactions.length})</span>
          </CardTitle>
          
          {showFilters && (
            <div className="flex flex-col xs:flex-row gap-1.5 sm:gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full xs:w-24 sm:w-28 lg:w-32 h-7 sm:h-8 lg:h-9 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="income">Revenus</SelectItem>
                  <SelectItem value="expense">Dépenses</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full xs:w-28 sm:w-32 lg:w-36 h-7 sm:h-8 lg:h-9 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filterType !== 'all' || filterCategory !== 'all') && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="h-7 sm:h-8 lg:h-9 px-2">
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-2 sm:px-4 lg:px-6">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-6 sm:py-8 lg:py-12 text-gray-500">
            <p className="text-xs sm:text-sm lg:text-base">Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
            {filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => {
                const categoryInfo = getCategoryInfo(transaction.category);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-2 sm:p-3 lg:p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                      {/* Category Icon */}
                      <div 
                        className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm lg:text-lg flex-shrink-0"
                        style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
                      >
                        {categoryInfo.icon}
                      </div>
                      
                      {/* Transaction Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                          <h4 className="font-medium truncate text-xs sm:text-sm lg:text-base">{transaction.description}</h4>
                          <span className={`px-1.5 py-0.5 text-[10px] sm:text-xs rounded-full flex-shrink-0 ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? 'R' : 'D'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          <span className="truncate max-w-16 sm:max-w-none">{categoryInfo.name}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short',
                            year: '2-digit'
                          })}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Amount and Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">
                      <span className={`text-xs sm:text-sm lg:text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toFixed(0)}
                      </span>
                      
                      {/* Actions */}
                      <div className="flex gap-0.5 sm:gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 p-0 hidden sm:flex">
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(transaction.id)}
                          className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
