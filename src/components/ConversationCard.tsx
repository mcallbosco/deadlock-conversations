import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Conversation } from '../types';
import { getProperCharacterName } from '@/utils/characterNames';
import { getPortraitFileName } from '@/utils/portraitMapping';
import { isConversationViewed } from '@/utils/viewedConversations';

interface ConversationCardProps {
  conversation: Conversation;
  highlightCharacter?: string;
  onClick?: () => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, highlightCharacter, onClick }) => {
  const { conversation_id, character1, character2, is_complete, missing_parts, summary, lines } = conversation;
  const [isViewed, setIsViewed] = useState(false);
  
  // Check if the conversation has been viewed
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setIsViewed(isConversationViewed(conversation_id));
    }
  }, [conversation_id]);
  
  // Determine which character to highlight (the one that's not the highlighted character)
  const partnerCharacter = highlightCharacter 
    ? (character1 === highlightCharacter ? character2 : character1)
    : null;
  
  // Get proper display names for characters
  const char1DisplayName = getProperCharacterName(character1);
  const char2DisplayName = getProperCharacterName(character2);
  const partnerDisplayName = partnerCharacter ? getProperCharacterName(partnerCharacter) : null;
  
  // Display character names
  const displayTitle = partnerCharacter 
    ? `Conversation with ${partnerDisplayName}`
    : `${char1DisplayName} & ${char2DisplayName}`;
  
  // Use the summary as the preview text, falling back to the first line if no summary is available
  const previewText = summary || (lines.length > 0 ? lines[0].transcription : 'No preview available');
  
  // Helper function to get the correct minimap icon path
  const getIconPath = (characterName: string) => {
    // Get the correct portrait file name
    const portraitName = getPortraitFileName(characterName);
    return `/minimapIcons/${portraitName}_mm_psd.png`;
  };
  
  return (
    <div 
      className={`
        bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 mb-4 
        ${!is_complete ? 'border-l-4 border-yellow-600' : ''} 
        ${isViewed ? 'opacity-70 bg-gray-900' : ''} 
        ${onClick ? 'cursor-pointer hover:bg-gray-750' : ''}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start">
        {/* Character icons */}
        <div className="flex-shrink-0 mr-4">
          {highlightCharacter && partnerCharacter ? (
            // Single icon when highlighting a character
            <div className="relative w-12 h-12">
              <Image
                src={getIconPath(partnerCharacter)}
                alt={`${partnerDisplayName} portrait`}
                fill
                sizes="48px"
                className={`object-cover rounded-full ${isViewed ? 'opacity-70' : ''}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/minimapIcons/genericperson_mm_psd.png';
                }}
              />
            </div>
          ) : (
            // Both icons when not highlighting a specific character
            <div className="flex -space-x-3">
              <div className="relative w-12 h-12 z-10">
                <Image
                  src={getIconPath(character1)}
                  alt={`${char1DisplayName} portrait`}
                  fill
                  sizes="48px"
                  className={`object-cover rounded-full border-2 border-gray-800 ${isViewed ? 'opacity-70' : ''}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/minimapIcons/genericperson_mm_psd.png';
                  }}
                />
              </div>
              <div className="relative w-12 h-12 z-0">
                <Image
                  src={getIconPath(character2)}
                  alt={`${char2DisplayName} portrait`}
                  fill
                  sizes="48px"
                  className={`object-cover rounded-full border-2 border-gray-800 ${isViewed ? 'opacity-70' : ''}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/minimapIcons/genericperson_mm_psd.png';
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{displayTitle}</h3>
          <p className="text-gray-400 text-sm mt-1 line-clamp-3">{previewText}</p>
          
          <div className="flex items-center mt-2">
            {!is_complete && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-800 text-yellow-100 mr-2">
                Incomplete
              </span>
            )}
            {missing_parts.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-800 text-red-100">
                Missing parts: {missing_parts.join(', ')}
              </span>
            )}
            {isViewed && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-800 text-blue-100 ml-auto">
                Viewed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard; 