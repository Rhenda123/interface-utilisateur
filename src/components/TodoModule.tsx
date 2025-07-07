
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Filter, CheckCircle2, Clock, AlertTriangle, Settings, Edit2, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Task {
  text: string;
  completed: boolean;
  priority: string;
  deadline: string;
  createdAt: string;
  categoryId?: string;
}

const defaultCategories: Category[] = [
  { id: "work", name: "Travail", color: "bg-blue-500" },
  { id: "personal", name: "Personnel", color: "bg-green-500" },
  { id: "study", name: "Études", color: "bg-purple-500" },
  { id: "health", name: "Santé", color: "bg-red-500" },
];

function TodoModule() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("skoolife_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("skoolife_categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Moyenne");
  const [deadline, setDeadline] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("none");
  const [filter, setFilter] = useState("Toutes");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("bg-gray-500");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const colorOptions = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
    "bg-orange-500", "bg-gray-500"
  ];

  useEffect(() => {
    localStorage.setItem("skoolife_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("skoolife_categories", JSON.stringify(categories));
  }, [categories]);

  const addOrUpdateTask = () => {
    if (input.trim()) {
      const newTask: Task = {
        text: input,
        completed: false,
        priority,
        deadline,
        createdAt: new Date().toISOString(),
        categoryId: selectedCategoryId === "none" ? undefined : selectedCategoryId,
      };

      if (editingIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = {
          ...updatedTasks[editingIndex],
          ...newTask,
        };
        setTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        setTasks([...tasks, newTask]);
      }

      setInput("");
      setPriority("Moyenne");
      setDeadline("");
      setSelectedCategoryId("none");
      setShowAddForm(false);
    }
  };

  const toggleTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const editTask = (index: number) => {
    const task = tasks[index];
    setInput(task.text);
    setPriority(task.priority);
    setDeadline(task.deadline);
    setSelectedCategoryId(task.categoryId || "none");
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setInput("");
    setPriority("Moyenne");
    setDeadline("");
    setSelectedCategoryId("none");
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName,
        color: newCategoryColor,
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryColor("bg-gray-500");
    }
  };

  const updateCategory = (id: string, name: string, color: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name, color } : cat
    ));
    setEditingCategoryId(null);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    // Update tasks that had this category
    setTasks(tasks.map((task: Task) => 
      task.categoryId === id ? { ...task, categoryId: undefined } : task
    ));
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === "Faites") return task.completed;
    if (filter === "À faire") return !task.completed;
    return true;
  });

  // Couleurs Skoolife pour les priorités
  const priorityColor = {
    Haute: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700",
    Moyenne: "bg-skoolife-primary text-gray-900 border border-yellow-300",
    Faible: "bg-skoolife-light dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-yellow-200 dark:border-gray-600",
    Élevée: "bg-skoolife-secondary text-gray-900 border border-orange-300"
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Haute": return <AlertTriangle className="w-3 h-3" />;
      case "Moyenne": return <Clock className="w-3 h-3" />;
      case "Faible": return <CheckCircle2 className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Ma To-Do List</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowCategoryManager(true)}
            variant="outline"
            className="rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:rounded-lg sm:px-4 sm:py-2 shadow-lg active:scale-95 transition-all touch-manipulation"
          >
            <Settings className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Catégories</span>
          </Button>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:rounded-lg sm:px-4 sm:py-2 shadow-lg active:scale-95 transition-all touch-manipulation"
          >
            <Plus className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </div>
      </div>

      {/* Mobile Filter Pills */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-yellow-100 dark:bg-gray-700 rounded-full p-1 border border-yellow-200 dark:border-gray-600">
          {["Toutes", "À faire", "Faites"].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-manipulation active:scale-95 ${
                filter === f 
                  ? "bg-yellow-400 text-gray-900 shadow-sm transform scale-105" 
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gérer les catégories</h3>
              <Button 
                onClick={() => setShowCategoryManager(false)}
                variant="outline"
                size="sm"
              >
                Fermer
              </Button>
            </div>

            {/* Add New Category */}
            <div className="space-y-3 mb-4 p-3 bg-yellow-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-sm">Nouvelle catégorie</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  type="text"
                  placeholder="Nom de la catégorie"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="text-sm"
                />
                <Select value={newCategoryColor} onValueChange={setNewCategoryColor}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color}`}></div>
                          <span className="capitalize">{color.replace('bg-', '').replace('-500', '')}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addCategory} size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Existing Categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    {editingCategoryId === category.id ? (
                      <Input
                        type="text"
                        defaultValue={category.name}
                        onBlur={(e) => updateCategory(category.id, e.target.value, category.color)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            updateCategory(category.id, e.currentTarget.value, category.color);
                          }
                        }}
                        className="text-sm h-8"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{category.name}</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => setEditingCategoryId(category.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer la catégorie "{category.name}" ? 
                            Les tâches de cette catégorie ne seront plus catégorisées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCategory(category.id)} className="bg-red-500 hover:bg-red-600">
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form - Mobile Optimized */}
      {showAddForm && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Nouvelle tâche..." 
                className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 touch-manipulation" 
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="none">Aucune catégorie</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="Haute">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        Haute
                      </div>
                    </SelectItem>
                    <SelectItem value="Moyenne">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Moyenne
                      </div>
                    </SelectItem>
                    <SelectItem value="Faible">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" />
                        Faible
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Input 
                  type="date" 
                  value={deadline} 
                  onChange={(e) => setDeadline(e.target.value)} 
                  className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 touch-manipulation" 
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={addOrUpdateTask} 
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 touch-manipulation"
                >
                  {editingIndex !== null ? "Modifier" : "Ajouter"}
                </Button>
                <Button 
                  onClick={cancelEdit} 
                  variant="outline"
                  className="px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 active:scale-95 touch-manipulation border-2"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List - Mobile Optimized */}
      <div className="space-y-3">
        {filteredTasks.map((task: Task, index: number) => {
          const taskCategory = task.categoryId ? getCategoryById(task.categoryId) : null;
          
          return (
            <Card 
              key={index} 
              className={`border-2 transition-all duration-200 hover:shadow-md active:scale-[0.98] touch-manipulation ${
                task.completed 
                  ? "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-75" 
                  : "bg-white dark:bg-gray-800 border-yellow-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-gray-600 shadow-sm"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleTask(index)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 touch-manipulation active:scale-90 ${
                      task.completed 
                        ? "bg-green-500 border-green-500 text-white" 
                        : "border-yellow-400 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div 
                      className={`font-medium text-base mb-2 transition-all duration-200 ${
                        task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {task.text}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {taskCategory && (
                        <Badge className={`${taskCategory.color} text-white border-none`}>
                          {taskCategory.name}
                        </Badge>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priorityColor[task.priority as keyof typeof priorityColor]}`}>
                        {getPriorityIcon(task.priority)}
                        {task.priority}
                      </span>
                      {task.deadline && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {task.deadline}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => editTask(index)} 
                        className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium transition-colors duration-200 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full touch-manipulation active:scale-95"
                      >
                        Modifier
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-200 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full touch-manipulation active:scale-95">
                            Supprimer
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-xs mx-auto rounded-2xl p-4 sm:p-6">
                          <AlertDialogHeader className="text-center space-y-2">
                            <AlertDialogTitle className="text-base sm:text-lg font-semibold text-center">
                              Confirmer la suppression
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                              Êtes-vous sûr de vouloir supprimer cette tâche ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                            <AlertDialogCancel className="flex-1 rounded-xl py-2 text-xs sm:text-sm order-2 sm:order-1">
                              Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteTask(index)} 
                              className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl py-2 text-xs sm:text-sm order-1 sm:order-2"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredTasks.length === 0 && (
          <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                {filter === "Toutes" ? "Aucune tâche" : `Aucune tâche ${filter.toLowerCase()}`}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {filter === "Toutes" && "Commencez par ajouter votre première tâche !"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TodoModule;
