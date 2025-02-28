'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Skip SSR completely for the client component
const CharacterPageClient = dynamic(
  () => import('./CharacterPageClient'),
  { ssr: false }
);

interface ClientWrapperProps {
  characterName: string;
}

export default function ClientWrapper({ characterName }: ClientWrapperProps) {
  // Use state to track if we're on the client
  const [mounted, setMounted] = useState(false);
  
  // Only after component mounts on the client, set mounted to true
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During server rendering and initial hydration, show a simple loading state
  // This ensures exact match between server and client until hydration is complete
  if (!mounted) {
    return <div className="p-4 text-center">Loading character data...</div>;
  }
  
  // Only render the actual component after hydration is complete
  return <CharacterPageClient characterName={characterName} />;
} 