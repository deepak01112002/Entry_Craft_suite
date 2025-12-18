import { useState, useEffect } from 'react';
import { ProductEntry } from '@/types/entry';
import * as api from '@/lib/api';

export const useEntries = () => {
  const [entries, setEntries] = useState<ProductEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.fetchEntries();
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
      setError('Failed to load entries');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = async (entry: Omit<ProductEntry, 'id' | 'createdAt'>) => {
    try {
      const newEntry = await api.createEntry(entry);
      setEntries(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      console.error('Failed to create entry:', err);
      throw err;
    }
  };

  const updateEntry = async (id: string, updates: Partial<ProductEntry>) => {
    try {
      const updated = await api.updateEntry(id, updates);
      setEntries(prev => prev.map(entry => entry.id === id ? updated : entry));
      return updated;
    } catch (err) {
      console.error('Failed to update entry:', err);
      throw err;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await api.deleteEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Failed to delete entry:', err);
      throw err;
    }
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  return {
    entries,
    isLoading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    refreshEntries: loadEntries,
  };
};
