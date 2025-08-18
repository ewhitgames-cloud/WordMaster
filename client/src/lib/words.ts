// Import comprehensive word dictionary
import { getWordSets } from '@shared/comprehensive-word-list';

// Use the comprehensive word set for validation
export const VALID_WORDS = getWordSets().guessSet;

// Word categories for dynamic selection
export const WORD_CATEGORIES = {
  NATURE: ['WATER', 'EARTH', 'FLAME', 'STORM', 'CLOUD', 'OCEAN', 'RIVER', 'BEACH', 'STONE', 'STEEL', 'FROST', 'BLOOM', 'PLANT', 'GRASS', 'TREES', 'WOODS', 'FRESH', 'SUNNY', 'WINDS', 'WAVES', 'CORAL', 'PEARL', 'AMBER', 'LUNAR', 'SOLAR', 'COMET', 'ORBIT', 'GALES', 'MISTY'],
  EMOTIONS: ['HAPPY', 'SMILE', 'LAUGH', 'PEACE', 'GRACE', 'CHARM', 'TRUST', 'PRIDE', 'DREAM', 'HOPES', 'BRAVE', 'SMART', 'SWEET', 'GENTLE', 'CALM', 'BOLD', 'FIERCE', 'NOBLE', 'WARM', 'KIND', 'BLISS', 'CHEER', 'MERRY', 'JOLLY', 'EAGER', 'LOVED', 'ADORE', 'HEART', 'SOUL', 'SPIRIT'],
  ACTIONS: ['DANCE', 'CLIMB', 'REACH', 'SWIFT', 'SPEED', 'FLASH', 'SPARK', 'SHINE', 'GLIDE', 'SOAR', 'DRIFT', 'FLOAT', 'SWING', 'TWIST', 'TWIRL', 'SLIDE', 'BOUND', 'LEAP', 'JUMP', 'RUSH', 'ZOOM', 'WHIRL', 'SPIN', 'TURN', 'FLIP', 'DIVE', 'SURF', 'RIDE', 'FLOW'],
  COLORS: ['LIGHT', 'BRIGHT', 'GLOW', 'SHADE', 'AZURE', 'CORAL', 'IVORY', 'EBONY', 'ROUGE', 'OLIVE', 'AMBER', 'PEARL', 'GOLD', 'SILVER', 'BRONZE', 'ROYAL', 'VIVID', 'CLEAR', 'CRISP', 'SHARP'],
  TECH: ['CYBER', 'PIXEL', 'CODES', 'BYTES', 'LINKS', 'NODES', 'VIRAL', 'TREND', 'BLEND', 'MERGE', 'SHIFT', 'ADAPT', 'SMART', 'QUICK', 'RAPID', 'BOOST', 'POWER', 'FORCE', 'DRIVE'],
  FANTASY: ['QUEST', 'MAGIC', 'SPELL', 'CHARM', 'FAIRY', 'TALES', 'MYTHS', 'EPIC', 'HERO', 'BRAVE', 'BOLD', 'VALOR', 'HONOR', 'GLORY', 'CROWN', 'ROYAL', 'NOBLE', 'MIGHTY', 'SWORD', 'SHIELD', 'TOWER', 'REALM', 'LANDS', 'WORLD', 'SPACE', 'COSMIC'],
  OBJECTS: ['HOUSE', 'TOWER', 'CABIN', 'LODGE', 'VENUE', 'PLAZA', 'GATES', 'DOORS', 'WALLS', 'ROOF', 'BOOKS', 'PAGES', 'WORDS', 'TALES', 'STORY', 'NOVEL', 'POEMS', 'SONGS', 'MUSIC', 'NOTES', 'GIFTS', 'PRIZE', 'TOKEN', 'BADGE', 'MEDAL', 'CROWN', 'JEWEL', 'RINGS', 'CHAIN', 'CHARM']
};

