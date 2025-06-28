
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag, Palette } from "lucide-react";

interface CustomCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

interface CategoryManagerProps {
  categories: CustomCategory[];
  onAddCategory: (category: Omit<CustomCategory, 'id'>) => void;
  onUpdateCategory: (id: string, category: Partial<CustomCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    icon: '📦',
    color: '#3b82f6'
  });

  const availableIcons = ['📦', '🎯', '🏃', '🎵', '📱', '🍕', '⚡', '🎨', '📚', '🔧', '🏠', '✈️', '🎭', '💊', '🐕', '🌱'];
  const availableColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'];

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'expense',
      icon: '📦',
      color: '#3b82f6'
    });
    setEditingCategory(null);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, formData);
    } else {
      onAddCategory(formData);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const startEdit = (category: CustomCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color
    });
    setIsDialogOpen(true);
  };

  return (
    <Card className="border-yellow-200 dark:border-gray-700 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Catégories personnalisées
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle catégorie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nom de la catégorie"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <Select value={formData.type} onValueChange={(value: 'income' | 'expense') => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Revenu</SelectItem>
                    <SelectItem value="expense">Dépense</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Icône</label>
                  <div className="grid grid-cols-8 gap-2">
                    {availableIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({...formData, icon})}
                        className={`p-2 text-lg border rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          formData.icon === icon ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Couleur</label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({...formData, color})}
                        className={`w-8 h-8 rounded border-2 ${
                          formData.color === color ? 'border-gray-900 dark:border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleSave} className="w-full">
                  {editingCategory ? 'Mettre à jour' : 'Créer la catégorie'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune catégorie personnalisée</p>
            <p className="text-sm">Créez vos propres catégories pour mieux organiser vos transactions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{category.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {category.type === 'income' ? 'Revenu' : 'Dépense'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(category)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteCategory(category.id)}>
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
