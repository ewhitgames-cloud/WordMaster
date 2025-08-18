import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Coins, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdManager } from "./ad-manager";

export interface Font {
  id: string;
  name: string;
  family: string;
  fallback: string;
  price: number;
  category: 'serif' | 'sans' | 'mono' | 'playful' | 'fun';
  googleFont?: string;
}

export interface ColorOption {
  id: string;
  name: string;
  value: string;
  price: number;
}

export interface BackgroundOption {
  id: string;
  name: string;
  value: string;
  type: 'gradient' | 'solid' | 'pattern';
  price: number;
}

const AVAILABLE_FONTS: Font[] = [
  {
    id: 'default',
    name: 'Classic',
    family: 'Inter',
    fallback: 'system-ui, sans-serif',
    price: 0,
    category: 'sans'
  },
  // Serif fonts
  {
    id: 'playfair',
    name: 'Elegant',
    family: 'Playfair Display',
    fallback: 'Georgia, serif',
    price: 1500,
    category: 'serif',
    googleFont: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap'
  },
  {
    id: 'merriweather',
    name: 'Reader',
    family: 'Merriweather',
    fallback: 'Times, serif',
    price: 1200,
    category: 'serif',
    googleFont: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap'
  },
  {
    id: 'roboto-slab',
    name: 'Strong',
    family: 'Roboto Slab',
    fallback: 'Georgia, serif',
    price: 1800,
    category: 'serif',
    googleFont: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;700&display=swap'
  },
  {
    id: 'crimson-text',
    name: 'Literary',
    family: 'Crimson Text',
    fallback: 'Times, serif',
    price: 1600,
    category: 'serif',
    googleFont: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap'
  },
  // Sans fonts
  {
    id: 'poppins',
    name: 'Modern',
    family: 'Poppins',
    fallback: 'Arial, sans-serif',
    price: 1400,
    category: 'sans',
    googleFont: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap'
  },
  {
    id: 'space-grotesk',
    name: 'Futuristic',
    family: 'Space Grotesk',
    fallback: 'Arial, sans-serif',
    price: 2200,
    category: 'sans',
    googleFont: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap'
  },
  {
    id: 'nunito',
    name: 'Friendly',
    family: 'Nunito',
    fallback: 'Arial, sans-serif',
    price: 1300,
    category: 'sans',
    googleFont: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap'
  },
  {
    id: 'montserrat',
    name: 'Clean',
    family: 'Montserrat',
    fallback: 'Arial, sans-serif',
    price: 1500,
    category: 'sans',
    googleFont: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap'
  },
  // Mono fonts
  {
    id: 'fira-code',
    name: 'Code Style',
    family: 'Fira Code',
    fallback: 'Monaco, monospace',
    price: 1700,
    category: 'mono',
    googleFont: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500&display=swap'
  },
  {
    id: 'jetbrains-mono',
    name: 'Terminal',
    family: 'JetBrains Mono',
    fallback: 'Courier, monospace',
    price: 1900,
    category: 'mono',
    googleFont: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap'
  },
  {
    id: 'source-code-pro',
    name: 'Developer',
    family: 'Source Code Pro',
    fallback: 'Courier, monospace',
    price: 1600,
    category: 'mono',
    googleFont: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500&display=swap'
  },
  // Playful fonts
  {
    id: 'comfortaa',
    name: 'Rounded',
    family: 'Comfortaa',
    fallback: 'Arial, sans-serif',
    price: 2000,
    category: 'playful',
    googleFont: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600&display=swap'
  },
  {
    id: 'fredoka',
    name: 'Bubbly',
    family: 'Fredoka',
    fallback: 'Arial, sans-serif',
    price: 2300,
    category: 'playful',
    googleFont: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600&display=swap'
  },
  {
    id: 'quicksand',
    name: 'Smooth',
    family: 'Quicksand',
    fallback: 'Arial, sans-serif',
    price: 1800,
    category: 'playful',
    googleFont: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap'
  },
  // Fun fonts
  {
    id: 'bangers',
    name: 'Comic Book',
    family: 'Bangers',
    fallback: 'Arial, sans-serif',
    price: 3200,
    category: 'fun',
    googleFont: 'https://fonts.googleapis.com/css2?family=Bangers&display=swap'
  },
  {
    id: 'luckiest-guy',
    name: 'Bold Fun',
    family: 'Luckiest Guy',
    fallback: 'Arial, sans-serif',
    price: 3000,
    category: 'fun',
    googleFont: 'https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap'
  },
  {
    id: 'amatic-sc',
    name: 'Hand Drawn',
    family: 'Amatic SC',
    fallback: 'Arial, sans-serif',
    price: 2800,
    category: 'fun',
    googleFont: 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap'
  },
  {
    id: 'bungee',
    name: 'Street Art',
    family: 'Bungee',
    fallback: 'Arial, sans-serif',
    price: 3500,
    category: 'fun',
    googleFont: 'https://fonts.googleapis.com/css2?family=Bungee&display=swap'
  },
  {
    id: 'creepster',
    name: 'Spooky',
    family: 'Creepster',
    fallback: 'Arial, sans-serif',
    price: 4000,
    category: 'fun',
    googleFont: 'https://fonts.googleapis.com/css2?family=Creepster&display=swap'
  },
  {
    id: 'kalam',
    name: 'Handwriting',
    family: 'Kalam',
    fallback: 'Arial, sans-serif',
    price: 2500,
    category: 'fun',
    googleFont: 'https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap'
  }
];

