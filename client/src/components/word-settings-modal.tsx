import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WordSettings {
  blocklist: string[];
  allowlist: string[];
  useFrequencyFilter: boolean;
  minAnswerFrequency: number;
  minGuessFrequency: number;
  requireVowel: boolean;
}

interface WordSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WordSettingsModal({ isOpen, onClose }: WordSettingsModalProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<WordSettings>({
    blocklist: [],
    allowlist: [],
    useFrequencyFilter: true,
    minAnswerFrequency: 6,
    minGuessFrequency: 4,
    requireVowel: true
  });
  
  const [newBlockWord, setNewBlockWord] = useState("");
  const [newAllowWord, setNewAllowWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load settings on mount
  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('wordpop-word-filter-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          blocklist: parsed.blocklist || [],
          allowlist: parsed.allowlist || [],
          useFrequencyFilter: parsed.useFrequencyFilter ?? true,
          minAnswerFrequency: parsed.minAnswerFrequency ?? 6,
          minGuessFrequency: parsed.minGuessFrequency ?? 4,
          requireVowel: parsed.requireVowel ?? true
        });
      }
    } catch (error) {
      console.error('Error loading word settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('wordpop-word-filter-settings', JSON.stringify(settings));
      
      // Clear any cached word lists to force regeneration
      localStorage.removeItem('wordpop-filtered-answers');
      localStorage.removeItem('wordpop-filtered-guesses');
      
      toast({
        title: "Settings saved",
        description: "Word filter settings updated successfully",
      });
    } catch (error) {
      console.error('Error saving word settings:', error);
      toast({
        title: "Error",
        description: "Failed to save word settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateWord = (word: string): boolean => {
    const upper = word.toUpperCase().trim();
    return /^[A-Z]{5}$/.test(upper);
  };

  const addToBlocklist = () => {
    const word = newBlockWord.toUpperCase().trim();
    if (!validateWord(word)) {
      toast({
        title: "Invalid word",
        description: "Word must be exactly 5 letters and contain only letters",
        variant: "destructive",
      });
      return;
    }
    
    if (settings.blocklist.includes(word)) {
      toast({
        title: "Word already blocked",
        description: `"${word}" is already in the blocklist`,
        variant: "destructive",
      });
      return;
    }

    setSettings(prev => ({
      ...prev,
      blocklist: [...prev.blocklist, word],
      allowlist: prev.allowlist.filter(w => w !== word) // Remove from allowlist if present
    }));
    setNewBlockWord("");
    
    toast({
      title: "Word blocked",
      description: `"${word}" added to blocklist`,
    });
  };

  const addToAllowlist = () => {
    const word = newAllowWord.toUpperCase().trim();
    if (!validateWord(word)) {
      toast({
        title: "Invalid word",
        description: "Word must be exactly 5 letters and contain only letters",
        variant: "destructive",
      });
      return;
    }
    
    if (settings.allowlist.includes(word)) {
      toast({
        title: "Word already allowed",
        description: `"${word}" is already in the allowlist`,
        variant: "destructive",
      });
      return;
    }

    setSettings(prev => ({
      ...prev,
      allowlist: [...prev.allowlist, word],
      blocklist: prev.blocklist.filter(w => w !== word) // Remove from blocklist if present
    }));
    setNewAllowWord("");
    
    toast({
      title: "Word allowed",
      description: `"${word}" added to allowlist`,
    });
  };

  const removeFromBlocklist = (word: string) => {
    setSettings(prev => ({
      ...prev,
      blocklist: prev.blocklist.filter(w => w !== word)
    }));
    toast({
      title: "Word unblocked",
      description: `"${word}" removed from blocklist`,
    });
  };

  const removeFromAllowlist = (word: string) => {
    setSettings(prev => ({
      ...prev,
      allowlist: prev.allowlist.filter(w => w !== word)
    }));
    toast({
      title: "Word removed",
      description: `"${word}" removed from allowlist`,
    });
  };

  const resetToDefaults = () => {
    const defaultBlocklist = [
      'ERVIL', 'EMPTS', 'QOPHS', 'QADIS', 'KUFIS', 'AJEE', 'ZLOTY', 'AAHED',
      'ABACA', 'ABACI', 'ABAFT', 'ABAMP', 'ABAND', 'ABASH', 'ABATE', 'ABAYA'
    ];
    
    const defaultAllowlist = [
      'NYMPH', 'GYPSY', 'LYMPH', 'PSYCH', 'STYLE', 'TYPAL', 'SYLPH'
    ];

    setSettings({
      blocklist: defaultBlocklist,
      allowlist: defaultAllowlist,
      useFrequencyFilter: true,
      minAnswerFrequency: 6,
      minGuessFrequency: 4,
      requireVowel: true
    });

    toast({
      title: "Settings reset",
      description: "Word filter settings restored to defaults",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Word Library Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Filtering System Active
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Obscure words like ERVIL and EMPTS are automatically filtered out. 
                  Customize the blocklist and allowlist below to fine-tune your word selection.
                </p>
              </div>
            </div>
          </div>

          {/* Frequency Filter Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Frequency Filtering</h3>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="frequency-filter"
                checked={settings.useFrequencyFilter}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, useFrequencyFilter: checked }))
                }
              />
              <Label htmlFor="frequency-filter">
                Use frequency-based word filtering
              </Label>
            </div>

            {settings.useFrequencyFilter && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <Label htmlFor="min-answer-freq">
                    Min Answer Frequency (1-10)
                  </Label>
                  <Input
                    id="min-answer-freq"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.minAnswerFrequency}
                    onChange={(e) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        minAnswerFrequency: parseInt(e.target.value) || 6 
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="min-guess-freq">
                    Min Guess Frequency (1-10)
                  </Label>
                  <Input
                    id="min-guess-freq"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.minGuessFrequency}
                    onChange={(e) => 
                      setSettings(prev => ({ 
                        ...prev, 
                        minGuessFrequency: parseInt(e.target.value) || 4 
                      }))
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="require-vowel"
                checked={settings.requireVowel}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, requireVowel: checked }))
                }
              />
              <Label htmlFor="require-vowel">
                Require at least one vowel (A, E, I, O, U, or Y)
              </Label>
            </div>
          </div>

          <Separator />

          {/* Blocklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Blocked Words</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Words that will never appear as answers or be accepted as guesses.
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter 5-letter word to block"
                value={newBlockWord}
                onChange={(e) => setNewBlockWord(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToBlocklist();
                  }
                }}
                maxLength={5}
              />
              <Button onClick={addToBlocklist} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {settings.blocklist.map((word) => (
                <Badge key={word} variant="destructive" className="flex items-center gap-1">
                  {word}
                  <button
                    onClick={() => removeFromBlocklist(word)}
                    className="hover:bg-red-700 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {settings.blocklist.length === 0 && (
                <p className="text-sm text-gray-500">No blocked words</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Allowlist */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Force-Allowed Words</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Words that bypass all filters and are always available for guesses.
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter 5-letter word to allow"
                value={newAllowWord}
                onChange={(e) => setNewAllowWord(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToAllowlist();
                  }
                }}
                maxLength={5}
              />
              <Button onClick={addToAllowlist} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {settings.allowlist.map((word) => (
                <Badge key={word} variant="secondary" className="flex items-center gap-1">
                  {word}
                  <button
                    onClick={() => removeFromAllowlist(word)}
                    className="hover:bg-gray-400 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {settings.allowlist.length === 0 && (
                <p className="text-sm text-gray-500">No force-allowed words</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}