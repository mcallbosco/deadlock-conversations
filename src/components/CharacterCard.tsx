import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProperCharacterName } from '@/utils/characterNames';
import { getPortraitFileName } from '@/utils/portraitMapping';

interface CharacterCardProps {
  name: string;
  conversationCount: number;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ name, conversationCount }) => {
  // Get the proper display name for the character
  const displayName = getProperCharacterName(name);
  
  // Helper function to get the correct minimap icon path
  const getIconPath = (characterName: string) => {
    // Get the correct portrait file name
    const portraitName = getPortraitFileName(characterName);
    return `/minimapIcons/${portraitName}_mm_psd.png`;
  };
  
  return (
    <Link href={`/characters/${name}`} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={getIconPath(name)}
              alt={`${displayName} character portrait`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-full"
              onError={(e) => {
                // Fallback to a generic icon if the character icon is not found
                const target = e.target as HTMLImageElement;
                target.src = '/minimapIcons/genericperson_mm_psd.png';
              }}
            />
          </div>
          <h3 className="text-xl font-bold text-white">{displayName}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {conversationCount} {conversationCount === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CharacterCard; 