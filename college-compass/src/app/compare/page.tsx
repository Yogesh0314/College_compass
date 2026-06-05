'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Star, GraduationCap, X, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { College, Course } from '@/types';

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('compare_colleges');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [savedColleges, setSavedColleges] = useState<College[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingSaved, setLoadingSaved] = useState(true);

  const fetchSavedColleges = async () => {
    try {
      const res = await fetch('/api/saved-colleges');
      if (res.ok) {
        const data = await res.json();
        setSavedColleges(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSaved(false);
    }
  };

  // Load initial state
  useEffect(() => {
    fetchSavedColleges();
  }, []);

  // Persist state to LocalStorage
  useEffect(() => {
    localStorage.setItem('compare_colleges', JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    if (search.length > 2) {
      fetch(`/api/colleges?q=${search}&limit=5`)
        .then(res => res.json())
        .then(data => setSearchResults(data.colleges || []));
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const addCollege = (id: string) => {
    if (!selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setSearch('');
      setSearchResults([]);
    }
  };

  const removeCollege = (id: string) => {
    setSelectedIds(selectedIds.filter(sid => sid !== id));
  };

  useEffect(() => {
    if (selectedIds.length > 0) {
      // Fetch details for all selected colleges
      Promise.all(selectedIds.map(id => fetch(`/api/colleges/${id}`).then(res => res.json())))
        .then(data => {
          const validColleges = data.filter(c => c && !c.error && c.courses);
          setColleges(validColleges);
          
          // Sync selectedIds if some were invalid (e.g., after re-seed)
          if (validColleges.length !== data.length) {
            setSelectedIds(validColleges.map(c => c.id));
          }
        });
    } else {
      setColleges([]);
    }
  }, [selectedIds]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="container mx-auto flex-grow px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-black tracking-tight text-gray-900">Compare <span className="text-blue-600">Institutions.</span></h1>
          <p className="text-lg font-medium text-gray-500">Analyze features side-by-side to make an informed decision.</p>
        </div>

        {/* Quick Add from Saved */}
        {savedColleges.length > 0 && (
          <div className="mb-12">
             <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-gray-400">Quick Add from Saved</h3>
             <div className="flex flex-wrap gap-4">
                {savedColleges.map((c) => (
                  <button
                    key={c.id}
                    disabled={selectedIds.includes(c.id)}
                    onClick={() => addCollege(c.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-6 py-4 text-sm font-bold transition-all",
                      selectedIds.includes(c.id)
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-md"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 disabled:opacity-30"
                    )}
                  >
                    <Star className={cn("h-4 w-4", selectedIds.includes(c.id) ? "fill-current" : "")} />
                    {c.name}
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Search & Add */}
        <div className="mx-auto mb-16 max-w-3xl relative">
          <div className="relative group">
            <Search className="absolute left-6 top-5.5 h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Type to search and add more colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[2rem] border border-gray-200 bg-gray-50 py-5.5 pl-16 pr-6 text-lg font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 shadow-sm transition-all placeholder:text-gray-400"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute z-20 mt-4 w-full overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {searchResults.map((c: College) => (
                <button
                  key={c.id}
                  disabled={selectedIds.includes(c.id)}
                  onClick={() => addCollege(c.id)}
                  className="flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-sm font-medium text-gray-400">{c.location}</p>
                  </div>
                  {selectedIds.includes(c.id) && <span className="text-xs font-black uppercase text-blue-600">Added</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {colleges.length > 0 ? (
          <div className="overflow-x-auto rounded-[3rem] border border-gray-100 bg-white shadow-2xl shadow-blue-500/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-10 text-xs font-black text-gray-400 uppercase tracking-widest min-w-[200px]">Key Features</th>
                  {colleges.map((c: College) => (
                    <th key={c.id} className="p-10 min-w-[350px]">
                      <div className="relative">
                        <button 
                          onClick={() => removeCollege(c.id)}
                          className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-90"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200">
                          <GraduationCap className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight tracking-tight">{c.name}</h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="group">
                  <td className="p-10 font-bold text-gray-500 group-hover:text-blue-600 transition-colors">Annual Fees</td>
                  {colleges.map((c: College) => (
                    <td key={c.id} className="p-10 text-2xl font-black text-gray-900">₹{(c.fees/1000).toFixed(0)}k<span className="text-sm font-bold text-gray-400 ml-1">/yr</span></td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="p-10 font-bold text-gray-500 group-hover:text-blue-600 transition-colors">User Rating</td>
                  {colleges.map((c: College) => (
                    <td key={c.id} className="p-10">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-4 py-2 font-black text-amber-500 border border-amber-100">
                           <Star className="h-5 w-5 fill-current" />
                           {c.rating}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="p-10 font-bold text-gray-500 group-hover:text-blue-600 transition-colors">Placements</td>
                  {colleges.map((c: College) => (
                    <td key={c.id} className="p-10">
                       <div className="flex items-center gap-3">
                          <div className="h-3 w-32 rounded-full bg-gray-100 overflow-hidden">
                             <div className="h-full bg-green-500 rounded-full" style={{ width: `${c.placementRate}%` }}></div>
                          </div>
                          <span className="text-xl font-black text-gray-900">{c.placementRate}%</span>
                       </div>
                    </td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="p-10 font-bold text-gray-500 group-hover:text-blue-600 transition-colors">Location</td>
                  {colleges.map((c: College) => (
                    <td key={c.id} className="p-10 text-lg font-bold text-gray-600">{c.location}</td>
                  ))}
                </tr>
                <tr className="group">
                  <td className="p-10 font-bold text-gray-500 group-hover:text-blue-600 transition-colors">Academic Programs</td>
                  {colleges.map((c: College) => (
                    <td key={c.id} className="p-10">
                      <div className="flex flex-wrap gap-2">
                        {c.courses.slice(0, 3).map((course: Course) => (
                          <span key={course.id} className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-2 text-xs font-black text-gray-500 uppercase tracking-tight hover:border-blue-200 hover:text-blue-600 transition-all cursor-default">
                            {course.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-10"></td>
                  {colleges.map((c: College) => (
                    <td key={c.id} className="p-10">
                      <Link 
                        href={`/colleges/${c.id}`}
                        target="_blank"
                        className="flex w-full items-center justify-center rounded-2xl bg-gray-900 py-5 text-sm font-black text-white shadow-xl transition-all hover:bg-blue-600 hover:-translate-y-1 active:scale-95"
                      >
                        Visit Profile
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-gray-100 bg-white p-12 text-center">
            <div className="mb-8 rounded-full bg-blue-50 p-10 text-blue-200">
              <LayoutGrid className="h-16 w-16" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Comparison tool ready.</h3>
            <p className="max-w-md text-gray-400 text-lg font-medium">
              Start by searching for institutions or use your saved colleges above to see side-by-side analysis.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
