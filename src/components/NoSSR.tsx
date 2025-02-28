'use client';

import { useEffect, useState, ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// This component prevents server-side rendering entirely
// It will only render its children on the client side
// This is a sledgehammer approach to fixing hydration issues
export default function NoSSR({ children, fallback = null }: NoSSRProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</> || null;
  }

  return <>{children}</>;
} 