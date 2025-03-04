'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { loadConversationData, getConversationsForCharacter, getAllCharacters } from '@/utils/dataUtils';

// Skip SSR completely for the client component
const CharacterPageClient = dynamic(
  () => import('./CharacterPageClient'),
  { ssr: false }
);

export default function ClientWrapper({ character: initialCharacter, conversations: initialConversations }) {
  // Use state to track if we're on the client
  const [mounted, setMounted] = useState(false);
  const [character, setCharacter] = useState(initialCharacter);
  const [conversations, setConversations] = useState(initialConversations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load real data after component mounts on the client
  useEffect(() => {
    const fetchRealData = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        setIsLoading(true);
        // Attempt to load the real data
        const realData = await loadConversationData();
        
        // If we got real data, update the character and conversations
        if (realData && realData.conversations && realData.conversations.length > 0) {
          const allCharacters = getAllCharacters(realData);
          const updatedCharacter = allCharacters.find(
            c => c.name.toLowerCase() === initialCharacter.name.toLowerCase()
          );
          
          if (updatedCharacter) {
            setCharacter(updatedCharacter);
            const updatedConversations = getConversationsForCharacter(realData, updatedCharacter.name);
            setConversations(updatedConversations);
            console.log(`Loaded ${updatedConversations.length} conversations for ${updatedCharacter.name}`);
          }
        }
      } catch (err) {
        console.error('Error loading real data:', err);
        setError('Failed to load the latest data. Using fallback data instead.');
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };
    
    fetchRealData();
  }, [initialCharacter.name]);
  
  // During server rendering and initial hydration, show a simple loading state
  // This ensures exact match between server and client until hydration is complete
  if (!mounted) {
    return <div className="p-4 text-center">Loading character data...</div>;
  }
  
  // Show loading state if we're fetching real data
  if (isLoading) {
    return <div className="p-4 text-center">Refreshing character data...</div>;
  }
  
  // Show error if there was a problem loading real data
  if (error) {
    return (
      <div>
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 mb-4">
          <p className="text-yellow-200">{error}</p>
        </div>
        <CharacterPageClient 
          character={character} 
          conversations={conversations}
        />
      </div>
    );
  }
  
  // Only render the actual component after hydration is complete
  return <CharacterPageClient 
    character={character} 
    conversations={conversations}
  />;
} 