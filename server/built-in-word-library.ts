// Comprehensive built-in English word library for Wordle
// This provides a broad vocabulary without requiring OpenAI API calls

export const EXPANDED_WORD_LIBRARY = {
  // Common everyday words (200 words)
  common: [
    'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
    'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
    'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
    'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE', 'AWARD',
    'AWARE', 'BADLY', 'BAKER', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BENCH',
    'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOOST', 'BOOTH',
    'BOUND', 'BRAIN', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING',
    'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CARRY', 'CATCH', 'CAUSE',
    'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHILD',
    'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK',
    'CLOSE', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH',
    'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE', 'DAILY',
    'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN',
    'DRAFT', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE',
    'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER',
    'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE',
    'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH',
    'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME',
    'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS',
    'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN'
  ],

  // Intermediate challenge words (200 words)
  intermediate: [
    'ABBEY', 'ABODE', 'ACHED', 'ACRES', 'ADAPT', 'AFIRE', 'AGING', 'AGLOW', 'AIMED', 'AISLE',
    'ALBUM', 'AMBER', 'AMEND', 'AMPLE', 'ANKLE', 'ANTIC', 'APHID', 'APPLE', 'APRON', 'ARBOR',
    'ARMOR', 'AROMA', 'ARROW', 'ASCOT', 'ASHES', 'ASIDE', 'ATLAS', 'ATTIC', 'AUDIO', 'AWASH',
    'BADGE', 'BADLY', 'BAGEL', 'BAKER', 'BANJO', 'BARGE', 'BARON', 'BASIC', 'BATCH', 'BATHE',
    'BEACH', 'BEARD', 'BEAST', 'BEGAN', 'BELLY', 'BENCH', 'BERRY', 'BIRCH', 'BIRTH', 'BLEND',
    'BLINK', 'BLOCK', 'BLOOM', 'BLOWN', 'BLUNT', 'BLUSH', 'BOARD', 'BOAST', 'BOOST', 'BOOTH',
    'BOXER', 'BRAKE', 'BRAND', 'BRAVE', 'BREAD', 'BREED', 'BRICK', 'BRIDE', 'BRIEF', 'BRING',
    'BRINK', 'BROAD', 'BROKE', 'BROOK', 'BROWN', 'BRUSH', 'BULKY', 'BUNCH', 'BURST', 'BUYER',
    'CABIN', 'CABLE', 'CAMEL', 'CANDY', 'CARGO', 'CARRY', 'CARVE', 'CATCH', 'CAUSE', 'CEDAR',
    'CHAIN', 'CHAIR', 'CHAMP', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHEAT', 'CHECK',
    'CHESS', 'CHEST', 'CHIEF', 'CHILD', 'CHILL', 'CHINA', 'CHIPS', 'CHOSE', 'CHUNK', 'CIVIC',
    'CLAIM', 'CLAMP', 'CLASH', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB',
    'CLING', 'CLOCK', 'CLOSE', 'CLOTH', 'CLOUD', 'CLUBS', 'CLUES', 'COACH', 'COAST', 'CORAL',
    'CORPS', 'COSTS', 'COUCH', 'COUGH', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT',
    'CRANE', 'CRASH', 'CRAZY', 'CREAM', 'CREEK', 'CREEP', 'CRISP', 'CROPS', 'CROSS', 'CROWD',
    'CROWN', 'CRUDE', 'CRUSH', 'CURVE', 'CYBER', 'DADDY', 'DAILY', 'DAIRY', 'DAISY', 'DANCE',
    'DANDY', 'DARES', 'DATED', 'DEALS', 'DEALT', 'DEATH', 'DEBIT', 'DEBUT', 'DECKS', 'DELAY',
    'DEMON', 'DENSE', 'DEPOT', 'DEPTH', 'DERBY', 'DESKS', 'DEVIL', 'DIARY', 'DICED', 'DIGIT',
    'DIMES', 'DINER', 'DIRTY', 'DISCO', 'DITCH', 'DIVED', 'DIVER', 'DIZZY', 'DOCKS', 'DODGE',
    'DOLLS', 'DOORS', 'DOSED', 'DOUBT', 'DOUGH', 'DOVES', 'DOWNS', 'DOZEN', 'DRAFT', 'DRAIN'
  ],

  // Advanced sophisticated words (150 words)
  advanced: [
    'ABASH', 'ABHOR', 'ABODE', 'ABRUPT', 'ACUTE', 'ADEPT', 'AFFIX', 'AGILE', 'ALIEN', 'ALOFT',
    'AMAZE', 'AMBER', 'AMEND', 'AMPLE', 'ANGST', 'ANTIC', 'ARDOR', 'ARRAY', 'ARTSY', 'ASCOT',
    'ATLAS', 'ATTIC', 'AUDIO', 'AUDIT', 'AVAIL', 'AWASH', 'AZURE', 'BADGE', 'BANJO', 'BARON',
    'BATCH', 'BATHE', 'BAYOU', 'BEARD', 'BELLY', 'BERTH', 'BIGOT', 'BIRCH', 'BISON', 'BLAND',
    'BLAZE', 'BLEAK', 'BLEND', 'BLIMP', 'BLINK', 'BLISS', 'BLITZ', 'BLOAT', 'BLOOM', 'BLUFF',
    'BLUNT', 'BLURT', 'BLUSH', 'BOGUS', 'BOOZE', 'BOTCH', 'BOUGH', 'BOXER', 'BRACE', 'BRAID',
    'BRAKE', 'BRAND', 'BRASS', 'BRAVO', 'BREAD', 'BREED', 'BREWS', 'BRICK', 'BRIDE', 'BRIEF',
    'BRINK', 'BRISK', 'BROAD', 'BROIL', 'BROKE', 'BROOK', 'BROOM', 'BROWN', 'BRUNT', 'BRUSH',
    'BRUTE', 'BUDDY', 'BUDGE', 'BULGE', 'BULKY', 'BUMPY', 'BUNCH', 'BUNNY', 'BURNT', 'BURST',
    'BUYER', 'BUZZ', 'CADET', 'CALVE', 'CAMEL', 'CANDY', 'CANNY', 'CANON', 'CARGO', 'CARVE',
    'CATCH', 'CAULK', 'CAUSE', 'CAVIL', 'CEDAR', 'CHAFE', 'CHAIN', 'CHAIR', 'CHAMP', 'CHAOS',
    'CHARD', 'CHARM', 'CHART', 'CHASE', 'CHASM', 'CHEAP', 'CHEAT', 'CHECK', 'CHEEK', 'CHESS',
    'CHEST', 'CHIDE', 'CHIEF', 'CHILD', 'CHILL', 'CHIMP', 'CHINA', 'CHIRP', 'CHIVE', 'CHOIR',
    'CHORD', 'CHORE', 'CHOSE', 'CHUCK', 'CHUMP', 'CHUNK', 'CHURN', 'CHUTE', 'CIDER', 'CIGAR'
  ],

  // Category-specific words
  categories: {
    animals: [
      'TIGER', 'HORSE', 'SHEEP', 'WHALE', 'SHARK', 'EAGLE', 'MOUSE', 'SNAKE', 'ZEBRA', 'KOALA',
      'PANDA', 'LLAMA', 'SLOTH', 'OTTER', 'BEAVER', 'CAMEL', 'HYENA', 'GECKO', 'CORAL', 'SQUID',
      'FINCH', 'ROBIN', 'CRANE', 'HERON', 'GOOSE', 'DUCK', 'SWAN', 'MOOSE', 'BISON', 'DEER'
    ],
    nature: [
      'OCEAN', 'RIVER', 'BEACH', 'FIELD', 'WOODS', 'STONE', 'CLOUD', 'STORM', 'GRASS', 'WATER',
      'EARTH', 'WINDS', 'WAVES', 'BLOOM', 'FRESH', 'SUNNY', 'MISTY', 'FOGGY', 'DUSTY', 'ROCKY',
      'LEAFY', 'MOSSY', 'SANDY', 'MUDDY', 'SNOWY', 'FERNS', 'OAKS', 'PINES', 'MAPLE', 'BIRCH'
    ],
    food: [
      'BREAD', 'APPLE', 'GRAPE', 'LEMON', 'PEACH', 'MANGO', 'PIZZA', 'PASTA', 'SALAD', 'HONEY',
      'SUGAR', 'SPICE', 'HERBS', 'BEANS', 'GRAIN', 'WHEAT', 'RICE', 'CORN', 'ONION', 'TOMATO',
      'CARROT', 'BEETS', 'RADISH', 'CELERY', 'CHARD', 'KALE', 'SPINACH', 'LETTUCE', 'CHEESE', 'YOGURT'
    ],
    emotions: [
      'HAPPY', 'BRAVE', 'PROUD', 'LOVED', 'EAGER', 'MERRY', 'SWEET', 'SMILE', 'PEACE', 'GRACE',
      'CHARM', 'TRUST', 'PRIDE', 'DREAM', 'HOPES', 'BLISS', 'CHEER', 'ANGER', 'GRIEF', 'WORRY',
      'FEARS', 'DOUBT', 'SHAME', 'GUILT', 'ENVY', 'SPITE', 'SCORN', 'DREAD', 'PANIC', 'GLOOM'
    ],
    actions: [
      'DANCE', 'CLIMB', 'WRITE', 'PAINT', 'BUILD', 'LEARN', 'TEACH', 'LAUGH', 'REACH', 'SWIFT',
      'SPEED', 'FLASH', 'SPARK', 'SHINE', 'GLIDE', 'DRIFT', 'FLOAT', 'SWING', 'SLIDE', 'TWIST',
      'SHAKE', 'SHOUT', 'WHISPER', 'CRAWL', 'MARCH', 'STOMP', 'CREEP', 'SNEAK', 'PROWL', 'ROAM'
    ],
    objects: [
      'CHAIR', 'TABLE', 'BOOKS', 'PHONE', 'WATCH', 'LIGHT', 'MUSIC', 'GLASS', 'PAPER', 'TOOLS',
      'KNIFE', 'SPOON', 'PLATE', 'BOWL', 'VASE', 'FRAME', 'MIRROR', 'CLOCK', 'RADIO', 'PIANO',
      'BRUSH', 'COMB', 'TOWEL', 'SHIRT', 'PANTS', 'SHOES', 'SOCKS', 'GLOVES', 'SCARF', 'BADGE'
    ]
  }
};

