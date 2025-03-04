'use client';

import React, { useState } from 'react';
import { useData } from '@/utils/DataContext';
import { searchConversations, getConversationsForCharacter } from '@/utils/dataUtils';
import SearchBar from '@/components/SearchBar';
import ConversationCard from '@/components/ConversationCard';
import CharacterCard from '@/components/CharacterCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Conversation } from '@/types';

export default function Home() {
  const { data, characters, loading, error } = useData();
  const [searchResults, setSearchResults] = useState<Conversation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (searchTerm: string) => {
    if (!data) return;
    
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    const results = searchConversations(data, searchTerm);
    setSearchResults(results);
    setHasSearched(true);
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading conversation data..." />;
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-center">
        <h2 className="text-xl font-bold text-red-300 mb-2">Error</h2>
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Deadlock Conversations</h1>
        <p className="text-xl text-gray-300 mb-8">
          Browse and listen to character conversations from Deadlock
        </p>
        
        <SearchBar onSearch={handleSearch} placeholder="Search for conversations..." />
      </section>

      {hasSearched && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Search Results ({searchResults.length})
          </h2>
          
          {searchResults.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No conversations found matching your search.</p>
          ) : (
            <div className="space-y-4">
              {searchResults.map((conversation) => (
                <ConversationCard 
                  key={conversation.conversation_id} 
                  conversation={conversation} 
                />
              ))}
            </div>
          )}
        </section>
      )}

      {!hasSearched && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">All Characters</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {characters.map((character) => {
              // Calculate the actual number of conversations for this character
              const characterConversations = data ? getConversationsForCharacter(data, character.name) : [];
              
              return (
                <CharacterCard
                  key={character.name}
                  name={character.name}
                  conversationCount={characterConversations.length}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
