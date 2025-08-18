import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { FontStoreAPI, Font } from "./font-store-modal";

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

export default function FontSettings() {
  const [state, setState] = useState(FontStoreAPI.getState());

  useEffect(() => {
    const updateState = () => setState(FontStoreAPI.getState());
    
    // Listen for font store changes
    const handleStorageChange = () => updateState();
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for font changes
    const handleFontChange = () => updateState();
    window.addEventListener('fontChanged', handleFontChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fontChanged', handleFontChange);
    };
  }, []);

  const ownedFonts = AVAILABLE_FONTS.filter(font => state.ownedFonts.includes(font.id));

  const equipFont = (fontId: string) => {
    const newState = { ...state, equippedFont: fontId };
    localStorage.setItem('wordpop-font-store', JSON.stringify(newState));
    setState(newState);
    
    // Apply font immediately
    const font = AVAILABLE_FONTS.find(f => f.id === fontId);
    if (font) {
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
      
      window.dispatchEvent(new CustomEvent('fontChanged', { detail: font }));
    }
  };

  if (ownedFonts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fonts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            No fonts owned yet. Visit the Font Store to purchase fonts!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Owned Fonts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ownedFonts.map((font) => (
          <div
            key={font.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              state.equippedFont === font.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div>
                <div className="font-medium">{font.name}</div>
                <Badge variant="outline" className="text-xs">
                  {font.category}
                </Badge>
              </div>
              {state.equippedFont === font.id && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </div>
            
            <Button
              size="sm"
              variant={state.equippedFont === font.id ? "secondary" : "default"}
              disabled={state.equippedFont === font.id}
              onClick={() => equipFont(font.id)}
            >
              {state.equippedFont === font.id ? 'Equipped' : 'Equip'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}