// Get all words from the expanded library
export function getAllBuiltInWords(): string[] {
  const allWords = [
    ...EXPANDED_WORD_LIBRARY.common,
    ...EXPANDED_WORD_LIBRARY.intermediate,
    ...EXPANDED_WORD_LIBRARY.advanced,
    ...Object.values(EXPANDED_WORD_LIBRARY.categories).flat()
  ];

  // Remove duplicates and ensure all are uppercase 5-letter words
  const uniqueWords = Array.from(new Set(allWords))
    .map(word => word.toUpperCase())
    .filter(word => word.length === 5 && /^[A-Z]+$/.test(word));

  return uniqueWords;
}

// Get words by difficulty level
export function getWordsByDifficulty(difficulty: 'common' | 'intermediate' | 'advanced'): string[] {
  return EXPANDED_WORD_LIBRARY[difficulty].map(word => word.toUpperCase());
}

// Get words by category
export function getWordsByCategory(category: keyof typeof EXPANDED_WORD_LIBRARY.categories): string[] {
  return EXPANDED_WORD_LIBRARY.categories[category].map(word => word.toUpperCase());
}

// Get random word from expanded library
export function getRandomExpandedWord(): string {
  const allWords = getAllBuiltInWords();
  return allWords[Math.floor(Math.random() * allWords.length)];
}