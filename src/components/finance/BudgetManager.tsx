
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2, Target, AlertTriangle } from "lucide-react";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  alertThreshold: number; // percentage (e.g., 80 for 80%)
}

interface BudgetManagerProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onUpdateBudget: (id: string, budget: Partial<Budget>) => void;
  onDeleteBudget: (id: string) => void;
  categories: string[];
  getCurrencySymbol: () => string;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({
  budgets,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
  categories,
  getCurrencySymbol
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    alertThreshold: '80'
  });

  const resetForm = () => {
    setFormData({
      category: '',
      limit: '',
      period: 'monthly',
      alertThreshold: '80'
    });
    setEditingBudget(null);
  };

  const handleSave = () => {
    if (!formData.category || !formData.limit) return;

    if (editingBudget) {
      onUpdateBudget(editingBudget.id, {
        category: formData.category,
        limit: parseFloat(formData.limit),
        period: formData.period,
        alertThreshold: parseFloat(formData.alertThreshold)
      });
    } else {
      onAddBudget({
        category: formData.category,
        limit: parseFloat(formData.limit),
        period: formData.period,
        alertThreshold: parseFloat(formData.alertThreshold)
      });
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const startEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period,
      alertThreshold: budget.alertThreshold.toString()
    });
    setIsAddDialogOpen(true);
  };

  return (
    <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Budgets
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? 'Modifier le budget' : 'Nouveau budget'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Montant limite"
                  value={formData.limit}
                  onChange={(e) => setFormData({...formData, limit: e.target.value})}
                />
                <Select value={formData.period} onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setFormData({...formData, period: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="quarterly">Trimestriel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Seuil d'alerte (%)"
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({...formData, alertThreshold: e.target.value})}
                  min="1"
                  max="100"
                />
                <Button onClick={handleSave} className="w-full">
                  {editingBudget ? 'Mettre à jour' : 'Créer le budget'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun budget défini</p>
            <p className="text-sm">Créez votre premier budget pour suivre vos dépenses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOverBudget = percentage > 100;
              const isNearLimit = percentage >= budget.alertThreshold && !isOverBudget;
              
              return (
                <div key={budget.id} className="p-4 border rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{budget.category}</h4>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(budget)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteBudget(budget.id)}>
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {getCurrencySymbol()}{budget.spent} / {getCurrencySymbol()}{budget.limit}
                      </span>
                      <span className={`font-medium ${isOverBudget ? 'text-red-600' : isNearLimit ? 'text-orange-600' : 'text-green-600'}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${isOverBudget ? 'bg-red-100' : isNearLimit ? 'bg-orange-100' : 'bg-green-100'}`}
                    />
                    
                    <div className="flex items-center gap-1 text-xs">
                      {isOverBudget && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Budget dépassé de {getCurrencySymbol()}{(budget.spent - budget.limit).toFixed(2)}</span>
                        </div>
                      )}
                      {isNearLimit && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Proche de la limite</span>
                        </div>
                      )}
                      <span className="text-gray-500 ml-auto">
                        {budget.period === 'monthly' ? 'Mensuel' : budget.period === 'quarterly' ? 'Trimestriel' : 'Annuel'}
                      </span>
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

export default BudgetManager;
