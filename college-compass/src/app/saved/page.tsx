'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { College } from '@/types';

export default function SavedCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedColleges = async () => {
    try {
      const res = await fetch('/api/saved-colleges');
      if (res.ok) {
        const data = await res.json();
        setColleges(data);
      } else if (res.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login';
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedColleges();
  }, []);

  const handleToggleSave = async (id: string) => {
    try {
      const res = await fetch('/api/saved-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId: id }),
      });
      if (res.ok) {
        setColleges(colleges.filter((c: College) => c.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="container mx-auto flex-grow px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            My Saved Colleges
          </h1>
          <p className="text-gray-500">View and manage the engineering colleges you&apos;ve bookmarked.</p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : colleges.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college: College) => (
              <CollegeCard 
                key={college.id} 
                college={college} 
                isSaved={true} 
                onToggleSave={handleToggleSave} 
              />
            ))}
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed bg-white p-12 text-center">
            <div className="mb-6 rounded-full bg-red-50 p-6">
              <Heart className="h-12 w-12 text-red-200" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No saved colleges yet</h3>
            <p className="mb-8 max-w-sm text-gray-500 text-lg">
              Start exploring top engineering colleges and save your favorites to compare them later.
            </p>
            <Link 
              href="/colleges" 
              className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
            >
              Browse Colleges
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
