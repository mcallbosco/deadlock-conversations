/**
 * This file maps character internal names to their correct portrait file names
 * Some characters have different naming conventions in the portrait files
 */

// Map of character internal names to their portrait file names
export const CHARACTER_PORTRAIT_MAPPING: Record<string, string> = {
  // Characters with different portrait file names
  'inferno': 'inferno',
  'holliday': 'astro',
  'paradox': 'chrono',
  'orion': 'archer',
  'ghost': 'spectre',
  'vindicta': 'hornet',
  'seven': 'gigawatt',
  'atlas': 'bull',
  'forge': 'engineer',
  'dynamo': 'sumo',
  'calico': 'nano',
  'krill': 'digger',
  'fathom': 'slork',
  'pocket': 'synth',
  'the boss': 'yakuza',
  'viper': 'kali',
  'generic person': 'genericperson',
  'lady geist': 'spectre',
  'mo and krill': 'digger',
  'infernus': 'inferno',
  'mcginnis': 'engineer',
  'grey talon': 'archer',
  'ivy': 'tengu',
  'abrams': 'bull',

  // For characters where the internal name matches the portrait file name,
  // we'll just return the same name
};

/**
 * Get the correct portrait file name for a character
 * @param characterName The internal name of the character
 * @returns The correct portrait file name to use
 */
export function getPortraitFileName(characterName: string): string {
  const lowerName = characterName.toLowerCase();
  
  // If there's a specific mapping, use it
  if (CHARACTER_PORTRAIT_MAPPING[lowerName]) {
    return CHARACTER_PORTRAIT_MAPPING[lowerName];
  }
  
  // Otherwise, just use the character name as is, but remove spaces
  return lowerName.replace(/\s+/g, '');
} 