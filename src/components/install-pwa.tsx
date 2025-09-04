
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const { T } = useTranslation();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  if (!installPrompt) {
    return null;
  }

  return (
    <Button onClick={handleInstallClick} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      {T('header.installApp')}
    </Button>
  );
}

declare module '@/locales/en.json' {
    interface Header {
        installApp: string;
    }
}
