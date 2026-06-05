'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, MapPin, CheckCircle2, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { College, Metadata } from '@/types';

export default function CollegesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({ totalCount: 0, totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  
  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minRating, setMinRating] = useState(parseInt(searchParams.get('minRating') || '0'));
  const [maxFee, setMaxFee] = useState(parseInt(searchParams.get('maxFee') || '1000000'));
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const updateURL = () => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (location) params.set('location', location);
    if (minRating) params.set('minRating', minRating.toString());
    if (maxFee !== 200000) params.set('maxFee', maxFee.toString());
    if (page !== 1) params.set('page', page.toString());
    
    router.push(`/colleges?${params.toString()}`, { scroll: false });
  };

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?q=${search}&location=${location}&maxFee=${maxFee}&page=${page}&limit=6`);
      const data = await res.json();
      
      let filteredColleges = data.colleges;
      if (minRating > 0) {
        filteredColleges = data.colleges.filter((c: College) => c.rating >= minRating);
      }
      
      setColleges(filteredColleges);
      setMetadata(data.metadata);
      updateURL();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, minRating, maxFee, page]);

  const handleToggleSave = async (id: string) => {
    try {
      const res = await fetch('/api/saved-colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(data.message);
      } else if (res.status === 401) {
        window.location.href = `/login?callbackUrl=/colleges`;
      }
    } catch (error) {
      triggerToast("Error saving college");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Toast Notification */}
      <div className={cn(
        "fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 transform transition-all duration-300",
        showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}>
        <div className="flex items-center gap-3 rounded-2xl bg-gray-900 px-6 py-4 text-white shadow-2xl border border-white/10">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <span className="font-medium text-sm tracking-wide">{toastMessage}</span>
        </div>
      </div>

      <main className="container mx-auto flex-grow px-4 py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full space-y-6 lg:w-72">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Filters</h2>
                <div className="rounded-xl bg-gray-50 p-2 text-gray-400">
                   <SlidersHorizontal className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-[0.1em] text-gray-500">Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. Kolhapur"
                      value={location}
                      onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-[0.1em] text-gray-400">Max Annual Fee</label>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="50000" 
                      max="200000" 
                      step="5000"
                      value={maxFee}
                      onChange={(e) => { setMaxFee(parseInt(e.target.value)); setPage(1); }}
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-blue-600"
                    />
                    <div className="flex items-center justify-between text-sm font-bold text-gray-600">
                      <span>₹50k</span>
                      <span className="rounded-lg bg-blue-50 px-3 py-1 text-blue-600">Up to ₹{(maxFee/1000).toFixed(0)}k</span>
                      <span>₹200k</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-bold uppercase tracking-[0.1em] text-gray-400">Min Rating</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => { setMinRating(star === minRating ? 0 : star); setPage(1); }}
                        className={cn(
                          "flex h-12 items-center justify-center rounded-xl border text-sm font-bold transition-all",
                          minRating >= star 
                            ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100" 
                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                        )}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setLocation(''); setMinRating(0); setSearch(''); setMaxFee(200000); setPage(1); }}
                className="mt-10 w-full rounded-2xl border border-gray-100 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
              >
                Reset All
              </button>
            </div>
            
            {/* Quick Predictor CTA */}
            <Link href="/predict" className="group block rounded-[2rem] bg-gray-900 p-8 text-white shadow-xl transition-all hover:-translate-y-1">
               <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20">
                  <Star className="h-6 w-6 text-white" />
               </div>
               <h4 className="mb-2 text-lg font-bold">Admission Predictor</h4>
               <p className="mb-4 text-sm text-gray-400">See which colleges you can get based on your scores.</p>
               <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400">
                  Try Now <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
               </div>
            </Link>
          </aside>

          {/* Main Content */}
          <div className="flex-grow space-y-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Discovery</h1>
                <p className="text-gray-400 font-medium">Found <span className="text-blue-600 font-bold">{metadata.totalCount}</span> institutions matching your criteria</p>
              </div>
              <div className="relative flex-grow md:max-w-md group">
                <Search className="absolute left-5 top-4.5 h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name or course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchColleges()}
                  className="w-full rounded-[1.5rem] border border-gray-200 bg-white py-4.5 pl-14 pr-6 font-bold text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 shadow-sm transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[400px] animate-pulse rounded-3xl bg-gray-50"></div>
                ))}
              </div>
            ) : colleges.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {colleges.map((college: College) => (
                    <CollegeCard 
                      key={college.id} 
                      college={college} 
                      onToggleSave={() => handleToggleSave(college.id)} 
                    />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                <div className="mt-12 flex items-center justify-center gap-4">
                   <button 
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-white transition-all hover:bg-gray-50 disabled:opacity-30"
                   >
                    <ChevronLeft className="h-5 w-5" />
                   </button>
                   <div className="flex items-center gap-2">
                      {[...Array(metadata.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={cn(
                            "h-12 w-12 rounded-2xl text-sm font-bold transition-all",
                            page === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                   </div>
                   <button 
                    disabled={page === metadata.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-white transition-all hover:bg-gray-50 disabled:opacity-30"
                   >
                    <ChevronRight className="h-5 w-5" />
                   </button>
                </div>
              </>
            ) : (
              <div className="flex h-[50vh] flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-gray-100 bg-white p-12 text-center">
                <div className="mb-6 rounded-full bg-blue-50 p-8 text-blue-200">
                  <X className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">No results found</h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto">We couldn&apos;t find any colleges matching your current filters. Try expanding your search area.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
