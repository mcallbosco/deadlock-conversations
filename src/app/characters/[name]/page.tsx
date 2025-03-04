import React from 'react';
import { getConversationsForCharacter, loadConversationData, getAllCharacters } from '@/utils/dataUtils';
import ClientWrapper from './ClientWrapper';
import { notFound } from 'next/navigation';

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  try {
    const data = await loadConversationData();
    const characters = getAllCharacters(data);
    
    // Create a set of all possible character names, including variations
    const allNames = new Set();
    
    // Add all character names from the data
    characters.forEach(character => {
      // Add the regular name
      allNames.add(character.name);
      
      // Add URL-encoded version if it contains spaces
      if (character.name.includes(' ')) {
        allNames.add(encodeURIComponent(character.name));
      }
      
      // Add lowercase version
      allNames.add(character.name.toLowerCase());
      
      // Add URL-encoded lowercase version if it contains spaces
      if (character.name.toLowerCase().includes(' ')) {
        allNames.add(encodeURIComponent(character.name.toLowerCase()));
      }
    });
    
    // Convert to the format Next.js expects
    return Array.from(allNames).map(name => ({
      name,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return a comprehensive list of character names from Sample.json
    // This ensures all characters are included even when using fallback data
    return [
      { name: 'abrams' },
      { name: 'bebop' },
      { name: 'calico' },
      { name: 'character1' },
      { name: 'character2' },
      { name: 'character3' },
      { name: 'character4' },
      { name: 'dynamo' },
      { name: 'fathom' },
      { name: 'grey talon' },
      { name: 'grey%20talon' },
      { name: 'haze' },
      { name: 'holliday' },
      { name: 'infernus' },
      { name: 'ivy' },
      { name: 'kelvin' },
      { name: 'lady geist' },
      { name: 'lady%20geist' },
      { name: 'lash' },
      { name: 'magician' },
      { name: 'mcginnis' },
      { name: 'mirage' },
      { name: 'mo and krill' },
      { name: 'mo%20and%20krill' },
      { name: 'operative' },
      { name: 'paradox' },
      { name: 'pocket' },
      { name: 'seven' },
      { name: 'shiv' },
      { name: 'trapper' },
      { name: 'vindicta' },
      { name: 'viper' },
      { name: 'viscous' },
      { name: 'warden' },
      { name: 'wraith' },
      { name: 'wrecker' },
      { name: 'yamato' }
    ];
  }
}

export default async function CharacterPage({ params }) {
  // Ensure params is properly awaited
  const name = params?.name;
  
  if (!name) {
    notFound();
  }
  
  try {
    // Pre-fetch the data on the server
    const data = await loadConversationData();
    const characters = getAllCharacters(data);
    
    // Decode the URL parameter
    const decodedName = decodeURIComponent(name);
    
    // Find the character (case insensitive)
    const character = characters.find(
      char => char.name.toLowerCase() === decodedName.toLowerCase()
    );
    
    // If character not found, return 404
    if (!character) {
      notFound();
    }
    
    // Get conversations for this character
    const conversations = getConversationsForCharacter(data, character.name);
    
    // Pass the pre-fetched data to the client component
    return <ClientWrapper 
      character={character} 
      conversations={conversations} 
    />;
  } catch (error) {
    console.error('Error loading character data:', error);
    return <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-center">
      <h2 className="text-xl font-bold text-red-300 mb-2">Error</h2>
      <p className="text-red-200">Failed to load character data</p>
    </div>;
  }
} 