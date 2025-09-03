
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { EmailDisplay } from '@/components/email-display';
import { Inbox } from '@/components/inbox';
import { Separator } from '@/components/ui/separator';
import { ChangeEmailAddress } from '@/components/change-email-address';
import { AdBanner } from '@/components/ad-banner';
import { ChannelView } from '@/components/channel-view';

export type AppMode = 'single' | 'channel';

export default function Home() {
  const [mode, setMode] = useState<AppMode>('single');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header mode={mode} setMode={setMode} />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-4 md:py-6">
        {mode === 'single' ? (
          <>
            <EmailDisplay />
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-6">
              Forget about spam, advertising mailings, hacking and attacking
              robots. Keep your real mailbox clean and secure. Temp Mail provides
              temporary, secure, anonymous, free, disposable email address.
            </p>
            <AdBanner />
            <Separator className="my-8 bg-border/50" />
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-headline text-center">
                Your Inbox
              </h2>
              <Inbox />
            </div>
            <AdBanner />
            <Separator className="my-12 md:my-16 bg-border/50" />
            <ChangeEmailAddress />
          </>
        ) : (
          <ChannelView />
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto space-y-4">
        <p>TopFreeMail &copy; 2024. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
