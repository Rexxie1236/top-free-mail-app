
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { EmailDisplay } from '@/components/email-display';
import { Inbox } from '@/components/inbox';
import { Separator } from '@/components/ui/separator';
import { ChangeEmailAddress } from '@/components/change-email-address';
import { AdBanner } from '@/components/ad-banner';
import { ChannelView } from '@/components/channel-view';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export type AppMode = 'single' | 'channel';

export default function Home() {
  const [mode, setMode] = useState<AppMode>('single');
  const { T } = useTranslation();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user tries to access channel mode without being logged in, redirect.
    if (mode === 'channel' && !loading && !user) {
      router.push('/login');
    }
  }, [mode, user, loading, router]);
  
  const renderContent = () => {
    if (mode === 'single') {
       return (
          <>
            <EmailDisplay />
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-6">
              {T('home.description')}
            </p>
            <AdBanner />
            <Separator className="my-8 bg-border/50" />
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-headline text-center">
                {T('home.inboxTitle')}
              </h2>
              <Inbox />
            </div>
            <AdBanner />
            <Separator className="my-12 md:my-16 bg-border/50" />
            {/* The ChangeEmailAddress component is only for logged-in users to add to their channels */}
            {user && <ChangeEmailAddress />}
          </>
       )
    }

    if (mode === 'channel') {
      if (loading) {
        return (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        )
      }
      if (user) {
        return <ChannelView />;
      }
    }

    return null;
  }


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header mode={mode} setMode={setMode} />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-4 md:py-6">
        {renderContent()}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto space-y-4">
        <p>{T('home.footer')}</p>
      </footer>
    </div>
  );
}
