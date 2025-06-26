import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ThemeToggle from "@/components/ThemeToggle";
import HomeModule from "@/components/HomeModule";
import TodoModule from "@/components/TodoModule";
import ScheduleModule from "@/components/ScheduleModule";
import DocumentsModule from "@/components/DocumentsModule";
import ForumModule from "@/components/ForumModule";

const initialData = [
  { name: "Expenses", amount: 300 },
  { name: "Income", amount: 1250 },
];

const initialTransactions = [
  { icon: "🎓", name: "Scholarship", amount: "+€500", color: "text-green-600" },
  { icon: "🛒", name: "Groceries", amount: "-€50", color: "text-red-500" },
  { icon: "🏠", name: "Rent", amount: "-€400", color: "text-red-500" },
  { icon: "🚗", name: "Transport", amount: "-€30", color: "text-red-500" },
];

export default function Index() {
  const [view, setView] = useState("home");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [data, setData] = useState(initialData);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [icon, setIcon] = useState("");

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const handleAddTransaction = () => {
    const amt = parseFloat(amount);
    if (!name || isNaN(amt)) return;

    const isIncome = type === "income";
    const color = isIncome ? "text-green-600" : "text-red-500";
    const formattedAmount = `${isIncome ? "+" : "-"}€${amt}`;

    const newTransaction = { icon: icon || (isIncome ? "💰" : "💸"), name, amount: formattedAmount, color };
    setTransactions([newTransaction, ...transactions]);

    const updatedData = data.map(d =>
      d.name === (isIncome ? "Income" : "Expenses") ? { ...d, amount: d.amount + amt } : d
    );
    setData(updatedData);

    // Save updated financial data to localStorage to sync with HomeModule
    const financeData = {
      income: updatedData.find(d => d.name === "Income")!.amount,
      expenses: updatedData.find(d => d.name === "Expenses")!.amount
    };
    localStorage.setItem("skoolife_finances", JSON.stringify(financeData));

    setName("");
    setAmount("");
    setIcon("");
  };

  const currentBalance = data.find(d => d.name === "Income")!.amount - data.find(d => d.name === "Expenses")!.amount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 dark:from-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent">
            SKOOLIFE
          </h1>
          <div className="flex items-center gap-4">
            <nav className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-yellow-200 dark:border-gray-700 overflow-x-auto">
              <button 
                onClick={() => setView("home")} 
                className={`px-4 sm:px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                  view === "home" 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700"
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setView("finances")} 
                className={`px-4 sm:px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                  view === "finances" 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700"
                }`}
              >
                Finances
              </button>
              <button 
                onClick={() => setView("todo")} 
                className={`px-4 sm:px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                  view === "todo" 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700"
                }`}
              >
                To-Do
              </button>
              <button 
                onClick={() => setView("planning")} 
                className={`px-4 sm:px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                  view === "planning" 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700"
                }`}
              >
                Planning
              </button>
              <button 
                onClick={() => setView("documents")} 
                className={`px-4 sm:px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                  view === "documents" 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700"
                }`}
              >
                Documents
              </button>
              <button 
                onClick={() => setView("forum")} 
                className={`px-4 sm:px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                  view === "forum" 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 shadow-md" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-gray-700"
                }`}
              >
                Forum
              </button>
            </nav>
            <ThemeToggle />
          </div>
        </div>

        {view === "home" && <HomeModule />}
        {view === "finances" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{currentMonth}</h2>
                  <p className={`text-3xl sm:text-4xl font-bold mb-2 ${
                    currentBalance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    €{currentBalance}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Solde actuel</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
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

            <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Transactions</h2>
                <div className="space-y-3 mb-8 max-h-64 overflow-y-auto">
                  {transactions.map((t, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg border border-yellow-200 dark:border-gray-600 transition-colors duration-300">
                      <div className="flex items-center gap-3">
                        <span className="text-xl sm:text-2xl">{t.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{t.name}</span>
                      </div>
                      <span className={`font-bold text-base sm:text-lg ${t.color}`}>{t.amount}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <select 
                    className="w-full border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-lg px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors duration-300" 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <Input 
                    type="text" 
                    placeholder="Emoji (ex: 🛍️)" 
                    value={icon} 
                    onChange={e => setIcon(e.target.value)} 
                    className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300"
                  />
                  <Input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300"
                  />
                  <Input 
                    type="number" 
                    placeholder="Amount" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300"
                  />
                  <Button 
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105" 
                    onClick={handleAddTransaction}
                  >
                    Add Transaction
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {view === "todo" && <TodoModule />}
        {view === "planning" && <ScheduleModule />}
        {view === "documents" && <DocumentsModule />}
        {view === "forum" && <ForumModule />}
      </div>
    </div>
  );
}
