'use client';

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

export function ChangeEmailAddress() {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/50 shadow-lg shadow-primary/10 border-border">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">
          Change E-mail Address
        </CardTitle>
        <CardDescription className="max-w-2xl mx-auto pt-2">
          You can change or recover your temporary email address by entering a
          desired email and selecting a domain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4 max-w-sm mx-auto">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="login" className="sr-only">Login</Label>
              <Input
                id="login"
                placeholder="Login"
                className="bg-muted/50 rounded-full h-12 px-6"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
               <Label htmlFor="domain" className="sr-only">Domain</Label>
              <Select>
                <SelectTrigger id="domain" className="bg-muted/50 rounded-full h-12 px-6 border-2 border-accent text-muted-foreground">
                  <SelectValue placeholder="@domain***1.com" />
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
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button className="w-full max-w-sm mx-auto rounded-lg h-12 text-base">
          Save Address
        </Button>
      </CardFooter>
    </Card>
  );
}
