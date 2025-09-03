
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { handleReceiveEmail } from '@/app/actions';
import { Loader2 } from 'lucide-react';

export function DevPanel() {
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { T } = useTranslation();

  const handleSubmit = async () => {
    if (!recipient || !sender || !subject || !body) {
      toast({
        variant: 'destructive',
        title: T('devPanel.error.allFieldsRequired.title'),
        description: T('devPanel.error.allFieldsRequired.description'),
      });
      return;
    }
    setIsLoading(true);
    const result = await handleReceiveEmail({ recipient, sender, subject, body });
    if (result.error) {
      toast({
        variant: 'destructive',
        title: T('devPanel.error.submissionFailed.title'),
        description: result.error,
      });
    } else {
      toast({
        title: T('devPanel.success.title'),
        description: T('devPanel.success.description'),
      });
      // Optionally clear the form
      // setRecipient('');
      setSender('');
      setSubject('');
      setBody('');
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-dashed">
      <CardHeader>
        <CardTitle>{T('devPanel.title')}</CardTitle>
        <CardDescription>{T('devPanel.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">{T('devPanel.recipientLabel')}</Label>
            <Input
              id="recipient"
              placeholder={T('devPanel.recipientPlaceholder')}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender">{T('devPanel.senderLabel')}</Label>
            <Input
              id="sender"
              placeholder={T('devPanel.senderPlaceholder')}
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">{T('devPanel.subjectLabel')}</Label>
          <Input
            id="subject"
            placeholder={T('devPanel.subjectPlaceholder')}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">{T('devPanel.bodyLabel')}</Label>
          <Textarea
            id="body"
            placeholder={T('devPanel.bodyPlaceholder')}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading}>
           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {T('devPanel.sendButton')}
        </Button>
      </CardFooter>
    </Card>
  );
}
