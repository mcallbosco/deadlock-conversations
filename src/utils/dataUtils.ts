import { ConversationData, Conversation, Character } from '../types';
import { fallbackData } from '../data/sampleData';

// The path to the JSON data file - can be easily changed
export const DATA_FILE_PATH = './Sample.json';

// Function to load conversation data
export async function loadConversationData(): Promise<ConversationData> {
  // During build time (server-side), try to load the JSON file directly
  if (typeof window === 'undefined') {
    try {
      // Use dynamic import to avoid including fs in client bundles
      const { promises: fs } = await import('fs');
      const { join } = await import('path');
      
      // Resolve the path to the JSON file
      const filePath = join(process.cwd(), 'public', 'Sample.json');
      console.log('Attempting to read data file from:', filePath);
      
      // Read and parse the JSON file
      const fileContents = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContents);
      console.log('Successfully loaded data from file with', data.total_conversations, 'conversations');
      return data;
    } catch (error) {
      console.error('Error reading data file during build:', error);
      console.log('Falling back to sample data during build time');
      return fallbackData;
    }
  }
  
  // In the browser, try to fetch the real data
  try {
    const baseUrl = window.location.origin;
    const fullUrl = new URL(DATA_FILE_PATH, baseUrl).toString();
    
    console.log('Attempting to fetch data from:', fullUrl);
    
    try {
      // Fetch the data
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
      });
      
      if (!response.ok) {
        console.error(`Failed to load data: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Successfully loaded real data with', data.total_conversations, 'conversations');
      return data;
    } catch (fetchError) {
      console.error('Error fetching data:', fetchError);
      
      // Try an alternative path for development
      try {
        console.log('Trying alternative path for development...');
        const alternativeUrl = new URL('/Sample.json', baseUrl).toString();
        const alternativeResponse = await fetch(alternativeUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
        });
        
        if (!alternativeResponse.ok) {
          throw new Error(`Failed to load data from alternative path: ${alternativeResponse.status}`);
        }
        
        const alternativeData = await alternativeResponse.json();
        console.log('Successfully loaded data from alternative path with', alternativeData.total_conversations, 'conversations');
        return alternativeData;
      } catch (alternativeError) {
        console.error('Error fetching from alternative path:', alternativeError);
        console.log('Falling back to sample data due to fetch errors');
        return fallbackData;
      }
    }
  } catch (error) {
    console.error('Error loading conversation data:', error);
    console.log('Falling back to sample data due to general error');
    // Use the fallback data
    return fallbackData;
  }
}

// Function to get all conversations for a specific character
export function getConversationsForCharacter(data: ConversationData, characterName: string): Conversation[] {
  return data.conversations.filter(
    convo => convo.character1 === characterName || convo.character2 === characterName
  );
}

// Function to get a specific conversation by ID
export function getConversationById(data: ConversationData, conversationId: string): Conversation | null {
  return data.conversations.find(convo => convo.conversation_id === conversationId) || null;
}

// Function to search conversations by text
export function searchConversations(data: ConversationData, searchTerm: string): Conversation[] {
  const lowerSearch = searchTerm.toLowerCase();
  
  return data.conversations.filter(convo => 
    convo.lines.some(line => line.transcription.toLowerCase().includes(lowerSearch)) ||
    convo.summary.toLowerCase().includes(lowerSearch) ||
    convo.character1.toLowerCase().includes(lowerSearch) ||
    convo.character2.toLowerCase().includes(lowerSearch)
  );
}

// Function to get all unique characters from the data
export function getAllCharacters(data: ConversationData): Character[] {
  const characterMap = new Map<string, Character>();
  
  // Process all conversations to build character data
  data.conversations.forEach(convo => {
    const { character1, character2 } = convo;
    
    // Process character1
    if (!characterMap.has(character1)) {
      characterMap.set(character1, {
        name: character1,
        iconPath: `/minimapIcons/${character1}_mm_psd.png`,
        conversationPartners: []
      });
    }
    
    // Add character2 as a partner for character1 if not already added
    const char1Data = characterMap.get(character1)!;
    if (!char1Data.conversationPartners.includes(character2)) {
      char1Data.conversationPartners.push(character2);
    }
    
    // Process character2
    if (!characterMap.has(character2)) {
      characterMap.set(character2, {
        name: character2,
        iconPath: `/minimapIcons/${character2}_mm_psd.png`,
        conversationPartners: []
      });
    }
    
    // Add character1 as a partner for character2 if not already added
    const char2Data = characterMap.get(character2)!;
    if (!char2Data.conversationPartners.includes(character1)) {
      char2Data.conversationPartners.push(character1);
    }
  });
  
  // Convert the map to an array and sort by name
  return Array.from(characterMap.values()).sort((a, b) => a.name.localeCompare(b.name));
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