import { Conversation } from '@/types';

// Key for storing viewed conversations in local storage
const VIEWED_CONVERSATIONS_KEY = 'viewedConversations';

/**
 * Marks a conversation as viewed in local storage
 * @param conversationId The ID of the conversation to mark as viewed
 */
export function markConversationAsViewed(conversationId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Get current viewed conversations
    const viewedConversations = getViewedConversations();
    
    // Add the current conversation if not already viewed
    if (!viewedConversations.includes(conversationId)) {
      viewedConversations.push(conversationId);
      
      // Save back to local storage
      localStorage.setItem(VIEWED_CONVERSATIONS_KEY, JSON.stringify(viewedConversations));
    }
  } catch (error) {
    console.error('Error marking conversation as viewed:', error);
  }
}

/**
 * Checks if a conversation has been viewed
 * @param conversationId The ID of the conversation to check
 * @returns True if the conversation has been viewed, false otherwise
 */
export function isConversationViewed(conversationId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const viewedConversations = getViewedConversations();
    return viewedConversations.includes(conversationId);
  } catch (error) {
    console.error('Error checking if conversation is viewed:', error);
    return false;
  }
}

/**
 * Gets all viewed conversation IDs
 * @returns Array of viewed conversation IDs
 */
export function getViewedConversations(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedData = localStorage.getItem(VIEWED_CONVERSATIONS_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error getting viewed conversations:', error);
    return [];
  }
}

/**
 * Resets all viewed conversations
 */
export function resetAllViewedConversations(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(VIEWED_CONVERSATIONS_KEY);
  } catch (error) {
    console.error('Error resetting viewed conversations:', error);
  }
}

/**
 * Resets viewed conversations for a specific character
 * @param characterName The name of the character to reset viewed conversations for
 * @param conversations Array of all conversations to filter by character
 */
export function resetCharacterViewedConversations(characterName: string, conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Get current viewed conversations
    const viewedConversations = getViewedConversations();
    
    // Filter out conversations involving the specified character
    const characterConversationIds = conversations
      .filter(convo => convo.character1 === characterName || convo.character2 === characterName)
      .map(convo => convo.conversation_id);
    
    // Keep only conversations that don't involve the character
    const updatedViewedConversations = viewedConversations.filter(
      id => !characterConversationIds.includes(id)
    );
    
    // Save back to local storage
    localStorage.setItem(VIEWED_CONVERSATIONS_KEY, JSON.stringify(updatedViewedConversations));
  } catch (error) {
    console.error('Error resetting character viewed conversations:', error);
  }
} 