import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Gift } from 'lucide-react';

// TODO: Replace with your actual AdMob Ad Unit IDs
const AD_UNIT_IDS = {
  // TODO: Add your real Android rewarded ad unit ID here
  android: 'ca-app-pub-3940256099942544/5224354917', // Test ID - REPLACE WITH REAL ID
  // TODO: Add your real iOS rewarded ad unit ID here  
  ios: 'ca-app-pub-3940256099942544/1712485313', // Test ID - REPLACE WITH REAL ID
  // TODO: Add your real web rewarded ad unit ID here (if needed)
  web: 'ca-app-pub-3940256099942544/5224354917' // Test ID - REPLACE WITH REAL ID
};

interface AdManagerProps {
  onCoinsEarned: (coins: number) => void;
  className?: string;
  variant?: 'default' | 'store' | 'compact';
}

// Mock AdMob interface for web development
// In production, this will be replaced by the actual AdMob SDK
interface MockAdMob {
  isLoaded: boolean;
  load: () => Promise<void>;
  show: () => Promise<{ dismissed: boolean; rewarded: boolean }>;
}

// Simulate AdMob behavior for web development
const createMockAdMob = (): MockAdMob => ({
  isLoaded: false,
  async load() {
    // Simulate ad loading time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    this.isLoaded = true;
  },
  async show() {
    // Simulate watching an ad (3-5 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    
    // Simulate 90% success rate
    const success = Math.random() > 0.1;
    return {
      dismissed: !success,
      rewarded: success
    };
  }
});

export function AdManager({ onCoinsEarned, className = '', variant = 'default' }: AdManagerProps) {
  const [adState, setAdState] = useState<'idle' | 'loading' | 'ready' | 'showing' | 'error'>('idle');
  const [adMob, setAdMob] = useState<MockAdMob | null>(null);
  const { toast } = useToast();

  // Initialize AdMob
  useEffect(() => {
    // TODO: In production mobile app, replace this with actual AdMob initialization
    // For React Native: import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
    // For Cordova: Use AdMob plugin
    // For web: Use Google Ad Manager or alternative web ad solution
    
    const mockAd = createMockAdMob();
    setAdMob(mockAd);
    
    // Auto-load the first ad
    loadAd(mockAd);
  }, []);

  const loadAd = async (adInstance?: MockAdMob) => {
    const ad = adInstance || adMob;
    if (!ad) return;

    setAdState('loading');
    
    try {
      await ad.load();
      setAdState('ready');
    } catch (error) {
      console.error('Failed to load ad:', error);
      setAdState('error');
      toast({
        title: "Ad Not Available",
        description: "No ads are available right now. Try again later.",
        variant: "destructive"
      });
    }
  };

  const showAd = async () => {
    if (!adMob || adState !== 'ready') return;

    setAdState('showing');
    
    try {
      const result = await adMob.show();
      
      if (result.rewarded) {
        // Calculate reward coins (25-50 coins for watching an ad)
        const coinReward = 25 + Math.floor(Math.random() * 26);
        onCoinsEarned(coinReward);
        
        toast({
          title: "Ad Reward!",
          description: `You earned ${coinReward} coins for watching the ad!`
        });
      } else if (result.dismissed) {
        toast({
          title: "Ad Skipped",
          description: "You need to watch the full ad to earn coins.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to show ad:', error);
      toast({
        title: "Ad Error",
        description: "Something went wrong while showing the ad.",
        variant: "destructive"
      });
    } finally {
      // Load the next ad
      setAdState('idle');
      setTimeout(() => loadAd(), 1000);
    }
  };

  const getButtonText = () => {
    switch (adState) {
      case 'loading':
        return 'Loading Ad...';
      case 'ready':
        return 'Watch Ad for Coins';
      case 'showing':
        return 'Watching Ad...';
      case 'error':
        return 'Ad Unavailable';
      default:
        return 'Loading...';
    }
  };

  const getButtonIcon = () => {
    switch (adState) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'ready':
        return <Play className="w-4 h-4" />;
      case 'showing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'error':
        return <Gift className="w-4 h-4" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin" />;
    }
  };

  const isDisabled = adState !== 'ready';

  if (variant === 'compact') {
    return (
      <Button
        onClick={showAd}
        disabled={isDisabled}
        variant="outline"
        size="sm"
        className={`flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 ${className}`}
        data-testid="button-watch-ad-compact"
      >
        {getButtonIcon()}
        <span className="hidden sm:inline">+Coins</span>
      </Button>
    );
  }

  if (variant === 'store') {
    return (
      <div className={`p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-200 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">Free Coins!</h3>
            <p className="text-sm text-green-600">Watch a short ad to earn 25-50 coins</p>
          </div>
          <Button
            onClick={showAd}
            disabled={isDisabled}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center space-x-2"
            data-testid="button-watch-ad-store"
          >
            {getButtonIcon()}
            <span>{adState === 'ready' ? 'Watch Ad' : getButtonText()}</span>
          </Button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <Button
      onClick={showAd}
      disabled={isDisabled}
      className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center space-x-2 ${className}`}
      data-testid="button-watch-ad"
    >
      {getButtonIcon()}
      <span>{getButtonText()}</span>
    </Button>
  );
}

// Hook for managing coin balance with localStorage persistence
export function useCoins() {
  const [coins, setCoins] = useState<number>(() => {
    // Load coins from localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedCoins = localStorage.getItem('wordpop-coins');
      return savedCoins ? parseInt(savedCoins, 10) : 25; // Start with 25 coins
    }
    return 25;
  });

  // Save coins to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordpop-coins', coins.toString());
    }
  }, [coins]);

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const spendCoins = (amount: number): boolean => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  };

  return {
    coins,
    addCoins,
    spendCoins,
    setCoins
  };
}

/*
TODO: Mobile App Integration Guide

For React Native Apps:
1. Install: npm install react-native-google-mobile-ads
2. Configure AdMob App IDs in app.json or native config
3. Replace MockAdMob with:
   ```
   import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
   
   const rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.android, {
     requestNonPersonalizedAdsOnly: false,
   });
   ```

For Cordova/PhoneGap Apps:
1. Install: cordova plugin add cordova-plugin-admob-free
2. Configure AdMob in config.xml
3. Use cordova.plugins.admob API

For Capacitor Apps:
1. Install: npm install @capacitor-community/admob
2. Configure native projects
3. Use Capacitor AdMob plugin

Production Checklist:
- Replace test Ad Unit IDs with real ones
- Test on actual devices
- Implement proper error handling for network issues
- Add frequency capping (limit ads per day/hour)
- Comply with GDPR/CCPA requirements
- Test ad loading in poor network conditions
*/