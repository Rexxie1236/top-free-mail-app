
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, TestTube2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export function DevPanel() {
  const [sender, setSender] = useState('promo@example.com');
  const [subject, setSubject] = useState('Your Next Big Offer!');
  const [body, setBody] = useState('Hello, we have a special deal just for you...');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { T } = useTranslation();

  const handleSendTestEmail = async () => {
    setIsLoading(true);
    const recipient = sessionStorage.getItem('currentEmail');

    if (!recipient) {
      toast({
        variant: 'destructive',
        title: T('devPanel.error.noRecipient.title'),
        description: T('devPanel.error.noRecipient.description'),
      });
      setIsLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'inbox'), {
        recipient,
        sender,
        subject,
        body,
        createdAt: serverTimestamp(),
      });
      toast({
        title: T('devPanel.success.title'),
        description: `${T('devPanel.success.description.part1')} ${recipient} ${T('devPanel.success.description.part2')}`,
      });
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        variant: 'destructive',
        title: T('devPanel.error.sendFailed.title'),
        description: T('devPanel.error.sendFailed.description'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/50 shadow-lg shadow-primary/10 border-border text-left transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.01]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube2 className="text-primary" />
          {T('devPanel.title')}
        </CardTitle>
        <CardDescription>
          {T('devPanel.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dev-sender">{T('devPanel.senderLabel')}</Label>
            <Input
              id="dev-sender"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="sender@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dev-subject">{T('devPanel.subjectLabel')}</Label>
            <Input
              id="dev-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your email subject"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dev-body">{T('devPanel.bodyLabel')}</Label>
          <Textarea
            id="dev-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="The content of the email."
            rows={4}
          />
        </div>
        <Button onClick={handleSendTestEmail} disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white-900 mr-2"></div>
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {T('devPanel.sendButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
