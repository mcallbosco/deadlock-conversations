'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { loadConversationData, getConversationById } from '@/utils/dataUtils';

// Skip SSR completely for the client component
const ConversationPageClient = dynamic(
  () => import('./ConversationPageClient'),
  { ssr: false }
);

export default function ClientWrapper({ conversationId, conversation: initialConversation }) {
  // Use state to track if we're on the client
  const [mounted, setMounted] = useState(false);
  const [conversation, setConversation] = useState(initialConversation);
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
        
        // If we got real data, update the conversation
        if (realData && realData.conversations && realData.conversations.length > 0) {
          const updatedConversation = getConversationById(realData, conversationId);
          
          if (updatedConversation) {
            setConversation(updatedConversation);
            console.log(`Loaded real data for conversation: ${conversationId}`);
          }
        }
      } catch (err) {
        console.error('Error loading real conversation data:', err);
        setError('Failed to load the latest data. Using fallback data instead.');
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };
    
    fetchRealData();
  }, [conversationId]);
  
  // During server rendering and initial hydration, show a simple loading state
  // This ensures exact match between server and client until hydration is complete
  if (!mounted) {
    return <div className="p-4 text-center">Loading conversation data...</div>;
  }
  
  // Show loading state if we're fetching real data
  if (isLoading) {
    return <div className="p-4 text-center">Refreshing conversation data...</div>;
  }
  
  // Show error if there was a problem loading real data
  if (error) {
    return (
      <div>
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 mb-4">
          <p className="text-yellow-200">{error}</p>
        </div>
        <ConversationPageClient 
          conversationId={conversationId} 
          conversation={conversation}
        />
      </div>
    );
  }
  
  // Only render the actual component after hydration is complete
  return <ConversationPageClient 
    conversationId={conversationId} 
    conversation={conversation}
  />;
} 