// Expanded target words pool with 300+ words for variety
export const TARGET_WORDS = [
  // Nature & Elements
  'WATER', 'EARTH', 'FLAME', 'STORM', 'CLOUD', 'OCEAN', 'RIVER', 'BEACH', 'STONE', 'STEEL',
  'FROST', 'BLOOM', 'PLANT', 'GRASS', 'TREES', 'WOODS', 'FRESH', 'SUNNY', 'WINDS', 'WAVES',
  'CORAL', 'PEARL', 'AMBER', 'LUNAR', 'SOLAR', 'STARR', 'COMET', 'ORBIT', 'GALES', 'MISTY',
  
  // Emotions & Feelings
  'HAPPY', 'SMILE', 'LAUGH', 'PEACE', 'GRACE', 'CHARM', 'TRUST', 'PRIDE', 'DREAM', 'HOPES',
  'BRAVE', 'SMART', 'SWEET', 'GENTLE', 'CALM', 'BOLD', 'FIERCE', 'NOBLE', 'WARM', 'KIND',
  'BLISS', 'CHEER', 'MERRY', 'JOLLY', 'EAGER', 'LOVED', 'ADORE', 'HEART', 'SOUL', 'SPIRIT',
  
  // Actions & Movement
  'DANCE', 'CLIMB', 'REACH', 'SWIFT', 'SPEED', 'FLASH', 'SPARK', 'SHINE', 'GLIDE', 'SOAR',
  'DRIFT', 'FLOAT', 'SWING', 'TWIST', 'TWIRL', 'GLIDE', 'SLIDE', 'BOUND', 'LEAP', 'JUMP',
  'RUSH', 'ZOOM', 'WHIRL', 'SPIN', 'TURN', 'FLIP', 'DIVE', 'SURF', 'RIDE', 'FLOW',
  
  // Colors & Visual
  'LIGHT', 'BRIGHT', 'GLOW', 'SHADE', 'AZURE', 'CORAL', 'IVORY', 'EBONY', 'ROUGE', 'OLIVE',
  'AMBER', 'PEARL', 'GOLD', 'SILVER', 'BRONZE', 'ROYAL', 'VIVID', 'CLEAR', 'CRISP', 'SHARP',
  
  // Technology & Modern
  'CYBER', 'PIXEL', 'CODES', 'BYTES', 'LINKS', 'NODES', 'VIRAL', 'TREND', 'BLEND', 'MERGE',
  'SHIFT', 'ADAPT', 'EVOLVE', 'SMART', 'QUICK', 'RAPID', 'BOOST', 'POWER', 'FORCE', 'DRIVE',
  
  // Adventure & Fantasy
  'QUEST', 'MAGIC', 'SPELL', 'CHARM', 'MYSTIC', 'FAIRY', 'TALES', 'MYTHS', 'LEGENDS', 'EPIC',
  'HERO', 'BRAVE', 'BOLD', 'VALOR', 'HONOR', 'GLORY', 'CROWN', 'ROYAL', 'NOBLE', 'MIGHTY',
  'SWORD', 'SHIELD', 'TOWER', 'CASTLE', 'REALM', 'LANDS', 'WORLD', 'SPACE', 'GALAXY', 'COSMIC',
  
  // Objects & Things
  'HOUSE', 'TOWER', 'CABIN', 'LODGE', 'VENUE', 'PLAZA', 'GATES', 'DOORS', 'WALLS', 'ROOF',
  'BOOKS', 'PAGES', 'WORDS', 'TALES', 'STORY', 'NOVEL', 'POEMS', 'SONGS', 'MUSIC', 'NOTES',
  'GIFTS', 'PRIZE', 'TOKEN', 'BADGE', 'MEDAL', 'CROWN', 'JEWEL', 'RINGS', 'CHAIN', 'CHARM',
  
  // Food & Taste
  'SWEET', 'SPICY', 'FRESH', 'CRISP', 'TASTE', 'FLAVOR', 'SUGAR', 'HONEY', 'CREAM', 'JUICE',
  'FRUIT', 'GRAPE', 'APPLE', 'BERRY', 'MELON', 'PEACH', 'MANGO', 'LEMON', 'HERBS', 'SPICE',
  
  // Time & Seasons
  'TODAY', 'NIGHT', 'EARLY', 'LATER', 'TIMER', 'TIMES', 'YEARS', 'YOUTH', 'NEWLY', 'FRESH',
  'CYCLE', 'PHASE', 'STAGE', 'TURNS', 'SHIFT', 'CHANGE', 'TREND', 'STYLE', 'VOGUE', 'RETRO',
  
  // Abstract Concepts
  'TRUTH', 'FAITH', 'TRUST', 'UNITY', 'PEACE', 'HOPE', 'DREAM', 'IDEAL', 'VALUE', 'WORTH',
  'HONOR', 'PRIDE', 'GRACE', 'CHARM', 'STYLE', 'CLASS', 'ELITE', 'PRIME', 'ROYAL', 'GRAND',
  'SOLID', 'VALID', 'EXACT', 'CLEAR', 'SHARP', 'FOCUS', 'SCOPE', 'RANGE', 'LIMIT', 'BOUND',
  
  // Sports & Games
  'SPORT', 'GAMES', 'PLAYS', 'TEAMS', 'MATCH', 'SCORE', 'WINS', 'GOALS', 'SKILLS', 'SPEED',
  'POWER', 'FORCE', 'SWING', 'PITCH', 'CATCH', 'THROW', 'KICKS', 'JUMPS', 'RUNS', 'RACE',
  
  // Art & Creativity
  'PAINT', 'BRUSH', 'COLOR', 'SHADE', 'LINES', 'CRAFT', 'STYLE', 'FORMS', 'SHAPE', 'CURVE',
  'BLEND', 'MERGE', 'TWIST', 'SWIRL', 'FLOW', 'GRACE', 'CHARM', 'BEAUTY', 'ELEGANCE', 'ARTSY',
  
  // Communication
  'VOICE', 'SPEAK', 'WORDS', 'TALES', 'STORY', 'SHARE', 'TALKS', 'CALLS', 'TEXTS', 'CODES',
  'SIGNS', 'HINTS', 'CLUES', 'NOTES', 'MEMOS', 'NEWS', 'INFO', 'DATA', 'FACTS', 'TRUTH'
];

