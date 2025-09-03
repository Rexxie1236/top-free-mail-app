
'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmailDisplay } from './email-display';
import { Inbox } from './inbox';
import { AdBanner } from './ad-banner';
import { Separator } from './ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

function generateRandomString(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function ChannelView() {
  const [channels, setChannels] = useState<string[]>([]);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  const getChannelsFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedChannels = sessionStorage.getItem('channels');
      return storedChannels ? JSON.parse(storedChannels) : [];
    }
    return [];
  }, []);

  const getActiveChannelFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
       return sessionStorage.getItem('currentEmail');
    }
    return null;
  }, []);


  useEffect(() => {
    const storedChannels = getChannelsFromStorage();
    const active = getActiveChannelFromStorage();
    
    if (storedChannels.length > 0) {
      setChannels(storedChannels);
       if (active && storedChannels.includes(active)) {
        setActiveChannel(active);
      } else {
        const newActive = storedChannels[0];
        setActiveChannel(newActive);
        sessionStorage.setItem('currentEmail', newActive);
      }
    } else {
      createNewChannel();
    }
  }, []);

  const syncChannelsToStorage = (newChannels: string[]) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('channels', JSON.stringify(newChannels));
    }
  };

  const createNewChannel = () => {
    const randomPart = generateRandomString(10);
    const newEmail = `${randomPart}@topfreemail.dev`;
    const newChannels = [...channels, newEmail];
    setChannels(newChannels);
    syncChannelsToStorage(newChannels);
    switchActiveChannel(newEmail);
  };

  const deleteChannel = (channelToDelete: string) => {
    const newChannels = channels.filter((c) => c !== channelToDelete);
    setChannels(newChannels);
    syncChannelsToStorage(newChannels);

    if (activeChannel === channelToDelete) {
      if (newChannels.length > 0) {
        switchActiveChannel(newChannels[0]);
      } else {
        createNewChannel();
      }
    }
  };

  const switchActiveChannel = (channel: string) => {
    setActiveChannel(channel);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('currentEmail', channel);
      window.dispatchEvent(new Event('emailChanged'));
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Email Channels</CardTitle>
            <CardDescription>
              Manage multiple temporary email addresses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={createNewChannel} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Create New Address
            </Button>
            <Separator />
            <ScrollArea className="h-96">
              <div className="space-y-2 pr-4">
                {channels.map((channel) => (
                  <div
                    key={channel}
                    onClick={() => switchActiveChannel(channel)}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                      activeChannel === channel
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="truncate text-sm font-mono">{channel}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-6 w-6 shrink-0 ${activeChannel === channel ? 'hover:bg-primary/80' : 'hover:bg-destructive/20 text-muted-foreground hover:text-destructive'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChannel(channel);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-8">
        <EmailDisplay />
        <AdBanner />
        <Separator />
        <div>
            <h2 className="text-3xl font-bold font-headline text-center mb-6">
                Your Inbox
            </h2>
            <Inbox />
        </div>
      </div>
    </div>
  );
}
