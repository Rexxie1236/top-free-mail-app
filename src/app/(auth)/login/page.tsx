
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Separator } from '@/components/ui/separator';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    ></path>
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 3.02-2.31 5.45-4.92 7.18l7.98 6.19c4.7-4.32 7.4-10.63 7.4-17.33z"
    ></path>
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
    ></path>
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.98-6.19c-2.11 1.42-4.82 2.26-7.91 2.26-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    ></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const { T } = useTranslation();

  const formSchema = z.object({
    email: z.string().email({ message: T('auth.validation.email') }),
    password: z.string().min(1, { message: T('auth.validation.passwordRequired') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const error = await signInWithEmail(values.email, values.password);
    if (error) {
      toast({
        variant: 'destructive',
        title: T('auth.error.title'),
        description: T('auth.error.invalidCredentials'),
      });
      setIsLoading(false);
    } else {
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const error = await signInWithGoogle();
    if (error) {
      console.error('Google Login Error:', error);
      toast({
        variant: 'destructive',
        title: T('auth.error.title'),
        description: error.message,
      });
      setIsGoogleLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{T('auth.loginTitle')}</CardTitle>
        <CardDescription>{T('auth.loginDescription')}</CardDescription>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                   <div className="flex items-center">
                    <FormLabel>{T('auth.passwordLabel')}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline"
                    >
                      {T('auth.forgotPassword.link')}
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {T('auth.loginButton')}
            </Button>
          </form>
        </Form>
        {/* <Separator className="my-4" />
        <Button
          onClick={handleGoogleLogin}
          className="w-full"
          disabled={isGoogleLoading || isLoading}
          variant="outline"
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {T('auth.orContinueWith')} Google
        </Button> */}
        <div className="mt-4 text-center text-sm">
          {T('auth.dontHaveAccount')}{' '}
          <Link href="/signup" className="underline">
            {T('auth.signUpLink')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
