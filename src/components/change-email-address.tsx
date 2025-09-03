
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

export function ChangeEmailAddress() {
  const [login, setLogin] = useState('');
  const [domain, setDomain] = useState('topfreemail.dev');
  const { toast } = useToast();
  const { translate: T } = useTranslation();

  const handleSave = () => {
    if (!login) {
      toast({
        variant: 'destructive',
        title: T('Login cannot be empty'),
        description: T('Please enter a login name for your email address.'),
      });
      return;
    }

    const newEmail = `${login}@${domain}`;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentEmail', newEmail);
      window.dispatchEvent(new Event('emailChanged'));
      toast({
        title: T('Email Address Updated'),
        description: `${T('Your new email address is')} ${newEmail}`,
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/50 shadow-lg shadow-primary/10 border-border transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.01]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">
          {T('Change E-mail Address')}
        </CardTitle>
        <CardDescription className="max-w-2xl mx-auto pt-2">
          {T('You can change or recover your temporary email address by entering a desired email and selecting a domain.')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4 max-w-sm mx-auto">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="login" className="sr-only">
              {T('Login')}
            </Label>
            <Input
              id="login"
              placeholder={T('Login')}
              className="bg-muted/50 rounded-full h-12 px-6"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="domain" className="sr-only">
              {T('Domain')}
            </Label>
            <Select onValueChange={setDomain} defaultValue={domain}>
              <SelectTrigger
                id="domain"
                className="bg-muted/50 rounded-full h-12 px-6 border-2 border-accent text-muted-foreground"
              >
                <SelectValue placeholder={T('Select a domain')} />
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
          {T('Save Address')}
        </Button>
      </CardFooter>
    </Card>
  );
}
