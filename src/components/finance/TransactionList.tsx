
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Filter, X, Calendar } from 'lucide-react';
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
    <Card className="shadow-lg border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-gray-200 text-lg lg:text-xl">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            Transactions ({filteredTransactions.length})
          </CardTitle>
          
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">📊 Tous les types</SelectItem>
                  <SelectItem value="income">💰 Revenus</SelectItem>
                  <SelectItem value="expense">💸 Dépenses</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48 h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🏷️ Toutes catégories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filterType !== 'all' || filterCategory !== 'all') && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="h-10 px-3">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-2">Aucune transaction trouvée</p>
            <p className="text-sm">Commencez par ajouter vos premières transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => {
                const categoryInfo = getCategoryInfo(transaction.category);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 lg:p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Category Icon */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: `${categoryInfo.color}15`, border: `2px solid ${categoryInfo.color}30` }}
                      >
                        <span style={{ color: categoryInfo.color }}>{categoryInfo.icon}</span>
                      </div>
                      
                      {/* Transaction Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base lg:text-lg">
                            {transaction.description}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                            transaction.type === 'income' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium">{categoryInfo.name}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Amount and Actions */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`text-xl lg:text-2xl font-bold ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toLocaleString()}
                      </span>
                      
                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(transaction.id)}
                          className="h-9 w-9 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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
