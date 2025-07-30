import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// Cache for validated words to avoid repeated API calls
const validatedWords = new Map<string, CacheEntry>();
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  isValid: boolean;
  timestamp: number;
}

export async function validateWordWithOpenAI(word: string): Promise<boolean> {
  const upperWord = word.toUpperCase();
  
  // Check cache first
  const cached = validatedWords.get(upperWord);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.isValid;
  }

  const client = getOpenAIClient();
  if (!client) {
    console.log('OpenAI not available for word validation, using fallback');
    return false;
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a word validator for a Wordle game. Respond with ONLY 'true' or 'false' to indicate if the given word is a valid 5-letter English word found in standard dictionaries. No proper nouns, abbreviations, or slang words."
        },
        {
          role: "user",
          content: `Is "${upperWord}" a valid 5-letter English word?`
        }
      ],
      temperature: 0,
      max_tokens: 10
    });

    const result = response.choices[0].message.content?.toLowerCase().trim();
    const isValid = result === 'true';

    // Cache the result
    validatedWords.set(upperWord, {
      isValid,
      timestamp: Date.now()
    } as CacheEntry);

    return isValid;
  } catch (error) {
    console.error('Error validating word with OpenAI:', error);
    return false;
  }
}

export async function validateWordExpanded(word: string, fallbackDictionary: Set<string>): Promise<boolean> {
  const upperWord = word.toUpperCase();
  
  // First check built-in dictionary for speed
  if (fallbackDictionary.has(upperWord)) {
    return true;
  }

  // Then check with OpenAI for expanded validation
  return await validateWordWithOpenAI(upperWord);
}

// Batch validation for multiple words (useful for performance)
export async function validateWordsInBatch(words: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};
  const client = getOpenAIClient();
  
  if (!client) {
    // Fallback to returning all false if no OpenAI
    words.forEach(word => results[word.toUpperCase()] = false);
    return results;
  }

  try {
    const wordList = words.map(w => w.toUpperCase()).join(', ');
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a word validator. For each word in the list, respond with JSON indicating if it's a valid 5-letter English dictionary word. Format: {\"WORD1\": true, \"WORD2\": false, ...}"
        },
        {
          role: "user",
          content: `Validate these 5-letter words: ${wordList}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Cache all results and return
    Object.entries(result).forEach(([word, isValid]) => {
      validatedWords.set(word as string, {
        isValid: isValid as boolean,
        timestamp: Date.now()
      } as CacheEntry);
      results[word as string] = isValid as boolean;
    });

    return results;
  } catch (error) {
    console.error('Error batch validating words:', error);
    words.forEach(word => results[word.toUpperCase()] = false);
    return results;
  }
}