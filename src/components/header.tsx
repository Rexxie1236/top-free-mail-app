
'use client';

import type { AppMode } from '@/app/page';
import { Logo } from '@/components/logo';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, List } from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export function Header({ mode, setMode }: HeaderProps) {
  const handleModeChange = (isChecked: boolean) => {
    setMode(isChecked ? 'channel' : 'single');
  };

  return (
    <header className="py-4 px-4 md:px-6 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10 rounded-b-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="text-2xl font-bold font-headline text-foreground">
            TopFreeMail
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="mode-switch" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className={`h-5 w-5 transition-colors ${mode === 'single' ? 'text-primary' : ''}`}/>
            <span>Single</span>
          </Label>
          <Switch
            id="mode-switch"
            checked={mode === 'channel'}
            onCheckedChange={handleModeChange}
          />
          <Label htmlFor="mode-switch" className="flex items-center gap-2 text-sm text-muted-foreground">
            <List className={`h-5 w-5 transition-colors ${mode === 'channel' ? 'text-primary' : ''}`} />
            <span>Channels</span>
          </Label>
        </div>
      </div>
    </header>
  );
}
