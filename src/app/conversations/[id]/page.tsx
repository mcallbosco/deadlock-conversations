import React from 'react';
import { getConversationById, loadConversationData } from '@/utils/dataUtils';
import ClientWrapper from './ClientWrapper';
import { notFound } from 'next/navigation';

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  try {
    const data = await loadConversationData();
    
    // Create a set of all possible conversation IDs
    const allIds = new Set();
    
    data.conversations.forEach(conversation => {
      const id = conversation.conversation_id;
      
      // Add the regular ID
      allIds.add(id);
      
      // Always add the URL-encoded version to ensure all special characters are handled
      if (id !== encodeURIComponent(id)) {
        allIds.add(encodeURIComponent(id));
      }
    });
    
    console.log(`Generating static params for ${allIds.size} conversation IDs`);
    
    // Convert to the format Next.js expects
    return Array.from(allIds).map(id => ({
      id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return a minimal set of params to allow the build to continue
    return [
      { id: 'sample_conversation_1' }, 
      { id: 'sample_conversation_2' },
      { id: 'sample_conversation_3' }
    ];
  }
}

export default async function ConversationPage({ params }) {
  // Ensure params is properly awaited
  const id = params?.id;
  
  if (!id) {
    notFound();
  }
  
  try {
    // Pre-fetch the data on the server
    const data = await loadConversationData();
    
    // Decode the URL parameter
    const decodedId = decodeURIComponent(id);
    
    // Get the conversation
    const conversation = getConversationById(data, decodedId);
    
    // If conversation not found, return 404
    if (!conversation) {
      notFound();
    }
    
    // Pass the pre-fetched data to the client component
    return <ClientWrapper conversationId={decodedId} conversation={conversation} />;
  } catch (error) {
    console.error('Error loading conversation data:', error);
    return <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-center">
      <h2 className="text-xl font-bold text-red-300 mb-2">Error</h2>
      <p className="text-red-200">Failed to load conversation data</p>
    </div>;
  }
} 