// Utility functions for dynamic word generation
export function getRandomWord(): string {
  return TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
}

export function getRandomWordFromCategory(category: keyof typeof WORD_CATEGORIES): string {
  const words = WORD_CATEGORIES[category];
  return words[Math.floor(Math.random() * words.length)];
}

// Challenging words for daily challenge mode
export const DAILY_CHALLENGE_WORDS = [
  // Sophisticated vocabulary - harder to guess
  'VIVID', 'AZURE', 'EBONY', 'ROUGE', 'IVORY', 'AMBER', 'CORAL', 'PEARL', 'LUNAR', 'SOLAR',
  'CYBER', 'PIXEL', 'BYTES', 'NODES', 'VIRAL', 'BLEND', 'MERGE', 'SHIFT', 'ADAPT', 'EVOLVE',
  'MYSTIC', 'VALOR', 'HONOR', 'GLORY', 'REALM', 'SPELL', 'CHARM', 'FAIRY', 'MYTHS', 'EPIC',
  'CRISP', 'SWIFT', 'SHARP', 'VIVID', 'CLEAR', 'SCOPE', 'RANGE', 'LIMIT', 'BOUND', 'SOLID',
  'GALES', 'MISTY', 'ORBIT', 'COMET', 'COSMIC', 'PHASE', 'CYCLE', 'STAGE', 'TURNS', 'TWIST',
  'WHIRL', 'SWIRL', 'TWIRL', 'GLIDE', 'SOAR', 'DRIFT', 'FLOAT', 'BOUND', 'LEAP', 'SURF',
  'BLISS', 'CHEER', 'MERRY', 'JOLLY', 'EAGER', 'LOVED', 'ADORE', 'GENTLE', 'FIERCE', 'NOBLE',
  'GRACE', 'CHARM', 'STYLE', 'CLASS', 'ELITE', 'PRIME', 'GRAND', 'ROYAL', 'MIGHTY', 'BOLD',
  'ARTSY', 'CRAFT', 'FORMS', 'CURVE', 'SHADE', 'LINES', 'BRUSH', 'PAINT', 'COLOR', 'GLOW',
  'CODES', 'HINTS', 'CLUES', 'SIGNS', 'TEXTS', 'MEMOS', 'VOICE', 'TALES', 'STORY', 'POEMS'
];

export function getDailyWord(): string {
  // Generate a word based on today's date for consistency
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % TARGET_WORDS.length;
  return TARGET_WORDS[index];
}

export function getDailyChallengeWord(): string {
  // Generate a consistent daily challenge word based on date
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  // Create a seed based on date to ensure consistency
  const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed + dateString.charCodeAt(i)) & 0xffffffff;
  }
  
  // Use seeded random to select from challenge words
  const index = Math.abs(seed) % DAILY_CHALLENGE_WORDS.length;
  return DAILY_CHALLENGE_WORDS[index];
}

export function getChallengeWord(): string {
  // Get words that are more challenging (less common emotions/actions)
  const challengeWords = [
    ...WORD_CATEGORIES.NATURE.slice(15), // More exotic nature words
    ...WORD_CATEGORIES.TECH, // Tech words
    ...WORD_CATEGORIES.FANTASY.slice(10), // Advanced fantasy terms
  ];
  return challengeWords[Math.floor(Math.random() * challengeWords.length)];
}
