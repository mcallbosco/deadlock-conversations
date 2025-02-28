'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConversationData, Character } from '../types';
import { loadConversationData, getAllCharacters } from './dataUtils';

interface DataContextType {
  data: ConversationData | null;
  characters: Character[];
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  data: null,
  characters: [],
  loading: true,
  error: null
});

export const useData = () => useContext(DataContext);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<ConversationData | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const conversationData = await loadConversationData();
        setData(conversationData);
        setCharacters(getAllCharacters(conversationData));
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load conversation data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, characters, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}; 