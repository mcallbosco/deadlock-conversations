'use client';

import React, { useEffect, useState } from 'react';
import ConversationPlayer from '@/components/ConversationPlayer';
import Link from 'next/link';
import { getProperCharacterName } from '@/utils/characterNames';
import { useRouter, usePathname } from 'next/navigation';
import { useData } from '@/utils/DataContext';
import { markConversationAsViewed } from '@/utils/viewedConversations';

// Key for storing previous path in session storage
const PREV_PATH_KEY = 'previousPath';
// Key for storing selected partners filter in session storage
const SELECTED_PARTNERS_KEY = 'selectedPartners';
// Key for storing search term in session storage
const SEARCH_TERM_KEY = 'searchTerm';
// Key for storing character filter in session storage
const CHARACTER_FILTER_KEY = 'characterFilter';
// Key for storing completeness filter in session storage
const COMPLETENESS_FILTER_KEY = 'completenessFilter';

export default function ConversationPageClient({ conversation }) {
  const router = useRouter();
  const currentPath = usePathname();
  const [previousPath, setPreviousPath] = useState('/conversations');
  const { data } = useData();
  const [relatedConversations, setRelatedConversations] = useState([]);
  const [characterConversations, setCharacterConversations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [searchIndex, setSearchIndex] = useState(0);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [sourceCharacter, setSourceCharacter] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [characterFilter, setCharacterFilter] = useState(null);
  const [completenessFilter, setCompletenessFilter] = useState(null);
  
  // Get proper display names for characters
  const char1DisplayName = getProperCharacterName(conversation.character1);
  const char2DisplayName = getProperCharacterName(conversation.character2);
  
  // Get the previous path and filters from session storage on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const storedPrevPath = sessionStorage.getItem(PREV_PATH_KEY);
      const storedSelectedPartnersJson = sessionStorage.getItem(SELECTED_PARTNERS_KEY);
      const storedSearchTerm = sessionStorage.getItem(SEARCH_TERM_KEY);
      const storedCharacterFilter = sessionStorage.getItem(CHARACTER_FILTER_KEY);
      const storedCompletenessFilter = sessionStorage.getItem(COMPLETENESS_FILTER_KEY);
      
      if (storedPrevPath && storedPrevPath !== currentPath) {
        setPreviousPath(storedPrevPath);
        
        // Check if we're coming from a character page
        if (storedPrevPath.includes('/characters/')) {
          const characterPath = storedPrevPath.split('/characters/')[1];
          if (characterPath) {
            // Remove any trailing slashes or query parameters
            const characterName = decodeURIComponent(characterPath.split('/')[0].split('?')[0]);
            setSourceCharacter(characterName);
            
            // If there were selected partners, store them
            if (storedSelectedPartnersJson) {
              try {
                const parsedPartners = JSON.parse(storedSelectedPartnersJson);
                if (Array.isArray(parsedPartners)) {
                  setSelectedPartners(parsedPartners);
                }
              } catch (e) {
                console.error('Error parsing selected partners:', e);
              }
            }
          }
        }
        
        // Check if we're coming from the search page
        if (storedPrevPath.includes('/conversations') && !storedPrevPath.includes('/conversations/')) {
          if (storedSearchTerm) {
            setSearchTerm(storedSearchTerm);
          }
          if (storedCharacterFilter) {
            setCharacterFilter(storedCharacterFilter);
          }
          if (storedCompletenessFilter) {
            setCompletenessFilter(storedCompletenessFilter);
          }
        }
      }
      
      // Store current path for next navigation
      const handleBeforeUnload = () => {
        sessionStorage.setItem(PREV_PATH_KEY, currentPath);
      };
      
      // Add event listener for page unload
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Clean up
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentPath]);
  
  // Find related conversations between the same two characters
  useEffect(() => {
    if (data && conversation) {
      // Get all conversations between these two characters
      const related = data.conversations.filter(
        convo => 
          (convo.character1 === conversation.character1 && convo.character2 === conversation.character2) ||
          (convo.character1 === conversation.character2 && convo.character2 === conversation.character1)
      );
      
      // Sort by conversation_id to ensure consistent ordering
      const sortedRelated = related.sort((a, b) => 
        a.conversation_id.localeCompare(b.conversation_id)
      );
      
      setRelatedConversations(sortedRelated);
      
      // Find the index of the current conversation
      const index = sortedRelated.findIndex(
        convo => convo.conversation_id === conversation.conversation_id
      );
      
      if (index !== -1) {
        setCurrentIndex(index);
      }
      
      // If we have a source character and selected partners, get filtered conversations
      if (sourceCharacter && selectedPartners.length > 0) {
        // Get all conversations involving the source character and any of the selected partners
        const filteredConvos = data.conversations.filter(
          convo => {
            // Check if the conversation involves the source character
            const involvesSourceCharacter = convo.character1 === sourceCharacter || convo.character2 === sourceCharacter;
            
            if (!involvesSourceCharacter) return false;
            
            // Get the partner in this conversation
            const partner = convo.character1 === sourceCharacter ? convo.character2 : convo.character1;
            
            // Check if the partner is in the selected partners list
            return selectedPartners.includes(partner);
          }
        );
        
        // Sort by conversation_id
        const sortedFilteredConvos = filteredConvos.sort((a, b) => 
          a.conversation_id.localeCompare(b.conversation_id)
        );
        
        setCharacterConversations(sortedFilteredConvos);
        
        // Find the index of the current conversation
        const charIndex = sortedFilteredConvos.findIndex(
          convo => convo.conversation_id === conversation.conversation_id
        );
        
        if (charIndex !== -1) {
          setCharacterIndex(charIndex);
        }
      }
      // If we have a source character but no selected partners, get all conversations for that character
      else if (sourceCharacter && !selectedPartners.length) {
        // Get all conversations involving the source character
        const characterConvos = data.conversations.filter(
          convo => convo.character1 === sourceCharacter || convo.character2 === sourceCharacter
        );
        
        // Sort by conversation_id
        const sortedCharacterConvos = characterConvos.sort((a, b) => 
          a.conversation_id.localeCompare(b.conversation_id)
        );
        
        setCharacterConversations(sortedCharacterConvos);
        
        // Find the index of the current conversation
        const charIndex = sortedCharacterConvos.findIndex(
          convo => convo.conversation_id === conversation.conversation_id
        );
        
        if (charIndex !== -1) {
          setCharacterIndex(charIndex);
        }
      }
      
      // If we have search filters, get the search results
      if (searchTerm || characterFilter || completenessFilter) {
        let filtered = [...data.conversations];
        
        // Apply search filter
        if (searchTerm && searchTerm.trim() !== '') {
          const lowerSearch = searchTerm.toLowerCase();
          filtered = filtered.filter(convo => 
            convo.lines.some(line => line.transcription.toLowerCase().includes(lowerSearch)) ||
            convo.summary.toLowerCase().includes(lowerSearch) ||
            convo.character1.toLowerCase().includes(lowerSearch) ||
            convo.character2.toLowerCase().includes(lowerSearch)
          );
        }
        
        // Apply character filter
        if (characterFilter && characterFilter !== 'all') {
          filtered = filtered.filter(convo => 
            convo.character1 === characterFilter || convo.character2 === characterFilter
          );
        }
        
        // Apply completeness filter
        if (completenessFilter && completenessFilter !== 'all') {
          const isComplete = completenessFilter === 'complete';
          filtered = filtered.filter(convo => convo.is_complete === isComplete);
        }
        
        setSearchResults(filtered);
        
        // Find the index of the current conversation
        const searchIdx = filtered.findIndex(
          convo => convo.conversation_id === conversation.conversation_id
        );
        
        if (searchIdx !== -1) {
          setSearchIndex(searchIdx);
        }
      }
    }
  }, [data, conversation, sourceCharacter, selectedPartners, searchTerm, characterFilter, completenessFilter]);
  
  // Mark the conversation as viewed when it's opened
  useEffect(() => {
    if (conversation) {
      markConversationAsViewed(conversation.conversation_id);
    }
  }, [conversation]);
  
  // Handle back button click
  const handleBackClick = () => {
    // Use window.history.back() instead of router.push to properly navigate back
    window.history.back();
  };
  
  // Navigate to the previous conversation between the same characters
  const handlePrevConversation = () => {
    if (currentIndex > 0 && relatedConversations.length > 1) {
      const prevConvo = relatedConversations[currentIndex - 1];
      // Use window.location.href to force a full page reload
      window.location.href = `/conversations/${encodeURIComponent(prevConvo.conversation_id)}`;
    }
  };
  
  // Navigate to the next conversation between the same characters
  const handleNextConversation = () => {
    if (currentIndex < relatedConversations.length - 1) {
      const nextConvo = relatedConversations[currentIndex + 1];
      // Use window.location.href to force a full page reload
      window.location.href = `/conversations/${encodeURIComponent(nextConvo.conversation_id)}`;
    }
  };
  
  // Navigate to the previous conversation for the character
  const handlePrevCharacterConversation = () => {
    if (characterIndex > 0 && characterConversations.length > 1) {
      const prevConvo = characterConversations[characterIndex - 1];
      // Use window.location.href to force a full page reload
      window.location.href = `/conversations/${encodeURIComponent(prevConvo.conversation_id)}`;
    }
  };
  
  // Navigate to the next conversation for the character
  const handleNextCharacterConversation = () => {
    if (characterIndex < characterConversations.length - 1) {
      const nextConvo = characterConversations[characterIndex + 1];
      // Use window.location.href to force a full page reload
      window.location.href = `/conversations/${encodeURIComponent(nextConvo.conversation_id)}`;
    }
  };
  
  // Navigate to the previous search result
  const handlePrevSearchResult = () => {
    if (searchIndex > 0 && searchResults.length > 1) {
      const prevResult = searchResults[searchIndex - 1];
      // Use window.location.href to force a full page reload
      window.location.href = `/conversations/${encodeURIComponent(prevResult.conversation_id)}`;
    }
  };
  
  // Navigate to the next search result
  const handleNextSearchResult = () => {
    if (searchIndex < searchResults.length - 1) {
      const nextResult = searchResults[searchIndex + 1];
      // Use window.location.href to force a full page reload
      window.location.href = `/conversations/${encodeURIComponent(nextResult.conversation_id)}`;
    }
  };
  
  // Determine the back button text based on the previous path
  const getBackButtonText = () => {
    if (previousPath.includes('/characters/')) {
      const characterPath = previousPath.split('/characters/')[1];
      if (characterPath) {
        // Remove any trailing slashes or query parameters
        const characterName = characterPath.split('/')[0].split('?')[0];
        if (characterName) {
          return `Back to ${getProperCharacterName(decodeURIComponent(characterName))}'s Profile`;
        }
      }
    }
    
    if (previousPath === '/conversations' || previousPath.startsWith('/conversations?')) {
      return searchTerm ? `Back to Search Results` : 'Back to All Conversations';
    }
    
    if (previousPath === '/' || previousPath === '') {
      return 'Back to Home';
    }
    
    return 'Back';
  };
  
  // Show navigation buttons for conversations between the same characters
  const showNavigation = relatedConversations.length > 1;
  
  // Show navigation buttons for all of a character's conversations
  const showCharacterNavigation = sourceCharacter && 
                                characterConversations.length > 1;
  
  // Show navigation buttons for search results
  const showSearchNavigation = searchResults.length > 1 && 
                              (searchTerm || characterFilter !== 'all' || completenessFilter !== 'all');
  
  // Get the source character's display name
  const sourceCharacterDisplayName = sourceCharacter ? getProperCharacterName(sourceCharacter) : '';
  
  // Get the navigation title based on selected partners
  const getCharacterNavigationTitle = () => {
    if (selectedPartners.length === 0) {
      return `${sourceCharacterDisplayName}'s Conversation`;
    } else if (selectedPartners.length === 1) {
      return `${sourceCharacterDisplayName}'s Conversation with ${getProperCharacterName(selectedPartners[0])}`;
    } else {
      return `${sourceCharacterDisplayName}'s Filtered Conversations`;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button 
          onClick={handleBackClick}
          className="inline-flex items-center text-blue-400 hover:underline bg-transparent border-none cursor-pointer"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          {getBackButtonText()}
        </button>
        
        {showSearchNavigation && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              Search Result {searchIndex + 1} of {searchResults.length}
              {searchTerm && <span className="ml-1">&quot;{searchTerm}&quot;</span>}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevSearchResult}
                disabled={searchIndex === 0}
                className={`p-2 rounded-full ${
                  searchIndex === 0 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Previous search result"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextSearchResult}
                disabled={searchIndex === searchResults.length - 1}
                className={`p-2 rounded-full ${
                  searchIndex === searchResults.length - 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Next search result"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {!showSearchNavigation && showCharacterNavigation && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              {getCharacterNavigationTitle()} {characterIndex + 1} of {characterConversations.length}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevCharacterConversation}
                disabled={characterIndex === 0}
                className={`p-2 rounded-full ${
                  characterIndex === 0 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Previous conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextCharacterConversation}
                disabled={characterIndex === characterConversations.length - 1}
                className={`p-2 rounded-full ${
                  characterIndex === characterConversations.length - 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Next conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {!showSearchNavigation && !showCharacterNavigation && showNavigation && (
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              Conversation {currentIndex + 1} of {relatedConversations.length}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevConversation}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full ${
                  currentIndex === 0 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Previous conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextConversation}
                disabled={currentIndex === relatedConversations.length - 1}
                className={`p-2 rounded-full ${
                  currentIndex === relatedConversations.length - 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Next conversation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      <ConversationPlayer conversation={conversation} />
      
      <div className="mt-8 flex gap-4">
        <Link 
          href={`/characters/${conversation.character1}`} 
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
        >
          View {char1DisplayName}&apos;s Profile
        </Link>
        
        <Link 
          href={`/characters/${conversation.character2}`} 
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
        >
          View {char2DisplayName}&apos;s Profile
        </Link>
      </div>
      
      {showNavigation && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">
            More conversations between {char1DisplayName} and {char2DisplayName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedConversations.map((convo, index) => (
              <div 
                key={convo.conversation_id}
                className={`p-3 rounded-lg cursor-pointer ${
                  convo.conversation_id === conversation.conversation_id
                    ? 'bg-blue-900 border border-blue-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => {
                  if (convo.conversation_id !== conversation.conversation_id) {
                    router.push(`/conversations/${encodeURIComponent(convo.conversation_id)}`);
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-white">Conversation {index + 1}</span>
                  {!convo.is_complete && (
                    <span className="px-2 py-0.5 bg-yellow-800 text-yellow-100 rounded-full text-xs">
                      Incomplete
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                  {convo.summary || (convo.lines.length > 0 ? convo.lines[0].transcription : 'No preview available')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {sourceCharacter && (
        <div className="text-sm text-gray-400">
          {getProperCharacterName(sourceCharacter)}&apos;s conversations
          {selectedPartners.length > 0 && (
            <span> with selected partners</span>
          )}
        </div>
      )}
      
      {sourceCharacter && (
        <div className="text-sm text-gray-400">
          {getProperCharacterName(sourceCharacter)}&apos;s complete conversations
        </div>
      )}
    </div>
  );
} 