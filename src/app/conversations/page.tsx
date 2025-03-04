'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useData } from '@/utils/DataContext';
import ConversationCard from '@/components/ConversationCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import { Conversation } from '@/types';
import { usePathname, useSearchParams } from 'next/navigation';
import { resetAllViewedConversations } from '@/utils/viewedConversations';

// Key for storing previous path in session storage
const PREV_PATH_KEY = 'previousPath';

// Component that uses useSearchParams
function ConversationsContent() {
  const { data, loading, error } = useData();
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  
  // Filter states
  const [filters, setFilters] = useState({
    character: {
      label: 'Character',
      options: [{ value: 'all', label: 'All Characters' }],
      value: 'all',
    },
    completeness: {
      label: 'Completeness',
      options: [
        { value: 'all', label: 'All Conversations' },
        { value: 'complete', label: 'Complete Only' },
        { value: 'incomplete', label: 'Incomplete Only' },
      ],
      value: 'all',
    },
  });

  // Define applyFilters with useCallback to avoid dependency issues
  const applyFilters = useCallback(
    (
      conversations: Conversation[], 
      search: string, 
      currentFilters: typeof filters
    ) => {
      let filtered = [...conversations];
      
      // Apply search filter
      if (search.trim() !== '') {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(convo => 
          convo.lines.some(line => line.transcription.toLowerCase().includes(lowerSearch)) ||
          convo.summary.toLowerCase().includes(lowerSearch) ||
          convo.character1.toLowerCase().includes(lowerSearch) ||
          convo.character2.toLowerCase().includes(lowerSearch)
        );
      }
      
      // Apply character filter
      if (currentFilters.character.value !== 'all') {
        const character = currentFilters.character.value;
        filtered = filtered.filter(convo => 
          convo.character1 === character || convo.character2 === character
        );
      }
      
      // Apply completeness filter
      if (currentFilters.completeness.value !== 'all') {
        const isComplete = currentFilters.completeness.value === 'complete';
        filtered = filtered.filter(convo => convo.is_complete === isComplete);
      }
      
      setFilteredConversations(filtered);
    },
    []
  );

  // Store current path for navigation tracking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get the full path including search params
      const fullPath = searchParams.toString() 
        ? `${currentPath}?${searchParams.toString()}`
        : currentPath;
      
      // Store current path when navigating away
      const handleBeforeUnload = () => {
        sessionStorage.setItem(PREV_PATH_KEY, fullPath);
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentPath, searchParams]);

  // Initialize character filter options when data loads
  useEffect(() => {
    if (data) {
      // Get unique characters from conversations
      const characters = new Set<string>();
      data.conversations.forEach(convo => {
        characters.add(convo.character1);
        characters.add(convo.character2);
      });
      
      // Update character filter options
      setFilters(prev => ({
        ...prev,
        character: {
          ...prev.character,
          options: [
            { value: 'all', label: 'All Characters' },
            ...Array.from(characters).sort().map(char => ({
              value: char,
              label: char.charAt(0).toUpperCase() + char.slice(1), // Capitalize
            })),
          ],
        },
      }));
      
      // Initialize filtered conversations
      applyFilters(data.conversations, searchTerm, filters);
    }
  }, [data, searchTerm, filters, applyFilters]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (data) {
      applyFilters(data.conversations, term, filters);
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const updatedFilters = {
      ...filters,
      [filterKey]: {
        ...filters[filterKey as keyof typeof filters],
        value,
      },
    };
    
    setFilters(updatedFilters);
    
    if (data) {
      applyFilters(data.conversations, searchTerm, updatedFilters);
    }
  };

  // Handle conversation card click
  const handleConversationClick = (conversationId: string) => {
    // Get the full path including search params
    const fullPath = searchParams.toString() 
      ? `${currentPath}?${searchParams.toString()}`
      : currentPath;
    
    // Store current path before navigating
    sessionStorage.setItem(PREV_PATH_KEY, fullPath);
    
    // Store search filters
    if (searchTerm) {
      sessionStorage.setItem('searchTerm', searchTerm);
    } else {
      sessionStorage.removeItem('searchTerm');
    }
    
    if (filters.character.value !== 'all') {
      sessionStorage.setItem('characterFilter', filters.character.value);
    } else {
      sessionStorage.removeItem('characterFilter');
    }
    
    if (filters.completeness.value !== 'all') {
      sessionStorage.setItem('completenessFilter', filters.completeness.value);
    } else {
      sessionStorage.removeItem('completenessFilter');
    }
    
    // Navigate to conversation - encode the conversation ID to handle special characters
    // Use window.location.href instead of router.push to force a full page reload
    window.location.href = `/conversations/${encodeURIComponent(conversationId)}`;
  };

  // Handle resetting all viewed conversations
  const handleResetAllViewed = () => {
    resetAllViewedConversations();
    // Reload the page to reflect changes
    window.location.reload();
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading conversations..." />;
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
        <h1 className="text-3xl font-bold mb-4">All Conversations</h1>
        <p className="text-gray-300 mb-6">
          Browse and filter all conversations from Deadlock
        </p>
        
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search conversations..." 
        />
      </section>

      <section className="mb-6">
        <FilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResetAllViewed}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset All Viewed Conversations
          </button>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Results ({filteredConversations.length})
          </h2>
        </div>
        
        {filteredConversations.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No conversations found matching your criteria.</p>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map(conversation => (
              <ConversationCard 
                key={conversation.conversation_id} 
                conversation={conversation}
                onClick={() => handleConversationClick(conversation.conversation_id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Main component with Suspense boundary
export default function ConversationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="large" message="Loading conversations..." />}>
      <ConversationsContent />
    </Suspense>
  );
} 