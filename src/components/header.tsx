
'use client';

import type { AppMode } from '@/app/page';
import Link from 'next/link';
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
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Paintbrush,
  SunMoon,
  Info,
  Languages,
  LogOut,
  User,
  LogIn,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { AboutDialog } from './about-dialog';
import { useTranslation } from '@/hooks/use-translation';
import { languages } from '@/locales/languages';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export function Header({ mode, setMode }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [aboutOpen, setAboutOpen] = useState(false);
  const { T, setLanguage } = useTranslation();
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setMode('single'); // Revert to single mode on sign out
    router.push('/');
  };

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === 'channel' && !user) {
      router.push('/login');
    } else {
      setMode(newMode);
    }
  }

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
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="text-2xl font-bold font-headline text-foreground">
              TopFreeMail
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {!loading && !user && (
              <Button asChild>
                <Link href="/login">{T('header.login')}</Link>
              </Button>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.photoURL ?? ''}
                        alt={user.displayName ?? 'User'}
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.isAnonymous ? "Anonymous User" : user.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.uid}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span>{T('header.profile')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{T('header.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{T('header.mode')}</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={mode}
                  onValueChange={(value) => handleModeChange(value as AppMode)}
                >
                  <DropdownMenuRadioItem value="single">
                    <div className="flex items-center gap-2">
                      <SingleModeIcon />
                      <span>{T('header.singleMode')}</span>
                    </div>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="channel">
                    <div className="flex items-center gap-2">
                      <ChannelModeIcon />
                      <span>{T('header.channelMode')}</span>
                    </div>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>{T('header.settings')}</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Paintbrush className="mr-2 h-4 w-4" />
                  <span>{T('header.modernize')}</span>
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
                    <span>
                      {theme === 'dark'
                        ? T('header.darkTheme')
                        : T('header.lightTheme')}
                    </span>
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
                    <Languages className="mr-2 h-4 w-4" />
                    <span>{T('header.language')}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <ScrollArea className="h-48">
                      {Object.entries(languages).map(([code, lang]) => (
                        <DropdownMenuItem
                          key={code}
                          onSelect={() => setLanguage(code)}
                        >
                          {lang.name}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onSelect={() => setAboutOpen(true)}>
                  <Info className="mr-2 h-4 w-4" />
                  <span>{T('header.about')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
    </>
  );
}

declare module '@/locales/en.json' {
  interface Header {
    login: string;
    signUp: string;
    profile: string;
    logout: string;
  }
}
