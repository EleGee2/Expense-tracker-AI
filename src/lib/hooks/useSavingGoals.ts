import { useState } from 'react';
import { collection, query, where, orderBy, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { SavingGoal } from '../types';

export function useSavingGoals() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goalsQuery = query(
    collection(db, 'savingGoals'),
    where('userId', '==', user?.uid || ''),
    orderBy('createdAt', 'desc')
  );

  const [goalsSnapshot, goalsLoading, goalsError] = useCollection(goalsQuery);

  const goals = goalsSnapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SavingGoal[] || [];


  const addGoal = async (data: Omit<SavingGoal, 'id' | 'userId' | 'currentAmount' | 'createdAt'>) => {
    try {
      setLoading(true);
      await addDoc(collection(db, 'savingGoals'), {
        ...data,
        userId: user?.uid,
        currentAmount: 0,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add saving goal');
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (id: string, data: Partial<SavingGoal>) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'savingGoals', id), data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update saving goal');
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'savingGoals', id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete saving goal');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (id: string, amount: number) => {
    try {
      setLoading(true);
      const goal = goals.find(g => g.id === id);
      if (goal) {
        const newAmount = goal.currentAmount + amount;
        await updateDoc(doc(db, 'savingGoals', id), {
          currentAmount: newAmount
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  return {
    goals,
    loading: loading || goalsLoading,
    error: error || goalsError?.message,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress
  };
} 