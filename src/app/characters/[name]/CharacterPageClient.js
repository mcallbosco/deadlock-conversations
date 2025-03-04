'use client';

import React, { useState, useEffect } from 'react';
import ConversationCard from '@/components/ConversationCard';
import Image from 'next/image';
import Link from 'next/link';
import { getProperCharacterName } from '@/utils/characterNames';
import { getPortraitFileName } from '@/utils/portraitMapping';
import { usePathname, useRouter } from 'next/navigation';
import { resetCharacterViewedConversations } from '@/utils/viewedConversations';

// Key for storing previous path in session storage
const PREV_PATH_KEY = 'previousPath';
// Key for storing selected partners in session storage
const SELECTED_PARTNERS_KEY = 'selectedPartners';
// Key for tracking if filters were cleared
const FILTERS_CLEARED_KEY = 'filtersCleared';

export default function CharacterPageClient({ 
  character, 
  conversations
}) {
  const [showIncomplete, setShowIncomplete] = useState(true);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const currentPath = usePathname();
  const router = useRouter();
  
  // Store current path for navigation tracking and retrieve filters from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Store current path when navigating away
      const handleBeforeUnload = () => {
        sessionStorage.setItem(PREV_PATH_KEY, currentPath);
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Check if filters were explicitly cleared
      const filtersCleared = sessionStorage.getItem(FILTERS_CLEARED_KEY) === 'true';
      
      // Only retrieve selected partners if filters weren't explicitly cleared
      if (!filtersCleared) {
        const storedSelectedPartnersJson = sessionStorage.getItem(SELECTED_PARTNERS_KEY);
        if (storedSelectedPartnersJson) {
          try {
            const parsedPartners = JSON.parse(storedSelectedPartnersJson);
            if (Array.isArray(parsedPartners)) {
              // Only set partners that are actually conversation partners of this character
              const validPartners = parsedPartners.filter(partner => 
                character.conversationPartners.includes(partner)
              );
              setSelectedPartners(validPartners);
            }
          } catch (e) {
            console.error('Error parsing selected partners:', e);
          }
        }
      } else {
        // Reset the flag after it's been used
        sessionStorage.removeItem(FILTERS_CLEARED_KEY);
      }
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentPath, character.conversationPartners]);
  
  // Save selected partners to session storage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedPartners.length > 0) {
        sessionStorage.setItem(SELECTED_PARTNERS_KEY, JSON.stringify(selectedPartners));
      } else {
        // If no partners are selected, remove from session storage
        sessionStorage.removeItem(SELECTED_PARTNERS_KEY);
      }
    }
  }, [selectedPartners]);
  
  // Get the proper display name for the character
  const displayName = getProperCharacterName(character.name);
  
  // Filter conversations based on showIncomplete and selectedPartners
  const filteredConversations = conversations.filter(convo => {
    // Filter by completion status
    if (!showIncomplete && !convo.is_complete) {
      return false;
    }
    
    // Filter by selected partners
    if (selectedPartners.length > 0) {
      const partner = convo.character1 === character.name ? convo.character2 : convo.character1;
      return selectedPartners.includes(partner);
    }
    
    return true;
  });
  
  // Sort conversations: complete first, then by partner name
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    // First sort by completion status
    if (a.is_complete && !b.is_complete) return -1;
    if (!a.is_complete && b.is_complete) return 1;
    
    // Then sort by partner name
    const partnerA = a.character1 === character.name ? a.character2 : a.character1;
    const partnerB = b.character1 === character.name ? b.character2 : b.character1;
    return partnerA.localeCompare(partnerB);
  });
  
  // Helper function to get the correct minimap icon path
  const getIconPath = (characterName) => {
    // Get the correct portrait file name
    const portraitName = getPortraitFileName(characterName);
    return `/minimapIcons/${portraitName}_mm_psd.png`;
  };
  
  // Toggle a partner in the selected partners array
  const togglePartner = (partner) => {
    setSelectedPartners(prev => {
      if (prev.includes(partner)) {
        return prev.filter(p => p !== partner);
      } else {
        return [...prev, partner];
      }
    });
  };
  
  // Clear all selected partners
  const clearPartnerFilters = () => {
    setSelectedPartners([]);
    // Set flag indicating filters were explicitly cleared
    sessionStorage.setItem(FILTERS_CLEARED_KEY, 'true');
    // Remove any stored partners
    sessionStorage.removeItem(SELECTED_PARTNERS_KEY);
  };
  
  // Handle conversation card click
  const handleConversationClick = (conversationId) => {
    // Store current path before navigating
    sessionStorage.setItem(PREV_PATH_KEY, currentPath);
    // Store selected partners for navigation context
    if (selectedPartners.length > 0) {
      sessionStorage.setItem(SELECTED_PARTNERS_KEY, JSON.stringify(selectedPartners));
    } else {
      sessionStorage.removeItem(SELECTED_PARTNERS_KEY);
    }
    // Navigate to conversation - encode the conversation ID to handle special characters
    // Use window.location.href instead of router.push to force a full page reload
    window.location.href = `/conversations/${encodeURIComponent(conversationId)}`;
  };
  
  // Handle resetting viewed conversations for this character
  const handleResetViewed = () => {
    resetCharacterViewedConversations(character.name, conversations);
    // Reload the page to reflect changes
    window.location.reload();
  };
  
  // Handle navigation to the search page
  const handleSearchPageNavigation = () => {
    // Store the path
    sessionStorage.setItem(PREV_PATH_KEY, '/conversations');
    // Clear selected partners
    sessionStorage.removeItem(SELECTED_PARTNERS_KEY);
    // Set flag indicating filters were explicitly cleared
    sessionStorage.setItem(FILTERS_CLEARED_KEY, 'true');
    // Navigate to search page
    router.push('/conversations');
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-400 hover:underline"
            onClick={() => {
              // Store the path
              sessionStorage.setItem(PREV_PATH_KEY, '/');
              // Clear selected partners
              sessionStorage.removeItem(SELECTED_PARTNERS_KEY);
              // Set flag indicating filters were explicitly cleared
              sessionStorage.setItem(FILTERS_CLEARED_KEY, 'true');
            }}
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          
          <button 
            onClick={handleSearchPageNavigation}
            className="inline-flex items-center text-blue-400 hover:underline bg-transparent border-none cursor-pointer"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Go to Search
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3 lg:w-1/4 md:h-screen md:sticky md:top-0 md:self-start">
          <div className="bg-gray-800 rounded-lg p-6 overflow-y-auto h-auto md:max-h-[calc(100vh-2rem)] md:my-4">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={getIconPath(character.name)}
                alt={`${displayName} portrait`}
                fill
                sizes="128px"
                className="object-cover rounded-full"
                onError={(e) => {
                  e.target.src = '/minimapIcons/genericperson_mm_psd.png';
                }}
              />
            </div>
            
            <h1 className="text-2xl font-bold text-white text-center mb-4">{displayName}</h1>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white mb-3">Conversation Partners</h2>
              <div className="flex flex-wrap gap-2">
                {selectedPartners.length > 0 && (
                  <button
                    onClick={clearPartnerFilters}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                  >
                    Clear All Filters
                  </button>
                )}
                
                {character.conversationPartners.map(partner => (
                  <button
                    key={partner}
                    onClick={() => togglePartner(partner)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${
                      selectedPartners.includes(partner)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="relative w-4 h-4 mr-1">
                      <Image
                        src={getIconPath(partner)}
                        alt={`${getProperCharacterName(partner)} portrait`}
                        fill
                        sizes="16px"
                        className="object-cover rounded-full"
                        onError={(e) => {
                          e.target.src = '/minimapIcons/genericperson_mm_psd.png';
                        }}
                      />
                    </div>
                    {getProperCharacterName(partner)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showIncomplete}
                  onChange={() => setShowIncomplete(!showIncomplete)}
                  className="mr-2 h-4 w-4"
                />
                Show Incomplete Conversations
              </label>
            </div>
            
            <div className="mt-4 pb-4">
              <button
                onClick={handleResetViewed}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Viewed Conversations
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h2 className="text-xl font-bold text-white mb-4">
            {selectedPartners.length > 0 
              ? `Conversations with ${selectedPartners.length === 1 
                  ? getProperCharacterName(selectedPartners[0]) 
                  : `${selectedPartners.length} characters`}`
              : 'All Conversations'}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({sortedConversations.length} {sortedConversations.length === 1 ? 'conversation' : 'conversations'})
            </span>
          </h2>
          
          {selectedPartners.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-gray-300">Filtered by:</span>
              {selectedPartners.map(partner => (
                <span key={partner} className="px-3 py-1 bg-blue-800 text-white rounded-full text-sm flex items-center">
                  <div className="relative w-4 h-4 mr-1">
                    <Image
                      src={getIconPath(partner)}
                      alt={`${getProperCharacterName(partner)} portrait`}
                      fill
                      sizes="16px"
                      className="object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = '/minimapIcons/genericperson_mm_psd.png';
                      }}
                    />
                  </div>
                  {getProperCharacterName(partner)}
                  <button 
                    onClick={() => togglePartner(partner)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {sortedConversations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {sortedConversations.map(convo => (
                <ConversationCard 
                  key={convo.conversation_id} 
                  conversation={convo} 
                  highlightCharacter={character.name}
                  onClick={() => handleConversationClick(convo.conversation_id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">
                {showIncomplete 
                  ? 'No conversations found.'
                  : 'No complete conversations found. Try enabling incomplete conversations.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 