
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Filter, CheckCircle2, Clock, AlertTriangle, Tag, X } from "lucide-react";

function TodoModule() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("skoolife_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("skoolife_categories");
    return saved ? JSON.parse(saved) : ["Personnel", "Travail", "École", "Sport"];
  });
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Moyenne");
  const [category, setCategory] = useState("Personnel");
  const [newCategory, setNewCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [filter, setFilter] = useState("Toutes");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("skoolife_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("skoolife_categories", JSON.stringify(categories));
  }, [categories]);

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setShowCategoryForm(false);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat !== categoryToRemove));
      // Update tasks that use this category
      const updatedTasks = tasks.map(task => 
        task.category === categoryToRemove 
          ? { ...task, category: categories.find(cat => cat !== categoryToRemove) }
          : task
      );
      setTasks(updatedTasks);
    }
  };

  const addOrUpdateTask = () => {
    if (input.trim()) {
      const newTask = {
        text: input,
        completed: false,
        priority,
        category,
        deadline,
        createdAt: new Date().toISOString(),
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
      setCategory("Personnel");
      setDeadline("");
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
    setCategory(task.category || "Personnel");
    setDeadline(task.deadline);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setInput("");
    setPriority("Moyenne");
    setCategory("Personnel");
    setDeadline("");
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const filteredTasks = tasks.filter((task: any) => {
    const statusMatch = filter === "Toutes" || 
                       (filter === "Faites" && task.completed) || 
                       (filter === "À faire" && !task.completed);
    const categoryMatch = categoryFilter === "Toutes" || task.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const priorityColor = {
    Haute: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700",
    Moyenne: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700",
    Faible: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700",
  };

  const categoryColors = [
    "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700",
    "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700",
    "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 border border-pink-200 dark:border-pink-700",
    "bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700"
  ];

  const getCategoryColor = (categoryName: string) => {
    const index = categories.indexOf(categoryName) % categoryColors.length;
    return categoryColors[index];
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
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:rounded-lg sm:px-4 sm:py-2 shadow-lg active:scale-95 transition-all touch-manipulation"
          >
            <Plus className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
          <Button 
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            variant="outline"
            className="rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:rounded-lg sm:px-4 sm:py-2 border-2 border-yellow-200 dark:border-gray-600 hover:bg-yellow-50 dark:hover:bg-gray-700 active:scale-95 transition-all touch-manipulation"
          >
            <Tag className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Catégories</span>
          </Button>
        </div>
      </div>

      {/* Mobile Filter Pills */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-center">
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
        
        <div className="flex justify-center">
          <div className="inline-flex bg-blue-100 dark:bg-gray-700 rounded-full p-1 border border-blue-200 dark:border-gray-600 overflow-x-auto">
            <button 
              onClick={() => setCategoryFilter("Toutes")} 
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 touch-manipulation active:scale-95 whitespace-nowrap ${
                categoryFilter === "Toutes" 
                  ? "bg-blue-400 text-white shadow-sm transform scale-105" 
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Toutes
            </button>
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)} 
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 touch-manipulation active:scale-95 whitespace-nowrap ${
                  categoryFilter === cat 
                    ? "bg-blue-400 text-white shadow-sm transform scale-105" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Management Form */}
      {showCategoryForm && (
        <Card className="border-blue-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gérer les catégories</h3>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)} 
                  placeholder="Nouvelle catégorie..." 
                  className="flex-1 border-2 border-blue-200 dark:border-gray-600 bg-blue-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 touch-manipulation" 
                />
                <Button 
                  onClick={addCategory} 
                  className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 touch-manipulation"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Catégories existantes:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div key={cat} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(cat)}`}>
                      <Tag className="w-3 h-3" />
                      {cat}
                      {categories.length > 1 && (
                        <button
                          onClick={() => removeCategory(cat)}
                          className="hover:bg-red-200 dark:hover:bg-red-800 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={() => setShowCategoryForm(false)} 
                variant="outline"
                className="w-full rounded-xl py-3 font-semibold border-2 active:scale-95 transition-all touch-manipulation"
              >
                Fermer
              </Button>
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
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)} 
                  className="w-full border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none touch-manipulation"
                >
                  <option>Haute</option>
                  <option>Moyenne</option>
                  <option>Faible</option>
                </select>
                
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none touch-manipulation"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
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
        {filteredTasks.map((task: any, index: number) => (
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
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priorityColor[task.priority as keyof typeof priorityColor]}`}>
                      {getPriorityIcon(task.priority)}
                      {task.priority}
                    </span>
                    {task.category && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                        <Tag className="w-3 h-3" />
                        {task.category}
                      </span>
                    )}
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
        ))}
        
        {filteredTasks.length === 0 && (
          <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                {filter === "Toutes" ? "Aucune tâche" : `Aucune tâche ${filter.toLowerCase()}`}
                {categoryFilter !== "Toutes" && ` dans ${categoryFilter}`}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {filter === "Toutes" && categoryFilter === "Toutes" && "Commencez par ajouter votre première tâche !"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TodoModule;
