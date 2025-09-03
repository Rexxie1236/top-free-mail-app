
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function ChangeEmailAddress() {
  const [login, setLogin] = useState('');
  const [domain, setDomain] = useState('topfreemail.dev');
  const { toast } = useToast();
  const { T } = useTranslation();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!login) {
      toast({
        variant: 'destructive',
        title: T('changeEmail.error.emptyLogin.title'),
        description: T('changeEmail.error.emptyLogin.description'),
      });
      return;
    }
    if (!user) return; // Should not happen if component is rendered

    const newEmail = `${login}@${domain}`;

    const userDocRef = doc(db, 'users', user.uid);
    // This will add the email to the user's list of channels in Firestore
    await updateDoc(userDocRef, { channels: arrayUnion(newEmail) });

    // Dispatch a custom event to notify the ChannelView to update
    window.dispatchEvent(new Event('channelsUpdated'));

    toast({
      title: T('changeEmail.success.title'),
      description: `${T('changeEmail.success.description')} ${newEmail}`,
    });
    setLogin('');
  };
  
  if (!user) {
    return null; // Don't render this component if the user is not logged in.
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/50 shadow-lg shadow-primary/10 border-border transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.01]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">
          {T('changeEmail.title')}
        </CardTitle>
        <CardDescription className="max-w-2xl mx-auto pt-2">
          {T('changeEmail.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4 max-w-sm mx-auto">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="login" className="sr-only">
              {T('changeEmail.loginLabel')}
            </Label>
            <Input
              id="login"
              placeholder={T('changeEmail.loginPlaceholder')}
              className="bg-muted/50 rounded-full h-12 px-6"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="domain" className="sr-only">
              {T('changeEmail.domainLabel')}
            </Label>
            <Select onValueChange={setDomain} defaultValue={domain}>
              <SelectTrigger
                id="domain"
                className="bg-muted/50 rounded-full h-12 px-6 border-2 border-accent text-muted-foreground"
              >
                <SelectValue placeholder={T('changeEmail.domainPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="topfreemail.dev">
                  @topfreemail.dev
                </SelectItem>
                <SelectItem value="tempmail.com">@tempmail.com</SelectItem>
                <SelectItem value="disposable.io">@disposable.io</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button
          onClick={handleSave}
          className="w-full max-w-sm mx-auto rounded-lg h-12 text-base"
        >
          {T('changeEmail.saveButton')}
        </Button>
      </CardFooter>
    </Card>
  );
}
