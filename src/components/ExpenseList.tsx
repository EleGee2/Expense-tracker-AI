import { useState, useEffect, useCallback } from 'react';
import { useExpenses } from '../lib/hooks/useExpenses';
import { generateInsights } from '../lib/openai';
import { format } from 'date-fns';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Expense } from '../lib/types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function ExpenseList() {
  const { expenses, deleteExpense, updateExpense, loading } = useExpenses();
  const [user] = useAuthState(auth);
  const [insights, setInsights] = useState<string>('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    date: ''
  });

  const fetchInsights = useCallback(async () => {
    if (expenses.length > 0) {
      setInsightsLoading(true);
      try {
        const insightsText = await generateInsights(expenses);
        setInsights(insightsText);
      } catch (error) {
        console.error('Failed to generate insights:', error);
      } finally {
        setInsightsLoading(false);
      }
    }
  }, [expenses]);

  useEffect(() => {
    // Only generate insights if we have expenses and haven't generated them in the last 5 minutes
    const lastInsightsGeneration = localStorage.getItem('lastInsightsGeneration');
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (expenses.length > 0 && (!lastInsightsGeneration || now - parseInt(lastInsightsGeneration) > fiveMinutes)) {
      fetchInsights();
      localStorage.setItem('lastInsightsGeneration', now.toString());
    }
  }, [expenses, fetchInsights]);

  const categories = ['all', ...new Set(expenses.map((e: Expense) => e.category))];
  const filteredExpenses = selectedCategory === 'all' 
    ? expenses 
    : expenses.filter((e: Expense) => e.category === selectedCategory);

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Shopping: 'bg-purple-100 text-purple-800',
      Entertainment: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Healthcare: 'bg-yellow-100 text-yellow-800',
      Education: 'bg-indigo-100 text-indigo-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.Other;
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense.id);
    setEditForm({
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateExpense(id, {
        description: editForm.description,
        amount: parseFloat(editForm.amount),
        date: editForm.date
      });
      setEditingExpense(null);
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setEditForm({
      description: '',
      amount: '',
      date: ''
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your expenses.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Card */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="ml-2 text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        {insightsLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-pulse text-gray-600">Analyzing your expenses...</div>
          </div>
        ) : (
          <p className="text-gray-600 whitespace-pre-line">{insights || 'Add some expenses to get AI-powered insights!'}</p>
        )}
      </div>

      {expenses.length > 0 && (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category: string) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Total Amount */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount ({selectedCategory})</span>
              <span className="text-2xl font-bold text-indigo-600">
                ${getTotalAmount().toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Expense List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredExpenses.map((expense: Expense) => (
            <li 
              key={expense.id} 
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
            >
              {editingExpense === expense.id ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                      placeholder="Description"
                    />
                    <div className="relative rounded-md shadow-sm w-32">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(expense.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {expense.description}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                        {expense.category}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-gray-600 hover:text-indigo-900 transition-colors duration-150"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      disabled={loading}
                      className={`text-red-600 hover:text-red-900 transition-colors duration-150 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
          {filteredExpenses.length === 0 && (
            <li className="px-6 py-12 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-4">No expenses found. Start by adding one!</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
} 