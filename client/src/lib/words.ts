// Comprehensive 5-letter words for validation (2000+ words)
export const VALID_WORDS = new Set([
  // Original words plus hundreds more
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
  'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
  'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE', 'AWARD',
  'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW',
  'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD',
  'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BREED',
  'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF',
  'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP',
  'CHECK', 'CHEST', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR',
  'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT',
  'COVER', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE',
  'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH',
  'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRILL',
  'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY',
  'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST',
  'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL',
  'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY',
  'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY',
  'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAND', 'GRANT', 'GRASS',
  'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE',
  'HAPPY', 'HARRY', 'HEART', 'HEAVY', 'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN',
  'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES',
  'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE',
  'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL',
  'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA',
  'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED',
  'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE',
  'MUSIC', 'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE',
  'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER',
  'PARTY', 'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH',
  'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE',
  'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUERY',
  'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM',
  'REBEL', 'REFER', 'RELAX', 'REPAY', 'REPLY', 'RIGHT', 'RIGID', 'RISKY', 'RIVER', 'ROBIN',
  'ROGER', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE',
  'SCORE', 'SENSE', 'SERVE', 'SETUP', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET',
  'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIDES',
  'SIGHT', 'SILLY', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL',
  'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE',
  'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'SQUAD', 'STAFF',
  'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STAYS', 'STEAL', 'STEAM', 'STEEL', 'STEEP',
  'STEER', 'STERN', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY',
  'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'SWIFT',
  'SWING', 'SWISS', 'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEARS', 'TEDDY', 'TEETH',
  'TERRY', 'TEXAS', 'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING',
  'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGHT', 'TIMER', 'TIMES',
  'TIRED', 'TITLE', 'TODAY', 'TOKEN', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE',
  'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TRULY', 'TRUNK',
  'TRUST', 'TRUTH', 'TWICE', 'TWIN', 'TWIST', 'TYLER', 'TYPE', 'UNCLE', 'UNDUE', 'UNION',
  'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO',
  'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE',
  'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE',
  'WORST', 'WORTH', 'WOULD', 'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOURS', 'YOUTH',
  // Additional hundreds of common 5-letter words
  'BADGE', 'BAGEL', 'BALLET', 'BANKS', 'BARNS', 'BATCH', 'BATHS', 'BEATS', 'BELLY', 'BENCH',
  'BIKES', 'BILLS', 'BIRDS', 'BLAST', 'BLEND', 'BLESS', 'BLINK', 'BLISS', 'BLITZ', 'BLOOM',
  'BLOWS', 'BLUES', 'BLUNT', 'BLUSH', 'BOATS', 'BOBBY', 'BONES', 'BONUS', 'BOOKS', 'BOOTS',
  'BOXES', 'BRASS', 'BRICK', 'BRIDE', 'BRIEF', 'BRINK', 'BRISK', 'BROKE', 'BROOK', 'BROWN',
  'BRUSH', 'BUILD', 'BULKS', 'BUMPS', 'BUNCH', 'BUNNY', 'BURNS', 'BURST', 'BUSES', 'BUYER',
  'CABIN', 'CAKES', 'CALLS', 'CAMEL', 'CANDY', 'CANES', 'CARDS', 'CARGO', 'CARRY', 'CASES',
  'CATCH', 'CAUSE', 'CAVES', 'CEDAR', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE',
  'CHEAP', 'CHEAT', 'CHECK', 'CHESS', 'CHEST', 'CHIEF', 'CHILD', 'CHILL', 'CHINA', 'CHIPS',
  'CHOSE', 'CHUNK', 'CIVIC', 'CLAIM', 'CLAMP', 'CLASH', 'CLASS', 'CLEAN', 'CLEAR', 'CLERK',
  'CLICK', 'CLIFF', 'CLIMB', 'CLING', 'CLOCK', 'CLOSE', 'CLOTH', 'CLOUD', 'CLUBS', 'CLUES',
  'COACH', 'COAST', 'CODES', 'COINS', 'COLOR', 'COMES', 'COMET', 'COMIC', 'CORAL', 'CORPS',
  'COSTS', 'COUCH', 'COUGH', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRACK', 'CRAFT', 'CRANE',
  'CRASH', 'CRAZY', 'CREAM', 'CREEK', 'CREEP', 'CRISP', 'CROPS', 'CROSS', 'CROWD', 'CROWN',
  'CRUDE', 'CRUSH', 'CURVE', 'CYCLE', 'CYBER', 'DADDY', 'DAILY', 'DAIRY', 'DAISY', 'DANCE',
  'DANDY', 'DARES', 'DATED', 'DEALS', 'DEALT', 'DEATH', 'DEBIT', 'DEBUT', 'DECKS', 'DELAY',
  'DELUX', 'DEMON', 'DENSE', 'DEPOT', 'DEPTH', 'DERBY', 'DESKS', 'DEVIL', 'DIARY', 'DICED',
  'DIGIT', 'DIMES', 'DINER', 'DIRTY', 'DISCO', 'DITCH', 'DIVED', 'DIVER', 'DIZZY', 'DOCKS',
  'DODGE', 'DOING', 'DOLLS', 'DOORS', 'DOSED', 'DOUBT', 'DOUGH', 'DOVES', 'DOWNS', 'DOZEN',
  'DRAFT', 'DRAIN', 'DRAKE', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRIED', 'DRIFT',
  'DRILL', 'DRINK', 'DRIVE', 'DRONE', 'DROVE', 'DRUMS', 'DRUNK', 'DUCKS', 'DUNES', 'DUSTY',
  'DUTCH', 'DYING', 'EAGER', 'EAGLE', 'EARLY', 'EARTH', 'EATER', 'EDGES', 'EGYPT', 'EIGHT',
  'ELDER', 'ELECT', 'ELITE', 'EMPTY', 'ENDED', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL',
  'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXAMS', 'EXCEL', 'EXIST', 'EXITS', 'EXTRA', 'FABLE',
  'FACED', 'FACTS', 'FADED', 'FAILS', 'FAINT', 'FAIRY', 'FAITH', 'FALLS', 'FALSE', 'FANCY',
  'FARMS', 'FATAL', 'FAULT', 'FAVOR', 'FEAST', 'FEELS', 'FENCE', 'FERRY', 'FETCH', 'FEVER',
  'FIBER', 'FIELD', 'FIFTY', 'FIGHT', 'FILES', 'FILLS', 'FILMS', 'FINAL', 'FINDS', 'FINES',
  'FINGER', 'FIRED', 'FIRMS', 'FIRST', 'FISHY', 'FIXED', 'FLAGS', 'FLAME', 'FLANK', 'FLASH',
  'FLASK', 'FLATS', 'FLEET', 'FLESH', 'FLIES', 'FLING', 'FLIPS', 'FLOAT', 'FLOCK', 'FLOOD',
  'FLOOR', 'FLOUR', 'FLOWS', 'FLUID', 'FLUSH', 'FOAMS', 'FOCUS', 'FOLKS', 'FONTS', 'FOODS',
  'FORCE', 'FORMS', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FOXES', 'FRAME', 'FRANK', 'FRAUD',
  'FREAK', 'FREED', 'FRESH', 'FRIED', 'FRONT', 'FROST', 'FRUIT', 'FUDGE', 'FULLY', 'FUNDS',
  'FUNNY', 'FUZZY', 'GAMES', 'GANGS', 'GATES', 'GEARS', 'GENES', 'GENUS', 'GHOST', 'GIANT',
  'GIFTS', 'GIRLS', 'GIVEN', 'GIVES', 'GLASS', 'GLOBE', 'GLOVE', 'GOALS', 'GOATS', 'GODLY',
  'GOING', 'GOODS', 'GRACE', 'GRADE', 'GRAIN', 'GRAND', 'GRANT', 'GRAPE', 'GRAPH', 'GRASP',
  'GRASS', 'GRAVE', 'GREAT', 'GREED', 'GREEN', 'GREET', 'GRIDS', 'GRIEF', 'GRILL', 'GRIND',
  'GRIPS', 'GROSS', 'GROUP', 'GROWN', 'GROWS', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'GUILD',
  'GUILT', 'GUITAR', 'HABIT', 'HALLS', 'HANDS', 'HANDY', 'HAPPY', 'HARSH', 'HASTE', 'HATED',
  'HAVEN', 'HEADS', 'HEALS', 'HEARD', 'HEART', 'HEAVY', 'HEDGE', 'HEELS', 'HELPS', 'HENCE',
  'HERBS', 'HERDS', 'HILLS', 'HINTS', 'HIRED', 'HOBBY', 'HOLDS', 'HOLES', 'HOLLY', 'HOMES',
  'HONEY', 'HOOKS', 'HOPES', 'HORNS', 'HORSE', 'HOSTS', 'HOTEL', 'HOURS', 'HOUSE', 'HOVER',
  'HUMAN', 'HUMOR', 'HURRY', 'HURTS', 'HYPER', 'ICONS', 'IDEAL', 'IDEAS', 'IDIOT', 'IMAGE',
  'IMPLY', 'INDEX', 'INDIA', 'INNER', 'INPUT', 'INSECT', 'INTEL', 'INTRO', 'IRISH', 'IRONS',
  'ISSUE', 'ITEMS', 'JEANS', 'JELLY', 'JEWEL', 'JOKES', 'JUDGE', 'JUICE', 'JUMBO', 'JUMPS',
  'JUNK', 'KEEPS', 'KICKS', 'KILLS', 'KINDS', 'KINGS', 'KNIFE', 'KNOCK', 'KNOTS', 'KNOWN',
  'KNOWS', 'LABEL', 'LABOR', 'LACKS', 'LAKES', 'LAMPS', 'LANDS', 'LANES', 'LARGE', 'LASER',
  'LASTS', 'LATER', 'LAUGH', 'LAYER', 'LEADS', 'LEAF', 'LEARN', 'LEASE', 'LEAST', 'LEAVE',
  'LEDGE', 'LEGAL', 'LEMON', 'LEVEL', 'LIFTS', 'LIGHT', 'LIKED', 'LIKES', 'LIMIT', 'LINES',
  'LINKS', 'LIONS', 'LISTS', 'LIVED', 'LIVER', 'LIVES', 'LOADS', 'LOANS', 'LOBBY', 'LOCAL',
  'LOCKS', 'LODGE', 'LOGIC', 'LOOKS', 'LOOPS', 'LOOSE', 'LORDS', 'LOVED', 'LOVER', 'LOVES',
  'LOWER', 'LOYAL', 'LUCKY', 'LUNCH', 'LUNGS', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MAKES',
  'MALES', 'MALLS', 'MANOR', 'MAPLE', 'MARCH', 'MARKS', 'MARSH', 'MASSA', 'MATCH', 'MATES',
  'MAYBE', 'MAYOR', 'MEALS', 'MEANS', 'MEANT', 'MEATS', 'MEDAL', 'MEDIA', 'MEETS', 'MELON',
  'MENUS', 'MERCY', 'MERGE', 'MERIT', 'MERRY', 'METAL', 'METER', 'METRO', 'MIDST', 'MIGHT',
  'MILES', 'MINDS', 'MINES', 'MINOR', 'MINUS', 'MIXED', 'MIXER', 'MODEL', 'MODES', 'MONEY',
  'MONKS', 'MONTH', 'MOOD', 'MORAL', 'MOTOR', 'MOULD', 'MOUND', 'MOUNT', 'MOUSE', 'MOUTH',
  'MOVED', 'MOVER', 'MOVES', 'MOVIE', 'MUDDY', 'MUSIC', 'MYTHS', 'NAILS', 'NAMES', 'NASTY',
  'NEEDS', 'NERVE', 'NESTS', 'NEVER', 'NEWLY', 'NIGHT', 'NINTH', 'NODES', 'NOISE', 'NORTH',
  'NOSES', 'NOTED', 'NOTES', 'NOVEL', 'NURSE', 'OATHS', 'OCEAN', 'OFFER', 'OFTEN', 'OLDER',
  'OLIVE', 'OPENS', 'OPERA', 'ORDER', 'ORGAN', 'OTHER', 'OUGHT', 'OUNCE', 'OUTER', 'OWNED',
  'OWNER', 'PACED', 'PACKS', 'PAGES', 'PAID', 'PAINS', 'PAINT', 'PAIRS', 'PALMS', 'PANEL',
  'PANIC', 'PANTS', 'PAPER', 'PARKS', 'PARTS', 'PARTY', 'PASTA', 'PASTE', 'PATCH', 'PATHS',
  'PAUSE', 'PEACE', 'PEAKS', 'PEARS', 'PENNY', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PICKS',
  'PIECE', 'PILES', 'PILLS', 'PILOT', 'PINCH', 'PIPES', 'PITCH', 'PIZZA', 'PLACE', 'PLAIN',
  'PLANE', 'PLANT', 'PLATE', 'PLAYS', 'PLAZA', 'PLOTS', 'POEMS', 'POINT', 'POLAR', 'POLES',
  'POOLS', 'PORTS', 'POSED', 'POSTS', 'POUND', 'POURS', 'POWER', 'PRESS', 'PRICE', 'PRIDE',
  'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROPS', 'PROUD', 'PROVE', 'PULLS', 'PUMPS',
  'PUNCH', 'PUPIL', 'QUEEN', 'QUERY', 'QUEST', 'QUICK', 'QUIET', 'QUITE', 'QUOTE', 'RACES',
  'RADIO', 'RAILS', 'RAINS', 'RAISE', 'RALLY', 'RANCH', 'RANGE', 'RANKS', 'RAPID', 'RATES',
  'RATIO', 'REACH', 'READS', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'RELAY', 'REMIX',
  'RENEW', 'REPAY', 'REPLY', 'RESET', 'RIDES', 'RIGHT', 'RIGID', 'RINGS', 'RISKS', 'RISKY',
  'RIVAL', 'RIVER', 'ROADS', 'ROAST', 'ROBOT', 'ROCKS', 'ROCKY', 'ROLES', 'ROLLS', 'ROMAN',
  'ROOMS', 'ROOTS', 'ROPES', 'ROSES', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RUGBY', 'RULES',
  'RURAL', 'SAFER', 'SALES', 'SALON', 'SANDY', 'SAUCE', 'SAVED', 'SAVES', 'SCALE', 'SCARE',
  'SCENE', 'SCOPE', 'SCORE', 'SCOTS', 'SCRUB', 'SEATS', 'SEEDS', 'SEEMS', 'SELLS', 'SENDS',
  'SENSE', 'SERVE', 'SETUP', 'SEVEN', 'SHADE', 'SHAKE', 'SHALL', 'SHAME', 'SHAPE', 'SHARE',
  'SHARK', 'SHARP', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIPS', 'SHIRT', 'SHOCK', 'SHOES',
  'SHOOT', 'SHOPS', 'SHORT', 'SHOTS', 'SHOWS', 'SHUTS', 'SIDED', 'SIDES', 'SIGHT', 'SIGNS',
  'SILLY', 'SINCE', 'SINGS', 'SINKS', 'SITES', 'SIXTH', 'SIXTY', 'SIZES', 'SKILL', 'SKINS',
  'SKULL', 'SLEEP', 'SLIDE', 'SLIPS', 'SLOPE', 'SLOTS', 'SMALL', 'SMART', 'SMELL', 'SMILE',
  'SMOKE', 'SNAKE', 'SNAPS', 'SNOW', 'SOCKS', 'SOLAR', 'SOLID', 'SOLVE', 'SONGS', 'SORRY',
  'SORTS', 'SOULS', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPARK', 'SPEAK', 'SPECS', 'SPEED',
  'SPELL', 'SPEND', 'SPENT', 'SPINE', 'SPLIT', 'SPOKE', 'SPORT', 'SPOTS', 'SPRAY', 'SQUAD',
  'STAFF', 'STAGE', 'STAIN', 'STAKE', 'STAND', 'STARE', 'START', 'STATE', 'STAYS', 'STEAD',
  'STEAL', 'STEAM', 'STEEL', 'STEEP', 'STEER', 'STEMS', 'STEPS', 'STERN', 'STICK', 'STILL',
  'STING', 'STINK', 'STOCK', 'STONE', 'STOOD', 'STOPS', 'STORE', 'STORM', 'STORY', 'STRIP',
  'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUITS', 'SUNNY', 'SUPER', 'SWEET',
  'SWEPT', 'SWIFT', 'SWING', 'SWISS', 'SWORD', 'TABLE', 'TAKES', 'TALES', 'TALKS', 'TANKS',
  'TAPES', 'TASKS', 'TASTE', 'TAXES', 'TEACH', 'TEAMS', 'TEARS', 'TEETH', 'TELLS', 'TENDS',
  'TERMS', 'TESTS', 'TEXAS', 'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK',
  'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIDAL', 'TIGER',
  'TIGHT', 'TILES', 'TIMER', 'TIMES', 'TIRED', 'TITLE', 'TODAY', 'TOKEN', 'TOMBS', 'TOOLS',
  'TOOTH', 'TOPS', 'TOTAL', 'TOUCH', 'TOUGH', 'TOURS', 'TOWER', 'TOWNS', 'TOYS', 'TRACK',
  'TRADE', 'TRAIL', 'TRAIN', 'TRASH', 'TREAT', 'TREES', 'TREND', 'TRIAL', 'TRIBE', 'TRICK',
  'TRIED', 'TRIES', 'TRIPS', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TUBES', 'TUNES',
  'TURNS', 'TWICE', 'TWINS', 'TWIST', 'TYPED', 'TYPES', 'UNCLE', 'UNDER', 'UNDUE', 'UNION',
  'UNITE', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'URGED', 'USAGE', 'USERS', 'USING',
  'USUAL', 'VALID', 'VALUE', 'VALVE', 'VENUE', 'VIDEO', 'VIEWS', 'VINYL', 'VIRUS', 'VISIT',
  'VITAL', 'VOCAL', 'VOICE', 'WAGES', 'WAIST', 'WAITS', 'WALKS', 'WALLS', 'WANTS', 'WARDS',
  'WARMS', 'WARNS', 'WASTE', 'WATCH', 'WATER', 'WAVES', 'WEARY', 'WEEDS', 'WEEKS', 'WELLS',
  'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHIPS', 'WHITE', 'WHOLE', 'WHOSE', 'WIDER', 'WILDS',
  'WINDS', 'WINES', 'WINGS', 'WINKS', 'WIPES', 'WIRED', 'WIRES', 'WISELY', 'WITCH', 'WOMAN',
  'WOMEN', 'WOODS', 'WORDS', 'WORKS', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD',
  'WOVEN', 'WRAPS', 'WRITE', 'WRONG', 'WROTE', 'YARDS', 'YEARS', 'YIELD', 'YOUNG', 'YOURS',
  'YOUTH', 'ZONES'
]);

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
