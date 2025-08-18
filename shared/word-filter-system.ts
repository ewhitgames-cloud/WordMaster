// Comprehensive word filtering system for Wordle
// Implements blocklist/allowlist controls and frequency-based filtering

import { getWordFrequency } from './word-frequency-data';

export interface WordListSettings {
  blocklist: Set<string>;
  allowlist: Set<string>;
  useFrequencyFilter: boolean;
  minAnswerFrequency: number;
  minGuessFrequency: number;
  requireVowel: boolean;
}

// Default settings
export const DEFAULT_WORD_SETTINGS: WordListSettings = {
  blocklist: new Set([
    // Obscure Scrabble words
    'ERVIL', 'EMPTS', 'QOPHS', 'QADIS', 'KUFIS', 'AJEE', 'ZLOTY', 'ZYMOGEN',
    'AAHED', 'AARGH', 'ABACA', 'ABACI', 'ABAFT', 'ABAMP', 'ABAND', 'ABASH',
    'ABATE', 'ABAYA', 'ABBES', 'ABBEY', 'ABBOT', 'ABCEE', 'ABEAM', 'ABEAR',
    'ABELE', 'ABERS', 'ABETS', 'ABHOR', 'ABIDE', 'ABIES', 'ABLED', 'ABLER',
    'ABLES', 'ABLET', 'ABLOW', 'ABMHO', 'ABODE', 'ABOHM', 'ABOIL', 'ABOMA',
    'ABOON', 'ABORD', 'ABORE', 'ABORT', 'ABOUD', 'ABOUL', 'ABOUT', 'ABOVE',
    'ABOWT', 'ABRAY', 'ABRI', 'ABRIM', 'ABRIN', 'ABRIS', 'ABSEY', 'ABSIT',
    'ABUNA', 'ABUNE', 'ABUSE', 'ABUT', 'ABUTS', 'ABUZZ', 'ABYAS', 'ABYES',
    'ABYSM', 'ABYSS', 'ACAI', 'ACARA', 'ACARI', 'ACEDY', 'ACER', 'ACES',
    'ACETA', 'ACHED', 'ACHER', 'ACHES', 'ACHOO', 'ACIDS', 'ACIDY', 'ACING',
    'ACINI', 'ACKEE', 'ACKER', 'ACMES', 'ACNED', 'ACNES', 'ACOCK', 'ACOLD',
    'ACORN', 'ACRED', 'ACRES', 'ACRID', 'ACTIN', 'ACTON', 'ACTOR', 'ACUTE',
    'ACYLS', 'ADAGE', 'ADAPT', 'ADDAX', 'ADDED', 'ADDER', 'ADDIO', 'ADDLE',
    'ADEEM', 'ADEPT', 'ADHAN', 'ADIEU', 'ADIOS', 'ADITS', 'ADJY', 'ADMIX',
    'ADOBE', 'ADOBO', 'ADOPT', 'ADORE', 'ADORN', 'ADOWN', 'ADOZE', 'ADULT',
    'ADUNC', 'ADUST', 'ADVEW', 'ADYTA', 'ADZED', 'ADZES', 'AECIA', 'AEDES',
    'AEGIS', 'AEONS', 'AEROS', 'AERY', 'AFALD', 'AFAR', 'AFEAR', 'AFFIX',
    'AFIRE', 'AFLAJ', 'AFOOT', 'AFORE', 'AFOUL', 'AFRIT', 'AFROS', 'AFTER',
    
    // Archaic/rare words
    'ABEAM', 'ABELE', 'ABOON', 'ABRI', 'ABRIN', 'ABRIS', 'ABSIT', 'ABUNA',
    'ABUNE', 'ABYES', 'ACARI', 'ACCAD', 'ACCOY', 'ACERB', 'ACHOO', 'ACIDY',
    'ACINI', 'ACKEE', 'ACOCK', 'ACOLD', 'ACRED', 'ACTIN', 'ACTON', 'ACYLS',
    'ADDAX', 'ADEEM', 'ADHAN', 'ADITS', 'ADJY', 'ADMIX', 'ADOBO', 'ADOWN',
    'ADOZE', 'ADUNC', 'ADUST', 'ADVEW', 'AECIA', 'AEDES', 'AEROS', 'AERY',
    'AFALD', 'AFEAR', 'AFLAJ', 'AFRIT', 'AGAMA', 'AGAPE', 'AGARS', 'AGAVE',
    'AGAZE', 'AGENE', 'AGGER', 'AGHAS', 'AGILA', 'AGIOS', 'AGISM', 'AGIST',
    'AGITA', 'AGLET', 'AGLEY', 'AGLOO', 'AGMAS', 'AGONE', 'AGONS', 'AGOOD',
    'AGORA', 'AGRIA', 'AGRIN', 'AGUED', 'AGUES', 'AGUTI', 'AHEAP', 'AHENT',
    'AHIGH', 'AHIND', 'AHING', 'AHINT', 'AHOLD', 'AIDER', 'AIDOI', 'AIDOS',
    'AIERY', 'AIGHT', 'AIMER', 'AIOLI', 'AIRER', 'AIRNS', 'AIRTH', 'AIRTS',
    'AITCH', 'AITUS', 'AIVER', 'AIZLE', 'AJAPA', 'AJEE', 'AJIVA', 'AJOG',
    'AJUGA', 'AJWAN', 'AKELA', 'AKENE', 'AKING', 'ALAND', 'ALANE', 'ALANG',
    'ALANS', 'ALANT', 'ALAPA', 'ALARY', 'ALATE', 'ALAYS', 'ALBAS', 'ALBEE',
    'ALCID', 'ALECK', 'ALECS', 'ALEFS', 'ALEFT', 'ALEPH', 'ALEWS', 'ALEYE',
    'ALFAS', 'ALGAE', 'ALGAL', 'ALGAS', 'ALGOR', 'ALGUM', 'ALIEF', 'ALIFS',
    'ALINE', 'ALIST', 'ALIYA', 'ALKIE', 'ALKIS', 'ALKYD', 'ALKYL', 'ALLAY',
    'ALLEE', 'ALLEL', 'ALLIS', 'ALLOD', 'ALLOT', 'ALLOY', 'ALLYL', 'ALMAH',
    'ALMAS', 'ALMEH', 'ALMES', 'ALMUD', 'ALMUG', 'ALODS', 'ALOED', 'ALOES',
    'ALOIN', 'ALOWE', 'ALULA', 'ALUMS', 'ALURE', 'ALWAY', 'AMAHS', 'AMAIN',
    'AMASS', 'AMBIT', 'AMBLE', 'AMBOS', 'AMBRY', 'AMEBA', 'AMENT', 'AMIAS',
    'AMICE', 'AMICI', 'AMIDE', 'AMIDO', 'AMIDS', 'AMIES', 'AMIGA', 'AMINE',
    'AMINO', 'AMINS', 'AMIRS', 'AMISS', 'AMITY', 'AMMAN', 'AMMON', 'AMMOS',
    'AMNIO', 'AMOKS', 'AMOLE', 'AMORT', 'AMOUR', 'AMPED', 'AMPLE', 'AMPLY',
    'AMPUL', 'AMRIT', 'AMUCK', 'AMUSE', 'AMYLS',
    
    // Plurals of obscure words
    'ABRIS', 'ACYLS', 'ALEFS', 'AMINS', 'AMOKS', 'AMYLS',
    
    // Chemical/scientific terms
    'ACYLS', 'ALKYD', 'ALKYL', 'ALLYL', 'AMIDE', 'AMIDO', 'AMINO', 'AMPUL',
    
    // Geographic/proper noun derivatives that slipped through
    'ADOBE', 'AFROS', 'AGIOS', 'ALGAS', 'ALFAS'
  ]),
  allowlist: new Set([
    // Force-include specific good words that might have low frequency scores
    'NYMPH', 'GYPSY', 'LYMPH', 'PSYCH', 'STYLE', 'TYPAL', 'SYLPH'
  ]),
  useFrequencyFilter: true,
  minAnswerFrequency: 6,
  minGuessFrequency: 4,
  requireVowel: true
};

