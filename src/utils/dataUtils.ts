import { ConversationData, Conversation, Character } from '../types';

// The path to the JSON data file - can be easily changed
// Using a path that works with Next.js
export const DATA_FILE_PATH = '/Sample.json';

// Function to load conversation data
export async function loadConversationData(): Promise<ConversationData> {
  try {
    // In the browser, use fetch with the public path
    const response = await fetch(DATA_FILE_PATH);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading conversation data:', error);
    // Return an empty data structure to avoid breaking the UI
    return { 
      export_date: new Date().toISOString(),
      total_conversations: 0,
      conversations: []
    };
  }
}

// Function to get all unique characters from the conversations
export function getAllCharacters(data: ConversationData): Character[] {
  const characterMap = new Map<string, Set<string>>();
  
  // Collect all characters and their conversation partners
  data.conversations.forEach(convo => {
    const char1 = convo.character1;
    const char2 = convo.character2;
    
    if (!characterMap.has(char1)) {
      characterMap.set(char1, new Set<string>());
    }
    if (!characterMap.has(char2)) {
      characterMap.set(char2, new Set<string>());
    }
    
    characterMap.get(char1)?.add(char2);
    characterMap.get(char2)?.add(char1);
  });
  
  // Convert to Character objects
  return Array.from(characterMap.entries()).map(([name, partners]) => ({
    name,
    iconPath: `/minimapIcons/${name}_mm_psd.png`,
    conversationPartners: Array.from(partners)
  }));
}

// Function to get conversations for a specific character
export function getConversationsForCharacter(data: ConversationData, characterName: string): Conversation[] {
  return data.conversations.filter(
    convo => convo.character1 === characterName || convo.character2 === characterName
  );
}

// Function to get conversations between two specific characters
export function getConversationsBetweenCharacters(
  data: ConversationData, 
  character1: string, 
  character2: string
): Conversation[] {
  return data.conversations.filter(
    convo => 
      (convo.character1 === character1 && convo.character2 === character2) ||
      (convo.character1 === character2 && convo.character2 === character1)
  );
}

// Function to search conversations by transcript content
export function searchConversations(data: ConversationData, searchTerm: string): Conversation[] {
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return data.conversations.filter(convo => 
    convo.lines.some(line => 
      line.transcription.toLowerCase().includes(lowerSearchTerm)
    ) || convo.summary.toLowerCase().includes(lowerSearchTerm)
  );
}

// Function to get a specific conversation by ID
export function getConversationById(data: ConversationData, conversationId: string): Conversation | undefined {
  return data.conversations.find(convo => convo.conversation_id === conversationId);
} 