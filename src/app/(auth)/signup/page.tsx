
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is no longer needed with anonymous auth, we redirect to login.
export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