// Vowel check (including Y as vowel in certain contexts)
export function hasVowelOrY(word: string): boolean {
  const vowels = /[AEIOUY]/i;
  return vowels.test(word);
}

// More sophisticated vowel check
export function meetsVowelRequirement(word: string, allowlist: Set<string>): boolean {
  // If word is in allowlist, bypass vowel requirement
  if (allowlist.has(word.toUpperCase())) {
    return true;
  }
  
  // Check for standard vowels
  const hasStandardVowel = /[AEIOU]/i.test(word);
  if (hasStandardVowel) return true;
  
  // Check for Y acting as vowel (not at beginning unless it's the only vowel sound)
  const hasY = word.toUpperCase().includes('Y');
  if (hasY) {
    // Y counts as vowel if it's not the first letter, or if it's a known word like GYPSY
    return word.length > 1 && (word.toUpperCase()[0] !== 'Y' || allowlist.has(word.toUpperCase()));
  }
  
  return false;
}

// Check if word contains problematic patterns
export function hasProblematicPatterns(word: string): boolean {
  const upper = word.toUpperCase();
  
  // Archaic word patterns
  if (upper.match(/^[AEIOU]{2}/)) return true; // Double vowel starts (often archaic)
  if (upper.match(/[QX](?![UO])/)) return true; // Q not followed by U, X in weird positions
  if (upper.match(/^[BCDFGHJKLMNPQRSTVWXYZ]{4}/)) return true; // 4+ consonants in a row
  if (upper.match(/[JZ].*[JZ]/)) return true; // Multiple rare letters
  
  return false;
}

