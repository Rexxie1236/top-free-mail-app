
'use client';

import type { AppMode } from '@/app/page';
import { Logo } from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Mail, List, MoreVertical } from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export function Header({ mode, setMode }: HeaderProps) {
  return (
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
              <span className="sr-only">Switch Mode</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as AppMode)}
            >
              <DropdownMenuRadioItem value="single">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Single Mode</span>
                </div>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="channel">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span>Channel Mode</span>
                </div>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
