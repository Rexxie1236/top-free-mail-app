import { Header } from '@/components/header';
import { EmailDisplay } from '@/components/email-display';
import { Inbox } from '@/components/inbox';
import { Separator } from '@/components/ui/separator';
import { ChangeEmailAddress } from '@/components/change-email-address';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-4 md:py-6">
        <EmailDisplay />

        <p className="text-center text-muted-foreground max-w-2xl mx-auto mt-6">
          Forget about spam, advertising mailings, hacking and attacking
          robots. Keep your real mailbox clean and secure. Temp Mail provides
          temporary, secure, anonymous, free, disposable email address.
        </p>

        <Separator className="my-12 md:my-16 bg-border/50" />

        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-headline text-center">
            Your Inbox
          </h2>
          <Inbox />
        </div>

        <Separator className="my-12 md:my-16 bg-border/50" />

        <ChangeEmailAddress />
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto">
        <p>TopFreeMail &copy; 2024. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
