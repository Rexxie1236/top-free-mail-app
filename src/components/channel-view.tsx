
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
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

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
  const [newChannelName, setNewChannelName] = useState('');
  const { T } = useTranslation();
  const { user } = useAuth();

  const getChannelsFromDb = useCallback(async () => {
    if (!user) return [];
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().channels || [];
    }
    return [];
  }, [user]);

  const getActiveChannelFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
       return sessionStorage.getItem('currentEmail');
    }
    return null;
  }, []);


  useEffect(() => {
    const init = async () => {
      if(!user) return;

      const storedChannels = await getChannelsFromDb();
      const active = getActiveChannelFromStorage();
      
      if (storedChannels.length > 0) {
        setChannels(storedChannels);
         if (active && storedChannels.includes(active)) {
          setActiveChannel(active);
        } else {
          const newActive = storedChannels[0];
          setActiveChannel(newActive);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('currentEmail', newActive);
          }
        }
      } else {
        createNewChannel();
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, getChannelsFromDb, getActiveChannelFromStorage]);

  const createNewChannel = async () => {
    if (!user) return;
    const namePart = newChannelName.trim() === '' ? generateRandomString(10) : newChannelName.trim().replace(/\s+/g, '.');
    const newEmail = `${namePart}@topfreemail.dev`;
    
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { channels: arrayUnion(newEmail) });

    const newChannels = [...channels, newEmail];
    setChannels(newChannels);
    switchActiveChannel(newEmail);
    setNewChannelName('');
  };

  const deleteChannel = async (channelToDelete: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, { channels: arrayRemove(channelToDelete) });

    const newChannels = channels.filter((c) => c !== channelToDelete);
    setChannels(newChannels);

    if (activeChannel === channelToDelete) {
      if (newChannels.length > 0) {
        switchActiveChannel(newChannels[0]);
      } else {
        // If the last channel is deleted, create a new one.
        await createNewChannel();
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
            <CardTitle>{T('channel.title')}</CardTitle>
            <CardDescription>
              {T('channel.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="new-channel-name" className="text-sm font-medium">{T('channel.newAddress')}</Label>
               <div className="flex items-center space-x-2">
                 <Input 
                   id="new-channel-name"
                   placeholder={T('channel.optionalName')}
                   value={newChannelName}
                   onChange={(e) => setNewChannelName(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && createNewChannel()}
                 />
                <Button onClick={createNewChannel} size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
               </div>
            </div>
            <Separator />
            <ScrollArea className="h-96">
              <div className="space-y-2 ltr:pr-4 rtl:pl-4">
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
                {T('channel.inboxTitle')}
            </h2>
            <Inbox />
        </div>
      </div>
    </div>
  );
}
