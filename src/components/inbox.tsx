'use client';

import { useState } from 'react';
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

const mockEmailsData = [
  {
    id: 1,
    sender: 'newsletter@techweekly.io',
    subject: 'Weekly Digest: AI breakthroughs, new gadgets, and funding news',
    body: `Hello Tech Enthusiast,

This week in tech, we're diving deep into the rapid advancements in generative AI and what it means for the creative industries. Several companies have announced groundbreaking models that can produce text, images, and even video with unprecedented quality. We explore the ethical implications and the potential for disruption across various sectors.

On the hardware front, a new player has entered the smartphone market with a device that promises a week-long battery life and a foldable screen that is virtually indestructible. Our initial hands-on review suggests that while some claims might be exaggerated, the battery performance is indeed impressive. We'll have a full report next week after more extensive testing.

In the world of startups, venture capital funding seems to be picking up again after a slow quarter. A particular focus is on sustainable technology and green energy solutions. A company that has developed a novel method for carbon capture just closed a $100 million Series B round, signaling strong investor confidence in climate tech. We've got an exclusive interview with the founders.

Finally, don't forget to check out our podcast where we discuss the rise of decentralized social media and whether it can truly challenge the dominance of established platforms. The episode features a debate between two leading experts in the field.

Best regards,
The Tech Weekly Team`,
  },
  {
    id: 2,
    sender: 'Promotions@fashionsale.com',
    subject: "FLASH SALE: 50% Off Everything, This Weekend Only!",
    body: 'Hi there,\n\nOur biggest sale of the year is here! For this weekend only, get an incredible 50% off on all items, including new arrivals. This is a limited time offer, so don\'t wait!\n\nShop now and refresh your wardrobe for half the price.\n\nHappy shopping,\nThe FashionSale Team',
  },
  {
    id: 3,
    sender: 'security@mybank.com',
    subject: 'Important Security Alert: New Device Sign-In',
    body: 'Dear Customer,\n\nWe detected a new sign-in to your account from an unrecognized device. If this was you, you can safely disregard this email. If you do not recognize this activity, please reset your password immediately and review your recent transactions.\n\nDevice: Chrome on Windows\nLocation: New York, USA (Approximate)\n\nThank you for helping us keep your account secure.\n\nSincerely,\nMyBank Security',
  },
];

interface Email {
  id: number;
  sender: string;
  subject: string;
  body: string;
}

export function Inbox() {
  const [emails, setEmails] = useState<Email[]>(mockEmailsData);
  const [summaries, setSummaries] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const onSummarize = async (emailId: number, body: string) => {
    setLoading((prev) => ({ ...prev, [emailId]: true }));
    const result = await handleSummarize(body);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: result.error,
      });
    } else if (result.summary) {
      setSummaries((prev) => ({ ...prev, [emailId]: result.summary }));
    }
    setLoading((prev) => ({ ...prev, [emailId]: false }));
  };

  const deleteEmail = (emailId: number) => {
    setEmails(emails.filter((email) => email.id !== emailId));
  };

  if (emails.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16 flex flex-col items-center gap-4 border border-dashed rounded-lg">
        <InboxIcon className="h-12 w-12" />
        <h3 className="text-xl font-semibold">Your inbox is empty.</h3>
        <p className="text-sm">Emails sent to your temporary address will appear here.</p>
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
            className="border rounded-lg bg-card/50 data-[state=open]:bg-muted/30 transition-colors"
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
                    <span className="sr-only">Delete email</span>
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
                      AI Summary
                    </AlertTitle>
                    <AlertDescription className="text-primary-foreground/80">
                      {summaries[email.id]}
                    </AlertDescription>
                  </Alert>
                )}

                {email.body.split(' ').length > 50 && !summaries[email.id] && (
                  <Button
                    onClick={() => onSummarize(email.id, email.body)}
                    disabled={loading[email.id]}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {loading[email.id] ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Summarize with AI
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
