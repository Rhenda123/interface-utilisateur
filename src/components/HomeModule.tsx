import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const HomeModule = () => {
  const [finances, setFinances] = useState({ income: 1250, expenses: 300 });
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const savedTasks = localStorage.getItem("skoolife_tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedCourses = localStorage.getItem("skoolife_courses");
    if (savedCourses) setCourses(JSON.parse(savedCourses));

    const savedDocuments = localStorage.getItem("skoolife_documents");
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));

    const savedPosts = localStorage.getItem("skoolife_forum_posts");
    if (savedPosts) setPosts(JSON.parse(savedPosts));

    // Load financial data from localStorage
    const savedFinances = localStorage.getItem("skoolife_finances");
    if (savedFinances) {
      setFinances(JSON.parse(savedFinances));
    }

    // Listen for localStorage changes to update finances in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "skoolife_finances" && e.newValue) {
        setFinances(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-page updates
    const handleFinanceUpdate = (e: CustomEvent) => {
      setFinances(e.detail);
    };
    
    window.addEventListener('financeUpdate', handleFinanceUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('financeUpdate', handleFinanceUpdate as EventListener);
    };
  }, []);

  const completedTasks = tasks.filter((task: any) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const currentBalance = finances.income - finances.expenses;
  const todaysCourses = courses.filter((course: any) => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
    const todayFrench = today.charAt(0).toUpperCase() + today.slice(1);
    return course.day === todayFrench;
  }).length;

  const financeData = [
    { name: "Revenus", amount: finances.income },
    { name: "Dépenses", amount: finances.expenses },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tableau de Bord
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Aperçu de votre vie étudiante
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6 text-center">
            <div className={`text-2xl font-bold mb-1 ${
              currentBalance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              €{currentBalance}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Solde Actuel
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {pendingTasks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Tâches à Faire
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {todaysCourses}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Cours Aujourd'hui
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {documents.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Documents
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Finance Summary */}
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Aperçu Financier
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" className="dark:stroke-gray-600" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontWeight: '500' }} className="dark:fill-gray-300" />
                  <YAxis tick={{ fill: '#6b7280', fontWeight: '500' }} className="dark:fill-gray-300" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)',
                      border: '2px solid #fcd34d',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      color: 'var(--card-foreground)'
                    }}
                  />
                  <Bar dataKey="amount" fill="#fcd34d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Tâches Récentes
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {tasks.slice(0, 5).map((task: any, index: number) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  task.completed 
                    ? "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" 
                    : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                }`}>
                  <div className={`font-medium ${
                    task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"
                  }`}>
                    {task.text}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Priorité: {task.priority}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucune tâche pour le moment
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Planning d'Aujourd'hui
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {courses.filter((course: any) => {
                const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
                const todayFrench = today.charAt(0).toUpperCase() + today.slice(1);
                return course.day === todayFrench;
              }).map((course: any, index: number) => (
                <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {course.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {course.hour}
                  </div>
                </div>
              ))}
              {courses.filter((course: any) => {
                const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
                const todayFrench = today.charAt(0).toUpperCase() + today.slice(1);
                return course.day === todayFrench;
              }).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucun cours aujourd'hui
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Forum Activity */}
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Activité du Forum
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {posts.slice(0, 3).map((post: any, index: number) => (
                <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {post.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Par {post.author} • {post.replies?.length || 0} réponses
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucune activité récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeModule;
