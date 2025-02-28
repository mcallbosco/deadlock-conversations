'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/characters', label: 'Characters' },
    { href: '/conversations', label: 'All Conversations' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-400">
              Deadlock Conversations
            </Link>
            
            <nav>
              <ul className="flex space-x-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className={`hover:text-blue-400 transition-colors ${
                        pathname === link.href ? 'text-blue-400 font-semibold' : 'text-gray-300'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-800 py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 space-y-3">
            <p>Deadlock Conversations Viewer</p>
            <p>
              Valve, the Valve logo, Steam, the Steam logo, Deadlock, and the Deadlock logo are trademarks and/or registered trademarks of{' '}
              <a href="https://www.valvesoftware.com/en/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                Valve Corporation
              </a>
              .
              <br />
              Deadlock Conversations Viewer is a fan website and not associated with Valve.
            </p>
            <p>
              Designed by{' '}
              <a href="https://mcallbos.co" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                Mcall
              </a>
            </p>
            <p className="pt-2">
              <a href="https://ko-fi.com/mcallbosco" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/>
                </svg>
                Buy me a coffee
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 