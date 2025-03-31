import { useState } from 'react';
import { useSavingGoals } from '../lib/hooks/useSavingGoals';
import { format, differenceInDays } from 'date-fns';
import { SavingGoal } from '../lib/types';

export default function SavingGoals() {
  const { goals, addGoal, updateProgress, loading } = useSavingGoals();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) return;

    try {
      await addGoal({
        name,
        targetAmount: parseFloat(targetAmount),
        deadline
      });

      setSuccessMessage('Goal created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      setName('');
      setTargetAmount('');
      setDeadline('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const isGoalCompleted = (goal: SavingGoal) => {
    return goal.currentAmount >= goal.targetAmount;
  };

  const filteredGoals = goals.filter((goal) => {
    const completed = isGoalCompleted(goal);
    return activeTab === 'completed' ? completed : !completed;
  });

  const getEmoji = (progress: number) => {
    if (progress >= 100) return '🎉';
    if (progress >= 75) return '🚀';
    if (progress >= 50) return '💪';
    if (progress >= 25) return '👍';
    return '🎯';
  };

  const getDaysRemaining = (deadline: string) => {
    const days = differenceInDays(new Date(deadline), new Date());
    return days > 0 ? days : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-indigo-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saving Goals</h2>
          <p className="text-gray-600 text-sm mt-1">Track your financial goals and progress</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Create New Goal</h3>
            <p className="text-indigo-100 text-sm">Set a target and deadline for your savings</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Goal Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 text-black"
                placeholder="e.g., New Car, Vacation, Emergency Fund"
                required
              />
            </div>

            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
                Target Amount
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="targetAmount"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="pl-7 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 text-black"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Target Date
              </label>
              <input
                type="date"
                id="deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 text-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Goal...
                </div>
              ) : (
                'Create Goal'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Goal Status Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'ongoing'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Ongoing Goals
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'completed'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Completed Goals
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filteredGoals.map((goal: SavingGoal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const emoji = getEmoji(progress);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const progressColor = getProgressColor(progress);
          
          return (
            <div 
              key={goal.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                  <span className="text-2xl" role="img" aria-label="goal progress emoji">
                    {emoji}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>${goal.currentAmount.toFixed(2)}</span>
                      <span>${goal.targetAmount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500 text-right">
                      {progress.toFixed(1)}% Complete
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <div className="text-gray-500">
                        Deadline: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                      </div>
                      <div className="text-indigo-600 font-medium">
                        {daysRemaining} days remaining
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const amount = prompt('Enter amount to add:');
                        if (amount && !isNaN(parseFloat(amount))) {
                          updateProgress(goal.id, parseFloat(amount));
                        }
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
                    >
                      + Add Progress
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {activeTab === 'ongoing' ? 'No ongoing saving goals' : 'No completed goals'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'ongoing' ? 'Get started by creating a new saving goal.' : 'Keep working towards your goals!'}
          </p>
          {activeTab === 'ongoing' && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Goal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 