
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { useTranslation } from '@/hooks/use-translation';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  const { T } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-2xl font-bold font-headline">{T('about.title')}</span>
          </DialogTitle>
          <DialogDescription className="pt-4 text-base text-foreground/80">
            {T('about.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-muted-foreground">
          <p>
            {T('about.protection')}
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><span className="font-semibold text-foreground">{T('about.singleMode')}:</span> {T('about.singleModeDesc')}</li>
            <li><span className="font-semibold text-foreground">{T('about.channelMode')}:</span> {T('about.channelModeDesc')}</li>
            <li><span className="font-semibold text-foreground">{T('about.aiPowered')}:</span> {T('about.aiPoweredDesc')}</li>
          </ul>
        </div>
        <DialogFooter className="sm:justify-start">
           <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            {T('about.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
