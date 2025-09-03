
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();
  const { T } = useTranslation();

  const formSchema = z.object({
    email: z.string().email({ message: T('auth.validation.email') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const error = await sendPasswordReset(values.email);
    if (error) {
      toast({
        variant: 'destructive',
        title: T('auth.error.title'),
        description: error.message,
      });
      setIsLoading(false);
    } else {
      setEmailSent(true);
      setIsLoading(false);
    }
  };
  
  if (emailSent) {
    return (
       <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="items-center text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <CardTitle className="text-2xl">{T('auth.forgotPassword.emailSentTitle')}</CardTitle>
            <CardDescription>{T('auth.forgotPassword.emailSentDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild className="w-full">
                <Link href="/login">{T('auth.forgotPassword.backToLogin')}</Link>
            </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{T('auth.forgotPassword.title')}</CardTitle>
        <CardDescription>{T('auth.forgotPassword.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{T('auth.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {T('auth.forgotPassword.button')}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
           <Link href="/login" className="underline">
            {T('auth.forgotPassword.backToLogin')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