// Main word filtering function
export function filterWords(
  words: string[], 
  settings: WordListSettings,
  isAnswerList: boolean = false
): string[] {
  return words.filter(word => {
    const upper = word.toUpperCase();
    
    // Always reject blocklisted words
    if (settings.blocklist.has(upper)) {
      return false;
    }
    
    // Always accept allowlisted words
    if (settings.allowlist.has(upper)) {
      return true;
    }
    
    // Check basic requirements
    if (word.length !== 5) return false;
    if (!/^[A-Z]+$/i.test(word)) return false; // Only letters
    
    // Check vowel requirement
    if (settings.requireVowel && !meetsVowelRequirement(word, settings.allowlist)) {
      return false;
    }
    
    // Check for problematic patterns
    if (hasProblematicPatterns(word)) {
      return false;
    }
    
    // Frequency-based filtering
    if (settings.useFrequencyFilter) {
      const frequency = getWordFrequency(word);
      const minFreq = isAnswerList ? settings.minAnswerFrequency : settings.minGuessFrequency;
      
      if (frequency < minFreq) {
        return false;
      }
    }
    
    return true;
  });
}

// Settings persistence
export class WordFilterManager {
  private static STORAGE_KEY = 'wordpop-word-filter-settings';
  
  static getSettings(): WordListSettings {
    if (typeof localStorage === 'undefined') {
      return DEFAULT_WORD_SETTINGS;
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_WORD_SETTINGS,
          ...parsed,
          blocklist: new Set([...DEFAULT_WORD_SETTINGS.blocklist, ...(parsed.blocklist || [])]),
          allowlist: new Set([...DEFAULT_WORD_SETTINGS.allowlist, ...(parsed.allowlist || [])])
        };
      }
    } catch (error) {
      console.error('Error loading word filter settings:', error);
    }
    
    return DEFAULT_WORD_SETTINGS;
  }
  
  static saveSettings(settings: WordListSettings): void {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const toStore = {
        ...settings,
        blocklist: Array.from(settings.blocklist),
        allowlist: Array.from(settings.allowlist)
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving word filter settings:', error);
    }
  }
  
  static addToBlocklist(word: string): void {
    const settings = this.getSettings();
    settings.blocklist.add(word.toUpperCase());
    settings.allowlist.delete(word.toUpperCase()); // Remove from allowlist if present
    this.saveSettings(settings);
  }
  
  static removeFromBlocklist(word: string): void {
    const settings = this.getSettings();
    settings.blocklist.delete(word.toUpperCase());
    this.saveSettings(settings);
  }
  
  static addToAllowlist(word: string): void {
    const settings = this.getSettings();
    settings.allowlist.add(word.toUpperCase());
    settings.blocklist.delete(word.toUpperCase()); // Remove from blocklist if present
    this.saveSettings(settings);
  }
  
  static removeFromAllowlist(word: string): void {
    const settings = this.getSettings();
    settings.allowlist.delete(word.toUpperCase());
    this.saveSettings(settings);
  }
  
  static isBlocked(word: string): boolean {
    const settings = this.getSettings();
    return settings.blocklist.has(word.toUpperCase());
  }
  
  static isAllowed(word: string): boolean {
    const settings = this.getSettings();
    return settings.allowlist.has(word.toUpperCase());
  }
}