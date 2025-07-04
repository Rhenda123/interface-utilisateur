import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, PieChart, Filter, Calendar } from "lucide-react";
import BudgetManager from "./finance/BudgetManager";
import CategoryManager from "./finance/CategoryManager";

function FinanceModule() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("skoolife_transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("skoolife_categories_finance");
    return saved ? JSON.parse(saved) : ["Courses", "Factures", "Loisirs", "Autres"];
  });
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("skoolife_budget");
    return saved ? JSON.parse(saved) : 0;
  });
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem("skoolife_income");
    return saved ? JSON.parse(saved) : 0;
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("skoolife_expenses");
    return saved ? JSON.parse(saved) : 0;
  });
  const [input, setInput] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Courses");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Dépense");
  const [filter, setFilter] = useState("Toutes");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("skoolife_transactions", JSON.stringify(transactions));
    updateExpensesAndIncome();
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("skoolife_categories_finance", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("skoolife_budget", JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem("skoolife_income", JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem("skoolife_expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addOrUpdateTransaction = () => {
    if (input.trim() && amount.trim() && date.trim()) {
      const newTransaction = {
        text: input,
        amount: parseFloat(amount),
        category,
        date,
        type,
        createdAt: new Date().toISOString(),
      };

      if (editingIndex !== null) {
        const updatedTransactions = [...transactions];
        updatedTransactions[editingIndex] = {
          ...updatedTransactions[editingIndex],
          ...newTransaction,
        };
        setTransactions(updatedTransactions);
        setEditingIndex(null);
      } else {
        setTransactions([...transactions, newTransaction]);
      }

      setInput("");
      setAmount("");
      setCategory("Courses");
      setDate("");
      setType("Dépense");
      setShowAddForm(false);
    }
  };

  const deleteTransaction = (index: number) => {
    const newTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(newTransactions);
  };

  const editTransaction = (index: number) => {
    const transaction = transactions[index];
    setInput(transaction.text);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setDate(transaction.date);
    setType(transaction.type);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setInput("");
    setAmount("");
    setCategory("Courses");
    setDate("");
    setType("Dépense");
    setEditingIndex(null);
    setShowAddForm(false);
  };

  const updateExpensesAndIncome = () => {
    let newIncome = 0;
    let newExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "Revenu") {
        newIncome += transaction.amount;
      } else {
        newExpenses += transaction.amount;
      }
    });

    setIncome(newIncome);
    setExpenses(newExpenses);
  };

  const filteredTransactions = transactions.filter((transaction: any) => {
    if (filter === "Toutes") return true;
    return transaction.type === filter;
  });

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Mes Finances</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full w-12 h-12 sm:w-auto sm:h-auto sm:rounded-lg sm:px-4 sm:py-2 shadow-lg active:scale-95 transition-all touch-manipulation"
          >
            <Plus className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Transaction</span>
          </Button>
          {/* Hide Graphiques button on mobile, show on desktop */}
          <Button 
            onClick={() => setShowCharts(!showCharts)}
            variant="outline"
            className="hidden md:flex items-center gap-2 border-2 border-yellow-200 dark:border-gray-600 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-lg px-4 py-2 transition-all"
          >
            <PieChart className="w-4 h-4" />
            Graphiques
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="border-yellow-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nom de la transaction..."
                className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 touch-manipulation"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Montant..."
                  className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 touch-manipulation"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none touch-manipulation"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 touch-manipulation"
                />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border-2 border-yellow-200 dark:border-gray-600 bg-yellow-50 dark:bg-gray-700 rounded-xl px-4 py-3 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none touch-manipulation"
                >
                  <option>Dépense</option>
                  <option>Revenu</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={addOrUpdateTransaction}
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

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction: any, index: number) => (
          <Card
            key={index}
            className="border-2 border-yellow-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:border-yellow-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md active:scale-[0.98] touch-manipulation"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {transaction.text}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.category} - {transaction.date}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${transaction.type === "Revenu"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {transaction.type === "Revenu" ? "+" : "-"}
                    {transaction.amount} €
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => editTransaction(index)}
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
                        Êtes-vous sûr de vouloir supprimer cette transaction ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                      <AlertDialogCancel className="flex-1 rounded-xl py-2 text-xs sm:text-sm order-2 sm:order-1">
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteTransaction(index)}
                        className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl py-2 text-xs sm:text-sm order-1 sm:order-2"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FinanceModule;
