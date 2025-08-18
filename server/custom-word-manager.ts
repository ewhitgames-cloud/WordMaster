import fs from 'fs/promises';
import path from 'path';

const CUSTOM_WORDS_FILE = path.join(process.cwd(), 'custom_words.txt');
const PENDING_WORDS_FILE = path.join(process.cwd(), 'pending_words.txt');

let customWordsCache = new Set<string>();
let pendingWordsCache = new Set<string>();

// Load custom words from file
export async function loadCustomWords(): Promise<Set<string>> {
  try {
    const content = await fs.readFile(CUSTOM_WORDS_FILE, 'utf-8');
    const words = content
      .split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length === 5 && /^[A-Z]+$/.test(word));
    
    customWordsCache = new Set(words);
    console.log(`Loaded ${customWordsCache.size} custom words`);
    return customWordsCache;
  } catch (error) {
    console.log('No custom words file found, creating empty one');
    await fs.writeFile(CUSTOM_WORDS_FILE, '');
    customWordsCache = new Set();
    return customWordsCache;
  }
}

// Load pending words from file
export async function loadPendingWords(): Promise<Set<string>> {
  try {
    const content = await fs.readFile(PENDING_WORDS_FILE, 'utf-8');
    const words = content
      .split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length === 5 && /^[A-Z]+$/.test(word));
    
    pendingWordsCache = new Set(words);
    return pendingWordsCache;
  } catch (error) {
    await fs.writeFile(PENDING_WORDS_FILE, '');
    pendingWordsCache = new Set();
    return pendingWordsCache;
  }
}

// Add word to custom words file
export async function addCustomWord(word: string): Promise<boolean> {
  const normalizedWord = word.trim().toUpperCase();
  
  if (normalizedWord.length !== 5 || !/^[A-Z]+$/.test(normalizedWord)) {
    return false;
  }

  if (customWordsCache.has(normalizedWord)) {
    return true; // Already exists
  }

  customWordsCache.add(normalizedWord);
  
  try {
    const words = Array.from(customWordsCache).sort().join('\n');
    await fs.writeFile(CUSTOM_WORDS_FILE, words + '\n');
    console.log(`Added custom word: ${normalizedWord}`);
    return true;
  } catch (error) {
    console.error('Error adding custom word:', error);
    customWordsCache.delete(normalizedWord);
    return false;
  }
}

// Add word to pending review list
export async function addPendingWord(word: string): Promise<boolean> {
  const normalizedWord = word.trim().toUpperCase();
  
  if (normalizedWord.length !== 5 || !/^[A-Z]+$/.test(normalizedWord)) {
    return false;
  }

  if (pendingWordsCache.has(normalizedWord) || customWordsCache.has(normalizedWord)) {
    return true; // Already exists
  }

  pendingWordsCache.add(normalizedWord);
  
  try {
    const words = Array.from(pendingWordsCache).sort().join('\n');
    await fs.writeFile(PENDING_WORDS_FILE, words + '\n');
    console.log(`Added pending word: ${normalizedWord}`);
    return true;
  } catch (error) {
    console.error('Error adding pending word:', error);
    pendingWordsCache.delete(normalizedWord);
    return false;
  }
}

// Get all pending words
export function getPendingWords(): string[] {
  return Array.from(pendingWordsCache).sort();
}

// Approve pending word (move to custom words)
export async function approvePendingWord(word: string): Promise<boolean> {
  const normalizedWord = word.trim().toUpperCase();
  
  if (!pendingWordsCache.has(normalizedWord)) {
    return false;
  }

  const added = await addCustomWord(normalizedWord);
  if (added) {
    pendingWordsCache.delete(normalizedWord);
    const words = Array.from(pendingWordsCache).sort().join('\n');
    await fs.writeFile(PENDING_WORDS_FILE, words + '\n');
    return true;
  }
  
  return false;
}

// Reject pending word (remove from pending)
export async function rejectPendingWord(word: string): Promise<boolean> {
  const normalizedWord = word.trim().toUpperCase();
  
  if (!pendingWordsCache.has(normalizedWord)) {
    return false;
  }

  pendingWordsCache.delete(normalizedWord);
  const words = Array.from(pendingWordsCache).sort().join('\n');
  await fs.writeFile(PENDING_WORDS_FILE, words + '\n');
  return true;
}

// Get all custom words
export function getCustomWords(): Set<string> {
  return new Set(customWordsCache);
}

// Initialize - load words on startup
export async function initializeCustomWords(): Promise<void> {
  await loadCustomWords();
  await loadPendingWords();
}