const AVAILABLE_COLORS: ColorOption[] = [
  { id: 'default', name: 'Black', value: '#000000', price: 0 },
  { id: 'white', name: 'White', value: '#ffffff', price: 1000 },
  { id: 'yellow', name: 'Sunny Yellow', value: '#fbbf24', price: 1200 },
  { id: 'purple', name: 'Royal Purple', value: '#8b5cf6', price: 1600 },
  { id: 'cyan', name: 'Electric Cyan', value: '#06b6d4', price: 1600 },
  { id: 'red', name: 'Crimson Red', value: '#ef4444', price: 1400 },
  { id: 'green', name: 'Forest Green', value: '#10b981', price: 1400 },
  { id: 'orange', name: 'Sunset Orange', value: '#f97316', price: 1300 },
  { id: 'pink', name: 'Hot Pink', value: '#ec4899', price: 1800 },
  { id: 'blue', name: 'Ocean Blue', value: '#3b82f6', price: 1500 },
  { id: 'gold', name: 'Golden', value: '#d97706', price: 2400 },
  { id: 'silver', name: 'Silver', value: '#6b7280', price: 2200 }
];

const AVAILABLE_BACKGROUNDS: BackgroundOption[] = [
  { id: 'default', name: 'Classic', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', type: 'gradient', price: 0 },
  // Solid backgrounds
  { id: 'midnight', name: 'Midnight Black', value: '#1a1a2e', type: 'solid', price: 1500 },
  { id: 'ocean', name: 'Deep Ocean', value: '#0f3460', type: 'solid', price: 1800 },
  { id: 'forest', name: 'Forest Night', value: '#16423c', type: 'solid', price: 1600 },
  { id: 'wine', name: 'Wine Red', value: '#722f37', type: 'solid', price: 2000 },
  // Gradient backgrounds
  { id: 'sunset', name: 'Sunset Paradise', value: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 50%, #ff5722 100%)', type: 'gradient', price: 2500 },
  { id: 'aurora', name: 'Aurora Borealis', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)', type: 'gradient', price: 3500 },
  { id: 'galaxy', name: 'Galaxy Dreams', value: 'linear-gradient(135deg, #000051 0%, #1e0845 25%, #5b2c6f 50%, #a17c6b 75%, #c9b037 100%)', type: 'gradient', price: 4000 },
  { id: 'rainbow', name: 'Rainbow Burst', value: 'linear-gradient(135deg, #ff0000 0%, #ff8c00 14%, #ffd700 28%, #adff2f 42%, #00ff7f 57%, #00bfff 71%, #8a2be2 85%, #ff1493 100%)', type: 'gradient', price: 5000 },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', value: 'linear-gradient(135deg, #0f0f23 0%, #ff006e 25%, #8338ec 50%, #3a86ff 75%, #06ffa5 100%)', type: 'gradient', price: 4500 },
  { id: 'pastel', name: 'Pastel Dreams', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #ffecd2 50%, #c3cfe2 75%, #a8e6cf 100%)', type: 'gradient', price: 3000 },
  { id: 'fire', name: 'Fire Blaze', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #ff6b6b 75%, #ff4757 100%)', type: 'gradient', price: 3800 },
  { id: 'ice', name: 'Ice Crystal', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 25%, #d299c2 50%, #fef9d7 75%, #84fab0 100%)', type: 'gradient', price: 3200 }
];

interface FontStoreState {
  coins: number;
  ownedFonts: string[];
  equippedFont: string;
  ownedColors: string[];
  equippedColor: string;
  ownedBackgrounds: string[];
  equippedBackground: string;
}

const DEFAULT_STATE: FontStoreState = {
  coins: 1500, // Start with enough to buy some fonts and colors
  ownedFonts: ['default'],
  equippedFont: 'default',
  ownedColors: ['default'],
  equippedColor: 'default',
  ownedBackgrounds: ['default'],
  equippedBackground: 'default'
};

interface FontStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FontStoreModal({ isOpen, onClose }: FontStoreModalProps) {
  const { toast } = useToast();
  const [state, setState] = useState<FontStoreState>(DEFAULT_STATE);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set(['default']));
  const [activeTab, setActiveTab] = useState<'fonts' | 'colors' | 'backgrounds'>('fonts');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load state from localStorage on mount and preload fonts
  useEffect(() => {
    const savedState = localStorage.getItem('wordpop-font-store');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState({ ...DEFAULT_STATE, ...parsed });
      } catch (error) {
        console.error('Error loading font store state:', error);
      }
    }

    // Preload all Google Fonts when modal opens
    if (isOpen) {
      AVAILABLE_FONTS.forEach(font => {
        if (font.googleFont) {
          loadFont(font);
        }
      });
    }
  }, [isOpen]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wordpop-font-store', JSON.stringify(state));
  }, [state]);

  // Apply equipped font and color to game elements
  useEffect(() => {
    const font = AVAILABLE_FONTS.find(f => f.id === state.equippedFont);
    const color = AVAILABLE_COLORS.find(c => c.id === state.equippedColor);
    if (font && color) {
      applyStyles(font, color);
      // Emit global event for other modules
      window.dispatchEvent(new CustomEvent('stylesChanged', { detail: { font, color } }));
    }
  }, [state.equippedFont, state.equippedColor]);

  // Load Google Fonts when needed
  const loadFont = async (font: Font) => {
    if (loadedFonts.has(font.id) || !font.googleFont) {
      return;
    }

    try {
      // Check if font link already exists
      const existingLink = document.querySelector(`link[href="${font.googleFont}"]`);
      if (existingLink) {
        setLoadedFonts(prev => new Set(Array.from(prev).concat(font.id)));
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = font.googleFont;
      link.onload = () => {
        setLoadedFonts(prev => new Set(Array.from(prev).concat(font.id)));
      };
      document.head.appendChild(link);
      
      // Wait for font to load with timeout
      const fontLoadPromise = document.fonts.load(`16px "${font.family}"`);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Font load timeout')), 3000)
      );
      
      await Promise.race([fontLoadPromise, timeoutPromise]);
    } catch (error) {
      console.error(`Failed to load font ${font.name}:`, error);
      // Still mark as loaded to show fallback
      setLoadedFonts(prev => new Set(Array.from(prev).concat(font.id)));
    }
  };

  // Apply font and color to game elements
  const applyStyles = (font?: Font, color?: ColorOption) => {
    const currentFont = font || AVAILABLE_FONTS.find(f => f.id === state.equippedFont);
    const currentColor = color || AVAILABLE_COLORS.find(c => c.id === state.equippedColor);
    
    if (!currentFont || !currentColor) return;
    
    const fontStack = `"${currentFont.family}", ${currentFont.fallback}`;
    const colorValue = currentColor.value;
    
    const style = document.getElementById('dynamic-font-style') || document.createElement('style');
    style.id = 'dynamic-font-style';
    
    style.textContent = `
      /* Game tiles - font and structure */
      .tile,
      .tile-correct,
      .tile-present, 
      .tile-absent,
      .tile-current,
      .tile-empty,
      [data-testid*="tile"] {
        font-family: ${fontStack} !important;
      }
      
      /* Game tiles - text color with outline */
      .tile *,
      .tile-correct *,
      .tile-present *,
      .tile-absent *,
      .tile-current *,
      .tile-empty *,
      [data-testid*="tile"] * {
        color: ${colorValue} !important;
        font-family: ${fontStack} !important;
        text-shadow: 
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 -1px 0 #000,
          0 1px 0 #000,
          -1px 0 0 #000,
          1px 0 0 #000 !important;
      }
      
      /* Keyboard keys - font and structure */
      .keyboard-key,
      .keyboard-key-default,
      .keyboard-key-correct,
      .keyboard-key-present,
      .keyboard-key-absent,
      .keyboard-key-special,
      [data-testid*="key"] {
        font-family: ${fontStack} !important;
      }
      
      /* Keyboard keys - text color with outline */
      .keyboard-key *,
      .keyboard-key-default *,
      .keyboard-key-correct *,
      .keyboard-key-present *,
      .keyboard-key-absent *,
      .keyboard-key-special *,
      [data-testid*="key"] * {
        color: ${colorValue} !important;
        font-family: ${fontStack} !important;
        text-shadow: 
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 -1px 0 #000,
          0 1px 0 #000,
          -1px 0 0 #000,
          1px 0 0 #000 !important;
      }
    `;
    
    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
  };

  const buyFont = async (font: Font) => {
    if (state.coins < font.price) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${font.price} coins but only have ${state.coins}.`,
        variant: "destructive"
      });
      return;
    }

    // Load font if needed
    await loadFont(font);

    setState(prev => ({
      ...prev,
      coins: prev.coins - font.price,
      ownedFonts: [...prev.ownedFonts, font.id]
    }));

    toast({
      title: "Font Purchased!",
      description: `${font.name} has been added to your collection.`,
    });
  };

  const equipFont = async (font: Font) => {
    // Load font if needed
    await loadFont(font);

    setState(prev => ({
      ...prev,
      equippedFont: font.id
    }));

    // Apply the new font styles immediately
    applyStyles(font);

    toast({
      title: "Font Equipped!",
      description: `${font.name} is now active.`,
    });
  };

  const buyColor = (color: ColorOption) => {
    if (state.coins < color.price) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${color.price} coins but only have ${state.coins}.`,
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({
      ...prev,
      coins: prev.coins - color.price,
      ownedColors: [...prev.ownedColors, color.id]
    }));

    toast({
      title: "Color Purchased!",
      description: `${color.name} has been added to your collection.`,
    });
  };

  const equipColor = (color: ColorOption) => {
    setState(prev => ({
      ...prev,
      equippedColor: color.id
    }));

    // Apply the new color styles immediately
    applyStyles(undefined, color);

    toast({
      title: "Color Equipped!",
      description: `${color.name} is now active.`,
    });
  };

  const getButtonState = (font: Font) => {
    const isOwned = state.ownedFonts.includes(font.id);
    const isEquipped = state.equippedFont === font.id;

    if (isEquipped) return { text: 'Equipped', disabled: true, variant: 'secondary' as const };
    if (isOwned) return { text: 'Equip', disabled: false, variant: 'default' as const };
    return { text: `Buy (${font.price})`, disabled: state.coins < font.price, variant: 'default' as const };
  };

  const getColorButtonState = (color: ColorOption) => {
    const isOwned = state.ownedColors.includes(color.id);
    const isEquipped = state.equippedColor === color.id;

    if (isEquipped) return { text: 'Equipped', disabled: true, variant: 'secondary' as const };
    if (isOwned) return { text: 'Equip', disabled: false, variant: 'default' as const };
    return { text: `Buy (${color.price})`, disabled: state.coins < color.price, variant: 'default' as const };
  };

  const buyBackground = (background: BackgroundOption) => {
    if (state.coins < background.price) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${background.price} coins but only have ${state.coins}.`,
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({
      ...prev,
      coins: prev.coins - background.price,
      ownedBackgrounds: [...prev.ownedBackgrounds, background.id]
    }));

    toast({
      title: "Background Purchased!",
      description: `${background.name} has been added to your collection.`,
    });
  };

  const equipBackground = (background: BackgroundOption) => {
    setState(prev => ({
      ...prev,
      equippedBackground: background.id
    }));

    toast({
      title: "Background Equipped!",
      description: `${background.name} is now active.`,
    });
  };

  const getBackgroundButtonState = (background: BackgroundOption) => {
    const isOwned = state.ownedBackgrounds.includes(background.id);
    const isEquipped = state.equippedBackground === background.id;

    if (isEquipped) return { text: 'Equipped', disabled: true, variant: 'secondary' as const };
    if (isOwned) return { text: 'Equip', disabled: false, variant: 'default' as const };
    return { text: `Buy (${background.price})`, disabled: state.coins < background.price, variant: 'default' as const };
  };

  const handleFontAction = (font: Font) => {
    const isOwned = state.ownedFonts.includes(font.id);
    if (isOwned) {
      equipFont(font);
    } else {
      buyFont(font);
    }
  };

  const handleColorAction = (color: ColorOption) => {
    const isOwned = state.ownedColors.includes(color.id);
    if (isOwned) {
      equipColor(color);
    } else {
      buyColor(color);
    }
  };

  const handleBackgroundAction = (background: BackgroundOption) => {
    const isOwned = state.ownedBackgrounds.includes(background.id);
    if (isOwned) {
      equipBackground(background);
    } else {
      buyBackground(background);
    }
  };

  const filteredFonts = selectedCategory === 'all' 
    ? AVAILABLE_FONTS 
    : AVAILABLE_FONTS.filter(font => font.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Fonts' },
    { id: 'sans', name: 'Sans Serif' },
    { id: 'serif', name: 'Serif' },
    { id: 'mono', name: 'Monospace' },
    { id: 'playful', name: 'Playful' },
    { id: 'fun', name: 'Fun Fonts' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Style Store</DialogTitle>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
              <Coins className="w-4 h-4" />
              <span className="font-bold">{state.coins}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Customize your game with fonts and colors. Buy once, equip anytime!
          </p>
        </DialogHeader>

        {/* Ad Banner for Free Coins */}
        <AdManager
          onCoinsEarned={(coins) => {
            setState(prev => ({ ...prev, coins: prev.coins + coins }));
          }}
          variant="store"
          className="mb-4"
        />

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mt-4">
          <Button
            variant={activeTab === 'fonts' ? 'default' : 'outline'}
            className={`flex-1 text-xs sm:text-sm ${activeTab === 'fonts' ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-800 border-gray-300'}`}
            onClick={() => setActiveTab('fonts')}
          >
            Fonts
          </Button>
          <Button
            variant={activeTab === 'colors' ? 'default' : 'outline'}
            className={`flex-1 text-xs sm:text-sm ${activeTab === 'colors' ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-800 border-gray-300'}`}
            onClick={() => setActiveTab('colors')}
          >
            Colors
          </Button>
          <Button
            variant={activeTab === 'backgrounds' ? 'default' : 'outline'}
            className={`flex-1 text-xs sm:text-sm ${activeTab === 'backgrounds' ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-800 border-gray-300'}`}
            onClick={() => setActiveTab('backgrounds')}
          >
            Backgrounds
          </Button>
        </div>

        {/* Fonts Tab */}
        {activeTab === 'fonts' && (
          <div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFonts.map((font) => {
                const buttonState = getButtonState(font);

                return (
                  <Card 
                    key={font.id} 
                    className={`transition-all duration-200 hover:shadow-lg ${
                      state.equippedFont === font.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{font.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {font.category}
                          </Badge>
                        </div>
                        {state.equippedFont === font.id && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>

                      <div 
                        className="bg-gray-50 rounded-lg p-3 mb-4 min-h-[80px] flex items-center justify-center text-center transition-all duration-200 border"
                        style={{
                          fontFamily: `"${font.family}", ${font.fallback}`
                        }}
                      >
                        <div>
                          <div className="text-lg font-semibold text-gray-800">WORD</div>
                          <div className="text-sm text-gray-600">guess</div>
                          <div className="text-xs text-gray-500">letter</div>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        variant={buttonState.variant}
                        disabled={buttonState.disabled}
                        onClick={() => handleFontAction(font)}
                      >
                        {buttonState.text}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {AVAILABLE_COLORS.map((color) => {
                const buttonState = getColorButtonState(color);

                return (
                  <Card 
                    key={color.id} 
                    className={`transition-all duration-200 hover:shadow-lg ${
                      state.equippedColor === color.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-sm">{color.name}</h3>
                        </div>
                        {state.equippedColor === color.id && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>

                      <div 
                        className="rounded-lg p-4 mb-4 min-h-[60px] flex items-center justify-center text-center transition-all duration-200 border-2"
                        style={{
                          backgroundColor: color.value === '#ffffff' ? '#f3f4f6' : color.value,
                          color: color.value === '#ffffff' ? '#000000' : 
                                color.value === '#000000' ? '#ffffff' : 
                                '#ffffff',
                          borderColor: color.value === '#ffffff' ? '#d1d5db' : color.value
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>Aa</div>
                      </div>

                      <Button
                        className="w-full"
                        variant={buttonState.variant}
                        disabled={buttonState.disabled}
                        onClick={() => handleColorAction(color)}
                        size="sm"
                      >
                        {buttonState.text}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Backgrounds Tab */}
        {activeTab === 'backgrounds' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {AVAILABLE_BACKGROUNDS.map((background) => {
                const buttonState = getBackgroundButtonState(background);

                return (
                  <Card 
                    key={background.id} 
                    className={`transition-all duration-200 hover:shadow-lg ${
                      state.equippedBackground === background.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{background.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {background.type}
                          </Badge>
                        </div>
                        {state.equippedBackground === background.id && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>

                      <div 
                        className="rounded-lg p-4 mb-4 min-h-[80px] flex items-center justify-center text-center transition-all duration-200 border relative overflow-hidden"
                        style={{
                          background: background.value
                        }}
                      >
                        <div className="text-white font-bold text-lg drop-shadow-lg">
                          Preview
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                          {background.price === 0 ? 'Free' : `${background.price} coins`}
                        </span>
                      </div>

                      <Button
                        className="w-full"
                        variant={buttonState.variant}
                        disabled={buttonState.disabled}
                        onClick={() => handleBackgroundAction(background)}
                      >
                        {buttonState.text}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Export state and functions for use in other components
export const FontStoreAPI = {
  getState: (): FontStoreState => {
    const saved = localStorage.getItem('wordpop-font-store');
    if (saved) {
      try {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  },
  
  addCoins: (amount: number) => {
    const current = FontStoreAPI.getState();
    const newState = { ...current, coins: current.coins + amount };
    localStorage.setItem('wordpop-font-store', JSON.stringify(newState));
    return newState;
  },

  getEquippedFont: (): Font => {
    const state = FontStoreAPI.getState();
    return AVAILABLE_FONTS.find(f => f.id === state.equippedFont) || AVAILABLE_FONTS[0];
  },

  getEquippedColor: (): ColorOption => {
    const state = FontStoreAPI.getState();
    return AVAILABLE_COLORS.find(c => c.id === state.equippedColor) || AVAILABLE_COLORS[0];
  },

  applyStoredStyles: () => {
    const state = FontStoreAPI.getState();
    const currentFont = AVAILABLE_FONTS.find(f => f.id === state.equippedFont);
    const currentColor = AVAILABLE_COLORS.find(c => c.id === state.equippedColor);
    
    if (!currentFont || !currentColor) return;
    
    const fontStack = `"${currentFont.family}", ${currentFont.fallback}`;
    const colorValue = currentColor.value;
    
    const style = document.getElementById('dynamic-font-style') || document.createElement('style');
    style.id = 'dynamic-font-style';
    
    style.textContent = `
      /* Game tiles - font and structure */
      .tile,
      .tile-correct,
      .tile-present, 
      .tile-absent,
      .tile-current,
      .tile-empty,
      [data-testid*="tile"] {
        font-family: ${fontStack} !important;
      }
      
      /* Game tiles - text color with outline */
      .tile *,
      .tile-correct *,
      .tile-present *,
      .tile-absent *,
      .tile-current *,
      .tile-empty *,
      [data-testid*="tile"] * {
        color: ${colorValue} !important;
        font-family: ${fontStack} !important;
        text-shadow: 
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 -1px 0 #000,
          0 1px 0 #000,
          -1px 0 0 #000,
          1px 0 0 #000 !important;
      }
      
      /* Keyboard keys - font and structure */
      .keyboard-key,
      .keyboard-key-default,
      .keyboard-key-correct,
      .keyboard-key-present,
      .keyboard-key-absent,
      .keyboard-key-special,
      [data-testid*="key"] {
        font-family: ${fontStack} !important;
      }
      
      /* Keyboard keys - text color with outline */
      .keyboard-key *,
      .keyboard-key-default *,
      .keyboard-key-correct *,
      .keyboard-key-present *,
      .keyboard-key-absent *,
      .keyboard-key-special *,
      [data-testid*="key"] * {
        color: ${colorValue} !important;
        font-family: ${fontStack} !important;
        text-shadow: 
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 -1px 0 #000,
          0 1px 0 #000,
          -1px 0 0 #000,
          1px 0 0 #000 !important;
      }
    `;
    
    if (!document.head.contains(style)) {
      document.head.appendChild(style);
    }
  }
};