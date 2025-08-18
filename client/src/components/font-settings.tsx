import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Palette } from "lucide-react";
import { FontStoreAPI, Font, ColorOption } from "./font-store-modal";

const AVAILABLE_COLORS: ColorOption[] = [
  { id: 'default', name: 'Black', value: '#000000', price: 0 },
  { id: 'white', name: 'White', value: '#ffffff', price: 50 },
  { id: 'yellow', name: 'Sunny Yellow', value: '#fbbf24', price: 75 },
  { id: 'purple', name: 'Royal Purple', value: '#8b5cf6', price: 100 },
  { id: 'cyan', name: 'Electric Cyan', value: '#06b6d4', price: 100 },
  { id: 'red', name: 'Crimson Red', value: '#ef4444', price: 90 },
  { id: 'green', name: 'Forest Green', value: '#10b981', price: 90 },
  { id: 'orange', name: 'Sunset Orange', value: '#f97316', price: 85 },
  { id: 'pink', name: 'Hot Pink', value: '#ec4899', price: 110 },
  { id: 'blue', name: 'Ocean Blue', value: '#3b82f6', price: 95 },
  { id: 'gold', name: 'Golden', value: '#d97706', price: 120 },
  { id: 'silver', name: 'Silver', value: '#6b7280', price: 110 }
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

  const currentState = FontStoreAPI.getState();
  const ownedFonts = currentState.ownedFonts.map(id => {
    const allFonts = [
      { id: 'default', name: 'Classic', family: 'Inter', fallback: 'system-ui, sans-serif', price: 0, category: 'sans' as const },
      { id: 'playfair', name: 'Elegant', family: 'Playfair Display', fallback: 'Georgia, serif', price: 100, category: 'serif' as const },
      { id: 'merriweather', name: 'Reader', family: 'Merriweather', fallback: 'Times, serif', price: 80, category: 'serif' as const },
      { id: 'roboto-slab', name: 'Strong', family: 'Roboto Slab', fallback: 'Georgia, serif', price: 110, category: 'serif' as const },
      { id: 'crimson-text', name: 'Literary', family: 'Crimson Text', fallback: 'Times, serif', price: 95, category: 'serif' as const },
      { id: 'poppins', name: 'Modern', family: 'Poppins', fallback: 'Arial, sans-serif', price: 90, category: 'sans' as const },
      { id: 'space-grotesk', name: 'Futuristic', family: 'Space Grotesk', fallback: 'Arial, sans-serif', price: 140, category: 'sans' as const },
      { id: 'nunito', name: 'Friendly', family: 'Nunito', fallback: 'Arial, sans-serif', price: 85, category: 'sans' as const },
      { id: 'montserrat', name: 'Clean', family: 'Montserrat', fallback: 'Arial, sans-serif', price: 100, category: 'sans' as const },
      { id: 'fira-code', name: 'Code Style', family: 'Fira Code', fallback: 'Monaco, monospace', price: 150, category: 'mono' as const },
      { id: 'jetbrains-mono', name: 'Terminal', family: 'JetBrains Mono', fallback: 'Courier, monospace', price: 160, category: 'mono' as const },
      { id: 'source-code-pro', name: 'Developer', family: 'Source Code Pro', fallback: 'Courier, monospace', price: 140, category: 'mono' as const },
      { id: 'comfortaa', name: 'Rounded', family: 'Comfortaa', fallback: 'Arial, sans-serif', price: 120, category: 'playful' as const },
      { id: 'fredoka', name: 'Bubbly', family: 'Fredoka', fallback: 'Arial, sans-serif', price: 130, category: 'playful' as const },
      { id: 'quicksand', name: 'Smooth', family: 'Quicksand', fallback: 'Arial, sans-serif', price: 110, category: 'playful' as const },
      { id: 'bangers', name: 'Comic Book', family: 'Bangers', fallback: 'Arial, sans-serif', price: 180, category: 'fun' as const },
      { id: 'luckiest-guy', name: 'Bold Fun', family: 'Luckiest Guy', fallback: 'Arial, sans-serif', price: 170, category: 'fun' as const },
      { id: 'amatic-sc', name: 'Hand Drawn', family: 'Amatic SC', fallback: 'Arial, sans-serif', price: 160, category: 'fun' as const },
      { id: 'bungee', name: 'Street Art', family: 'Bungee', fallback: 'Arial, sans-serif', price: 190, category: 'fun' as const },
      { id: 'creepster', name: 'Spooky', family: 'Creepster', fallback: 'Arial, sans-serif', price: 200, category: 'fun' as const },
      { id: 'kalam', name: 'Handwriting', family: 'Kalam', fallback: 'Arial, sans-serif', price: 150, category: 'fun' as const }
    ];
    return allFonts.find(f => f.id === id);
  }).filter(Boolean);
  const ownedColors = state.ownedColors.map(id => AVAILABLE_COLORS.find(c => c.id === id)).filter(Boolean);

  const equipFont = (fontId: string) => {
    const newState = { ...state, equippedFont: fontId };
    localStorage.setItem('wordpop-font-store', JSON.stringify(newState));
    setState(newState);
    applyStyles(newState);
  };

  const equipColor = (colorId: string) => {
    const newState = { ...state, equippedColor: colorId };
    localStorage.setItem('wordpop-font-store', JSON.stringify(newState));
    setState(newState);
    applyStyles(newState);
  };

  const applyStyles = (currentState: any) => {
    const font = FontStoreAPI.getEquippedFont();
    const color = AVAILABLE_COLORS.find(c => c.id === currentState.equippedColor);
    
    if (font && color) {
      const fontStack = `"${font.family}", ${font.fallback}`;
      const colorValue = color.value;
      
      const style = document.getElementById('dynamic-font-style') || document.createElement('style');
      style.id = 'dynamic-font-style';
      
      style.textContent = `
        /* Game tiles - text content only */
        .tile,
        .tile-correct,
        .tile-present, 
        .tile-absent,
        .tile-current,
        .tile-empty,
        [data-testid*="tile"] {
          font-family: ${fontStack} !important;
        }
        
        .tile *,
        .tile-correct *,
        .tile-present *,
        .tile-absent *,
        .tile-current *,
        .tile-empty *,
        [data-testid*="tile"] * {
          color: ${colorValue} !important;
          font-family: ${fontStack} !important;
        }
        
        /* Keyboard keys - text content only */
        .keyboard-key,
        .keyboard-key-default,
        .keyboard-key-correct,
        .keyboard-key-present,
        .keyboard-key-absent,
        .keyboard-key-special,
        [data-testid*="key"] {
          font-family: ${fontStack} !important;
        }
        
        .keyboard-key *,
        .keyboard-key-default *,
        .keyboard-key-correct *,
        .keyboard-key-present *,
        .keyboard-key-absent *,
        .keyboard-key-special *,
        [data-testid*="key"] * {
          color: ${colorValue} !important;
          font-family: ${fontStack} !important;
        }
      `;
      
      if (!document.head.contains(style)) {
        document.head.appendChild(style);
      }
      
      window.dispatchEvent(new CustomEvent('stylesChanged', { detail: { font, color } }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Fonts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Owned Fonts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ownedFonts.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No fonts owned yet. Visit the Style Store to purchase fonts!
            </p>
          ) : (
            ownedFonts.map((font) => font && (
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
            ))
          )}
        </CardContent>
      </Card>

      {/* Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Owned Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ownedColors.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No colors owned yet. Visit the Style Store to purchase colors!
            </p>
          ) : (
            ownedColors.map((color) => color && (
              <div
                key={color.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  state.equippedColor === color.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <div>
                    <div className="font-medium">{color.name}</div>
                  </div>
                  {state.equippedColor === color.id && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant={state.equippedColor === color.id ? "secondary" : "default"}
                  disabled={state.equippedColor === color.id}
                  onClick={() => equipColor(color.id)}
                >
                  {state.equippedColor === color.id ? 'Equipped' : 'Equip'}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}