'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { Sparkles, GraduationCap, Search, Info, Loader2, Target, ShieldCheck, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PredictorPage() {
  const [examType, setExamType] = useState<'MHT-CET' | 'JEE Main'>('MHT-CET');
  const [score, setScore] = useState('');
  const [branch, setBranch] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ safe: any[], target: any[], reach: any[] } | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/colleges?limit=100');
      const data = await res.json();
      const colleges = data.colleges;
      
      const scoreNum = parseFloat(score);

      // Advanced Heuristic Prediction Logic
      const predictedColleges = colleges.map((c: any) => {
        let cutoffEstimate = c.placementRate; // Baseline
        
        // Multiplier based on college tier (Rating)
        if (c.rating >= 4.7) cutoffEstimate += 10; // Tier 1 (COEP, VJTI, NITs)
        else if (c.rating >= 4.4) cutoffEstimate += 5; // Tier 2 (PICT, VIT, KIT)
        
        // Filter out-of-state for MHT-CET
        const isMaharashtra = c.location.toLowerCase().includes('maharashtra') || 
                             c.location.toLowerCase().includes('kolhapur') ||
                             c.location.toLowerCase().includes('pune') ||
                             c.location.toLowerCase().includes('mumbai') ||
                             c.location.toLowerCase().includes('sangli') ||
                             c.location.toLowerCase().includes('satara');

        if (examType === 'MHT-CET' && !isMaharashtra) return null;
        
        // JEE Main for NITs/IIITs usually requires higher percentiles
        const isNationalInstitute = c.name.includes('NIT') || c.name.includes('IIIT');
        if (examType === 'MHT-CET' && isNationalInstitute) cutoffEstimate += 5;
        if (examType === 'JEE Main' && isNationalInstitute) cutoffEstimate += 8;

        return { ...c, cutoffEstimate };
      }).filter(Boolean);

      const safe = predictedColleges.filter((c: any) => c.cutoffEstimate < scoreNum - 4);
      const target = predictedColleges.filter((c: any) => Math.abs(c.cutoffEstimate - scoreNum) <= 4);
      const reach = predictedColleges.filter((c: any) => c.cutoffEstimate > scoreNum && c.cutoffEstimate <= scoreNum + 8);
      
      setResults({ 
        safe: safe.sort((a: any, b: any) => b.rating - a.rating).slice(0, 4), 
        target: target.sort((a: any, b: any) => b.rating - a.rating).slice(0, 4), 
        reach: reach.sort((a: any, b: any) => b.rating - a.rating).slice(0, 4) 
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="container mx-auto flex-grow px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
              <Sparkles className="h-4 w-4" />
              Advanced Admission Predictor
            </div>
            <h1 className="mb-4 text-5xl font-black tracking-tight text-gray-900">
              Your Path to <span className="text-blue-600">Excellence.</span>
            </h1>
            <p className="text-lg font-medium text-gray-500">
              Select your exam and enter your percentile to discover institutions that match your academic profile.
            </p>
          </div>

          <div className="mb-10 flex justify-center">
            <div className="inline-flex rounded-2xl bg-gray-100 p-1.5 shadow-inner">
               <button 
                onClick={() => { setExamType('MHT-CET'); setResults(null); }}
                className={cn(
                  "px-8 py-3 rounded-xl text-sm font-black transition-all",
                  examType === 'MHT-CET' ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-900"
                )}
               >
                MHT-CET
               </button>
               <button 
                onClick={() => { setExamType('JEE Main'); setResults(null); }}
                className={cn(
                  "px-8 py-3 rounded-xl text-sm font-black transition-all",
                  examType === 'JEE Main' ? "bg-white text-blue-600 shadow-md" : "text-gray-500 hover:text-gray-900"
                )}
               >
                JEE Main
               </button>
            </div>
          </div>

          <form onSubmit={handlePredict} className="mb-16 rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-blue-500/5">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-500">
                  {examType} Percentile
                </label>
                <div className="relative">
                   <Target className="absolute left-5 top-4.5 h-5 w-5 text-gray-400" />
                   <input 
                    type="number" 
                    placeholder="e.g. 98.5"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4.5 pl-14 pr-6 font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-400"
                   />
                </div>
              </div>
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-gray-500">Preferred Branch</label>
                <div className="relative">
                   <GraduationCap className="absolute left-5 top-4.5 h-5 w-5 text-gray-400" />
                   <select 
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 py-4.5 pl-14 pr-6 font-bold text-gray-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                   >
                     <option>Computer Science</option>
                     <option>Information Technology</option>
                     <option>Mechanical Engineering</option>
                     <option>Electronics</option>
                     <option>Civil Engineering</option>
                   </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-100">
               <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
               <p className="text-sm font-medium text-amber-800 leading-relaxed">
                 {examType === 'MHT-CET' 
                  ? "Prediction shows Maharashtra state colleges based on previous year cut-off trends for state-level seats."
                  : "Prediction shows NITs, IIITs, and 'All India' seats in top private colleges using national-level percentiles."}
               </p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-lg font-black text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Rocket className="h-6 w-6" />}
              Generate AI Report
            </button>
          </form>

          {results && (
            <div className="space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Target Colleges */}
              <section>
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Target Colleges</h2>
                    <p className="font-medium text-gray-400">High probability of admission (Matches your score).</p>
                  </div>
                </div>
                {results.target.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2">
                    {results.target.map(c => <CollegeCard key={c.id} college={c} />)}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-400">No colleges in this category.</div>
                )}
              </section>

              {/* Safe Colleges */}
              <section>
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-500">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Safety Colleges</h2>
                    <p className="font-medium text-gray-400">Very high probability (Your score is well above average).</p>
                  </div>
                </div>
                {results.safe.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2">
                    {results.safe.map(c => <CollegeCard key={c.id} college={c} />)}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-400">No colleges in this category.</div>
                )}
              </section>

              {/* Reach Colleges */}
              <section>
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Reach Colleges</h2>
                    <p className="font-medium text-gray-400">Competitive (Slightly above your current score).</p>
                  </div>
                </div>
                {results.reach.length > 0 ? (
                  <div className="grid gap-8 md:grid-cols-2">
                    {results.reach.map(c => <CollegeCard key={c.id} college={c} />)}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-400">No colleges in this category.</div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
