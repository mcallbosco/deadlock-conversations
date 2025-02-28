/**
 * Dictionary mapping internal character names (used in file paths) to their proper display names
 * Based on the provided list where first name is proper name, second is internal name
 */
export const CHARACTER_NAMES: Record<string, string> = {
  // Format: 'internal_name': 'Proper Name'
  'inferno': 'Infernus',
  'gigawatt': 'Seven',
  'hornet': 'Vindicta',
  'ghost': 'Lady Geist',
  'tempest': 'Tempest',
  'atlas': 'Abrams',
  'wraith': 'Wraith',
  'forge': 'McGinnis',
  'chrono': 'Paradox',
  'sumo': 'Dynamo',
  'kelvin': 'Kelvin',
  'haze': 'Haze',
  'astro': 'Holliday',
  'bebop': 'Bebop',
  'nano': 'Calico',
  'orion': 'Grey Talon',
  'krill': 'Mo and Krill',
  'shiv': 'Shiv',
  'tengu': 'Ivy',
  'kali': 'Kali',
  'warden': 'Warden',
  'yamato': 'Yamato',
  'butcher': 'Butcher',
  'lash': 'Lash',
  'akimbo': 'Akimbo',
  'viscous': 'Viscous',
  'ballista': 'Ballista',
  'gunslinger': 'Gunslinger',
  'yakuza': 'The Boss',
  'spade': 'Spade',
  'genericperson': 'Generic Person',
  'tokamak': 'Tokamak',
  'wrecker': 'Wrecker',
  'rutger': 'Rutger',
  'synth': 'Pocket',
  'thumper': 'Thumper',
  'mirage': 'Mirage',
  'slork': 'Fathom',
  'cadence': 'Cadence',
  'targetdummy': 'Target Dummy',
  'bomber': 'Bomber',
  'viper': 'Vyper',
  
  // Add variations for common cases
  'generic person': 'Generic Person',
  'generic': 'Generic Person',
  'mo': 'Mo and Krill',
  'the boss': 'The Boss',
  'grey talon': 'Grey Talon',
  'lady geist': 'Lady Geist'
};

/**
 * Get the proper display name for a character based on their internal name
 * @param internalName The internal name of the character
 * @returns The proper display name, or the internal name capitalized if not found
 */
export function getProperCharacterName(internalName: string): string {
  // First check if the name exists in our dictionary
  if (CHARACTER_NAMES[internalName.toLowerCase()]) {
    return CHARACTER_NAMES[internalName.toLowerCase()];
  }
  
  // If not found, just capitalize the first letter of each word
  return internalName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 