
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { TranslationProvider, useTranslation } from '@/hooks/use-translation';
import { AuthProvider } from '@/hooks/use-auth';

// export const metadata: Metadata = {
//   title: 'TopFreeMail',
//   description: 'Your secure temporary email service.',
// };

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { direction } = useTranslation();

  return (
    <html lang="en" suppressHydrationWarning dir={direction}>
      <head>
        <title>TopFreeMail - Your secure temporary email service.</title>
        <meta name="description" content="Your secure temporary email service." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TranslationProvider>
      <AuthProvider>
        <AppLayout>{children}</AppLayout>
      </AuthProvider>
    </TranslationProvider>
  );
}
