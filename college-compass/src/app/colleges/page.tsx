'use client';

import { Suspense } from 'react';
import CollegesContent from './CollegesContent';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="container mx-auto flex-grow px-4 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Loading Colleges</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CollegesContent />
    </Suspense>
  );
}
