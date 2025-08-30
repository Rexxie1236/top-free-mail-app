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
        <CardTitle className="text-center font-headline text-2xl text-primary">
          Your Temporary Email Address
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div className="w-full max-w-2xl">
          <Input
            readOnly
            value={email}
            aria-label="Temporary Email Address"
            className="text-center font-mono bg-muted/50 h-12 px-4 text-base"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {email !== 'generating...' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 w-32 text-sm px-4 rounded-lg">
                  <QrCode className="mr-2" />
                  Show QR
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
            variant="outline"
            className="h-12 w-32 text-sm px-4 rounded-lg"
          >
            <Copy className="mr-2" />
            {copyText}
          </Button>
          <Button
            onClick={generateNewEmail}
            variant="secondary"
            className="h-12 w-32 text-sm px-4 rounded-lg"
          >
            <RefreshCw className="mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="h-12 w-32 text-sm px-4 rounded-lg">
            <Settings className="mr-2" />
            Customize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
