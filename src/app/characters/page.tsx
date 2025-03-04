'use client';

import React, { useState } from 'react';
import { useData } from '@/utils/DataContext';
import CharacterCard from '@/components/CharacterCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchBar from '@/components/SearchBar';

export default function CharactersPage() {
  const { characters, loading, error } = useData();
  const [filteredCharacters, setFilteredCharacters] = useState(characters);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim() === '') {
      setFilteredCharacters(characters);
      return;
    }
    
    const filtered = characters.filter(character => 
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCharacters(filtered);
  };

  // Update filtered characters when the data loads
  React.useEffect(() => {
    setFilteredCharacters(characters);
  }, [characters]);

  if (loading) {
    return <LoadingSpinner size="large" message="Loading characters..." />;
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
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Characters</h1>
        <p className="text-gray-300 mb-6">
          Browse all characters from Deadlock
        </p>
        
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for a character..." 
        />
      </section>

      <section>
        {filteredCharacters.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No characters found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => (
              <CharacterCard
                key={character.name}
                name={character.name}
                conversationCount={character.conversationPartners.length}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
} 