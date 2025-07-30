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

export interface ExpandedWordSet {
  common: string[];
  intermediate: string[];
  advanced: string[];
  categories: {
    [category: string]: string[];
  };
}

export async function generateExpandedWordLibrary(): Promise<ExpandedWordSet> {
  const client = getOpenAIClient();
  
  const categories = [
    'animals', 'nature', 'food', 'emotions', 'actions', 'objects', 'colors',
    'weather', 'sports', 'music', 'travel', 'science', 'technology', 'art',
    'business', 'health', 'education', 'family', 'time', 'space', 'materials',
    'tools', 'buildings', 'clothing', 'plants', 'transportation', 'games'
  ];

  const wordSets: ExpandedWordSet = {
    common: [],
    intermediate: [],
    advanced: [],
    categories: {}
  };

  try {
    // Generate common words (most frequently used in English)
    const commonWordsPrompt = `Generate 200 common 5-letter English words that are:
- Very frequently used in everyday English
- Known by most native speakers
- Suitable for word games
- All exactly 5 letters
- Real dictionary words only
- No proper nouns, abbreviations, or slang

Return as JSON: {"words": ["ABOUT", "ABOVE", ...]}`;

    const commonResponse = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: commonWordsPrompt }],
      response_format: { type: "json_object" }
    });

    const commonWords = JSON.parse(commonResponse.choices[0].message.content!);
    wordSets.common = commonWords.words;

    // Generate intermediate words
    const intermediateWordsPrompt = `Generate 200 intermediate 5-letter English words that are:
- Moderately challenging but still recognizable
- More sophisticated than basic vocabulary
- Suitable for word games
- All exactly 5 letters
- Real dictionary words only
- Different from common everyday words

Return as JSON: {"words": ["BLEND", "CHARM", ...]}`;

    const intermediateResponse = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: intermediateWordsPrompt }],
      response_format: { type: "json_object" }
    });

    const intermediateWords = JSON.parse(intermediateResponse.choices[0].message.content!);
    wordSets.intermediate = intermediateWords.words;

    // Generate advanced words
    const advancedWordsPrompt = `Generate 150 advanced 5-letter English words that are:
- Less common but still legitimate English words
- Found in standard dictionaries
- Challenging but fair for word games
- All exactly 5 letters
- Real dictionary words only
- More sophisticated vocabulary

Return as JSON: {"words": ["AZURE", "BERTH", ...]}`;

    const advancedResponse = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: advancedWordsPrompt }],
      response_format: { type: "json_object" }
    });

    const advancedWords = JSON.parse(advancedResponse.choices[0].message.content!);
    wordSets.advanced = advancedWords.words;

    // Generate category-specific words (in batches to avoid token limits)
    for (let i = 0; i < categories.length; i += 3) {
      const categoryBatch = categories.slice(i, i + 3);
      
      const categoryPrompt = `Generate 30 unique 5-letter English words for each category: ${categoryBatch.join(', ')}.

Requirements:
- All words must be exactly 5 letters
- Real English dictionary words only
- Related to the specific category
- No proper nouns or abbreviations
- Suitable for word games

Return as JSON: {
  "${categoryBatch[0]}": ["TIGER", "HORSE", ...],
  ${categoryBatch[1] ? `"${categoryBatch[1]}": ["BEACH", "WOODS", ...],` : ''}
  ${categoryBatch[2] ? `"${categoryBatch[2]}": ["BREAD", "APPLE", ...]` : ''}
}`;

      const categoryResponse = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: categoryPrompt }],
        response_format: { type: "json_object" }
      });

      const categoryWords = JSON.parse(categoryResponse.choices[0].message.content!);
      Object.assign(wordSets.categories, categoryWords);
    }

  } catch (error) {
    console.error('Error generating expanded word library:', error);
    throw error;
  }

  return wordSets;
}

export async function getAllExpandedWords(): Promise<string[]> {
  try {
    const wordSets = await generateExpandedWordLibrary();
    
    const allWords = [
      ...wordSets.common,
      ...wordSets.intermediate,
      ...wordSets.advanced,
      ...Object.values(wordSets.categories).flat()
    ];

    // Remove duplicates and ensure all are uppercase 5-letter words
    const uniqueWords = Array.from(new Set(allWords))
      .map(word => word.toUpperCase())
      .filter(word => word.length === 5 && /^[A-Z]+$/.test(word));

    console.log(`Generated ${uniqueWords.length} unique 5-letter words from OpenAI`);
    return uniqueWords;

  } catch (error) {
    console.error('Failed to generate expanded words:', error);
    throw error;
  }
}