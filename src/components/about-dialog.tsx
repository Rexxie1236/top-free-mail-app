
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
  const { translate: T } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="text-2xl font-bold font-headline">{T('About TopFreeMail')}</span>
          </DialogTitle>
          <DialogDescription className="pt-4 text-base text-foreground/80">
            {T('TopFreeMail is your go-to solution for maintaining a clean and secure primary inbox.')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-muted-foreground">
          <p>
            {T('We provide temporary, secure, anonymous, and free disposable email addresses to protect you from spam, advertising mailings, and online threats.')}
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><span className="font-semibold text-foreground">{T('Single Mode:')}</span> {T('Quickly generate a temporary email for one-time use.')}</li>
            <li><span className="font-semibold text-foreground">{T('Channel Mode:')}</span> {T('Effortlessly manage multiple temporary email addresses at once for different services.')}</li>
            <li><span className="font-semibold text-foreground">{T('AI-Powered:')}</span> {T('Utilize artificial intelligence to summarize long emails, making your inbox smarter and more efficient.')}</li>
          </ul>
        </div>
        <DialogFooter className="sm:justify-start">
           <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            {T('Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
