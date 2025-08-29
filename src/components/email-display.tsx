'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Copy, RefreshCw, QrCode, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

function generateRandomString(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function EmailDisplay() {
  const [email, setEmail] = useState('generating...');
  const [copyText, setCopyText] = useState('Copy');
  const { toast } = useToast();

  const generateNewEmail = () => {
    const randomPart = generateRandomString(10);
    setEmail(`${randomPart}@topfreemail.dev`);
  };

  useEffect(() => {
    generateNewEmail();
  }, []);

  const copyToClipboard = () => {
    if (email === 'generating...') return;
    navigator.clipboard.writeText(email);
    setCopyText('Copied!');
    toast({
      title: 'Copied to clipboard!',
      description: email,
    });
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
  };

  return (
    <Card className="w-full bg-card/50 shadow-lg shadow-primary/10 border-border">
      <CardHeader>
        <CardTitle className="text-center font-headline text-3xl text-primary">
          Your Temporary Email Address
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="w-full">
          <Input
            readOnly
            value={email}
            aria-label="Temporary Email Address"
            className="text-base text-center font-mono bg-muted/50 h-14 px-4"
          />
        </div>
        <div className="flex flex-col gap-4 items-center w-full max-w-sm">
          <div className="flex items-stretch gap-4 w-full">
            {email !== 'generating...' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="p-2 h-auto flex-col gap-2 w-28"
                  >
                    <QrCode className="h-10 w-10" />
                    <span className="text-xs text-muted-foreground">
                      Show QR
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 bg-white">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${email}&qzone=1`}
                    alt="Email QR Code"
                    width={150}
                    height={150}
                    data-ai-hint="qr code"
                  />
                </PopoverContent>
              </Popover>
            )}
            <Button
              onClick={copyToClipboard}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto flex-1 flex-col"
            >
              <Copy className="h-6 w-6 mb-1" />
              <span className="text-base">{copyText}</span>
            </Button>
          </div>
          <div className="flex gap-2 justify-center w-full">
            <Button onClick={generateNewEmail} variant="secondary" className="w-full">
              <RefreshCw />
              Refresh
            </Button>
            <Button variant="outline" className="w-full">
              <Settings />
              Customize
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
