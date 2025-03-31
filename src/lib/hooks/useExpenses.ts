import { useState } from 'react';
import { collection, query, where, orderBy, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { Expense } from '../types';
import { categorizeExpense } from '../openai';

export function useExpenses() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expensesQuery = query(
    collection(db, 'expenses'),
    where('userId', '==', user?.uid || ''),
    orderBy('date', 'desc')
  );

  const [expensesSnapshot, expensesLoading, expensesError] = useCollection(expensesQuery);

  const expenses = expensesSnapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Expense[] || [];


  const addExpense = async (data: Omit<Expense, 'id' | 'userId' | 'category' | 'createdAt'>) => {
    try {
      setLoading(true);
      const category = await categorizeExpense(data.description, data.amount);
      
      await addDoc(collection(db, 'expenses'), {
        ...data,
        userId: user?.uid,
        category,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'expenses', id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, data: Partial<Omit<Expense, 'id' | 'userId' | 'category' | 'createdAt'>>) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'expenses', id), data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    loading: loading || expensesLoading,
    error: error || expensesError?.message,
    addExpense,
    deleteExpense,
    updateExpense
  };
} 