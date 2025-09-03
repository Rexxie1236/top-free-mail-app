'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Copy, RefreshCw, QrCode, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function generateRandomString(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const REFRESH_INTERVAL = 30; // 30 seconds

export function EmailDisplay() {
  const [email, setEmail] = useState('generating...');
  const [copyText, setCopyText] = useState('Copy');
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const { toast } = useToast();

  const handleRefreshInbox = useCallback(() => {
    window.dispatchEvent(new Event('refreshInbox'));
    setCountdown(REFRESH_INTERVAL);
    toast({
      title: 'Inbox Refreshed',
      description: 'Checked for new emails.',
    });
  }, [toast]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRefreshInbox();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleRefreshInbox]);

  const generateNewEmail = () => {
    const randomPart = generateRandomString(10);
    const newEmail = `${randomPart}@topfreemail.dev`;
    setEmail(newEmail);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentEmail', newEmail);
      window.dispatchEvent(new Event('emailChanged'));
    }
  };

  const handleEmailChange = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('currentEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        generateNewEmail();
      }
    }
  }, []);

  useEffect(() => {
    handleEmailChange();
    window.addEventListener('emailChanged', handleEmailChange);
    return () => {
      window.removeEventListener('emailChanged', handleEmailChange);
    };
  }, [handleEmailChange]);

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
    <Card className="w-full bg-card/50 shadow-lg shadow-primary/10 border-border transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.01]">
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
        <TooltipProvider>
          <div className="flex flex-row items-center justify-center gap-4">
            {email !== 'generating...' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-lg">
                        <QrCode />
                        <span className="sr-only">Show QR Code</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2 bg-white">
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=mailto:${email}&qzone=1`}
                        alt="Email QR Code"
                        width={150}
                        height={150}
                        data-ai-hint="qr code"
                      />
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show QR Code</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-lg"
                >
                  <Copy />
                  <span className="sr-only">{copyText}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copyText}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={generateNewEmail}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-lg"
                >
                  <PlusSquare />
                  <span className="sr-only">New Email</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate New Email</p>
              </TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleRefreshInbox}
                  variant="secondary"
                  className="h-12 rounded-lg px-4"
                >
                  <RefreshCw />
                  <span>({countdown}s)</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Inbox</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
