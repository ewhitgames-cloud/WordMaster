import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }
  return openai;
}

export interface WordGenerationRequest {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
  excludeWords?: string[];
}

export interface GeneratedWord {
  word: string;
  category: string;
  difficulty: string;
  definition?: string;
}

export async function generateWords(options: WordGenerationRequest = {}): Promise<GeneratedWord[]> {
  const {
    category = 'general',
    difficulty = 'medium',
    count = 50,
    excludeWords = []
  } = options;

  const excludeList = excludeWords.length > 0 
    ? `Exclude these words: ${excludeWords.join(', ')}. ` 
    : '';

  const prompt = `Generate exactly ${count} unique 5-letter English words for a Wordle-style game.

Requirements:
- All words must be exactly 5 letters
- ${difficulty === 'easy' ? 'Use common, everyday words that most people know' : 
    difficulty === 'medium' ? 'Use moderately challenging words' :
    'Use sophisticated, less common words that are still valid English'}
- Category focus: ${category === 'general' ? 'Mix of various categories' : category}
- All words must be real English words found in standard dictionaries
- No proper nouns, abbreviations, or slang
- ${excludeList}

Return as JSON array with this exact format:
{
  "words": [
    {
      "word": "TRAIN",
      "category": "${category}",
      "difficulty": "${difficulty}",
      "definition": "brief definition"
    }
  ]
}`;

  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a word expert helping create words for a word puzzle game. Always respond with valid JSON containing exactly the requested number of unique 5-letter words."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"words":[]}');
    
    if (!result.words || !Array.isArray(result.words)) {
      throw new Error("Invalid response format from OpenAI");
    }

    // Validate and clean the words
    const validWords = result.words
      .filter((item: any) => 
        item.word && 
        typeof item.word === 'string' && 
        item.word.length === 5 &&
        /^[A-Z]+$/.test(item.word.toUpperCase())
      )
      .map((item: any) => ({
        word: item.word.toUpperCase(),
        category: item.category || category,
        difficulty: item.difficulty || difficulty,
        definition: item.definition || ''
      }));

    return validWords;
  } catch (error) {
    console.error('Error generating words with OpenAI:', error);
    throw new Error(`Failed to generate words: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateDailyChallengeWords(count: number = 100): Promise<string[]> {
  try {
    const words = await generateWords({
      difficulty: 'hard',
      count,
      category: 'sophisticated vocabulary'
    });
    
    return words.map(w => w.word);
  } catch (error) {
    console.error('Error generating daily challenge words:', error);
    // Fallback to existing words if OpenAI fails
    return [];
  }
}

export async function generateWordsByCategory(category: string, count: number = 30): Promise<string[]> {
  try {
    const words = await generateWords({
      category,
      difficulty: 'medium',
      count
    });
    
    return words.map(w => w.word);
  } catch (error) {
    console.error(`Error generating ${category} words:`, error);
    return [];
  }
}