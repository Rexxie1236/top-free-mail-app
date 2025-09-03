
'use client';

import { useState, useEffect, useCallback } from 'react';
import { handleSummarize } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Trash2, Inbox as InboxIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from '@/hooks/use-translation';

interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  createdAt: any;
}

export function Inbox() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [loadingEmails, setLoadingEmails] = useState(true);
  const { toast } = useToast();
  const { translate: T } = useTranslation();

  const handleEmailChange = useCallback(() => {
    const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('currentEmail') : null;
    if (storedEmail) {
      setCurrentEmail(storedEmail);
    } else {
      setEmails([]);
      setLoadingEmails(false);
    }
  }, []);

  useEffect(() => {
    handleEmailChange();
    window.addEventListener('emailChanged', handleEmailChange);
    return () => {
      window.removeEventListener('emailChanged', handleEmailChange);
    };
  }, [handleEmailChange]);

  useEffect(() => {
    if (!currentEmail) {
      setLoadingEmails(false);
      setEmails([]);
      return;
    }

    setLoadingEmails(true);
    const q = query(
      collection(db, 'inbox'),
      where('recipient', '==', currentEmail),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const emailsData: Email[] = [];
      querySnapshot.forEach((doc) => {
        emailsData.push({ id: doc.id, ...doc.data() } as Email);
      });
      setEmails(emailsData);
      setLoadingEmails(false);
    }, (error) => {
      console.error("Error fetching emails: ", error);
      toast({
        variant: 'destructive',
        title: T('Error fetching emails'),
        description: T('Could not connect to the inbox. Please check your connection and security rules.'),
      });
      setLoadingEmails(false);
    });

    return () => unsubscribe();
  }, [currentEmail, toast, T]);

  const onSummarize = async (emailId: string, body: string) => {
    setLoadingSummaries((prev) => ({ ...prev, [emailId]: true }));
    const result = await handleSummarize(body);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: T('Summarization Failed'),
        description: T(result.error),
      });
    } else if (result.summary) {
      setSummaries((prev) => ({ ...prev, [emailId]: result.summary }));
    }
    setLoadingSummaries((prev) => ({ ...prev, [emailId]: false }));
  };

  const deleteEmail = async (emailId: string) => {
    try {
      await deleteDoc(doc(db, "inbox", emailId));
      toast({
        title: T('Email Deleted'),
        description: T('The email has been successfully deleted.'),
      });
    } catch (error) {
      console.error("Error deleting email: ", error);
      toast({
        variant: 'destructive',
        title: T('Delete Failed'),
        description: T('Could not delete the email. Please try again.'),
      });
    }
  };

  if (loadingEmails) {
    return (
      <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-4 border border-dashed rounded-lg">
        <Loader2 className="h-12 w-12 animate-spin" />
        <h3 className="text-xl font-semibold">{T('Loading your inbox...')}</h3>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-4 border border-dashed rounded-lg">
        <InboxIcon className="h-12 w-12" />
        <h3 className="text-xl font-semibold">{T('Your inbox is empty.')}</h3>
        <p className="text-sm">{T('Emails sent to your temporary address will appear here.')}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {emails.map((email) => (
          <AccordionItem
            value={`item-${email.id}`}
            key={email.id}
            className="border rounded-lg bg-card/50 data-[state=open]:bg-muted/30 transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.01]"
          >
            <AccordionTrigger className="hover:no-underline px-4 py-3 text-left w-full">
              <div className="flex justify-between items-center w-full gap-4">
                <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                   <span className="font-medium text-foreground truncate col-span-1">
                    {email.sender}
                  </span>
                  <span className="text-muted-foreground truncate col-span-2">
                    {email.subject}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-destructive/20 hover:text-destructive shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEmail(email.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{T('Delete email')}</span>
                  </Button>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <div className="border-t pt-4">
                <p className="whitespace-pre-wrap text-foreground/80 mb-6">{email.body}</p>

                {summaries[email.id] && (
                  <Alert className="bg-primary/10 border-primary/30">
                    <Wand2 className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary font-headline">
                      {T('AI Summary')}
                    </AlertTitle>
                    <AlertDescription className="text-primary-foreground/80">
                      {summaries[email.id]}
                    </AlertDescription>
                  </Alert>
                )}

                {email.body.split(' ').length > 50 && !summaries[email.id] && (
                  <Button
                    onClick={() => onSummarize(email.id, email.body)}
                    disabled={loadingSummaries[email.id]}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {loadingSummaries[email.id] ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    {T('Summarize with AI')}
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
