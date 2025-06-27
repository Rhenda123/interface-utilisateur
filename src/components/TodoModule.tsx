
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

function TodoModule() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("skoolife_tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Moyenne");
  const [deadline, setDeadline] = useState("");
  const [filter, setFilter] = useState("Toutes");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("skoolife_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addOrUpdateTask = () => {
    if (input.trim()) {
      const newTask = {
        text: input,
        completed: false,
        priority,
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
      setDeadline("");
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
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setInput("");
    setPriority("Moyenne");
    setDeadline("");
    setEditingIndex(null);
  };

  const filteredTasks = tasks.filter((task: any) => {
    if (filter === "Faites") return task.completed;
    if (filter === "À faire") return !task.completed;
    return true;
  });

  const priorityColor = {
    Haute: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700",
    Moyenne: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700",
    Faible: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700",
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Ma To-Do List</h2>
          
          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <Input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ajouter une tâche..." 
              className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" 
            />
            
            {/* Centered form controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)} 
                className="w-full sm:flex-1 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none"
              >
                <option>Haute</option>
                <option>Moyenne</option>
                <option>Faible</option>
              </select>
              <Input 
                type="date" 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                className="w-full sm:flex-1 border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" 
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={addOrUpdateTask} 
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                {editingIndex !== null ? "Modifier" : "Ajouter"}
              </Button>
              {editingIndex !== null && (
                <Button 
                  onClick={cancelEdit} 
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-md transition-all duration-200"
                >
                  Annuler
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex bg-yellow-100 dark:bg-gray-700 rounded-lg p-1 border border-yellow-200 dark:border-gray-600">
              {["Toutes", "À faire", "Faites"].map((f) => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)} 
                  className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    filter === f 
                      ? "bg-yellow-400 text-gray-900 shadow-sm" 
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {filteredTasks.map((task: any, index: number) => (
              <div 
                key={index} 
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
                  task.completed 
                    ? "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-75" 
                    : "bg-white dark:bg-gray-800 border-yellow-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div 
                      className={`font-medium text-base sm:text-lg cursor-pointer transition-all duration-200 ${
                        task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400"
                      }`}
                      onClick={() => toggleTask(index)}
                    >
                      {task.text}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Date limite : {task.deadline || "aucune"}
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-start sm:items-end gap-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${priorityColor[task.priority as keyof typeof priorityColor]}`}>
                      {task.priority}
                    </span>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => editTask(index)} 
                        className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium transition-colors duration-200"
                      >
                        Modifier
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-200">
                            Supprimer
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action ne peut pas être annulée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTask(index)} className="bg-red-500 hover:bg-red-600">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TodoModule;
