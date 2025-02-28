import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl mb-8">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <div className="space-y-4">
        <p>You can try:</p>
        <div className="flex flex-col space-y-2">
          <Link href="/" className="text-blue-500 hover:underline">
            Go to the Home Page
          </Link>
          <Link href="/conversations/" className="text-blue-500 hover:underline">
            Browse All Conversations
          </Link>
          <Link href="/characters/" className="text-blue-500 hover:underline">
            Browse All Characters
          </Link>
        </div>
      </div>
    </div>
  );
} 