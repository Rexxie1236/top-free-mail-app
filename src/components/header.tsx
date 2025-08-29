import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-3">
        <Logo className="h-8 w-8" />
        <span className="text-2xl font-bold font-headline text-foreground">
          TopFreeMail
        </span>
      </div>
    </header>
  );
}
