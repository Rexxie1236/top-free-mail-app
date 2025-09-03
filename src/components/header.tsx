
'use client';

import type { AppMode } from '@/app/page';
import { Logo } from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Paintbrush,
  SunMoon,
  Info,
  Languages,
  Loader2,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { AboutDialog } from './about-dialog';
import { useTranslation } from '@/hooks/use-translation';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export function Header({ mode, setMode }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [aboutOpen, setAboutOpen] = useState(false);
  const { language, setLanguage, translate, isTranslating } = useTranslation();

  const T = (text: string) => translate(text);

  const SingleModeIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M20 6l-8 7-8-7" />
    </svg>
  );

  const ChannelModeIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );

  return (
    <>
      <header className="py-4 px-4 md:px-6 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10 rounded-b-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-bold font-headline text-foreground">
              TopFreeMail
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{T('Mode')}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={mode}
                onValueChange={(value) => setMode(value as AppMode)}
              >
                <DropdownMenuRadioItem value="single">
                  <div className="flex items-center gap-2">
                    <SingleModeIcon />
                    <span>{T('Single Mode')}</span>
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="channel">
                  <div className="flex items-center gap-2">
                    <ChannelModeIcon />
                    <span>{T('Channel Mode')}</span>
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>{T('Settings')}</DropdownMenuLabel>
              <DropdownMenuItem>
                <Paintbrush className="mr-2 h-4 w-4" />
                <span>{T('Modernize Email')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center justify-between"
              >
                <Label
                  htmlFor="theme-switch"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <SunMoon className="mr-2 h-4 w-4" />
                  <span>{theme === 'dark' ? T('Dark') : T('Light')} {T('Theme')}</span>
                </Label>
                <Switch
                  id="theme-switch"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? 'dark' : 'light')
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                   {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                  <span>{T('Language')}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <ScrollArea className="h-48">
                    <DropdownMenuItem onSelect={() => setLanguage('English')}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('Spanish')}>
                      Español
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('French')}>
                      Français
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('German')}>
                      Deutsch
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('Japanese')}>
                      日本語
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('Chinese')}>
                      中文
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('Russian')}>
                      Русский
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('Arabic')}>
                      العربية
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setLanguage('Portuguese')}
                    >
                      Português
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setLanguage('Hindi')}>
                      हिन्दी
                    </DropdownMenuItem>
                  </ScrollArea>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem onSelect={() => setAboutOpen(true)}>
                <Info className="mr-2 h-4 w-4" />
                <span>{T('About')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
    </>
  );
}
