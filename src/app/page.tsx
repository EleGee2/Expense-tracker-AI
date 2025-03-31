'use client';

import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import SavingGoals from '../components/SavingGoals';
import Login from '../components/Login';
import { useAuth } from '../lib/context/AuthContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'expenses' | 'goals'>('expenses');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="space-y-6">
      <div className="sm:hidden">
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as 'expenses' | 'goals')}
        >
          <option value="expenses">Expenses</option>
          <option value="goals">Saving Goals</option>
        </select>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'expenses'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'goals'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Saving Goals
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'expenses' ? (
          <div className="space-y-6">
            <ExpenseForm />
            <ExpenseList />
          </div>
        ) : (
          <SavingGoals />
        )}
      </div>
    </div>
  );
}
