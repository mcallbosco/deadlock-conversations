// This file contains static data used for generating pages
// in a static export build of Next.js

// Complete list of characters
export const ALL_CHARACTERS = [
  // Main characters
  "holliday", "paradox", "apollo", "artemis", "alethia", "bellona", 
  "fortuna", "hermes", "melee", "pluto", "strigidae", "vulcan", 
  // NPCs
  "dr ceres", "dr midas", "dr pandora", "thinker", "sage", 
  "engineer", "scientist", "poet",
  // Add any additional characters from your data
];

// A more extensive list of conversation IDs
// In a real implementation, you would include ALL conversation IDs from your data
export const ALL_CONVERSATION_IDS = [
  // Character pair conversations
  "holliday_paradox_convo01", "holliday_paradox_convo02", "holliday_paradox_convo03",
  "apollo_artemis_convo01", "apollo_artemis_convo02", "apollo_artemis_convo03",
  "bellona_fortuna_convo01", "bellona_fortuna_convo02", "bellona_fortuna_convo03",
  "hermes_pluto_convo01", "hermes_pluto_convo02", "hermes_pluto_convo03",
  "alethia_vulcan_convo01", "alethia_vulcan_convo02", "alethia_vulcan_convo03",
  "strigidae_melee_convo01", "strigidae_melee_convo02", "strigidae_melee_convo03",
  "dr_ceres_dr_midas_convo01", "dr_ceres_dr_midas_convo02", "dr_ceres_dr_midas_convo03",
  "dr_pandora_thinker_convo01", "dr_pandora_thinker_convo02", "dr_pandora_thinker_convo03",
  "sage_engineer_convo01", "sage_engineer_convo02", "sage_engineer_convo03",
  "scientist_poet_convo01", "scientist_poet_convo02", "scientist_poet_convo03",
  
  // Cross character conversations
  "holliday_apollo_convo01", "paradox_artemis_convo01", 
  "bellona_hermes_convo01", "fortuna_pluto_convo01",
  "alethia_strigidae_convo01", "vulcan_melee_convo01",
  
  // Add more conversation IDs here to match your data
  // The more comprehensive this list, the more pages will be generated
];

// Function to get static path parameters for characters
export function getStaticCharacterParams() {
  const params = [];
  
  for (const character of ALL_CHARACTERS) {
    // Regular name
    params.push({ name: character });
    
    // URL-encoded version if contains spaces
    if (character.includes(' ')) {
      params.push({ name: encodeURIComponent(character) });
    }
    
    // Lowercase version if different
    if (character !== character.toLowerCase()) {
      params.push({ name: character.toLowerCase() });
    }
  }
  
  return params;
}

// Function to get static path parameters for conversations
export function getStaticConversationParams() {
  const params = [];
  
  for (const id of ALL_CONVERSATION_IDS) {
    // Regular ID
    params.push({ id });
    
    // URL-encoded version if needed
    if (id.includes(' ') || id.includes('_') || id.includes('-')) {
      params.push({ id: encodeURIComponent(id) });
    }
  }
  
  return params;
} 