import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Coins, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Font {
  id: string;
  name: string;
  family: string;
  fallback: string;
  price: number;
  category: 'serif' | 'sans' | 'mono' | 'playful';
  googleFont?: string;
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
  {
    id: 'playfair',
    name: 'Elegant',
    family: 'Playfair Display',
    fallback: 'Georgia, serif',
    price: 100,
    category: 'serif',
    googleFont: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap'
  },
  {
    id: 'fira-code',
    name: 'Code Style',
    family: 'Fira Code',
    fallback: 'Monaco, monospace',
    price: 150,
    category: 'mono',
    googleFont: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500&display=swap'
  },
  {
    id: 'comfortaa',
    name: 'Playful',
    family: 'Comfortaa',
    fallback: 'Arial, sans-serif',
    price: 120,
    category: 'playful',
    googleFont: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600&display=swap'
  },
  {
    id: 'merriweather',
    name: 'Reader',
    family: 'Merriweather',
    fallback: 'Times, serif',
    price: 80,
    category: 'serif',
    googleFont: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap'
  },
  {
    id: 'poppins',
    name: 'Modern',
    family: 'Poppins',
    fallback: 'Arial, sans-serif',
    price: 90,
    category: 'sans',
    googleFont: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap'
  },
  {
    id: 'roboto-slab',
    name: 'Strong',
    family: 'Roboto Slab',
    fallback: 'Georgia, serif',
    price: 110,
    category: 'serif',
    googleFont: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;700&display=swap'
  },
  {
    id: 'space-grotesk',
    name: 'Futuristic',
    family: 'Space Grotesk',
    fallback: 'Arial, sans-serif',
    price: 140,
    category: 'sans',
    googleFont: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap'
  },
  {
    id: 'jetbrains-mono',
    name: 'Terminal',
    family: 'JetBrains Mono',
    fallback: 'Courier, monospace',
    price: 160,
    category: 'mono',
    googleFont: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap'
  },
  {
    id: 'fredoka',
    name: 'Bubbly',
    family: 'Fredoka',
    fallback: 'Arial, sans-serif',
    price: 130,
    category: 'playful',
    googleFont: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600&display=swap'
  }
];

interface FontStoreState {
  coins: number;
  ownedFonts: string[];
  equippedFont: string;
}

const DEFAULT_STATE: FontStoreState = {
  coins: 250, // Start with enough to buy 2-3 fonts
  ownedFonts: ['default'],
  equippedFont: 'default'
};

interface FontStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FontStoreModal({ isOpen, onClose }: FontStoreModalProps) {
  const { toast } = useToast();
  const [state, setState] = useState<FontStoreState>(DEFAULT_STATE);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set(['default']));

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

  // Apply equipped font to game elements
  useEffect(() => {
    const font = AVAILABLE_FONTS.find(f => f.id === state.equippedFont);
    if (font) {
      applyFont(font);
      // Emit global event for other modules
      window.dispatchEvent(new CustomEvent('fontChanged', { detail: font }));
    }
  }, [state.equippedFont]);

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

  // Apply font to game elements
  const applyFont = (font: Font) => {
    const fontStack = `"${font.family}", ${font.fallback}`;
    const style = document.getElementById('dynamic-font-style') || document.createElement('style');
    style.id = 'dynamic-font-style';
    
    style.textContent = `
      /* Game tiles - all states */
      .tile,
      .tile-correct,
      .tile-present, 
      .tile-absent,
      .tile-current,
      .tile-empty,
      [data-testid*="tile"] {
        font-family: ${fontStack} !important;
      }
      
      /* Keyboard keys - all states */
      .keyboard-key,
      .keyboard-key-default,
      .keyboard-key-correct,
      .keyboard-key-present,
      .keyboard-key-absent,
      .keyboard-key-special,
      [data-testid*="key"] {
        font-family: ${fontStack} !important;
      }
      
      /* Additional game elements */
      .aspect-square,
      .border-2,
      .text-2xl,
      .font-bold,
      .text-white {
        font-family: ${fontStack} !important;
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

    toast({
      title: "Font Equipped!",
      description: `${font.name} is now active.`,
    });
  };

  const getButtonState = (font: Font) => {
    const isOwned = state.ownedFonts.includes(font.id);
    const isEquipped = state.equippedFont === font.id;

    if (isEquipped) return { text: 'Equipped', disabled: true, variant: 'secondary' as const };
    if (isOwned) return { text: 'Equip', disabled: false, variant: 'default' as const };
    return { text: `Buy (${font.price})`, disabled: state.coins < font.price, variant: 'default' as const };
  };

  const handleAction = (font: Font) => {
    const isOwned = state.ownedFonts.includes(font.id);
    if (isOwned) {
      equipFont(font);
    } else {
      buyFont(font);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Font Store</DialogTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
                <Coins className="w-4 h-4" />
                <span className="font-bold">{state.coins}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Buy a font once, equip anytime. Fonts apply instantly to your game board and keyboard.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {AVAILABLE_FONTS.map((font) => {
            const buttonState = getButtonState(font);
            const isLoaded = loadedFonts.has(font.id);

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
                    onClick={() => handleAction(font)}
                  >
                    {buttonState.text}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
  }
};