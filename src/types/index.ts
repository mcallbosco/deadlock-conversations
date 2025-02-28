export interface ConversationLine {
  part: number;
  variation: number;
  speaker: string;
  filename: string;
  transcription: string;
  has_transcription: boolean;
}

export interface Conversation {
  conversation_id: string;
  character1: string;
  character2: string;
  conversation_number: string;
  is_complete: boolean;
  missing_parts: number[];
  starter: string;
  lines: ConversationLine[];
  summary: string;
}

export interface ConversationData {
  export_date: string;
  total_conversations: number;
  conversations: Conversation[];
}

// Helper type for character information
export interface Character {
  name: string;
  iconPath: string;
  conversationPartners: string[];
} 