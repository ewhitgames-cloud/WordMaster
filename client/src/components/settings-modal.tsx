import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Volume2, VolumeX, Palette, Timer, Gamepad2, RotateCcw } from "lucide-react";
import FontSettings from "./font-settings";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicVolume: number;
  theme: 'light' | 'dark' | 'auto';
  animationsEnabled: boolean;
  autoSubmit: boolean;
  showTimer: boolean;
  showHints: boolean;
  keyboardLayout: 'qwerty' | 'alphabetical';
  colorBlindMode: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export const defaultSettings: GameSettings = {
  soundEnabled: true,
  musicVolume: 50,
  theme: 'auto',
  animationsEnabled: true,
  autoSubmit: true,
  showTimer: true,
  showHints: false,
  keyboardLayout: 'qwerty',
  colorBlindMode: false,
  highContrast: false,
  reduceMotion: false,
  fontSize: 'medium',
};

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}: SettingsModalProps) {
  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const resetToDefaults = () => {
    onSettingsChange(defaultSettings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
          <Settings className="w-5 h-5" />
          Game Settings
        </DialogTitle>
        <DialogDescription>
          Customize your Word Pop experience with these settings.
        </DialogDescription>

        <div className="space-y-6 py-4">
          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio
            </h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled" className="flex items-center gap-2">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Sound Effects & Music
              </Label>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                data-testid="switch-sound-enabled"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Volume</Label>
                <span className="text-sm text-gray-500">{settings.musicVolume}%</span>
              </div>
              <Slider
                value={[settings.musicVolume]}
                onValueChange={([value]) => updateSetting('musicVolume', value)}
                max={100}
                step={5}
                className="w-full"
                disabled={!settings.soundEnabled}
                data-testid="slider-music-volume"
              />
              
              <div className="text-xs text-gray-400 mt-2">
                Controls volume for both sound effects and background music. 
                {!settings.soundEnabled && " Enable sound effects above to use volume control."}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="haptic-feedback" className="flex items-center gap-2">
                📳 Haptic Feedback
              </Label>
              <Switch
                id="haptic-feedback"
                checked={settings.soundEnabled} // Link to sound enabled for now
                onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                data-testid="switch-haptic-feedback"
              />
            </div>
          </div>

          <Separator />

          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </h3>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('theme', value)}
              >
                <SelectTrigger data-testid="select-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value: 'small' | 'medium' | 'large') => updateSetting('fontSize', value)}
              >
                <SelectTrigger data-testid="select-font-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations-enabled">Animations</Label>
              <Switch
                id="animations-enabled"
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
                data-testid="switch-animations-enabled"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="color-blind-mode">Color Blind Mode</Label>
              <Switch
                id="color-blind-mode"
                checked={settings.colorBlindMode}
                onCheckedChange={(checked) => updateSetting('colorBlindMode', checked)}
                data-testid="switch-color-blind-mode"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                data-testid="switch-high-contrast"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduce-motion">Reduce Motion</Label>
              <Switch
                id="reduce-motion"
                checked={settings.reduceMotion}
                onCheckedChange={(checked) => updateSetting('reduceMotion', checked)}
                data-testid="switch-reduce-motion"
              />
            </div>
          </div>

          <Separator />

          {/* Gameplay Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Gameplay
            </h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-submit" className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Auto-submit words
              </Label>
              <Switch
                id="auto-submit"
                checked={settings.autoSubmit}
                onCheckedChange={(checked) => updateSetting('autoSubmit', checked)}
                data-testid="switch-auto-submit"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-timer">Show Timer (Challenge Mode)</Label>
              <Switch
                id="show-timer"
                checked={settings.showTimer}
                onCheckedChange={(checked) => updateSetting('showTimer', checked)}
                data-testid="switch-show-timer"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-hints">Show Word Hints</Label>
              <Switch
                id="show-hints"
                checked={settings.showHints}
                onCheckedChange={(checked) => updateSetting('showHints', checked)}
                data-testid="switch-show-hints"
              />
            </div>

            <div className="space-y-2">
              <Label>Keyboard Layout</Label>
              <Select
                value={settings.keyboardLayout}
                onValueChange={(value: 'qwerty' | 'alphabetical') => updateSetting('keyboardLayout', value)}
              >
                <SelectTrigger data-testid="select-keyboard-layout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qwerty">QWERTY</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Font Settings Section */}
          <FontSettings />

          <Separator />

          {/* Reset Settings */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center gap-2"
              data-testid="button-reset-settings"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              data-testid="button-save-settings"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}